export const highwayData = {
  "highwayId": "highway_south",
  "name": "Перегон «Детройт – Выселки»",
  "scenes": {
    "from_detroit": {
      "text": "🛣 **Перегон «Детройт – Выселки»: ВЫЕЗД ИЗ ДЕТРОЙТА**\n\nВаш трак стоит на обочине у ворот Нового Детройта. Позади виднеются безопасные стены полиса, впереди — бесконечная выжженная дорога.\n\n⛽ **Приборная панель:**\n• Запас дизеля: `{user.diesel}/{user.max_diesel} л.`\n\n📋 **Навигация:**\n• 🏁 Начать путь к Ржавым Выселкам: **15 км** (Расход: 15 л. ⛽)\n• ⬅️ Сдать назад и вернуться в Новый Детройт: **0 км** (Бесплатно ⛽)",
      "imageUrl": "https://unsplash.com",
      "transitions": [
        { 
          "buttonText": "🚗 Начать путь к Выселкам (-15 л. Дизеля)", 
          "condition": "user.diesel >= 15", 
          "effects": { "user.diesel": "-15", "user.destination_target": "rusty_outpost:garage" }, 
          "nextState": "IN_LOCATION_SCENE", 
          "target": "SYSTEM_ROLL_ENCOUNTER",
          // "target": "rusty_outpost:garage" 
        },
        { 
          "buttonText": "⬅️ Вернуться в Новый Детройт", 
          "nextState": "IN_LOCATION_SCENE", 
          "target": "new_detroit:garage" 
        }
      ]
    },
    "from_outpost": {
      "text": "🛣 **Перегон «Детройт – Выселки»: ВЫЕЗД ИЗ ВЫСЕЛОК**\n\nВы выкатились за ворота аванпоста Ржавые Выселки. Вокруг завывает ветер, вздымая соляную пыль. \n\n⛽ **Приборная панель:**\n• Запас дизеля: `{user.diesel}/{user.max_diesel} л.`\n\n📋 **Навигация:**\n• 🏁 Начать путь к Новому Детройту: **15 км** (Расход: 15 л. ⛽)\n• ⬅️ Сдать назад и вернуться на Аванпост: **0 км** (Бесплатно ⛽)",
      "imageUrl": "https://unsplash.com",
      "transitions": [
        { 
          "buttonText": "🚗 Начать путь к Детройту (-15 л. Дизеля)", 
          "condition": "user.diesel >= 15", 
          "effects": { "user.diesel": "-15", "user.destination_target": "new_detroit:garage" }, 
          "nextState": "IN_LOCATION_SCENE", 
          "target": "SYSTEM_ROLL_ENCOUNTER",
          // "target": "new_detroit:garage" 
        },
        { 
          "buttonText": "⬅️ Вернуться в Ржавые Выселки", 
          "nextState": "IN_LOCATION_SCENE", 
          "target": "rusty_outpost:garage" 
        }
      ]
    }
  }
};
