export const new_detroit = {
  "locationId": "new_detroit",
  "name": "Новый Детройт",
  "scenes": {
    "garage": {
      "text": "🛠 **ГАРАЖ: УБЕЖИЩЕ «РЖАВЫЙ БОЛТ»**\n\nВы находитесь в своем Гараже. Двигатель трака `{truck.model_name}` мерно рокочет.\n\n📊 **Ваш Профиль:**\n• 💾 Чипы: `{user.chips}`\n• 🚜 Прочность: `{truck.hp}/{truck.max_hp} HP`\n• 🎖 Уровень трака: `{truck.level}`\n\n_Куда направимся, Капитан?_",
      "imageUrl": "https://unsplash.com",
      "transitions": [
        { "buttonText": "🍻 Зайти в бар «Ржавый Поршень»", "nextState": "IN_LOCATION_SCENE", "target": "new_detroit:bar" },
        { "buttonText": "🛒 Посетить Мастерскую и Рынок", "nextState": "IN_LOCATION_SCENE", "target": "new_detroit:market_repair" },
        { "buttonText": "🗺 Выехать на Перегон «Детройт – Выселки»", "nextState": "IN_LOCATION_SCENE", "target": "highway_south:from_detroit" },
        {
          "buttonText": "⚛️ [ЧИТ] Активировать код: +50000 💾 и Полный Бак ⛽",
          "nextState": "IN_LOCATION_SCENE",
          "target": "new_detroit:garage",
          "effects": {
            "user.chips": "+50000",
            "user.diesel": "MAX",
            "truck.hp": "MAX"
          }
        }
        // { "buttonText": "💀 Спровоцировать поломку (Тест Эвакуации, -250 HP)", "nextState": "IN_LOCATION_SCENE", "target": "new_detroit:garage", "effects": { "truck.hp": "-250" } }
      ]
    },
    "bar": {
      "text": "🍻 **БАР «РЖАВЫЙ ПОРШЕНЬ»**\n\nВ воздухе висит дым от дешевого самосада, а из старого кассетника хрипит довоенный рок. За столами хмуро пьют дизельные наемники.\n\n_Одноглазый Джо кивает вам из угла, но доска объявлений пока пуста._",
      "imageUrl": "https://unsplash.com",
      "transitions": [
        { "buttonText": "⬅️ Вернуться в Гараж", "nextState": "IN_LOCATION_SCENE", "target": "new_detroit:garage" }
      ]
    },
    "market_repair": {
      "text": "🔧 **АВТОМАСТЕРСКАЯ «У ГАНСА»**\n\nСтарик Ганс осматривает обшивку вашего броневика.\n\n📋 **Смета на ремонт:**\n• Текущая прочность: `{truck.hp}/{truck.max_hp} HP`\n• Стоимость восстановления 1 HP: `{repair_price_per_hp} 💾`\n• Итого за полную починку: **`{repair_cost_full} 💾`**\n\n_У вас в кармане: {user.chips} чипов._",
      "imageUrl": "https://unsplash.com",
      "transitions": [
        {
          "buttonText": "🛠 Оплатить ремонт ({repair_cost_full} 💾)",
          "condition": "user.chips >= {repair_cost_full}",
          "effects": { "user.chips": "-{repair_cost_full}", "truck.hp": "MAX" },
          "nextState": "IN_LOCATION_SCENE",
          "target": "new_detroit:market_repair"
        },
        { "buttonText": "⬅️ Вернуться в Гараж", "nextState": "IN_LOCATION_SCENE", "target": "new_detroit:garage" }
      ]
    }
  }
}
