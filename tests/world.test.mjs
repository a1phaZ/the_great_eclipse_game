import test from 'node:test';
import assert from 'node:assert/strict';

import { createRegistry, createWorld } from '../tgcloud/lib/engine/create-world.js';
import {
  fixtureConfig,
  fixturePack,
  otherLocation,
  testLocation,
} from './fixtures/engine-pack.js';

function startState(world, overrides = {}) {
  const state = world.createState('en');
  return {
    ...state,
    ...overrides,
    resources: { ...state.resources, ...(overrides.resources || {}) },
    vars: { ...state.vars, ...(overrides.vars || {}) },
  };
}

function click(world, state, transitionIndex) {
  return world.engine.processAction(state, {
    type: 'CLICK',
    locationId: state.nav.locationId,
    sceneId: state.nav.sceneId,
    transitionIndex,
  });
}

test('createWorld собирает мир из пака и рендерит стартовую сцену', () => {
  const world = createWorld(fixturePack);
  const result = world.engine.processAction(world.createState('en'), { type: 'RENDER' });

  assert.equal(world.config.id, 'fixture');
  assert.ok(world.registry.hasScene('test', 'start'));
  assert.equal(result.nextSession.nav.locationId, 'test');
  assert.equal(result.nextSession.nav.sceneId, 'start');
  assert.match(result.responseText, /Start with 10 gold/);
  assert.equal(result.buttons.length, 7);
});

test('createWorld принимает локации объектом и сохраняет их locationId', () => {
  const world = createWorld({
    config: fixtureConfig,
    locations: { test: testLocation, other: otherLocation },
  });

  assert.ok(world.registry.hasScene('test', 'start'));
  assert.ok(world.registry.hasScene('other', 'arrival'));
  assert.equal(world.registry.getLocation('other').locationId, 'other');
});

test('createRegistry в strict-режиме ловит дубликаты локаций', () => {
  assert.throws(
    () => createRegistry([testLocation, testLocation], { strict: true }),
    /дубликат локации "test"/,
  );

  const registry = createRegistry([testLocation, testLocation]);
  assert.ok(registry.hasScene('test', 'start'));
});

test('createWorld требует pack.config', () => {
  assert.throws(() => createWorld({ locations: [] }), /pack\.config/);
  assert.throws(() => createWorld(null), /pack\.config/);
});

test('клик применяет эффекты и переходит по target', () => {
  const world = createWorld(fixturePack);
  const state = startState(world);
  const result = click(world, state, 0);

  assert.equal(result.nextSession.nav.sceneId, 'rich');
  assert.equal(result.nextSession.resources.gold, 15);
  assert.equal(result.nextSession.flags.visited, 1);
  assert.match(result.responseText, /Rich: 30/);
});

test('@var-target разворачивается в сцену, записанную эффектом', () => {
  const world = createWorld(fixturePack);
  const state = startState(world);
  const result = click(world, state, 1);

  assert.equal(result.nextSession.vars.destination, 'test:rich');
  assert.equal(result.nextSession.nav.sceneId, 'rich');
});

test('смерть применяет effects, ведёт в recovery-сцену и добавляет текст', () => {
  const world = createWorld(fixturePack);
  const state = startState(world);
  const result = click(world, state, 5);

  assert.equal(result.nextSession.nav.sceneId, 'dead');
  assert.equal(result.nextSession.resources.hp, 0);
  assert.equal(result.nextSession.resources.gold, 0);
  assert.match(result.responseText, /You died/);
});

test('битая сцена восстанавливается в start с текстом onMissingScene', () => {
  const world = createWorld(fixturePack);
  const state = startState(world, { nav: { locationId: 'test', sceneId: 'missing' } });
  const result = world.engine.processAction(state, { type: 'RENDER' });

  assert.equal(result.nextSession.nav.sceneId, 'start');
  assert.match(result.responseText, /Recovered/);
});

test('таблица учитывает condition и использует переданный random', () => {
  const world = createWorld(fixturePack, { random: () => 0.99 });
  const state = startState(world, { resources: { gold: 60 } });
  const result = click(world, state, 2);

  assert.equal(result.nextSession.nav.sceneId, 'poor');
});

test('createState и mergeState используют конфиг мира', () => {
  const world = createWorld(fixturePack);

  const ru = world.createState('ru');
  assert.equal(ru.meta.locale, 'ru');
  assert.equal(ru.resources.gold, 10);

  const merged = world.mergeState({ resources: { gold: 42 }, meta: { locale: 'ru' } });
  assert.equal(merged.resources.gold, 42);
  assert.equal(merged.resources.hp, 5);
  assert.equal(merged.meta.locale, 'ru');
});

test('now можно подменить для детерминированных условий', () => {
  const world = createWorld(fixturePack, { now: () => 123 });
  const state = startState(world);
  const scope = world.engine.createScope(state);

  assert.equal(scope.call('now', []), 123);
});
