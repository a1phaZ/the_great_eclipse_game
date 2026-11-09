import { table, integer, text, json } from 'sdk/db';

export const sessions = table('sessions', {
  userId: integer('user_id').primaryKey(),
  currentState: text('current_state').notNull().default('IN_LOCATION_SCENE'), // Универсальный статус
  currentLocationId: text('current_location_id').default('new_detroit'),     // Имя файла локации
  currentSceneId: text('current_scene_id').default('garage'),               // Сцена внутри локации
  chips: integer('chips').notNull().default(250),
  diesel: integer('diesel').notNull().default(40),
  maxDiesel: integer('max_diesel').notNull().default(50),

  // 🎖️ ДОБАВЛЯЕМ ХАРАКТЕРИСТИКИ ПЕРСОНАЖА ДЛЯ КУБИКОВ
  statEvasion: integer('stat_evasion').notNull().default(15), // Базовое уклонение в %
  statLuck: integer('stat_luck').notNull().default(3), 

  // Данные машины
  truckModel: text('truck_model').default('Мародер-Скаут'),
  truckLevel: integer('truck_level').default(1),
  truckBaseCost: integer('truck_base_cost').default(500),
  truckHp: integer('truck_hp').default(250), 
  truckMaxHp: integer('truck_max_hp').default(250),
  destinationTarget: text('destination_target').default(''),

  // Данные текущего квеста
  questParams: json('quest_params').default({}), 
});