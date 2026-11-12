// Минимальный контент-пак для тестов самого движка.
// Здесь нет ни одной сцены из реальной игры: только механики, которые
// должен уметь любой пак — условия, эффекты, derived, таблицы, роутеры,
// смерть, восстановление, инвентарь и локали.

export const fixtureConfig = {
  id: 'fixture',
  version: 1,
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  start: 'test:start',

  resources: {
    gold: { initial: 10, min: 0, max: 100 },
    hp: { initial: 5, min: 0, max: 10 },
  },

  stats: {
    luck: { initial: 1, min: 0, max: 5 },
  },

  vars: {
    destination: { initial: '', type: 'string' },
    mood: { initial: 0 },
  },

  derived: {
    doubleGold: 'resources.gold * 2',
    canAfford: 'resources.gold >= 5',
  },

  items: {
    potion: {
      name: { en: 'Potion', ru: 'Зелье' },
      maxQty: 5,
      fields: {
        charges: {
          initial: 1,
          min: 0,
          max: 3,
          label: { en: 'Charges', ru: 'Заряды' },
        },
      },
    },
  },

  tables: {
    loot: {
      entries: [
        { weight: 1, target: 'test:rich' },
        { weight: 1, condition: 'resources.gold > 50', target: 'test:poor' },
      ],
      fallback: 'test:start',
    },
  },

  routers: {
    toLoot: '@table:loot',
    byMood: { type: 'var', path: 'vars.mood', fallback: 'test:start' },
  },

  rules: {
    onDeath: {
      when: 'resources.hp <= 0',
      target: 'test:dead',
      effects: { 'resources.gold': '0' },
      text: { en: 'You died', ru: 'Вы погибли' },
    },
    onMissingScene: {
      target: 'test:start',
      text: { en: 'Recovered', ru: 'Восстановлено' },
    },
  },

  strings: {
    help: { en: 'Help', ru: 'Помощь' },
    emptyInventory: { en: 'Empty', ru: 'Пусто' },
    inventoryTitle: { en: 'Bag', ru: 'Сумка' },
    missingScene: { en: 'Missing scene', ru: 'Нет сцены' },
    fallbackImage: 'https://example.com/fallback.png',
  },

  navigationVars: ['vars.destination'],
};

export const testLocation = {
  locationId: 'test',
  name: 'Test',
  scenes: {
    start: {
      text: { en: 'Start with {resources.gold} gold', ru: 'Старт с {resources.gold} золота' },
      imageUrl: 'https://example.com/start.png',
      transitions: [
        {
          buttonText: { en: 'Go rich', ru: 'К богатству' },
          effects: { 'resources.gold': '+5', 'flags.visited': '1', 'flags.secret': '1' },
          target: 'test:rich',
        },
        {
          buttonText: { en: 'Set destination', ru: 'Задать цель' },
          effects: { 'vars.destination': 'test:rich' },
          target: '@var:vars.destination',
        },
        {
          buttonText: { en: 'Loot', ru: 'Добыча' },
          target: '@table:loot',
        },
        {
          buttonText: { en: 'Router', ru: 'Роутер' },
          target: '@router:toLoot',
        },
        {
          buttonText: { en: 'Mood', ru: 'Настроение' },
          target: '@router:byMood',
        },
        {
          buttonText: { en: 'Die', ru: 'Умереть' },
          effects: { 'resources.hp': '-10' },
          target: 'test:start',
        },
        {
          buttonText: { en: 'Other location', ru: 'Другая локация' },
          target: 'other:arrival',
        },
        {
          buttonText: { en: 'Secret', ru: 'Секрет' },
          condition: 'flags.secret',
          target: 'test:rich',
        },
      ],
    },

    rich: {
      text: { en: 'Rich: {doubleGold}', ru: 'Богатство: {doubleGold}' },
      imageUrl: 'https://example.com/rich.png',
      transitions: [
        { buttonText: { en: 'Back', ru: 'Назад' }, target: 'test:start' },
      ],
    },

    poor: {
      text: { en: 'Poor', ru: 'Бедно' },
      imageUrl: 'https://example.com/poor.png',
      transitions: [
        { buttonText: { en: 'Back', ru: 'Назад' }, target: 'test:start' },
      ],
    },

    dead: {
      text: { en: 'Dead', ru: 'Мёртв' },
      imageUrl: 'https://example.com/dead.png',
      transitions: [
        { buttonText: { en: 'Restart', ru: 'Заново' }, target: 'test:start' },
      ],
    },
  },
};

export const otherLocation = {
  locationId: 'other',
  name: 'Other',
  scenes: {
    arrival: {
      text: { en: 'Arrived', ru: 'Прибыли' },
      imageUrl: 'https://example.com/other.png',
      transitions: [
        { buttonText: { en: 'Back', ru: 'Назад' }, target: 'test:start' },
      ],
    },
  },
};

export const fixturePack = {
  config: fixtureConfig,
  locations: [testLocation, otherLocation],
};
