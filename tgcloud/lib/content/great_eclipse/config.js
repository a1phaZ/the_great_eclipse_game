// Контент-пак «The Great Eclipse».
//
// Здесь описан мир, а не движок: ресурсы, характеристики, формулы, таблицы
// случайных событий, правила смерти/восстановления и строки интерфейса.
// Движок читает этот объект и ничего не знает про чипы, дизель и трак.

export const config = {
  id: 'great_eclipse',
  version: 1,

  locales: ['ru'],
  defaultLocale: 'ru',

  start: 'new_detroit:garage',

  // Фракции мира. Репутация каждой живёт в отдельной переменной `repVar`,
  // а награда за верность — предмет `rewardItem` из config.items.
  factions: {
    neo_tek: { name: '🛰 Нео-Тек', repVar: 'repNeoTek', rewardItem: 'neo_tek_scanner' },
    rusty_barons: { name: '⛓ Ржавые Бароны', repVar: 'repRustyBarons', rewardItem: 'baron_plating' },
    eclipse: { name: '🌑 Дети Затмения', repVar: 'repEclipse', rewardItem: 'eclipse_core' },
  },

  resources: {
    chips: { label: '💾 Чипы', initial: 250, min: 0 },
    diesel: { label: '⛽ Дизель', initial: 40, min: 0, max: 'vars.maxDiesel' },
    hp: { label: '🚜 Прочность', initial: 250, min: 0, max: 'vars.maxHp' },
  },

  stats: {
    luck: { label: 'Удача', initial: 3, min: 0 },
    evasion: { label: 'Уклонение', initial: 15, min: 0, max: 100 },
  },

  vars: {
    destination: { initial: '' },
    truckModel: { initial: 'Мародер-Скаут' },
    truckLevel: { initial: 1, min: 1 },
    truckBaseCost: { initial: 500, min: 0 },
    maxHp: { initial: 250, min: 1 },
    maxDiesel: { initial: 50, min: 1 },

    // Репутация фракций: 0..100, награда открывается на пороге.
    repNeoTek: { initial: 0, min: 0, max: 100 },
    repRustyBarons: { initial: 0, min: 0, max: 100 },
    repEclipse: { initial: 0, min: 0, max: 100 },
  },

  derived: {
    // 1 чип за HP на каждые 500 базовой стоимости, умноженное на уровень.
    repair_price_per_hp: 'max(1, round(vars.truckBaseCost * 0.002)) * vars.truckLevel',
    repair_cost_full: 'max(0, vars.maxHp - resources.hp) * repair_price_per_hp',

    fuel_missing: 'max(0, vars.maxDiesel - resources.diesel)',
    fuel_price_per_liter: 'vars.truckLevel',
    fuel_cost_full: 'max(0, vars.maxDiesel - resources.diesel) * fuel_price_per_liter',

    // Старые шансы перегона: 40% радио, затем засада/тайник/доехать.
    // Модули фракций дают пассивные бонусы к этим формулам.
    encounter_ambush_chance: `max(10, 45 - (stats.evasion - 15) - (hasItem('neo_tek_scanner') ? 10 : 0))`,
    encounter_loot_chance: `min(40, 15 + (stats.luck + (hasItem('eclipse_core') ? 4 : 0)) * 2)`,

    // Броня Баронов экономит топливо в дальних перегонах.
    travel_fuel_cost: `round(15 * (hasItem('baron_plating') ? 0.8 : 1))`,

    // Порог репутации, на котором фракция выдаёт свой модуль.
    faction_reward_rep: '30',
  },

  tables: {
    highway: {
      entries: [
        { weight: 40, condition: '!flags.story.bunkerDone', target: 'event_radio:catch_signal' },
        { weight: '60 * encounter_ambush_chance / 100', target: 'event_ambush:stage_1' },
        { weight: '60 * encounter_loot_chance / 100', target: 'event_loot:stage_1' },
        {
          weight: '60 * max(0, 100 - encounter_ambush_chance - encounter_loot_chance) / 100',
          target: '@var:vars.destination',
        },
      ],
    },
  },

  routers: {
    highway: { type: 'table', table: 'highway' },
    destination: { type: 'var', path: 'vars.destination', fallback: 'system:recovery' },
  },

  rules: {
    onDeath: {
      when: 'resources.hp <= 0',
      target: 'new_detroit:market_repair',
      text: '🚨 **ТРАК КРИТИЧЕСКИ РАЗБИТ!**\n\nОбшивка разрушена. Дроны-утилизаторы эвакуировали остатки машины в мастерскую Ганса.',
      effects: { 'resources.hp': '1' },
      imageUrl: 'https://unsplash.com',
    },
    onMissingScene: {
      target: 'system:recovery',
    },
  },

  // Награды фракций. Пока это коллекционные модули: инвентарь уже умеет
  // хранить их и показывать в {inventorySummary()}.
  items: {
    neo_tek_scanner: { name: '🛰 Сканер Нео-Тек', maxQty: 1 },
    baron_plating: { name: '🛡 Броня Ржавых Баронов', maxQty: 1 },
    eclipse_core: { name: '🌑 Ядро Затмения', maxQty: 1 },
  },

  strings: {
    help: [
      '🚚 **THE GREAT ECLIPSE**',
      '',
      'Вы — водитель бронированного трака на выжженном Тракте. Ездите между поселениями, чините машину, торгуйте и выживайте в дорожных событиях.',
      '',
      '**Команды:**',
      '/start — продолжить игру',
      '/reset — начать заново (сброс прогресса)',
      '/help — эта справка',
    ].join('\n'),
    resetPrefix: '♻️ **Прогресс сброшен.** Начинаем заново.',
    stale: 'Это меню устарело — обновил экран.',
    sessionNotFound: 'Сессия не найдена. Отправьте /start.',
    genericError: '⚠️ Что-то пошло не так. Попробуйте /start или /reset.',
    missingScene: '⚠️ **КРИТИЧЕСКИЙ СБОЙ НАВИГАЦИИ**\n\nБортовой компьютер не может найти ни одну сцену. Отправьте /start, чтобы начать заново.',
    emptyInventory: '🎒 **Инвентарь:** _пусто._',
    inventoryTitle: '🎒 **Инвентарь:**',
    fallbackImage: 'https://unsplash.com',
  },
};
