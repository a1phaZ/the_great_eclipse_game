import test from 'node:test';
import assert from 'node:assert/strict';

import { validateContent } from '../scripts/lib/content-validator.mjs';
import { createRegistry } from '../tgcloud/lib/engine/create-world.js';
import { fixtureConfig, fixturePack } from './fixtures/engine-pack.js';

function clonePack(mutator) {
  const pack = structuredClone(fixturePack);
  mutator(pack);
  return pack;
}

test('фикстурный пак проходит валидацию без ошибок и предупреждений', () => {
  const { errors, warnings, stats } = validateContent(fixturePack);

  assert.deepEqual(errors, []);
  assert.deepEqual(warnings, []);
  assert.equal(stats.locations, 2);
  assert.ok(stats.scenes > 0);
  assert.equal(stats.reachableScenes, stats.scenes);
});

test('валидатор принимает готовый registry', () => {
  const registry = createRegistry(fixturePack.locations);
  const { errors } = validateContent({ config: fixtureConfig, registry });

  assert.deepEqual(errors, []);
});

test('валидатор требует пак', () => {
  assert.throws(() => validateContent(), /пак обязателен/);
});

test('несуществующий target попадает в ошибки', () => {
  const pack = clonePack((draft) => {
    draft.locations[0].scenes.start.transitions[0].target = 'test:missing';
  });

  const { errors } = validateContent(pack);
  assert.ok(errors.some((error) => error.includes('target "test:missing" не существует')));
});

test('неизвестное пространство эффекта — ошибка', () => {
  const pack = clonePack((draft) => {
    draft.locations[0].scenes.start.transitions[0].effects['skills.lockpick'] = '+1';
  });

  const { errors } = validateContent(pack);
  assert.ok(errors.some((error) => error.includes('неизвестное пространство эффекта "skills"')));
});

test('кастомное namespace принимается, если объявлено в config.state', () => {
  const pack = clonePack((draft) => {
    draft.config.state = {
      namespaces: {
        skills: {
          initial: {},
          fields: { lockpick: { min: 0, max: 10 } },
        },
      },
    };
    draft.locations[0].scenes.start.transitions[0].effects['skills.lockpick'] = '+1';
  });

  const { errors } = validateContent(pack);
  assert.ok(!errors.some((error) => error.includes('skills')));
});

test('navigationVars проверяет записанные target-значения', () => {
  const pack = clonePack((draft) => {
    draft.config.navigationVars = ['vars.destination'];
    draft.locations[0].scenes.start.transitions[1].effects['vars.destination'] = 'test:missing';
  });

  const { errors } = validateContent(pack);
  assert.ok(errors.some((error) => error.includes('vars.destination "test:missing" не существует')));
});

test('без navigationVars строка в vars не считается target', () => {
  const pack = clonePack((draft) => {
    delete draft.config.navigationVars;
    draft.locations[0].scenes.start.transitions[1].effects['vars.destination'] = 'test:missing';
  });

  const { errors } = validateContent(pack);
  assert.ok(!errors.some((error) => error.includes('test:missing')));
});

test('navigationVars должен ссылаться на объявленную строковую vars', () => {
  const pack = clonePack((draft) => {
    draft.config.navigationVars = ['vars.mood'];
  });

  const { errors } = validateContent(pack);
  assert.ok(errors.some((error) => error.includes('vars.mood') && error.includes('строкой')));
});

test('плагины пака получают config и addError', () => {
  const pack = clonePack((draft) => {
    draft.checks = [({ addError }) => addError('plugin', 'boom')];
  });

  const { errors } = validateContent(pack);
  assert.ok(errors.includes('plugin: boom'));
});

test('requiredStrings проверяет обязательные строки', () => {
  const pack = clonePack((draft) => {
    delete draft.config.strings.help;
  });

  const { errors } = validateContent(pack, { requiredStrings: ['help'] });
  assert.ok(errors.includes('strings: нет help'));
});

test('лимиты Telegram можно переопределить', () => {
  const pack = clonePack((draft) => {
    draft.locations[0].scenes.start.text = 'x'.repeat(20);
  });

  const { errors } = validateContent(pack, { limits: { caption: 5 } });
  assert.ok(errors.some((error) => error.includes('caption 20 символов')));
});
