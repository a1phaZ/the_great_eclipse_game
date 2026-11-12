import { world } from '../lib/world.js';
import { createCallbackHandler } from '../lib/telegram/handlers.js';

export default createCallbackHandler(world);
