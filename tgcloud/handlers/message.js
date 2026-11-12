import { world } from '../lib/world.js';
import { createMessageHandler } from '../lib/telegram/handlers.js';

export default createMessageHandler(world);
