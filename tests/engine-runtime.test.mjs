import test from 'node:test';
import assert from 'node:assert/strict';

import {
  WorldRegistry,
  evaluateCondition,
  interpolate,
  resolveTarget,
} from '../tgcloud/lib/engine/index.js';
import { applyEffect } from '../tgcloud/lib/engine/state.js';
import { createWorld } from '../tgcloud/lib/engine/create-world.js';
import { fixtureConfig, fixturePack } from './fixtures/engine-pack.js';

function render(world, state) {
  return world.engine.processAction(state, { type: 'RENDER' });
}

test('условия: пустое — true, битое — false', () => {
  const world = createWorld(fixturePack);
  const scope = world.engine.createScope(world.createState('en'));

  assert.equal(evaluateCondition(undefined, scope), true);
  assert.equal(evaluateCondition('', scope), true);
  assert.equal(evaluateCondition('resources.gold > 5', scope), true);
  assert.equal(evaluateCondition('resources.gold > 50', scope), false);
  assert.equal(evaluateCondition('nope(', scope), false);
});

test('интерполяция подставляет выражения и не роняет битые плейсхолдеры', () => {
  const world = createWorld(fixturePack);
  const scope = world.engine.createScope(world.createState('en'));

  assert.equal(interpolate('a {1 + 2} b', scope), 'a 3 b');
  assert.equal(interpolate('broken {nope(}', scope), 'broken {nope(}');
});

test('условие скрывает кнопку, а флаг делает её видимой', () => {
  const world = createWorld(fixturePack);

  const visible = render(world, world.createState('en'));
  assert.equal(visible.buttons.length, 7);
  assert.ok(!visible.buttons.some((button) => button.text === 'Secret'));

  const state = world.createState('en');
  state.flags.secret = 1;
  const withSecret = render(world, state);
  assert.equal(withSecret.buttons.length, 8);
  assert.ok(withSecret.buttons.some((button) => button.text === 'Secret'));
});

test('устаревший клик из другой сцены не применяется', () => {
  const world = createWorld(fixturePack);
  const state = world.createState('en');

  const result = world.engine.processAction(state, {
    type: 'CLICK',
    locationId: 'other',
    sceneId: 'arrival',
    transitionIndex: 0,
  });

  assert.equal(result.stale, true);
  assert.equal(result.nextSession.nav.sceneId, 'start');
});

test('несуществующий индекс перехода считается устаревшим', () => {
  const world = createWorld(fixturePack);
  const state = world.createState('en');

  const result = world.engine.processAction(state, {
    type: 'CLICK',
    locationId: 'test',
    sceneId: 'start',
    transitionIndex: 99,
  });

  assert.equal(result.stale, true);
});

test('@var-target возвращает null, пока переменная пуста', () => {
  const world = createWorld(fixturePack);
  const state = world.createState('en');
  const scope = world.engine.createScope(state);

  assert.equal(resolveTarget('@var:vars.destination', state, world.config, scope), null);

  state.vars.destination = 'test:rich';
  assert.equal(
    resolveTarget('@var:vars.destination', state, world.config, scope),
    'test:rich',
  );
});

test('router type=var использует значение-сцену или fallback', () => {
  const world = createWorld(fixturePack);
  const state = world.createState('en');
  const scope = world.engine.createScope(state);

  assert.equal(resolveTarget('@router:byMood', state, world.config, scope), 'test:start');

  state.vars.mood = 'test:rich';
  assert.equal(resolveTarget('@router:byMood', state, world.config, scope), 'test:rich');
});

test('локаль берётся из состояния, неизвестная — падает в defaultLocale', () => {
  const world = createWorld(fixturePack);

  const ru = render(world, world.createState('ru'));
  assert.match(ru.responseText, /Старт с 10 золота/);

  const de = world.createState('de');
  assert.equal(de.meta.locale, 'en');
});

test('inventorySummary доступен как встроенная функция выражения', () => {
  const world = createWorld(fixturePack);
  const state = world.createState('en');
  const scope = world.engine.createScope(state);

  applyEffect(state, world.config, 'inventory.potion.qty', '+2', scope);
  const summary = scope.call('inventorySummary', []);

  assert.match(summary, /Potion ×2/);
  assert.match(summary, /Charges 1\/3/);
});

test('циклические derived-значения дают понятную ошибку', () => {
  const world = createWorld({
    config: { ...fixtureConfig, derived: { a: 'b', b: 'a' } },
    locations: fixturePack.locations,
  });
  const scope = world.engine.createScope(world.createState('en'));

  assert.throws(() => scope.get('a'), /Циклическая зависимость/);
});

test('WorldRegistry регистрирует локации и сцены', () => {
  const registry = new WorldRegistry();
  registry.registerLocation('x', { name: 'X', scenes: { s: { text: 'S' } } });

  assert.equal(registry.getLocation('x').locationId, 'x');
  assert.ok(registry.hasScene('x', 's'));
  assert.equal(registry.hasScene('x', 'missing'), false);
});
