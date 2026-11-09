import { api, db } from 'sdk';
import { eq } from 'sdk/db';
import { sessions } from '../schema.js';
import { GlobalGameStateMachine, WorldRegistry } from '../lib/engine.js';
import { new_detroit as cityData } from '../lib/new_detroit.js';
import { highwayData } from '../lib/highway_south.js';
import { outpostData } from '../lib/rusty_outpost.js';
import { fillSession } from '../lib/utils.js';
import { ambushEventData } from '../lib/event_ambush.js';
import { lootEventData } from '../lib/event_loot.js';
import { radioEventData } from '../lib/event_radio.js';
import { bunkerQuestData } from '../lib/event_bunker.js';


const registry = new WorldRegistry();
registry.registerLocation('new_detroit', cityData);
registry.registerLocation('highway_south', highwayData);
registry.registerLocation('rusty_outpost', outpostData);
registry.registerLocation('event_ambush', ambushEventData);
registry.registerLocation('event_loot', lootEventData);
registry.registerLocation('event_radio', radioEventData);
registry.registerLocation('event_bunker', bunkerQuestData);


const stateMachine = new GlobalGameStateMachine(registry);

export default async function (message, ctx) {
  if (message.text !== '/start') return;
  const userId = message.from.id;

  let playerRow = await db.select().from(sessions).where(eq(sessions.userId, userId)).get();
  if (!playerRow) {
    [playerRow] = await db.insert(sessions).values({ userId }).returning().run();
  }

  const session = fillSession(playerRow);

  const result = stateMachine.processPlayerAction(session, { type: 'RENDER_CURRENT' });

  const keyboard = {
    inline_keyboard: result.buttons.map((text, idx) => [
      { text: text, callback_data: `click:${idx}` }
    ])
  };

  await api.sendPhoto({
    chat_id: message.chat.id,
    photo: result.imageUrl,
    caption: result.responseText,
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}
