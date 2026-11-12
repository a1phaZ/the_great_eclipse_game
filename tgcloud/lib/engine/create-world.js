// Сборка мира из контент-пака.
//
// createWorld — единственная точка, где движок соединяется с конкретным
// контентом. Приложение может создать сколько угодно миров (например, в
// тестах), а движок при этом остаётся чистым и не знает про активный пак.

import { GameEngine, WorldRegistry } from './index.js';
import { createState, mergeDefaults } from './state.js';
import { normalizeConfig } from './contract.js';

function normalizeLocations(locations) {
  if (Array.isArray(locations)) return locations;

  if (locations && typeof locations === 'object') {
    return Object.entries(locations).map(([locationId, data]) => ({
      ...data,
      locationId,
    }));
  }

  return [];
}

export function createRegistry(locations = [], { strict = false } = {}) {
  const registry = new WorldRegistry();

  for (const location of normalizeLocations(locations)) {
    if (!location || typeof location !== 'object') {
      if (strict) throw new Error('createRegistry: локация должна быть объектом');
      continue;
    }

    const { locationId } = location;
    if (typeof locationId !== 'string' || locationId === '') {
      if (strict) throw new Error('createRegistry: у локации нет locationId');
      continue;
    }

    if (strict && registry.getLocation(locationId)) {
      throw new Error(`createRegistry: дубликат локации "${locationId}"`);
    }

    registry.registerLocation(locationId, location);
  }

  return registry;
}

export function createWorld(pack, options = {}) {
  if (!pack || typeof pack !== 'object' || !pack.config) {
    throw new Error('createWorld: pack.config обязателен');
  }

  const config = normalizeConfig(pack.config);
  const registry = createRegistry(pack.locations, options);
  const engine = new GameEngine(config, registry, options);

  return {
    config,
    registry,
    engine,
    createState: (locale) => createState(config, locale),
    mergeState: (savedState) => mergeDefaults(config, savedState),
  };
}
