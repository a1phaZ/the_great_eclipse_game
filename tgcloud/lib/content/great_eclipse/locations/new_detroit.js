export const newDetroit = {
  locationId: 'new_detroit',
  name: 'Новый Детройт',
  scenes: {
    garage: {
      text: [
        '🛠 **ГАРАЖ: УБЕЖИЩЕ «РЖАВЫЙ БОЛТ»**',
        '',
        'Вы находитесь в своем Гараже. Двигатель трака `{vars.truckModel}` мерно рокочет.',
        '',
        '📊 **Ваш Профиль:**',
        '• 💾 Чипы: `{resources.chips}`',
        '• 🚜 Прочность: `{resources.hp}/{vars.maxHp} HP`',
        '• 🎖 Уровень трака: `{vars.truckLevel}`',
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
        { buttonText: '⬅️ Вернуться в Гараж', target: 'new_detroit:garage' },
      ],
    },

    job_board: {
      text: [
        '📋 **ДОСКА ОБЪЯВЛЕНИЙ**',
        '',
        'На доске три бумажки с печатями фракций. Работа всегда найдётся — было бы чем платить.',
        '',
        '📊 **Ваша репутация:**',
        '• 🛰 Нео-Тек: `{vars.repNeoTek}/100`',
        '• ⛓ Ржавые Бароны: `{vars.repRustyBarons}/100`',
        '• 🌑 Дети Затмения: `{vars.repEclipse}/100`',
        '',
        '_Побочные задания можно выполнять повторно._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛰 Нео-Тек: сдать данные (−10 дизеля)',
          condition: 'resources.diesel >= 10',
          effects: {
            'resources.diesel': '-10',
            'vars.repNeoTek': '+6',
          },
          target: 'new_detroit:job_board',
        },
        {
          buttonText: '⛓ Бароны: заплатить дань (−40 чипов)',
          condition: 'resources.chips >= 40',
          effects: {
            'resources.chips': '-40',
            'vars.repRustyBarons': '+6',
          },
          target: 'new_detroit:job_board',
        },
        {
          buttonText: '🌑 Затмение: подношение (−15 чипов)',
          condition: 'resources.chips >= 15',
          effects: {
            'resources.chips': '-15',
            'vars.repEclipse': '+6',
          },
          target: 'new_detroit:job_board',
        },
        { buttonText: '🎁 Награды фракций', target: 'new_detroit:faction_rewards' },
        { buttonText: '⬅️ Вернуться в бар', target: 'new_detroit:bar' },
      ],
    },

    faction_rewards: {
      text: [
        '🎁 **НАГРАДЫ ФРАКЦИЙ**',
        '',
        `За верность платят снаряжением. Нужно **{faction_reward_rep}** очков репутации.`,
        '',
        '📊 **Прогресс:**',
        '• 🛰 Нео-Тек: `{vars.repNeoTek}/{faction_reward_rep}`',
        '• ⛓ Ржавые Бароны: `{vars.repRustyBarons}/{faction_reward_rep}`',
        '• 🌑 Дети Затмения: `{vars.repEclipse}/{faction_reward_rep}`',
        '',
        '_Модуль выдаётся один раз._',
        '',
        '{inventorySummary()}',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛰 Получить сканер Нео-Тек',
          condition: `vars.repNeoTek >= faction_reward_rep && !hasItem('neo_tek_scanner')`,
          effects: { 'inventory.neo_tek_scanner.qty': '1' },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '🛡 Получить броню Баронов',
          condition: `vars.repRustyBarons >= faction_reward_rep && !hasItem('baron_plating')`,
          effects: { 'inventory.baron_plating.qty': '1' },
          target: 'new_detroit:faction_rewards',
        },
        {
          buttonText: '🌑 Получить ядро Затмения',
          condition: `vars.repEclipse >= faction_reward_rep && !hasItem('eclipse_core')`,
          effects: { 'inventory.eclipse_core.qty': '1' },
          target: 'new_detroit:faction_rewards',
        },
        { buttonText: '⬅️ Вернуться к доске', target: 'new_detroit:job_board' },
      ],
    },

    market_repair: {
      text: [
        '🔧 **АВТОМАСТЕРСКАЯ «У ГАНСА»**',
        '',
        'Старик Ганс осматривает обшивку вашего броневика.',
        '',
        '📋 **Смета на ремонт:**',
        '• Текущая прочность: `{resources.hp}/{vars.maxHp} HP`',
        '• Стоимость восстановления 1 HP: `{repair_price_per_hp} 💾`',
        '• Итого за полную починку: **`{repair_cost_full} 💾`**',
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
        { buttonText: '⬅️ Вернуться в Гараж', target: 'new_detroit:garage' },
      ],
    },
  },
};
