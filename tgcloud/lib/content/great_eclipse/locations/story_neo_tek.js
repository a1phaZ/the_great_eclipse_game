export const storyNeoTek = {
  locationId: 'story_neo_tek',
  name: 'Сюжет: Нео-Тек',
  scenes: {
    // ---------------------------------------------------------------------
    // Q1 «Мёртвый эфир»
    // ---------------------------------------------------------------------
    q1_start: {
      text: [
        '🛰 **«МЁРТВЫЙ ЭФИР»**',
        '',
        'Гараж Нового Детройта. На капот ложится ладонь в стерильной перчатке. Лейтенант Корд из Нео-Тека предлагает работу: доехать до заброшенного ретранслятора «Орион» в серой зоне и демонтировать узел экранированного кабеля.',
        '',
        'Плата — 100 чипов.',
        '',
        '_Корд смотрит на вас, как на инструмент._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🤝 Принять условия',
          target: 'story_neo_tek:q1_road',
        },
        {
          buttonText: '💬 Блеф: выбить аванс (Удача 4)',
          condition: 'stats.luck >= 4',
          effects: { 'resources.chips': '+30' },
          target: 'story_neo_tek:q1_road',
        },
        {
          buttonText: '💬 Блеф: выбить аванс',
          condition: 'stats.luck < 4',
          target: 'story_neo_tek:q1_bluff_fail',
        },
      ],
    },

    q1_bluff_fail: {
      text: [
        '❌ **КОРД НЕ ВЕРИТ**',
        '',
        '«В Новом Детройте много голодных водителей. Наши датчики чисты. Либо ты берешься за работу, либо я найду того, кто сделает это за 80 чипов».',
        '',
        '_Охрана за спиной лейтенанта не двигается. Пока._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '😐 Согласиться на 100 чипов', target: 'story_neo_tek:q1_road' },
        { buttonText: '🚪 Уйти и хлопнуть дверью', target: 'new_detroit:story_board' },
      ],
    },

    q1_road: {
      text: [
        '🛣 **ДОРОГА К «ОРИОНУ»**',
        '',
        'Через тридцать километров навигатор сходит с ума. Дорогу перегородил остов бензовоза. Мародеры с арматурой требуют 40 чипов за проезд.',
        '',
        '_Или можно просто пробить баррикаду._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💾 Откупиться (−40 чипов)',
          condition: 'resources.chips >= 40',
          effects: { 'resources.chips': '-40' },
          target: 'story_neo_tek:q1_orion',
        },
        {
          buttonText: '💥 Таран (броня ≥ 70%)',
          condition: 'hp_percent >= 70',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.05)',
          },
          target: 'story_neo_tek:q1_orion',
        },
        {
          buttonText: '💥 Таран (броня < 70%)',
          condition: 'hp_percent < 70',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.30)',
          },
          target: 'story_neo_tek:q1_orion',
        },
      ],
    },

    q1_orion: {
      text: [
        '📡 **ВНУТРИ «ОРИОНА»**',
        '',
        'Накренившаяся бетонная башня. Кабель демонтирован, но аварийный терминал всё ещё светится зелёным. На экране — заблокированные логи двенадцатилетней давности.',
        '',
        '_Момент, когда погасло солнце._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '📦 Забрать кабель и уйти',
          effects: { 'flags.story.neo_tek.truth': '0' },
          target: 'story_neo_tek:q1_return',
        },
        {
          buttonText: '💻 Взломать логи (Уклонение 20)',
          condition: 'stats.evasion >= 20',
          effects: { 'flags.story.neo_tek.truth': '1' },
          target: 'story_neo_tek:q1_return',
        },
        {
          buttonText: '💻 Взломать логи',
          condition: 'stats.evasion < 20',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'flags.story.neo_tek.truth': '0',
          },
          target: 'story_neo_tek:q1_return',
        },
      ],
    },

    q1_return: {
      text: [
        '🏙 **ВОЗВРАЩЕНИЕ В ДЕТРОЙТ**',
        '',
        'Корд ждёт у ворот гаража. Его люди разгружают кабель. Лейтенант протягивает кошель с чипами.',
        '',
        '{neo_tek_truth_line}',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 Шантаж: «Завеса» — ваша работа (Удача 5)',
          condition: 'flags.story.neo_tek.truth && stats.luck >= 5',
          effects: {
            'resources.chips': '+150',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q1': '1',
          },
          target: 'story_neo_tek:q1_finish',
        },
        {
          buttonText: '🗣 Шантаж: «Завеса» — ваша работа',
          condition: 'flags.story.neo_tek.truth && stats.luck < 5',
          effects: {
            'resources.chips': '+50',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q1': '1',
          },
          target: 'story_neo_tek:q1_finish',
        },
        {
          buttonText: '🤐 Молча отдать кабель (+100 чипов)',
          effects: {
            'resources.chips': '+100',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q1': '1',
          },
          target: 'story_neo_tek:q1_finish',
        },
      ],
    },

    q1_finish: {
      text: [
        '✅ **«МЁРТВЫЙ ЭФИР» ЗАВЕРШЁН**',
        '',
        'Кабель у инженеров. Нео-Тек доволен, Бароны и Затмение — не очень.',
        '',
        '**+15 репутации Нео-Тек. −5 Баронам и Затмению.**',
        '',
        '_Следующий контракт откроется на 15 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q2 «Слепой штурман»
    // ---------------------------------------------------------------------
    q2_start: {
      text: [
        '🛰 **«СЛЕПОЙ ШТУРМАН»**',
        '',
        'Закрытый научный сектор Нео-Тека. На пассажирское сиденье сажают человека. Доктор Элиас, глаза скрыты плотной повязкой, в руках — модифицированный навигатор.',
        '',
        'Задача: доставить его на старый полигон в каньоне. Плата — 150 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '❓ Спросить, почему он слеп',
          target: 'story_neo_tek:q2_road',
        },
        {
          buttonText: '🗣 Намекнуть на «Завесу» (Удача 4)',
          condition: 'flags.story.neo_tek.truth && stats.luck >= 4',
          effects: { 'flags.story.neo_tek.elias_trust': '1' },
          target: 'story_neo_tek:q2_road',
        },
        {
          buttonText: '🗣 Намекнуть на «Завесу»',
          condition: 'flags.story.neo_tek.truth && stats.luck < 4',
          target: 'story_neo_tek:q2_road',
        },
      ],
    },

    q2_road: {
      text: [
        '🏜 **ЗАСАДА НА СТЫКЕ**',
        '',
        'Прибор Элиаса бешено пищит: «Небо видит нас!» С уступов скатываются ржавые внедорожники Детей Затмения. Путь перекрыт пулемётом.',
        '',
        '_Один шанс проскочить._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🏎 Вираж над пропастью (Ходовая 3)',
          condition: 'vars.truckLevel >= 3',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'resources.hp': '-round(vars.maxHp * 0.05)',
          },
          target: 'story_neo_tek:q2_polygon',
        },
        {
          buttonText: '🏎 Вираж над пропастью',
          condition: 'vars.truckLevel < 3',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.25)',
          },
          target: 'story_neo_tek:q2_polygon',
        },
      ],
    },

    q2_polygon: {
      text: [
        '🛰 **ПОЛИГОН И ЛАЗЕР**',
        '',
        'Элиас подключает навигатор к тарелке. Небо переливается фиолетовым. Датчик трака орёт: с орбиты наводится тепловой луч.',
        '',
        '_Техника или человек?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚚 Увести трак из-под удара',
          effects: { 'flags.story.neo_tek.navigator': '0' },
          target: 'story_neo_tek:q2_finish',
        },
        {
          buttonText: '🛠 Спасти Элиаса (Уклонение 25)',
          condition: 'stats.evasion >= 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.15)',
            'flags.story.neo_tek.navigator': '1',
          },
          target: 'story_neo_tek:q2_finish',
        },
        {
          buttonText: '🛠 Спасти Элиаса',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.30)',
            'flags.story.neo_tek.navigator': '0',
          },
          target: 'story_neo_tek:q2_finish',
        },
      ],
    },

    q2_finish: {
      text: [
        '🏙 **ИТОГИ НА ПЕПЕЛИЩЕ**',
        '',
        'Машина помята, на капоте копоть от космического оружия. Корд ждёт доклад.',
        '',
        '_Награда зависит от того, кого вы привезли._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🧑‍🔬 Сдать живого Элиаса (+200 чипов)',
          condition: 'flags.story.neo_tek.navigator',
          effects: {
            'resources.chips': '+200',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q2': '1',
          },
          target: 'story_neo_tek:q2_done',
        },
        {
          buttonText: '💾 Сдать обгоревший накопитель (+100 чипов)',
          condition: '!flags.story.neo_tek.navigator',
          effects: {
            'resources.chips': '+100',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q2': '1',
          },
          target: 'story_neo_tek:q2_done',
        },
      ],
    },

    q2_done: {
      text: [
        '✅ **«СЛЕПОЙ ШТУРМАН» ЗАВЕРШЁН**',
        '',
        'Нео-Тек получил данные. Элиас — или его накопитель — уже в лаборатории.',
        '',
        '**+15 репутации Нео-Тек. −5 Баронам и Затмению.**',
        '',
        '_Следующий контракт откроется на 30 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q3 «Логика предательства»
    // ---------------------------------------------------------------------
    q3_start: {
      text: [
        '🛰 **«ЛОГИКА ПРЕДАТЕЛЬСТВА»**',
        '',
        'В гараж врывается Корд с личной гвардией. Старший аналитик доктор Стерн взломал архив, украл чип со спецификациями «Гелиос-9» и бежал в Пустоши.',
        '',
        'Приказ: догнать и уничтожить. Награда — 200 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚚 Принять приказ',
          target: 'story_neo_tek:q3_chase',
        },
        {
          buttonText: '🗣 Потребовать объяснений (Удача 5)',
          condition: 'flags.story.neo_tek.navigator && stats.luck >= 5',
          target: 'story_neo_tek:q3_chase',
        },
        {
          buttonText: '🗣 Потребовать объяснений',
          condition: 'flags.story.neo_tek.navigator && stats.luck < 5',
          target: 'story_neo_tek:q3_chase',
        },
      ],
    },

    q3_chase: {
      text: [
        '🌪 **ПОГОНЯ В БУРЕ**',
        '',
        'Багги Стерна петляет между скалами. Видимость падает до нуля. Позади остаются магнитные мины, светящиеся красным.',
        '',
        '_Или прижать его к скале._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Прижать багги (Ходовая 4)',
          condition: 'vars.truckLevel >= 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.10)',
          },
          target: 'story_neo_tek:q3_roadside',
        },
        {
          buttonText: '💥 Прижать багги',
          condition: 'vars.truckLevel < 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.30)',
            'resources.hp': '-round(vars.maxHp * 0.35)',
          },
          target: 'story_neo_tek:q3_roadside',
        },
      ],
    },

    q3_roadside: {
      text: [
        '🩸 **ИСПОВЕДЬ НА ОБОЧИНЕ**',
        '',
        'Стерн зажат в обломках багги. В руке — украденный чип.',
        '',
        '«„Гелиос-9“ — это не связь. Это орбитальное оружие контроля. Завесу создали, чтобы скрыть подготовку к чистке Земли!»',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔫 Забрать чип и уйти',
          effects: { 'flags.story.neo_tek.traitor': '0' },
          target: 'story_neo_tek:q3_return',
        },
        {
          buttonText: '💻 Взломать чип на месте (Уклонение 30)',
          condition: 'stats.evasion >= 30',
          effects: {
            'flags.story.neo_tek.truth': '1',
            'flags.story.neo_tek.traitor': '1',
            'flags.story.neo_tek.evidence': '1',
          },
          target: 'story_neo_tek:q3_return',
        },
        {
          buttonText: '💻 Взломать чип на месте',
          condition: 'stats.evasion < 30',
          effects: { 'flags.story.neo_tek.traitor': '0' },
          target: 'story_neo_tek:q3_return',
        },
      ],
    },

    q3_return: {
      text: [
        '🏙 **ВОЗВРАЩЕНИЕ ВОЛКА**',
        '',
        'Корд встречает вас у гаража, постукивая пальцами по кобуре. Инженеры ждут чип.',
        '',
        '_Отдать оригинал, подделку — или соврать?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🎭 Подсунуть пустышку (Удача 6)',
          condition: 'flags.story.neo_tek.truth && flags.story.neo_tek.traitor && stats.luck >= 6',
          effects: {
            'resources.chips': '+200',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q3': '1',
            'flags.story.neo_tek.evidence': '1',
          },
          target: 'story_neo_tek:q3_done',
        },
        {
          buttonText: '🎭 Подсунуть пустышку',
          condition: 'flags.story.neo_tek.truth && flags.story.neo_tek.traitor && stats.luck < 6',
          effects: {
            'resources.chips': '+50',
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q3': '1',
          },
          target: 'story_neo_tek:q3_done',
        },
        {
          buttonText: '📦 Честно отдать чип (+200 чипов)',
          effects: {
            'resources.chips': '+200',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q3': '1',
          },
          target: 'story_neo_tek:q3_done',
        },
      ],
    },

    q3_done: {
      text: [
        '✅ **«ЛОГИКА ПРЕДАТЕЛЬСТВА» ЗАВЕРШЕНА**',
        '',
        'Стерн мёртв, чип у Нео-Тека. Или не совсем у Нео-Тека.',
        '',
        '**+15 репутации Нео-Тек. −5 Баронам и Затмению.**',
        '',
        '_Следующий контракт откроется на 45 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q4 «Квантовое сердце»
    // ---------------------------------------------------------------------
    q4_start: {
      text: [
        '🛰 **«КВАНТОВОЕ СЕРДЦЕ»**',
        '',
        'Бункер Нео-Тека. На голограмме — аванпост Баронов «Узел-42». В подземном хранилище лежит довоенный квантовый процессор «Aegis Corp».',
        '',
        'Без него инженеры не взломают спутники. Награда — 300 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🕶 Скрытный план',
          target: 'story_neo_tek:q4_perimeter',
        },
        {
          buttonText: '💥 Выбить боеприпасы (Удача 4)',
          condition: 'vars.repNeoTek >= 5 && stats.luck >= 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.05)',
            'flags.story.neo_tek.turret': '1',
          },
          target: 'story_neo_tek:q4_perimeter',
        },
        {
          buttonText: '💥 Выбить боеприпасы',
          condition: 'vars.repNeoTek >= 5 && stats.luck < 4',
          target: 'story_neo_tek:q4_perimeter',
        },
      ],
    },

    q4_perimeter: {
      text: [
        '🔦 **ПЕРИМЕТР «УЗЛА-42»**',
        '',
        'Прожекторы медленно поворачиваются в сторону укрытия. На вышках — пулемётчики Баронов.',
        '',
        '_Тихо или напролом?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💻 Перегрузить питание (Уклонение 25)',
          condition: 'stats.evasion >= 25',
          effects: { 'flags.story.neo_tek.barons_alerted': '0' },
          target: 'story_neo_tek:q4_vault',
        },
        {
          buttonText: '💻 Перегрузить питание',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.30)',
            'flags.story.neo_tek.barons_alerted': '1',
          },
          target: 'story_neo_tek:q4_vault',
        },
        {
          buttonText: '💥 Прорыв с турелью (Ходовая 4)',
          condition: 'flags.story.neo_tek.turret && vars.truckLevel >= 4',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'flags.story.neo_tek.barons_alerted': '1',
          },
          target: 'story_neo_tek:q4_vault',
        },
        {
          buttonText: '💥 Прорыв с турелью',
          condition: 'flags.story.neo_tek.turret && vars.truckLevel < 4',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.40)',
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'flags.story.neo_tek.barons_alerted': '1',
          },
          target: 'story_neo_tek:q4_vault',
        },
      ],
    },

    q4_vault: {
      text: [
        '🧊 **ВНУТРИ ХРАНИЛИЩА**',
        '',
        'Квантовый процессор мерцает неоновыми дорожками охлаждения. Консоль требует биометрию Лидера Нео-Тека.',
        '',
        '_Прибор заблокирован главой вашей собственной фракции._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🪓 Вырвать процессор силой',
          effects: { 'flags.story.neo_tek.processor_damaged': '1' },
          target: 'story_neo_tek:q4_exit',
        },
        {
          buttonText: '💻 Обойти биометрию (Уклонение 30)',
          condition: 'stats.evasion >= 30',
          effects: {
            'flags.story.neo_tek.processor_damaged': '0',
            'flags.story.neo_tek.truth': '1',
          },
          target: 'story_neo_tek:q4_exit',
        },
        {
          buttonText: '💻 Обойти биометрию',
          condition: 'stats.evasion < 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'flags.story.neo_tek.processor_damaged': '1',
          },
          target: 'story_neo_tek:q4_exit',
        },
      ],
    },

    q4_exit: {
      text: [
        '🚧 **РАЗВЯЗКА НА ВЫЕЗДЕ**',
        '',
        'Тяжёлый броневик Баронов блокирует выезд. По рации: «Оставь железку нам, расскажи, что замышляют высоколобые, и разойдёмся миром».',
        '',
        '_Верность или сделка?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚚 Прорваться к инженерам (Ходовая 3)',
          condition: 'vars.truckLevel >= 3 && !flags.story.neo_tek.processor_damaged',
          effects: {
            'resources.chips': '+300',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q4': '1',
            'flags.story.neo_tek.deal_barons': '0',
          },
          target: 'story_neo_tek:q4_done',
        },
        {
          buttonText: '🚚 Прорваться с повреждённым процессором',
          condition: 'vars.truckLevel >= 3 && flags.story.neo_tek.processor_damaged',
          effects: {
            'resources.chips': '+150',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q4': '1',
            'flags.story.neo_tek.deal_barons': '0',
          },
          target: 'story_neo_tek:q4_done',
        },
        {
          buttonText: '🚚 Прорваться',
          condition: 'vars.truckLevel < 3',
          effects: {
            'resources.chips': '-100',
            'resources.hp': '-round(vars.maxHp * 0.30)',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q4': '1',
            'flags.story.neo_tek.deal_barons': '0',
          },
          target: 'story_neo_tek:q4_done',
        },
        {
          buttonText: '🤝 Сделка с Баронами (+400 чипов)',
          effects: {
            'resources.chips': '+400',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q4': '1',
            'flags.story.neo_tek.deal_barons': '1',
          },
          target: 'story_neo_tek:q4_done',
        },
      ],
    },

    q4_done: {
      text: [
        '✅ **«КВАНТОВОЕ СЕРДЦЕ» ЗАВЕРШЕНО**',
        '',
        'Процессор покинул «Узел-42». Нео-Тек получил шанс дотянуться до орбиты.',
        '',
        '**+15 репутации Нео-Тек. −5 Баронам и Затмению.**',
        '',
        '_Следующий контракт откроется на 60 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q5 «Голос из облаков»
    // ---------------------------------------------------------------------
    q5_start: {
      text: [
        '🛰 **«ГОЛОС ИЗ ОБЛАКОВ»**',
        '',
        'Пик Одиночества. Ветер срывает обшивку с радарных тарелок. Квантовое сердце гудит в кузове.',
        '',
        'Нужно удержать плато, пока идёт калибровка. Плата — 300 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛡 Подготовить турели',
          target: 'story_neo_tek:q5_assault',
        },
        {
          buttonText: '🗣 Давить на Корда (Удача 5)',
          condition: 'flags.story.neo_tek.truth && stats.luck >= 5',
          effects: { 'flags.story.neo_tek.kord_confession': '1' },
          target: 'story_neo_tek:q5_assault',
        },
        {
          buttonText: '🗣 Давить на Корда',
          condition: 'flags.story.neo_tek.truth && stats.luck < 5',
          target: 'story_neo_tek:q5_assault',
        },
      ],
    },

    q5_assault: {
      text: [
        '🔥 **ШТУРМ СО СКЛОНОВ**',
        '',
        'Снизу прорываются грузовики Баронов под прикрытием смертников Затмения. Наперерез несётся брандер, начинённый взрывчаткой.',
        '',
        '_Один удар — и всё решится._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Столкнуть брандер (Ходовая 4)',
          condition: 'vars.truckLevel >= 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'resources.hp': '-round(vars.maxHp * 0.15)',
          },
          target: 'story_neo_tek:q5_code',
        },
        {
          buttonText: '💥 Столкнуть брандер',
          condition: 'vars.truckLevel < 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.40)',
          },
          target: 'story_neo_tek:q5_code',
        },
      ],
    },

    q5_code: {
      text: [
        '💻 **ИГРЫ С КОДОМ**',
        '',
        'Взрывы сбили частоту. На экране: «Потеря несущей. Квантовая матрица нестабильна». Орбита уже навела лазерные маркеры.',
        '',
        '_Две минуты на перепрошивку._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🛠 Перепрошить дешифратор (Уклонение 30)',
          condition: 'stats.evasion >= 30',
          effects: { 'vars.heliosSignal': '2' },
          target: 'story_neo_tek:q5_voice',
        },
        {
          buttonText: '🛠 Перепрошить дешифратор',
          condition: 'stats.evasion < 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'vars.heliosSignal': '1',
          },
          target: 'story_neo_tek:q5_voice',
        },
      ],
    },

    q5_voice: {
      text: [
        '📡 **ГОЛОС ИЗ БЕЗДНЫ**',
        '',
        'Динамики замолкают. Затем звучит синтетический голос «Гелиос-9».',
        '',
        'Статус связи: **{helios_signal_text}**.',
        '',
        '_Нео-Тек ждёт результата._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '📶 Полный сигнал (+300 чипов)',
          condition: 'vars.heliosSignal >= 2',
          effects: {
            'resources.chips': '+300',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q5': '1',
            'flags.story.neo_tek.helios_failed': '0',
          },
          target: 'story_neo_tek:q5_done',
        },
        {
          buttonText: '📶 Искажённый сигнал (+150 чипов)',
          condition: 'vars.heliosSignal < 2',
          effects: {
            'resources.chips': '+150',
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q5': '1',
            'flags.story.neo_tek.helios_failed': '1',
          },
          target: 'story_neo_tek:q5_done',
        },
      ],
    },

    q5_done: {
      text: [
        '✅ **«ГОЛОС ИЗ ОБЛАКОВ» ЗАВЕРШЁН**',
        '',
        'Орбита ответила. Теперь вы знаете, что Нео-Тек готовы нажать последнюю кнопку.',
        '',
        '**+15 репутации Нео-Тек. −5 Баронам и Затмению.**',
        '',
        '_Финал «Выбор Прометея» откроется на 75 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q6 «Выбор Прометея» — финал цепочки
    // ---------------------------------------------------------------------
    q6_start: {
      text: [
        '🛰 **«ВЫБОР ПРОМЕТЕЯ»**',
        '',
        'Новая Лаборатория Детройта содрогается от взрывов. Бароны штурмуют южные ворота, Дети Затмения взрывают себя у гермозатворов.',
        '',
        'Корд с окровавленной повязкой: «Финальный код на крыше! Протарань их флагман, иначе генераторы не доживут до ответа спутника!»',
        '',
        '{neo_tek_truth_line}',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Таран флагмана (броня ≥ 50%, Ходовая 4)',
          condition: 'hp_percent >= 50 && vars.truckLevel >= 4',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.90)',
            'flags.story.neo_tek.truck_wrecked': '1',
          },
          target: 'story_neo_tek:q6_roof',
        },
        {
          buttonText: '💥 Таран флагмана',
          condition: 'hp_percent < 50 || vars.truckLevel < 4',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.90)',
            'resources.diesel': '-round(vars.maxDiesel * 0.50)',
            'flags.story.neo_tek.truck_wrecked': '1',
          },
          target: 'story_neo_tek:q6_roof',
        },
        {
          buttonText: '🛡 Оборона турелями (Уклонение 25)',
          condition: 'stats.evasion >= 25',
          target: 'story_neo_tek:q6_roof',
        },
        {
          buttonText: '🛡 Оборона турелями',
          condition: 'stats.evasion < 25',
          effects: { 'resources.hp': '-round(vars.maxHp * 0.40)' },
          target: 'story_neo_tek:q6_roof',
        },
      ],
    },

    q6_roof: {
      text: [
        '🌑 **ДУЭЛЬ НА КРЫШЕ**',
        '',
        'Под свинцовым небом гудит антенна. Из тени выходит Жрец Детей Затмения с детонационной сумкой.',
        '',
        '«Отдайте код, и мы погрузим Тракт в благословенную Вечную Ночь!»',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 Переубедить Жреца (Удача 6)',
          condition: 'flags.story.neo_tek.truth && stats.luck >= 6',
          effects: { 'flags.story.neo_tek.priest_alive': '1' },
          target: 'story_neo_tek:q6_choice',
        },
        {
          buttonText: '🗣 Переубедить Жреца',
          condition: 'flags.story.neo_tek.truth && stats.luck < 6',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'flags.story.neo_tek.priest_alive': '0',
          },
          target: 'story_neo_tek:q6_choice',
        },
        {
          buttonText: '🔫 Выстрелить первым',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'flags.story.neo_tek.priest_alive': '0',
          },
          target: 'story_neo_tek:q6_choice',
        },
      ],
    },

    q6_choice: {
      text: [
        '🖥 **ВЕЛИКИЙ ИЗЛОМ**',
        '',
        'На экране мигают протоколы. «Гелиос-9» над Новым Детройтом. Снизу — гусеницы Баронов.',
        '',
        '_Выберите, каким будет новый мир._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '☀️ Протокол 1: «Новый Рассвет»',
          condition: 'vars.repNeoTek >= 75',
          effects: {
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q6': '1',
          },
          target: 'endings:new_dawn',
        },
        {
          buttonText: '⛓ Протокол 2: «Железный Прогресс»',
          condition: 'flags.story.neo_tek.deal_barons',
          effects: {
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q6': '1',
          },
          target: 'endings:iron_progress_poisoned',
        },
        {
          buttonText: '🌑 Протокол 3: «Сигнал Принят»',
          condition: 'flags.story.neo_tek.priest_alive',
          effects: {
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q6': '1',
          },
          target: 'endings:signal_accepted',
        },
        {
          buttonText: '🚚 Протокол 4: «Бесконечная Дорога»',
          effects: {
            'vars.repNeoTek': '+15',
            'vars.repRustyBarons': '-5',
            'vars.repEclipse': '-5',
            'flags.story.neo_tek.q6': '1',
          },
          target: 'endings:endless_road',
        },
      ],
    },
  },
};
