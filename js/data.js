/**
 * Crown of the Wilds - Game Database
 * Aura Spirits, Moves, Items, Type Chart, and Embedded Map Data fallback.
 */

const DATA = {
  // --- ELEMENT ADVANTAGES ---
  elements: {
    fire: { name: 'Fire', color: '#ff6b35', strongAgainst: ['nature', 'ice'], weakAgainst: ['water'] },
    water: { name: 'Water', color: '#3895d3', strongAgainst: ['fire'], weakAgainst: ['nature', 'electric'] },
    nature: { name: 'Nature', color: '#4cb944', strongAgainst: ['water'], weakAgainst: ['fire', 'ice'] },
    ice: { name: 'Ice', color: '#7ce5f0', strongAgainst: ['nature'], weakAgainst: ['fire'] },
    electric: { name: 'Electric', color: '#f7c948', strongAgainst: ['water'], weakAgainst: ['nature'] },
    shadow: { name: 'Shadow', color: '#7c3aed', strongAgainst: ['all'], weakAgainst: ['aegis'] },
    aegis: { name: 'Aegis', color: '#38bdf8', strongAgainst: ['shadow'], weakAgainst: [] }
  },

  // --- MOVES ---
  moves: {
    // Normal / Physical
    tackle: { name: 'Tackle', element: 'nature', power: 30, acc: 95, cost: 0, sfx: 'hit', desc: 'A quick physical strike.' },
    scratch: { name: 'Scratch', element: 'nature', power: 28, acc: 100, cost: 0, sfx: 'hit', desc: 'Sharp claws swipe.' },
    horn_charge: { name: 'Horn Charge', element: 'nature', power: 42, acc: 88, cost: 8, sfx: 'hit', desc: 'A reckless charge with sweeping horns.' },
    vise_grip: { name: 'Vise Grip', element: 'water', power: 45, acc: 90, cost: 9, sfx: 'hit', desc: 'Crushes the foe with massive pincers.' },

    // Fire
    ember_breath: { name: 'Ember Breath', element: 'fire', power: 38, acc: 92, cost: 8, sfx: 'hit', desc: 'Spits a burst of sparkling embers.' },
    flame_dash: { name: 'Flame Dash', element: 'fire', power: 52, acc: 85, cost: 14, sfx: 'hit', desc: 'Cloaks body in wildfire and tackles.' },

    // Nature
    gust: { name: 'Gust', element: 'nature', power: 32, acc: 95, cost: 6, sfx: 'hit', desc: 'Summons a whirlwind of fresh leaves.' },
    floral_pollen: { name: 'Floral Pollen', element: 'nature', power: 25, acc: 90, cost: 10, sfx: 'cleanse', desc: 'Soothes enemy, lowering their attack.' },
    leaf_blade: { name: 'Leaf Blade', element: 'nature', power: 48, acc: 90, cost: 12, sfx: 'hit', desc: 'Slashes with razor-sharp razor foliage.' },

    // Water
    water_spout: { name: 'Water Spout', element: 'water', power: 40, acc: 90, cost: 8, sfx: 'splash', desc: 'Blasts pressurized river water.' },
    maelstrom_wave: { name: 'Maelstrom Wave', element: 'water', power: 55, acc: 82, cost: 16, sfx: 'splash', desc: 'Crashes a tidal wave onto the target.' },

    // Earth / Mud
    mud_slap: { name: 'Mud Slap', element: 'nature', power: 34, acc: 95, cost: 7, sfx: 'hit', desc: 'Hurls blinding bog mud.' },
    bog_quake: { name: 'Bog Quake', element: 'nature', power: 54, acc: 80, cost: 15, sfx: 'bump', desc: 'Shakes the ground with swamp power.' },

    // Ice
    frost_fang: { name: 'Frost Fang', element: 'ice', power: 42, acc: 92, cost: 9, sfx: 'slide', desc: 'Bites with crystalline frost.' },
    blizzard_gale: { name: 'Blizzard Gale', element: 'ice', power: 56, acc: 84, cost: 16, sfx: 'slide', desc: 'Unleashes sub-zero howling winds.' },

    // Shadow / Void (Boss moves)
    shadow_claw: { name: 'Void Claw', element: 'shadow', power: 46, acc: 90, cost: 10, sfx: 'hit', desc: 'Rips reality with corrupted shadows.' },
    chaos_breath: { name: 'Chaos Breath', element: 'shadow', power: 58, acc: 85, cost: 18, sfx: 'hit', desc: 'Breathes unholy purple miasma.' },
    cataclysm: { name: 'Cataclysm', element: 'shadow', power: 68, acc: 75, cost: 24, sfx: 'shatter', desc: 'Calls upon the ancient void to crush all.' },

    // Aegis Pure Moves
    aegis_resonance: { name: 'Aegis Resonance', element: 'aegis', power: 50, acc: 95, cost: 12, sfx: 'cleanse', desc: 'Radiates crystal harmony that shatters darkness.' }
  },

  // --- AURA SPIRITS ---
  spirits: {
    pyropaw: {
      id: 'pyropaw',
      name: 'Pyropaw',
      title: 'Cinder Fox Spirit',
      element: 'fire',
      baseHp: 65,
      baseAtk: 16,
      baseDef: 12,
      baseSpd: 18,
      moves: ['tackle', 'ember_breath', 'flame_dash', 'aegis_resonance'],
      fieldAbility: 'burn_thorns',
      fieldDesc: 'Ignites brambles and dark vines.',
      cleanseThreshold: 0.45,
      lore: 'A playful fox spirit born of hearth embers. Its golden flame warms weary wanderers.'
    },
    sylphwing: {
      id: 'sylphwing',
      name: 'Sylphwing',
      title: 'Meadow Butterfly Spirit',
      element: 'nature',
      baseHp: 60,
      baseAtk: 13,
      baseDef: 14,
      baseSpd: 20,
      moves: ['scratch', 'gust', 'floral_pollen', 'leaf_blade'],
      fieldAbility: 'soothe',
      fieldDesc: 'Soothes wild spirits and blooms withered crops.',
      cleanseThreshold: 0.5,
      lore: 'A gentle woodland fairy spirit whose wings scatter revitalizing dawn pollen.'
    },
    bramblehorn: {
      id: 'bramblehorn',
      name: 'Bramblehorn',
      title: 'Sweeping-Horned Cattle',
      element: 'nature',
      baseHp: 85,
      baseAtk: 18,
      baseDef: 18,
      baseSpd: 10,
      moves: ['tackle', 'horn_charge', 'leaf_blade', 'mud_slap'],
      fieldAbility: 'strength',
      fieldDesc: 'Can shove heavy obstacles and boulders.',
      cleanseThreshold: 0.4,
      lore: 'The sacred cattle of Oakhaven. Their curved horns embody ancient pastoral vitality.'
    },
    mudtoad: {
      id: 'mudtoad',
      name: 'Goliath Mud-Toad',
      title: 'Swamp Sovereign Spirit',
      element: 'nature',
      baseHp: 110,
      baseAtk: 19,
      baseDef: 20,
      baseSpd: 9,
      moves: ['tackle', 'mud_slap', 'water_spout', 'bog_quake'],
      fieldAbility: 'mud_step',
      fieldDesc: 'Allows party to wade through toxic bogs.',
      cleanseThreshold: 0.35,
      lore: 'Guardian of the river springs. It carries Fragment 1 embedded in its mossy back.'
    },
    abyssalcrab: {
      id: 'abyssalcrab',
      name: 'Abyssal Crab',
      title: 'Titan Carapace Spirit',
      element: 'water',
      baseHp: 130,
      baseAtk: 22,
      baseDef: 24,
      baseSpd: 11,
      moves: ['vise_grip', 'water_spout', 'maelstrom_wave', 'tackle'],
      fieldAbility: 'water_step',
      fieldDesc: 'Partitions waters and crosses broken pier gaps.',
      cleanseThreshold: 0.32,
      lore: 'A colossal guardian of the coastal reef. It holds Fragment 2 within its shell.'
    },
    icewyvern: {
      id: 'icewyvern',
      name: 'Glacierwing',
      title: 'Ice-Wyvern Spirit',
      element: 'ice',
      baseHp: 150,
      baseAtk: 26,
      baseDef: 22,
      baseSpd: 19,
      moves: ['scratch', 'frost_fang', 'blizzard_gale', 'aegis_resonance'],
      fieldAbility: 'freeze_geyser',
      fieldDesc: 'Freezes molten lava and geysers into solid bridges.',
      cleanseThreshold: 0.3,
      lore: 'A mythic dragon sleeping upon the Whispering Peaks, keeper of Fragment 3.'
    },
    shadow_chimera: {
      id: 'shadow_chimera',
      name: 'Shadow Chimera',
      title: 'Primeval Demon of the Void',
      element: 'shadow',
      baseHp: 220,
      baseAtk: 32,
      baseDef: 25,
      baseSpd: 22,
      moves: ['shadow_claw', 'chaos_breath', 'cataclysm', 'vise_grip'],
      fieldAbility: 'void_breaker',
      fieldDesc: 'Dissolves all shadow boundaries.',
      cleanseThreshold: 0.25,
      lore: 'The primeval creature of chaos sealed inside the Aegis Crystal for centuries.'
    },
    torrentcrab: {
      id: 'torrentcrab',
      name: 'Torrent Crab',
      title: 'Reef Scuttler',
      element: 'water',
      baseHp: 70,
      baseAtk: 15,
      baseDef: 17,
      baseSpd: 12,
      moves: ['tackle', 'vise_grip', 'water_spout', 'scratch'],
      fieldAbility: 'water_step',
      fieldDesc: 'Crosses shallow waters.',
      cleanseThreshold: 0.5,
      lore: 'A feisty shoreline crab that rides sea foam.'
    },
    frostlynx: {
      id: 'frostlynx',
      name: 'Frost Lynx',
      title: 'Snow Prowler',
      element: 'ice',
      baseHp: 75,
      baseAtk: 19,
      baseDef: 13,
      baseSpd: 21,
      moves: ['scratch', 'frost_fang', 'tackle', 'blizzard_gale'],
      fieldAbility: 'ice_tread',
      fieldDesc: 'Traverses slippery ice safely.',
      cleanseThreshold: 0.45,
      lore: 'Silent feline hunter that blends into mountain blizzards.'
    },
    voidhound: {
      id: 'voidhound',
      name: 'Void Hound',
      title: 'Shadow Pack Stalker',
      element: 'shadow',
      baseHp: 80,
      baseAtk: 21,
      baseDef: 14,
      baseSpd: 23,
      moves: ['tackle', 'shadow_claw', 'scratch', 'chaos_breath'],
      fieldAbility: 'none',
      fieldDesc: 'None',
      cleanseThreshold: 0.4,
      lore: 'Hounds forged of pure miasma by Lord Malakor.'
    }
  },

  // --- ITEMS ---
  items: {
    aegis_salve: {
      id: 'aegis_salve',
      name: 'Aegis Salve',
      type: 'heal',
      value: 40,
      desc: 'Restores 40 HP to a companion spirit.'
    },
    aura_elixir: {
      id: 'aura_elixir',
      name: 'Aura Elixir',
      type: 'energy',
      value: 25,
      desc: 'Restores 25 Energy for moves.'
    },
    purifying_incense: {
      id: 'purifying_incense',
      name: 'Purifying Incense',
      type: 'cleanse_boost',
      value: 0.35,
      desc: 'Greatly increases the success of Aurelia’s Cleanse resonance.'
    }
  },

  // --- STORY CHAPTERS ---
  acts: [
    { id: 'prologue', name: 'Prologue: The Shattering', location: 'Castle Town & Sewers' },
    { id: 'act1', name: 'Act 1: The Pastoral Lands', location: 'Oakhaven Village' },
    { id: 'act2', name: 'Act 2: The Blockaded Coast', location: 'Rustport Harbor' },
    { id: 'act3', name: 'Act 3: The Frozen Truth', location: 'The Whispering Peaks' },
    { id: 'climax', name: 'The Climax: The Ruined Keep', location: 'The Wastelands' },
    { id: 'epilogue', name: 'Epilogue: A True Queen', location: 'Castle Town Restored' }
  ]
};

if (typeof window !== 'undefined') {
  window.DATA = DATA;
}
