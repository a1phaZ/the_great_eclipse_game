export const highwaySouth = {
  locationId: 'highway_south',
  name: 'Перегон «Детройт – Выселки»',
  scenes: {
    from_detroit: {
      text: [
        '🛣 **Перегон «Детройт – Выселки»: ВЫЕЗД ИЗ ДЕТРОЙТА**',
        '',
        'Ваш трак стоит на обочине у ворот Нового Детройта. Позади виднеются безопасные стены полиса, впереди — бесконечная выжженная дорога.',
        '',
        '⛽ **Приборная панель:**',
        '• Запас дизеля: `{resources.diesel}/{vars.maxDiesel} л.`',
        '',
        '{side_quest_line}',
        '',
        '📋 **Навигация:**',
        '• 🏁 Начать путь к Ржавым Выселкам: **15 км** (Расход: `{travel_fuel_cost}` л. ⛽)',
        '• ⬅️ Сдать назад и вернуться в Новый Детройт: **0 км** (Бесплатно ⛽)',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚗 Начать путь к Выселкам (−{travel_fuel_cost} л. Дизеля)',
          condition: 'resources.diesel >= travel_fuel_cost',
          effects: {
            'resources.diesel': '-travel_fuel_cost',
            'vars.destination': 'rusty_outpost:garage',
          },
          target: '@router:highway',
        },
        {
          buttonText: '🎯 Выполнить заказ (−{travel_fuel_cost * 2} л.)',
          condition: 'flags.side.active && resources.diesel >= travel_fuel_cost * 2',
          effects: { 'resources.diesel': '-travel_fuel_cost * 2' },
          target: '@table:active_side_quest',
        },
        {
          buttonText: '⬅️ Вернуться в Новый Детройт',
          target: 'new_detroit:garage',
        },
      ],
    },

    from_outpost: {
      text: [
        '🛣 **Перегон «Детройт – Выселки»: ВЫЕЗД ИЗ ВЫСЕЛОК**',
        '',
        'Вы выкатились за ворота аванпоста Ржавые Выселки. Вокруг завывает ветер, вздымая соляную пыль.',
        '',
        '⛽ **Приборная панель:**',
        '• Запас дизеля: `{resources.diesel}/{vars.maxDiesel} л.`',
        '',
        '{side_quest_line}',
        '',
        '📋 **Навигация:**',
        '• 🏁 Начать путь к Новому Детройту: **15 км** (Расход: `{travel_fuel_cost}` л. ⛽)',
        '• ⬅️ Сдать назад и вернуться на Аванпост: **0 км** (Бесплатно ⛽)',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '🚗 Начать путь к Детройту (−{travel_fuel_cost} л. Дизеля)',
          condition: 'resources.diesel >= travel_fuel_cost',
          effects: {
            'resources.diesel': '-travel_fuel_cost',
            'vars.destination': 'new_detroit:garage',
          },
          target: '@router:highway',
        },
        {
          buttonText: '🎯 Выполнить заказ (−{travel_fuel_cost * 2} л.)',
          condition: 'flags.side.active && resources.diesel >= travel_fuel_cost * 2',
          effects: { 'resources.diesel': '-travel_fuel_cost * 2' },
          target: '@table:active_side_quest',
        },
        {
          buttonText: '⬅️ Вернуться в Ржавые Выселки',
          target: 'rusty_outpost:garage',
        },
      ],
    },
  },
};
