import { evaluateExpression, toNumber, truthy } from './expression.js';
import { resolveLocalized } from './i18n.js';
import {
  applyEffect,
  cloneState,
  formatSceneKey,
  getValue,
  inventorySummary,
  parseSceneKey,
} from './state.js';

// Универсальный сценовый движок.
//
// Движок не знает ни одного слова из конкретного сеттинга: ресурсы, статы,
// формулы, события, смерть и восстановление приходят из config контент-пака.
// Всё, что делает движок, — читает состояние, проверяет условия, применяет
// эффекты, резолвит target и рендерит сцену.

export class WorldRegistry {
  constructor() {
    this.locations = new Map();
  }

  registerLocation(locationId, data) {
    this.locations.set(locationId, { ...data, locationId });
  }

  getLocation(locationId) {
    return this.locations.get(locationId);
  }

  getScene(locationId, sceneId) {
    return this.locations.get(locationId)?.scenes?.[sceneId];
  }

  hasScene(locationId, sceneId) {
    return Boolean(this.getScene(locationId, sceneId));
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function localeOf(state, config) {
  return state?.meta?.locale || config.defaultLocale || 'ru';
}

function localized(value, state, config) {
  return resolveLocalized(value, localeOf(state, config), config.defaultLocale);
}

// Scope — мост между выражениями и состоянием.
// get(name) умеет и пути (resources.chips), и derived-значения (repair_cost_full).
// now — источник времени для кулдаунов; в тестах его подменяют фиксированной датой.
export function createScope(state, config, locale, now = Date.now) {
  const derivedCache = new Map();
  const resolving = new Set();

  const scope = {
    get(name) {
      const derived = config.derived || {};
      if (Object.prototype.hasOwnProperty.call(derived, name)) {
        if (derivedCache.has(name)) return derivedCache.get(name);
        if (resolving.has(name)) {
          throw new Error(`Циклическая зависимость derived "${name}"`);
        }

        resolving.add(name);
        try {
          const definition = derived[name];
          const value = typeof definition === 'function'
            ? definition(state, config, scope)
            : evaluateExpression(definition, scope);
          derivedCache.set(name, value);
          return value;
        } finally {
          resolving.delete(name);
        }
      }

      return getValue(state, name);
    },

    call(name, args) {
      switch (name) {
        case 'min': return Math.min(...args.map(toNumber));
        case 'max': return Math.max(...args.map(toNumber));
        case 'round': return Math.round(toNumber(args[0]));
        case 'floor': return Math.floor(toNumber(args[0]));
        case 'ceil': return Math.ceil(toNumber(args[0]));
        case 'abs': return Math.abs(toNumber(args[0]));
        case 'clamp': {
          const value = toNumber(args[0]);
          const min = toNumber(args[1]);
          const max = toNumber(args[2]);
          return Math.min(Math.max(value, min), max);
        }
        case 'hasItem':
          return (Number(getValue(state, `inventory.${args[0]}.qty`)) || 0) > 0;
        case 'itemQty':
          return Number(getValue(state, `inventory.${args[0]}.qty`)) || 0;
        case 'inventorySummary':
          return inventorySummary(state, config, locale);
        case 'now':
          return typeof now === 'function' ? now() : Number(now);
        default:
          throw new Error(`Неизвестная функция "${name}"`);
      }
    },
  };

  return scope;
}

export function evaluateCondition(condition, scope) {
  if (condition === undefined || condition === null) return true;
  const source = String(condition).trim();
  if (source === '') return true;

  try {
    return truthy(evaluateExpression(source, scope));
  } catch {
    return false;
  }
}

// Подставляет {выражение} в текст. Если выражение не разбирается, оставляем
// исходный плейсхолдер: так битый контент виден, но не роняет весь экран.
export function interpolate(value, scope) {
  const text = String(value ?? '');
  return text.replace(/\{([^{}]+)\}/g, (whole, expression) => {
    try {
      const result = evaluateExpression(expression, scope);
      return result === undefined ? whole : String(result);
    } catch {
      return whole;
    }
  });
}

function splitTarget(target) {
  if (typeof target !== 'string') return null;
  const parts = target.trim().split(':');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return { locationId: parts[0], sceneId: parts[1] };
}

function resolveWeight(weight, scope) {
  if (typeof weight === 'number') return Number.isFinite(weight) ? weight : 0;

  try {
    const value = toNumber(evaluateExpression(String(weight), scope));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function pickWeighted(entries, scope, random) {
  const weighted = entries
    .map((entry) => ({ entry, weight: resolveWeight(entry.weight ?? 1, scope) }))
    .filter(({ weight }) => weight > 0);

  if (weighted.length === 0) return null;

  const total = weighted.reduce((sum, { weight }) => sum + weight, 0);
  let roll = random() * total;

  for (const { entry, weight } of weighted) {
    roll -= weight;
    if (roll < 0) return entry;
  }

  return weighted[weighted.length - 1].entry;
}

export function resolveTable(name, state, config, scope, random, depth = 0) {
  if (depth > 10) return null;

  const table = config.tables?.[name];
  if (!table) return null;

  const entries = Array.isArray(table) ? table : table.entries;
  if (!Array.isArray(entries) || entries.length === 0) return null;

  const available = entries.filter((entry) => evaluateCondition(entry.condition, scope));
  const picked = pickWeighted(available, scope, random);
  if (!picked) {
    return table.fallback
      ? resolveTarget(table.fallback, state, config, scope, random, depth + 1)
      : null;
  }

  return resolveTarget(picked.target, state, config, scope, random, depth + 1);
}

export function resolveRouter(name, state, config, scope, random, depth = 0) {
  if (depth > 10) return null;

  const router = config.routers?.[name];
  if (!router) return null;

  if (typeof router === 'string') {
    return resolveTarget(router, state, config, scope, random, depth + 1);
  }

  switch (router.type) {
    case 'table':
      return resolveTable(router.table, state, config, scope, random, depth + 1);

    case 'var': {
      const value = getValue(state, router.path);
      if (typeof value === 'string' && value.includes(':')) return value.trim();
      return router.fallback ?? null;
    }

    case 'function': {
      const value = router.resolve({ state, config, scope, random });
      return typeof value === 'string' ? value.trim() : null;
    }

    default:
      return null;
  }
}

export function resolveTarget(target, state, config, scope, random = Math.random, depth = 0) {
  if (depth > 10 || typeof target !== 'string') return null;

  const value = target.trim();
  if (value === '') return null;

  if (value.startsWith('@router:')) {
    return resolveRouter(value.slice('@router:'.length), state, config, scope, random, depth + 1);
  }
  if (value.startsWith('@table:')) {
    return resolveTable(value.slice('@table:'.length), state, config, scope, random, depth + 1);
  }
  if (value.startsWith('@var:')) {
    const resolved = getValue(state, value.slice('@var:'.length));
    return typeof resolved === 'string' && resolved.trim() !== '' ? resolved.trim() : null;
  }

  return value;
}

export class GameEngine {
  constructor(config, registry, options = {}) {
    this.config = config;
    this.registry = registry;
    this.random = options.random || Math.random;
    const now = options.now ?? Date.now;
    this.now = typeof now === 'function' ? now : () => now;
  }

  createScope(state) {
    return createScope(state, this.config, localeOf(state, this.config), this.now);
  }

  processAction(state, action = {}) {
    try {
      const next = cloneState(state);

      if (!isPlainObject(next.nav) || !next.nav.locationId) {
        next.nav = parseSceneKey(this.config.start);
      }

      if (this.isDead(next)) return this.handleDeath(next);

      if (!this.registry.hasScene(next.nav.locationId, next.nav.sceneId)) {
        return this.recover(next);
      }

      if (action.type === 'CLICK') {
        const { nav } = next;
        if (!action.locationId || !action.sceneId
          || action.locationId !== nav.locationId
          || action.sceneId !== nav.sceneId) {
          return { ...this.render(next), stale: true };
        }
        return this.handleClick(next, action.transitionIndex);
      }

      return this.render(next);
    } catch (error) {
      console.error(`[engine] ${error?.stack || error}`);
      return this.recover(state);
    }
  }

  isDead(state) {
    const rule = this.config.rules?.onDeath;
    if (!rule?.when) return false;

    const scope = this.createScope(state);
    return evaluateCondition(rule.when, scope);
  }

  moveTo(state, target) {
    const parsed = splitTarget(target);
    if (parsed && this.registry.hasScene(parsed.locationId, parsed.sceneId)) {
      state.nav = parsed;
      return true;
    }
    return false;
  }

  handleClick(state, transitionIndex) {
    const scene = this.registry.getScene(state.nav.locationId, state.nav.sceneId);
    if (!scene) {
      console.error(`[engine] Сцена не найдена: ${formatSceneKey(state.nav.locationId, state.nav.sceneId)}`);
      return this.recover(state);
    }

    const transition = scene.transitions?.[transitionIndex];
    const scope = this.createScope(state);

    // Кнопка могла устареть: переход исчез или условие перестало проходить.
    if (!transition || !evaluateCondition(transition.condition, scope)) {
      return { ...this.render(state), stale: true };
    }

    if (isPlainObject(transition.effects)) {
      for (const [path, rawValue] of Object.entries(transition.effects)) {
        applyEffect(state, this.config, path, rawValue, scope);
      }
    }

    if (this.isDead(state)) return this.handleDeath(state);

    const target = resolveTarget(transition.target, state, this.config, scope, this.random);
    if (target && this.moveTo(state, target)) {
      return this.render(state);
    }

    console.error(`[engine] Битый переход: "${transition.target}" из ${formatSceneKey(state.nav.locationId, state.nav.sceneId)}`);
    return this.recover(state, transition.target);
  }

  handleDeath(state) {
    const rule = this.config.rules?.onDeath;
    if (!rule) return this.recover(state);

    const scope = this.createScope(state);

    if (isPlainObject(rule.effects)) {
      for (const [path, rawValue] of Object.entries(rule.effects)) {
        applyEffect(state, this.config, path, rawValue, scope);
      }
    }

    if (rule.target && !this.moveTo(state, rule.target)) {
      return this.recover(state, rule.target);
    }

    const result = this.render(state);
    const alert = interpolate(localized(rule.text, state, this.config), this.createScope(state));

    return {
      ...result,
      responseText: alert ? `${alert}\n\n━━━━━━━━━━━━━━\n\n${result.responseText}` : result.responseText,
      imageUrl: rule.imageUrl || result.imageUrl,
    };
  }

  recover(state, brokenTarget) {
    const next = isPlainObject(state) ? cloneState(state) : cloneState(this.createEmptyState());

    if (!isPlainObject(next.nav) || !next.nav.locationId) {
      next.nav = parseSceneKey(this.config.start);
    }

    const rule = this.config.rules?.onMissingScene || {};
    const recoveryTarget = rule.target || this.config.start;

    if (brokenTarget) {
      console.error(`[engine] Аварийное восстановление после target "${brokenTarget}"`);
    }

    if (!this.moveTo(next, recoveryTarget)) {
      this.moveTo(next, this.config.start);
    }

    const result = this.render(next);
    if (!rule.text) return result;

    const alert = interpolate(localized(rule.text, next, this.config), this.createScope(next));
    return alert
      ? { ...result, responseText: `${alert}\n\n━━━━━━━━━━━━━━\n\n${result.responseText}` }
      : result;
  }

  createEmptyState() {
    return {
      nav: parseSceneKey(this.config.start),
      resources: {},
      stats: {},
      vars: {},
      flags: {},
      inventory: {},
      meta: {
        version: this.config.version ?? 1,
        locale: this.config.defaultLocale || 'ru',
      },
    };
  }

  render(state) {
    const scene = this.registry.getScene(state.nav.locationId, state.nav.sceneId);
    if (!scene) {
      console.error(`[engine] Сцена не найдена: ${formatSceneKey(state.nav.locationId, state.nav.sceneId)}`);
      return this.renderFallback(state);
    }
    return this.renderSceneData(state, scene);
  }

  renderSceneData(state, scene) {
    const scope = this.createScope(state);
    const responseText = interpolate(localized(scene.text, state, this.config), scope);
    const imageUrl = localized(scene.imageUrl, state, this.config);

    const buttons = [];
    (scene.transitions || []).forEach((transition, transitionIndex) => {
      if (!evaluateCondition(transition.condition, scope)) return;
      buttons.push({
        text: interpolate(localized(transition.buttonText, state, this.config), scope),
        transitionIndex,
      });
    });

    return { nextSession: state, responseText, imageUrl, buttons };
  }

  renderFallback(state) {
    return {
      nextSession: state,
      responseText: localized(this.config.strings?.missingScene, state, this.config)
        || '⚠️ Сцена не найдена. Отправьте /start.',
      imageUrl: localized(this.config.strings?.fallbackImage, state, this.config)
        || 'https://unsplash.com',
      buttons: [],
    };
  }
}

export { formatSceneKey, parseSceneKey };
