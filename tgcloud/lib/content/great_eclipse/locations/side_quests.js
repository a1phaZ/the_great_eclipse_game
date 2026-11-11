export const sideQuests = {
  locationId: 'side_quests',
  name: 'Побочные выезды',
  scenes: {
    // ---------------------------------------------------------------------
    // Нео-Тек: сбор телеметрии
    // ---------------------------------------------------------------------
    neo_tek_start: {
      text: [
        '📡 **СБОР ТЕЛЕМЕТРИИ**',
        '',
        'Заброшенная метеостанция Нео-Тек на краю соляных полей. Антенна цела, но терминал мёртв — нужен внешний источник питания.',
        '',
        '_Данные с датчиков ещё можно спасти._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💾 Взломать терминал (−15 чипов)',
          condition: 'resources.chips >= 15',
          effects: { 'resources.chips': '-15' },
          target: 'side_quests:neo_tek_middle',
        },
        {
          buttonText: '🔌 Запитать от трака (−5 дизеля)',
          condition: 'resources.diesel >= 5',
          effects: { 'resources.diesel': '-5' },
          target: 'side_quests:neo_tek_middle',
        },
      ],
    },

    neo_tek_middle: {
      text: [
        '💾 **ТЕРМИНАЛ ОЖИЛ**',
        '',
        'По экрану бегут строки телеметрии. За двенадцать лет станция записала каждый шёпот орбиты.',
        '',
        '_Можно отдать данные целиком или сначала скопировать себе._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '📼 Скопировать себе (+60 чипов)',
          effects: {
            'resources.chips': '+60',
            'vars.repNeoTek': '+2',
            'vars.repRustyBarons': '-1',
            'vars.repEclipse': '-1',
            'vars.sideCooldownUntil': 'now() + side_quest_cooldown_ms',
            'flags.side.active': '0',
            'flags.side.neo_tek_survey': '0',
          },
          target: 'side_quests:neo_tek_finish',
        },
        {
          buttonText: '📡 Отдать данные Нео-Тек',
          effects: {
            'resources.chips': '+80',
            'vars.repNeoTek': '+2',
            'vars.repRustyBarons': '-1',
            'vars.repEclipse': '-1',
            'vars.sideCooldownUntil': 'now() + side_quest_cooldown_ms',
            'flags.side.active': '0',
            'flags.side.neo_tek_survey': '0',
          },
          target: 'side_quests:neo_tek_finish',
        },
      ],
    },

    neo_tek_finish: {
      text: [
        '✅ **ЗАДАНИЕ ВЫПОЛНЕНО**',
        '',
        'Данные ушли в эфир. Нео-Тек подтвердил приём и начислил оплату.',
        '',
        '**+2 репутации Нео-Тек.** Бароны и Затмение теряют по 1.',
        '',
        '_Пора выбирать, куда ехать дальше._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🏙 В Новый Детройт',
          effects: { 'vars.destination': 'new_detroit:garage' },
          target: '@router:highway',
        },
        {
          buttonText: '⛽ На Выселки',
          effects: { 'vars.destination': 'rusty_outpost:garage' },
          target: '@router:highway',
        },
      ],
    },

    // ---------------------------------------------------------------------
    // Ржавые Бароны: дань Выселкам
    // ---------------------------------------------------------------------
    baron_start: {
      text: [
        '⛓ **ДАНЬ ВЫСЕЛКАМ**',
        '',
        'Ферма на краю Выселок не заплатила Баронам. Хозяин — упрямый старик с дробовиком и тремя работниками.',
        '',
        '_Нужно напомнить, кто здесь хозяин._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Пригрозить (риск −10 HP)',
          effects: { 'resources.hp': '-10' },
          target: 'side_quests:baron_middle',
        },
        {
          buttonText: '🤝 Договориться (−30 чипов)',
          condition: 'resources.chips >= 30',
          effects: { 'resources.chips': '-30' },
          target: 'side_quests:baron_middle',
        },
      ],
    },

    baron_middle: {
      text: [
        '🛢 **АМБАР**',
        '',
        'Старик отсчитывает топливо. В баке трака плещется дизель, в ящике — чипы.',
        '',
        '_Можно забрать всё или оставить ферме на посевную._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛢 Забрать всё (+10 дизеля)',
          effects: {
            'resources.diesel': '+10',
            'resources.chips': '+60',
            'vars.repRustyBarons': '+2',
            'vars.repNeoTek': '-1',
            'vars.repEclipse': '-1',
            'vars.sideCooldownUntil': 'now() + side_quest_cooldown_ms',
            'flags.side.active': '0',
            'flags.side.baron_tribute': '0',
          },
          target: 'side_quests:baron_finish',
        },
        {
          buttonText: '💾 Оставить часть (+50 чипов)',
          effects: {
            'resources.chips': '+50',
            'vars.repRustyBarons': '+2',
            'vars.repNeoTek': '-1',
            'vars.repEclipse': '-1',
            'vars.sideCooldownUntil': 'now() + side_quest_cooldown_ms',
            'flags.side.active': '0',
            'flags.side.baron_tribute': '0',
          },
          target: 'side_quests:baron_finish',
        },
      ],
    },

    baron_finish: {
      text: [
        '✅ **ЗАДАНИЕ ВЫПОЛНЕНО**',
        '',
        'Дань собрана. Бароны довольно рычат в рацию и переводят оплату.',
        '',
        '**+2 репутации Ржавых Баронов.** Нео-Тек и Затмение теряют по 1.',
        '',
        '_Пора выбирать, куда ехать дальше._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🏙 В Новый Детройт',
          effects: { 'vars.destination': 'new_detroit:garage' },
          target: '@router:highway',
        },
        {
          buttonText: '⛽ На Выселки',
          effects: { 'vars.destination': 'rusty_outpost:garage' },
          target: '@router:highway',
        },
      ],
    },

    // ---------------------------------------------------------------------
    // Дети Затмения: проводник паломников
    // ---------------------------------------------------------------------
    eclipse_start: {
      text: [
        '🌑 **ПРОВОДНИК ПАЛОМНИКОВ**',
        '',
        'Три паломника Детей Затмения просят довести их до затмённых руин. Впереди — пыльная буря.',
        '',
        '_Они верят, что вы знаете дорогу. Возможно, так и есть._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚚 Ехать медленно (−10 дизеля)',
          condition: 'resources.diesel >= 10',
          effects: { 'resources.diesel': '-10' },
          target: 'side_quests:eclipse_middle',
        },
        {
          buttonText: '⚡ Рискнуть напрямик (−15 HP)',
          effects: { 'resources.hp': '-15' },
          target: 'side_quests:eclipse_middle',
        },
      ],
    },

    eclipse_middle: {
      text: [
        '🌪 **В БУРЕ**',
        '',
        'Пыль съедает фары. Один паломник отстал и стучит по броне снаружи.',
        '',
        '_Остановиться — потерять время. Не остановиться — потерять человека._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛠 Спасти отставшего (−20 HP)',
          condition: 'resources.hp > 20',
          effects: {
            'resources.hp': '-20',
            'resources.chips': '+50',
            'vars.repEclipse': '+2',
            'vars.repNeoTek': '-1',
            'vars.repRustyBarons': '-1',
            'vars.sideCooldownUntil': 'now() + side_quest_cooldown_ms',
            'flags.side.active': '0',
            'flags.side.eclipse_pilgrim': '0',
          },
          target: 'side_quests:eclipse_finish',
        },
        {
          buttonText: '➡️ Не останавливаться',
          effects: {
            'resources.chips': '+50',
            'vars.repEclipse': '+2',
            'vars.repNeoTek': '-1',
            'vars.repRustyBarons': '-1',
            'vars.sideCooldownUntil': 'now() + side_quest_cooldown_ms',
            'flags.side.active': '0',
            'flags.side.eclipse_pilgrim': '0',
          },
          target: 'side_quests:eclipse_finish',
        },
      ],
    },

    eclipse_finish: {
      text: [
        '✅ **ЗАДАНИЕ ВЫПОЛНЕНО**',
        '',
        'Паломники добрались до руин и долго кланялись мёртвому небу. Оплата — в конверте с печатью культа.',
        '',
        '**+2 репутации Детей Затмения.** Нео-Тек и Бароны теряют по 1.',
        '',
        '_Пора выбирать, куда ехать дальше._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🏙 В Новый Детройт',
          effects: { 'vars.destination': 'new_detroit:garage' },
          target: '@router:highway',
        },
        {
          buttonText: '⛽ На Выселки',
          effects: { 'vars.destination': 'rusty_outpost:garage' },
          target: '@router:highway',
        },
      ],
    },
  },
};
