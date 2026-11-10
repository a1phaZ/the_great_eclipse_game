import { db } from 'sdk';
import { eq } from 'sdk/db';
import { sessions } from '../schema.js';
import { config } from './world.js';
import { createState, mergeDefaults } from './engine/state.js';

// Единственное место, где читается и пишется состояние игрока.
// Наружу отдаём уже нормализованный state: недостающие поля добавляются
// из конфига контент-пака.

export async function loadSession(userId) {
  const row = await db.select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .get();

  if (!row) return null;
  return mergeDefaults(config, row.state);
}

export async function createSession(userId, locale) {
  const state = createState(config, locale);

  // onConflictDoNothing закрывает гонку двух одновременных /start.
  await db.insert(sessions)
    .values({ userId, state })
    .onConflictDoNothing({ target: sessions.userId })
    .run();

  const row = await db.select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .get();

  return row ? mergeDefaults(config, row.state) : state;
}

export async function resetSession(userId, locale) {
  await db.delete(sessions).where(eq(sessions.userId, userId)).run();
  return createSession(userId, locale);
}

export async function saveSession(userId, state) {
  await db.update(sessions)
    .set({ state })
    .where(eq(sessions.userId, userId))
    .run();
}
