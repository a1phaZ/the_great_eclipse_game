import test from 'node:test';
import assert from 'node:assert/strict';

import { buildKeyboard, parseCallbackData } from '../tgcloud/lib/callback_data.js';

test('buildKeyboard кодирует локацию, сцену и исходный индекс перехода', () => {
  const keyboard = buildKeyboard('new_detroit', 'garage', [
    { text: 'Первый', transitionIndex: 0 },
    { text: 'Четвёртый', transitionIndex: 3 },
  ]);

  assert.equal(keyboard.inline_keyboard.length, 2);
  assert.equal(keyboard.inline_keyboard[0][0].text, 'Первый');
  assert.equal(keyboard.inline_keyboard[1][0].callback_data, 'click:new_detroit:garage:3');
});

test('buildKeyboard на пустом списке даёт пустую клавиатуру', () => {
  assert.deepEqual(buildKeyboard('a', 'b', []), { inline_keyboard: [] });
  assert.deepEqual(buildKeyboard('a', 'b', undefined), { inline_keyboard: [] });
});

test('parseCallbackData разбирает новый формат', () => {
  assert.deepEqual(parseCallbackData('click:new_detroit:garage:3'), {
    locationId: 'new_detroit',
    sceneId: 'garage',
    transitionIndex: 3,
    legacy: false,
  });
});

test('parseCallbackData помечает старый формат click:<idx> как legacy', () => {
  assert.deepEqual(parseCallbackData('click:2'), { legacy: true });
});

test('parseCallbackData не считает мусор legacy', () => {
  const parsed = parseCallbackData('click:foo');
  assert.equal(parsed.legacy, false);
  assert.equal(parsed.locationId, undefined);
});

test('callback_data укладывается в лимит Telegram (64 байта)', () => {
  // Самые длинные id в проекте: rusty_outpost + stage_3_clean.
  const keyboard = buildKeyboard('rusty_outpost', 'stage_3_clean', [
    { text: 'x', transitionIndex: 12 },
  ]);
  const data = keyboard.inline_keyboard[0][0].callback_data;

  assert.ok(Buffer.byteLength(data, 'utf8') <= 64, `${data} — ${Buffer.byteLength(data, 'utf8')} байт`);
});
