import { GameEngine, WorldRegistry } from './engine/index.js';
import { pack } from './content/index.js';

// Единый реестр мира собирается из активного контент-пака.
// Раньше локации импортировались вручную в двух местах, из-за чего event_loot
// был забыт в callback-обработчике. Теперь реестр один для всех точек входа.
export const registry = new WorldRegistry();
for (const location of pack.locations) {
  registry.registerLocation(location.locationId, location);
}

export const config = pack.config;
export const engine = new GameEngine(config, registry);
