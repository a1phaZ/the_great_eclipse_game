export const bunkerQuestData = {
    "locationId": "event_bunker",
    "name": "Сюжетный квест: Бункер-09",
    "scenes": {
        "stage_1": {
            "text": "🗄 **БУНКЕР-09: ЭТАП 1 [ГЕРМОЗАТВОР]**\n\nВы заезжаете в ржавую бетонную воронку. Внизу чернеет массивный круглый шлюз Бункера-09. Питания нет. На панели замка тускло мигает аварийный диод.\n\nРядом со шлюзом торчит ручной привод вентиля с прикипевшей цепью, а чуть выше висит вскрытый щиток подачи энергии.\n\n📋 **Ваше состояние:**\n• 🚜 Прочность трака: `{truck.hp}/{truck.max_hp} HP`",
            "imageUrl": "https://unsplash.com",
            "transitions": [
                {
                    "buttonText": "🥊 Сорвать прикипевший вентиль силой (Шумно!)",
                    "effects": { "quest.noise": "1" }, // Включаем флаг шума в память сессии
                    "nextState": "IN_LOCATION_SCENE",
                    "target": "event_bunker:stage_2"
                },
                {
                    "buttonText": "🔧 Запитать щиток от аккумулятора трака (Долго)",
                    "effects": { "quest.battery_dead": "1" }, // Включаем флаг разряда
                    "nextState": "IN_LOCATION_SCENE",
                    "target": "event_bunker:stage_2"
                }
            ]
        },
        "stage_2": {
            "text": "🛢 **БУНКЕР-09: ЭТАП 2 [МАШИННЫЙ ЗАЛ]**\n\nШлюз поддается. Фонари выхватывают из темноты гигантские генераторы, по колено ушедшие в черную маслянистую жижу. Воздух пропитан парами токсичного мазута.\n\nВам нужно пройти к серверной на другой стороне зала, но из жижи доносится странное шуршание.\n\n📋 **Статус разведки:**\n• Флаг шума: `{quest.noise}`\n• Флаг разряда батареи: `{quest.battery_dead}`",
            "imageUrl": "https://unsplash.com",
            "transitions": [
                {
                    "buttonText": "🏃‍♂️ Быстро пробежать вброд через мазут",
                    "nextState": "IN_LOCATION_SCENE",
                    "target": "event_bunker:stage_3_check" // Переход на промежуточную проверку шума
                },
                {
                    "buttonText": "🔧 Попытаться удаленно запустить помпу откачки",
                    "nextState": "IN_LOCATION_SCENE",
                    "target": "event_bunker:stage_3_clean"
                }
            ]
        },
        "stage_3_check": {
            "text": "🕷 **ОХОТНИКИ ИЗ МАЗУТА**\n\nВы бросаетесь вперед. \n\nЕсли на первом этапе вы **сильно шумели**, местная фауна солончаков была готова к встрече. Кислотные слизни Пустоши устраивают засаду и бьют едкой жижей прямо по топливным шлангам трака!\n\n⚠️ **Внимание:** если флаг шума равен 1, вы получите **-60 HP** [1.1].",
            "imageUrl": "https://unsplash.com",
            "transitions": [
                {
                    "buttonText": "🚪 Прорваться в двери серверной отсека",
                    "nextState": "IN_LOCATION_SCENE",
                    // Динамический эффект: спишет 60 HP, только если в памяти bunker_noise == 1
                    "effects": { "truck.hp": "-{quest.noise} * 5 * {truck.level}" },
                    "target": "event_bunker:stage_4_server"
                }
            ]
        },
        "stage_3_clean": {
            "text": "⚡ **ЧИСТЫЙ ПРОХОД**\n\nВам удается закоротить реле. Помпа с диким скрежетом оживает и за две минуты выкачивает токсичную жижу в резервный бак. \n\nВы спокойно проходите по сухому бетону вглубь командного пункта Бункера-09.",
            "imageUrl": "https://unsplash.com",
            "transitions": [
                {
                    "buttonText": "🚪 Войти в серверный отсек",
                    "nextState": "IN_LOCATION_SCENE",
                    "target": "event_bunker:stage_4_server"
                }
            ]
        },
        "stage_4_server": {
            "text": "💾 **БУНКЕР-09: ЭТАП 4 [СЕРВЕРНАЯ «АЭЛИТЫ»]**\n\nПеред вами уцелевший ЭЛТ-терминал. Внутри свинцового кейса лежит заветная магнитная кассета.\n\n⚠️ Потолочные турели начинают прогревать лазеры. Пора хватать бобину и уносить колеса!",
            "imageUrl": "https://unsplash.com",
            "transitions": [
                {
                    "buttonText": "💾 Вырвать кассету и рвануть к выходу!",
                    "effects": {
                        "user.chips": "+400",
                        // Сама сцена задает формулу: штраф = флаг_разряда * 5 * уровень_трака!
                        "user.diesel": "-{quest.battery_dead} * 5 * {truck.level}",
                        "quest.CLEAR": "1"
                    },
                    "nextState": "IN_LOCATION_SCENE",
                    "target": "event_bunker:stage_final"
                }
            ]
        },
        "stage_final": {
            "text": "🏆 **КОНТРАКТ ВЫПОЛНЕН**\n\nВы вылетаете из воронки Бункера-09 на поверхность!\n\n💰 **Итоги рейда:**\n• Награда Нео-Тек: **+400 Чипов 💾**\n• Потеряно топлива на заводку посаженного АКБ: **[[{quest.battery_dead} * 5 * {truck.level}]] л. ⛽**\n• Текущий запас топлива: `{user.diesel}/{user.max_diesel} л.`",
            "imageUrl": "https://unsplash.com",
            "transitions": [
                { "buttonText": "🛣 Вернуться на Выселковский Тракт", "nextState": "IN_LOCATION_SCENE", "target": "DESTINATION" }
            ]
        }
    }
};
