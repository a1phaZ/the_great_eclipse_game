export function fillSession(playerRow) {
    return {
        userId: playerRow.userId,
        currentState: playerRow.currentState,
        currentLocationId: playerRow.currentLocationId,
        currentSceneId: playerRow.currentSceneId,
        chips: playerRow.chips,
        diesel: playerRow.diesel,
        maxDiesel: playerRow.maxDiesel,
        destinationTarget: playerRow.destinationTarget,
        statEvasion: playerRow.statEvasion,
        statLuck: playerRow.statLuck,
        truck: {
            modelName: playerRow.truckModel,
            level: playerRow.truckLevel,
            baseCost: playerRow.truckBaseCost,
            hp: playerRow.truckHp,       // Читаем truckHp из БД
            maxHp: playerRow.truckMaxHp   // Читаем truckMaxHp из БД
        },
        questParams: playerRow.questParams || {},
    }
}