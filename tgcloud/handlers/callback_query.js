import { api } from 'sdk';
import { config, engine } from '../lib/world.js';
import { loadSession, saveSession } from '../lib/persistence.js';
import { buildKeyboard, parseCallbackData } from '../lib/callback_data.js';
import { editScene } from '../lib/telegram.js';
import { resolveLocalized } from '../lib/engine/i18n.js';

export default async function (callbackQuery) {
  const userId = callbackQuery.from.id;
  const callbackData = callbackQuery.data || '';

  if (!callbackData.startsWith('click:')) return;

  const action = parseCallbackData(callbackData);

  try {
    const state = await loadSession(userId);

    if (!state) {
      await api.answerCallbackQuery({
        callback_query_id: callbackQuery.id,
        text: resolveLocalized(config.strings.sessionNotFound, config.defaultLocale, config.defaultLocale),
      }).catch(() => {});
      return;
    }

    const locale = state.meta?.locale || config.defaultLocale;

    // Старый формат click:<idx> или кнопка из другого сообщения/сцены:
    // такой клик не применяем, а просто перерисовываем актуальный экран.
    const stale = action.legacy
      || !action.locationId
      || action.locationId !== state.nav.locationId
      || action.sceneId !== state.nav.sceneId;

    const result = stale
      ? { ...engine.processAction(state, { type: 'RENDER' }), stale: true }
      : engine.processAction(state, { type: 'CLICK', ...action });

    // Отвечаем сразу, чтобы у клиента не крутился спиннер. Если клик устарел
    // или переход больше не проходит условие — показываем короткий toast.
    const isStale = stale || result.stale === true;
    await api.answerCallbackQuery({
      callback_query_id: callbackQuery.id,
      ...(isStale ? { text: resolveLocalized(config.strings.stale, locale, config.defaultLocale) } : {}),
    }).catch((e) => {
      console.error(`[callback] answer failed (user ${userId}):`, e?.description || e);
    });

    await saveSession(userId, result.nextSession);

    const keyboard = buildKeyboard(
      result.nextSession.nav.locationId,
      result.nextSession.nav.sceneId,
      result.buttons,
    );

    await editScene(callbackQuery, result, keyboard);
  } catch (e) {
    console.error(`[callback] user ${userId}, data "${callbackData}":`, e);
    await api.answerCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: resolveLocalized(config.strings.genericError, config.defaultLocale, config.defaultLocale),
    }).catch(() => {});
  }
}
