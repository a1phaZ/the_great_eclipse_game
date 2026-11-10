// Совместимость: раньше здесь собиралась плоская сессия из колонок БД.
// Теперь состояние живёт в lib/engine/state.js, а язык определяет i18n.
export { chooseLocale as detectLocale } from './engine/i18n.js';
