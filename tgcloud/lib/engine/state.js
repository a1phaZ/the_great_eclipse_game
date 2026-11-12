import { evaluateExpression, toNumber, truthy } from './expression.js';
import { chooseLocale, resolveLocalized } from './i18n.js';
import {
  CORE_NAMESPACES,
  DEFAULT_LOCALE,
  DEFAULT_VERSION,
  NUMERIC_NAMESPACES,
  customNamespaces,
  getCustomNamespace,
  isPlainObject,
} from './contract.js';

// Работа с универсальным JSON-состоянием.
//
// Состояние не знает про трак или чипы. Оно состоит из пространств:
//   nav        — текущая сцена (служебное)
//   resources  — валюты/расходники
//   stats      — характеристики
//   vars       — произвольные значения
//   flags      — квестовые/сюжетные флаги
//   inventory  — предметы: { itemId: { qty, ...fields } }
//   meta       — версия и язык

export function parseSceneKey(key) {
  if (typeof key !== 'string' || !key.includes(':')) {
    return { locationId: '', sceneId: '' };
  }
  const [locationId, sceneId] = key.split(':');
  return { locationId, sceneId };
}

export function formatSceneKey(locationId, sceneId) {
  return `${locationId}:${sceneId}`;
}

export function cloneState(state) {
  return JSON.parse(JSON.stringify(state ?? {}));
}

function cloneInitial(value, fallback) {
  if (value === undefined) return fallback;
  return JSON.parse(JSON.stringify(value));
}

export function createState(config, locale) {
  const state = {
    nav: parseSceneKey(config.start),
    resources: {},
    stats: {},
    vars: {},
    flags: {},
    inventory: {},
    meta: {
      version: config.version ?? DEFAULT_VERSION,
      locale: chooseLocale(config, locale),
    },
  };

  for (const [id, definition] of Object.entries(config.resources || {})) {
    state.resources[id] = definition.initial ?? 0;
  }
  for (const [id, definition] of Object.entries(config.stats || {})) {
    state.stats[id] = definition.initial ?? 0;
  }
  for (const [id, definition] of Object.entries(config.vars || {})) {
    state.vars[id] = definition.initial ?? (definition.type === 'string' ? '' : 0);
  }
  for (const [namespace, definition] of Object.entries(customNamespaces(config))) {
    state[namespace] = cloneInitial(definition?.initial, {});
  }

  return state;
}

export function mergeDefaults(config, savedState) {
  const state = isPlainObject(savedState) ? cloneState(savedState) : {};

  state.nav = isPlainObject(state.nav) && state.nav.locationId
    ? state.nav
    : parseSceneKey(config.start);

  for (const namespace of CORE_NAMESPACES) {
    if (namespace === 'nav' || namespace === 'meta') continue;
    if (!isPlainObject(state[namespace])) state[namespace] = {};
  }

  for (const [namespace, definition] of Object.entries(customNamespaces(config))) {
    if (state[namespace] === undefined) {
      state[namespace] = cloneInitial(definition?.initial, {});
    }
  }

  state.meta = isPlainObject(state.meta) ? state.meta : {};
  state.meta.version = state.meta.version ?? config.version ?? DEFAULT_VERSION;
  state.meta.locale = chooseLocale(config, state.meta.locale);

  for (const [id, definition] of Object.entries(config.resources || {})) {
    if (state.resources[id] === undefined) state.resources[id] = definition.initial ?? 0;
  }
  for (const [id, definition] of Object.entries(config.stats || {})) {
    if (state.stats[id] === undefined) state.stats[id] = definition.initial ?? 0;
  }
  for (const [id, definition] of Object.entries(config.vars || {})) {
    if (state.vars[id] === undefined) {
      state.vars[id] = definition.initial ?? (definition.type === 'string' ? '' : 0);
    }
  }

  return state;
}

export function getPath(object, path) {
  const parts = String(path).split('.');
  let current = object;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

export function setPath(object, path, value) {
  const parts = String(path).split('.');
  let current = object;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    if (!isPlainObject(current[part])) current[part] = {};
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
  return object;
}

export function deletePath(object, path) {
  const parts = String(path).split('.');
  let current = object;

  for (let i = 0; i < parts.length - 1; i += 1) {
    current = current?.[parts[i]];
    if (!current || typeof current !== 'object') return object;
  }

  if (current && typeof current === 'object') {
    delete current[parts[parts.length - 1]];
  }
  return object;
}

// Значение по пути с безопасными дефолтами для отсутствующих полей.
// config нужен только для значений по умолчанию кастомных namespace.
export function getValue(state, path, config) {
  const value = getPath(state, path);
  if (value !== undefined) return value;

  const namespace = String(path).split('.')[0];
  const hasField = String(path).includes('.');

  if (hasField && namespace === 'flags') return 0;
  if (namespace === 'inventory' && path.endsWith('.qty')) return 0;
  if (hasField && NUMERIC_NAMESPACES.includes(namespace)) return 0;

  const custom = getCustomNamespace(config, namespace);
  if (custom && custom.default !== undefined) return custom.default;

  return undefined;
}

function resolveLimit(limit, state, config) {
  if (limit === undefined || limit === null) return undefined;
  if (typeof limit === 'number') return limit;
  if (typeof limit === 'function') return limit(state, config);
  if (typeof limit === 'string') {
    const value = getPath(state, limit);
    return value === undefined ? undefined : Number(value);
  }
  return undefined;
}

function findDefinition(config, path) {
  const [namespace, id, field] = String(path).split('.');
  if (!id) return undefined;

  if (namespace === 'resources') return config.resources?.[id];
  if (namespace === 'stats') return config.stats?.[id];
  if (namespace === 'vars') return config.vars?.[id];

  if (namespace === 'inventory') {
    const item = config.items?.[id];
    if (!item) return undefined;
    if (!field || field === 'qty') return { min: 0, max: item.maxQty };
    return item.fields?.[field];
  }

  const custom = getCustomNamespace(config, namespace);
  if (custom) {
    if (!field) return custom;
    return custom.fields?.[field];
  }

  return undefined;
}

// При первом изменении предмета создаём его объект и поля с initial-значениями.
// Иначе `inventory.sword.durability: "-25"` вычитало бы из нуля.
function ensureInventoryDefaults(state, config, path) {
  const parts = String(path).split('.');
  if (parts[0] !== 'inventory' || !parts[1]) return;

  const item = config.items?.[parts[1]];
  if (!item) return;

  if (!isPlainObject(state.inventory)) state.inventory = {};
  if (!isPlainObject(state.inventory[parts[1]])) state.inventory[parts[1]] = {};

  const entry = state.inventory[parts[1]];
  if (entry.qty === undefined) entry.qty = 0;

  for (const [field, definition] of Object.entries(item.fields || {})) {
    if (entry[field] === undefined) entry[field] = definition.initial ?? 0;
  }
}

export function applyCaps(state, config, path, value) {
  const definition = findDefinition(config, path);
  if (!definition) return value;

  if (typeof value !== 'number' || Number.isNaN(value)) return value;

  let result = value;
  const min = resolveLimit(definition.min, state, config);
  const max = resolveLimit(definition.max, state, config);

  if (min !== undefined && Number.isFinite(min)) result = Math.max(min, result);
  if (max !== undefined && Number.isFinite(max)) result = Math.min(max, result);

  return result;
}

function getMax(state, config, path) {
  const definition = findDefinition(config, path);
  if (!definition) return undefined;
  return resolveLimit(definition.max, state, config);
}

function getMin(state, config, path) {
  const definition = findDefinition(config, path);
  if (!definition) return undefined;
  return resolveLimit(definition.min, state, config);
}

// Применяет эффект к state.
//
// Форматы значения:
//   "MAX" | "MIN" | "CLEAR" | "TOGGLE"
//   "+N"  — прибавить
//   "-N"  — вычесть
//   "=N"  — установить
//   "N" / выражение — установить
//
// Если выражение не разбирается, значение считается строковым литералом
// (удобно для vars.target = "location:scene").
export function applyEffect(state, config, path, rawValue, scope) {
  const raw = String(rawValue ?? '').trim();
  if (raw === '') return state;

  ensureInventoryDefaults(state, config, path);

  if (raw === 'CLEAR') {
    deletePath(state, path);
    return state;
  }

  if (raw === 'TOGGLE') {
    setPath(state, path, truthy(getValue(state, path, config)) ? 0 : 1);
    return state;
  }

  if (raw === 'MAX') {
    const max = getMax(state, config, path);
    if (max !== undefined && Number.isFinite(max)) {
      setPath(state, path, applyCaps(state, config, path, max));
    }
    return state;
  }

  if (raw === 'MIN') {
    const min = getMin(state, config, path);
    if (min !== undefined && Number.isFinite(min)) {
      setPath(state, path, applyCaps(state, config, path, min));
    }
    return state;
  }

  let operation = 'set';
  let expression = raw;

  if (raw.startsWith('+')) {
    operation = 'add';
    expression = raw.slice(1);
  } else if (raw.startsWith('-')) {
    operation = 'sub';
    expression = raw.slice(1);
  } else if (raw.startsWith('=')) {
    operation = 'set';
    expression = raw.slice(1);
  }

  let value;
  try {
    value = evaluateExpression(expression, scope);
  } catch {
    value = expression; // строковый литерал
  }

  if (operation === 'add' || operation === 'sub') {
    const current = toNumber(getValue(state, path, config));
    const amount = toNumber(value);
    if (Number.isNaN(current) || Number.isNaN(amount)) return state;
    const next = operation === 'add' ? current + amount : current - amount;
    setPath(state, path, applyCaps(state, config, path, next));
    return state;
  }

  setPath(state, path, applyCaps(state, config, path, value));
  return state;
}

// Текстовая сводка инвентаря для сцен: {inventorySummary()}.
export function inventorySummary(state, config, locale) {
  const defaultLocale = config.defaultLocale || DEFAULT_LOCALE;
  const items = config.items || {};
  const lines = [];

  for (const [id, item] of Object.entries(items)) {
    const quantity = Number(getValue(state, `inventory.${id}.qty`, config) || 0);
    if (!quantity) continue;

    const name = resolveLocalized(item.name, locale, defaultLocale);
    let line = `• ${name} ×${quantity}`;

    const extras = [];
    for (const [field, definition] of Object.entries(item.fields || {})) {
      const value = Number(getValue(state, `inventory.${id}.${field}`, config));
      if (!Number.isFinite(value)) continue;
      const label = resolveLocalized(definition.label || field, locale, defaultLocale);
      const max = resolveLimit(definition.max, state, config);
      extras.push(max !== undefined ? `${label} ${value}/${max}` : `${label} ${value}`);
    }

    if (extras.length > 0) line += ` (${extras.join(', ')})`;
    lines.push(line);
  }

  if (lines.length === 0) {
    return resolveLocalized(config.strings?.emptyInventory, locale, defaultLocale) || '';
  }

  const title = resolveLocalized(config.strings?.inventoryTitle, locale, defaultLocale) || '🎒';
  return [title, ...lines].join('\n');
}
