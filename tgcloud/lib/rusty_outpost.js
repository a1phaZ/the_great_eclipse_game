export const outpostData = {
  "locationId": "rusty_outpost",
  "name": "Ржавые Выселки",
  "scenes": {
    "garage": {
      "text": "🏚 **РЖАВЫЕ ВЫСЕЛКИ: СТАНЦИЯ ЗАПРАВКИ**\n\nВы добрались до полузаброшенного аванпоста. Вокруг стоят ржавые цистерны. Местный заправщик лениво жует табак.\n\n📊 **Ваше состояние:**\n• 💾 Чипы: `{user.chips}`\n• ⛽ Дизель: `{user.diesel}/{user.max_diesel} л.`\n\n📋 **Смета на заправку:**\n• Необходимый объем: `{fuel_missing} л.`\n• Стоимость 1 литра дизеля: `{fuel_price_per_liter} 💾`\n• Итого за полный бак: **`{fuel_cost_full} 💾`**\n\n_Здесь можно залить полный бак, прежде чем двигаться к Мертвому Архипелагу._",
      "imageUrl": "https://unsplash.com",
      "transitions": [
        { 
          "buttonText": "⛽ Заправить полный бак ({fuel_cost_full} 💾)", 
          "condition": "user.chips >= {fuel_cost_full}", 
          "effects": { 
            "user.chips": "-{fuel_cost_full}", 
            "user.diesel": "MAX" 
          }, 
          "nextState": "IN_LOCATION_SCENE", 
          "target": "rusty_outpost:garage" 
        },
        { "buttonText": "🛣 Выехать на Перегон «Детройт – Выселки»", "nextState": "IN_LOCATION_SCENE", "target": "highway_south:from_outpost" }
      ]
    }
  }
};
