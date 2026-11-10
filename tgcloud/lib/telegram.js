import { api } from 'sdk';

// Telegram-вызовы с безопасными фолбэками: игрок не должен оставаться
// без ответа из-за битого URL картинки или ошибки Markdown-разметки.

export function isNotModified(error) {
  return /is not modified/i.test(error?.description || error?.message || '');
}

function errorText(error) {
  return error?.description || error?.message || String(error);
}

// Первое сообщение сцены: фото, при сбое — текст, при сбое разметки — plain.
export async function sendScene(chatId, result, keyboard) {
  const base = { chat_id: chatId };
  // Новому сообщению пустая клавиатура не нужна.
  if (keyboard && keyboard.inline_keyboard.length > 0) base.reply_markup = keyboard;

  try {
    await api.sendPhoto({
      ...base,
      photo: result.imageUrl,
      caption: result.responseText,
      parse_mode: 'Markdown',
    });
    return;
  } catch (e) {
    console.error('[telegram] sendPhoto failed:', errorText(e));
  }

  try {
    await api.sendMessage({ ...base, text: result.responseText, parse_mode: 'Markdown' });
  } catch (e) {
    console.error('[telegram] sendMessage (Markdown) failed:', errorText(e));
    await api.sendMessage({ ...base, text: result.responseText });
  }
}

// Обновление уже отправленного экрана. Перебираем способы, пока один не сработает:
// фото-сообщение (editMessageMedia) → та же картинка/битый URL (editMessageCaption)
// → текстовое сообщение после fallback (editMessageText).
export async function editScene(callbackQuery, result, keyboard) {
  const base = {
    chat_id: callbackQuery.message.chat.id,
    message_id: callbackQuery.message.message_id,
  };
  // Пустая клавиатура здесь важна: она стирает кнопки прошлого экрана.
  if (keyboard) base.reply_markup = keyboard;

  try {
    await api.editMessageMedia({
      ...base,
      media: {
        type: 'photo',
        media: result.imageUrl,
        caption: result.responseText,
        parse_mode: 'Markdown',
      },
    });
    return;
  } catch (e) {
    if (isNotModified(e)) return;
    console.error('[telegram] editMessageMedia failed:', errorText(e));
  }

  try {
    await api.editMessageCaption({ ...base, caption: result.responseText, parse_mode: 'Markdown' });
    return;
  } catch (e) {
    if (isNotModified(e)) return;
    console.error('[telegram] editMessageCaption (Markdown) failed:', errorText(e));
  }

  try {
    await api.editMessageText({ ...base, text: result.responseText, parse_mode: 'Markdown' });
    return;
  } catch (e) {
    if (isNotModified(e)) return;
    console.error('[telegram] editMessageText (Markdown) failed:', errorText(e));
  }

  try {
    await api.editMessageText({ ...base, text: result.responseText });
  } catch (e) {
    if (!isNotModified(e)) {
      console.error('[telegram] editMessageText (plain) failed:', errorText(e));
    }
  }
}
