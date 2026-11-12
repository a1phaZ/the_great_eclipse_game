import { db } from 'sdk';
import { eq } from 'sdk/db';
import { sessions } from '../../schema.js';

// Хранилище состояния игрока, привязанное к конкретному миру.
// Таблица передаётся параметром, поэтому адаптер можно переиспользовать
// с другой схемой (например, в другом боте).
export function createSessionStore(world, { table = sessions } = {}) {
  async function loadSession(userId) {
    const row = await db.select()
      .from(table)
      .where(eq(table.userId, userId))
      .get();

    if (!row) return null;
    return world.mergeState(row.state);
  }

  async function createSession(userId, locale) {
    const state = world.createState(locale);

    // onConflictDoNothing закрывает гонку двух одновременных /start.
    await db.insert(table)
      .values({ userId, state })
      .onConflictDoNothing({ target: table.userId })
      .run();

    const row = await db.select()
      .from(table)
      .where(eq(table.userId, userId))
      .get();

    return row ? world.mergeState(row.state) : state;
  }

  async function resetSession(userId, locale) {
    await db.delete(table).where(eq(table.userId, userId)).run();
    return createSession(userId, locale);
  }

  async function saveSession(userId, state) {
    await db.update(table)
      .set({ state })
      .where(eq(table.userId, userId))
      .run();
  }

  return { loadSession, createSession, resetSession, saveSession };
}
