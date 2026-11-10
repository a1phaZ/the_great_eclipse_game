import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyEffect,
  createState,
  getValue,
  inventorySummary,
  mergeDefaults,
} from '../tgcloud/lib/engine/state.js';
import { createScope } from '../tgcloud/lib/engine/index.js';

const config = {
  id: 'state-test',
  version: 2,
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  start: 'camp:start',
  resources: {
    gold: { initial: 10, min: 0 },
    mana: { initial: 5, min: 0, max: 'vars.maxMana' },
    hp: { initial: 10, min: 0, max: 10 },
  },
  stats: {
    luck: { initial: 3, min: 0 },
  },
  vars: {
    maxMana: { initial: 5, min: 1 },
    destination: { initial: '' },
  },
  items: {
    potion: {
      name: { ru: 'Зелье', en: 'Potion' },
      maxQty: 9,
    },
    sword: {
      name: { ru: 'Тесак', en: 'Cleaver' },
      maxQty: 1,
      fields: {
        durability: { label: { ru: 'прочность', en: 'durability' }, initial: 100, min: 0, max: 100 },
      },
    },
  },
  strings: {
    emptyInventory: '',
    inventoryTitle: '🎒',
  },
};

function fresh() {
  return createState(config, 'ru');
}

test('createState собирает дефолты из конфига', () => {
  const state = fresh();

  assert.deepEqual(state.nav, { locationId: 'camp', sceneId: 'start' });
  assert.equal(state.resources.gold, 10);
  assert.equal(state.resources.mana, 5);
  assert.equal(state.stats.luck, 3);
  assert.equal(state.vars.maxMana, 5);
  assert.deepEqual(state.flags, {});
  assert.deepEqual(state.inventory, {});
  assert.equal(state.meta.version, 2);
  assert.equal(state.meta.locale, 'ru');
});

test('createState выбирает поддерживаемую локаль', () => {
  assert.equal(createState(config, 'en-US').meta.locale, 'en');
  assert.equal(createState(config, 'de').meta.locale, 'ru');
});

test('mergeDefaults добавляет недостающие поля, не затирая значения', () => {
  const state = mergeDefaults(config, {
    resources: { gold: 99 },
    meta: { locale: 'en' },
  });

  assert.equal(state.resources.gold, 99);
  assert.equal(state.resources.mana, 5);
  assert.equal(state.stats.luck, 3);
  assert.deepEqual(state.nav, { locationId: 'camp', sceneId: 'start' });
  assert.equal(state.meta.locale, 'en');
  assert.equal(state.meta.version, 2);
});

test('getValue возвращает безопасные дефолты для отсутствующих полей', () => {
  const state = fresh();

  assert.equal(getValue(state, 'flags.quest.noise'), 0);
  assert.equal(getValue(state, 'inventory.potion.qty'), 0);
  assert.equal(getValue(state, 'resources.unknown'), 0);
  assert.equal(getValue(state, 'vars.unknown'), 0);
});

test('applyEffect: add/sub/set и ограничения', () => {
  const state = fresh();
  const scope = createScope(state, config, 'ru');

  applyEffect(state, config, 'resources.gold', '+5', scope);
  assert.equal(state.resources.gold, 15);

  applyEffect(state, config, 'resources.gold', '-20', scope);
  assert.equal(state.resources.gold, 0);

  applyEffect(state, config, 'resources.mana', '+10', scope);
  assert.equal(state.resources.mana, 5, 'mana ограничена vars.maxMana');

  applyEffect(state, config, 'resources.hp', '3', scope);
  assert.equal(state.resources.hp, 3);

  applyEffect(state, config, 'resources.hp', 'MAX', scope);
  assert.equal(state.resources.hp, 10);

  applyEffect(state, config, 'resources.hp', 'MIN', scope);
  assert.equal(state.resources.hp, 0);
});

test('applyEffect: CLEAR, TOGGLE и строковый литерал', () => {
  const state = fresh();
  const scope = createScope(state, config, 'ru');

  applyEffect(state, config, 'flags.quest.noise', '1', scope);
  assert.equal(state.flags.quest.noise, 1);

  applyEffect(state, config, 'flags.quest.noise', 'TOGGLE', scope);
  assert.equal(state.flags.quest.noise, 0);

  applyEffect(state, config, 'flags.quest', 'CLEAR', scope);
  assert.equal(state.flags.quest, undefined);

  applyEffect(state, config, 'vars.destination', 'camp:start', scope);
  assert.equal(state.vars.destination, 'camp:start');
});

test('инвентарь: количество, поля и текстовая сводка', () => {
  const state = fresh();
  const scope = createScope(state, config, 'ru');

  applyEffect(state, config, 'inventory.potion.qty', '+3', scope);
  assert.equal(state.inventory.potion.qty, 3);

  applyEffect(state, config, 'inventory.potion.qty', '+20', scope);
  assert.equal(state.inventory.potion.qty, 9, 'maxQty ограничивает количество');

  applyEffect(state, config, 'inventory.sword.qty', '1', scope);
  applyEffect(state, config, 'inventory.sword.durability', '-25', scope);
  assert.equal(state.inventory.sword.durability, 75);

  const summary = inventorySummary(state, config, 'ru');
  assert.match(summary, /Зелье ×9/);
  assert.match(summary, /Тесак ×1/);
  assert.match(summary, /прочность 75\/100/);

  const english = inventorySummary(state, config, 'en');
  assert.match(english, /Potion ×9/);
  assert.match(english, /Cleaver ×1/);
});

test('пустой инвентарь возвращает строку из конфига', () => {
  assert.equal(inventorySummary(fresh(), config, 'ru'), '');
});
