import { createWorld } from './engine/create-world.js';
import { pack } from './content/index.js';

// Активный мир приложения. Собирается из выбранного контент-пака.
// Для другого пака достаточно поменять `content/index.js`.
export const world = createWorld(pack);

// Совместимость со старыми точками входа: обработчики и тесты импортируют
// config/registry/engine напрямую. Новый код может использовать `world`.
export const { config, registry, engine } = world;
