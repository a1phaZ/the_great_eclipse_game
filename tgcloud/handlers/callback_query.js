import { api, db } from 'sdk';
import { eq } from 'sdk/db';
import { sessions } from '../schema.js';
import { GlobalGameStateMachine, WorldRegistry } from '../lib/engine.js';
import { new_detroit as cityData } from '../lib/new_detroit.js';
import { highwayData } from '../lib/highway_south.js';
import { outpostData } from '../lib/rusty_outpost.js';
import { fillSession } from '../lib/utils.js';
import { ambushEventData } from '../lib/event_ambush.js';
import { radioEventData } from '../lib/event_radio.js';
import { bunkerQuestData } from '../lib/event_bunker.js';

const registry = new WorldRegistry();
registry.registerLocation('new_detroit', cityData);
registry.registerLocation('highway_south', highwayData);
registry.registerLocation('rusty_outpost', outpostData);
registry.registerLocation('event_ambush', ambushEventData);
registry.registerLocation('event_radio', radioEventData);
registry.registerLocation('event_bunker', bunkerQuestData);

const stateMachine = new GlobalGameStateMachine(registry);

export default async function (callbackQuery) {
    const userId = callbackQuery.from.id;
    const callbackData = callbackQuery.data;

    if (!callbackData.startsWith('click:')) return;
    const targetIndex = Number(callbackData.split(':')[1]);

    let playerRow = await db.select().from(sessions).where(eq(sessions.userId, userId)).get();
    if (!playerRow) return;

    const session = fillSession(playerRow);

    const result = stateMachine.processPlayerAction(session, { type: 'CLICK', targetIndex });

    await db.update(sessions)
        .set({
            currentState: result.nextSession.currentState,
            currentLocationId: result.nextSession.currentLocationId,
            currentSceneId: result.nextSession.currentSceneId,
            chips: result.nextSession.chips,
            truckHp: result.nextSession.truck.hp,
            diesel: result.nextSession.diesel,
            destinationTarget: result.nextSession.destinationTarget,
            questParams: result.nextSession.questParams
        })
        .where(eq(sessions.userId, userId))
        .run();

    const keyboard = {
        inline_keyboard: result.buttons.map((text, idx) => [
            { text: text, callback_data: `click:${idx}` }
        ])
    };

    await api.answerCallbackQuery({ callback_query_id: callbackQuery.id });

    await api.editMessageMedia({
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        media: {
            type: 'photo',
            media: result.imageUrl,
            caption: result.responseText,
            parse_mode: 'Markdown'
        },
        reply_markup: keyboard
    });
}
