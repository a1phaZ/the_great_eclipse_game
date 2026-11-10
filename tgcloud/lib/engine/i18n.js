// Локализация контент-паков.
//
// Текстовые поля могут быть:
//   строкой        — одинаково для всех языков (удобно при постепенном переводе);
//   объектом       — { ru: '...', en: '...' }.
//
// Разрешение: нужная локаль → язык по умолчанию → первый доступный ключ.

export function normalizeLocale(code) {
  if (!code || typeof code !== 'string') return '';
  return code.trim().toLowerCase().split(/[-_]/)[0];
}

export function chooseLocale(config, requested) {
  const supported = (config?.locales || []).map(normalizeLocale).filter(Boolean);
  const normalized = normalizeLocale(requested);

  if (normalized && supported.includes(normalized)) return normalized;

  const fallback = normalizeLocale(config?.defaultLocale);
  if (fallback && supported.includes(fallback)) return fallback;

  return supported[0] || fallback || 'ru';
}

export function resolveLocalized(value, locale, defaultLocale) {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (typeof value === 'object') {
    const normalizedLocale = normalizeLocale(locale);
    const normalizedDefault = normalizeLocale(defaultLocale);

    if (normalizedLocale && value[normalizedLocale] !== undefined) {
      return String(value[normalizedLocale]);
    }
    if (normalizedDefault && value[normalizedDefault] !== undefined) {
      return String(value[normalizedDefault]);
    }

    const keys = Object.keys(value);
    return keys.length > 0 ? String(value[keys[0]]) : '';
  }

  return String(value);
}
