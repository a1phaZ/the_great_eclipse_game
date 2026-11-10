// Кодирование/разбор callback_data. Чистый модуль без SDK — тестируется в Node.
//
// Формат: click:<locationId>:<sceneId>:<transitionIndex>
// transitionIndex — индекс в НЕфильтрованном scene.transitions, поэтому
// изменение набора доступных кнопок не сдвигает индексы.
// Telegram ограничивает callback_data 64 байтами; текущие id короткие.
const PREFIX = 'click';
const DATA_RE = /^click:([A-Za-z0-9_]+):([A-Za-z0-9_]+):(\d+)$/;
const LEGACY_RE = /^click:\d+$/;

export function buildKeyboard(locationId, sceneId, buttons) {
  const list = buttons || [];

  return {
    inline_keyboard: list.map(({ text, transitionIndex }) => [{
      text,
      callback_data: `${PREFIX}:${locationId}:${sceneId}:${transitionIndex}`,
    }]),
  };
}

// Возвращает { locationId, sceneId, transitionIndex, legacy } либо { legacy }.
// Старый формат click:<idx> помечается legacy: true — такой клик не применяем.
export function parseCallbackData(data) {
  const value = String(data || '');
  const match = DATA_RE.exec(value);

  if (match) {
    return {
      locationId: match[1],
      sceneId: match[2],
      transitionIndex: Number(match[3]),
      legacy: false,
    };
  }

  return { legacy: LEGACY_RE.test(value) };
}
