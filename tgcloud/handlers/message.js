import { api } from 'sdk';
import { config, engine } from '../lib/world.js';
import {
  createSession,
  loadSession,
  resetSession,
  saveSession,
} from '../lib/persistence.js';
import { buildKeyboard } from '../lib/callback_data.js';
import { sendScene } from '../lib/telegram.js';
import { chooseLocale, resolveLocalized } from '../lib/engine/i18n.js';

export default async function (message, ctx) {
  const text = message.text;
  if (text !== '/start' && text !== '/reset' && text !== '/help') return;

  const userId = message.from.id;
  const chatId = message.chat.id;

  try {
    if (text === '/help') {
      const locale = chooseLocale(config, message.from.language_code);
      await api.sendMessage({
        chat_id: chatId,
        text: resolveLocalized(config.strings.help, locale, config.defaultLocale),
        parse_mode: 'Markdown',
      });
      return;
    }

    const existing = await loadSession(userId);
    const locale = existing?.meta?.locale || chooseLocale(config, message.from.language_code);

    const state = text === '/reset'
      ? await resetSession(userId, locale)
      : existing || await createSession(userId, locale);

    if (!state) {
      await api.sendMessage({
        chat_id: chatId,
        text: resolveLocalized(config.strings.genericError, locale, config.defaultLocale),
      });
      return;
    }

    const result = engine.processAction(state, { type: 'RENDER' });
    await saveSession(userId, result.nextSession);

    const keyboard = buildKeyboard(
      result.nextSession.nav.locationId,
      result.nextSession.nav.sceneId,
      result.buttons,
    );

    const responseText = text === '/reset'
      ? `${resolveLocalized(config.strings.resetPrefix, locale, config.defaultLocale)}\n\n━━━━━━━━━━━━━━\n\n${result.responseText}`
      : result.responseText;

    await sendScene(chatId, { ...result, responseText }, keyboard);
  } catch (e) {
    console.error(`[message] user ${userId}, text "${text}":`, e);
    await api.sendMessage({
      chat_id: chatId,
      text: resolveLocalized(config.strings.genericError, config.defaultLocale, config.defaultLocale),
    }).catch(() => {});
  }
}
