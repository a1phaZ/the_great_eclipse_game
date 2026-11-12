// Контракт сценового движка.
//
// Здесь собраны соглашения, которые разделяют движок, валидатор и контент-паки:
// пространства состояния, ключевые слова эффектов, префиксы target'ов и
// значения по умолчанию для конфига. Модуль намеренно не импортирует ничего
// из проекта и платформы — его можно использовать и в рантайме, и в dev-тулах.

export const CORE_NAMESPACES = Object.freeze([
  'nav',
  'resources',
  'stats',
  'vars',
  'flags',
  'inventory',
  'meta',
]);

// Пространства, у которых отсутствующий путь читается как 0.
export const NUMERIC_NAMESPACES = Object.freeze(['resources', 'stats', 'vars']);

export const EFFECT_KEYWORDS = Object.freeze(['MAX', 'MIN', 'CLEAR', 'TOGGLE']);

export const TARGET_PREFIXES = Object.freeze({
  router: '@router:',
  table: '@table:',
  var: '@var:',
});

export const DEFAULT_LOCALE = 'ru';
export const DEFAULT_VERSION = 1;

export function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Объявленные в конфиге дополнительные пространства состояния.
// Форма: config.state.namespaces = { skills: { initial: {}, fields: {...} } }.
export function customNamespaces(config) {
  const namespaces = config?.state?.namespaces;
  return isPlainObject(namespaces) ? namespaces : {};
}

export function stateNamespaces(config) {
  return [...CORE_NAMESPACES, ...Object.keys(customNamespaces(config))];
}

export function getCustomNamespace(config, namespace) {
  return customNamespaces(config)[namespace];
}

function copyMap(value) {
  return isPlainObject(value) ? { ...value } : {};
}

// Возвращает нормализованную копию конфига, не мутируя исходный объект.
// Все необязательные секции становятся объектами, чтобы движку не приходилось
// постоянно писать `config.x || {}`. Неизвестные ключи сохраняются как есть —
// конфиг расширяемый, а контент-специфичные проверки живут в валидаторе.
export function normalizeConfig(config = {}) {
  const defaultLocale = config.defaultLocale || DEFAULT_LOCALE;
  const locales = Array.isArray(config.locales) && config.locales.length > 0
    ? [...config.locales]
    : [defaultLocale];

  return {
    ...config,
    version: config.version ?? DEFAULT_VERSION,
    defaultLocale,
    locales,
    start: typeof config.start === 'string' ? config.start : '',
    resources: copyMap(config.resources),
    stats: copyMap(config.stats),
    vars: copyMap(config.vars),
    derived: copyMap(config.derived),
    tables: copyMap(config.tables),
    routers: copyMap(config.routers),
    items: copyMap(config.items),
    strings: copyMap(config.strings),
    rules: copyMap(config.rules),
  };
}
