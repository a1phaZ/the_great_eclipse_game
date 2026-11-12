// Проверка целостности контент-пака.
//
// Модуль не знает про активный пак: `validateContent(pack, options)` принимает
// `{ config, registry }` или `{ config, locations }`. Контент-специфичные
// проверки подключаются через `pack.checks`.
//
// Запуск:  npm run validate   (CLI-обёртка в scripts/validate-content.mjs)
// Экспорт: validateContent(pack, options) → { errors, warnings, stats }
import { createState } from '../../tgcloud/lib/engine/state.js';
import { BUILTIN_FUNCTIONS, createScope, interpolate } from '../../tgcloud/lib/engine/index.js';
import { createRegistry } from '../../tgcloud/lib/engine/create-world.js';
import { parseExpression } from '../../tgcloud/lib/engine/expression.js';
import { resolveLocalized } from '../../tgcloud/lib/engine/i18n.js';
import { EFFECT_KEYWORDS, normalizeConfig } from '../../tgcloud/lib/engine/contract.js';

const ID_RE = /^[A-Za-z0-9_]+$/;
const PATH_RE = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)*$/;
const PLACEHOLDER_RE = /\{([^{}]+)\}/g;
const FLAG_READ_RE = /\bflags\.[A-Za-z0-9_.]+/g;
const FUNCTION_RE = /^([A-Za-z_][A-Za-z0-9_]*)\s*\(/;

const KNOWN_FUNCTIONS = new Set(Object.keys(BUILTIN_FUNCTIONS));

const SPECIAL_EFFECTS = new Set(EFFECT_KEYWORDS);

// Ограничения Telegram.
const MAX_CAPTION = 1024;
const MAX_BUTTON_TEXT = 64;
const MAX_CALLBACK_BYTES = 64;

// Фиксированное время, чтобы валидатор был детерминированным.
const SAMPLE_NOW = Date.UTC(2026, 0, 1);

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

function knownPath(ctx, path) {
  const { config } = ctx;
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

  const custom = config.state?.namespaces?.[namespace];
  if (custom) {
    if (!field) return true;
    return Boolean(custom.fields?.[field]);
  }

  return Object.prototype.hasOwnProperty.call(config.derived || {}, path);
}

function resolvePack(pack) {
  if (!pack || typeof pack !== 'object') {
    throw new Error('validateContent: пак обязателен');
  }

  if (pack.registry) {
    return { config: pack.config, registry: pack.registry };
  }

  if (pack.config && pack.locations) {
    return { config: pack.config, registry: createRegistry(pack.locations) };
  }

  throw new Error('validateContent: ожидается { config, registry } или { config, locations }');
}

function createValidatorContext(pack, options = {}) {
  const resolved = resolvePack(pack);
  const config = normalizeConfig(resolved.config);
  const registry = resolved.registry;
  const targetVars = options.navigationVars ?? config.navigationVars ?? [];
  const limits = {
    caption: MAX_CAPTION,
    buttonText: MAX_BUTTON_TEXT,
    callbackBytes: MAX_CALLBACK_BYTES,
    ...(options.limits || {}),
  };

  const sampleState = createState(config, config.defaultLocale);
  const sampleScope = createScope(
    sampleState,
    config,
    config.defaultLocale,
    () => options.sampleNow ?? SAMPLE_NOW,
  );

  return { config, registry, options, targetVars, limits, sampleState, sampleScope };
}

export function validateContent(pack, options = {}) {
  const ctx = createValidatorContext(pack, options);
  const { config, registry } = ctx;

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

  ctx.addError = addError;
  ctx.addWarning = addWarning;
  ctx.stats = stats;

  const flagsReads = new Map();
  const flagsWrites = new Map();
  const targetWrites = new Map();
  const sceneKeys = new Set();

  // ---------- Конфиг ----------
  const configWhere = `pack "${config.id || '?'}"`;

  if (typeof config.id !== 'string' || config.id.trim() === '') {
    addError(configWhere, 'пустой id контент-пака');
  }

  for (const path of ctx.targetVars) {
    const [namespace, id] = String(path).split('.');
    if (namespace !== 'vars' || !config.vars?.[id]) {
      addError('navigationVars', `переменная "${path}" не объявлена в config.vars`);
    } else if (config.vars[id].type !== 'string') {
      addError('navigationVars', `переменная "${path}" должна быть строкой`);
    }
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

  const derivedScope = createScope(ctx.sampleState, config, config.defaultLocale);
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
          validatePlaceholders(ctx, text, where, addError, flagsReads);
          const rendered = interpolate(resolveLocalized(scene.text, locale || config.defaultLocale, config.defaultLocale), ctx.sampleScope);
          if (charLength(rendered) > ctx.limits.caption) {
            addError(where, `caption ${charLength(rendered)} символов (лимит ${ctx.limits.caption})`);
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
            validatePlaceholders(ctx, text, trWhere, addError, flagsReads);
            const rendered = interpolate(resolveLocalized(transition.buttonText, locale || config.defaultLocale, config.defaultLocale), ctx.sampleScope);
            if (charLength(rendered) > ctx.limits.buttonText) {
              addError(trWhere, `текст кнопки ${charLength(rendered)} символов (лимит ${ctx.limits.buttonText})`);
            }
          });
        }

        const callbackData = `click:${locationId}:${sceneId}:${index}`;
        if (byteLength(callbackData) > ctx.limits.callbackBytes) {
          addError(trWhere, `callback_data ${byteLength(callbackData)} байт (лимит ${ctx.limits.callbackBytes})`);
        }

        validateTarget(ctx, transition.target, trWhere, addError);

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
              validateEffect(ctx, path, rawValue, trWhere, addError, flagsReads, flagsWrites, targetWrites);
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
      validateTarget(ctx, entry.target, entryWhere, addError);
    });

    if (!Array.isArray(table) && table.fallback !== undefined) {
      validateTarget(ctx, table.fallback, tableWhere, addError);
    }
  }

  for (const [routerName, router] of Object.entries(config.routers || {})) {
    const routerWhere = `router.${routerName}`;

    if (typeof router === 'string') {
      validateTarget(ctx, router, routerWhere, addError);
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
        if (typeof router.path !== 'string' || !knownPath(ctx, router.path)) {
          addError(routerWhere, `неизвестный путь "${router.path}"`);
        }
        if (router.fallback !== undefined) validateTarget(ctx, router.fallback, routerWhere, addError);
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
    if (options.requireDeathRule !== false) {
      addWarning('rules', 'нет onDeath — смерть не будет обрабатываться');
    }
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
    validateTarget(ctx, rules.onDeath.target, 'rules.onDeath', addError);
    if (rules.onDeath.effects !== undefined) {
      if (!isPlainObject(rules.onDeath.effects)) {
        addError('rules.onDeath', 'effects должен быть объектом');
      } else {
        for (const [path, rawValue] of Object.entries(rules.onDeath.effects)) {
          validateEffect(ctx, path, rawValue, 'rules.onDeath', addError, flagsReads, flagsWrites, targetWrites);
        }
      }
    }
  }

  if (!rules.onMissingScene) {
    if (options.requireMissingSceneRule !== false) {
      addWarning('rules', 'нет onMissingScene — битый target уронит игрока в fallback-текст');
    }
  } else {
    validateTarget(ctx, rules.onMissingScene.target, 'rules.onMissingScene', addError);
  }

  for (const key of options.requiredStrings ?? []) {
    if (!config.strings?.[key]) {
      addError('strings', `нет ${key}`);
    }
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
  // Навигационные переменные объявляются в config.navigationVars. Для каждой
  // собираем все записанные значения-сцены и проверяем их существование.
  const targetValues = new Map();
  for (const [path, writes] of targetWrites) {
    const values = new Set();
    for (const { value, where } of writes) {
      const [targetLocation, targetScene] = String(value).split(':');
      if (!registry.hasScene(targetLocation, targetScene)) {
        addError(where, `${path} "${value}" не существует`);
      } else {
        values.add(value);
      }
    }
    targetValues.set(path, values);
  }

  const startScenes = new Set([config.start]);
  if (rules.onMissingScene?.target) startScenes.add(rules.onMissingScene.target);
  if (rules.onDeath?.target) startScenes.add(rules.onDeath.target);

  const reachable = new Set();
  const queue = [...startScenes].filter(Boolean).map((scene) => ({
    scene,
    assigned: new Set(),
  }));

  while (queue.length > 0) {
    const node = queue.shift();
    const assignedKey = [...node.assigned].sort().join(',');
    const key = `${node.scene}|${assignedKey}`;
    if (reachable.has(key)) continue;
    reachable.add(key);

    const [locationId, sceneId] = String(node.scene).split(':');
    const scene = registry.getScene(locationId, sceneId);
    if (!scene) continue;

    for (const transition of scene.transitions || []) {
      if (!isPlainObject(transition)) continue;

      const assigned = new Set(node.assigned);
      if (isPlainObject(transition.effects)) {
        for (const path of ctx.targetVars) {
          if (Object.prototype.hasOwnProperty.call(transition.effects, path)) {
            assigned.add(path);
          }
        }
      }

      for (const expansion of expandTarget(ctx, transition.target, targetValues)) {
        if (expansion.dependsOn && !assigned.has(expansion.dependsOn)) {
          addError(
            `${locationId}:${sceneId}`,
            `переход "${transition.target}" зависит от ${expansion.dependsOn}, который ещё не задан — игрок попадёт в recovery`,
          );
        }
        if (expansion.scene) {
          queue.push({ scene: expansion.scene, assigned });
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

  for (const check of pack?.checks ?? []) {
    if (typeof check === 'function') check(ctx);
  }

  return { errors, warnings, stats };
}

// ---------- Вспомогательные проверки ----------

function validatePlaceholders(ctx, value, where, addError, flagsReads) {
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
      if (!knownPath(ctx, expression)) {
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

function validateTarget(ctx, target, where, addError) {
  const { config, registry } = ctx;

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
    if (!knownPath(ctx, path)) addError(where, `неизвестный путь в target "${path}"`);
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

function validateEffect(ctx, path, rawValue, where, addError, flagsReads, flagsWrites, targetWrites) {
  const { config } = ctx;

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
  } else if (config.state?.namespaces?.[namespace]) {
    const custom = config.state.namespaces[namespace];
    if (field && custom.fields && !custom.fields[field]) {
      addError(where, `у пространства "${namespace}" нет поля "${field}"`);
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

  if (ctx.targetVars.includes(path)) {
    if (!targetWrites.has(path)) targetWrites.set(path, []);
    targetWrites.get(path).push({ value: expression, where });
  }
}

// ---------- Статический разбор target для достижимости ----------

function expandTarget(ctx, target, targetValues, depth = 0) {
  const { config } = ctx;

  if (depth > 10 || typeof target !== 'string') return [];

  const value = target.trim();
  if (value === '') return [];

  if (value.startsWith('@router:')) {
    const router = config.routers?.[value.slice('@router:'.length)];
    if (!router) return [];
    if (typeof router === 'string') return expandTarget(ctx, router, targetValues, depth + 1);
    if (router.type === 'table') return expandTable(ctx, router.table, targetValues, depth + 1);
    if (router.type === 'var') {
      return expandTarget(ctx, `@var:${router.path}`, targetValues, depth + 1);
    }
    return [];
  }

  if (value.startsWith('@table:')) {
    return expandTable(ctx, value.slice('@table:'.length), targetValues, depth + 1);
  }

  if (value.startsWith('@var:')) {
    const path = value.slice('@var:'.length);
    if (ctx.targetVars.includes(path)) {
      const values = targetValues.get(path) ?? new Set();
      return [
        { scene: null, dependsOn: path },
        ...[...values].map((scene) => ({ scene, dependsOn: path })),
      ];
    }
    return [];
  }

  return [{ scene: value, dependsOn: null }];
}

function expandTable(ctx, name, targetValues, depth) {
  const table = ctx.config.tables?.[name];
  if (!table) return [];
  const entries = Array.isArray(table) ? table : table.entries || [];
  return entries.flatMap((entry) =>
    expandTarget(ctx, entry.target, targetValues, depth + 1));
}
