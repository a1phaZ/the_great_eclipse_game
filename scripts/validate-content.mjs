// Проверка целостности контент-пака.
//
// Запуск:  npm run validate   (или node scripts/validate-content.mjs)
// Экспорт: validateContent() → { errors, warnings, stats }
//
// Валидатор читает настоящий config и реестр мира, поэтому не может разойтись
// с движком. Он не знает слов «чипы» или «трак» — только универсальные пути,
// таблицы, роутеры и правила.
import { pathToFileURL } from 'node:url';
import { config, registry } from '../tgcloud/lib/world.js';
import { createState } from '../tgcloud/lib/engine/state.js';
import { createScope, interpolate } from '../tgcloud/lib/engine/index.js';
import { parseExpression } from '../tgcloud/lib/engine/expression.js';
import { resolveLocalized } from '../tgcloud/lib/engine/i18n.js';

const ID_RE = /^[A-Za-z0-9_]+$/;
const PATH_RE = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)*$/;
const PLACEHOLDER_RE = /\{([^{}]+)\}/g;
const FLAG_READ_RE = /\bflags\.[A-Za-z0-9_.]+/g;
const FUNCTION_RE = /^([A-Za-z_][A-Za-z0-9_]*)\s*\(/;

const KNOWN_FUNCTIONS = new Set([
  'min', 'max', 'round', 'floor', 'ceil', 'abs', 'clamp',
  'hasItem', 'itemQty', 'inventorySummary', 'now',
]);

const SPECIAL_EFFECTS = new Set(['MAX', 'MIN', 'CLEAR', 'TOGGLE']);

// Ограничения Telegram.
const MAX_CAPTION = 1024;
const MAX_BUTTON_TEXT = 64;
const MAX_CALLBACK_BYTES = 64;

// Фиксированное время, чтобы валидатор был детерминированным.
const SAMPLE_NOW = Date.UTC(2026, 0, 1);

const SAMPLE_STATE = createState(config, config.defaultLocale);
const SAMPLE_SCOPE = createScope(SAMPLE_STATE, config, config.defaultLocale, () => SAMPLE_NOW);

function charLength(value) {
  return [...String(value)].length;
}

function byteLength(value) {
  return Buffer.byteLength(String(value), 'utf8');
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function pushTo(map, key, value) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function collectFlags(text, into, where = 'expression') {
  const source = String(text ?? '');
  for (const match of source.matchAll(FLAG_READ_RE)) {
    if (typeof into.add === 'function') into.add(match[0]);
    else pushTo(into, match[0], where);
  }
}

function forEachLocalized(value, callback) {
  if (typeof value === 'string') {
    callback(value, null);
    return;
  }
  if (isPlainObject(value)) {
    for (const [locale, text] of Object.entries(value)) {
      callback(text, locale);
    }
  }
}

function knownPath(path) {
  const parts = String(path).split('.');
  const [namespace, id, field] = parts;

  if (namespace === 'nav') return ['locationId', 'sceneId'].includes(id);
  if (namespace === 'meta') return ['version', 'locale'].includes(id);
  if (namespace === 'flags') return parts.length >= 2;
  if (namespace === 'resources') return Boolean(config.resources?.[id]);
  if (namespace === 'stats') return Boolean(config.stats?.[id]);
  if (namespace === 'vars') return Boolean(config.vars?.[id]);

  if (namespace === 'inventory') {
    const item = config.items?.[id];
    if (!item) return false;
    if (!field) return true;
    return field === 'qty' || Boolean(item.fields?.[field]);
  }

  return Object.prototype.hasOwnProperty.call(config.derived || {}, path);
}

export function validateContent() {
  const errors = [];
  const warnings = [];
  const stats = {
    locations: 0,
    scenes: 0,
    transitions: 0,
    reachableScenes: 0,
  };

  const addError = (where, message) => errors.push(`${where}: ${message}`);
  const addWarning = (where, message) => warnings.push(`${where}: ${message}`);

  const flagsReads = new Map();
  const flagsWrites = new Map();
  const destinationWrites = [];
  const sceneKeys = new Set();

  // ---------- Конфиг ----------
  const configWhere = `pack "${config.id || '?'}"`;

  if (typeof config.id !== 'string' || config.id.trim() === '') {
    addError(configWhere, 'пустой id контент-пака');
  }

  const locales = Array.isArray(config.locales) ? config.locales : [];
  if (locales.length === 0) {
    addError(configWhere, 'config.locales пуст — нечего выбирать');
  }
  if (!locales.includes(config.defaultLocale)) {
    addError(configWhere, `defaultLocale "${config.defaultLocale}" отсутствует в locales`);
  }

  if (typeof config.start !== 'string' || !/^[A-Za-z0-9_]+:[A-Za-z0-9_]+$/.test(config.start)) {
    addError(configWhere, `start "${config.start}" не в формате location:scene`);
  } else {
    const [locationId, sceneId] = config.start.split(':');
    if (!registry.hasScene(locationId, sceneId)) {
      addError(configWhere, `start "${config.start}" указывает на несуществующую сцену`);
    }
  }

  for (const [namespace, definitions] of [
    ['resources', config.resources],
    ['stats', config.stats],
    ['vars', config.vars],
  ]) {
    if (!isPlainObject(definitions)) {
      addError(configWhere, `${namespace} должен быть объектом`);
      continue;
    }

    for (const [id, definition] of Object.entries(definitions)) {
      if (!ID_RE.test(id)) addError(`${namespace}.${id}`, 'id должен состоять из латиницы, цифр и _');
      if (!isPlainObject(definition)) {
        addError(`${namespace}.${id}`, 'определение должно быть объектом');
        continue;
      }
      if (definition.initial !== undefined && typeof definition.initial !== 'number' && typeof definition.initial !== 'string') {
        addError(`${namespace}.${id}`, 'initial должен быть числом или строкой');
      }
      for (const limitName of ['min', 'max']) {
        const limit = definition[limitName];
        if (limit === undefined) continue;
        if (typeof limit === 'number') continue;
        if (typeof limit === 'string' && PATH_RE.test(limit)) continue;
        if (typeof limit === 'function') continue;
        addError(`${namespace}.${id}`, `${limitName} должен быть числом, путём или функцией`);
      }
    }
  }

  const derivedScope = createScope(SAMPLE_STATE, config, config.defaultLocale);
  for (const [name, definition] of Object.entries(config.derived || {})) {
    if (typeof definition === 'function') continue;
    if (typeof definition !== 'string') {
      addError(`derived.${name}`, 'должно быть строкой-выражением или функцией');
      continue;
    }
    try {
      parseExpression(definition);
      derivedScope.get(name);
    } catch (error) {
      addError(`derived.${name}`, `не вычисляется: ${error.message}`);
    }
  }

  for (const [itemId, item] of Object.entries(config.items || {})) {
    if (!ID_RE.test(itemId)) addError(`items.${itemId}`, 'id должен состоять из латиницы, цифр и _');
    if (!isPlainObject(item)) {
      addError(`items.${itemId}`, 'определение предмета должно быть объектом');
      continue;
    }
    if (!item.name) addError(`items.${itemId}`, 'нет name');
    if (item.maxQty !== undefined && (typeof item.maxQty !== 'number' || item.maxQty < 0)) {
      addError(`items.${itemId}`, 'maxQty должен быть неотрицательным числом');
    }
    for (const [field, definition] of Object.entries(item.fields || {})) {
      if (!ID_RE.test(field)) addError(`items.${itemId}.fields.${field}`, 'недопустимый id поля');
      if (!isPlainObject(definition)) {
        addError(`items.${itemId}.fields.${field}`, 'определение поля должно быть объектом');
      }
    }
  }

  for (const [factionId, faction] of Object.entries(config.factions || {})) {
    const where = `factions.${factionId}`;
    if (!ID_RE.test(factionId)) addError(where, 'id должен состоять из латиницы, цифр и _');
    if (!isPlainObject(faction)) {
      addError(where, 'определение фракции должно быть объектом');
      continue;
    }
    if (!faction.name) addError(where, 'нет name');
    if (typeof faction.repVar !== 'string' || !config.vars?.[faction.repVar]) {
      addError(where, `repVar "${faction.repVar}" не объявлена в config.vars`);
    }
    if (faction.rewardItem !== undefined
      && (typeof faction.rewardItem !== 'string' || !config.items?.[faction.rewardItem])) {
      addError(where, `rewardItem "${faction.rewardItem}" отсутствует в config.items`);
    }

    if (!Array.isArray(faction.ranks) || faction.ranks.length === 0) {
      addError(where, 'нет ranks — нечего выдавать за репутацию');
      continue;
    }
    faction.ranks.forEach((rank, index) => {
      const rankWhere = `${where}.ranks[${index}]`;
      if (!isPlainObject(rank)) {
        addError(rankWhere, 'ранг должен быть объектом');
        return;
      }
      if (typeof rank.rep !== 'number' || rank.rep < 0) {
        addError(rankWhere, 'rep должен быть неотрицательным числом');
      }
      if (!rank.title) addError(rankWhere, 'нет title');
      if (typeof rank.item !== 'string' || !config.items?.[rank.item]) {
        addError(rankWhere, `item "${rank.item}" отсутствует в config.items`);
      }
    });
  }

  if (config.settings !== undefined) {
    if (!isPlainObject(config.settings)) {
      addError(configWhere, 'settings должен быть объектом');
    } else if (config.settings.sideQuestCooldownMs !== undefined) {
      const cooldown = config.settings.sideQuestCooldownMs;
      if (typeof cooldown !== 'number' || !Number.isFinite(cooldown) || cooldown <= 0) {
        addError(configWhere, 'settings.sideQuestCooldownMs должен быть положительным числом');
      }
    }
  }

  // ---------- Локации и сцены ----------
  for (const [locationId, location] of registry.locations) {
    stats.locations += 1;
    const locWhere = `location "${locationId}"`;

    if (!ID_RE.test(locationId)) {
      addError(locWhere, 'locationId должен состоять из латиницы, цифр и _');
    }
    if (location.locationId !== locationId) {
      addError(locWhere, `locationId в объекте ("${location.locationId}") не совпадает с ключом реестра`);
    }
    if (!location.name) addError(locWhere, 'пустое имя локации');

    if (!isPlainObject(location.scenes) || Object.keys(location.scenes).length === 0) {
      addError(locWhere, 'нет ни одной сцены');
      continue;
    }

    for (const [sceneId, scene] of Object.entries(location.scenes)) {
      stats.scenes += 1;
      sceneKeys.add(`${locationId}:${sceneId}`);
      const where = `${locationId}:${sceneId}`;

      if (!ID_RE.test(sceneId)) {
        addError(where, 'sceneId должен состоять из латиницы, цифр и _');
      }
      if (!scene.text) {
        addError(where, 'пустой text сцены');
      }
      if (!scene.imageUrl) {
        addError(where, 'нет imageUrl');
      } else {
        forEachLocalized(scene.imageUrl, (url, locale) => {
          if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
            addError(where, `imageUrl${locale ? `[${locale}]` : ''} должен быть http(s)-ссылкой`);
          }
        });
      }

      if (!Array.isArray(scene.transitions) || scene.transitions.length === 0) {
        addError(where, 'нет ни одного перехода — игрок останется без кнопок');
        continue;
      }

      // Текст: плейсхолдеры и лимит caption для каждой локали.
      if (scene.text) {
        forEachLocalized(scene.text, (text, locale) => {
          if (typeof text !== 'string' || text.trim() === '') {
            addError(where, `пустой text${locale ? `[${locale}]` : ''}`);
            return;
          }
          validatePlaceholders(text, where, addError, flagsReads);
          const rendered = interpolate(resolveLocalized(scene.text, locale || config.defaultLocale, config.defaultLocale), SAMPLE_SCOPE);
          if (charLength(rendered) > MAX_CAPTION) {
            addError(where, `caption ${charLength(rendered)} символов (лимит ${MAX_CAPTION})`);
          }
        });
      }

      scene.transitions.forEach((transition, index) => {
        stats.transitions += 1;
        const trWhere = `${where} → transition[${index}]`;

        if (!isPlainObject(transition)) {
          addError(trWhere, 'переход должен быть объектом');
          return;
        }

        if (!transition.buttonText) {
          addError(trWhere, 'пустой buttonText');
        } else {
          forEachLocalized(transition.buttonText, (text, locale) => {
            if (typeof text !== 'string' || text.trim() === '') {
              addError(trWhere, `пустой buttonText${locale ? `[${locale}]` : ''}`);
              return;
            }
            validatePlaceholders(text, trWhere, addError, flagsReads);
            const rendered = interpolate(resolveLocalized(transition.buttonText, locale || config.defaultLocale, config.defaultLocale), SAMPLE_SCOPE);
            if (charLength(rendered) > MAX_BUTTON_TEXT) {
              addError(trWhere, `текст кнопки ${charLength(rendered)} символов (лимит ${MAX_BUTTON_TEXT})`);
            }
          });
        }

        const callbackData = `click:${locationId}:${sceneId}:${index}`;
        if (byteLength(callbackData) > MAX_CALLBACK_BYTES) {
          addError(trWhere, `callback_data ${byteLength(callbackData)} байт (лимит ${MAX_CALLBACK_BYTES})`);
        }

        validateTarget(transition.target, trWhere, addError);

        if (transition.condition !== undefined) {
          if (typeof transition.condition !== 'string' || transition.condition.trim() === '') {
            addError(trWhere, 'condition должен быть непустой строкой');
          } else {
            try {
              parseExpression(transition.condition);
            } catch (error) {
              addError(trWhere, `не разобрать условие: ${error.message}`);
            }
            collectFlags(transition.condition, flagsReads);
          }
        }

        if (transition.effects !== undefined) {
          if (!isPlainObject(transition.effects)) {
            addError(trWhere, 'effects должен быть объектом');
          } else {
            for (const [path, rawValue] of Object.entries(transition.effects)) {
              validateEffect(path, rawValue, trWhere, addError, flagsReads, flagsWrites, destinationWrites);
            }
          }
        }
      });
    }
  }

  // ---------- Таблицы и роутеры ----------
  for (const [tableName, table] of Object.entries(config.tables || {})) {
    const entries = Array.isArray(table) ? table : table.entries;
    const tableWhere = `table.${tableName}`;

    if (!Array.isArray(entries) || entries.length === 0) {
      addError(tableWhere, 'нет ни одной записи');
      continue;
    }

    entries.forEach((entry, index) => {
      const entryWhere = `${tableWhere}[${index}]`;
      if (!isPlainObject(entry)) {
        addError(entryWhere, 'запись должна быть объектом');
        return;
      }
      if (entry.weight !== undefined) {
        if (typeof entry.weight === 'number') {
          if (!(entry.weight > 0)) addError(entryWhere, 'weight должен быть больше нуля');
        } else if (typeof entry.weight === 'string') {
          try {
            parseExpression(entry.weight);
          } catch (error) {
            addError(entryWhere, `не разобрать weight: ${error.message}`);
          }
        } else {
          addError(entryWhere, 'weight должен быть числом или выражением');
        }
      }
      if (entry.condition !== undefined) {
        if (typeof entry.condition !== 'string') {
          addError(entryWhere, 'condition должен быть строкой');
        } else {
          try {
            parseExpression(entry.condition);
          } catch (error) {
            addError(entryWhere, `не разобрать condition: ${error.message}`);
          }
          collectFlags(entry.condition, flagsReads);
        }
      }
      validateTarget(entry.target, entryWhere, addError);
    });

    if (!Array.isArray(table) && table.fallback !== undefined) {
      validateTarget(table.fallback, tableWhere, addError);
    }
  }

  for (const [routerName, router] of Object.entries(config.routers || {})) {
    const routerWhere = `router.${routerName}`;

    if (typeof router === 'string') {
      validateTarget(router, routerWhere, addError);
      continue;
    }
    if (!isPlainObject(router)) {
      addError(routerWhere, 'роутер должен быть объектом или target-строкой');
      continue;
    }

    switch (router.type) {
      case 'table':
        if (!config.tables?.[router.table]) addError(routerWhere, `нет таблицы "${router.table}"`);
        break;
      case 'var':
        if (typeof router.path !== 'string' || !knownPath(router.path)) {
          addError(routerWhere, `неизвестный путь "${router.path}"`);
        }
        if (router.fallback !== undefined) validateTarget(router.fallback, routerWhere, addError);
        break;
      case 'function':
        if (typeof router.resolve !== 'function') addError(routerWhere, 'type function требует resolve()');
        break;
      default:
        addError(routerWhere, `неизвестный тип роутера "${router.type}"`);
    }
  }

  // ---------- Правила ----------
  const rules = config.rules || {};
  if (!rules.onDeath) {
    addWarning('rules', 'нет onDeath — смерть не будет обрабатываться');
  } else {
    if (typeof rules.onDeath.when !== 'string') {
      addError('rules.onDeath', 'when должен быть строкой');
    } else {
      try {
        parseExpression(rules.onDeath.when);
      } catch (error) {
        addError('rules.onDeath', `не разобрать when: ${error.message}`);
      }
      collectFlags(rules.onDeath.when, flagsReads);
    }
    validateTarget(rules.onDeath.target, 'rules.onDeath', addError);
    if (rules.onDeath.effects !== undefined) {
      if (!isPlainObject(rules.onDeath.effects)) {
        addError('rules.onDeath', 'effects должен быть объектом');
      } else {
        for (const [path, rawValue] of Object.entries(rules.onDeath.effects)) {
          validateEffect(path, rawValue, 'rules.onDeath', addError, flagsReads, flagsWrites, destinationWrites);
        }
      }
    }
  }

  if (!rules.onMissingScene) {
    addWarning('rules', 'нет onMissingScene — битый target уронит игрока в fallback-текст');
  } else {
    validateTarget(rules.onMissingScene.target, 'rules.onMissingScene', addError);
  }

  if (!config.strings?.help) {
    addError('strings', 'нет help — команда /help останется пустой');
  }

  // ---------- Флаги: читаются, но не пишутся ----------
  for (const [flag, places] of flagsReads) {
    let written = false;
    for (const write of flagsWrites.keys()) {
      if (write === flag || flag.startsWith(`${write}.`) || write.startsWith(`${flag}.`)) {
        written = true;
        break;
      }
    }
    if (!written) {
      addError(flag, `читается, но нигде не записывается (${places[0]})`);
    }
  }

  // ---------- Достижимость ----------
  const destinationValues = new Set();
  for (const { value, where } of destinationWrites) {
    const [targetLocation, targetScene] = String(value).split(':');
    if (!registry.hasScene(targetLocation, targetScene)) {
      addError(where, `vars.destination "${value}" не существует`);
    } else {
      destinationValues.add(value);
    }
  }

  const startScenes = new Set([config.start]);
  if (rules.onMissingScene?.target) startScenes.add(rules.onMissingScene.target);
  if (rules.onDeath?.target) startScenes.add(rules.onDeath.target);

  const reachable = new Set();
  const queue = [...startScenes].filter(Boolean).map((scene) => ({ scene, destinationSet: false }));

  while (queue.length > 0) {
    const node = queue.shift();
    const key = `${node.scene}|${node.destinationSet ? 1 : 0}`;
    if (reachable.has(key)) continue;
    reachable.add(key);

    const [locationId, sceneId] = String(node.scene).split(':');
    const scene = registry.getScene(locationId, sceneId);
    if (!scene) continue;

    for (const transition of scene.transitions || []) {
      if (!isPlainObject(transition)) continue;

      const setsDestination = isPlainObject(transition.effects)
        && Object.prototype.hasOwnProperty.call(transition.effects, 'vars.destination');
      const destinationSet = node.destinationSet || setsDestination;

      for (const expansion of expandTarget(transition.target, destinationValues)) {
        if (expansion.dependsOnDestination && !destinationSet) {
          addError(
            `${locationId}:${sceneId}`,
            `переход "${transition.target}" зависит от vars.destination, который ещё не задан — игрок попадёт в recovery`,
          );
        }
        if (expansion.scene) {
          queue.push({ scene: expansion.scene, destinationSet });
        }
      }
    }
  }

  const reachableScenes = new Set([...reachable].map((key) => key.split('|')[0]));
  stats.reachableScenes = reachableScenes.size;

  for (const sceneKey of sceneKeys) {
    if (!reachableScenes.has(sceneKey)) {
      addWarning(sceneKey, `сцена недостижима из ${config.start} / recovery`);
    }
  }

  return { errors, warnings, stats };
}

// ---------- Вспомогательные проверки ----------

function validatePlaceholders(value, where, addError, flagsReads) {
  const text = String(value ?? '');

  for (const match of text.matchAll(PLACEHOLDER_RE)) {
    const expression = match[1].trim();
    if (expression === '') {
      addError(where, 'пустой плейсхолдер {}');
      continue;
    }

    const functionMatch = expression.match(FUNCTION_RE);
    if (functionMatch && !KNOWN_FUNCTIONS.has(functionMatch[1])) {
      addError(where, `неизвестная функция "${functionMatch[1]}" в плейсхолдере`);
      continue;
    }

    if (PATH_RE.test(expression) && !functionMatch) {
      if (!knownPath(expression)) {
        addError(where, `неизвестный плейсхолдер {${expression}}`);
      }
      collectFlags(expression, flagsReads, where);
      continue;
    }

    try {
      parseExpression(expression);
    } catch (error) {
      addError(where, `не разобрать плейсхолдер {${expression}}: ${error.message}`);
      continue;
    }
    collectFlags(expression, flagsReads, where);
  }
}

function validateTarget(target, where, addError) {
  if (typeof target !== 'string' || target.trim() === '') {
    addError(where, 'пустой target');
    return;
  }

  const value = target.trim();

  if (value.startsWith('@router:')) {
    const name = value.slice('@router:'.length);
    if (!config.routers?.[name]) addError(where, `нет роутера "${name}"`);
    return;
  }
  if (value.startsWith('@table:')) {
    const name = value.slice('@table:'.length);
    if (!config.tables?.[name]) addError(where, `нет таблицы "${name}"`);
    return;
  }
  if (value.startsWith('@var:')) {
    const path = value.slice('@var:'.length);
    if (!knownPath(path)) addError(where, `неизвестный путь в target "${path}"`);
    return;
  }

  const parts = value.split(':');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    addError(where, `target "${value}" не в формате location:scene`);
    return;
  }
  if (!registry.hasScene(parts[0], parts[1])) {
    addError(where, `target "${value}" не существует`);
  }
}

function validateEffect(path, rawValue, where, addError, flagsReads, flagsWrites, destinationWrites) {
  if (typeof path !== 'string' || !PATH_RE.test(path)) {
    addError(where, `недопустимый путь эффекта "${path}"`);
    return;
  }

  const [namespace, id, field] = path.split('.');

  if (namespace === 'resources' || namespace === 'stats' || namespace === 'vars') {
    if (!id || !config[namespace]?.[id]) {
      addError(where, `неизвестный ${namespace} "${id}"`);
    }
  } else if (namespace === 'flags') {
    pushTo(flagsWrites, path, where);
  } else if (namespace === 'inventory') {
    const item = config.items?.[id];
    if (!item) {
      addError(where, `неизвестный предмет "${id}"`);
    } else if (field && field !== 'qty' && !item.fields?.[field]) {
      addError(where, `у предмета "${id}" нет поля "${field}"`);
    }
  } else {
    addError(where, `неизвестное пространство эффекта "${namespace}"`);
    return;
  }

  if (typeof rawValue !== 'string' && typeof rawValue !== 'number') {
    addError(where, `эффект "${path}" должен быть строкой или числом`);
    return;
  }

  const raw = String(rawValue).trim();
  if (SPECIAL_EFFECTS.has(raw)) return;

  let expression = raw;
  if (raw.startsWith('+') || raw.startsWith('-') || raw.startsWith('=')) {
    expression = raw.slice(1);
  }

  if (expression === '') {
    addError(where, `пустое значение эффекта "${path}"`);
    return;
  }

  let parsed = true;
  try {
    parseExpression(expression);
  } catch {
    parsed = false;
  }

  if (parsed) {
    collectFlags(expression, flagsReads);
    return;
  }

  // Не разобралось — значит строковый литерал. Числовые пространства его не терпят.
  if (namespace === 'resources' || namespace === 'stats') {
    addError(where, `эффект "${path}" не является числом: "${raw}"`);
    return;
  }

  if (path === 'vars.destination') {
    destinationWrites.push({ value: expression, where });
  }
}

// ---------- Статический разбор target для достижимости ----------

function expandTarget(target, destinationValues, depth = 0) {
  if (depth > 10 || typeof target !== 'string') return [];

  const value = target.trim();
  if (value === '') return [];

  if (value.startsWith('@router:')) {
    const router = config.routers?.[value.slice('@router:'.length)];
    if (!router) return [];
    if (typeof router === 'string') return expandTarget(router, destinationValues, depth + 1);
    if (router.type === 'table') return expandTable(router.table, destinationValues, depth + 1);
    if (router.type === 'var') return expandTarget(`@var:${router.path}`, destinationValues, depth + 1);
    return [];
  }

  if (value.startsWith('@table:')) {
    return expandTable(value.slice('@table:'.length), destinationValues, depth + 1);
  }

  if (value.startsWith('@var:')) {
    const path = value.slice('@var:'.length);
    if (path === 'vars.destination') {
      return [
        { scene: null, dependsOnDestination: true },
        ...[...destinationValues].map((scene) => ({ scene, dependsOnDestination: true })),
      ];
    }
    return [];
  }

  return [{ scene: value, dependsOnDestination: false }];
}

function expandTable(name, destinationValues, depth) {
  const table = config.tables?.[name];
  if (!table) return [];
  const entries = Array.isArray(table) ? table : table.entries || [];
  return entries.flatMap((entry) => expandTarget(entry.target, destinationValues, depth + 1));
}

// ---------- CLI ----------
const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const { errors, warnings, stats } = validateContent();

  console.log(`Локаций: ${stats.locations}, сцен: ${stats.scenes}, переходов: ${stats.transitions}, достижимо сцен: ${stats.reachableScenes}`);

  for (const warning of warnings) {
    console.warn(`⚠️  ${warning}`);
  }
  for (const error of errors) {
    console.error(`❌ ${error}`);
  }

  if (errors.length > 0) {
    console.error(`\nВалидация не пройдена: ${errors.length} ошибок, ${warnings.length} предупреждений.`);
    process.exitCode = 1;
  } else {
    console.log(`\n✅ Контент валиден (${warnings.length} предупреждений).`);
  }
}
