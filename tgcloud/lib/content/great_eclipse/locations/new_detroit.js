export const newDetroit = {
  locationId: 'new_detroit',
  name: 'Новый Детройт',
  scenes: {
    prologue: {
      text: [
        '🌑 **THE GREAT ECLIPSE**',
        '',
        'Двенадцать лет назад солнце погасло. Не навсегда — всего на девять минут. Но этого хватило: орбитальные станции ослепли, сети умерли, а Тракт превратился в ленту ржавых городов и топливных войн.',
        '',
        'Вы — водитель бронированного трака. Ваш гараж в Новом Детройте, бак почти полон, а в кармане — двести пятьдесят чипов.',
        '',
        '_Пора выезжать._',
      ].join('\n'),
      imageUrl: 'https://raw.githubusercontent.com/a1phaZ/the_great_eclipse_game/main/images/new_detroit_prologue.jpg',
      transitions: [
        { buttonText: '📻 Включить радио', target: 'new_detroit:prologue_factions' },
      ],
    },

    prologue_factions: {
      text: [
        '📻 **РАДИОЭФИР ТРАКТА**',
        '',
        'Три голоса делят эфир:',
        '',
        '🛰 **Нео-Тек** — уцелевшие инженеры. Верят, что орбиту можно вернуть, и платят за данные.',
        '',
        '⛓ **Ржавые Бароны** — хозяева топлива. Уважают силу и сделки.',
        '',
        '🌑 **Дети Затмения** — культ последней ночи. Ищут знамения в мёртвом небе.',
        '',
        '_Каждый платит по-своему. Каждый помнит предательства._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '🚚 В гараж', target: 'new_detroit:garage' },
      ],
    },

    garage: {
      text: [
        '🛠 **ГАРАЖ: УБЕЖИЩЕ «РЖАВЫЙ БОЛТ»**',
        '',
        'Вы находитесь в своем Гараже. Двигатель трака `{vars.truckModel}` мерно рокочет.',
        '',
        '📊 **Ваш Профиль:**',
        '• 💾 Чипы: `{resources.chips}`',
        '• 🚜 Прочность: `{resources.hp}/{vars.maxHp} HP` ({hp_percent}%)',
        '• ⛽ Дизель: `{resources.diesel}/{vars.maxDiesel} л.` ({diesel_percent}%)',
        '• 🎖 Уровень трака: `{vars.truckLevel}/5`',
        '',
        '{inventorySummary()}',
        '',
        '_Куда направимся, Капитан?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '🍻 Зайти в бар «Ржавый Поршень»', target: 'new_detroit:bar' },
        { buttonText: '🛒 Посетить Мастерскую и Рынок', target: 'new_detroit:market_repair' },
        { buttonText: '🗺 Выехать на Перегон «Детройт – Выселки»', target: 'highway_south:from_detroit' },
      ],
    },

    bar: {
      text: [
        '🍻 **БАР «РЖАВЫЙ ПОРШЕНЬ»**',
        '',
        'В воздухе висит дым от дешевого самосада, а из старого кассетника хрипит довоенный рок. За столами хмуро пьют дизельные наемники.',
        '',
        '_Одноглазый Джо кивает вам из угла и стучит костяшкой по доске объявлений: фракции ищут работу._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '📋 Подойти к доске объявлений', target: 'new_detroit:job_board' },
        { buttonText: '🤝 Фракционные дела', target: 'new_detroit:story_board' },
        { buttonText: '⬅️ Вернуться в Гараж', target: 'new_detroit:garage' },
      ],
    },

    job_board: {
      text: [
        '📋 **ДОСКА ОБЪЯВЛЕНИЙ**',
        '',
        'Побочные заказы фракций. Один выезд в сутки — выбирайте, кому помочь.',
        '',
        '{side_cooldown_text}',
        '🎯 Активное задание: **{side_quest_name}**',
        '',
        '📊 **Репутация:**',
        '• 🛰 Нео-Тек: `{vars.repNeoTek}/100`',
        '• ⛓ Ржавые Бароны: `{vars.repRustyBarons}/100`',
        '• 🌑 Дети Затмения: `{vars.repEclipse}/100`',
        '',
        '_Взяли заказ — выезжайте на тракт._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛰 Сбор телеметрии (+2 реп.)',
          condition: 'now() >= vars.sideCooldownUntil && !flags.side.active',
          effects: {
            'flags.side.active': '1',
            'flags.side.neo_tek_survey': '1',
          },
          target: 'new_detroit:job_board',
        },
        {
          buttonText: '⛓ Дань Выселкам (+2 реп.)',
          condition: 'now() >= vars.sideCooldownUntil && !flags.side.active',
          effects: {
            'flags.side.active': '1',
            'flags.side.baron_tribute': '1',
          },
          target: 'new_detroit:job_board',
        },
        {
          buttonText: '🌑 Проводник паломников (+2 реп.)',
          condition: 'now() >= vars.sideCooldownUntil && !flags.side.active',
          effects: {
            'flags.side.active': '1',
            'flags.side.eclipse_pilgrim': '1',
          },
          target: 'new_detroit:job_board',
        },
        {
          buttonText: '❌ Отменить активное задание',
          condition: 'flags.side.active',
          effects: {
            'flags.side.active': '0',
            'flags.side.neo_tek_survey': '0',
            'flags.side.baron_tribute': '0',
            'flags.side.eclipse_pilgrim': '0',
          },
          target: 'new_detroit:job_board',
        },
        { buttonText: '🤝 Фракционные дела', target: 'new_detroit:story_board' },
        { buttonText: '⬅️ Вернуться в бар', target: 'new_detroit:bar' },
      ],
    },

    story_board: {
      text: [
        '📜 **ФРАКЦИОННЫЕ ДЕЛА**',
        '',
        '🛰 **Нео-Тек** — `{vars.repNeoTek}/100`, звание: _{neo_tek_rank}_',
        '⛓ **Ржавые Бароны** — `{vars.repRustyBarons}/100`, звание: _{baron_rank}_',
        '🌑 **Дети Затмения** — `{vars.repEclipse}/100`, звание: _{eclipse_rank}_',
        '',
        '{neo_tek_quest_hint}',
        '{barons_quest_hint}',
        '{eclipse_quest_hint}',
        '',
        '_Каждый квест цепочки требует репутации: 0 / 15 / 30 / 45 / 60 / 75._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛰 «Мёртвый эфир»',
          condition: '!flags.story.neo_tek.q1',
          target: 'story_neo_tek:q1_start',
        },
        {
          buttonText: '🛰 «Слепой штурман» (15 реп.)',
          condition: 'flags.story.neo_tek.q1 && !flags.story.neo_tek.q2 && vars.repNeoTek >= 15',
          target: 'story_neo_tek:q2_start',
        },
        {
          buttonText: '🛰 «Логика предательства» (30 реп.)',
          condition: 'flags.story.neo_tek.q2 && !flags.story.neo_tek.q3 && vars.repNeoTek >= 30',
          target: 'story_neo_tek:q3_start',
        },
        {
          buttonText: '🛰 «Квантовое сердце» (45 реп.)',
          condition: 'flags.story.neo_tek.q3 && !flags.story.neo_tek.q4 && vars.repNeoTek >= 45',
          target: 'story_neo_tek:q4_start',
        },
        {
          buttonText: '🛰 «Голос из облаков» (60 реп.)',
          condition: 'flags.story.neo_tek.q4 && !flags.story.neo_tek.q5 && vars.repNeoTek >= 60',
          target: 'story_neo_tek:q5_start',
        },
        {
          buttonText: '🛰 «Выбор Прометея» — финал (75 реп.)',
          condition: 'flags.story.neo_tek.q5 && !flags.story.neo_tek.q6 && vars.repNeoTek >= 75',
          target: 'story_neo_tek:q6_start',
        },
        {
          buttonText: '⛓ «Дым над Трактом»',
          condition: '!flags.story.barons.q1',
          target: 'story_barons:q1_start',
        },
        {
          buttonText: '⛓ «Сухой остаток» (15 реп.)',
          condition: 'flags.story.barons.q1 && !flags.story.barons.q2 && vars.repRustyBarons >= 15',
          target: 'story_barons:q2_start',
        },
        {
          buttonText: '⛓ «Карта мертвеца» (30 реп.)',
          condition: 'flags.story.barons.q2 && !flags.story.barons.q3 && vars.repRustyBarons >= 30',
          target: 'story_barons:q3_start',
        },
        {
          buttonText: '⛓ «Ржавый дипломат» (45 реп.)',
          condition: 'flags.story.barons.q3 && !flags.story.barons.q4 && vars.repRustyBarons >= 45',
          target: 'story_barons:q4_start',
        },
        {
          buttonText: '⛓ «Осквернение» (60 реп.)',
          condition: 'flags.story.barons.q4 && !flags.story.barons.q5 && vars.repRustyBarons >= 60',
          target: 'story_barons:q5_start',
        },
        {
          buttonText: '⛓ «Железный марш» — финал (75 реп.)',
          condition: 'flags.story.barons.q5 && !flags.story.barons.q6 && vars.repRustyBarons >= 75',
          target: 'story_barons:q6_start',
        },
        {
          buttonText: '🌑 «Пепел на ветровом стекле»',
          condition: '!flags.story.eclipse.q1',
          target: 'story_eclipse:q1_start',
        },
        {
          buttonText: '🌑 «Экстаз частоты» (15 реп.)',
          condition: 'flags.story.eclipse.q1 && !flags.story.eclipse.q2 && vars.repEclipse >= 15',
          target: 'story_eclipse:q2_start',
        },
        {
          buttonText: '🌑 «Священный лом» (30 реп.)',
          condition: 'flags.story.eclipse.q2 && !flags.story.eclipse.q3 && vars.repEclipse >= 30',
          target: 'story_eclipse:q3_start',
        },
        {
          buttonText: '🌑 «Груз скорби» (45 реп.)',
          condition: 'flags.story.eclipse.q3 && !flags.story.eclipse.q4 && vars.repEclipse >= 45',
          target: 'story_eclipse:q4_start',
        },
        {
          buttonText: '🌑 «Чёрный передатчик» (60 реп.)',
          condition: 'flags.story.eclipse.q4 && !flags.story.eclipse.q5 && vars.repEclipse >= 60',
          target: 'story_eclipse:q5_start',
        },
        {
          buttonText: '🌑 «Последнее затмение» — финал (75 реп.)',
          condition: 'flags.story.eclipse.q5 && !flags.story.eclipse.q6 && vars.repEclipse >= 75',
          target: 'story_eclipse:q6_start',
        },
        { buttonText: '🎖 Награды и звания', target: 'new_detroit:faction_rewards' },
        { buttonText: '⬅️ Вернуться в бар', target: 'new_detroit:bar' },
      ],
    },

    faction_rewards: {
      text: [
        '🎖 **НАГРАДЫ ФРАКЦИЙ**',
        '',
        'Репутация открывает звания и снаряжение.',
        '',
        '🛰 **Нео-Тек** — `{vars.repNeoTek}/100`',
        '• 25 — Оператор: сканер',
        '• 50 — Старший оператор: контур',
        '• 75 — Хранитель Орбиты: орбитальный модуль',
        '',
        '⛓ **Бароны** — `{vars.repRustyBarons}/100`',
        '• 25 — Крыса: броня',
        '• 50 — Бригадир: трофей',
        '• 75 — Барон: корона',
        '',
        '🌑 **Затмение** — `{vars.repEclipse}/100`',
        '• 25 — Послушник: ядро',
        '• 50 — Проповедник: сфера',
        '• 75 — Голос Затмения: гало',
        '',
        '{inventorySummary()}',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛰 Ранг 1: сканер',
          condition: 'vars.repNeoTek >= 25 && !flags.rank.neo_tek.1',
          effects: {
            'inventory.neo_tek_scanner.qty': '1',
            'flags.rank.neo_tek.1': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '🛰 Ранг 2: контур (+5 уклонения)',
          condition: 'vars.repNeoTek >= 50 && !flags.rank.neo_tek.2',
          effects: {
            'inventory.neo_tek_reserve.qty': '1',
            'stats.evasion': '+5',
            'flags.rank.neo_tek.2': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '🛰 Ранг 3: модуль (+10 уклонения)',
          condition: 'vars.repNeoTek >= 75 && !flags.rank.neo_tek.3',
          effects: {
            'inventory.neo_tek_orbital.qty': '1',
            'stats.evasion': '+10',
            'flags.rank.neo_tek.3': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '⛓ Ранг 1: броня',
          condition: 'vars.repRustyBarons >= 25 && !flags.rank.baron.1',
          effects: {
            'inventory.baron_plating.qty': '1',
            'flags.rank.baron.1': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '⛓ Ранг 2: трофей (+25 HP)',
          condition: 'vars.repRustyBarons >= 50 && !flags.rank.baron.2',
          effects: {
            'inventory.baron_trophy.qty': '1',
            'vars.maxHp': '+25',
            'resources.hp': '+25',
            'flags.rank.baron.2': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '⛓ Ранг 3: корона (+50 HP)',
          condition: 'vars.repRustyBarons >= 75 && !flags.rank.baron.3',
          effects: {
            'inventory.baron_crown.qty': '1',
            'vars.maxHp': '+50',
            'resources.hp': '+50',
            'flags.rank.baron.3': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '🌑 Ранг 1: ядро',
          condition: 'vars.repEclipse >= 25 && !flags.rank.eclipse.1',
          effects: {
            'inventory.eclipse_core.qty': '1',
            'flags.rank.eclipse.1': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '🌑 Ранг 2: сфера (+2 удачи)',
          condition: 'vars.repEclipse >= 50 && !flags.rank.eclipse.2',
          effects: {
            'inventory.eclipse_orb.qty': '1',
            'stats.luck': '+2',
            'flags.rank.eclipse.2': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '🌑 Ранг 3: гало (+3 удачи)',
          condition: 'vars.repEclipse >= 75 && !flags.rank.eclipse.3',
          effects: {
            'inventory.eclipse_halo.qty': '1',
            'stats.luck': '+3',
            'flags.rank.eclipse.3': '1',
          },
          target: 'new_detroit:faction_rewards',
        },
        { buttonText: '⬅️ Вернуться к делам', target: 'new_detroit:story_board' },
      ],
    },

    market_repair: {
      text: [
        '🔧 **АВТОМАСТЕРСКАЯ «У ГАНСА»**',
        '',
        'Старик Ганс осматривает обшивку вашего броневика.',
        '',
        '📋 **Смета на ремонт:**',
        '• Текущая прочность: `{resources.hp}/{vars.maxHp} HP` ({hp_percent}%)',
        '• Стоимость восстановления 1 HP: `{repair_price_per_hp} 💾`',
        '• Итого за полную починку: **`{repair_cost_full} 💾`**',
        '',
        '🔧 **Ходовая:** уровень `{vars.truckLevel}/5`',
        '• Апгрейд до следующего уровня: **`{truck_upgrade_cost} 💾`**',
        '',
        '_У вас в кармане: {resources.chips} чипов._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛠 Оплатить ремонт ({repair_cost_full} 💾)',
          condition: 'resources.hp < vars.maxHp && resources.chips >= repair_cost_full',
          effects: {
            'resources.chips': '-repair_cost_full',
            'resources.hp': 'MAX',
          },
          target: 'new_detroit:market_repair',
        },
        {
          buttonText: '🔧 Улучшить ходовую до ур. {vars.truckLevel + 1} ({truck_upgrade_cost} 💾)',
          condition: 'vars.truckLevel < 5 && resources.chips >= truck_upgrade_cost',
          effects: {
            'resources.chips': '-truck_upgrade_cost',
            'vars.truckLevel': '+1',
          },
          target: 'new_detroit:market_repair',
        },
        { buttonText: '⬅️ Вернуться в Гараж', target: 'new_detroit:garage' },
      ],
    },
  },
};
