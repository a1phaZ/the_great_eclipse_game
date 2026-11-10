import { config } from './config.js';
import { newDetroit } from './locations/new_detroit.js';
import { highwaySouth } from './locations/highway_south.js';
import { rustyOutpost } from './locations/rusty_outpost.js';
import { eventAmbush } from './locations/event_ambush.js';
import { eventLoot } from './locations/event_loot.js';
import { eventRadio } from './locations/event_radio.js';
import { eventBunker } from './locations/event_bunker.js';
import { systemLocation } from './locations/system.js';

// Контент-пак: один мир на одного бота.
// Чтобы подключить другую историю, достаточно заменить этот объект.
export const pack = {
  config,
  locations: [
    newDetroit,
    highwaySouth,
    rustyOutpost,
    eventAmbush,
    eventLoot,
    eventRadio,
    eventBunker,
    systemLocation,
  ],
};
