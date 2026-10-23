# ◈ Crown of the Wilds

> A retro-fantasy, top-down JRPG built with strict vanilla web technologies. Play as Princess Aurelia, cleanse corrupted Aura Spirits, solve puzzle dungeons, recover shattered Aegis Crystal fragments, and reclaim your throne.

---

## 🌟 Overview & Premise

On the eve of Princess Aurelia's coronation, Lord Malakor betrays the kingdom by shattering the sacred **Aegis Crystal**. The realm's protective ward collapses, and its peaceful "Aura Spirits" become corrupted by dark shadow miasma. 

Disguised in traveler's clothes and clutching the surviving **Aegis Core Fragment**, Aurelia escapes through the castle undercroft. You must journey across the realm, purify corrupted spirits to make them companions (Pokémon-style battle & recruit system), collect the lost crystal fragments, and return to save your kingdom.

---

## 🎮 Playable Prologue (Core Experience)

1. **Castle Town & Sanctum**:
   - Meet **Grand Scholar Alistair** and **Chancellor Vance**.
   - Ascend the royal carpet into the **Aegis Sanctum** to confront Lord Malakor.
   - **The Shattering**: Witness the cinematic shattering of the crystal, claim the Aegis Core, and don your traveler's cloak.
2. **The Secret Sewer Escape**:
   - Follow the visual path markers and directional signs to the secret sewer grate hidden behind the tapestries in the southwest corner.
3. **The Royal Sewers & First Spirit Cleansing**:
   - Navigate the damp waterway corridors lit by iron torches.
   - Confront the **Corrupted Fox Spirit (Pyropaw)** snarling with shadow fire.
   - Enter turn-based combat: use abilities, lower corruption, and invoke **Aegis Cleanse** to purify the spirit!
   - Recruited companions actively follow Princess Aurelia in the overworld.
   - Reach the sunlit outflow pipe on the far right to unlock the road forward!

---

## 🕹️ Controls & Navigation

| Action | Keyboard | Mouse / Touch |
| :--- | :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` or `Arrow Keys` | Click/Tap in any direction on map |
| **Action / Interact** | `Space`, `Enter`, `Z` | Click on NPCs / Objects / Prompts |
| **In-Game Menu** | `Esc`, `X` | Tap the top-right `☰ MENU` button |
| **Toggle Fullscreen** | `F` | Tap the top-right `⛶ Fullscreen` button |
| **Toggle Audio** | `M` | Tap the top-right `🔊` button |

---

## 🐾 In-Game RPG Pause Menu

Press `Esc`, `X`, or tap `MENU` to open the retro JRPG pause window:
- **🐾 AURA SPIRITS**: Inspect party roster, HP, Energy, element affinities, field abilities, and switch lead companion.
- **🎒 TRAVELING BAG**: Use items such as Aegis Salves (restore 40 HP), Aura Elixirs (restore 25 Energy), and Purifying Incense (boost cleanse resonance).
- **📜 QUEST CODEX & LORE**: View active quest objectives, elemental advantages, and chapter chronicles.
- **💾 SAVE PROGRESS**: Save current checkpoint to browser `localStorage`.
- **🔊 AUDIO & MUSIC**: Toggle procedural chiptune background music and sound effects.
- **✕ RESUME GAME**: Return instantly to exploration.

---

## 🛠️ Tech Stack & Architecture

- **Vanilla HTML5 & CSS3**: Pure CSS styling with fluid 16:9 full-screen canvas scaling and responsive glassmorphism HUD.
- **Vanilla JavaScript (ES6+)**: Zero external game engine dependencies (no React, Vue, or Phaser).
- **Procedural Canvas Asset Generation (`/assets`)**:
  - `tile_generator.js`: Procedurally renders 32x32 pixel tiles (castle stone, red carpet trails, torches, sewer waterways, animated rivers, and crystal altars).
  - `sprite_generator.js`: Renders animated 4-directional character walk cycles (Aurelia, Malakor, NPCs) and detailed overworld/battle spirit sprites (corrupted & cleansed states).
- **Plain JSON Map Data (`/data/maps/`)**:
  - Map files store width, height, tile grids, collision matrices, NPC spawns, triggers, and warps.
  - An embedded registry (`maps_registry.js`) guarantees instant loading without CORS errors even when launched directly from the local filesystem (`file://`).
- **Web Audio API Synth (`/js/audio.js`)**: Procedurally synthesizes 8-bit/16-bit chiptune melodies and retro sound effects (attack hits, shatter sounds, cleanse chimes, level-up fanfares).

---

## 🚀 Running Locally

You can run the game with any local HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Or using Node / npx
npx serve .
```

Then open your browser to:
```
http://localhost:8080/
```

Or simply open `index.html` directly in your browser.
