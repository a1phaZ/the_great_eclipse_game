// CLI-обёртка валидатора активного контент-пака.
//
// Сам валидатор живёт в scripts/lib/content-validator.mjs и не знает про
// активный пак. Здесь только выбор пака и вывод результата.
//
// Запуск:  npm run validate
// Экспорт: validateContent(pack, options) — реэкспорт из библиотеки,
//          validateActiveContent() — проверка пака из content/index.js.

import { pathToFileURL } from 'node:url';
import { pack } from '../tgcloud/lib/content/index.js';
import { validateContent } from './lib/content-validator.mjs';

export { validateContent };

export function validateActiveContent() {
  return validateContent(pack, pack.validation ?? {});
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const { errors, warnings, stats } = validateActiveContent();

  console.log(`Локаций: ${stats.locations}, сцен: ${stats.scenes}, переходов: ${stats.transitions}, достижимо сцен: ${stats.reachableScenes}`);

  for (const warning of warnings) {
    console.warn(`⚠️  ${warning}`);
  }
  for (const error of errors) {
    console.error(`❌ ${error}`);
  }

  if (errors.length > 0) {
    console.error(`\nВалидация не пройдена: ${errors.length} ошибок, ${warnings.length} предупреждений.`);
    process.exitCode = 1;
  } else {
    console.log(`\n✅ Контент валиден (${warnings.length} предупреждений).`);
  }
}
