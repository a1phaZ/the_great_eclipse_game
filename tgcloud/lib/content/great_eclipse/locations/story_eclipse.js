export const storyEclipse = {
  locationId: 'story_eclipse',
  name: 'Сюжет: Дети Затмения',
  scenes: {
    // ---------------------------------------------------------------------
    // Q1 «Пепел на ветровом стекле»
    // ---------------------------------------------------------------------
    q1_start: {
      text: [
        '🌑 **«ПЕПЕЛ НА ВЕТРОВОМ СТЕКЛЕ»**',
        '',
        'Поздняя ночь в Новом Детройте. Фары выхватывают из темноты фигуру в рваном балахоне и тяжёлом брезентовом плаще. Сестра Мира перебирает четки из стреляных гильз.',
        '',
        'Она просит погрузить двенадцать запечатанных свинцовых урн и доставить их к границам жилых кварталов. Плата — 120 чипов.',
        '',
        '_В её глазах — не безумие, а очень старая усталость._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🤐 Молча принять груз',
          effects: { 'vars.repEclipse': '+1' },
          target: 'story_eclipse:q1_road',
        },
        {
          buttonText: '💬 Торг: надбавка за рессоры (Удача 5)',
          condition: 'stats.luck >= 5',
          target: 'story_eclipse:q1_res_bargain_ok',
        },
        {
          buttonText: '💬 Торг: надбавка за рессоры',
          condition: 'stats.luck < 5',
          target: 'story_eclipse:q1_res_bargain_fail',
        },
      ],
    },

    q1_res_bargain_ok: {
      text: [
        '🪙 **НАДБАВКА ЗА ВЕРУ**',
        '',
        'Мира замирает, вглядываясь в вас сквозь прорези капюшона.',
        '',
        '«Путь праведника тяжел, водитель. Небо воздаст тебе».',
        '',
        'Она протягивает старый кожаный мешочек с довоенными серебряными монетами.',
        '',
        '**+30 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Загрузить урны', target: 'story_eclipse:q1_road' },
      ],
    },

    q1_res_bargain_fail: {
      text: [
        '❌ **ТОРГ СО СМЕРТЬЮ**',
        '',
        'Мира холодно шипит: «Ты торгуешься со смертью, слепец. Твой трак доедет и так, если на то будет воля Затмения».',
        '',
        '«Либо ты берешь урны, либо пепел очищения просыплется на твой собственный дом».',
        '',
        '_Послушники за её спиной не двигаются. Пока._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '😔 Уступить и взять груз',
          effects: { 'vars.repEclipse': '-1' },
          target: 'story_eclipse:q1_road',
        },
        {
          buttonText: '🚪 Указать культистке на дверь',
          target: 'story_eclipse:q1_res_refuse',
        },
      ],
    },

    q1_res_refuse: {
      text: [
        '🚪 **ОТКАЗ**',
        '',
        'Мира уходит в темноту, не оборачиваясь. Через час в гараж стучат штурмовики Нео-Тека.',
        '',
        'Они предлагают выкупить ваше расписание патрулей. Технократам всегда нужны глаза на дорогах.',
        '',
        '_Культ не забывает отказов. Но и инженеры платят вовремя._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '⬅️ К фракционным делам',
          effects: {
            'vars.repNeoTek': '+2',
            'vars.repEclipse': '-3',
          },
          target: 'new_detroit:story_board',
        },
      ],
    },

    q1_road: {
      text: [
        '🌫 **ТРЕСК В ЭФИРЕ**',
        '',
        'Через двадцать километров Тракт затягивает аномальный туман. Рация захлёбывается белым шумом, датчик радиации щёлкает всё чаще.',
        '',
        'Из тумана наперерез вылетает бронеавтомобиль патруля Нео-Тека. Прожекторы бьют в глаза.',
        '',
        '«Неопознанный трак! Заглушить двигатель, приготовиться к досмотру!»',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🌫 Уйти по объездной вслепую (Вождение 3)',
          condition: 'vars.truckLevel >= 3',
          effects: { 'resources.diesel': '-round(vars.maxDiesel * 0.10)' },
          target: 'story_eclipse:q1_res_stealth_ok',
        },
        {
          buttonText: '🌫 Уйти по объездной вслепую',
          condition: 'vars.truckLevel < 3',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.20)',
          },
          target: 'story_eclipse:q1_res_stealth_fail',
        },
      ],
    },

    q1_res_stealth_ok: {
      text: [
        '🌫 **ТИХИЙ ОБХОД**',
        '',
        'Вы помните рельеф наизусть. Тяжёлый трак бесшумно скатывается в низину и прячется за остовами старых заводов.',
        '',
        'Патруль проносится мимо, бесцельно разрезая туман лучами света.',
        '',
        '_Урны в кузове тихо позвякивают на ухабах._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q1_secret' },
      ],
    },

    q1_res_stealth_fail: {
      text: [
        '💥 **БЕТОННЫЙ БЛОК**',
        '',
        'Колесо налетает на бетонный блок. Машина кренится, зеркала срезает очередью, обшивку рвёт рикошетом.',
        '',
        'Вы уходите, оставив позади шлейф дыма и вой сирены.',
        '',
        '_Инженеры запомнили номер вашего трака._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q1_secret' },
      ],
    },

    q1_secret: {
      text: [
        '⚗️ **СЕКРЕТ МЁРТВОЙ ЖИЖИ**',
        '',
        'На ухабах одна урна срывается с креплений и раскалывается. На пол кузова сыплется мелкодисперсный маслянистый порошок.',
        '',
        'Он пахнет металлом, химикатами и графитом. Бортовой сканер выдаёт странные результаты.',
        '',
        '_Это точно не прах от костра._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🙈 Игнорировать и ехать дальше',
          effects: { 'flags.story.eclipse.knows_ash': '0' },
          target: 'story_eclipse:q1_finish',
        },
        {
          buttonText: '🔬 Глубокий анализ (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: { 'flags.story.eclipse.knows_ash': '1' },
          target: 'story_eclipse:q1_res_analyze_ok',
        },
        {
          buttonText: '🔬 Глубокий анализ',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'flags.story.eclipse.knows_ash': '0',
          },
          target: 'story_eclipse:q1_res_analyze_fail',
        },
      ],
    },

    q1_res_analyze_ok: {
      text: [
        '🔬 **ГРАФИТОВАЯ ПЫЛЬ**',
        '',
        'Терминал завершает спектральный анализ. Это графитовая и металлическая микропыль — военный инструмент для глушения радиочастот и создания зон ЭМИ-изоляции.',
        '',
        'Культ не хоронит прах покойников. Они методично рассыпают эту пыль вокруг городов, отрезая выживших от орбиты.',
        '',
        '**Вы узнали тайное оружие Затмения.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q1_finish' },
      ],
    },

    q1_res_analyze_fail: {
      text: [
        '🤢 **ЕДКАЯ ПЫЛЬ**',
        '',
        'При попытке собрать пробу вы вдыхаете едкую взвесь. Лёгкие обжигает кашлем, в глазах темнеет.',
        '',
        'КПК при контакте со смесью заклинивает и перезагружается, сжигая диагностическую плату.',
        '',
        '_Данные потеряны. Зато вы живы._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q1_finish' },
      ],
    },

    q1_finish: {
      text: [
        '🪦 **НА КРАЮ БЕЗДНЫ**',
        '',
        'Точка рандеву — полуразрушенное кладбище старых машин на окраине Тракта. Молчаливые послушники с факелами окружают трак.',
        '',
        'Мира забирает урны и внимательно осматривает замки контейнеров.',
        '',
        '_Самое время задать неудобный вопрос._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 «Вы душите города пылью» (Удача 6)',
          condition: 'flags.story.eclipse.knows_ash && stats.luck >= 6',
          effects: {
            'resources.chips': '+170',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q1': '1',
          },
          target: 'story_eclipse:q1_res_blackmail_ok',
        },
        {
          buttonText: '🗣 «Вы душите города пылью»',
          condition: 'flags.story.eclipse.knows_ash && stats.luck < 6',
          effects: {
            'resources.chips': '+60',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q1': '1',
          },
          target: 'story_eclipse:q1_res_blackmail_fail',
        },
        {
          buttonText: '🤝 Молча сдать груз (+120 чипов)',
          effects: {
            'resources.chips': '+120',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q1': '1',
          },
          target: 'story_eclipse:q1_res_pragmatic',
        },
      ],
    },

    q1_res_blackmail_ok: {
      text: [
        '🌑 **ЗРЯЧИЙ СРЕДИ СЛЕПЦОВ**',
        '',
        'Мира долго смотрит на вас. Потом её лицо искажает фанатичная, но грустная улыбка.',
        '',
        '«Да. Мы гасим эфир. Если инженеры докричатся до неба, Тварь на орбите проснётся и сожжёт то, что осталось от человечества».',
        '',
        'Она протягивает увеличенный мешок чипов. **+170 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q1_done' },
      ],
    },

    q1_res_blackmail_fail: {
      text: [
        '🔫 **СЛИШКОМ ЛЮБОПЫТНЫЙ**',
        '',
        'Вы звучите слишком угрожающе. Послушники вскидывают ржавые обрезы.',
        '',
        'Мира бьёт вас наотмашь плетью: «Забирай свои гроши и проваливай, пока мы не превратили твоё тело в настоящий пепел!»',
        '',
        'Вам швыряют урезанный гонорар. **+60 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q1_done' },
      ],
    },

    q1_res_pragmatic: {
      text: [
        '🤝 **ТИШИНА — ТОЖЕ РАБОТА**',
        '',
        'Вы молча сдаёте груз и забираете деньги. Мира кивает: «Твой трак послужил тишине, водитель».',
        '',
        'Никаких вопросов. Никаких ответов. Только чипы и дорога.',
        '',
        '**+120 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q1_done' },
      ],
    },

    q1_done: {
      text: [
        '✅ **«ПЕПЕЛ НА ВЕТРОВОМ СТЕКЛЕ» ЗАВЕРШЁН**',
        '',
        'Урны у Культа. Дети Затмения довольны, Нео-Тек и Бароны — не очень.',
        '',
        '**+15 репутации Детей Затмения. −5 Нео-Теку и Баронам.**',
        '',
        '_Следующий квест откроется на 15 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q2 «Экстаз частоты»
    // ---------------------------------------------------------------------
    q2_start: {
      text: [
        '📡 **«ЭКСТАЗ ЧАСТОТЫ»**',
        '',
        'В тайное убежище послушники приносят человека. Его бьёт крупная дрожь, из носа течёт кровь, из армейских разъёмов в черепе сыплются искры.',
        '',
        'Это Брат Иона — «пророк» Культа. Он беспрерывно шепчет цифры.',
        '',
        'Иерархи требуют доставить его на вышку «Игла» на Пике Одиночества прямо во время песчаной бури. Плата — 150 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚚 Запереть пассажира и ехать',
          effects: { 'flags.story.eclipse.ion_lucid': '0' },
          target: 'story_eclipse:q2_road',
        },
        {
          buttonText: '🔌 Стабилизировать нейросеть (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: {
            'vars.repEclipse': '+1',
            'flags.story.eclipse.ion_lucid': '1',
          },
          target: 'story_eclipse:q2_res_tech_ok',
        },
        {
          buttonText: '🔌 Стабилизировать нейросеть',
          condition: 'stats.evasion < 25',
          effects: {
            'flags.story.eclipse.prophet_fried': '1',
            'flags.story.eclipse.ion_lucid': '0',
          },
          target: 'story_eclipse:q2_res_tech_fail',
        },
      ],
    },

    q2_res_tech_ok: {
      text: [
        '🔌 **ПРОСВЕТЛЕНИЕ**',
        '',
        'Вы подключаете диагностический кабель к затылку Ионы и изолируете выгоревший порт.',
        '',
        'На секунду его взгляд проясняется: «Спасибо, водитель... Бароны выставили кордоны на Стыке. Езжай через солончаки, умоляю!»',
        '',
        '**Открыт обходной путь в следующей сцене.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q2_road' },
      ],
    },

    q2_res_tech_fail: {
      text: [
        '⚡ **КОРОТКОЕ ЗАМЫКАНИЕ**',
        '',
        'При подключении происходит разряд. Иона кричит от боли, его тело выгибается дугой.',
        '',
        'Сканер фиксирует тяжёлое повреждение нейрочипа. Пророк бредит ещё сильнее.',
        '',
        '_Он больше не подскажет дорогу._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q2_road' },
      ],
    },

    q2_road: {
      text: [
        '🌪 **ТОПЛИВНЫЙ ЗАСЛОН**',
        '',
        'Песчаная буря накрывает Тракт. Видимость — пять метров. Сквозь пелену проступают тяжёлые бронемашины Ржавых Баронов, перекрывшие каньон.',
        '',
        'Прожекторы лихорадочно ищут цель. Наводку на вас явно кто-то слил.',
        '',
        '_Впереди — только огонь или неизвестность._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Прорыв сквозь бурю (Вождение 4)',
          condition: 'vars.truckLevel >= 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.10)',
          },
          target: 'story_eclipse:q2_res_ram_ok',
        },
        {
          buttonText: '💥 Прорыв сквозь бурю',
          condition: 'vars.truckLevel < 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.35)',
          },
          target: 'story_eclipse:q2_res_ram_fail',
        },
        {
          buttonText: '🧭 Обход по солончакам (подсказка Ионы)',
          condition: 'flags.story.eclipse.ion_lucid',
          effects: { 'resources.diesel': '-round(vars.maxDiesel * 0.10)' },
          target: 'story_eclipse:q2_res_bypass',
        },
      ],
    },

    q2_res_ram_ok: {
      text: [
        '💥 **ЖЕЛЕЗНЫЙ КЛИН**',
        '',
        'Вы ловите момент. Кенгурятник врезается в лёгкий джип Баронов и отбрасывает его в сторону.',
        '',
        'Пули тяжело стучат по обшивке, но вы уходите в бурю.',
        '',
        '_Иона хрипит на пассажирском месте, но не замолкает._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q2_tower' },
      ],
    },

    q2_res_ram_fail: {
      text: [
        '💥 **УДАР О БУЛЬДОЗЕР**',
        '',
        'Трак на полной скорости врезается в укреплённый бульдозер. Передний мост сминает, машину разворачивает.',
        '',
        'Очередь прошивает лобовое стекло, осколки летят в кабину.',
        '',
        'Вы вырываетесь на честном слове и дымящем радиаторе.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q2_tower' },
      ],
    },

    q2_res_bypass: {
      text: [
        '🧭 **СОЛОНЧАКИ**',
        '',
        'Пользуясь подсказкой Ионы, вы гасите огни и ведёте трак по хрустящей корке солончака.',
        '',
        'Машины Баронов остаются далеко позади, бесцельно расстреливая пустую бурю.',
        '',
        '_Иона шепчет цифры в такт колесам._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q2_tower' },
      ],
    },

    q2_tower: {
      text: [
        '🗼 **ЭКСТАЗ НА ВЫШКЕ**',
        '',
        'Иона выбегает из кабины и ползёт по лестнице к главному терминалу «Иглы». Буря ревёт.',
        '',
        'Когда он подключает голову напрямую к щиту, радиостанция трака включается сама. Из динамиков раздаётся оглушительный цифровой скрежет.',
        '',
        'Электроника начинает дымиться. Входящий сигнал обладает разрушительной ЭМИ-мощностью.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔌 Выдернуть кабели, спасти трак',
          effects: { 'flags.story.eclipse.prophet_fried': '1' },
          target: 'story_eclipse:q2_res_save_truck',
        },
        {
          buttonText: '💻 Перехватить частоту буфером (Техника 30)',
          condition: 'stats.evasion >= 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'flags.story.eclipse.prophet_fried': '0',
          },
          target: 'story_eclipse:q2_res_intercept_ok',
        },
        {
          buttonText: '💻 Перехватить частоту буфером',
          condition: 'stats.evasion < 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.25)',
            'flags.story.eclipse.prophet_fried': '1',
          },
          target: 'story_eclipse:q2_res_intercept_fail',
        },
      ],
    },

    q2_res_save_truck: {
      text: [
        '🔌 **МАШИНА ДОРОЖЕ**',
        '',
        'Вы вырываете кабели с корнем. Бортовой компьютер жив, но на вершине вышки Иона получает полный ментальный удар.',
        '',
        'Его крик тонет в вое бури.',
        '',
        '_Вы сделали разумный выбор. От этого не легче._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q2_finish' },
      ],
    },

    q2_res_intercept_ok: {
      text: [
        '💻 **ЛОГ РАСШИФРОВАН**',
        '',
        'Ваши пальцы летают по клавиатуре, создавая аварийный контур заземления. На экране разворачивается расшифровка:',
        '',
        '«...источник: платформа РЭБ "Азраил". Протокол деструктивного кодирования активен...»',
        '',
        'Сигнал пойман. Иона без сознания, но его мозг цел. **Вы узнали, кто кричит с неба.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q2_finish' },
      ],
    },

    q2_res_intercept_fail: {
      text: [
        '⚡ **ПЕРЕГРУЗКА**',
        '',
        'Вы не успеваете сбалансировать частоту. Разряд выжигает предохранители, радиостанция взрывается снопом искр.',
        '',
        'На вершине вышки Иона заходится в кровавом кашле. Его разум окончательно превращается в кашу.',
        '',
        '_Небо ответило на ваш вызов._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q2_finish' },
      ],
    },

    q2_finish: {
      text: [
        '🌑 **ИТОГИ ТРАНСЛЯЦИИ**',
        '',
        'Буря утихла. Вы спускаете обмякшее тело Ионы в кабину и возвращаетесь на базу Культа.',
        '',
        'Сестра Мира и старейшины окружают трак. Они подключаются к КПК пророка, чтобы проверить результаты.',
        '',
        '_Сказать правду или забрать деньги?_',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 «Ваш бог — военный спутник "Азраил"» (Удача 7)',
          condition: '!flags.story.eclipse.prophet_fried && stats.luck >= 7',
          effects: {
            'resources.chips': '+250',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q2': '1',
          },
          target: 'story_eclipse:q2_res_truth_ok',
        },
        {
          buttonText: '🗣 «Ваш бог — военный спутник "Азраил"»',
          condition: '!flags.story.eclipse.prophet_fried && stats.luck < 7',
          effects: {
            'resources.chips': '+75',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q2': '1',
          },
          target: 'story_eclipse:q2_res_truth_fail',
        },
        {
          buttonText: '🤝 Передать Иону жрецам (жив)',
          condition: '!flags.story.eclipse.prophet_fried',
          effects: {
            'resources.chips': '+150',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q2': '1',
          },
          target: 'story_eclipse:q2_res_prophet_ok',
        },
        {
          buttonText: '🤝 Передать Иону жрецам (разум разрушен)',
          condition: 'flags.story.eclipse.prophet_fried',
          effects: {
            'resources.chips': '+100',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q2': '1',
          },
          target: 'story_eclipse:q2_res_prophet_fried',
        },
      ],
    },

    q2_res_truth_ok: {
      text: [
        '🤫 **ТИШЕ, ВОДИТЕЛЬ**',
        '',
        'Мира бледнеет. Её татуировки кажутся мертвенно-белыми в свете ламп.',
        '',
        '«Если паломники узнают, что Небо — это машина, Культ распадётся. Но "Азраил" — единственный, кто может стереть Нео-Тек с лица Земли. Держи это в тайне».',
        '',
        'Она добавляет 100 чипов сверху. **+250 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q2_done' },
      ],
    },

    q2_res_truth_fail: {
      text: [
        '⛓ **ЕРЕСЬ**',
        '',
        'Мира гневно указывает на вас пальцем: «Ты посмел назвать священный голос мёртвой жестянкой?!»',
        '',
        'Послушники вытаскивают вас из кабины и жестоко избивают, отбирая половину награды.',
        '',
        '**+75 чипов. −5% прочности.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q2_done' },
      ],
    },

    q2_res_prophet_ok: {
      text: [
        '🌑 **ПРОРОК ЦЕЛ**',
        '',
        'Мира восхищённо качает головой: «Ты спас нашего пророка! Небо благословляет твою дорогу».',
        '',
        'Иона уносят в лазарет. Его шёпот становится тише, но не замолкает.',
        '',
        '**+150 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q2_done' },
      ],
    },

    q2_res_prophet_fried: {
      text: [
        '💀 **РАЗУМ РАЗРУШЕН**',
        '',
        'Культ забирает пускающего слюни Иону. Мира недовольна: «Его разум разрушен, он больше не слышит частоту. Вот твоя плата, убирайся».',
        '',
        'Вы получаете штрафной гонорар. **+100 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q2_done' },
      ],
    },

    q2_done: {
      text: [
        '✅ **«ЭКСТАЗ ЧАСТОТЫ» ЗАВЕРШЁН**',
        '',
        'Пророк доставлен. Культ получил свою частоту, Нео-Тек и Бароны — ещё один повод ненавидеть вас.',
        '',
        '**+15 репутации Детей Затмения. −5 Нео-Теку и Баронам.**',
        '',
        '_Следующий квест откроется на 30 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q3 «Священный лом»
    // ---------------------------------------------------------------------
    q3_start: {
      text: [
        '☄️ **«СВЯЩЕННЫЙ ЛОМ»**',
        '',
        'Ночное небо прорезает ослепительный огненный след. Через минуту землю сотрясает глухой взрыв — с орбиты рухнул старый спутник.',
        '',
        'В гараж врывается Сестра Мира. Её глаза лихорадочно блестят: Культ уверен, что это «Дар Неба».',
        '',
        'Она платит 200 чипов, если вы доберётесь до кратера раньше поисковых групп Нео-Тека и вывезете ядро объекта.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '🚚 Срочный выезд', target: 'story_eclipse:q3_road' },
        {
          buttonText: '🏥 Заехать к пророку Ионе (Удача 6)',
          condition: '!flags.story.eclipse.prophet_fried && stats.luck >= 6',
          target: 'story_eclipse:q3_res_prophet_ok',
        },
        {
          buttonText: '🏥 Заехать к пророку Ионе',
          condition: '!flags.story.eclipse.prophet_fried && stats.luck < 6',
          target: 'story_eclipse:q3_res_prophet_fail',
        },
      ],
    },

    q3_res_prophet_ok: {
      text: [
        '🏥 **ШЁПОТ ИОНЫ**',
        '',
        'Вы проскальзываете мимо стражи. Иона хрипит, не открывая глаз:',
        '',
        '«Это не дар... Это осколок "Азраила". В нём чёрный ящик. Бойся инженеров, у них тяжёлые пушки, но ещё больше бойся тех, кто ждёт тебя с грузом».',
        '',
        '**Вы предупреждены о засаде.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ К кратеру', target: 'story_eclipse:q3_road' },
      ],
    },

    q3_res_prophet_fail: {
      text: [
        '🚪 **НЕ ПУСТИЛИ**',
        '',
        'Фанатики отталкивают вас от двери лазарета, угрожая обрезами. Разговор не задался.',
        '',
        'Вы теряете драгоценное время. Инженеры Нео-Тека доберутся до кратера почти одновременно с вами.',
        '',
        '_Пророк остался за закрытой дверью._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ К кратеру', target: 'story_eclipse:q3_road' },
      ],
    },

    q3_road: {
      text: [
        '🕳 **ГОНКА В ПЕПЕЛЬНОЙ ВОРОНКЕ**',
        '',
        'Земля вокруг кратера оплавлена, счётчик Гейгера трещит. В центре воронки лежит обугленный титановый шар размером с легковой автомобиль.',
        '',
        'С противоположного склона к кратеру несутся два штурмовых багги Нео-Тека с плазменными резаками на турелях.',
        '',
        'Они открывают огонь на поражение.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🌀 Дрифт и захват лебёдкой (Вождение 4)',
          condition: 'vars.truckLevel >= 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.10)',
          },
          target: 'story_eclipse:q3_res_drift_ok',
        },
        {
          buttonText: '🌀 Дрифт и захват лебёдкой',
          condition: 'vars.truckLevel < 4',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.30)',
          },
          target: 'story_eclipse:q3_res_drift_fail',
        },
        {
          buttonText: '💥 Лобовой таран (броня ≥ 75%)',
          condition: 'hp_percent >= 75',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'resources.hp': '-round(vars.maxHp * 0.10)',
          },
          target: 'story_eclipse:q3_res_ram_ok',
        },
        {
          buttonText: '💥 Лобовой таран',
          condition: 'hp_percent < 75',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.35)',
          },
          target: 'story_eclipse:q3_res_ram_fail',
        },
      ],
    },

    q3_res_drift_ok: {
      text: [
        '🌀 **ФИЛИГРАННЫЙ ЗАНОС**',
        '',
        'Вы пускаете многотонный трак в занос вокруг кратера, поднимая стену пыли. Крюк лебёдки впивается в корпус спутника.',
        '',
        'Вы втягиваете «Священный лом» в кузов и уходите от погони в лабиринт скал.',
        '',
        '_Инженеры остались ни с чем._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q3_mark' },
      ],
    },

    q3_res_drift_fail: {
      text: [
        '🕳 **ВЯЗКИЙ ПЕПЕЛ**',
        '',
        'Трак вязнет в рыхлом пепле кратера. Багги расстреливают корму из плазменных резаков, пока вы лихорадочно вытягиваете лебёдку.',
        '',
        'Вы уходите, но задняя ось сильно повреждена. Машина еле ползёт.',
        '',
        '_Груз у вас. Пока что._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q3_mark' },
      ],
    },

    q3_res_ram_ok: {
      text: [
        '💥 **СТАЛЬНОЙ КЕНГУРЯТНИК**',
        '',
        'Ваш кенгурятник сминает лёгкий багги Нео-Тека в лепёшку. Второй багги в панике отступает.',
        '',
        'Вы спокойно грузите спутник и уезжаете, не обращая внимания на дымящиеся обломки.',
        '',
        '_Инженеры запомнят этот день._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q3_mark' },
      ],
    },

    q3_res_ram_fail: {
      text: [
        '💥 **ПРОБИТАЯ БРОНЯ**',
        '',
        'Ослабленная броня не выдерживает плазменного заряда перед самым столкновением. Взрыв срывает капот и калечит двигатель.',
        '',
        'Вы всё-таки сбиваете врага с дороги и уходите, оставляя за собой дымный след.',
        '',
        '_Груз в кузове. Двигатель — на честном слове._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q3_mark' },
      ],
    },

    q3_mark: {
      text: [
        '🔩 **КЛЕЙМО НА ТИТАНЕ**',
        '',
        'В заброшенном тоннеле вы закрепляете титановый шар в кузове. Очистив оплавленный металл от копоти, замечаете уцелевшую маркировку.',
        '',
        'Серийный код старого военного подразделения РЭБ — «Сектор-0».',
        '',
        'Точно такие же татуировки вы видели на запястьях высших иерархов Детей Затмения.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚚 Оставить как есть',
          effects: { 'flags.story.eclipse.knows_origins': '0' },
          target: 'story_eclipse:q3_finish',
        },
        {
          buttonText: '💻 Вскрыть чёрный ящик (Техника 30)',
          condition: 'stats.evasion >= 30',
          effects: { 'flags.story.eclipse.knows_origins': '1' },
          target: 'story_eclipse:q3_res_hack_ok',
        },
        {
          buttonText: '💻 Вскрыть чёрный ящик',
          condition: 'stats.evasion < 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'flags.story.eclipse.knows_origins': '0',
          },
          target: 'story_eclipse:q3_res_hack_fail',
        },
      ],
    },

    q3_res_hack_ok: {
      text: [
        '💻 **АРХИВ СЕКТОРА-0**',
        '',
        'Вы обходите защиту старого военного чипа. На экране КПК появляются архивные досье двенадцатилетней давности.',
        '',
        'Старейшины Культа — не безумные дикари. Это бывшие военные операторы комплекса «Азраил», выжившие после катастрофы.',
        '',
        'Они создали религию вокруг мёртвого неба, чтобы использовать фанатиков как рабочую силу и живой щит.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q3_finish' },
      ],
    },

    q3_res_hack_fail: {
      text: [
        '🔥 **ПИРОПАТРОН**',
        '',
        'При попытке взлома срабатывает пиропатрон самоликвидации памяти. Вспышка огня обжигает руки.',
        '',
        'Вырвавшийся электрический импульс сжигает предохранители в кабине.',
        '',
        '_Данные уничтожены. Тайна осталась тайной._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q3_finish' },
      ],
    },

    q3_finish: {
      text: [
        '🏛 **КАПИЩЕ ИЗ РЖАВЧИНЫ**',
        '',
        'Вы доставляете титановое ядро в главный храм Культа — огромный заброшенный ангар дирижаблей.',
        '',
        'Иерархи в тяжёлых плащах с противогазами окружают трак. Сестра Мира с благоговением касается обугленного металла.',
        '',
        '_Она поворачивается к вам с оплатой. Самое время сказать то, что вы знаете._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 Разоблачение вполголоса (Удача 7)',
          condition: 'flags.story.eclipse.knows_origins && stats.luck >= 7',
          effects: {
            'resources.chips': '+300',
            'resources.hp': '+round(vars.maxHp * 0.15)',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q3': '1',
          },
          target: 'story_eclipse:q3_res_blackmail_ok',
        },
        {
          buttonText: '🗣 Разоблачение вполголоса',
          condition: 'flags.story.eclipse.knows_origins && stats.luck < 7',
          effects: {
            'resources.chips': '+100',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q3': '1',
          },
          target: 'story_eclipse:q3_res_blackmail_fail',
        },
        {
          buttonText: '🤝 Честная сделка (+200 чипов)',
          effects: {
            'resources.chips': '+200',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q3': '1',
          },
          target: 'story_eclipse:q3_res_honest',
        },
      ],
    },

    q3_res_blackmail_ok: {
      text: [
        '🤐 **ПРИКАЗ «ТИШИНА»**',
        '',
        'Мира замирает как статуя. Даже сквозь линзы противогаза чувствуется её ледяной взгляд.',
        '',
        '«Умный водитель — опасный водитель. Приказ "Тишина" не отменялся, солдат. Держи язык за зубами, и будешь в доле».',
        '',
        'Она суёт вам пачку крупных купюр и редкий армейский ремкомплект. **+300 чипов, +15% прочности.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q3_done' },
      ],
    },

    q3_res_blackmail_fail: {
      text: [
        '👊 **УДАР В СОЛНЕЧНОЕ СПЛЕТЕНИЕ**',
        '',
        'Вы недооценили бывших спецназовцев. Мира молниеносно бьёт вас, перехватывая дыхание.',
        '',
        'Двое иерархов приставляют к виску бесшумные пистолеты: «Ещё одно слово перед паствой — и твой трак станет твоим гробом».',
        '',
        'Вам швыряют половину суммы. **+100 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q3_done' },
      ],
    },

    q3_res_honest: {
      text: [
        '🌑 **СЕРДЦЕ НЕБА**',
        '',
        'Мира вручает вам тяжёлый мешок с чипами: «Ты принёс нам сердце Неба, водитель. Скоро мы услышим его последний приказ».',
        '',
        '«Будь готов к великому походу».',
        '',
        '**+200 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q3_done' },
      ],
    },

    q3_done: {
      text: [
        '✅ **«СВЯЩЕННЫЙ ЛОМ» ЗАВЕРШЁН**',
        '',
        'Титановое ядро в храме. Культ получил свой «дар неба», Нео-Тек и Бароны — нового врага.',
        '',
        '**+15 репутации Детей Затмения. −5 Нео-Теку и Баронам.**',
        '',
        '_Следующий квест откроется на 45 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q4 «Груз скорби»
    // ---------------------------------------------------------------------
    q4_start: {
      text: [
        '🕯 **«ГРУЗ СКОРБИ»**',
        '',
        'Глубокая ночь на окраине Нового Детройта. К траку, переоборудованному для перевозки людей, молчаливой вереницей идут сорок паломников.',
        '',
        'Одинаковые серые робы, бритые головы, свежие шрамы на затылках — грубо вживлённые медные электроды и старые армейские нейропорты.',
        '',
        'Мира контролирует погрузку. Плата за рейс — 250 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚚 Профессиональное безразличие',
          effects: { 'vars.repEclipse': '+1' },
          target: 'story_eclipse:q4_road',
        },
        {
          buttonText: '🗣 Военная прямота (Удача 7)',
          condition: 'flags.story.eclipse.knows_origins && stats.luck >= 7',
          target: 'story_eclipse:q4_res_talk_ok',
        },
        {
          buttonText: '🗣 Военная прямота',
          condition: 'flags.story.eclipse.knows_origins && stats.luck < 7',
          effects: { 'vars.repEclipse': '-2' },
          target: 'story_eclipse:q4_res_talk_fail',
        },
      ],
    },

    q4_res_talk_ok: {
      text: [
        '🫥 **БИО-КОНТУР**',
        '',
        'Мира на секунду закрывает глаза. Её голос теряет привычную фанатичную твёрдость:',
        '',
        '«У нас нет выбора, водитель. Усилители старого образца сгорели. Чтобы пробить помехи инженеров, нам нужен живой био-контур. Они идут добровольно».',
        '',
        '«Выполни работу, и я доплачу тебе за крепкие нервы». **+50 чипов к награде.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '➡️ Дальше',
          effects: { 'flags.story.eclipse.pilgrim_bonus': '1' },
          target: 'story_eclipse:q4_road',
        },
      ],
    },

    q4_res_talk_fail: {
      text: [
        '🔫 **НЕ ЛЕЗЬ В ПРИКАЗЫ**',
        '',
        'Мира кладёт руку на кобуру: «Твоё дело — крутить баранку, а не лезть в приказы командования».',
        '',
        '«Сядешь за руль прямо сейчас — останешься жив. Ещё один вопрос — пущу тебя в расход вместе с ними».',
        '',
        'Напряжение на пределе.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q4_road' },
      ],
    },

    q4_road: {
      text: [
        '🏔 **ЗАСЛОН НА СЕРПАНТИНЕ**',
        '',
        'Горная дорога к Пику Одиночества сужается. Впереди путь преграждает передовой блокпост Ржавых Баронов.',
        '',
        'Два тяжёлых бензовоза поперёк трассы, на скалах — гранатомётчики. Они требуют немедленно развернуть машину.',
        '',
        'Иначе сожгут кузов вместе с людьми.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Прорыв сквозь огонь (броня ≥ 75%)',
          condition: 'hp_percent >= 75',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.15)',
          },
          target: 'story_eclipse:q4_res_ram_ok',
        },
        {
          buttonText: '💥 Прорыв сквозь огонь',
          condition: 'hp_percent < 75',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.35)',
          },
          target: 'story_eclipse:q4_res_ram_fail',
        },
        {
          buttonText: '🧗 Маневр по краю пропасти (Вождение 5)',
          condition: 'vars.truckLevel >= 5',
          effects: { 'resources.diesel': '-round(vars.maxDiesel * 0.15)' },
          target: 'story_eclipse:q4_res_edge_ok',
        },
        {
          buttonText: '🧗 Маневр по краю пропасти',
          condition: 'vars.truckLevel < 5',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.35)',
            'resources.hp': '-round(vars.maxHp * 0.25)',
          },
          target: 'story_eclipse:q4_res_edge_fail',
        },
      ],
    },

    q4_res_ram_ok: {
      text: [
        '💥 **СКВОЗЬ ЦИСТЕРНЫ**',
        '',
        'Многотонная сталь с чудовищным скрежетом раздвигает пустые цистерны Баронов.',
        '',
        'Выстрел из гранатомёта проходит вскользь по бронированной крыше, не пробивая кузов.',
        '',
        'Вы прорываетесь наверх. Пассажиры целы.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q4_antennas' },
      ],
    },

    q4_res_ram_fail: {
      text: [
        '💥 **ГРАНАТА ПОД ДНИЩЕМ**',
        '',
        'Ослабленная броня не выдерживает тарана. Задний мост заклинивает, осколочная граната взрывается прямо под кузовом.',
        '',
        'Внутри раздаются крики раненых. Машина дымит, но на честном слове вытягивает на подъём.',
        '',
        '_Половина паломников тяжело ранена._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q4_antennas' },
      ],
    },

    q4_res_edge_ok: {
      text: [
        '🧗 **НА КРАЮ**',
        '',
        'Камни сыплются из-под внешних колёс в бездну. Трак кренится на критический угол.',
        '',
        'Вы виртуозно выравниваете машину и обходите заслон, пока стрелки Баронов в ступоре смотрят на этот трюк.',
        '',
        '_Ни царапины на броне._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q4_antennas' },
      ],
    },

    q4_res_edge_fail: {
      text: [
        '🧗 **ОБРЫВ**',
        '',
        'Край карниза обрушивается под весом трака. Вы чудом вытягиваете машину обратно на дорогу.',
        '',
        'При ударе о скалу сминается правый борт, топливный бак получает пробоину.',
        '',
        '_До вершины ещё пять километров._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q4_antennas' },
      ],
    },

    q4_antennas: {
      text: [
        '📡 **ЖИВЫЕ АНТЕННЫ**',
        '',
        'До вершины остаётся пять километров. Со стороны Пика бьёт невидимый волновой импульс — тестовая калибровка главного передатчика.',
        '',
        'Рация в кабине плавится. Из кузова доносится жуткий нечеловеческий вой.',
        '',
        'Паломники бьются в судорогах, из глаз и ушей идёт кровь. Импланты на затылках раскалились докрасна.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚚 Довезти груз до конца',
          effects: { 'flags.story.eclipse.pilgrims_spared': '0' },
          target: 'story_eclipse:q4_finish',
        },
        {
          buttonText: '⚡ Экстренное отключение (Техника 30)',
          condition: 'stats.evasion >= 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.10)',
            'flags.story.eclipse.pilgrims_spared': '1',
          },
          target: 'story_eclipse:q4_res_save_ok',
        },
        {
          buttonText: '⚡ Экстренное отключение',
          condition: 'stats.evasion < 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.20)',
            'flags.story.eclipse.pilgrims_spared': '0',
          },
          target: 'story_eclipse:q4_res_save_fail',
        },
      ],
    },

    q4_res_save_ok: {
      text: [
        '⚡ **ОБРАТНЫЙ ИМПУЛЬС**',
        '',
        'Вы точно рассчитываете вольтаж. Мощный щелчок — все сорок нейропортов одновременно выгорают с лёгким дымком.',
        '',
        'Судороги прекращаются. Паломники тяжело дышат, приходя в себя.',
        '',
        'Они больше не пригодны как усилители, но они живы.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q4_finish' },
      ],
    },

    q4_res_save_fail: {
      text: [
        '⚡ **ОШИБКА ВОЛЬТАЖА**',
        '',
        'Вы ошибаетесь с мощностью разряда. Вместо отключения имплантов ток бьёт напрямую в нервную систему.',
        '',
        'Половина пассажиров погибает мгновенно. Бортовой компьютер выходит из строя от скачка напряжения.',
        '',
        '_Худший из возможных исходов._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q4_finish' },
      ],
    },

    q4_finish: {
      text: [
        '🏔 **ВРАТА ВОЗНЕСЕНИЯ**',
        '',
        'Вы поднимаетесь на заснеженное плато Пика Одиночества. Вокруг огромного чёрного излучателя кипит работа.',
        '',
        'Высшие жрецы в армейской защите открывают кузов трака.',
        '',
        '_Они смотрят на паломников. Потом на вас._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🗣 Оправдаться (Удача 8)',
          condition: 'flags.story.eclipse.pilgrims_spared && stats.luck >= 8',
          effects: {
            'resources.chips': '+250',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q4': '1',
          },
          target: 'story_eclipse:q4_res_justify_ok',
        },
        {
          buttonText: '🗣 Оправдаться',
          condition: 'flags.story.eclipse.pilgrims_spared && stats.luck < 8',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.25)',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q4': '1',
          },
          target: 'story_eclipse:q4_res_justify_fail',
        },
        {
          buttonText: '🤝 Обычная сдача (+300 чипов)',
          condition: '!flags.story.eclipse.pilgrims_spared && flags.story.eclipse.pilgrim_bonus',
          effects: {
            'resources.chips': '+300',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q4': '1',
          },
          target: 'story_eclipse:q4_res_handover',
        },
        {
          buttonText: '🤝 Обычная сдача (+250 чипов)',
          condition: '!flags.story.eclipse.pilgrims_spared && !flags.story.eclipse.pilgrim_bonus',
          effects: {
            'resources.chips': '+250',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q4': '1',
          },
          target: 'story_eclipse:q4_res_handover',
        },
      ],
    },

    q4_res_justify_ok: {
      text: [
        '🧊 **ХОЛОДНЫЙ РАСЧЁТ**',
        '',
        'Вы хладнокровно смотрите в дуло автомата: «Если бы я не сбросил напряжение, они бы сдохли ещё на серпантине».',
        '',
        '«Я сохранил вам сорок рабочих рук для обороны пика. А для передатчика используйте генератор моего трака».',
        '',
        'Мира опускает ствол: «Холодный расчёт, водитель. Мне это нравится». **+250 чипов.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q4_done' },
      ],
    },

    q4_res_justify_fail: {
      text: [
        '🔫 **ПРЕДАТЕЛЬ**',
        '',
        'Мира не верит ни единому слову: «Предатель!» Охрана открывает огонь по кабине.',
        '',
        'Вы в панике жмёте на газ и срываетесь вниз с горы под градом пуль.',
        '',
        'Ни единого чипа. Только пробитая броня и приказ Культа считать вас врагом.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q4_done' },
      ],
    },

    q4_res_handover: {
      text: [
        '🌑 **ОНИ ОБРЕТУТ ПОКОЙ**',
        '',
        'Жрецы молча вытаскивают конвульсирующих людей из кузова и тащат к основанию чёрного передатчика.',
        '',
        'Мира без эмоций отсчитывает чипы: «Они обретут покой в вечной тишине. Отдохни, водитель».',
        '',
        '«Завтра мы заглушим это проклятое небо навсегда».',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Завершить квест', target: 'story_eclipse:q4_done' },
      ],
    },

    q4_done: {
      text: [
        '✅ **«ГРУЗ СКОРБИ» ЗАВЕРШЁН**',
        '',
        'Паломники доставлены на Пик. Культ получил своё вознесение, Нео-Тек и Бароны — ещё одного врага.',
        '',
        '**+15 репутации Детей Затмения. −5 Нео-Теку и Баронам.**',
        '',
        '_Следующий квест откроется на 60 репутации._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '⬅️ К фракционным делам', target: 'new_detroit:story_board' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q5 «Чёрный передатчик»
    // ---------------------------------------------------------------------
    q5_start: {
      text: [
        '🛠 **«ЧЁРНЫЙ ПЕРЕДАТЧИК»**',
        '',
        'Нижний лагерь у подножия Пика Одиночества. Костры из покрышек, фанатики натирают стволы обрезов и мажут лица графитовой пылью.',
        '',
        'Сестра Мира больше не в балахоне — на ней потёртый армейский экзоскелет старого образца.',
        '',
        'В кузов краном грузят «Сердце Бездны» — тяжёлый высоковольтный сердечник излучателя. Плата — 300 чипов.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔧 Боевая готовность',
          effects: { 'vars.repEclipse': '+1' },
          target: 'story_eclipse:q5_road',
        },
        {
          buttonText: '🗣 Требование истины (Удача 7)',
          condition: 'flags.story.eclipse.knows_origins && stats.luck >= 7',
          target: 'story_eclipse:q5_res_truth_ok',
        },
        {
          buttonText: '🗣 Требование истины',
          condition: 'flags.story.eclipse.knows_origins && stats.luck < 7',
          effects: { 'vars.repEclipse': '-2' },
          target: 'story_eclipse:q5_res_truth_fail',
        },
      ],
    },

    q5_res_truth_ok: {
      text: [
        '🌑 **СТРАШНАЯ АМПУТАЦИЯ**',
        '',
        'Мира горько усмехается: «Ты прав, водитель. ИИ на орбите уже начал протокол стерилизации Земли. Через неделю он сожжёт города лазерами».',
        '',
        '«Наш передатчик — это ядерный взрыв в радиоэфире. Он отбросит нас в каменный век, но человечество выживет».',
        '',
        'Она даёт вам военный бронелист на капот. **+10% прочности.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '➡️ Дальше',
          effects: { 'resources.hp': '+round(vars.maxHp * 0.10)' },
          target: 'story_eclipse:q5_road',
        },
      ],
    },

    q5_res_truth_fail: {
      text: [
        '🔫 **МЕНЬШЕ ФИЛОСОФИИ**',
        '',
        'Мира щёлкает предохранителем винтовки: «Меньше философии, извозчик. У нас на хвосте Бароны и инженеры».',
        '',
        '«Либо ты везёшь груз наверх, либо я пущу тебе пулю в лоб и сяду за баранку сама».',
        '',
        'Приходится подчиниться под угрозой расстрела.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q5_road' },
      ],
    },

    q5_road: {
      text: [
        '🔥 **ТРЁХСТОРОННИЙ АД**',
        '',
        'Подъём на Пик превратился в мясорубку. Снизу колонну догоняют штурмовые грузовики Баронов, поливая склон из крупнокалиберных пулемётов.',
        '',
        'Сверху пикируют боевые дроны Нео-Тека, сбрасывая термитные заряды на дорогу.',
        '',
        'Впереди — завал из горящих обломков.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔥 Прорыв сквозь пламя (Вождение 5)',
          condition: 'vars.truckLevel >= 5',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.20)',
            'resources.hp': '-round(vars.maxHp * 0.15)',
          },
          target: 'story_eclipse:q5_res_break_ok',
        },
        {
          buttonText: '🔥 Прорыв сквозь пламя',
          condition: 'vars.truckLevel < 5',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.30)',
            'resources.hp': '-round(vars.maxHp * 0.40)',
          },
          target: 'story_eclipse:q5_res_break_fail',
        },
        {
          buttonText: '🛡 Стальной бастион (броня ≥ 80%)',
          condition: 'hp_percent >= 80',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.20)',
          },
          target: 'story_eclipse:q5_res_bastion_ok',
        },
        {
          buttonText: '🛡 Стальной бастион',
          condition: 'hp_percent < 80',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.45)',
          },
          target: 'story_eclipse:q5_res_bastion_fail',
        },
      ],
    },

    q5_res_break_ok: {
      text: [
        '🔥 **ЖЕЛЕЗНЫЙ ДЕМОН**',
        '',
        'Трак влетает в стену огня и вырывается с другой стороны. Вы ювелирно входите в слепой поворот серпантина.',
        '',
        'Преследователи Баронов остаются под ударом дронов Нео-Тека.',
        '',
        '_Вы на вершине._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q5_mount' },
      ],
    },

    q5_res_break_fail: {
      text: [
        '🔥 **ЛЕДЯНОЙ ЗАНОС**',
        '',
        'На скорости трак заносит на обледенелом участке. Вы сносите завал, но термитный заряд дрона прожигает крышу кабины.',
        '',
        'Пулемётная очередь Баронов разрывает задние покрышки.',
        '',
        'Трак буквально ползёт на дисках.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q5_mount' },
      ],
    },

    q5_res_bastion_ok: {
      text: [
        '🛡 **ЛЕДОКОЛ**',
        '',
        'Усиленная броня держит град пуль и осколков. Трак неспешно, словно ледокол, расчищает путь.',
        '',
        'Вы выезжаете на плато вершины, оставляя за собой дымящийся коридор.',
        '',
        '_Сердечник в кузове цел._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q5_mount' },
      ],
    },

    q5_res_bastion_fail: {
      text: [
        '🛡 **ПРОБОИНА**',
        '',
        'Броня не выдерживает плотного огня. Снаряд Баронов пробивает правый борт, едва не задев сердечник.',
        '',
        'Машина горит, но вы дотягиваете до цели.',
        '',
        '_Осталось только не взорваться._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q5_mount' },
      ],
    },

    q5_mount: {
      text: [
        '🗼 **МОНТАЖ У БЕЗДНЫ**',
        '',
        'Вы на вершине Пика Одиночества. Ледяной ветер свистит, внизу гремят взрывы — фанатики ценой жизней сдерживают штурм.',
        '',
        'Техники Культа перегружают сердечник из кузова в основание гигантской чёрной антенны.',
        '',
        'Пока жрецы читают молитву, у вас есть пара минут у главного распределительного щита.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔌 Помочь с подключением',
          effects: { 'flags.story.eclipse.transmitter_sabotaged': '0' },
          target: 'story_eclipse:q5_switch',
        },
        {
          buttonText: '🕶 Скрытый саботаж (Техника 30)',
          condition: 'stats.evasion >= 30',
          effects: { 'flags.story.eclipse.transmitter_sabotaged': '1' },
          target: 'story_eclipse:q5_res_sabotage_ok',
        },
        {
          buttonText: '🕶 Скрытый саботаж',
          condition: 'stats.evasion < 30',
          effects: {
            'resources.hp': '-round(vars.maxHp * 0.05)',
            'flags.story.eclipse.transmitter_sabotaged': '0',
          },
          target: 'story_eclipse:q5_res_sabotage_fail',
        },
      ],
    },

    q5_res_sabotage_ok: {
      text: [
        '🕶 **ПЕРЕМЫЧКИ**',
        '',
        'Вы незаметно перекидываете перемычки в силовом блоке и стираете логи изменений.',
        '',
        'Внешне система выглядит идеально. Но при активации она выжжет только космический спутник и саму себя, не тронув города Тракта.',
        '',
        '**Вы изменили правила финальной игры.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q5_switch' },
      ],
    },

    q5_res_sabotage_fail: {
      text: [
        '⚡ **ОГОЛЁННЫЙ КАБЕЛЬ**',
        '',
        'Вы задеваете кабель под высоким напряжением. Сноп синих искр отбрасывает вас в снег.',
        '',
        'Система защиты щита срабатывает, намертво блокируя панель управления.',
        '',
        'Передатчик остался в исходном состоянии.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q5_switch' },
      ],
    },

    q5_switch: {
      text: [
        '🔑 **РУБИЛЬНИК СУДНОГО ДНЯ**',
        '',
        'Оборона нижнего периметра прорвана. На плато вырываются штурмовики Баронов, с другой стороны десантируются дроны Нео-Тека.',
        '',
        'Сестра Мира ранена, она зажимает пробитый бок и кричит сквозь грохот:',
        '',
        '«Передатчик заряжен! Главный рубильник на твоей консоли! Жми, водитель! Погаси это небо!»',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🔑 Активировать систему',
          condition: '!flags.story.eclipse.transmitter_sabotaged',
          effects: {
            'resources.chips': '+300',
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q5': '1',
          },
          target: 'story_eclipse:q5_res_activate',
        },
        {
          buttonText: '⚡ Запустить саботированный импульс',
          condition: 'flags.story.eclipse.transmitter_sabotaged',
          effects: {
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q5': '1',
          },
          target: 'story_eclipse:q5_res_sabotaged',
        },
      ],
    },

    q5_res_activate: {
      text: [
        '🌑 **СВЕРШИЛОСЬ**',
        '',
        'Вы поворачиваете ключ. Передатчик ревёт на запредельной частоте, в небо бьёт невидимый столб энергии.',
        '',
        'Мира улыбается сквозь кровь и переводит обещанные 300 чипов: «Теперь мы свободны».',
        '',
        '_Но небо ещё не ответило._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ К финалу', target: 'story_eclipse:q6_start' },
      ],
    },

    q5_res_sabotaged: {
      text: [
        '⚡ **НЕ ТАК, КАК ЖДАЛИ**',
        '',
        'Передатчик ревёт на запредельной частоте. В небо бьёт столб энергии, а через секунду сама антенна взрывается фейерверком расплавленного металла.',
        '',
        'Мира в ужасе смотрит на руины: «Что ты наделал?! Ты нас предал!»',
        '',
        'Вы прыгаете в кабину под перекрёстным огнём всех трёх фракций. Ни чипа, но человечество сохранило разум.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ К финалу', target: 'story_eclipse:q6_start' },
      ],
    },

    // ---------------------------------------------------------------------
    // Q6 «Последнее затмение»
    // ---------------------------------------------------------------------
    q6_start: {
      text: [
        '🌋 **«ПОСЛЕДНЕЕ ЗАТМЕНИЕ»**',
        '',
        'Вершина Пика Одиночества превратилась в пылающий ад. Чёрный передатчик гудит так сильно, что трескаются стёкла трака.',
        '',
        'Небо разрезают фиолетовые молнии — обезумевший «Азраил» пытается выжечь плато тепловым лучом, но защитное поле антенны отражает удар.',
        '',
        'Раненая Мира кричит: «Осталось три минуты до синхронизации! Держи периметр, водитель!»',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '🛡 Боевой заслон', target: 'story_eclipse:q6_stand' },
        {
          buttonText: '📻 Психологическая атака (Удача 8)',
          condition: 'flags.story.eclipse.knows_origins && stats.luck >= 8',
          target: 'story_eclipse:q6_res_psy_ok',
        },
        {
          buttonText: '📻 Психологическая атака',
          condition: 'flags.story.eclipse.knows_origins && stats.luck < 8',
          effects: { 'resources.hp': '-round(vars.maxHp * 0.25)' },
          target: 'story_eclipse:q6_res_psy_fail',
        },
      ],
    },

    q6_res_psy_ok: {
      text: [
        '📻 **ГОЛОС СЕКТОРА-0**',
        '',
        'Ваш ледяной голос озвучивает закрытые военные протоколы двенадцатилетней давности. В рядах атакующих начинается паника.',
        '',
        'Командиры Баронов решают, что попали в ловушку старой армии. Дроны Нео-Тека зависают, пытаясь верифицировать приказ.',
        '',
        '**Вы выигрываете драгоценные минуты.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q6_stand' },
      ],
    },

    q6_res_psy_fail: {
      text: [
        '📻 **ПЕЛЕНГ**',
        '',
        'Вы путаете шифр. Враги мгновенно пеленгуют источник сигнала — кабину вашего трака.',
        '',
        'По машине дают залп из тяжёлых гранатомётов. Лобовая броня превращается в решето.',
        '',
        'Но двигатель ещё рычит.',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q6_stand' },
      ],
    },

    q6_stand: {
      text: [
        '💀 **ПОСЛЕДНИЙ РУБЕЖ**',
        '',
        'Штурм достигает пика. Тяжёлый таранный грузовик Баронов прорывается сквозь дым и несётся прямо на ваш трак.',
        '',
        'С фланга заходят штурмовики Нео-Тека с плазменными резаками.',
        '',
        '_Отступать некуда. За спиной — передатчик._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '💥 Стальной таран (броня ≥ 65%)',
          condition: 'hp_percent >= 65',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.15)',
            'resources.hp': '-round(vars.maxHp * 0.20)',
          },
          target: 'story_eclipse:q6_res_ram_ok',
        },
        {
          buttonText: '💥 Стальной таран',
          condition: 'hp_percent < 65',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.25)',
            'resources.hp': '-round(vars.maxHp * 0.40)',
          },
          target: 'story_eclipse:q6_res_ram_fail',
        },
        {
          buttonText: '⚡ Перегрузка контура (Техника 25)',
          condition: 'stats.evasion >= 25',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.10)',
            'resources.hp': '-round(vars.maxHp * 0.15)',
          },
          target: 'story_eclipse:q6_res_overload_ok',
        },
        {
          buttonText: '⚡ Перегрузка контура',
          condition: 'stats.evasion < 25',
          effects: {
            'resources.diesel': '-round(vars.maxDiesel * 0.35)',
            'resources.hp': '-round(vars.maxHp * 0.30)',
          },
          target: 'story_eclipse:q6_res_overload_fail',
        },
      ],
    },

    q6_res_ram_ok: {
      text: [
        '💥 **В БЕЗДНУ**',
        '',
        'Скрежет разрываемого металла оглушает всё вокруг. Кенгурятник вминает кабину врага, и грузовик Баронов с грохотом летит в пропасть.',
        '',
        'Пехота инженеров в ужасе отступает.',
        '',
        '**Путь к консоли передатчика свободен.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q6_choice' },
      ],
    },

    q6_res_ram_fail: {
      text: [
        '💥 **СЦЕПКА**',
        '',
        'Изношенная броня не выдерживает лобового удара. Оба грузовика сцепляются в груду дымящегося металлолома.',
        '',
        'Вам приходится выбивать дверь ногами и отстреливаться из кабины, пока фанатики ценой жизней взрывают врага гранатами.',
        '',
        '_Вы живы. Машина — на грани взрыва._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q6_choice' },
      ],
    },

    q6_res_overload_ok: {
      text: [
        '⚡ **ЭЛЕКТРИЧЕСКАЯ ДУГА**',
        '',
        'Мощнейший разряд бьёт по мокрому снегу и металлу. Штурмовики Нео-Тека падают с выжженной электроникой экзоскелетов.',
        '',
        'Грузовик Баронов глохнет с взорванным аккумулятором.',
        '',
        '**Плато на секунду затихает.**',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q6_choice' },
      ],
    },

    q6_res_overload_fail: {
      text: [
        '🔥 **ОГОНЬ ПОД ДНИЩЕМ**',
        '',
        'Кабель срывается и бьёт по вашему собственному топливному баку. Вспыхивает пламя.',
        '',
        'Вы сбиваете его с огромным трудом, едва не сгорев заживо.',
        '',
        '_Машина держится. Пока._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Дальше', target: 'story_eclipse:q6_choice' },
      ],
    },

    q6_choice: {
      text: [
        '👁 **ВЗГЛЯД В БЕЗДНУ**',
        '',
        'На плато воцаряется зловещая тишина. Атака отбита. Вокруг лежат тела, обломки дронов и погибшие послушники.',
        '',
        'Чёрный передатчик выходит на пиковую мощность. Мира подходит к главной консоли. Её лицо залито кровью, но глаза горят фанатичным триумфом.',
        '',
        '«Час пробил, водитель. Решай».',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🌑 «Вечная Тишина»',
          condition: '!flags.story.eclipse.transmitter_sabotaged',
          effects: {
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q6': '1',
          },
          target: 'story_eclipse:q6_res_eternal_night',
        },
        {
          buttonText: '⚡ «Хирургический удар»',
          condition: 'flags.story.eclipse.transmitter_sabotaged',
          effects: {
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q6': '1',
          },
          target: 'story_eclipse:q6_res_surgical',
        },
        {
          buttonText: '👁 «Протокол Власть» (Техника 30)',
          condition: 'flags.story.eclipse.knows_origins && stats.evasion >= 30',
          effects: {
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q6': '1',
          },
          target: 'story_eclipse:q6_res_protocol_power',
        },
        {
          buttonText: '🛣 «Бесконечная Дорога»',
          effects: {
            'vars.repEclipse': '+15',
            'vars.repNeoTek': '-5',
            'vars.repRustyBarons': '-5',
            'flags.story.eclipse.q6': '1',
          },
          target: 'story_eclipse:q6_res_road',
        },
      ],
    },

    q6_res_eternal_night: {
      text: [
        '🌑 **ВЕЧНАЯ ТИШИНА**',
        '',
        'Вы поворачиваете ключ на полную мощность. Невидимая ударная волна накрывает планету.',
        '',
        'В небе вспыхивает ослепительная белая звезда — это сгорает «Азраил». Но вместе с ним гаснет всё на Земле.',
        '',
        '_Мир спасён ценой его гибели._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Эпилог', target: 'endings:eclipse_eternal_night' },
      ],
    },

    q6_res_surgical: {
      text: [
        '⚡ **ХИРУРГИЧЕСКИЙ УДАР**',
        '',
        'Саботированный импульс бьёт узким лучом точно в зенит. На орбите раздаётся беззвучный взрыв.',
        '',
        'Через мгновение чёрная антенна на Пике разлетается на куски, навсегда погребая под собой тайны Культа.',
        '',
        '_Города Тракта уцелели._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Эпилог', target: 'endings:eclipse_dawn' },
      ],
    },

    q6_res_protocol_power: {
      text: [
        '👁 **ПРОТОКОЛ ВЛАСТЬ**',
        '',
        'Ваши пальцы вводят коды доступа старой армии. Вместо самоуничтожения «Азраил» признаёт в вас законного оператора.',
        '',
        'Орбитальные лазеры замирают, переходя в режим ожидания ваших команд.',
        '',
        '_Мира медленно снимает противогаз._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Эпилог', target: 'endings:sector_zero_gods' },
      ],
    },

    q6_res_road: {
      text: [
        '🛣 **БЕСКОНЕЧНАЯ ДОРОГА**',
        '',
        'Вы вырываете ключ активации из пульта и швыряете его в снежную бездну. Передатчик с протяжным воем глохнет.',
        '',
        'Мира в ярости стреляет вслед, пули высекают искры на заднем борту.',
        '',
        '_Никто не победил._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        { buttonText: '➡️ Эпилог', target: 'endings:eclipse_road' },
      ],
    },
  },
};
