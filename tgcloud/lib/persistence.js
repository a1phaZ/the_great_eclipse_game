import { world } from './world.js';
import { createSessionStore } from './telegram/persistence.js';

// Совместимый shim: старые импорты `lib/persistence.js` продолжают работать.
// Новый код должен создавать хранилище через createSessionStore(world).
export const { loadSession, createSession, resetSession, saveSession } =
  createSessionStore(world);
