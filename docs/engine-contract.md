# Контракт сценового движка

Движок (`tgcloud/lib/engine/`) — переносимый слой: он не импортирует `sdk`,
контент-паки и приложение. Всё игровое описывается контент-паком, а сборка
мира выполняется через `createWorld(pack)`.

## Слои

| Слой | Где | Зависимости |
|---|---|---|
| Движок | `tgcloud/lib/engine/` | только сам себя и `contract.js` |
| Контент | `tgcloud/lib/content/<id>/` | `config.js`, локации, опциональные проверки |
| Сборка мира | `tgcloud/lib/engine/create-world.js` | движок + пак |
| Telegram-адаптер | `tgcloud/lib/telegram/` | `sdk`, схема БД, движок |
| Валидатор | `scripts/lib/content-validator.mjs` | движок, пак (dev-only) |

`tgcloud/lib/world.js` — точка сборки активного мира. Она оставлена shim'ом:
`config`, `registry`, `engine` продолжают экспортироваться для старых импортов.

## Форма пака

```js
export const pack = {
  config,
  locations, // массив локаций или { [locationId]: location }
  checks,    // опционально: плагины валидатора
  validation: {
    requiredStrings: ['help'], // опционально
  },
};
```

Локация:

```js
{
  locationId: 'village',
  name: 'Деревня',
  scenes: {
    square: {
      text: 'Текст сцены с {resources.gold}',
      imageUrl: 'https://example.com/square.png',
      transitions: [
        {
          buttonText: 'Пойти в лес',
          condition: 'resources.gold >= 5',
          effects: { 'resources.gold': '-5', 'flags.forest': '1' },
          target: 'forest:edge',
        },
      ],
    },
  },
}
```

## Конфиг

Движок читает:

- `start` — `location:scene`;
- `version`, `defaultLocale`, `locales`;
- `resources`, `stats`, `vars` — определения с `initial`, `min`, `max`;
- `derived` — формулы или функции `(state, config, scope) => value`;
- `tables`, `routers` — случайные и условные переходы;
- `rules.onDeath`, `rules.onMissingScene`;
- `items` — предметы и их поля;
- `strings` — служебные тексты (`help`, `genericError`, `missingScene`, …);
- `navigationVars` — необязательный список переменных, хранящих target-сцену.

Конфиг расширяемый: `factions`, `settings` и любые другие ключи движок
игнорирует. Их проверяют плагины валидатора конкретного пака.

## Состояние

```js
{
  nav: { locationId, sceneId },
  resources: {},
  stats: {},
  vars: {},
  flags: {},
  inventory: { itemId: { qty, ...fields } },
  meta: { version, locale },
}
```

Дополнительные пространства можно объявить (опционально):

```js
config.state = {
  namespaces: {
    skills: {
      initial: {},
      default: 0,
      fields: { lockpick: { min: 0, max: 100 } },
    },
  },
};
```

Они инициализируются в `createState`, поддерживаются в `mergeDefaults`,
`getValue`, эффектах и валидаторе. Для большинства игр достаточно `vars`,
`flags` и `inventory`.

## Эффекты

```js
effects: {
  'resources.gold': '+5',   // прибавить
  'resources.hp': '-10',    // вычесть
  'vars.mood': '=happy',    // установить
  'flags.quest': '1',       // установить
  'resources.hp': 'MAX',    // поднять до max
  'resources.hp': 'MIN',    // опустить до min
  'flags.quest': 'CLEAR',   // удалить
  'flags.quest': 'TOGGLE',  // 0 ↔ 1
}
```

Числовые пространства (`resources`, `stats`) не принимают строковые литералы.
`vars` принимает строки — так задаются навигационные переменные.

## Target'ы

| Форма | Значение |
|---|---|
| `location:scene` | конкретная сцена |
| `@table:name` | случайная запись таблицы |
| `@router:name` | роутер (`table`, `var`, `function`) |
| `@var:vars.path` | сцена из строковой переменной |

## Встроенные функции

`min`, `max`, `round`, `floor`, `ceil`, `abs`, `clamp`, `hasItem`, `itemQty`,
`inventorySummary`, `now`.

Единый источник — `BUILTIN_FUNCTIONS` в `tgcloud/lib/engine/index.js`.
Валидатор строит список известных функций из него же.

## Сборка мира

```js
import { createWorld } from './engine/create-world.js';
import { pack } from './content/index.js';

const world = createWorld(pack, {
  random: Math.random, // можно подменить в тестах
  now: Date.now,       // можно зафиксировать
  strict: false,       // true — падать на дубликатах локаций
});

world.config;      // нормализованный конфиг
world.registry;    // WorldRegistry
world.engine;      // GameEngine
world.createState(locale);
world.mergeState(savedState);
```

## Валидатор

```js
import { validateContent } from '../scripts/lib/content-validator.mjs';

const { errors, warnings, stats } = validateContent(pack, {
  navigationVars: pack.config.navigationVars,
  requiredStrings: ['help'],
  limits: { caption: 1024, buttonText: 64, callbackBytes: 64 },
});
```

Пак может добавить свои проверки:

```js
// tgcloud/lib/content/<id>/validate.js
export const checks = [
  ({ config, addError }) => {
    if (!config.factions) addError('factions', 'нет фракций');
  },
];
```

Валидатор dev-only: он лежит в `scripts/` и не деплоится вместе с ботом.

## Новый пак за пять шагов

1. Создайте `tgcloud/lib/content/<id>/config.js`.
2. Добавьте локации в `tgcloud/lib/content/<id>/locations/`.
3. Соберите `manifest.js` с `{ config, locations }`.
4. При необходимости добавьте `checks` в `validate.js` и `validation`.
5. Поменяйте экспорт в `tgcloud/lib/content/index.js`:
   ```js
   export { pack } from './<id>/manifest.js';
   ```

После этого:

```bash
npm run validate
npm test
```

Движок и валидатор менять не нужно.
