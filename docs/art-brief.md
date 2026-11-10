# Art brief — изображения сцен

Список всех мест, где игра показывает картинку, с промптами для генерации
ИИ-моделью. Источник истины — `imageUrl` в
`tgcloud/lib/content/great_eclipse/locations/*.js` и `config.rules.onDeath.imageUrl`
в `tgcloud/lib/content/great_eclipse/config.js`.

## Сводка

- **20 изображений сцен** — по одному на каждую сцену в 8 локациях.
- **+1 кадр смерти** — он задан в `config.rules.onDeath.imageUrl` и перекрывает
  картинку `market_repair`.
- **+1 аварийный экран** (`system:recovery`) — появляется только при сбое
  навигации; можно переиспользовать картинку гаража.
- Весь текст сцены и кнопки живут в подписи к фото, поэтому **на картинках не
  должно быть текста**.
- Общий стиль задан один раз (ниже) и добавляется к каждому промпту — так мир
  выглядит цельно.

`locationId` / `sceneId` в таблице — ровно те ключи, которые использует движок
(`registry.getScene(locationId, sceneId)`).

## Таблица

| locationId | sceneId | Где в коде | Что на кадре | Prompt (EN) |
|---|---|---|---|---|
| `new_detroit` | `garage` | `locations/new_detroit.js:20` | Гараж «Ржавый болт», броневик на подъёмнике, верстак | Interior of a makeshift garage inside a ruined concrete building, armored post-apocalyptic diesel truck on jack stands, welding sparks, hanging tools, oil drums, warm work lamps against cold blue window light |
| `new_detroit` | `bar` | `locations/new_detroit.js:36` | Бар «Ржавый Поршень»: дым, кассетник, дизельные наёмники | Smoky wasteland tavern interior, rough wooden tables, diesel mercenaries in patched leather drinking, a one-eyed patron in the corner, old cassette player on the bar, empty cork bulletin board, hazy amber light |
| `new_detroit` | `market_repair` | `locations/new_detroit.js:56` | Мастерская Ганса, осмотр брони трака | Old mechanic in a leather apron inspecting the dented armor plating of a rusty truck inside a cluttered repair workshop, inspection pit, spare armor plates and tracks, single hanging lamp |
| `new_detroit` | `job_board` | `locations/new_detroit.js:105` | Доска объявлений в баре: три бумажки с печатями фракций | Cork bulletin board in a smoky wasteland tavern, three faction notices with wax seals and stamped symbols, a one-eyed patron pointing at it, warm amber lamplight |
| `new_detroit` | `faction_rewards` | `locations/new_detroit.js:142` | Джо достаёт из-под стойки модуль фракции | One-eyed bartender pulling a wrapped salvaged tech module from under a wooden counter, faction emblem stamped on the crate, dim tavern light, conspiratorial mood |
| `new_detroit` | `market_repair` *(смерть)* | `config.js:75` | Разбитый трак эвакуируют дроны-утилизаторы | Wrecked armored truck with a shattered hull being dragged by salvage drones into a workshop at night, smoke and sparks, red emergency lights |
| `highway_south` | `from_detroit` | `locations/highway_south.js:18` | Трак у ворот Нового Детройта, выжженный тракт | Armored truck parked on the shoulder in front of the massive gates of a fortified post-apocalyptic city, endless cracked scorched highway to the horizon, heat haze, salt dust |
| `highway_south` | `from_outpost` | `locations/highway_south.js:49` | Выезд из Ржавых Выселок на тракт | Armored truck rolling out through the gates of a small rusty outpost, salt dust blowing across a cracked wasteland highway, wind-beaten fences |
| `rusty_outpost` | `garage` | `locations/rusty_outpost.js:22` | Полузаброшенная заправка, ржавые цистерны, заправщик | Half-abandoned wasteland gas station, rusted fuel cisterns, hand-cranked pump, lazy refueler chewing tobacco leaning on a barrel, sand and tumbleweed |
| `event_ambush` | `stage_1` | `locations/event_ambush.js:17` | Поваленный столб ЛЭП, трое рейдеров с обрезами | Fallen power-line pole blocking a desert highway, three raiders with sawn-off shotguns emerging from behind a pile of old tires, harsh sunlight, dust |
| `event_ambush` | `stage_ram` | `locations/event_ambush.js:44` | Таран баррикады на полном ходу | Armored truck smashing through a barricade of tires and a wooden power pole at full speed, splinters and debris flying, muzzle flashes, motion blur |
| `event_ambush` | `stage_pay` | `locations/event_ambush.js:60` | Мешок чипов в окно, рейдер с КПК, столб оттаскивают | Raider catching a pouch thrown from a truck window, checking a battered handheld device, grinning, other raiders winching the roadblock aside |
| `event_loot` | `stage_1` | `locations/event_loot.js:15` | Полузанесённый песком прицеп, ящик снабжения | Half-sand-buried trailer of an old semi truck on a desert highway, door torn off its hinges, open supply crate with spare parts inside, footprints in the sand |
| `event_radio` | `catch_signal` | `locations/event_radio.js:17` | Радио на панели, статика; вдали болота и бункер | Truck dashboard close-up, old radio bursting with static and a glowing dial, through the windshield a distant swamp and the silhouette of a concrete bunker under a heavy sky |
| `event_bunker` | `stage_1` | `locations/event_bunker.js:16` | Бетонная воронка, круглый гермозатвор, аварийный диод | Rusted concrete crater leading down to a massive round airlock hatch, no power, dim red emergency diode on the lock panel, hand valve with a seized chain, open electrical panel |
| `event_bunker` | `stage_2` | `locations/event_bunker.js:43` | Машинный зал, генераторы по колено в мазуте | Huge underground generator hall flooded knee-deep with black oily sludge, toxic fumes, flickering industrial lamps, strange ripples on the surface |
| `event_bunker` | `stage_3_check` | `locations/event_bunker.js:66` | Брод через мазут, кислотные слизни, жижа по шлангам | Runner wading through black sludge in a flooded generator hall, acid slugs lunging from the muck, corrosive slime splashing toward fuel lines, sickly green glow |
| `event_bunker` | `stage_3_clean` | `locations/event_bunker.js:84` | Ожившая помпа откачивает мазут, сухой бетон | Industrial pump revived and draining toxic sludge through a pipe into a reserve tank, dry concrete path revealed leading deeper into an underground command post |
| `event_bunker` | `stage_4_server` | `locations/event_bunker.js:101` | Серверная, ЭЛТ-терминал, кассета в кейсе, турели | Abandoned server room with a working CRT terminal, a magnetic tape cassette in a lead case, ceiling turrets warming up red laser sights, dust in the light beam |
| `event_bunker` | `stage_final` | `locations/event_bunker.js:127` | Выход из воронки на поверхность, трак в мазуте | Armored truck bursting out of a concrete bunker crater onto the surface, covered in black sludge, dust and daylight, triumphant low angle |
| `system` | `recovery` *(опционально)* | `locations/system.js:16` | Аварийный экран: сбой навигации, возврат в гараж | Glitching truck dashboard with a red warning light and static, dark garage entrance ahead, emergency protocol mood |

## Общий стиль (добавлять к каждому промпту)

```
post-apocalyptic dieselpunk wasteland, rusty scavenged technology,
gritty cinematic concept art, muted dusty palette with teal shadows and
amber highlights, volumetric dust, high detail, 16:9, no text
```

**Negative prompt** (обязательно):

```
text, letters, words, captions, watermark, logo, UI, HUD, frame,
cartoon, anime, magic, clean modern vehicles, chrome
```

## Технические требования

- **Формат:** 16:9, 1280×720 или 1536×864, JPEG/WebP/PNG, ≤10 МБ
  (Telegram всё равно пережмёт).
- **Композиция:** главный объект — по центру, с отступами от краёв: Telegram в
  некоторых клиентах обрезает превью.
- **Именование:** `<locationId>_<sceneId>.jpg` → `new_detroit_garage.jpg`,
  `event_bunker_stage_4_server.jpg` и т.д.
- **URL:** нужен прямой URL на файл (не страница). Варианты хостинга: S3/R2,
  GitHub raw, imgbb — либо один раз загрузить ботом и переиспользовать
  `file_id` (быстрее, но требует `InputFile` при первой отправке).
- **Единственное исключение из таблицы:** кадр смерти
  (`config.rules.onDeath.imageUrl`) перекрывает `market_repair`. Либо заводим
  отдельный файл и правим эту строку, либо убираем `imageUrl` из `onDeath` —
  тогда смерть покажет картинку мастерской.

## Замечания по контенту, которые всплывут при генерации

- `highway_south.from_detroit` и `from_outpost` — почти одна композиция.
  Дешевле сгенерировать один кадр и сделать зеркальную версию с другими
  воротами, чтобы не плодить два похожих ассета.
- `event_bunker.stage_2`, `stage_3_check` и `stage_3_clean` — один и тот же зал.
  Их лучше генерировать с одним style-reference/seed, иначе зал будет «прыгать»
  между кадрами.
- `new_detroit.bar` — сцена-заглушка (только текст, без механик), но картинка
  всё равно нужна, т.к. игрок её видит.
