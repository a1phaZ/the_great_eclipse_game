import test from 'node:test';
import assert from 'node:assert/strict';

import { config, engine, registry } from '../tgcloud/lib/world.js';
import { createState, applyEffect } from '../tgcloud/lib/engine/state.js';
import {
  createScope,
  evaluateCondition,
  GameEngine,
  WorldRegistry,
} from '../tgcloud/lib/engine/index.js';

function baseState(overrides = {}) {
  const state = createState(config, 'ru');

  return {
    ...state,
    ...overrides,
    nav: { ...state.nav, ...(overrides.nav || {}) },
    resources: { ...state.resources, ...(overrides.resources || {}) },
    stats: { ...state.stats, ...(overrides.stats || {}) },
    vars: { ...state.vars, ...(overrides.vars || {}) },
    flags: { ...state.flags, ...(overrides.flags || {}) },
    inventory: { ...state.inventory, ...(overrides.inventory || {}) },
    meta: { ...state.meta, ...(overrides.meta || {}) },
  };
}

function render(state) {
  return engine.processAction(state, { type: 'RENDER' });
}

function click(state, transitionIndex) {
  return engine.processAction(state, {
    type: 'CLICK',
    locationId: state.nav.locationId,
    sceneId: state.nav.sceneId,
    transitionIndex,
  });
}

test('гараж: три кнопки, чит-кнопки нет', () => {
  const result = render(baseState());

  assert.deepEqual(result.buttons.map(button => button.transitionIndex), [0, 1, 2]);
  assert.ok(!result.buttons.some(button => button.text.includes('ЧИТ')));
});

test('кнопки сохраняют индексы исходного массива переходов', () => {
  const state = baseState({
    nav: { locationId: 'new_detroit', sceneId: 'market_repair' },
    resources: { hp: 100 },
  });
  const result = render(state);

  assert.equal(result.buttons.length, 2);
  assert.equal(result.buttons[0].transitionIndex, 0);
  assert.equal(result.buttons[1].transitionIndex, 1);
});

test('ремонт скрыт при полном HP', () => {
  const state = baseState({ nav: { locationId: 'new_detroit', sceneId: 'market_repair' } });
  const result = render(state);

  assert.deepEqual(result.buttons.map(button => button.transitionIndex), [1]);
});

test('ремонт скрыт, если не хватает чипов', () => {
  const state = baseState({
    nav: { locationId: 'new_detroit', sceneId: 'market_repair' },
    resources: { chips: 100, hp: 100 },
  });
  const result = render(state);

  assert.deepEqual(result.buttons.map(button => button.transitionIndex), [1]);
});

test('ремонт показывает цену и применяет эффекты', () => {
  const state = baseState({
    nav: { locationId: 'new_detroit', sceneId: 'market_repair' },
    resources: { hp: 100 },
  });

  const rendered = render(state);
  assert.match(rendered.buttons[0].text, /150/);

  const result = click(state, 0);
  assert.equal(result.nextSession.resources.chips, 100);
  assert.equal(result.nextSession.resources.hp, 250);
});

test('цены ремонта и топлива растут с уровнем трака', () => {
  const state = baseState({
    vars: { truckLevel: 2 },
    resources: { hp: 200 },
  });
  const scope = createScope(state, config, 'ru');

  assert.equal(scope.get('repair_price_per_hp'), 2);
  assert.equal(scope.get('repair_cost_full'), 100);
  assert.equal(scope.get('fuel_price_per_liter'), 2);
  assert.equal(scope.get('fuel_cost_full'), 20);
  assert.equal(scope.get('fuel_missing'), 10);
});

test('устаревшая кнопка из другой сцены не применяется', () => {
  const state = baseState({ nav: { locationId: 'new_detroit', sceneId: 'bar' } });
  const result = engine.processAction(state, {
    type: 'CLICK',
    locationId: 'new_detroit',
    sceneId: 'garage',
    transitionIndex: 0,
  });

  assert.equal(result.stale, true);
  assert.equal(result.nextSession.nav.sceneId, 'bar');
});

test('переход, условие которого больше не проходит, считается устаревшим', () => {
  const state = baseState({
    nav: { locationId: 'new_detroit', sceneId: 'market_repair' },
    resources: { chips: 0, hp: 100 },
  });
  const result = click(state, 0);

  assert.equal(result.stale, true);
  assert.equal(result.nextSession.resources.hp, 100);
  assert.equal(result.nextSession.resources.chips, 0);
});

test('legacy-клик без location/scene не применяется', () => {
  const state = baseState();
  const result = engine.processAction(state, { type: 'CLICK', transitionIndex: 0 });

  assert.equal(result.stale, true);
  assert.equal(result.nextSession.nav.sceneId, 'garage');
});

test('смерть трака эвакуирует в мастерскую с 1 HP', () => {
  const state = baseState({ resources: { hp: 0 } });
  const result = render(state);

  assert.equal(result.nextSession.nav.locationId, 'new_detroit');
  assert.equal(result.nextSession.nav.sceneId, 'market_repair');
  assert.equal(result.nextSession.resources.hp, 1);
  assert.match(result.responseText, /ТРАК КРИТИЧЕСКИ РАЗБИТ/);
});

test('потерянная сцена уводит в recovery, откуда есть выход', (t) => {
  t.mock.method(console, 'error', () => {});

  const state = baseState({ nav: { locationId: 'nope', sceneId: 'nope' } });
  const result = render(state);

  assert.equal(result.nextSession.nav.locationId, 'system');
  assert.equal(result.nextSession.nav.sceneId, 'recovery');
  assert.equal(result.buttons.length, 1);
  assert.equal(result.buttons[0].transitionIndex, 0);

  const exit = click(result.nextSession, 0);
  assert.equal(exit.nextSession.nav.locationId, 'new_detroit');
  assert.equal(exit.nextSession.nav.sceneId, 'garage');
});

test('тайник: текст и награда применяются на переходе', () => {
  const state = baseState({
    nav: { locationId: 'event_loot', sceneId: 'stage_1' },
    vars: { destination: 'rusty_outpost:garage' },
  });

  const rendered = render(state);
  assert.match(rendered.responseText, /в пределах бака/);

  const result = click(state, 0);
  assert.equal(result.nextSession.resources.chips, 370);
  assert.equal(result.nextSession.resources.diesel, 50);
  assert.equal(result.nextSession.nav.locationId, 'rusty_outpost');
  assert.equal(result.nextSession.nav.sceneId, 'garage');
});

test('бункер: шумный путь отнимает 60 HP, чистый — нет', () => {
  const noisy = baseState({
    nav: { locationId: 'event_bunker', sceneId: 'stage_3_check' },
    flags: { quest: { noise: 1 } },
  });
  assert.equal(click(noisy, 0).nextSession.resources.hp, 190);

  const clean = baseState({
    nav: { locationId: 'event_bunker', sceneId: 'stage_3_check' },
    flags: { quest: {} },
  });
  assert.equal(click(clean, 0).nextSession.resources.hp, 250);
});

test('бункер: флаг разряда живёт до финального экрана, CLEAR — на выходе', () => {
  const state = baseState({
    nav: { locationId: 'event_bunker', sceneId: 'stage_4_server' },
    flags: { quest: { battery_dead: 1 } },
  });

  const result = click(state, 0);
  assert.equal(result.nextSession.resources.chips, 650);
  assert.equal(result.nextSession.resources.diesel, 35);
  assert.equal(result.nextSession.flags.quest.battery_dead, 1);
  assert.match(result.responseText, /5 л\./);

  const finalState = {
    ...result.nextSession,
    nav: { locationId: 'event_bunker', sceneId: 'stage_final' },
    vars: { ...result.nextSession.vars, destination: 'new_detroit:garage' },
  };
  const exit = click(finalState, 0);

  assert.equal(exit.nextSession.flags.quest, undefined);
  assert.equal(exit.nextSession.flags.story.bunkerDone, 1);
  assert.equal(exit.nextSession.nav.locationId, 'new_detroit');
  assert.equal(exit.nextSession.nav.sceneId, 'garage');
});

test('бункер проходится один раз: после рейда радио больше не выпадает', () => {
  // random() = 0 всегда берёт первую подходящую запись таблицы.
  const deterministic = new GameEngine(config, registry, { random: () => 0 });

  const firstTrip = baseState({
    nav: { locationId: 'highway_south', sceneId: 'from_detroit' },
    vars: { destination: 'rusty_outpost:garage' },
  });
  const radio = deterministic.processAction(firstTrip, {
    type: 'CLICK',
    locationId: 'highway_south',
    sceneId: 'from_detroit',
    transitionIndex: 0,
  });
  assert.equal(radio.nextSession.nav.locationId, 'event_radio');

  const secondTrip = baseState({
    nav: { locationId: 'highway_south', sceneId: 'from_detroit' },
    vars: { destination: 'rusty_outpost:garage' },
    flags: { story: { bunkerDone: 1 } },
  });
  const noRadio = deterministic.processAction(secondTrip, {
    type: 'CLICK',
    locationId: 'highway_south',
    sceneId: 'from_detroit',
    transitionIndex: 0,
  });
  assert.notEqual(noRadio.nextSession.nav.locationId, 'event_radio');
});

test('доска объявлений: повторяемая работа даёт репутацию и упирается в лимит', () => {
  const state = baseState({ nav: { locationId: 'new_detroit', sceneId: 'job_board' } });
  const result = click(state, 0);

  assert.equal(result.nextSession.vars.repNeoTek, 6);
  assert.equal(result.nextSession.resources.diesel, 30);
  assert.equal(result.nextSession.nav.sceneId, 'job_board');

  const capped = baseState({
    nav: { locationId: 'new_detroit', sceneId: 'job_board' },
    vars: { repNeoTek: 99 },
  });
  assert.equal(click(capped, 0).nextSession.vars.repNeoTek, 100);
});

test('награда фракции выдаётся только на пороге репутации и один раз', () => {
  const nav = { locationId: 'new_detroit', sceneId: 'faction_rewards' };

  const locked = render(baseState({ nav }));
  assert.deepEqual(locked.buttons.map(button => button.transitionIndex), [3]);

  const ready = baseState({ nav, vars: { repNeoTek: 30 } });
  const readyRender = render(ready);
  assert.ok(readyRender.buttons.some(button => button.transitionIndex === 0));

  const claimed = click(ready, 0);
  assert.equal(claimed.nextSession.inventory.neo_tek_scanner.qty, 1);

  const afterClaim = render({ ...claimed.nextSession, nav });
  assert.ok(!afterClaim.buttons.some(button => button.transitionIndex === 0));
});

test('модули фракций дают пассивные бонусы', () => {
  const plain = createScope(baseState(), config, 'ru');
  assert.equal(plain.get('travel_fuel_cost'), 15);
  assert.equal(plain.get('encounter_ambush_chance'), 45);
  assert.equal(plain.get('encounter_loot_chance'), 21);

  const modded = createScope(baseState({
    inventory: {
      neo_tek_scanner: { qty: 1 },
      baron_plating: { qty: 1 },
      eclipse_core: { qty: 1 },
    },
  }), config, 'ru');
  assert.equal(modded.get('travel_fuel_cost'), 12);
  assert.equal(modded.get('encounter_ambush_chance'), 35);
  assert.equal(modded.get('encounter_loot_chance'), 29);

  const trip = baseState({
    nav: { locationId: 'highway_south', sceneId: 'from_detroit' },
    vars: { destination: 'rusty_outpost:garage' },
    inventory: { baron_plating: { qty: 1 } },
  });
  assert.equal(click(trip, 0).nextSession.resources.diesel, 28);
});

test('условия с && работают', () => {
  const full = createScope(baseState(), config, 'ru');
  assert.equal(
    evaluateCondition('resources.hp < vars.maxHp && resources.chips >= 0', full),
    false,
  );

  const damaged = createScope(baseState({ resources: { hp: 100 } }), config, 'ru');
  assert.equal(
    evaluateCondition('resources.hp < vars.maxHp && resources.chips >= 0', damaged),
    true,
  );
});

test('заправка на аванпосте списывает чипы и наполняет бак', () => {
  const state = baseState({ nav: { locationId: 'rusty_outpost', sceneId: 'garage' } });
  const result = click(state, 0);

  assert.equal(result.nextSession.resources.chips, 240);
  assert.equal(result.nextSession.resources.diesel, 50);
});

test('засада: откуп и таран дают ожидаемые эффекты', () => {
  const pay = baseState({ nav: { locationId: 'event_ambush', sceneId: 'stage_1' } });
  assert.equal(click(pay, 1).nextSession.resources.chips, 150);

  const ram = baseState({ nav: { locationId: 'event_ambush', sceneId: 'stage_1' } });
  assert.equal(click(ram, 0).nextSession.resources.hp, 170);
});

test('случайный перегон всегда приводит в существующую сцену', () => {
  for (let i = 0; i < 50; i += 1) {
    const state = baseState({
      nav: { locationId: 'highway_south', sceneId: 'from_detroit' },
    });
    const result = click(state, 0);

    assert.ok(result.nextSession.nav.locationId, `итерация ${i}: нет локации`);
    assert.ok(result.nextSession.nav.sceneId, `итерация ${i}: нет сцены`);
  }
});

test('applyEffect сохраняет знак "+" и ограничивает максимумом', () => {
  const state = baseState({ resources: { chips: 100, hp: 45, diesel: 45 } });
  const scope = createScope(state, config, 'ru');

  applyEffect(state, config, 'resources.chips', '+20', scope);
  assert.equal(state.resources.chips, 120);

  applyEffect(state, config, 'resources.chips', '-30', scope);
  assert.equal(state.resources.chips, 90);

  applyEffect(state, config, 'resources.hp', '-100', scope);
  assert.equal(state.resources.hp, 0);

  applyEffect(state, config, 'resources.diesel', '+10', scope);
  assert.equal(state.resources.diesel, 50);

  applyEffect(state, config, 'resources.diesel', 'MAX', scope);
  assert.equal(state.resources.diesel, 50);
});

// ---------------------------------------------------------------------------
// Синтетический пак: доказательство, что движок не завязан на Great Eclipse.
// Ни одного слова про трак, чипы или дизель.
// ---------------------------------------------------------------------------

const syntheticConfig = {
  id: 'synthetic',
  version: 1,
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  start: 'camp:start',

  resources: {
    gold: { label: { ru: 'Золото', en: 'Gold' }, initial: 10, min: 0 },
    mana: { label: { ru: 'Мана', en: 'Mana' }, initial: 5, min: 0, max: 'vars.maxMana' },
    hp: { label: 'HP', initial: 10, min: 0, max: 10 },
  },

  stats: {},
  vars: { maxMana: { initial: 5 }, destination: { initial: '' } },

  derived: {
    potion_price: 'max(1, vars.maxMana)',
  },

  items: {
    potion: {
      name: { ru: 'Зелье', en: 'Potion' },
      stackable: true,
      maxQty: 9,
    },
  },

  tables: {
    road: { entries: [{ weight: 1, target: 'camp:start' }] },
  },

  routers: {
    road: { type: 'table', table: 'road' },
  },

  rules: {
    onDeath: {
      when: 'resources.hp <= 0',
      target: 'camp:start',
      text: 'dead',
      effects: { 'resources.hp': '1' },
    },
    onMissingScene: { target: 'camp:start' },
  },

  strings: {
    help: 'help',
    missingScene: 'missing',
    emptyInventory: '',
    inventoryTitle: 'Inventory:',
    fallbackImage: 'https://example.com/fallback.png',
  },
};

const syntheticRegistry = new WorldRegistry();
syntheticRegistry.registerLocation('camp', {
  locationId: 'camp',
  name: 'Camp',
  scenes: {
    start: {
      text: {
        ru: 'Золото: {resources.gold}, мана: {resources.mana}/{vars.maxMana}. {inventorySummary()}',
        en: 'Gold: {resources.gold}, mana: {resources.mana}/{vars.maxMana}. {inventorySummary()}',
      },
      imageUrl: 'https://example.com/camp.png',
      transitions: [
        {
          buttonText: { ru: 'Купить зелье ({potion_price})', en: 'Buy potion ({potion_price})' },
          effects: {
            'resources.gold': '-potion_price',
            'inventory.potion.qty': '+1',
          },
          target: 'camp:start',
        },
        {
          buttonText: 'Медитировать',
          effects: { 'resources.mana': 'MAX' },
          target: 'camp:start',
        },
        {
          buttonText: 'В дорогу',
          target: '@router:road',
        },
      ],
    },
  },
});

const syntheticEngine = new GameEngine(syntheticConfig, syntheticRegistry);

test('синтетический пак: ресурсы, derived, инвентарь и локаль', () => {
  const state = createState(syntheticConfig, 'ru');

  const rendered = syntheticEngine.processAction(state, { type: 'RENDER' });
  assert.match(rendered.responseText, /Золото: 10/);
  assert.match(rendered.buttons[0].text, /\(5\)/);

  const bought = syntheticEngine.processAction(state, {
    type: 'CLICK',
    locationId: 'camp',
    sceneId: 'start',
    transitionIndex: 0,
  });

  assert.equal(bought.nextSession.resources.gold, 5);
  assert.equal(bought.nextSession.inventory.potion.qty, 1);
  assert.match(bought.responseText, /Зелье ×1/);

  const english = createState(syntheticConfig, 'en');
  const englishRender = syntheticEngine.processAction(english, { type: 'RENDER' });
  assert.match(englishRender.responseText, /Gold: 10/);
  assert.match(englishRender.buttons[0].text, /Buy potion/);
});

test('синтетический пак: таблица и роутер работают без контента Great Eclipse', () => {
  const state = createState(syntheticConfig, 'ru');
  const result = syntheticEngine.processAction(state, {
    type: 'CLICK',
    locationId: 'camp',
    sceneId: 'start',
    transitionIndex: 2,
  });

  assert.equal(result.nextSession.nav.locationId, 'camp');
  assert.equal(result.nextSession.nav.sceneId, 'start');
});
