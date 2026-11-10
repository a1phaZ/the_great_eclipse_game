# Движок и контент-паки

Игра состоит из двух слоёв:

- **движок** — `tgcloud/lib/engine/`: сцены, условия, эффекты, формулы,
  роутеры, смерть/восстановление, рендер;
- **контент-пак** — `tgcloud/lib/content/<pack>/`: мир, ресурсы, тексты,
  локации и правила.

Движок не знает слов «чипы», «дизель» или «трак». Всё это описано в
`config.js` контент-пака. Чтобы сделать другую историю, скопируйте пак и
замените одну строку в `tgcloud/lib/content/index.js`.

## Структура

```text
tgcloud/lib/
  engine/
    index.js        # GameEngine, WorldRegistry, scope, routing, render
    expression.js   # безопасный парсер выражений (без eval)
    state.js        # JSON-state, пути, эффекты, инвентарь
    i18n.js         # локали и resolveLocalized
  content/
    index.js        # активный пак
    great_eclipse/
      config.js
      manifest.js
      locations/*.js
```

## Состояние

Вся история игрока хранится в одном JSON-поле `sessions.state`:

```json
{
  "nav": { "locationId": "new_detroit", "sceneId": "garage" },
  "resources": { "chips": 250, "diesel": 40, "hp": 250 },
  "stats": { "luck": 3, "evasion": 15 },
  "vars": {
    "destination": "",
    "truckModel": "Мародер-Скаут",
    "truckLevel": 1,
    "maxHp": 250,
    "maxDiesel": 50
  },
  "flags": { "quest": { "noise": 1 } },
  "inventory": {
    "gold_key": { "qty": 1 },
    "ammo": { "qty": 24 }
  },
  "meta": { "version": 1, "locale": "ru" }
}
```

- `nav` — текущая сцена, движок обновляет сам;
- `resources`, `stats`, `vars` — числа и строки;
- `flags` — квестовые и сюжетные флаги, отсутствующий флаг читается как `0`;
- `inventory` — предметы: `{ itemId: { qty, ...fields } }`;
- `meta` — версия и язык.

## Конфиг

```js
export const config = {
  id: 'my_story',
  version: 1,
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  start: 'camp:start',

  resources: {
    gold: { label: 'Золото', initial: 10, min: 0 },
    mana: { label: 'Мана', initial: 5, min: 0, max: 'vars.maxMana' },
  },

  stats: {
    luck: { label: 'Удача', initial: 3, min: 0 },
  },

  vars: {
    maxMana: { initial: 5, min: 1 },
    destination: { initial: '' },
  },

  derived: {
    potion_price: 'max(1, vars.maxMana)',
  },

  items: {
    potion: {
      name: { ru: 'Зелье', en: 'Potion' },
      maxQty: 9,
    },
  },

  tables: {
    road: {
      entries: [
        { weight: 40, target: 'event:ambush' },
        { weight: 60, target: '@var:vars.destination' },
      ],
    },
  },

  routers: {
    road: { type: 'table', table: 'road' },
    destination: { type: 'var', path: 'vars.destination' },
  },

  rules: {
    onDeath: {
      when: 'resources.hp <= 0',
      target: 'camp:start',
      text: 'Вы погибли.',
      effects: { 'resources.hp': '1' },
    },
    onMissingScene: { target: 'system:recovery' },
  },

  strings: {
    help: '...',
    resetPrefix: 'Прогресс сброшен.',
    stale: 'Меню устарело.',
    sessionNotFound: 'Отправьте /start.',
    genericError: 'Что-то пошло не так.',
    missingScene: 'Сцена не найдена.',
    inventoryTitle: '🎒 Инвентарь:',
    emptyInventory: '',
    fallbackImage: 'https://unsplash.com',
  },
};
```

## Сцены

```js
export const camp = {
  locationId: 'camp',
  name: 'Лагерь',
  scenes: {
    start: {
      text: 'Золото: {resources.gold}. {inventorySummary()}',
      imageUrl: 'https://example.com/camp.png',
      transitions: [
        {
          buttonText: 'Купить зелье ({potion_price})',
          condition: 'resources.gold >= potion_price',
          effects: {
            'resources.gold': '-potion_price',
            'inventory.potion.qty': '+1',
          },
          target: 'camp:start',
        },
      ],
    },
  },
};
```

`text` и `buttonText` могут быть строкой или объектом `{ ru, en }`.

## Выражения

В `condition`, `effects`, `derived`, `weight` и `{...}` в тексте можно писать:

- числа, строки, `true`/`false`;
- пути: `resources.gold`, `flags.quest.noise`, `inventory.ammo.qty`;
- `+ - * / %`, сравнения, `&& || !`, тернарник `? :`, скобки;
- функции `min`, `max`, `round`, `floor`, `ceil`, `abs`, `clamp`,
  `hasItem`, `itemQty`, `inventorySummary`;
- имена из `derived`.

Примеры:

```text
resources.hp < vars.maxHp && resources.gold >= repair_cost
!flags.story.bunkerDone
flags.quest.noise == 1 ? 60 : 0
max(0, vars.maxHp - resources.hp)
```

## Эффекты

```js
effects: {
  'resources.gold': '+120',       // прибавить
  'resources.hp': '-60',          // вычесть
  'resources.mana': 'MAX',        // заполнить до max
  'resources.hp': 'MIN',          // опустить до min
  'flags.quest.noise': '1',       // установить
  'flags.quest': 'CLEAR',         // удалить ветку
  'flags.quest.flag': 'TOGGLE',   // 0 ↔ 1
  'vars.destination': 'camp:start', // строковый литерал
  'inventory.potion.qty': '+1',
}
```

Лимиты берутся из `resources`/`stats`/`vars`/`items`.

## Target и роутеры

- `location:scene` — обычный переход;
- `@table:name` — взвешенная таблица;
- `@router:name` — именованный роутер из `config.routers`;
- `@var:path` — значение из состояния.

Роутер может быть:

```js
routers: {
  destination: { type: 'var', path: 'vars.destination' },
  road: { type: 'table', table: 'road' },
  custom: {
    type: 'function',
    resolve: ({ state, scope }) => (scope.get('resources.hp') > 0 ? 'camp:start' : 'camp:death'),
  },
}
```

В таблице `weight` может быть числом или выражением. Если ни одна запись не
подошла, используется `table.fallback`.

## Инвентарь

```js
items: {
  ammo: {
    name: { ru: 'Патроны', en: 'Ammo' },
    maxQty: 999,
  },
  sword: {
    name: { ru: 'Тесак', en: 'Cleaver' },
    maxQty: 1,
    fields: {
      durability: { label: { ru: 'прочность', en: 'durability' }, initial: 100, min: 0, max: 100 },
    },
  },
}
```

- добавить: `'inventory.ammo.qty': '+10'`;
- потратить: `'inventory.ammo.qty': '-5'`;
- проверить: `inventory.ammo.qty >= 10`;
- вывести: `{inventorySummary()}`.

При первом изменении предмета движок создаёт его объект и поля с `initial`.

## Фракции и репутация

Фракции — это контент, а не движок: движок знает только `vars` и `items`.

```js
factions: {
  neo_tek: {
    name: '🛰 Нео-Тек',
    repVar: 'repNeoTek',
    rewardItem: 'neo_tek_scanner',
  },
},

vars: {
  repNeoTek: { initial: 0, min: 0, max: 100 },
},

items: {
  neo_tek_scanner: { name: '🛰 Сканер Нео-Тек', maxQty: 1 },
},
```

- репутация меняется обычным эффектом: `'vars.repNeoTek': '+6'`;
- проверка порога: `vars.repNeoTek >= faction_reward_rep`;
- награда выдаётся один раз:
  `condition: "vars.repNeoTek >= faction_reward_rep && !hasItem('neo_tek_scanner')"`,
  `effects: { 'inventory.neo_tek_scanner.qty': '1' }`;
- `faction_reward_rep` — derived-порог, общий для всех фракций.

Модуль может давать пассивный бонус через `hasItem` в derived-формуле:

```js
derived: {
  travel_fuel_cost: `round(15 * (hasItem('baron_plating') ? 0.8 : 1))`,
  encounter_ambush_chance: `max(10, 45 - (stats.evasion - 15) - (hasItem('neo_tek_scanner') ? 10 : 0))`,
},
```

В текущем паке повторяемые побочки живут на `new_detroit:job_board`, а выдача
модулей — на `new_detroit:faction_rewards`. Сюжетные квесты фракций добавляются
как обычные локации и сцены и меняют те же переменные репутации.

## Локализация

- `config.locales` — поддерживаемые языки;
- `config.defaultLocale` — язык по умолчанию;
- строковые поля можно оставлять строкой — они работают для всех языков;
- для перевода используйте объект `{ ru: '...', en: '...' }`;
- язык игрока хранится в `state.meta.locale`;
- `resolveLocalized` выбирает нужную локаль, затем `defaultLocale`, затем первый ключ.

`/reset` сохраняет язык, сбрасывает только историю.

## Проверка

```bash
npm test          # expression, state, engine, callback_data, content
npm run validate  # config, сцены, target, условия, эффекты, флаги, достижимость
```

Валидатор читает настоящий `config` и `registry`, поэтому не расходится с
движком. Он также проверяет лимиты Telegram: caption, текст кнопки,
`callback_data`.

## Новая история

1. Скопируйте `tgcloud/lib/content/great_eclipse` в `tgcloud/lib/content/my_story`.
2. Замените `config.js`, локации и `manifest.js`.
3. В `tgcloud/lib/content/index.js` экспортируйте `my_story/manifest.js`.
4. Запустите `npm test` и `npm run validate`.
5. `npm run deploy` — сборка не нужна, но `push` + `migrate` обязательны.

Один бот — один активный контент-пак. Для нескольких историй используйте
отдельных ботов: контент-пак — это JS-код, а не данные, и запускать чужой код
в общем боте небезопасно.
