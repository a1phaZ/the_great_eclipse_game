// Контент-специфичные проверки пака great_eclipse.
//
// Общий валидатор не знает про фракции и кулдауны — эти правила подключаются
// как плагины через manifest.checks. Другой пак может не иметь ни того, ни другого.

const ID_RE = /^[A-Za-z0-9_]+$/;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function checkFactions({ config, addError }) {
  for (const [factionId, faction] of Object.entries(config.factions || {})) {
    const where = `factions.${factionId}`;
    if (!ID_RE.test(factionId)) addError(where, 'id должен состоять из латиницы, цифр и _');
    if (!isPlainObject(faction)) {
      addError(where, 'определение фракции должно быть объектом');
      continue;
    }
    if (!faction.name) addError(where, 'нет name');
    if (typeof faction.repVar !== 'string' || !config.vars?.[faction.repVar]) {
      addError(where, `repVar "${faction.repVar}" не объявлена в config.vars`);
    }
    if (faction.rewardItem !== undefined
      && (typeof faction.rewardItem !== 'string' || !config.items?.[faction.rewardItem])) {
      addError(where, `rewardItem "${faction.rewardItem}" отсутствует в config.items`);
    }

    if (!Array.isArray(faction.ranks) || faction.ranks.length === 0) {
      addError(where, 'нет ranks — нечего выдавать за репутацию');
      continue;
    }

    faction.ranks.forEach((rank, index) => {
      const rankWhere = `${where}.ranks[${index}]`;
      if (!isPlainObject(rank)) {
        addError(rankWhere, 'ранг должен быть объектом');
        return;
      }
      if (typeof rank.rep !== 'number' || rank.rep < 0) {
        addError(rankWhere, 'rep должен быть неотрицательным числом');
      }
      if (!rank.title) addError(rankWhere, 'нет title');
      if (typeof rank.item !== 'string' || !config.items?.[rank.item]) {
        addError(rankWhere, `item "${rank.item}" отсутствует в config.items`);
      }
    });
  }
}

function checkSettings({ config, addError }) {
  if (config.settings === undefined) return;

  const where = `pack "${config.id || '?'}"`;

  if (!isPlainObject(config.settings)) {
    addError(where, 'settings должен быть объектом');
    return;
  }

  const cooldown = config.settings.sideQuestCooldownMs;
  if (cooldown !== undefined
    && (typeof cooldown !== 'number' || !Number.isFinite(cooldown) || cooldown <= 0)) {
    addError(where, 'settings.sideQuestCooldownMs должен быть положительным числом');
  }
}

export const checks = [checkFactions, checkSettings];
