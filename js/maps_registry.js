/**
 * Crown of the Wilds - Maps Registry
 * Embedded map definitions guaranteeing zero CORS error if loaded via file:// protocol.
 */

(function() {
  if (typeof window === 'undefined' || !window.DATA) return;
  window.DATA.maps = {};

  // 1. Castle Town
  window.DATA.maps['castle_town'] = {
    mapId: "castle_town",
    mapName: "Castle Town - Throne & Sanctum",
    act: "Prologue",
    width: 24,
    height: 20,
    theme: "castle",
    spawn: { x: 12, y: 14 },
    tileData: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 7, 7, 7, 7, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8, 8, 8, 8, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 3, 3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 5, 0, 3, 3, 3, 3, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 6, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 6, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 6, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 6, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    legend: {
      "0": "stone_floor",
      "1": "stone_wall",
      "2": "signpost",
      "3": "red_carpet",
      "4": "sewer_grate_open",
      "5": "wall_torch",
      "6": "pillar",
      "7": "aegis_crystal",
      "8": "crystal_altar",
      "9": "sanctum_gate"
    },
    npcs: [
      {
        id: "scholar_alistair",
        name: "Scholar Alistair",
        sprite: "scholar",
        x: 9,
        y: 10,
        dialogue: "Princess Aurelia, today is your coronation! Follow the royal red carpet up through the golden archway to the Aegis Sanctum. Lord Malakor is waiting inside."
      },
      {
        id: "chancellor_vance",
        name: "Chancellor Vance",
        sprite: "chancellor",
        x: 15,
        y: 10,
        dialogue: "The nobles gather for your coronation, Your Highness. Walk straight north along the red carpet to the Sanctum altar."
      },
      {
        id: "guard_left",
        name: "Royal Guard",
        sprite: "guard",
        x: 9,
        y: 6,
        dialogue: "The Grand Sanctum Gate is open ahead. Lord Malakor requested a private audience before the ceremony."
      },
      {
        id: "lord_malakor",
        name: "Lord Malakor",
        sprite: "malakor",
        x: 12,
        y: 3,
        dialogue: "Ah, Aurelia... Just in time to witness the end of an archaic lie! This crystal was never yours to guard!"
      }
    ],
    interactive: [
      {
        x: 2,
        y: 16,
        type: "sewer_grate",
        name: "Secret Sewer Grate",
        description: "An iron sewer grate glowing with faint subterranean aura. It descends into the castle undercroft."
      },
      {
        x: 14,
        y: 7,
        type: "signpost",
        name: "Sanctum Direction Sign",
        description: "⬆ NORTH: The Grand Aegis Sanctum (Coronation Chamber). Follow the red carpet."
      },
      {
        x: 4,
        y: 16,
        type: "signpost",
        name: "Undercroft Direction Sign",
        description: "⬅ SOUTHWEST: Royal Undercroft Grate. Emergency escape passage behind tapestries."
      }
    ],
    triggers: [
      {
        id: "sanctum_cutscene",
        x: 12,
        y: 4,
        type: "event",
        event: "shattering_cutscene"
      }
    ],
    warps: [
      {
        x: 2,
        y: 16,
        targetMap: "castle_sewers",
        targetX: 2,
        targetY: 3,
        condition: "shattering_complete"
      }
    ],
    wildZones: []
  };

  // 2. Castle Sewers
  window.DATA.maps['castle_sewers'] = {
    mapId: "castle_sewers",
    mapName: "Royal Sewers & Escape Passage",
    act: "Prologue",
    width: 22,
    height: 18,
    theme: "sewers",
    spawn: { x: 2, y: 3 },
    tileData: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 5, 0, 1, 1, 0, 1, 1, 5, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 5, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 5, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 6, 6, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    legend: {
      "0": "sewer_stone",
      "1": "sewer_wall",
      "2": "signpost",
      "4": "slimy_growth",
      "5": "wall_torch",
      "6": "sunlit_exit"
    },
    npcs: [
      {
        id: "corrupted_starter",
        name: "Corrupted Fox Spirit",
        sprite: "pyropaw_corrupt",
        x: 11,
        y: 14,
        dialogue: "SKRRREEE! The dark purple miasma writhes violently around this trapped fox spirit! Use your Aegis Core to Cleanse it!"
      }
    ],
    interactive: [
      {
        x: 2,
        y: 2,
        type: "ladder",
        name: "Castle Sewer Ladder",
        description: "The iron ladder leading back to Castle Town. It is barred from above by Malakor's guards."
      },
      {
        x: 5,
        y: 2,
        type: "signpost",
        name: "Undercroft Direction Sign",
        description: "⬅ WEST: Castle Entrance Ladder | ➡ EAST: Undercroft Corridors & Outflow Pipe"
      },
      {
        x: 17,
        y: 14,
        type: "signpost",
        name: "Outflow Pipe Sign",
        description: "➡ EAST: River Outflow Pipe leading to Oakhaven Village."
      },
      {
        x: 19,
        y: 15,
        type: "drain_exit",
        name: "Sunlit Outflow Pipe",
        description: "Bright morning sunlight streams through the outflow pipe! It leads into the pastoral meadows of Oakhaven Village."
      }
    ],
    triggers: [
      {
        id: "sewer_tutorial_battle",
        x: 11,
        y: 13,
        type: "battle",
        spiritId: "pyropaw",
        isCorrupted: true,
        isTutorial: true
      }
    ],
    warps: [
      {
        x: 19,
        y: 16,
        targetMap: "oakhaven",
        targetX: 3,
        targetY: 4,
        condition: "has_companion"
      },
      {
        x: 20,
        y: 16,
        targetMap: "oakhaven",
        targetX: 3,
        targetY: 4,
        condition: "has_companion"
      }
    ],
    wildZones: [
      {
        x: 9,
        y: 14,
        w: 4,
        h: 3,
        encounterRate: 0.25,
        spirits: ["pyropaw", "sylphwing"]
      }
    ]
  };
})();
