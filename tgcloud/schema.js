import { table, integer, text, json } from 'sdk/db';

// Вся история игрока живёт в JSON-состоянии. Схема больше не знает
// про чипы, дизель, трак и квестовые поля — это забота контент-пака.
export const sessions = table('sessions', {
  userId: integer('user_id').primaryKey(),
  state: json('state').notNull().default({}),

  // Старые колонки помечены deprecated, чтобы `tgcloud migrate` их удалил.
  // После миграции эти строки можно убрать из схемы.
  currentState: text('current_state').deprecated('moved to state JSON'),
  currentLocationId: text('current_location_id').deprecated('moved to state JSON'),
  currentSceneId: text('current_scene_id').deprecated('moved to state JSON'),
  chips: integer('chips').deprecated('moved to state JSON'),
  diesel: integer('diesel').deprecated('moved to state JSON'),
  maxDiesel: integer('max_diesel').deprecated('moved to state JSON'),
  statEvasion: integer('stat_evasion').deprecated('moved to state JSON'),
  statLuck: integer('stat_luck').deprecated('moved to state JSON'),
  truckModel: text('truck_model').deprecated('moved to state JSON'),
  truckLevel: integer('truck_level').deprecated('moved to state JSON'),
  truckBaseCost: integer('truck_base_cost').deprecated('moved to state JSON'),
  truckHp: integer('truck_hp').deprecated('moved to state JSON'),
  truckMaxHp: integer('truck_max_hp').deprecated('moved to state JSON'),
  destinationTarget: text('destination_target').deprecated('moved to state JSON'),
  questParams: json('quest_params').deprecated('moved to state JSON'),
});
