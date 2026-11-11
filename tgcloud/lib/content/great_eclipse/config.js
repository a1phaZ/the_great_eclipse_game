// Контент-пак «The Great Eclipse».
//
// Здесь описан мир, а не движок: ресурсы, характеристики, формулы, таблицы
// случайных событий, правила смерти/восстановления и строки интерфейса.
// Движок читает этот объект и ничего не знает про чипы, дизель и трак.

export const config = {
  id: 'great_eclipse',
  version: 2,

  locales: ['ru'],
  defaultLocale: 'ru',

  start: 'new_detroit:prologue',

  // Настройки пака. Кулдаун побочных выездов можно менять без правки сцен:
  // 24 часа = 86400000, 12 часов = 43200000.
  settings: {
    sideQuestCooldownMs: 24 * 60 * 60 * 1000,
  },

  // Фракции мира. Репутация каждой живёт в отдельной переменной `repVar`.
  // Ранги выдаются на порогах 25/50/75.
  factions: {
    neo_tek: {
      name: '🛰 Нео-Тек',
      repVar: 'repNeoTek',
      ranks: [
        { rep: 25, title: 'Оператор', item: 'neo_tek_scanner' },
        { rep: 50, title: 'Старший оператор', item: 'neo_tek_reserve' },
        { rep: 75, title: 'Хранитель Орбиты', item: 'neo_tek_orbital' },
      ],
    },
    rusty_barons: {
      name: '⛓ Ржавые Бароны',
      repVar: 'repRustyBarons',
      ranks: [
        { rep: 25, title: 'Крыса', item: 'baron_plating' },
        { rep: 50, title: 'Бригадир', item: 'baron_trophy' },
        { rep: 75, title: 'Барон', item: 'baron_crown' },
      ],
    },
    eclipse: {
      name: '🌑 Дети Затмения',
      repVar: 'repEclipse',
      ranks: [
        { rep: 25, title: 'Послушник', item: 'eclipse_core' },
        { rep: 50, title: 'Проповедник', item: 'eclipse_orb' },
        { rep: 75, title: 'Голос Затмения', item: 'eclipse_halo' },
      ],
    },
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
    truckLevel: { initial: 1, min: 1, max: 5 },
    truckBaseCost: { initial: 500, min: 0 },
    maxHp: { initial: 250, min: 1 },
    maxDiesel: { initial: 50, min: 1 },

    // Репутация фракций: 0..100.
    repNeoTek: { initial: 0, min: 0, max: 100 },
    repRustyBarons: { initial: 0, min: 0, max: 100 },
    repEclipse: { initial: 0, min: 0, max: 100 },

    // Статус связи с «Гелиос-9»: 0 — нет, 1 — искажённый, 2 — полный.
    heliosSignal: { initial: 0, min: 0, max: 2 },

    // Время (unix ms), до которого побочные выезды недоступны.
    sideCooldownUntil: { initial: 0, min: 0 },
  },

  derived: {
    // 1 чип за HP на каждые 500 базовой стоимости, умноженное на уровень.
    repair_price_per_hp: 'max(1, round(vars.truckBaseCost * 0.002)) * vars.truckLevel',
    repair_cost_full: 'max(0, vars.maxHp - resources.hp) * repair_price_per_hp',

    fuel_missing: 'max(0, vars.maxDiesel - resources.diesel)',
    fuel_price_per_liter: 'vars.truckLevel',
    fuel_cost_full: 'max(0, vars.maxDiesel - resources.diesel) * fuel_price_per_liter',

    // Проценты из сюжетных документов: броня и топливо.
    hp_percent: 'round(resources.hp * 100 / max(1, vars.maxHp))',
    diesel_percent: 'round(resources.diesel * 100 / max(1, vars.maxDiesel))',

    // Апгрейд ходовой в мастерской: уровень 1→2→3→4→5.
    truck_upgrade_cost: 'round(vars.truckBaseCost * 0.8) * vars.truckLevel',

    // Старые шансы перегона: 40% радио, затем засада/тайник/доехать.
    // Модули фракций дают пассивные бонусы к этим формулам.
    encounter_ambush_chance: `max(10, 45 - (stats.evasion - 15) - (hasItem('neo_tek_scanner') ? 10 : 0))`,
    encounter_loot_chance: `min(40, 15 + (stats.luck + (hasItem('eclipse_core') ? 4 : 0)) * 2)`,

    // Броня Баронов экономит топливо в дальних перегонах.
    travel_fuel_cost: `round(15 * (hasItem('baron_plating') ? 0.8 : 1))`,

    // Кулдаун побочек берётся из настроек пака.
    side_quest_cooldown_ms: (state, config) => (
      Number(config.settings?.sideQuestCooldownMs) || 24 * 60 * 60 * 1000
    ),
    side_cooldown_hours: 'max(0, ceil((vars.sideCooldownUntil - now()) / 3600000))',
    side_cooldown_text: `side_cooldown_hours > 0 ? '⏳ Следующее задание через ' + side_cooldown_hours + ' ч.' : '✅ Доступно новое задание.'`,
    side_quest_name: `flags.side.neo_tek_survey ? 'Сбор телеметрии' : (flags.side.baron_tribute ? 'Дань Выселкам' : (flags.side.eclipse_pilgrim ? 'Проводник паломников' : '—'))`,
    side_quest_line: `flags.side.active ? '🎯 Заказ: **' + side_quest_name + '** (нужно ' + travel_fuel_cost * 2 + ' л. на дорогу)' : ''`,

    // Строки сюжета Нео-Тек.
    neo_tek_truth_line: `flags.story.neo_tek.truth ? 'Вы знаете: «Завеса» — рукотворный проект инженеров.' : 'Вы пока не знаете всей правды о Затмении.'`,
    helios_signal_text: `vars.heliosSignal >= 2 ? 'Полный' : (vars.heliosSignal >= 1 ? 'Искажённый' : 'Нет связи')`,
    neo_tek_quest_hint: `flags.story.neo_tek.q6 ? 'Цепочка завершена.' : (flags.story.neo_tek.q5 ? 'Доступен финал: «Выбор Прометея» (нужно 75 репутации).' : 'Следующий сюжетный квест открывается по репутации.')`,

    // Звания для витрины фракций.
    neo_tek_rank: `vars.repNeoTek >= 75 ? 'Хранитель Орбиты' : (vars.repNeoTek >= 50 ? 'Старший оператор' : (vars.repNeoTek >= 25 ? 'Оператор' : 'Без звания'))`,
    baron_rank: `vars.repRustyBarons >= 75 ? 'Барон' : (vars.repRustyBarons >= 50 ? 'Бригадир' : (vars.repRustyBarons >= 25 ? 'Крыса' : 'Без звания'))`,
    eclipse_rank: `vars.repEclipse >= 75 ? 'Голос Затмения' : (vars.repEclipse >= 50 ? 'Проповедник' : (vars.repEclipse >= 25 ? 'Послушник' : 'Без звания'))`,
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

    // Какое побочное задание сейчас активно. Одновременно может быть только одно.
    active_side_quest: {
      entries: [
        { condition: 'flags.side.neo_tek_survey', target: 'side_quests:neo_tek_start' },
        { condition: 'flags.side.baron_tribute', target: 'side_quests:baron_start' },
        { condition: 'flags.side.eclipse_pilgrim', target: 'side_quests:eclipse_start' },
      ],
      fallback: 'new_detroit:job_board',
    },
  },

  routers: {
    highway: { type: 'table', table: 'highway' },
    destination: { type: 'var', path: 'vars.destination', fallback: 'system:recovery' },
    active_side_quest: { type: 'table', table: 'active_side_quest' },
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

  items: {
    // Модули 25-го ранга.
    neo_tek_scanner: { name: '🛰 Сканер Нео-Тек', maxQty: 1 },
    baron_plating: { name: '🛡 Броня Ржавых Баронов', maxQty: 1 },
    eclipse_core: { name: '🌑 Ядро Затмения', maxQty: 1 },

    // Награды 50-го ранга.
    neo_tek_reserve: { name: '🔋 Резервный контур', maxQty: 1 },
    baron_trophy: { name: '🏆 Трофей Баронов', maxQty: 1 },
    eclipse_orb: { name: '🔮 Сфера Затмения', maxQty: 1 },

    // Сильные предметы 75-го ранга.
    neo_tek_orbital: { name: '🛰 Орбитальный модуль', maxQty: 1 },
    baron_crown: { name: '👑 Корона Барона', maxQty: 1 },
    eclipse_halo: { name: '🌑 Гало Затмения', maxQty: 1 },
  },

  strings: {
    help: [
      '🚚 **THE GREAT ECLIPSE**',
      '',
      'Вы — водитель бронированного трака на выжженном Тракте. Ездите между поселениями, чините машину, торгуйте и выживайте в дорожных событиях.',
      '',
      '**Фракции:** Нео-Тек, Ржавые Бароны и Дети Затмения. Репутация открывает звания на 25/50/75. Сюжетные квесты фракции открываются на 0/15/30/45/60/75 и усиливают её, ослабляя конкурентов.',
      '',
      '**Побочные задания** — один выезд раз в сутки. Возьмите заказ на доске объявлений и выезжайте на тракт.',
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
