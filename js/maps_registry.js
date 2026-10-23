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
      [1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 9, 0, 7, 7, 7, 7, 0, 9, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 9, 0, 8, 8, 8, 8, 0, 9, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 9, 0, 0, 0, 0, 0, 0, 9, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 6, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 6, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    legend: {
      "0": "stone_floor",
      "1": "stone_wall",
      "3": "red_carpet",
      "6": "pillar",
      "7": "aegis_crystal",
      "8": "crystal_altar",
      "9": "sanctum_wall"
    },
    npcs: [
      {
        id: "scholar_alistair",
        name: "Scholar Alistair",
        sprite: "scholar",
        x: 9,
        y: 10,
        dialogue: "Princess Aurelia, today is your coronation! But Lord Malakor has entered the Aegis Sanctum alone. Something feels deeply wrong..."
      },
      {
        id: "chancellor_vance",
        name: "Chancellor Vance",
        sprite: "chancellor",
        x: 15,
        y: 10,
        dialogue: "The nobles gather for your coronation, Your Highness. May the sacred Aegis Crystal forever protect the realm."
      },
      {
        id: "guard_left",
        name: "Royal Guard",
        sprite: "guard",
        x: 10,
        y: 6,
        dialogue: "The Sanctum doors are open. Lord Malakor is waiting inside before the crystal."
      },
      {
        id: "lord_malakor",
        name: "Lord Malakor",
        sprite: "malakor",
        x: 12,
        y: 4,
        dialogue: "Ah, Aurelia... Just in time to witness the end of an archaic lie! This crystal was never yours to guard!"
      }
    ],
    interactive: [
      {
        x: 2,
        y: 16,
        type: "sewer_grate",
        name: "Secret Sewer Grate",
        description: "An iron sewer grate hidden behind the royal tapestries. It leads into the undercroft."
      }
    ],
    triggers: [
      {
        id: "sanctum_cutscene",
        x: 12,
        y: 5,
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
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    legend: {
      "0": "sewer_stone",
      "1": "sewer_wall",
      "2": "sewer_water",
      "4": "slimy_growth"
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
        x: 19,
        y: 15,
        type: "drain_exit",
        name: "Outflow Pipe",
        description: "Daylight streams through the outflow pipe! It leads out into the pastoral meadows of Oakhaven Village."
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
