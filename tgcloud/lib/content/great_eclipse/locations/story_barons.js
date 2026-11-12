export const storyBarons = {
  locationId: 'story_barons',
  name: 'Сюжет: Ржавые Бароны',
  scenes: {
    // ---------------------------------------------------------------------
    // Q1 «Дым над Трактом»
    // ---------------------------------------------------------------------
    q1_start: {
      text: [
        '⛓ **«ДЫМ НАД ТРАКТОМ»**',
        '',
        'Полумрак бара «Ржавый Поршень» пропитан запахом дешёвого спирта и мазута. Напротив вас сидит Свирепый Следж — наместник Ржавых Баронов. Его кибернетический протез со скрежетом сжимает стакан.',
        '',
        'Работа простая: доставить тяжёлую цистерну топлива на передовой блокпост «Форт-Танк». Плата — 120 чипов.',
        '',
        '_Следж смотрит на вас, как на ещё один поршень в своём двигателе._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🤝 Молча кивнуть и взять путевой лист',
          target: 'story_barons:q1_road',
        },
        {
          buttonText: '💬 Торг: аванс на патроны (Удача 5)',
          condition: 'stats.luck >= 5',
          effects: { 'resources.chips': '+30' },
          target: 'story_barons:q1_res_bargain_ok',
        },
        {
          buttonText: '💬 Торг: аванс на патроны',
          condition: 'stats.luck < 5',
          target: 'story_barons:q1_bargain_fail',
        },
      ],
    },

    q1_res_bargain_ok: {
      text: [
        '😂 **«А ТЫ С ЗУБАМИ, ГРЯЗЕВИК!»**',
        '',
        'Следж громко хохочет, хлопая железной ладонью по столбу так, что стакан подпрыгивает.',
        '',
        '«Ладно, держи тридцать сверху. Но если сольёшь бензин по дороге — я лично сделаю из твоего черепа пепельницу».',
        '',
        '**+30 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Загрузить цистерну', target: 'story_barons:q1_road' },
      ],
    },

    q1_bargain_fail: {
      text: [
        '✊ **ЖЕЛЕЗНАЯ РУКА**',
        '',
        'Улыбка сползает с лица Следжа. Он рывком притягивает вас за шиворот через стол.',
        '',
        '«Ты путаешь берега, водила. Моя цена — сто чипов. И теперь ты либо едешь за соточку, либо твои колёса прямо сейчас пойдут на переплавку».',
        '',
        '_За соседними столами поднимаются двое его людей._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '😤 Проглотить обиду и взять контракт',
          effects: { 'flags.story.barons.q1_low_rate': '1' },
          target: 'story_barons:q1_road',
        },
        {
          buttonText: '🚪 Вырваться и уйти',
          target: 'story_barons:q1_res_refuse',
        },
      ],
    },

    q1_res_refuse: {
      text: [
        '🚪 **ОТКАЗ**',
        '',
        'Вы выходите в ночь, оставив Следжа с его стаканом. Уже на улице вас окликают из тени: двое в серых робах, с чётками из стреляных гильз.',
        '',
        '«Бароны не ценят тех, кто умеет говорить нет. Зато мы ценим».',
        '',
        'На следующий день гараж приходит в запустение — Бароны вычеркнули вас из своих списков.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '⬅️ К фракционным делам',
          effects: {
            'vars.repRustyBarons': '-3',
            'vars.repEclipse': '+1',
          },
          target: 'new_detroit:story_board',
        },
      ],
    },

    q1_road: {
      text: [
        '🌉 **ПОГОНЯ НА МОСТУ МИЛЛ-КРИК**',
        '',
        'Многотонная цистерна ревёт на подъёме. В зеркалах вспыхивают неоновые огни: лёгкие багги Детей Затмения зажимают вас в клещи и забрасывают кузов зажигательными бомбами.',
        '',
        'Впереди — полуразрушенный мост с двухметровым проломом. Объезда нет.',
        '',
        '_Либо прыжок, либо трюк с гидравликой._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚀 Форсаж и прыжок (броня ≥ 75%)',
          condition: 'hp_percent >= 75',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.10)',
          },
          target: 'story_barons:q1_res_jump_ok',
        },
        {
          buttonText: '🚀 Форсаж и прыжок',
          condition: 'hp_percent < 75',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.35)',
            'resources.hp': '-round(vars.maxHp * 0.30)',
          },
          target: 'story_barons:q1_res_jump_fail',
        },
        {
          buttonText: '🧯 Сброс давления и занос (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'resources.hp': '-round(vars.maxHp * 0.05)',
          },
          target: 'story_barons:q1_res_maneuver_ok',
        },
        {
          buttonText: '🧯 Сброс давления и занос',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.25)',
          },
          target: 'story_barons:q1_res_maneuver_fail',
        },
      ],
    },

    q1_res_jump_ok: {
      text: [
        '🚀 **ПРЫЖОК**',
        '',
        'Трак с рёвом перелетает расщелину. Жёсткий удар выбивает искры из подвески, цистерна лязгает креплениями — но вы уже уходите, оставив багги на другом берегу.',
        '',
        '_Подвеска стонет, но держит._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q1_secret' },
      ],
    },

    q1_res_jump_fail: {
      text: [
        '💥 **ПРОГНИВШИЕ ЛОНЖЕРОНЫ**',
        '',
        'Рама не выдерживает удара. Трак бьётся бампером о край моста, с мясом вырывая кусок обшивки радиатора.',
        '',
        'Двигатель хрипит, но вы всё-таки выползаете на трассу. Рейдеры отстают, не рискуя повторить ваш трюк.',
        '',
        '_Цистерна цела. Машина — нет._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q1_secret' },
      ],
    },

    q1_res_maneuver_ok: {
      text: [
        '🧯 **ЮЗОМ ПО МОСТУ**',
        '',
        'Вы вовремя стравливаете гидравлику. Трак идёт юзом и перекрывает проезд цистерной.',
        '',
        'Одна багги врезается в остов моста и вспыхивает, остальные отступают в темноту.',
        '',
        '_Рейдеры запомнили этот занос._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q1_secret' },
      ],
    },

    q1_res_maneuver_fail: {
      text: [
        '🔥 **КЛИН ТОРМОЗОВ**',
        '',
        'Тормоза клинит намертво. Цистерну заносит и бьёт о перила моста, а горючая смесь рейдеров поджигает кормовой отсек.',
        '',
        'Вы сбиваете пламя огнетушителем, кашляя мазутной гарью.',
        '',
        '_Крепления цистерны держатся на честном слове._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q1_secret' },
      ],
    },

    q1_secret: {
      text: [
        '⚗️ **СЕКРЕТ МЁРТВОЙ ЖИЖИ**',
        '',
        'Буря стихла. Вы останавливаетесь в Пустошах проверить крепления. Из клапана под давлением сочится странная чёрная жижа.',
        '',
        'Портативный анализатор топлива мигает, требуя команды.',
        '',
        '_Чистое любопытство. Или чистая паранойя._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🙈 Закрутить вентиль и ехать',
          effects: { 'flags.story.barons.knows_fuel_shortage': '0' },
          target: 'story_barons:q1_finish',
        },
        {
          buttonText: '🔬 Экспресс-анализ состава (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: { 'flags.story.barons.knows_fuel_shortage': '1' },
          target: 'story_barons:q1_res_scan_ok',
        },
        {
          buttonText: '🔬 Экспресс-анализ состава',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'flags.story.barons.knows_fuel_shortage': '0',
          },
          target: 'story_barons:q1_res_scan_fail',
        },
      ],
    },

    q1_res_scan_ok: {
      text: [
        '🧪 **СИНТЕТИЧЕСКИЙ ЯД**',
        '',
        'Экран выдаёт отчёт: это не очищенная нефть. Тяжёлый токсичный синтезат, разбавленный старыми военными присадками.',
        '',
        'Скважины Баронов пусты. Их власть — огромный блеф перед всем Трактом, а эрзац-топливо медленно убивает двигатели городов.',
        '',
        '**Вы узнали главную тайну Ржавых Баронов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q1_finish' },
      ],
    },

    q1_res_scan_fail: {
      text: [
        '🤢 **СТРУЯ В ЛИЦО**',
        '',
        'Бортовая сеть повреждена после моста — сканер выдаёт системную ошибку. Жижа бьёт струёй из клапана, разъедая перчатки и обжигая кожу.',
        '',
        'Вы отшатываетесь, ругаясь сквозь зубы, и заматываете руки бинтом.',
        '',
        '_Флаг остался закрытым._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q1_finish' },
      ],
    },

    q1_finish: {
      text: [
        '🏰 **БЛОКПОСТ «ФОРТ-ТАНК»**',
        '',
        'Тяжёлые стальные ворота открываются со скрежетом. Смотритель Гадж — суровый старик в промасленном плаще — принимает цистерну и готовит выплату.',
        '',
        'Он пересчитывает чипы, не поднимая глаз.',
        '',
        '_Самое время вспомнить, что вы узнали в Пустошах._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 «Ваши цистерны пусты, старик» (Удача 7)',
          condition: 'flags.story.barons.knows_fuel_shortage && stats.luck >= 7',
          effects: {
            'resources.chips': '+220',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q1': '1',
          },
          target: 'story_barons:q1_res_blackmail_ok',
        },
        {
          buttonText: '🗣 «Ваши цистерны пусты, старик»',
          condition: 'flags.story.barons.knows_fuel_shortage && stats.luck < 7',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.15)',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q1': '1',
          },
          target: 'story_barons:q1_res_blackmail_fail',
        },
        {
          buttonText: '🤝 Молча сдать груз (+120 чипов)',
          condition: '!flags.story.barons.q1_low_rate',
          effects: {
            'resources.chips': '+120',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q1': '1',
          },
          target: 'story_barons:q1_res_pragmatic',
        },
        {
          buttonText: '🤝 Молча сдать груз (+100 чипов)',
          condition: 'flags.story.barons.q1_low_rate',
          effects: {
            'resources.chips': '+100',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q1': '1',
          },
          target: 'story_barons:q1_res_pragmatic',
        },
      ],
    },

    q1_res_blackmail_ok: {
      text: [
        '🤫 **ЯЗЫК ЗА ЗУБАМИ**',
        '',
        'Гадж бледнеет. Его рука дёргается к кобуре — и замирает.',
        '',
        'Он судорожно оглядывается и шипит: «Заткнись, грязевик! Вот тебе ещё сто чипов из личной заначки. Язык за зубами, или Тракт утонет в крови раньше, чем ты доедешь до Нового Детройта».',
        '',
        '**+220 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q1_done' },
      ],
    },

    q1_res_blackmail_fail: {
      text: [
        '🔨 **ПРИКЛАДОМ ПО ЗУБАМ**',
        '',
        'Гадж холодно усмехается: «Мертвецы не болтают».',
        '',
        'Сильный удар прикладом сбивает вас с ног. Охрана вытаскивает вас за ворота и швыряет в грязь.',
        '',
        '**+0 чипов. Броня помята, компромат остался в КПК.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q1_done' },
      ],
    },

    q1_res_pragmatic: {
      text: [
        '💾 **РАСЧЁТ НА МЕСТЕ**',
        '',
        'Вы молча сдаёте цистерну и забираете чипы. Гадж кивает: «Топливо в срок. Бароны такого не забывают».',
        '',
        'Цистерна уходит в резервуары «Форт-Танка», а вы уже разворачиваете трак к трассе.',
        '',
        '_Работа есть работа._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q1_done' },
      ],
    },

    q1_done: {
      text: [
        '✅ **«ДЫМ НАД ТРАКТОМ» ЗАВЕРШЁН**',
        '',
        'Цистерна в «Форт-Танке». Ржавые Бароны довольны, Нео-Тек и Затмение — не очень.',
        '',
        '**+15 репутации Ржавых Баронов. −5 Нео-Теку и Затмению.**',
        '',
        '_Следующий квест откроется на 15 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q2 «Сухой остаток»
    // ---------------------------------------------------------------------
    q2_start: {
      text: [
        '🏭 **«СУХОЙ ОСТАТОК»**',
        '',
        'Главная нефтебаза Баронов — «Титан». Ржавые гигантские резервуары уходят в серое небо, гидравлические молоты бьют по трубам.',
        '',
        'Свирепый Следж недовольно рассматривает ваш побитый трак. Бароны расширяют бурение в каньонах и нанимают вас перевезти тяжёлые насосные системы.',
        '',
        'Базовая ставка — 150 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🤝 Принять работу',
          target: 'story_barons:q2_road',
        },
        {
          buttonText: '💬 Напомнить о пустых баках (Удача 6)',
          condition: 'flags.story.barons.knows_fuel_shortage && stats.luck >= 6',
          effects: { 'resources.chips': '+50' },
          target: 'story_barons:q2_res_blackmail_ok',
        },
        {
          buttonText: '💬 Напомнить о пустых баках',
          condition: 'flags.story.barons.knows_fuel_shortage && stats.luck < 6',
          effects: { 'flags.story.barons.q2_low_rate': '1' },
          target: 'story_barons:q2_res_blackmail_fail',
        },
      ],
    },

    q2_res_blackmail_ok: {
      text: [
        '🦷 **СКРИП ЗУБОВ**',
        '',
        'Следж скрипит зубами так, что слышно в другом конце ангара.',
        '',
        'Он швыряет вам мешочек: «Держи пятьдесят аванса, шантажист хренов. Но учти — на этой дороге несчастные случаи происходят постоянно».',
        '',
        '**+50 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ К погрузочному доку', target: 'story_barons:q2_road' },
      ],
    },

    q2_res_blackmail_fail: {
      text: [
        '🪣 **ПЛЕВОК НА ПОЛ**',
        '',
        'Следж сплёвывает на бетон: «Твои пугалки на меня не работают, червь».',
        '',
        '«Либо бери груз за сто двадцать, либо катись к своим инженеришкам, пока я не пустил тебя на фарш».',
        '',
        '_Ставка урезана._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ К погрузочному доку', target: 'story_barons:q2_road' },
      ],
    },

    q2_road: {
      text: [
        '🔥 **ЗАСАДА НА НЕФТЕПРОВОДЕ**',
        '',
        'На подъезде к распределительному узлу дорогу перекрывает засада Детей Затмения. Открытый участок трубы подожжён — впереди стена бушующего пламени.',
        '',
        'Фанатики закидывают трак бутылками с горючей смесью.',
        '',
        '_Напролом или охладить обшивку?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔥 Таран сквозь огонь (Вождение 4)',
          condition: 'vars.truckLevel >= 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.10)',
          },
          target: 'story_barons:q2_res_ram_ok',
        },
        {
          buttonText: '🔥 Таран сквозь огонь',
          condition: 'vars.truckLevel < 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.30)',
            'resources.hp': '-round(vars.maxHp * 0.35)',
          },
          target: 'story_barons:q2_res_ram_fail',
        },
        {
          buttonText: '🧊 Выпустить хладагент на обшивку (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: { 'resources.diesel': '-round(vars.maxDiesel * 0.10)' },
          target: 'story_barons:q2_res_coolant_ok',
        },
        {
          buttonText: '🧊 Выпустить хладагент на обшивку',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.20)',
          },
          target: 'story_barons:q2_res_coolant_fail',
        },
      ],
    },

    q2_res_ram_ok: {
      text: [
        '🔥 **СКВОЗЬ ПЛАМЯ**',
        '',
        'Трак пролетает огненный ад. Колёса обгорают, краска пузырится, но броня держит удар.',
        '',
        'Вы вырываетесь из кольца окружения, оставив фанатиков позади.',
        '',
        '_Двигатель ревёт, как ни в чём не бывало._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q2_node' },
      ],
    },

    q2_res_ram_fail: {
      text: [
        '💥 **РАСПЛАВЛЕННЫЙ АСФАЛЬТ**',
        '',
        'Трак заносит на размягчённом асфальте. Вы врезаетесь в ржавое ограждение, машина вспыхивает, краска сходит пластами.',
        '',
        'Вы сбиваете огонь и выползаете из-под обстрела на дымящем радиаторе.',
        '',
        '_Трак едва дышит._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q2_node' },
      ],
    },

    q2_res_coolant_ok: {
      text: [
        '🧊 **БЕЛОЕ ОБЛАКО**',
        '',
        'Белое облако пены и газа окутывает трак. Машина проходит пылающий заслон без единой царапины.',
        '',
        'Фанатики в замешательстве отступают от жара, который вдруг пошёл в обратную сторону.',
        '',
        '_Техника победила огонь._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q2_node' },
      ],
    },

    q2_res_coolant_fail: {
      text: [
        '♨️ **ПАР В КАБИНУ**',
        '',
        'Клапаны заклинило. Вместо хладагента система выдаёт струю горячего пара прямо в кабину.',
        '',
        'На секунду вы теряете управление и ловите бортом осколки горящей трубы.',
        '',
        '_Обшивка пробита, но вы едете._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q2_node' },
      ],
    },

    q2_node: {
      text: [
        '☠️ **ИЗНАНКА УЗЛА**',
        '',
        'Насосный узел разгромлен. Охрана Баронов перебита. У терминала лежит умирающий диверсант Культа, в руке — детонатор, подключённый к магистрали.',
        '',
        '«Бароны пьют кровь земли... — хрипит он. — Перегрузи насосы, водитель. Оставь их без синтезата».',
        '',
        '_Детонатор тикает._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔫 Застрелить фанатика и спасти узел',
          effects: { 'flags.story.barons.barons_sabotaged': '0' },
          target: 'story_barons:q2_res_kill',
        },
        {
          buttonText: '🛠 Тайно саботировать клапаны (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: { 'flags.story.barons.barons_sabotaged': '1' },
          target: 'story_barons:q2_res_sabotage_ok',
        },
        {
          buttonText: '🛠 Тайно саботировать клапаны',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.20)',
            'flags.story.barons.barons_sabotaged': '0',
          },
          target: 'story_barons:q2_res_sabotage_fail',
        },
      ],
    },

    q2_res_kill: {
      text: [
        '🔫 **ВЫСТРЕЛ В УПОР**',
        '',
        'Один выстрел — и диверсант падает на пульт, так и не сомкнув пальцы на детонаторе.',
        '',
        'Вы оттаскиваете тело и запускаете насосы по инструкции Баронов. Магистраль гудит ровно.',
        '',
        '_Никто не узнает, что здесь было._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q2_finish' },
      ],
    },

    q2_res_sabotage_ok: {
      text: [
        '🛠 **ПЕРЕГРУЗ КЛАПАНОВ**',
        '',
        'Вы виртуозно меняете полярность реле. Сеть взорвётся через пару часов, когда вы уже будете далеко.',
        '',
        'Диверсант улыбается окровавленным ртом и суёт вам старую военную карту с отметкой легендарной «Чёрной Жилы» — секретного госрезерва нефти.',
        '',
        '**У вас координаты главной цели игры.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q2_finish' },
      ],
    },

    q2_res_sabotage_fail: {
      text: [
        '💣 **ДЕТОНАТОР ВРУЧНУЮ**',
        '',
        'Пальцы дрожат. Терминал начинает громко пищать, предупреждая о несанкционированном доступе.',
        '',
        'Диверсант понимает, что вы медлите, и замыкает детонатор сам. Взрыв разносит ползала, обломки бьют по траку.',
        '',
        '_Саботаж сорван. Диверсант мёртв._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q2_finish' },
      ],
    },

    q2_finish: {
      text: [
        '🏛 **ОТЧЁТ ПЕРЕД ЦИТАДЕЛЬЮ**',
        '',
        'Цитадель Баронов. Если узел работает — Следж доволен. Если сеть рванула — база содрогается от далёкого эха, и он рвёт и мечет.',
        '',
        'Вы входите в кабинет, вытирая руки от мазута.',
        '',
        '_Пора решать, что говорить._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 «Узел взорвали сектанты до меня» (Удача 7)',
          condition: 'flags.story.barons.barons_sabotaged && stats.luck >= 7',
          effects: {
            'resources.chips': '+150',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q2': '1',
          },
          target: 'story_barons:q2_res_lie_ok',
        },
        {
          buttonText: '🗣 «Узел взорвали сектанты до меня»',
          condition: 'flags.story.barons.barons_sabotaged && stats.luck < 7',
          effects: {
            'resources.chips': '-100',
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q2': '1',
          },
          target: 'story_barons:q2_res_lie_fail',
        },
        {
          buttonText: '🤝 Сдать чистый отчёт',
          condition: '!flags.story.barons.barons_sabotaged',
          effects: {
            'resources.chips': '+150',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q2': '1',
          },
          target: 'story_barons:q2_res_honest',
        },
      ],
    },

    q2_res_lie_ok: {
      text: [
        '🎭 **ХОЛОДНОЕ ВРАНЬЁ**',
        '',
        'Следж верит вашему хладнокровию: «Чёртовы сектанты! Они заплатят за это».',
        '',
        '«Вот твоя плата за доставку оборудования, водитель. Ты сделал всё, что мог».',
        '',
        'Карта «Чёрной Жилы» остаётся у вас. **+150 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q2_done' },
      ],
    },

    q2_res_lie_fail: {
      text: [
        '📋 **ЛОГИ НЕ ЛГУТ**',
        '',
        'Следж смотрит в планшет: «Время ручного вмешательства совпадает со временем твоей стоянки, гнида!»',
        '',
        'Его бойцы жестоко избивают вас и отбирают половину накопленных денег.',
        '',
        '**−100 чипов. Репутация просела.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q2_done' },
      ],
    },

    q2_res_honest: {
      text: [
        '📄 **ЧИСТЫЙ ОТЧЁТ**',
        '',
        'Вы докладываете, что узел работает и магистраль под контролем. Следж довольно кивает, не отрываясь от бумаг.',
        '',
        '«Хорошо, колеса. Металл на месте — значит, бурение не встанет».',
        '',
        '**+150 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q2_done' },
      ],
    },

    q2_done: {
      text: [
        '✅ **«СУХОЙ ОСТАТОК» ЗАВЕРШЁН**',
        '',
        'Насосы «Титана» работают. Бароны получили своё, Нео-Тек и Затмение — ещё одного врага.',
        '',
        '**+15 репутации Ржавых Баронов. −5 Нео-Теку и Затмению.**',
        '',
        '_Следующий квест откроется на 30 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q3 «Карта мертвеца»
    // ---------------------------------------------------------------------
    q3_start: {
      text: [
        '🗺 **«КАРТА МЕРТВЕЦА»**',
        '',
        'Цитадель содрогается от грохота гидравлических молотов. Киборг Следж лично запирает в бронированную клетку вашего трака исхудавшего человека в рваной мантии.',
        '',
        'Это Калеб — верховный картограф Детей Затмения. Он знает точные координаты «Чёрной Жилы», легендарного подземного хранилища госрезерва нефти.',
        '',
        'Доставить пленника в тайную тюрьму «Стальной Зуб». Плата — 200 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🤐 Запереть клетку и выехать',
          effects: { 'vars.repRustyBarons': '+1' },
          target: 'story_barons:q3_night',
        },
        {
          buttonText: '💬 Надавить на Следжа (Удача 7)',
          condition: 'flags.story.barons.knows_fuel_shortage && stats.luck >= 7',
          effects: { 'resources.chips': '+40' },
          target: 'story_barons:q3_res_pressure_ok',
        },
        {
          buttonText: '💬 Надавить на Следжа',
          condition: 'flags.story.barons.knows_fuel_shortage && stats.luck < 7',
          effects: { 'vars.repRustyBarons': '-1' },
          target: 'story_barons:q3_res_pressure_fail',
        },
      ],
    },

    q3_res_pressure_ok: {
      text: [
        '🦿 **МЕТАЛЛИЧЕСКИЙ СКРЕЖЕТ**',
        '',
        'Следж скрежещет металлическими зубами, но понимает, что вы правы: без карты Бароны станут банкротами через месяц.',
        '',
        'Он швыряет вам мешочек с сорока чипами: «Меньше знай, водила, дольше проживёшь. Доставь его живым, иначе сам станешь топливом».',
        '',
        '**+40 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ На тракт', target: 'story_barons:q3_night' },
      ],
    },

    q3_res_pressure_fail: {
      text: [
        '✊ **СЛИШКОМ МНОГО ДУМАЕШЬ**',
        '',
        'Стальная хватка сжимает ворот вашей куртки: «Ты слишком много думаешь для парня, который просто крутит руль».',
        '',
        '«Ещё одно слово — и я заставлю тебя толкать этот трак до самого „Стального Зуба“ пешком».',
        '',
        'Аванса не будет.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ На тракт', target: 'story_barons:q3_night' },
      ],
    },

    q3_night: {
      text: [
        '🌙 **НОЧНОЙ ШЁПОТ**',
        '',
        'Глубокая ночь. Через перегородку кабины слышен хриплый голос Калеба — он не молится и не проклинает вас.',
        '',
        '«Бароны убьют меня, как только получат карту. Но они не знают, что „Чёрная Жила“ лежит под священным разломом. Их буры вызовут землетрясение, которое отравит грунтовые воды».',
        '',
        'В этот момент навигатор глохнет от ЭМИ-импульса: Культ начал охоту за конвоем.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🌑 Прорыв сквозь байкеров (Вождение 4)',
          condition: 'vars.truckLevel >= 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'resources.hp': '-round(vars.maxHp * 0.05)',
          },
          target: 'story_barons:q3_res_break_ok',
        },
        {
          buttonText: '🌑 Прорыв сквозь байкеров',
          condition: 'vars.truckLevel < 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.25)',
          },
          target: 'story_barons:q3_res_break_fail',
        },
      ],
    },

    q3_res_break_ok: {
      text: [
        '🌑 **ТИХИЙ РЫВОК**',
        '',
        'Вы гасите габариты, включаете приборы ночного видения и резко меняете траекторию.',
        '',
        'Трак сносит ведущего байкера. Остальные теряются в пыли, упуская ваш след в темноте.',
        '',
        '_Калеб в клетке облегчённо выдыхает._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q3_crossroad' },
      ],
    },

    q3_res_break_fail: {
      text: [
        '🪝 **МАГНИТНЫЕ ГАРПУНЫ**',
        '',
        'Мотоциклисты закидывают кузов магнитными гарпунами. Трак заносит, вы бьётесь бортом об остатки дорожного ограждения.',
        '',
        'Один гарпун пробивает стенку клетки, раня Калеба осколками металла.',
        '',
        '_Картограф тяжело ранен. До «Стального Зуба» десять километров._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q3_crossroad' },
      ],
    },

    q3_crossroad: {
      text: [
        '⛽ **РАЗВИЛКА У ЗАПРАВКИ**',
        '',
        'Вы отрываетесь у заброшенной заправки. Трак дымит, в клетке стонет Калеб. Культисты наверняка перекрыли главный перекрёсток.',
        '',
        '«У меня в плаще зашит старый военный инжектор кодов, — шепчет картограф. — Подключи его к терминалу. Откроется подземный ремонтный туннель... прямо к Жиле, в обход засады. Но мне нужна помощь».',
        '',
        '_Рискнуть или забрать карту силой?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔪 Обыскать и оставить умирать',
          effects: { 'flags.story.barons.cartographer_saved': '0' },
          target: 'story_barons:q3_res_kill',
        },
        {
          buttonText: '🩹 Вскрыть туннель и спасти Калеба (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: { 'flags.story.barons.cartographer_saved': '1' },
          target: 'story_barons:q3_res_save_ok',
        },
        {
          buttonText: '🩹 Вскрыть туннель и спасти Калеба',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.15)',
            'flags.story.barons.cartographer_saved': '0',
          },
          target: 'story_barons:q3_res_save_fail',
        },
      ],
    },

    q3_res_kill: {
      text: [
        '🔪 **ХОЛОДНЫЙ РАСЧЁТ**',
        '',
        'Вы обыскиваете Калеба и вынимаете инжектор кодов вместе с клочком карты, зашитым в подкладку.',
        '',
        'Картограф остаётся умирать на бетоне заправки, глядя вам вслед.',
        '',
        '**Карта у вас. Доверие Культа — нет.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q3_finish' },
      ],
    },

    q3_res_save_ok: {
      text: [
        '🩹 **ПОДЗЕМНЫЙ ХОД**',
        '',
        'Вы обходите защитные реле старой заправки. Тяжёлые створки в полу скрежещут и расходятся, открывая тёмный туннель.',
        '',
        'Вы успеваете перевязать Калеба. Он выживает и сам показывает настоящие координаты «Чёрной Жилы».',
        '',
        '**Картограф спасён. У вас чистая карта.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q3_finish' },
      ],
    },

    q3_res_save_fail: {
      text: [
        '💥 **САМОЛИКВИДАЦИЯ ШЛЮЗА**',
        '',
        'Древний терминал распознаёт инжектор как враждебный вирус и запускает самоликвидацию. Распределительный щит взрывается.',
        '',
        'Калеб погибает от взрывной волны, успев вытолкнуть вас из бокса.',
        '',
        '_У вас полуобгоревший инжектор с повреждёнными секторами карты._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q3_finish' },
      ],
    },

    q3_finish: {
      text: [
        '🦷 **ВОРОТА «СТАЛЬНОГО ЗУБА»**',
        '',
        'Мрачный форпост на скале. Смотритель тюрьмы — садист по кличке Хрящ — встречает вас у броневорот, поигрывая кастетом.',
        '',
        'Его подручные уже тянутся к заднему борту трака.',
        '',
        '_Сказать правду или сыграть по-крупному?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🎭 «Картограф погиб, вот пустышка» (Удача 8)',
          condition: 'flags.story.barons.cartographer_saved && stats.luck >= 8',
          effects: {
            'resources.chips': '+200',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q3': '1',
          },
          target: 'story_barons:q3_res_lie_ok',
        },
        {
          buttonText: '🎭 «Картограф погиб, вот пустышка»',
          condition: 'flags.story.barons.cartographer_saved && stats.luck < 8',
          effects: {
            'resources.chips': '+50',
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q3': '1',
          },
          target: 'story_barons:q3_res_lie_fail',
        },
        {
          buttonText: '🤝 Честно сдать пленника и инжектор',
          effects: {
            'resources.chips': '+200',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q3': '1',
          },
          target: 'story_barons:q3_res_honest',
        },
      ],
    },

    q3_res_lie_ok: {
      text: [
        '🎭 **ВЕЛИКИЙ ОБМАН**',
        '',
        'Хрящ осматривает обгоревшие борта, забирает фальшивый инжектор: «Чёрт с ним, с фанатиком. Главное — железо у нас».',
        '',
        '«Техники попробуют восстановить данные. Вот твои деньги, проваливай».',
        '',
        'Живой Калеб остаётся у вас в спальном отсеке. **+200 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q3_done' },
      ],
    },

    q3_res_lie_fail: {
      text: [
        '👊 **КАСТЕТ В ЖИВОТ**',
        '',
        'Хрящ не верит вашему бегающему взгляду и сам лезет в кабину: «А это что за мусор у тебя под койкой?!»',
        '',
        'Калеба находят. Кастет вбивает воздух из лёгких: «Ты хотел продать наш бензин сектантам?!»',
        '',
        'Картографа уводят на пытки, часть заработка конфискуют. **+50 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q3_done' },
      ],
    },

    q3_res_honest: {
      text: [
        '🦷 **РАБОТА СДАНА**',
        '',
        'Хрящ довольно скалится: «Отличная работа, камазист. Теперь Следж выжмет из него все соки, и Тракт будет принадлежать нам».',
        '',
        'Клетку увозят вглубь форпоста. Вы получаете обещанное и разворачиваете трак.',
        '',
        '**+200 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q3_done' },
      ],
    },

    q3_done: {
      text: [
        '✅ **«КАРТА МЕРТВЕЦА» ЗАВЕРШЁН**',
        '',
        'Пленник доставлен. Бароны довольны, Нео-Тек и Затмение — нет.',
        '',
        '**+15 репутации Ржавых Баронов. −5 Нео-Теку и Затмению.**',
        '',
        '_Следующий квест откроется на 45 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q4 «Ржавый дипломат»
    // ---------------------------------------------------------------------
    q4_start: {
      text: [
        '🏗 **«РЖАВЫЙ ДИПЛОМАТ»**',
        '',
        'Полузаброшенный промышленный ангар на окраине Нового Детройта. Нейтральная территория, пахнет сваркой и машинным маслом.',
        '',
        'Вас ждёт представитель инженеров Нео-Тека. Бароны договорились о покупке тяжёлой буровой коронки — её нужно незаметно вывезти через патрули секторов.',
        '',
        '_Инженеры готовы отдать товар. Но требуют гарантий._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '📄 Принять накладные и начать погрузку',
          target: 'story_barons:q4_road',
        },
        {
          buttonText: '🖋 Подделать документы шифрами Калеба (Удача 7)',
          condition: 'flags.story.barons.cartographer_saved && stats.luck >= 7',
          effects: { 'flags.story.barons.q4_disguised': '1' },
          target: 'story_barons:q4_res_forge_ok',
        },
        {
          buttonText: '🖋 Подделать документы шифрами Калеба',
          condition: 'flags.story.barons.cartographer_saved && stats.luck < 7',
          effects: {
            'resources.chips': '-20',
            'flags.story.barons.q4_disguised': '0',
          },
          target: 'story_barons:q4_res_forge_fail',
        },
      ],
    },

    q4_res_forge_ok: {
      text: [
        '🖋 **ЧИСТЫЕ ПОДПИСИ**',
        '',
        'Инженер внимательно изучает бумаги, сверяет цифровые подписи и кивает.',
        '',
        '«Чисто. Для всех внешних радаров вы везёте обычный металлолом. Умный ход».',
        '',
        '**Маскировка действует: патрули будут смотреть сквозь пальцы.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Выехать из города', target: 'story_barons:q4_road' },
      ],
    },

    q4_res_forge_fail: {
      text: [
        '🔍 **НЕСТЫКОВКА В КОДАХ**',
        '',
        'Инженер хмурится: «Ты за кого меня держишь, грязевик? Эти шифры старые».',
        '',
        '«Живо грузи ящики как есть, пока я не вызвал штурмовиков».',
        '',
        'Приходится сунуть ему двадцать чипов, чтобы он не доложил руководству.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Выехать из города', target: 'story_barons:q4_road' },
      ],
    },

    q4_road: {
      text: [
        '🚧 **КПП «СВЯТЫЕ РУИНЫ»**',
        '',
        'На выезде из города дорогу перекрывает тяжело вооружённый пограничный блокпост Нео-Тека. Ищут нелегальную контрабанду металлов.',
        '',
        'Сканеры на КПП медленно ползут вдоль борта вашего трака.',
        '',
        '_Шлагбаум опущен. Ворота заперты._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Таран шлагбаума (броня ≥ 65%)',
          condition: 'hp_percent >= 65',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'vars.repNeoTek': '-3',
          },
          target: 'story_barons:q4_res_ram_ok',
        },
        {
          buttonText: '💥 Таран шлагбаума',
          condition: 'hp_percent < 65',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.35)',
            'resources.hp': '-round(vars.maxHp * 0.25)',
            'vars.repNeoTek': '-4',
          },
          target: 'story_barons:q4_res_ram_fail',
        },
        {
          buttonText: '💻 Заглушить сканер (Техника 25)',
          condition: 'flags.story.barons.q4_disguised && stats.evasion >= 25',
          target: 'story_barons:q4_res_hack_ok',
        },
        {
          buttonText: '💻 Заглушить сканер',
          condition: 'flags.story.barons.q4_disguised && stats.evasion < 25',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.30)',
          },
          target: 'story_barons:q4_res_hack_fail',
        },
      ],
    },

    q4_res_ram_ok: {
      text: [
        '💥 **ШЛАГБАУМ В ЩЕПКИ**',
        '',
        'Трак сносит тяжёлое ограждение. Пули гвардейцев со скрежетом рикошетят от лобовых пластин.',
        '',
        'Вы вырываетесь в Пустошь, оставив за спиной вой сирен.',
        '',
        '_Броня держит. Пока._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q4_crate' },
      ],
    },

    q4_res_ram_fail: {
      text: [
        '💥 **КУСОК ШЛАГБАУМА**',
        '',
        'Отрекошетивший обломок застревает под колесом. Трак заносит, пулемётная очередь с вышки пробивает бензобак.',
        '',
        'Вы уходите, оставляя за собой шлейф топлива и дыма.',
        '',
        '_Топлива хватит едва-едва._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q4_crate' },
      ],
    },

    q4_res_hack_ok: {
      text: [
        '💻 **ПЯТЬ СЕКУНД ТИШИНЫ**',
        '',
        'Мониторы патрульных на мгновение гаснут. Вы спокойно проезжаете КПП, пока солдаты стучат по сломанным экранам.',
        '',
        'Ни выстрела, ни капли топлива.',
        '',
        '_Маскировка сработала идеально._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q4_crate' },
      ],
    },

    q4_res_hack_fail: {
      text: [
        '🚨 **СИГНАЛ ТРЕВОГИ**',
        '',
        'Сканер выдаёт сигнал о внешнем вмешательстве. Ворота блокируются, патруль открывает огонь в упор по колёсам.',
        '',
        'Вы прорываете оцепление, оставляя на асфальте куски резины и обшивки.',
        '',
        '_Из окружения вышли. Еле-еле._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q4_crate' },
      ],
    },

    q4_crate: {
      text: [
        '📦 **ОПЕЧАТАННЫЙ САМОПИСЕЦ**',
        '',
        'Глухой каньон. Вы проверяете крепления после погони. Тяжёлая стальная коронка скрыта под брезентом.',
        '',
        'К ящику прикреплён опечатанный бортовой самописец с логами переговоров глав Нео-Тека и Баронов.',
        '',
        '_Пломба электронная. И очень заманчивая._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🙈 Не трогать замки Баронов',
          effects: { 'flags.story.barons.knows_conspiracy': '0' },
          target: 'story_barons:q4_finish',
        },
        {
          buttonText: '💻 Вскрыть пломбу самописца (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: { 'flags.story.barons.knows_conspiracy': '1' },
          target: 'story_barons:q4_res_crate_hack_ok',
        },
        {
          buttonText: '💻 Вскрыть пломбу самописца',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'vars.repRustyBarons': '-2',
            'flags.story.barons.knows_conspiracy': '0',
          },
          target: 'story_barons:q4_res_crate_hack_fail',
        },
      ],
    },

    q4_res_crate_hack_ok: {
      text: [
        '🎧 **ГОЛОС СЛЕДЖА**',
        '',
        'Вы получаете доступ к аудиофайлам. Следж договаривается с лидером Нео-Тека: инженеры дают чертежи глубинного бурения, чтобы выкачать «Чёрную Жилу».',
        '',
        'Взамен Бароны обещают пустить под нож рабочих Тракта и фанатиков Культа — искусственный голод и вечная тирания двух фракций.',
        '',
        '**У вас в руках страшный компромат.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q4_finish' },
      ],
    },

    q4_res_crate_hack_fail: {
      text: [
        '⚡ **РАЗРЯД В ПАЛЬЦЫ**',
        '',
        'Замок бьёт вас током. На корпусе ящика загорается красная сигнальная лампа: пломба сорвана без возможности восстановления.',
        '',
        'Следж сразу поймёт, что в груз лазили.',
        '',
        '_Компромата нет. Проблемы есть._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q4_finish' },
      ],
    },

    q4_finish: {
      text: [
        '🏛 **ВОЗВРАЩЕНИЕ К СЛЕДЖУ**',
        '',
        'Цитадель встречает вас грохотом дизелей. Киборг лично осматривает привезённую буровую коронку, проводя стальной ладонью по зубьям.',
        '',
        '«Металл у нас. Скоро начнём бурение», — тянет он, не глядя на вас.',
        '',
        '_В кармане — запись, которая стоит дороже всей коронки._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 Намекнуть на копию логов (Удача 8)',
          condition: 'flags.story.barons.knows_conspiracy && stats.luck >= 8',
          effects: {
            'resources.chips': '+300',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q4': '1',
          },
          target: 'story_barons:q4_res_blackmail_ok',
        },
        {
          buttonText: '🗣 Намекнуть на копию логов',
          condition: 'flags.story.barons.knows_conspiracy && stats.luck < 8',
          effects: {
            'resources.chips': '+50',
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q4': '1',
          },
          target: 'story_barons:q4_res_blackmail_fail',
        },
        {
          buttonText: '🤝 Молча сдать груз (+150 чипов)',
          effects: {
            'resources.chips': '+150',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q4': '1',
          },
          target: 'story_barons:q4_res_honest',
        },
      ],
    },

    q4_res_blackmail_ok: {
      text: [
        '🦾 **ТРОЙНОЙ КУШ**',
        '',
        'Киборг опасно прищуривает механический глаз, металл на лице сжимается со скрежетом.',
        '',
        'Но он понимает, что вы его прижали: «Ты далеко пойдёшь, водитель... Или быстро сдохнешь. Держи свои чипы. И забудь эту запись, если хочешь дожить до рассвета».',
        '',
        '**+300 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q4_done' },
      ],
    },

    q4_res_blackmail_fail: {
      text: [
        '🤖 **СТАЛЬНАЯ РУКА У ГОРЛА**',
        '',
        'Следж прижимает вас к борту трака: «Ты думал напугать меня, червь? Мои люди сотрут твой гараж в порошок, а тебя закопают живьём».',
        '',
        'Охрана забирает компромат, а вас избивают при обыске.',
        '',
        '**+50 чипов. Броня помята.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q4_done' },
      ],
    },

    q4_res_honest: {
      text: [
        '🤝 **РАБОТА ЕСТЬ РАБОТА**',
        '',
        'Вы молча сдаёте груз и забираете стандартную оплату. Следж хлопает вас по плечу железной ладонью.',
        '',
        '«Хорошая работа, колеса. Металл у нас, скоро начнём бурение».',
        '',
        '**+150 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q4_done' },
      ],
    },

    q4_done: {
      text: [
        '✅ **«РЖАВЫЙ ДИПЛОМАТ» ЗАВЕРШЁН**',
        '',
        'Буровая коронка в Цитадели. Бароны довольны, Нео-Тек и Затмение — не очень.',
        '',
        '**+15 репутации Ржавых Баронов. −5 Нео-Теку и Затмению.**',
        '',
        '_Следующий квест откроется на 60 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q5 «Осквернение»
    // ---------------------------------------------------------------------
    q5_start: {
      text: [
        '🛢 **«ОСКВЕРНЕНИЕ»**',
        '',
        'Цитадель содрогается от гула тяжёлых моторов. К вашему траку цепляют массивную грохочущую платформу, на ней — гигантская буровая установка «Крот-Г2».',
        '',
        'Следж лично запрыгивает на подножку кабины: «Сектанты стянули все силы к разлому. Называют это осквернением. Если заблокируют дорогу — дави их. Нам нужна эта жила, чего бы это ни стоило».',
        '',
        'Награда — 300 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🤐 Принять приказ и выжать сцепление',
          effects: { 'vars.repRustyBarons': '+1' },
          target: 'story_barons:q5_road',
        },
        {
          buttonText: '🗣 Намекнуть на заговор (Удача 7)',
          condition: 'flags.story.barons.knows_conspiracy && stats.luck >= 7',
          effects: { 'flags.story.barons.q5_bonus': '1' },
          target: 'story_barons:q5_res_leverage_ok',
        },
        {
          buttonText: '🗣 Намекнуть на заговор',
          condition: 'flags.story.barons.knows_conspiracy && stats.luck < 7',
          effects: { 'vars.repRustyBarons': '-2' },
          target: 'story_barons:q5_res_leverage_fail',
        },
      ],
    },

    q5_res_leverage_ok: {
      text: [
        '🦾 **ЛИЧНЫЙ КАРМАН**',
        '',
        'Следж меняется в лице, его механический глаз бешено вращается. Он приближает стальное лицо почти к вашему.',
        '',
        '«Ты слишком много суёшь нос в чужие дела, парень. Но ты мне нужен живым на этой точке. Довези бур без царапин — и я добавлю к твоей доле сто чипов из личного кармана».',
        '',
        '**+100 чипов к награде.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Выдвигаться', target: 'story_barons:q5_road' },
      ],
    },

    q5_res_leverage_fail: {
      text: [
        '🔫 **СТВОЛ У ВИСКА**',
        '',
        'Следж грубо выдёргивает вас за воротник и приставляет ствол к виску.',
        '',
        '«Если с буром что-то случится или ты начнёшь болтать лишнее — мои парни пустят твою машину на консервные банки, а тебя закопают в мазуте».',
        '',
        '_Лидер фракции разозлён._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Выдвигаться', target: 'story_barons:q5_road' },
      ],
    },

    q5_road: {
      text: [
        '🕯 **ЖИВОЙ ЩИТ**',
        '',
        'Трак тяжело ползёт в гору, волоча многотонную платформу. Асфальт исчезает — начинается разлом.',
        '',
        'Дорогу преграждает сплошная стена людей: сотни паломников Детей Затмения с ржавыми цепями и неоновыми знаками. Они поют псалом.',
        '',
        'Позади поднимается странный фиолетовый туман — активированы графитовые глушилки.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Протаранить стену (броня ≥ 70%)',
          condition: 'hp_percent >= 70',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.10)',
          },
          target: 'story_barons:q5_res_ram_ok',
        },
        {
          buttonText: '💥 Протаранить стену',
          condition: 'hp_percent < 70',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.35)',
          },
          target: 'story_barons:q5_res_ram_fail',
        },
        {
          buttonText: '🧭 Обойти по руслу пересохшей реки (Вождение 5)',
          condition: 'vars.truckLevel >= 5',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'resources.hp': '-round(vars.maxHp * 0.05)',
          },
          target: 'story_barons:q5_res_detour_ok',
        },
        {
          buttonText: '🧭 Обойти по руслу пересохшей реки',
          condition: 'vars.truckLevel < 5',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.25)',
          },
          target: 'story_barons:q5_res_detour_fail',
        },
      ],
    },

    q5_res_ram_ok: {
      text: [
        '💥 **СКВОЗЬ БАРРИКАДУ ИЗ ПЛОТИ**',
        '',
        'Тяжёлый кенгурятник сминает стену людей и металла. Фанатики разлетаются в стороны, но некоторые успевают закидать трак бутылками с жгучим мазутом.',
        '',
        'Машина прорывается, оставляя позади крики и пламя.',
        '',
        '_Культ запомнил вас навсегда._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q5_drill' },
      ],
    },

    q5_res_ram_fail: {
      text: [
        '💥 **РЕЛЬС ПОД КОЛЕСА**',
        '',
        'Изношенная обшивка не выдерживает. Один из фанатиков швыряет стальной рельс прямо под колёса — трак жёстко подбрасывает, лопается рессора платформы.',
        '',
        'Толпа набрасывается на кабину, разбивая стёкла арматурой, прежде чем вы вырываетесь.',
        '',
        '_Машина едва дышит._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q5_drill' },
      ],
    },

    q5_res_detour_ok: {
      text: [
        '🧭 **В ОБХОД**',
        '',
        'Вы уводите платформу в сухое русло реки. Камни скрежещут под днищем, но колонна фанатиков остаётся на гребне, не в силах спуститься.',
        '',
        'Псалом стихает за кормой.',
        '',
        '_Ни одного выстрела._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q5_drill' },
      ],
    },

    q5_res_detour_fail: {
      text: [
        '🧭 **ЗАСТРЯЛИ**',
        '',
        'Платформа цепляется за валун. Вы буксуете в песке, пока фанатики сверху забрасывают кабину камнями и бутылками.',
        '',
        'Вы выбираетесь на честном слове, оставив на дне русла кусок обшивки и половину рессор.',
        '',
        '_Бур цел. Кузов — нет._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q5_drill' },
      ],
    },

    q5_drill: {
      text: [
        '☣️ **УДАР БУРА**',
        '',
        'Рабочие монтируют установку на плато и запускают двигатели. Коронка вгрызается в священную землю.',
        '',
        'Через минуту земля содрогается — и вместо чистой нефти из разлома под давлением вырывается густой удушливый зеленоватый газ.',
        '',
        'Солдаты Баронов падают, задыхаясь. Бур заклинило на полной мощности, облако ползёт к городам Тракта.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚪 Загерметизировать кабину и переждать',
          effects: { 'flags.story.barons.tract_poisoned': '1' },
          target: 'story_barons:q5_res_seal',
        },
        {
          buttonText: '🛠 Аварийный саботаж бура (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'flags.story.barons.tract_poisoned': '0',
          },
          target: 'story_barons:q5_res_sabotage_ok',
        },
        {
          buttonText: '🛠 Аварийный саботаж бура',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.20)',
            'flags.story.barons.tract_poisoned': '1',
          },
          target: 'story_barons:q5_res_sabotage_fail',
        },
      ],
    },

    q5_res_seal: {
      text: [
        '🚪 **ЗА СТЕКЛОМ**',
        '',
        'Вы запираетесь в траке, запускаете фильтры и смотрите, как газ уничтожает всё живое вокруг.',
        '',
        'Рабочие бьют в стекло ладонями, пока не падают. Бур гудит, выкачивая нефть и смерть одновременно.',
        '',
        '**Вы остались верны Баронам до конца. Тракт отравлен.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q5_finish' },
      ],
    },

    q5_res_sabotage_ok: {
      text: [
        '🛠 **ЗАГЛУШКА**',
        '',
        'Вы выскакиваете в дыхательной маске, добегаете до пульта и перегружаете генератор. «Крот» издаёт оглушительный скрежет и намертво застревает в породе, блокируя выход газа.',
        '',
        'Вы спасаете тысячи жизней на Тракте, хотя Жила теперь запечатана.',
        '',
        '**Газ не вырвался. Бур мёртв.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q5_finish' },
      ],
    },

    q5_res_sabotage_fail: {
      text: [
        '☣️ **ЯДОВИТАЯ ВОЛНА**',
        '',
        'Из-за едкого дыма глаза слезятся. Вы путаете тумблеры, и защитная система бура взрывается, отбрасывая вас назад.',
        '',
        'Бур продолжает работать. Ядовитая волна накрывает долину.',
        '',
        '_Вы едва доползаете до кабины._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q5_finish' },
      ],
    },

    q5_finish: {
      text: [
        '🩸 **КРОВАВЫЕ ИТОГИ**',
        '',
        'Газ рассеивается — или уходит в сторону долины. Вы возвращаетесь во внутренний двор Цитадели.',
        '',
        'Следж осматривает обгоревший трак, потом поднимает глаза на вас.',
        '',
        '_Слово решает всё._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 «Жила вскрыта, газ — сопутствующий ущерб»',
          condition: 'flags.story.barons.tract_poisoned && flags.story.barons.q5_bonus',
          effects: {
            'resources.chips': '+400',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q5': '1',
          },
          target: 'story_barons:q5_res_claim',
        },
        {
          buttonText: '🗣 «Жила вскрыта, газ — сопутствующий ущерб»',
          condition: 'flags.story.barons.tract_poisoned && !flags.story.barons.q5_bonus',
          effects: {
            'resources.chips': '+300',
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q5': '1',
          },
          target: 'story_barons:q5_res_claim',
        },
        {
          buttonText: '🗣 «Я заглушил бур: газ отравил бы весь регион»',
          condition: '!flags.story.barons.tract_poisoned',
          effects: {
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q5': '1',
          },
          target: 'story_barons:q5_res_confess',
        },
      ],
    },

    q5_res_claim: {
      text: [
        '🛢 **ОКЕАН ТОПЛИВА**',
        '',
        'Следж довольно хохочет, хлопая по вашей броне: «Вот это по-нашему! Слизняки в городах покашляют и привыкнут, зато у нас теперь Океан Топлива!»',
        '',
        '«Ты настоящий Железный Капитан, водила!»',
        '',
        '**Награда выплачена. Тракт обречён дышать мазутом.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q5_done' },
      ],
    },

    q5_res_confess: {
      text: [
        '👊 **ВМЯТИНА НА КАПОТЕ**',
        '',
        'Следж в ярости бьёт кулаком по капоту, оставляя глубокую вмятину: «Ты предал меня, крыса! Ты лишил Баронов будущего!»',
        '',
        'Награды нет. Но штурм уже на пороге — и Следжу нужен каждый водитель, способный держать руль.',
        '',
        '«Уйди с глаз. И будь на плацу к утру».',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_barons:q5_done' },
      ],
    },

    q5_done: {
      text: [
        '✅ **«ОСКВЕРНЕНИЕ» ЗАВЕРШЁН**',
        '',
        '«Крот-Г2» отработал своё. Бароны получили ответ, Нео-Тек и Затмение — нового врага.',
        '',
        '**+15 репутации Ржавых Баронов. −5 Нео-Теку и Затмению.**',
        '',
        '_До финала остался один шаг. Нужно 75 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q6 «Железный марш»
    // ---------------------------------------------------------------------
    q6_start: {
      text: [
        '⚔️ **«ЖЕЛЕЗНЫЙ МАРШ»**',
        '',
        'Объединённые силы Детей Затмения и остатки штурмовиков Нео-Тека пошли на тотальный штурм плацдарма «Чёрной Жилы».',
        '',
        'Следж запрыгивает на подножку вашего трака, из его пробитого бока хлещет масло: «Они зажали нас в клещи! Если прорвутся к главным вентилям — нам конец! Нужно деморализовать их авангард!»',
        '',
        '_Сирена или эфир?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '📢 Грубая сила: принять огонь на себя',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.20)',
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
          },
          target: 'story_barons:q6_perimeter',
        },
        {
          buttonText: '📻 Радио-диверсия в эфире врага (Удача 7)',
          condition: '(flags.story.barons.knows_conspiracy || flags.story.barons.cartographer_saved) && stats.luck >= 7',
          target: 'story_barons:q6_res_radio_ok',
        },
        {
          buttonText: '📻 Радио-диверсия в эфире врага',
          condition: '(flags.story.barons.knows_conspiracy || flags.story.barons.cartographer_saved) && stats.luck < 7',
          effects: { 'resources.hp': '-round(vars.maxHp * 0.35)' },
          target: 'story_barons:q6_res_radio_fail',
        },
      ],
    },

    q6_res_radio_ok: {
      text: [
        '📻 **ГОЛОС ПРАВДЫ**',
        '',
        'Вы перехватываете общую частоту и запускаете в эфир украденные логи заговора и шифры картографа.',
        '',
        'Рядовые культисты и наёмники инженеров слышат, как их лидеры лгали им. Авангард ломает строй и отступает под крики взаимных обвинений.',
        '',
        '**Натиск ослаблен.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ К периметру', target: 'story_barons:q6_perimeter' },
      ],
    },

    q6_res_radio_fail: {
      text: [
        '📡 **ПЕЛЕНГ**',
        '',
        'Эфир глушится вражескими средствами РЭБ. Ваш голос тонет в помехах, а расположение вычисляют по сигналу.',
        '',
        'Артиллерия Культа накрывает сектор. Кабину встряхивает так, что зубы лязгают.',
        '',
        '_Вы живы. Трак — еле-еле._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ К периметру', target: 'story_barons:q6_perimeter' },
      ],
    },

    q6_perimeter: {
      text: [
        '🧱 **СТАЛЬНОЙ КЛИН**',
        '',
        'Стена внешнего периметра пробита таранным поездом Культа. Фанатики с криками забрасывают вышки Баронов бутылками с горючей смесью.',
        '',
        'Единственный способ удержать пролом — перекрыть его корпусом трака или перехватить управление защитным валом.',
        '',
        '_Пролом расширяется с каждой минутой._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚜 Таранный заслон (броня ≥ 60%)',
          condition: 'hp_percent >= 60',
          effects: { 'resources.hp': '-round(vars.maxHp * 0.15)' },
          target: 'story_barons:q6_res_ram_ok',
        },
        {
          buttonText: '🚜 Таранный заслон',
          condition: 'hp_percent < 60',
          effects: {
            'resources.hp': '=round(vars.maxHp * 0.10)',
            'resources.diesel': '-round(vars.maxDiesel * 0.30)',
          },
          target: 'story_barons:q6_res_ram_fail',
        },
        {
          buttonText: '🔥 Перехватить огнемётный вал (Техника 25)',
          condition: 'stats.evasion >= 25',
          target: 'story_barons:q6_res_hack_ok',
        },
        {
          buttonText: '🔥 Перехватить огнемётный вал',
          condition: 'stats.evasion < 25',
          effects: { 'resources.hp': '-round(vars.maxHp * 0.15)' },
          target: 'story_barons:q6_res_hack_fail',
        },
      ],
    },

    q6_res_ram_ok: {
      text: [
        '🚜 **ПРОБКА ИЗ СТАЛИ**',
        '',
        'Трак намертво запирает пролом. Пули рикошетят от тяжёлых листов, Бароны с вышек успевают расстрелять зажатых в узком горле врагов.',
        '',
        'Корпус стонет, но держит.',
        '',
        '_Периметр устоял._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q6_valve' },
      ],
    },

    q6_res_ram_fail: {
      text: [
        '🔥 **МОТОРНЫЙ ОТСЕК**',
        '',
        'Изношенные листы не выдерживают натиска. Вражеский снаряд пробивает моторный отсек — трак глохнет и начинает гореть.',
        '',
        'Фанатики перелезают через капот. Вы выбираетесь через заднюю дверь под огнём.',
        '',
        '_Машина почти уничтожена._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q6_valve' },
      ],
    },

    q6_res_hack_ok: {
      text: [
        '🔥 **ОГНЕННЫЙ ВАЛ**',
        '',
        'Вы обходите сгоревшие реле, и из скрытых форсунок в землю бьют струи жидкого пламени.',
        '',
        'Пролом превращается в огненный ад. Враги отступают в ужасе, бросая таранный поезд.',
        '',
        '_Ни одного выстрела по траку._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q6_valve' },
      ],
    },

    q6_res_hack_fail: {
      text: [
        '⚡ **КОРОТКОЕ ЗАМЫКАНИЕ**',
        '',
        'Защитная система коротит. Вместо огнемётов вы намертво отключаете автоматические турели на соседних вышках.',
        '',
        'Охрану вырезают, а вас оглушает взрывом терминала.',
        '',
        '_Пролом открыт._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_barons:q6_valve' },
      ],
    },

    q6_valve: {
      text: [
        '🔑 **ПОСЛЕДНИЙ ВЕНТИЛЬ**',
        '',
        'Выжившие Бароны отбили атаку, но Следж тяжело ранен. Он протягивает вам мастер-ключ от насосной станции «Чёрной Жилы».',
        '',
        '«Запускай... Запускай насосы на максимум, парень! Тракт должен принадлежать нам! Нам плевать на цену!»',
        '',
        'Перед вами пульт управления всей топливной артерией региона.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '☣️ Протокол «Тирания»',
          condition: 'flags.story.barons.tract_poisoned',
          effects: {
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q6': '1',
          },
          target: 'story_barons:q6_res_tyranny',
        },
        {
          buttonText: '⛓ Протокол «Порядок»',
          condition: '!flags.story.barons.tract_poisoned',
          effects: {
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q6': '1',
          },
          target: 'story_barons:q6_res_order',
        },
        {
          buttonText: '💣 Протокол «Саботаж»',
          effects: {
            'vars.repRustyBarons': '+15',
            'vars.repNeoTek': '-5',
            'vars.repEclipse': '-5',
            'flags.story.barons.q6': '1',
          },
          target: 'story_barons:q6_res_sabotage',
        },
      ],
    },

    q6_res_tyranny: {
      text: [
        '☣️ **ЧЁРНАЯ КРОВЬ ЗЕМЛИ**',
        '',
        'Вы поворачиваете рубильник. Маслянистая кровь планеты хлынула в цистерны Баронов — вместе с зелёным удушливым газом.',
        '',
        'Культ уничтожен, Нео-Тек бежал. Новый Детройт превращается в склеп, где чистый воздух покупают за золотые чипы.',
        '',
        '_Ваш бак всегда полон. Дышать больше нечем._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Эпилог', target: 'endings:iron_progress_poisoned' },
      ],
    },

    q6_res_order: {
      text: [
        '⛓ **ЖЕЛЕЗНЫЙ ПОРЯДОК**',
        '',
        'Вы запускаете чистую добычу под полным контролем уцелевших Баронов. Топливо пойдёт в города — но по их цене и по их закону.',
        '',
        'Следж умирает к утру, успев передать вам свой железный жетон.',
        '',
        '_Мир получил бензин. Свобода — нет._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Эпилог', target: 'endings:barons_iron_order' },
      ],
    },

    q6_res_sabotage: {
      text: [
        '💣 **ПОСЛЕДНИЙ ПОВОРОТ**',
        '',
        'Вы замыкаете реактор охлаждения и прыгаете в трак. За спиной «Чёрная Жила» уходит в огненный гриб.',
        '',
        'Насосы, цистерны, амбиции Следжа — всё погребено под тоннами камня.',
        '',
        '_Дорога свободна._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Эпилог', target: 'endings:endless_road' },
      ],
    },
  },
};
