# Crown of the Wilds: Game Design Document (GDD)

## 1. Core Premise
You play as Princess Aurelia on the eve of her coronation. When the kingdom's sacred Aegis Crystal is shattered by the treacherous Royal Advisor, the protective magic falls, and the land's peaceful "Aura Spirits" become corrupted. Disguised in traveling clothes, Aurelia must explore the realm, cleanse the spirits to make them her companions (Pokémon-style), recover the crystal fragments, and reclaim her throne.

## 2. Tech Stack & Architecture Guidelines
To keep the project lightweight and custom, the game will be built using strict vanilla web technologies.

*   **Core Languages:** Plain HTML, CSS, and Vanilla JavaScript. (No frameworks like React, Vue, or Phaser).
*   **Map Data:** Every map/level must be built using plain `.json` files. These files will store tile grids, collision data, NPC spawn points, and event triggers.
*   **Asset Generation:** All visual assets will be managed and generated via JavaScript. There will be a dedicated `/assets` directory, but the actual drawing of tiles, characters, and UI elements will be rendered dynamically onto an HTML5 `<canvas>` using JavaScript drawing functions, ensuring everything is self-contained without needing external image downloads initially.

## 3. Map Data Structure (JSON Example)
Each location will have its own JSON file parsed by the JS engine.
```json
{
  "mapName": "Castle Town",
  "width": 20,
  "height": 20,
  "tileData": [
    [1, 1, 1, 1],
    [1, 0, 0, 1] 
    // 1 = Wall, 0 = Walkable path
  ],
  "npcs": [
    {"name": "Royal Scholar", "x": 5, "y": 10, "dialogue": "Take this spirit!"}
  ],
  "wildZones": []
}
```

## 4. The Storyline & Locations

### Prologue: The Shattering (Location: Castle Town)
*   **Setting:** A walled, safe tutorial area.
*   **Story:** Aurelia catches Lord Malakor shattering the Aegis Crystal. She escapes through the sewers with the core fragment, discovering her ability to cleanse corrupted Aura Spirits.

### Act 1: The Pastoral Lands (Location: Oakhaven Village)
*   **Setting:** Sprawling green fields, rivers, and farms.
*   **Conflict:** The river is polluted by corruption, driving the sacred sweeping-horned cattle mad.
*   **Objective:** Navigate the riverbanks using JS-generated bush/tree tiles to find the source.
*   **Boss:** Mud-Toad Spirit (holds Fragment 1).

### Act 2: The Blockaded Coast (Location: Rustport)
*   **Setting:** A bustling coastal trade city with docks and piers.
*   **Conflict:** A massive maelstrom is blocking trade ships. 
*   **Objective:** Solve crate-pushing puzzles in the dockyard and use a Water-type spirit to cross broken bridges.
*   **Boss:** Abyssal Crab in the Smuggler's Cove (holds Fragment 2).

### Act 3: The Frozen Truth (Location: The Whispering Peaks)
*   **Setting:** Snowy mountains and an ancient monastery.
*   **Conflict:** Unnatural blizzards are freezing the monks. Here, Aurelia learns the Aegis Crystal is actually a seal holding back a demon.
*   **Objective:** Survive ice-sliding mechanics and collapsing snow paths.
*   **Boss:** Ice-Wyvern Spirit at the summit (holds Fragment 3).

### The Climax: The Ruined Keep (Location: The Wastelands)
*   **Setting:** A dark, abandoned fortress where Malakor is conducting his ritual.
*   **Conflict:** The allies Aurelia made in Oakhaven, Rustport, and the Peaks arrive to hold off the shadow army while she pushes inside.
*   **Objective:** The ultimate dungeon utilizing all companion abilities to solve complex puzzles.
*   **Final Boss:** Lord Malakor, followed by his summoned Shadow Chimera.

### Epilogue: A True Queen (Location: Castle Town Restored)
*   **Ending:** Aurelia pieces the crystal together, heals the land, and is crowned Queen. The castle gates remain open, symbolizing a ruler who is connected to her people and the wild.