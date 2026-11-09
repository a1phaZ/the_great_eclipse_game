export class FormulaEvaluator {
  static generateContext(session) {
    const { truck, chips, diesel, maxDiesel, questParams = {} } = session;
    
    // --- Расчет починки ---
    const missingHp = Math.max(0, truck.maxHp - truck.hp);
    const pricePerHp = Math.max(1, Math.floor((truck.baseCost * 0.05) / 100) * truck.level);
    const repairCostFull = missingHp * pricePerHp;

    // --- ⛽ НОВЫЙ РАСЧЕТ ДИНАМИЧЕСКОЙ ЗАПРАВКИ ---
    const fuelMissing = Math.max(0, maxDiesel - diesel);
    // Стоимость 1 литра растет вместе с уровнем трака (базово 2 чипа * уровень)
    const fuelPricePerLiter = 1 * truck.level;
    const fuelCostFull = fuelMissing * fuelPricePerLiter;

    const context = {
      'truck.model_name': truck.modelName,
      'truck.level': String(truck.level),
      'truck.hp': String(truck.hp),
      'truck.max_hp': String(truck.maxHp),
      'repair_price_per_hp': String(pricePerHp),
      'repair_cost_full': String(repairCostFull),
      'user.chips': String(chips),
      'user.diesel': String(diesel),
      'user.max_diesel': String(maxDiesel),
      'fuel_missing': String(fuelMissing),
      'fuel_price_per_liter': String(fuelPricePerLiter),
      'fuel_cost_full': String(fuelCostFull),
      'stat_luck': String(session.statEvasion),
      'stat_evasion': String(session.statLuck)
    };

    // 🎒 АВТОМАТИЧЕСКАЯ ИНЪЕКЦИЯ ЛЮБЫХ ПЕРЕМЕННЫХ КВЕСТА
    // Если в questParams лежит { noise: 1 }, в контекст добавится 'quest.noise': '1'
    if (questParams && typeof questParams === 'object') {
      for (const [key, value] of Object.entries(questParams)) {
        context[`quest.${key}`] = String(value);
      }
    }

    return context;
  }

  /**
   * Безопасный калькулятор арифметических выражений без eval()
   * Умеет считать выражения вида: "-1 * 5", "10 + 2 * 3", "100 / 2"
   */
  static evaluateMath(expr) {
    // Оставляем только цифры, знаки операций, точки и скобки
    const clean = expr.replace(/\s+/g, '');
    if (!/^[-+*/().0-9]+$/.test(clean)) return expr; // Если это обычный текст, не трогаем

    try {
      // Парсер методом рекурсивного спуска (безопасный стандарт для V8)
      let pos = 0;
      const parseExpr = () => {
        let val = parseTerm();
        while (clean[pos] === '+' || clean[pos] === '-') {
          const op = clean[pos++];
          const right = parseTerm();
          val = op === '+' ? val + right : val - right;
        }
        return val;
      };
      const parseTerm = () => {
        let val = parseFactor();
        while (clean[pos] === '*' || clean[pos] === '/') {
          const op = clean[pos++];
          const right = parseFactor();
          val = op === '*' ? val * right : (right !== 0 ? Math.floor(val / right) : 0);
        }
        return val;
      };
      const parseFactor = () => {
        if (clean[pos] === '+') { pos++; return parseFactor(); }
        if (clean[pos] === '-') { pos++; return -parseFactor(); }
        if (clean[pos] === '(') {
          pos++;
          const val = parseExpr();
          pos++; // пропускаем ')'
          return val;
        }
        const start = pos;
        while ((clean[pos] >= '0' && clean[pos] <= '9') || clean[pos] === '.') pos++;
        return Number(clean.slice(start, pos));
      };

      const result = parseExpr();
      return pos === clean.length && !Number.isNaN(result) ? String(result) : expr;
    } catch {
      return expr;
    }
  }

  static injectContext(rawString, context) {
    // 1. Сначала подставляем все переменные из контекста
    const substituted = rawString.replace(/\{([a-zA-Z0-9_.]+)\}/g, (_, key) => {
      if (context[key] !== undefined) return context[key];
      if (key.startsWith('quest.')) return '0';
      return `{${key}}`;
    });

    // 2. Если строка является формулой (или содержит блок [[формула]]), вычисляем её!
    // Поддерживаем два формата:
    // А) Вся строка — математика (используется в effects, например: "-{quest.battery_dead} * 5")
    if (/^[-+*/().0-9\s]+$/.test(substituted)) {
      return this.evaluateMath(substituted);
    }

    // Б) Формула внутри текста сцены или кнопки, обернутая в [[ ... ]]
    // Например: "Штраф за АКБ: [[{quest.battery_dead} * 5]] л."
    return substituted.replace(/\[\[([^\]]+)\]\]/g, (_, mathExpr) => {
      return this.evaluateMath(mathExpr);
    });
  }

  static evaluateCondition(conditionStr, context) {
    if (!conditionStr || conditionStr.trim() === '') return true;

    // Разбиваем строку на левую часть, оператор сравнения и правую часть
    // Теперь правая и левая части могут быть любыми формулами!
    const match = conditionStr.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    if (!match) return false;

    const [, leftExpr, operator, rightExpr] = match;

    // Вспомогательная функция: подставляет переменные (с фигурными скобками и без) и считает математику
    const resolveSide = (expr) => {
      let trimmed = expr.trim();
      
      // Поддержка старого синтаксиса без скобок, например "user.chips" -> "{user.chips}"
      if (context[trimmed] !== undefined) {
        trimmed = `{${trimmed}}`;
      } else if (trimmed.startsWith('quest.') && !trimmed.includes(' ')) {
        trimmed = `{${trimmed}}`;
      }

      // injectContext заменит {переменные} на числа и прогонит через evaluateMath!
      const evaluated = this.injectContext(trimmed, context);
      return Number(evaluated);
    };

    const leftVal = resolveSide(leftExpr);
    const rightVal = resolveSide(rightExpr);

    if (Number.isNaN(leftVal) || Number.isNaN(rightVal)) return false;

    switch (operator) {
      case '==': return leftVal === rightVal;
      case '!=': return leftVal !== rightVal;
      case '>=': return leftVal >= rightVal;
      case '<=': return leftVal <= rightVal;
      case '>':  return leftVal > rightVal;
      case '<':  return leftVal < rightVal;
      default: return false;
    }
  }
}

export class WorldRegistry {
  constructor() { this.locations = new Map(); }
  registerLocation(locationId, data) { this.locations.set(locationId, data); }
  getScene(locationId, sceneId) { return this.locations.get(locationId)?.scenes?.[sceneId]; }
}

export class GlobalGameStateMachine {
  constructor(registry) { this.registry = registry; }

  processPlayerAction(session, action) {
    try {
      if (session.truck.hp <= 0) {
        return this.handlePlayerDeath(session);
      }
      if (action.type === 'RENDER_CURRENT') {
        return this.renderScene(session);
      }
      return this.handleLocationState(session, action.targetIndex);
    } catch (e) {
      // Защита: вывод ошибки в консоль Telegram Serverless, чтобы видеть баги
      console.error("Критический сбой в автомате мира:", e);
      return this.renderScene(session);
    }
  }

  handlePlayerDeath(session) {
    const updatedSession = {
      ...session,
      currentState: 'IN_LOCATION_SCENE',
      currentLocationId: 'new_detroit',
      currentSceneId: 'market_repair',
    };
    updatedSession.truck.hp = 1; // Возрождаем с 1 HP для ремонта

    const deathAlert = `🚨 **ТРАК КРИТИЧЕСКИ РАЗБИТ!**\n\nОбшивка разрушена. Дроны-утилизаторы эвакуировали остатки машины в мастерскую Ганса.\n\n━━━━━━━━━━━━━━\n\n`;
    const sceneResult = this.renderScene(updatedSession);

    return {
      ...sceneResult,
      responseText: deathAlert + sceneResult.responseText,
      imageUrl: 'https://unsplash.com'
    };
  }

  handleLocationState(session, transitionIndex) {
    const currentScene = this.registry.getScene(session.currentLocationId, session.currentSceneId);
    const context = FormulaEvaluator.generateContext(session);
    
    const availableTransitions = currentScene.transitions.filter(t => !t.condition || FormulaEvaluator.evaluateCondition(t.condition, context));
    const transition = availableTransitions[transitionIndex];

    if (!transition) return this.renderScene(session);

    let updatedSession = { ...session, truck: { ...session.truck } };

    // 1. Сначала жестко накатываем эффекты переходов
    if (transition.effects) {
      for (const [key, rawOperation] of Object.entries(transition.effects)) {
        const operation = FormulaEvaluator.injectContext(rawOperation, context);
        
        if (key === 'user.chips') {
          if (operation.startsWith('-')) updatedSession.chips -= Number(operation.slice(1));
          else if (operation.startsWith('+')) updatedSession.chips += Number(operation.slice(1));
          else updatedSession.chips = Number(operation);
        } 
        else if (key === 'truck.hp') {
          if (operation === 'MAX') updatedSession.truck.hp = updatedSession.truck.maxHp;
          else if (operation.startsWith('-')) updatedSession.truck.hp = Math.max(0, updatedSession.truck.hp - Number(operation.slice(1)));
          else if (operation.startsWith('+')) updatedSession.truck.hp = Math.min(updatedSession.truck.maxHp, updatedSession.truck.hp + Number(operation.slice(1)));
        } 
        else if (key === 'user.diesel') {
          if (operation === 'MAX') updatedSession.diesel = updatedSession.maxDiesel;
          else if (operation.startsWith('-')) updatedSession.diesel = Math.max(0, updatedSession.diesel - Number(operation.slice(1)));
          else if (operation.startsWith('+')) updatedSession.diesel = Math.min(updatedSession.maxDiesel, updatedSession.diesel + Number(operation.slice(1)));
        }
        // 🛠️ МГНОВЕННОЕ СОХРАНЕНИЕ ЦЕЛИ В СЕССИЮ (Решает баг асинхронности БД)
        else if (key === 'user.destination_target') {
          updatedSession.destinationTarget = operation;
        }
         // --- 🎒 2. УНИВЕРСАЛЬНАЯ ДИНАМИЧЕСКАЯ ЗАПИСЬ ПЕРЕМЕННЫХ КВЕСТА ---
        else if (key.startsWith('quest.')) {
          const questKey = key.replace('quest.', '');
          
          if (!updatedSession.questParams || typeof updatedSession.questParams !== 'object') {
            updatedSession.questParams = {};
          }
          
          if (questKey === 'CLEAR') {
            updatedSession.questParams = {}; // Очищаем блокнот по завершении квеста
          } else {
            // Записываем любое число или флаг прямо в JSON-блокнот
            updatedSession.questParams[questKey] = Number(operation);
          }
        }
      }
    }

    // 2. Маршрутизация экранов (Строгая изоляция триггеров)
    let target = transition.target;

    if (target === 'SYSTEM_ROLL_ENCOUNTER') {
      const roll = Math.floor(Math.random() * 100) + 1;
      
      // 📻 1. БРОСАЕМ КУБИК НА РАДИОЭФИР (Шанс 40%)
      const radioChance = 40;
      
      if (roll <= radioChance) {
        target = "event_radio:catch_signal"; // Включаем радиоперехват
      } else {
        // 🎲 2. ЕСЛИ В ЭФИРЕ ТИШИНА — СРАБАТЫВАЮТ СТАРЫЕ СОБЫТИЯ ТРАКТА
        const secondaryRoll = Math.floor(Math.random() * 100) + 1;
        const ambushChance = Math.max(10, 45 - (updatedSession.statEvasion - 15));
        const lootChance = Math.min(40, 15 + updatedSession.statLuck * 2);
        
        if (secondaryRoll <= ambushChance) {
          target = "event_ambush:stage_1";
        } else if (secondaryRoll <= ambushChance + lootChance) {
          target = "event_loot:stage_1";
        } else {
          target = updatedSession.destinationTarget;
        }
      }
    } 
    else if (target === 'DESTINATION') {
      target = updatedSession.destinationTarget;
    }

    // Применяем финальные координаты локации
    if (transition.nextState === 'IN_LOCATION_SCENE' || target.includes(':')) {
      const [locationId, sceneId] = target.split(':');
      updatedSession.currentLocationId = locationId;
      updatedSession.currentSceneId = sceneId;
    }

    if (updatedSession.truck.hp <= 0) {
      return this.handlePlayerDeath(updatedSession);
    }

    return this.renderScene(updatedSession);
  }

  renderScene(session) {
    const scene = this.registry.getScene(session.currentLocationId, session.currentSceneId);
    const context = FormulaEvaluator.generateContext(session);
    const responseText = FormulaEvaluator.injectContext(scene.text, context);

    const buttons = [];
    scene.transitions.forEach(t => {
      if (!t.condition || FormulaEvaluator.evaluateCondition(t.condition, context)) {
        buttons.push(FormulaEvaluator.injectContext(t.buttonText, context));
      }
    });

    return { nextSession: session, responseText, imageUrl: scene.imageUrl, buttons };
  }
}
