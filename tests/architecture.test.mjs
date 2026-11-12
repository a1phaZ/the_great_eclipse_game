import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Архитектурный тест: движок должен оставаться переносимым.
// Он не имеет права импортировать платформенный sdk, контент-паки,
// приложение (world.js/schema.js/persistence.js) и не должен знать
// идентификаторы конкретного сеттинга.

const root = fileURLToPath(new URL('..', import.meta.url));
const engineDir = join(root, 'tgcloud/lib/engine');

function collectFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(path);
    return entry.name.endsWith('.js') ? [path] : [];
  });
}

const IMPORT_RE = /\b(?:from|import)\s+['"]([^'"]+)['"]/g;

const FORBIDDEN_IMPORTS = [
  /^sdk(?:\/|$)/,
  /(?:^|\/)content\//,
  /(?:^|\/)world\.js$/,
  /(?:^|\/)schema\.js$/,
  /(?:^|\/)persistence\.js$/,
];

const FORBIDDEN_IDENTIFIERS = [
  'new_detroit',
  'story_neo_tek',
  'repNeoTek',
  'truckLevel',
  'great_eclipse',
  'event_loot',
  'chips',
];

// Грубо, но достаточно: убираем блочные и строчные комментарии.
// `://` не считается началом комментария.
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

test('engine не импортирует sdk, контент и приложение', () => {
  const files = collectFiles(engineDir);
  assert.ok(files.length > 0, 'в engine должны быть файлы');

  for (const file of files) {
    const source = stripComments(readFileSync(file, 'utf8'));
    const where = relative(root, file);

    for (const match of source.matchAll(IMPORT_RE)) {
      const specifier = match[1];
      for (const forbidden of FORBIDDEN_IMPORTS) {
        assert.ok(
          !forbidden.test(specifier),
          `${where}: запрещённый импорт "${specifier}"`,
        );
      }
    }
  }
});

test('engine не содержит идентификаторов конкретного контент-пака', () => {
  for (const file of collectFiles(engineDir)) {
    const source = stripComments(readFileSync(file, 'utf8'));
    const where = relative(root, file);

    for (const identifier of FORBIDDEN_IDENTIFIERS) {
      assert.ok(
        !source.includes(identifier),
        `${where}: найдено контент-специфичное "${identifier}"`,
      );
    }
  }
});
