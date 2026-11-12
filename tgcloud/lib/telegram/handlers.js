import { api } from 'sdk';
import { buildKeyboard, parseCallbackData } from '../callback_data.js';
import { editScene, sendScene } from './send.js';
import { chooseLocale, resolveLocalized } from '../engine/i18n.js';
import { createSessionStore } from './persistence.js';

// Фабрики обработчиков Telegram.
//
// Они не знают про конкретный контент-пак: мир, хранилище и Telegram-клиент
// передаются снаружи. В проекте обработчики остаются тонкими файлами:
//   export default createMessageHandler(world);

export function createMessageHandler(world, deps = {}) {
  const store = deps.store ?? createSessionStore(world);
  const apiClient = deps.api ?? api;
  const keyboardBuilder = deps.buildKeyboard ?? buildKeyboard;
  const send = deps.sendScene ?? sendScene;

  return async function (message, ctx) {
    const text = message.text;
    if (text !== '/start' && text !== '/reset' && text !== '/help') return;

    const userId = message.from.id;
    const chatId = message.chat.id;
    const { config } = world;

    try {
      if (text === '/help') {
        const locale = chooseLocale(config, message.from.language_code);
        await apiClient.sendMessage({
          chat_id: chatId,
          text: resolveLocalized(config.strings.help, locale, config.defaultLocale),
          parse_mode: 'Markdown',
        });
        return;
      }

      const existing = await store.loadSession(userId);
      const locale = existing?.meta?.locale
        || chooseLocale(config, message.from.language_code);

      const state = text === '/reset'
        ? await store.resetSession(userId, locale)
        : existing || await store.createSession(userId, locale);

      if (!state) {
        await apiClient.sendMessage({
          chat_id: chatId,
          text: resolveLocalized(config.strings.genericError, locale, config.defaultLocale),
        });
        return;
      }

      const result = world.engine.processAction(state, { type: 'RENDER' });
      await store.saveSession(userId, result.nextSession);

      const keyboard = keyboardBuilder(
        result.nextSession.nav.locationId,
        result.nextSession.nav.sceneId,
        result.buttons,
      );

      const responseText = text === '/reset'
        ? `${resolveLocalized(config.strings.resetPrefix, locale, config.defaultLocale)}\n\n━━━━━━━━━━━━━━\n\n${result.responseText}`
        : result.responseText;

      await send(chatId, { ...result, responseText }, keyboard);
    } catch (error) {
      console.error(`[message] user ${userId}, text "${text}":`, error);
      await apiClient.sendMessage({
        chat_id: chatId,
        text: resolveLocalized(config.strings.genericError, config.defaultLocale, config.defaultLocale),
      }).catch(() => {});
    }
  };
}

export function createCallbackHandler(world, deps = {}) {
  const store = deps.store ?? createSessionStore(world);
  const apiClient = deps.api ?? api;
  const keyboardBuilder = deps.buildKeyboard ?? buildKeyboard;
  const edit = deps.editScene ?? editScene;

  return async function (callbackQuery) {
    const userId = callbackQuery.from.id;
    const callbackData = callbackQuery.data || '';

    if (!callbackData.startsWith('click:')) return;

    const action = parseCallbackData(callbackData);
    const { config } = world;

    try {
      const state = await store.loadSession(userId);

      if (!state) {
        await apiClient.answerCallbackQuery({
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
        ? { ...world.engine.processAction(state, { type: 'RENDER' }), stale: true }
        : world.engine.processAction(state, { type: 'CLICK', ...action });

      // Отвечаем сразу, чтобы у клиента не крутился спиннер. Если клик устарел
      // или переход больше не проходит условие — показываем короткий toast.
      const isStale = stale || result.stale === true;
      await apiClient.answerCallbackQuery({
        callback_query_id: callbackQuery.id,
        ...(isStale
          ? { text: resolveLocalized(config.strings.stale, locale, config.defaultLocale) }
          : {}),
      }).catch((error) => {
        console.error(`[callback] answer failed (user ${userId}):`, error?.description || error);
      });

      await store.saveSession(userId, result.nextSession);

      const keyboard = keyboardBuilder(
        result.nextSession.nav.locationId,
        result.nextSession.nav.sceneId,
        result.buttons,
      );

      await edit(callbackQuery, result, keyboard);
    } catch (error) {
      console.error(`[callback] user ${userId}, data "${callbackData}":`, error);
      await apiClient.answerCallbackQuery({
        callback_query_id: callbackQuery.id,
        text: resolveLocalized(config.strings.genericError, config.defaultLocale, config.defaultLocale),
      }).catch(() => {});
    }
  };
}
