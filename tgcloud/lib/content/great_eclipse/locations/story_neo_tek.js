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
          target: 'story_neo_tek:q1_res_accept',
        },
        {
          buttonText: '💬 Блеф: выбить аванс (Удача 4)',
          condition: 'stats.luck >= 4',
          effects: { 'resources.chips': '+30' },
          target: 'story_neo_tek:q1_res_bluff_ok',
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
        { buttonText: '😐 Согласиться на 100 чипов', target: 'story_neo_tek:q1_res_apology' },
        { buttonText: '🚪 Уйти и хлопнуть дверью', target: 'story_neo_tek:q1_res_refuse' },
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
          target: 'story_neo_tek:q1_res_pay',
        },
        {
          buttonText: '💥 Таран (броня ≥ 70%)',
          condition: 'hp_percent >= 70',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.05)',
          },
          target: 'story_neo_tek:q1_res_ram_ok',
        },
        {
          buttonText: '💥 Таран (броня < 70%)',
          condition: 'hp_percent < 70',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.30)',
          },
          target: 'story_neo_tek:q1_res_ram_fail',
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
          target: 'story_neo_tek:q1_res_ignore',
        },
        {
          buttonText: '💻 Взломать логи (Уклонение 20)',
          condition: 'stats.evasion >= 20',
          effects: { 'flags.story.neo_tek.truth': '1' },
          target: 'story_neo_tek:q1_res_hack_ok',
        },
        {
          buttonText: '💻 Взломать логи',
          condition: 'stats.evasion < 20',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'flags.story.neo_tek.truth': '0',
          },
          target: 'story_neo_tek:q1_res_hack_fail',
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
          target: 'story_neo_tek:q1_res_blackmail_ok',
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
          target: 'story_neo_tek:q1_res_blackmail_fail',
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
          target: 'story_neo_tek:q1_res_handover',
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

    // --- Результаты Q1 ---------------------------------------------------
    q1_res_accept: {
      text: [
        '🤝 **КОНТРАКТ ПРИНЯТ**',
        '',
        'Корд коротко кивает и передает координаты. Никаких лишних слов — в Новом Детройте ценят тех, кто заводит мотор без торга.',
        '',
        '_Кабель «Ориона» ждет._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_road' },
      ],
    },

    q1_res_bluff_ok: {
      text: [
        '💬 **АВАНС ВЫБИТ**',
        '',
        'Корд хмурится, сверяется с планшетом и неохотно цедит: «Ладно, водитель. Вот тебе 30 чипов на заправку. Но если кабель не будет у меня к вечеру — пеняй на себя».',
        '',
        '_Кошель с чипами ложится на капот._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_road' },
      ],
    },

    q1_res_apology: {
      text: [
        '😐 **НАЗАД К СДЕЛКЕ**',
        '',
        'Вы пожимаете плечами и соглашаетесь на первоначальные сто чипов. Корд смотрит на вас чуть дольше, чем нужно, но кивает.',
        '',
        '_Скользкий осадок остается у обоих._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_road' },
      ],
    },

    q1_res_refuse: {
      text: [
        '🚪 **ДВЕРЬ ХЛОПНУЛА**',
        '',
        '«В Новом Детройте много голодных водителей», — бросает Корд вам в спину. Контракт уходит другому. У ворот охрана провожает вас взглядом.',
        '',
        '_Нео-Тек запомнит этот разговор._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    q1_res_pay: {
      text: [
        '💾 **ПРОЕЗД ОПЛАЧЕН**',
        '',
        'Мародеры лениво оттаскивают остов бензовоза в сторону. Ни царапины на броне, ни лишнего литра топлива.',
        '',
        '_Дешевле, чем ремонт._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_orion' },
      ],
    },

    q1_res_ram_ok: {
      text: [
        '💥 **БАРРИКАДА СМЕТЕНА**',
        '',
        'Тяжелый кенгурятник разносит остов бензовоза в щепки. Мародеры врассыпную прыгают в кювет. Трак лишь слегка встряхивает.',
        '',
        '_Пыль оседает на капоте._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_orion' },
      ],
    },

    q1_res_ram_fail: {
      text: [
        '💥 **МЕТАЛЛ ЗАСТОНАЛ**',
        '',
        'Изношенная броня не выдерживает косого удара. Лист обшивки отрывается с мясом, радиатор шипит, но трак прорывается сквозь завал.',
        '',
        '_Дым тянется следом._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_orion' },
      ],
    },

    q1_res_ignore: {
      text: [
        '📦 **ТОЛЬКО ГРУЗ**',
        '',
        'Вы снимаете кабель и уходите, не глядя на зеленый огонек терминала. Логи двенадцатилетней давности остаются гнить в бетоне.',
        '',
        '_Некоторые двери лучше не открывать._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_return' },
      ],
    },

    q1_res_hack_ok: {
      text: [
        '💻 **ЛОГИ ВСКРЫТЫ**',
        '',
        'Вы перемыкаете контакты дешифратора. На экране всплывают системные команды «Гелиос-9»: «Протокол "Завеса" принят к исполнению. Инициатор: Главный инженер сектора Детройт».',
        '',
        '_Это не был сбой. Небо заперли сами._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_return' },
      ],
    },

    q1_res_hack_fail: {
      text: [
        '⚡ **КОРОТКОЕ ЗАМЫКАНИЕ**',
        '',
        'Вы путаете полярность. Терминал бьет током, защитная плата выгорает с треском, а аккумулятор трака садится.',
        '',
        '_Тайна остается за семью замками._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_return' },
      ],
    },

    q1_res_blackmail_ok: {
      text: [
        '🗣 **КОРД БЛЕДНЕЕТ**',
        '',
        '«Держи язык за зубами, водитель, — цедит он, знаками приказывая охране опустить оружие. — Скоро ты поймешь, почему мы это сделали». Кошель в вашей руке заметно тяжелее.',
        '',
        '_Теперь у вас есть рычаг._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_finish' },
      ],
    },

    q1_res_blackmail_fail: {
      text: [
        '🗣 **НОЖ В СПИНУ**',
        '',
        'Корд холодно смотрит, как двое гвардейцев взводят автоматы: «Ты засунул нос не в свое дело, грязевик». Вам швыряют урезанную плату и забирают кабель.',
        '',
        '_Тайна осталась при вас. Пока._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_finish' },
      ],
    },

    q1_res_handover: {
      text: [
        '🤐 **МОЛЧАНИЕ — ЗОЛОТО**',
        '',
        'Корд жмет вам руку: «Отличная работа. Без этого кабеля наши ученые были как без рук». Кошель с чипами переходит к вам.',
        '',
        '_Никаких вопросов. Пока что._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q1_finish' },
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
          target: 'story_neo_tek:q2_res_ask',
        },
        {
          buttonText: '🗣 Намекнуть на «Завесу» (Удача 4)',
          condition: 'flags.story.neo_tek.truth && stats.luck >= 4',
          effects: { 'flags.story.neo_tek.elias_trust': '1' },
          target: 'story_neo_tek:q2_res_hint_ok',
        },
        {
          buttonText: '🗣 Намекнуть на «Завесу»',
          condition: 'flags.story.neo_tek.truth && stats.luck < 4',
          target: 'story_neo_tek:q2_res_hint_fail',
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
          target: 'story_neo_tek:q2_res_maneuver_ok',
        },
        {
          buttonText: '🏎 Вираж над пропастью',
          condition: 'vars.truckLevel < 3',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.25)',
          },
          target: 'story_neo_tek:q2_res_maneuver_fail',
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
          target: 'story_neo_tek:q2_res_save_truck',
        },
        {
          buttonText: '🛠 Спасти Элиаса (Уклонение 25)',
          condition: 'stats.evasion >= 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.15)',
            'flags.story.neo_tek.navigator': '1',
          },
          target: 'story_neo_tek:q2_res_save_person_ok',
        },
        {
          buttonText: '🛠 Спасти Элиаса',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.30)',
            'flags.story.neo_tek.navigator': '0',
          },
          target: 'story_neo_tek:q2_res_save_person_fail',
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
          target: 'story_neo_tek:q2_res_reward_live',
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
          target: 'story_neo_tek:q2_res_reward_dead',
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

    // --- Результаты Q2 ---------------------------------------------------
    q2_res_ask: {
      text: [
        '❓ **СТАРАЯ ТРАВМА**',
        '',
        'Элиас грустно улыбается: «Старая травма, сынок. Вспышка на солнце, которой не должно было быть».',
        '',
        '_Повязка скрывает больше, чем глаза._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_road' },
      ],
    },

    q2_res_hint_ok: {
      text: [
        '🗣 **ДОВЕРИЕ**',
        '',
        'Элиас вздрагивает, его пальцы судорожно сжимают прибор. «Значит, ты знаешь... Пожалуйста, вези тише. Я помогу тебе понять всё, если доеду живым».',
        '',
        '_Теперь он будет беречь себя. И вас._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_road' },
      ],
    },

    q2_res_hint_fail: {
      text: [
        '🗣 **СТЕНА**',
        '',
        'Элиас замыкается: «Ты бредишь, водитель. Меньше слушай байки на заправках Баронов. Просто крути баранку».',
        '',
        '_Разговор окончен._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_road' },
      ],
    },

    q2_res_maneuver_ok: {
      text: [
        '🏎 **ВИРАЖ НАД ПРОПАСТЬЮ**',
        '',
        'Вы дергаете ручной тормоз, пуская многотонный трак в управляемый занос. Один внедорожник летит на дно каньона, остальные отстают.',
        '',
        '_Элиас вцепился в прибор, но жив._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_polygon' },
      ],
    },

    q2_res_maneuver_fail: {
      text: [
        '🏎 **УДАР О СКАЛУ**',
        '',
        'Трак слишком тяжел для такого маневра. Машину разворачивает и бьет о скалы. Очередь пробивает правый борт кабины.',
        '',
        '_Элиас тяжело ранен, но держится._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_polygon' },
      ],
    },

    q2_res_save_truck: {
      text: [
        '🚚 **ТЕХНИКА ВАЖНЕЕ**',
        '',
        'Вы уводите трак из-под удара. Орбитальный луч превращает тарелку связи и ученого в расплавленное стекло. В кабине остается обгоревший КПК.',
        '',
        '_Данные частично уцелели. Человек — нет._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_finish' },
      ],
    },

    q2_res_save_person_ok: {
      text: [
        '🛠 **УСПЕЛИ**',
        '',
        'Вы выдергиваете квантовый накопитель и падаете в укрытие вместе с доктором. Лазер плавит тарелку, ударная волна бьет по траку — но все живы.',
        '',
        '_Элиас сжимает вашу руку. Данные спасены полностью._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_finish' },
      ],
    },

    q2_res_save_person_fail: {
      text: [
        '🛠 **СЛИШКОМ ПОЗДНО**',
        '',
        'Заклинивший разъем не поддается. Луч бьет в край платформы. Элиас успевает вытолкнуть вас из-под обломков ценой собственной жизни.',
        '',
        '_Накопитель поврежден. Вы уползаете прочь._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_finish' },
      ],
    },

    q2_res_reward_live: {
      text: [
        '🧑‍🔬 **ЖИВОЙ ЭЛИАС**',
        '',
        'Доктор Элиас перед уходом в лазарет говорит: «Орбитальный ИИ сошел с ума от одиночества. На накопителе есть код... Дальше нужен квантовый процессор Баронов».',
        '',
        '_Корд отсчитывает полную плату._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_done' },
      ],
    },

    q2_res_reward_dead: {
      text: [
        '💾 **ОБГОРЕВШИЙ НАКОПИТЕЛЬ**',
        '',
        'Корд в ярости от потери ценного кадра, но данные ему нужны. Ученые забирают накопитель, отмечая, что часть секторов выжжена.',
        '',
        '_Плата урезана. Взгляд Корда — тоже._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q2_done' },
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
          target: 'story_neo_tek:q3_res_accept',
        },
        {
          buttonText: '🗣 Потребовать объяснений (Удача 5)',
          condition: 'flags.story.neo_tek.navigator && stats.luck >= 5',
          target: 'story_neo_tek:q3_res_demand_ok',
        },
        {
          buttonText: '🗣 Потребовать объяснений',
          condition: 'flags.story.neo_tek.navigator && stats.luck < 5',
          target: 'story_neo_tek:q3_res_demand_fail',
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
          target: 'story_neo_tek:q3_res_ram_ok',
        },
        {
          buttonText: '💥 Прижать багги',
          condition: 'vars.truckLevel < 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.30)',
            'resources.hp': '-round(vars.maxHp * 0.35)',
          },
          target: 'story_neo_tek:q3_res_ram_fail',
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
          target: 'story_neo_tek:q3_res_execute',
        },
        {
          buttonText: '💻 Взломать чип на месте (Уклонение 30)',
          condition: 'stats.evasion >= 30',
          effects: {
            'flags.story.neo_tek.truth': '1',
            'flags.story.neo_tek.traitor': '1',
            'flags.story.neo_tek.evidence': '1',
          },
          target: 'story_neo_tek:q3_res_hack_ok',
        },
        {
          buttonText: '💻 Взломать чип на месте',
          condition: 'stats.evasion < 30',
          effects: { 'flags.story.neo_tek.traitor': '0' },
          target: 'story_neo_tek:q3_res_hack_fail',
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
          target: 'story_neo_tek:q3_res_fake_ok',
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
          target: 'story_neo_tek:q3_res_fake_fail',
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
          target: 'story_neo_tek:q3_res_honest',
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

    // --- Результаты Q3 ---------------------------------------------------
    q3_res_accept: {
      text: [
        '🚚 **ПРИКАЗ ПРИНЯТ**',
        '',
        'Вы молча заводите мотор. Корд ценит исполнительность — его люди уже открывают ворота.',
        '',
        '_Стерн далеко не уйдет._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_chase' },
      ],
    },

    q3_res_demand_ok: {
      text: [
        '🗣 **РАЗГОВОР НА РАВНЫХ**',
        '',
        'Корд стискивает зубы: «Элиас слишком мягок, но... ладно. Верни его живым, если сможешь. Но если он начнет трансляцию — стреляй на поражение».',
        '',
        '_Впервые он говорит с вами как с человеком._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_chase' },
      ],
    },

    q3_res_demand_fail: {
      text: [
        '🗣 **ПОД ПРИЦЕЛОМ**',
        '',
        'Корд наставляет на вас пистолет: «Либо ты едешь и выполняешь приказ, либо твоя машина останется в этом гараже навсегда».',
        '',
        '_Спорить с дулом бесполезно._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_chase' },
      ],
    },

    q3_res_ram_ok: {
      text: [
        '💥 **БАГГИ ПРИЖАТ**',
        '',
        'Вы пролетаете между взрывами мин и бьете багги в заднее крыло. Машину беглеца разворачивает, она врезается в валун и глохнет.',
        '',
        '_Стерн заперт внутри._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_roadside' },
      ],
    },

    q3_res_ram_fail: {
      text: [
        '💥 **МИНА ПОД КРЫЛОМ**',
        '',
        'Взрыв разрывает переднее крыло, осколки пробивают радиатор. Багги отрывается вперед, но буря заносит его на повороте.',
        '',
        '_Обе машины дымят посреди пыли._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_roadside' },
      ],
    },

    q3_res_execute: {
      text: [
        '🔫 **ПРИГОВОР ИСПОЛНЕН**',
        '',
        'Вы забираете чип и оставляете Стерна умирать в буре. Цифровые замки на носителе холодны под пальцами.',
        '',
        '_Он успел сказать слишком много. Или слишком мало._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_return' },
      ],
    },

    q3_res_hack_ok: {
      text: [
        '💻 **ПРАВДА НА ЭКРАНЕ**',
        '',
        'Стерн шепчет мастер-пароль. На экране разворачиваются чертежи: Нео-Тек намеренно держит солнце выключенным, чтобы голодающие города подчинились.',
        '',
        '_Вы прячете оригинал и готовите пустышку._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_return' },
      ],
    },

    q3_res_hack_fail: {
      text: [
        '💻 **ЛОГИ СТЕРТЫ**',
        '',
        'Защита чипа блокирует грубый взлом. Бортовая сеть багги коротит, стирая часть логов. Вы успеваете выдернуть запертый носитель.',
        '',
        '_Стерн умирает, не назвав мастер-код._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_return' },
      ],
    },

    q3_res_fake_ok: {
      text: [
        '🎭 **ПУСТЫШКА ПРОШЛА**',
        '',
        'Корд смотрит вам в глаза, но берет подделку. Инженеры пожимают плечами: «Файлы повреждены взрывом, сэр, но структура на месте».',
        '',
        '_Настоящие чертежи остаются у вас._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_done' },
      ],
    },

    q3_res_fake_fail: {
      text: [
        '🎭 **РАЗОБЛАЧЕН**',
        '',
        'Техники мгновенно распознают обман. Корд бьет вас рукояткой по лицу: «Ты решил поиграть в героя, крыса?! Обыскать трак!»',
        '',
        '_Оригинал находят в бардачке. Вас вышвыривают с черной меткой._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_done' },
      ],
    },

    q3_res_honest: {
      text: [
        '📦 **ЧИП У КОРПОРАЦИИ**',
        '',
        'Корд доволен: «Отличная работа. Ты доказал свою верность Корпорации. Скоро мы начнем финальную стадию проекта».',
        '',
        '_Вы отдали больше, чем железку._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q3_done' },
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
          target: 'story_neo_tek:q4_res_stealth',
        },
        {
          buttonText: '💥 Выбить боеприпасы (Удача 4)',
          condition: 'vars.repNeoTek >= 5 && stats.luck >= 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.05)',
            'flags.story.neo_tek.turret': '1',
          },
          target: 'story_neo_tek:q4_res_support_ok',
        },
        {
          buttonText: '💥 Выбить боеприпасы',
          condition: 'vars.repNeoTek >= 5 && stats.luck < 4',
          target: 'story_neo_tek:q4_res_support_fail',
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
          target: 'story_neo_tek:q4_res_perimeter_hack_ok',
        },
        {
          buttonText: '💻 Перегрузить питание',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.30)',
            'flags.story.neo_tek.barons_alerted': '1',
          },
          target: 'story_neo_tek:q4_res_perimeter_hack_fail',
        },
        {
          buttonText: '💥 Прорыв с турелью (Ходовая 4)',
          condition: 'flags.story.neo_tek.turret && vars.truckLevel >= 4',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'flags.story.neo_tek.barons_alerted': '1',
          },
          target: 'story_neo_tek:q4_res_turret_ok',
        },
        {
          buttonText: '💥 Прорыв с турелью',
          condition: 'flags.story.neo_tek.turret && vars.truckLevel < 4',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.40)',
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'flags.story.neo_tek.barons_alerted': '1',
          },
          target: 'story_neo_tek:q4_res_turret_fail',
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
          target: 'story_neo_tek:q4_res_brute',
        },
        {
          buttonText: '💻 Обойти биометрию (Уклонение 30)',
          condition: 'stats.evasion >= 30',
          effects: {
            'flags.story.neo_tek.processor_damaged': '0',
            'flags.story.neo_tek.truth': '1',
          },
          target: 'story_neo_tek:q4_res_vault_hack_ok',
        },
        {
          buttonText: '💻 Обойти биометрию',
          condition: 'stats.evasion < 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'flags.story.neo_tek.processor_damaged': '1',
          },
          target: 'story_neo_tek:q4_res_vault_hack_fail',
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
          target: 'story_neo_tek:q4_res_loyal_intact',
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
          target: 'story_neo_tek:q4_res_loyal_damaged',
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
          target: 'story_neo_tek:q4_res_loyal_fail',
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
          target: 'story_neo_tek:q4_res_deal',
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

    // --- Результаты Q4 ---------------------------------------------------
    q4_res_stealth: {
      text: [
        '🕶 **ТИХИЙ ПЛАН**',
        '',
        'Вы принимаете маскировочный модуль Нео-Тека и выезжаете к «Узлу-42». Никакой лишней пальбы — только холодный расчет.',
        '',
        '_Бароны не должны узнать о налете._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_perimeter' },
      ],
    },

    q4_res_support_ok: {
      text: [
        '💥 **БОЕПРИПАСЫ ПОЛУЧЕНЫ**',
        '',
        'Корд соглашается и выдает комплект модифицированных кумулятивных зарядов. Турель довольно гудит под весом бронебойных снарядов.',
        '',
        '_Теперь есть чем ответить на вышку._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_perimeter' },
      ],
    },

    q4_res_support_fail: {
      text: [
        '💥 **ОТКАЗ**',
        '',
        'Корд отрезает: «Мы не собираемся устраивать маленькую войну, водитель. Действуй тихо. Ресурсы ограничены».',
        '',
        '_Стандартный боекомплект. И никаких гарантий._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_perimeter' },
      ],
    },

    q4_res_perimeter_hack_ok: {
      text: [
        '💻 **СВЕТ ПОГАС**',
        '',
        'Свет на вышках гаснет на три минуты. Охрана Баронов паникует в рации, ругая генератор. Вы беспрепятственно проезжаете к гермозатвору.',
        '',
        '_Ни одна сирена не поднялась._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_vault' },
      ],
    },

    q4_res_perimeter_hack_fail: {
      text: [
        '💻 **ПРОЖЕКТОР НА ВАС**',
        '',
        'Терминал выдает ошибку. Луч прожектора выхватывает трак из темноты, по броне стучат пулеметные очереди. Вы прорываетесь силой.',
        '',
        '_Бароны знают, что вы здесь._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_vault' },
      ],
    },

    q4_res_turret_ok: {
      text: [
        '💥 **ВОРОТА СНЕСЕНЫ**',
        '',
        'Выстрел турели разносит вышку. Трак сносит стальные ворота, и ошеломленные Бароны не успевают заблокировать внутренние шлюзы.',
        '',
        '_Наглость работает._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_vault' },
      ],
    },

    q4_res_turret_fail: {
      text: [
        '💥 **ПРОТИВОТАНКОВЫЙ ЕЖ**',
        '',
        'Вы промахиваетесь по опоре вышки. Трак врезается в усиленный еж, теряет скорость, и в кабину летят ручные гранаты.',
        '',
        '_Приходится пробивать стену в другом месте._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_vault' },
      ],
    },

    q4_res_brute: {
      text: [
        '🪓 **СИЛОЙ**',
        '',
        'Вы перерубаете кабели питания и вырываете процессор из гнезда. Охлаждающий гель вытекает на пол, оставляя едкий след.',
        '',
        '_Прибор жив. Но едва ли надолго._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_exit' },
      ],
    },

    q4_res_vault_hack_ok: {
      text: [
        '💻 **БИОМЕТРИЯ ОБОЙДЕНА**',
        '',
        'Консоль щелкает, станина плавно опускается. На экране мелькает лог: «Проект "Гелиос". Санкция на изоляцию поверхности подтверждена. Подпись: Высший Совет Инженеров Детройта».',
        '',
        '_Процессор цел. И вы знаете больше, чем хотели бы._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_exit' },
      ],
    },

    q4_res_vault_hack_fail: {
      text: [
        '💻 **ВЫЖИГАНИЕ МАТРИЦ**',
        '',
        'Защита распознает атаку и активирует выжигание. Процессор бьет током, часть ячеек памяти плавится, электроника трака сбоит.',
        '',
        '_Прибор поврежден. Но вынести его еще можно._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_exit' },
      ],
    },

    q4_res_loyal_intact: {
      text: [
        '🚚 **ПРОРЫВ С ЧИСТЫМ ПРОЦЕССОРОМ**',
        '',
        'Трак со скрежетом расталкивает броневик Баронов и уходит в ночную темноту. Корд встречает вас у ворот лаборатории.',
        '',
        '_Процессор в идеальном состоянии. Плата — полная._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_done' },
      ],
    },

    q4_res_loyal_damaged: {
      text: [
        '🚚 **ПРОРЫВ С БРАКОМ**',
        '',
        'Вы уходите от погони, но процессор в кузове подтекает охлаждающим гелем. Корд морщится, глядя на контейнер.',
        '',
        '_Работа сдана. Плата урезана._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_done' },
      ],
    },

    q4_res_loyal_fail: {
      text: [
        '🚚 **БРОНЕВИК ВЫДЕРЖАЛ**',
        '',
        'Ваш трак глохнет от удара. Охрана вытаскивает вас из кабины, Бароны забирают процессор силой и выставляют счет за ремонт своей техники.',
        '',
        '_Нео-Тек не прощает провалов. Но контракт еще держится._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_done' },
      ],
    },

    q4_res_deal: {
      text: [
        '🤝 **СДЕЛКА С БАРОНАМИ**',
        '',
        'Вы глушите мотор и отдаете контейнер. Бароны громко хохочут, отсчитывая тяжелый мешок чипов. Процессор уходит в их руки.',
        '',
        '_Корпорация узнает об этом. Рано или поздно._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q4_done' },
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
          target: 'story_neo_tek:q5_res_prepare',
        },
        {
          buttonText: '🗣 Давить на Корда (Удача 5)',
          condition: 'flags.story.neo_tek.truth && stats.luck >= 5',
          effects: { 'flags.story.neo_tek.kord_confession': '1' },
          target: 'story_neo_tek:q5_res_pressure_ok',
        },
        {
          buttonText: '🗣 Давить на Корда',
          condition: 'flags.story.neo_tek.truth && stats.luck < 5',
          target: 'story_neo_tek:q5_res_pressure_fail',
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
          target: 'story_neo_tek:q5_res_ram_ok',
        },
        {
          buttonText: '💥 Столкнуть брандер',
          condition: 'vars.truckLevel < 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.40)',
          },
          target: 'story_neo_tek:q5_res_ram_fail',
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
          target: 'story_neo_tek:q5_res_tech_ok',
        },
        {
          buttonText: '🛠 Перепрошить дешифратор',
          condition: 'stats.evasion < 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'vars.heliosSignal': '1',
          },
          target: 'story_neo_tek:q5_res_tech_fail',
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
          target: 'story_neo_tek:q5_res_full_signal',
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
          target: 'story_neo_tek:q5_res_distorted_signal',
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

    // --- Результаты Q5 ---------------------------------------------------
    q5_res_prepare: {
      text: [
        '🛡 **ТУРЕЛИ ГОТОВЫ**',
        '',
        'Вы разворачиваете турели и занимаете позицию у главного терминала. Квантовое сердце гудит в кузове, отдавая тепло в морозный воздух.',
        '',
        '_Остается только ждать._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_assault' },
      ],
    },

    q5_res_pressure_ok: {
      text: [
        '🗣 **КОРД ПРИЗНАЕТСЯ**',
        '',
        'Корд мрачно смотрит на радар: «Да, орбита получит право на зачистку очагов агрессии. И ты поможешь нам запустить этот Рассвет».',
        '',
        '_Теперь у вас есть его слова._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_assault' },
      ],
    },

    q5_res_pressure_fail: {
      text: [
        '🗣 **ЗАТКНИСЬ И СЛЕДИ**',
        '',
        '«Заткнись и следи за датчиками периметра, грязевик! — отрезает Корд. — Мы платим тебе за доставку и защиту, а не за философию».',
        '',
        '_Воздух в кабине становится ледяным._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_assault' },
      ],
    },

    q5_res_ram_ok: {
      text: [
        '💥 **БРАНДЕР В УЩЕЛЬЕ**',
        '',
        'Вы бьете брандер в заднюю ось. Вражеская машина теряет управление и летит вниз, взрываясь глубоко в ущелье. Волна огня накрывает трак, но броня держит.',
        '',
        '_Оборона удержана._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_code' },
      ],
    },

    q5_res_ram_fail: {
      text: [
        '💥 **ВЗРЫВ РЯДОМ**',
        '',
        'Брандер детонирует слишком близко. Ударная волна швыряет обломки на капот, сминая решетку и повреждая кабели процессора.',
        '',
        '_Процессор искрит. Но станция еще стоит._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_code' },
      ],
    },

    q5_res_tech_ok: {
      text: [
        '🛠 **ЧИСТАЯ СИНУСОИДА**',
        '',
        'Ваши пальцы летают по клавиатуре. Найден скрытый бэкдор, энергия трака стабилизирует квантовое сердце. На экране — идеальная зеленая линия.',
        '',
        '_Связь без искажений._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_voice' },
      ],
    },

    q5_res_tech_fail: {
      text: [
        '🛠 **ПОЛЯРНОСТЬ ПЕРЕПУТАНА**',
        '',
        'Энергетический всплеск выжигает блок процессора. Сигнал уходит в небо, но идет с огромными помехами. ИИ принимает вас за поврежденный узел.',
        '',
        '_Две минуты истекли._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_voice' },
      ],
    },

    q5_res_full_signal: {
      text: [
        '📶 **ПОЛНЫЙ СИГНАЛ**',
        '',
        'ИИ передает чистый пакет: «Протокол "Завеса" активен 12 лет. Орбитальное кинетическое оружие готово к перезапуску по сигналу с Земли». Корд торжествующе протягивает вам чипы.',
        '',
        '_Полная картина ясна. И она страшна._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_done' },
      ],
    },

    q5_res_distorted_signal: {
      text: [
        '📶 **ИСКАЖЕННЫЙ СИГНАЛ**',
        '',
        'ИИ хрипит сквозь помехи: «Ошибка авторизации... Запуск протокола самоочищения орбиты через 24 часа...» Экран гаснет. Корд в ужасе смотрит на вас.',
        '',
        '_Небо теперь охотится за всеми._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q5_done' },
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
          target: 'story_neo_tek:q6_res_ram_ok',
        },
        {
          buttonText: '💥 Таран флагмана',
          condition: 'hp_percent < 50 || vars.truckLevel < 4',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.90)',
            'resources.diesel': '-round(vars.maxDiesel * 0.50)',
            'flags.story.neo_tek.truck_wrecked': '1',
          },
          target: 'story_neo_tek:q6_res_ram_fail',
        },
        {
          buttonText: '🛡 Оборона турелями (Уклонение 25)',
          condition: 'stats.evasion >= 25',
          target: 'story_neo_tek:q6_res_turrets_ok',
        },
        {
          buttonText: '🛡 Оборона турелями',
          condition: 'stats.evasion < 25',
          effects: { 'resources.hp': '-round(vars.maxHp * 0.40)' },
          target: 'story_neo_tek:q6_res_turrets_fail',
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
          target: 'story_neo_tek:q6_res_diplomacy_ok',
        },
        {
          buttonText: '🗣 Переубедить Жреца',
          condition: 'flags.story.neo_tek.truth && stats.luck < 6',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'flags.story.neo_tek.priest_alive': '0',
          },
          target: 'story_neo_tek:q6_res_diplomacy_fail',
        },
        {
          buttonText: '🔫 Выстрелить первым',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'flags.story.neo_tek.priest_alive': '0',
          },
          target: 'story_neo_tek:q6_res_force',
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

    // --- Результаты Q6 ---------------------------------------------------
    q6_res_ram_ok: {
      text: [
        '💥 **ФЛАГМАН УНИЧТОЖЕН**',
        '',
        'Вы сносите флагман Баронов точным ударом в бензобак. Взрыв очищает южный сектор. Лаборатория спасена, но ваш трак — груда дымящегося лома.',
        '',
        '_Дальше — пешком. И быстро._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q6_roof' },
      ],
    },

    q6_res_ram_fail: {
      text: [
        '💥 **КАБИНА СМЯТА**',
        '',
        'Изношенная броня не выдерживает. Броневик сминает кабину, вы выживаете чудом, но Бароны успевают разнести один из энергоблоков.',
        '',
        '_На терминал на крыше идет нестабильный ток._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q6_roof' },
      ],
    },

    q6_res_turrets_ok: {
      text: [
        '🛡 **ТУРЕЛИ ДЕРЖАТ**',
        '',
        'Вы перенаправляете цепи питания, и турели захлебываются огнем. Штурмовые отряды отступают. Трак стоит целый.',
        '',
        '_Лаборатория удерживает позиции._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q6_roof' },
      ],
    },

    q6_res_turrets_fail: {
      text: [
        '🛡 **ТУРЕЛЬ ЗАКЛИНИЛО**',
        '',
        'Вы путаете полярность, и турель замолкает в разгар боя. Пехота Баронов прорывается в док, расстреливая обшивку трака.',
        '',
        '_Корд ранен. Но жив._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q6_roof' },
      ],
    },

    q6_res_diplomacy_ok: {
      text: [
        '🗣 **ЖРЕЦ ОПУСКАЕТ ДЕТОНАТОР**',
        '',
        'Вы раскрываете чертежи Стерна. Жрец замирает, опускает сумку и падает на колени: «Вы открыли мне глаза. Затмение было лишь цепью в руках инженеров...»',
        '',
        '_Терминал в безопасности. И у вас появился выбор._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q6_choice' },
      ],
    },

    q6_res_diplomacy_fail: {
      text: [
        '🗣 **ВЗРЫВ НА КРЫШЕ**',
        '',
        'Жрец успевает нажать кнопку. Взрыв разносит половину распределительного щита. Жрец мертв, терминал искрит, запуская обратный отсчет.',
        '',
        '_Время на решение сгорает вместе с экраном._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q6_choice' },
      ],
    },

    q6_res_force: {
      text: [
        '🔫 **ВЫСТРЕЛ ПЕРВЫМ**',
        '',
        'Вы стреляете раньше, чем Жрец успевает нажать. Детонатор падает на бетон, но очередь задевает распределительный щит.',
        '',
        '_Терминал шипит. Но код еще можно ввести._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_neo_tek:q6_choice' },
      ],
    },
  },
};
