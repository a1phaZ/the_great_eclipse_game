export const rustyOutpost = {
  locationId: 'rusty_outpost',
  name: 'Ржавые Выселки',
  scenes: {
    garage: {
      text: [
        '🏚 **РЖАВЫЕ ВЫСЕЛКИ: СТАНЦИЯ ЗАПРАВКИ**',
        '',
        'Вы добрались до полузаброшенного аванпоста. Вокруг стоят ржавые цистерны. Местный заправщик лениво жует табак.',
        '',
        '📊 **Ваше состояние:**',
        '• 💾 Чипы: `{resources.chips}`',
        '• ⛽ Дизель: `{resources.diesel}/{vars.maxDiesel} л.`',
        '',
        '📋 **Смета на заправку:**',
        '• Необходимый объем: `{fuel_missing} л.`',
        '• Стоимость 1 литра дизеля: `{fuel_price_per_liter} 💾`',
        '• Итого за полный бак: **`{fuel_cost_full} 💾`**',
        '',
        '_Здесь можно залить полный бак, прежде чем двигаться к Мертвому Архипелагу._',
      ].join('\n'),
      imageUrl: 'https://unsplash.com',
      transitions: [
        {
          buttonText: '⛽ Заправить полный бак ({fuel_cost_full} 💾)',
          condition: 'resources.chips >= fuel_cost_full',
          effects: {
            'resources.chips': '-fuel_cost_full',
            'resources.diesel': 'MAX',
          },
          target: 'rusty_outpost:garage',
        },
        { buttonText: '🛣 Выехать на Перегон «Детройт – Выселки»', target: 'highway_south:from_outpost' },
      ],
    },
  },
};
