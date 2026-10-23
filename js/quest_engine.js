/**
 * Crown of the Wilds - Quest & Party Engine
 * Tracks story acts, crystal fragment collection, party roster, inventory items,
 * and handles story cutscene triggers and field abilities.
 */

const QuestEngine = (function() {
  let state = {
    currentAct: 'prologue', // 'prologue', 'act1', 'act2', 'act3', 'climax', 'epilogue'
    fragments: 0,           // 0 to 4 (Core + 3 recovered fragments)
    party: [],              // Aura Spirit companions
    inventory: [
      { id: 'aegis_salve', count: 3 },
      { id: 'aura_elixir', count: 2 },
      { id: 'purifying_incense', count: 2 }
    ],
    flags: {},
    incenseActive: false
  };

  function init() {
    loadGame();
  }

  // --- COMPANION PARTY MANAGEMENT ---
  function addCompanion(spiritData) {
    if (state.party.length >= 6) {
      UI.showBanner('Companion party full (Max 6)!');
      return false;
    }

    const companion = {
      id: spiritData.id,
      name: spiritData.name,
      title: spiritData.title,
      element: spiritData.element,
      level: spiritData.level || 5,
      hp: spiritData.maxHp || spiritData.baseHp,
      maxHp: spiritData.maxHp || spiritData.baseHp,
      energy: 50,
      maxEnergy: 50,
      baseAtk: spiritData.baseAtk || 15,
      baseDef: spiritData.baseDef || 12,
      baseSpd: spiritData.baseSpd || 14,
      moves: spiritData.moves ? [...spiritData.moves] : ['tackle', 'ember_breath'],
      fieldAbility: spiritData.fieldAbility || 'none',
      exp: 0,
      expToLevel: 100
    };

    state.party.push(companion);
    setFlag('has_companion', true);

    // If recruited in sewers, remove corrupted NPC on map
    const curMap = MapEngine.getCurrentMap();
    if (curMap && curMap.mapId === 'castle_sewers' && curMap.npcs) {
      curMap.npcs = curMap.npcs.filter(n => n.id !== 'corrupted_starter');
    }

    saveGame();
    return true;
  }

  function getParty() {
    return state.party;
  }

  function getActiveCompanion() {
    return state.party.length > 0 ? state.party[0] : null;
  }

  function switchActiveCompanion(index) {
    if (index >= 0 && index < state.party.length) {
      const chosen = state.party.splice(index, 1)[0];
      state.party.unshift(chosen);
      saveGame();
      return true;
    }
    return false;
  }

  function healParty() {
    state.party.forEach(c => {
      c.hp = c.maxHp;
      c.energy = c.maxEnergy;
    });
    saveGame();
  }

  function awardExp(amount) {
    state.party.forEach(c => {
      c.exp += amount;
      if (c.exp >= c.expToLevel) {
        c.exp -= c.expToLevel;
        c.level++;
        c.maxHp += 10;
        c.hp = c.maxHp;
        c.baseAtk += 2;
        c.baseDef += 2;
        c.expToLevel = Math.floor(c.expToLevel * 1.3);
        UI.showBanner(`${c.name} grew to Level ${c.level}!`);
        SoundEngine.playSFX('level_up');
      }
    });
    saveGame();
  }

  // --- FIELD ABILITIES ---
  function hasWaterCrossing() {
    return state.party.some(c => c.fieldAbility === 'water_step' || c.element === 'water');
  }

  function hasBurnThorns() {
    return state.party.some(c => c.fieldAbility === 'burn_thorns' || c.element === 'fire');
  }

  function hasFreezeGeyser() {
    return state.party.some(c => c.fieldAbility === 'freeze_geyser' || c.element === 'ice');
  }

  // --- STORY PROGRESSION & FRAGMENTS ---
  function collectFragment(fragmentNumber) {
    state.fragments = Math.max(state.fragments, fragmentNumber);
    setFlag(`fragment_${fragmentNumber}_collected`, true);

    if (fragmentNumber === 1) state.currentAct = 'act2';
    else if (fragmentNumber === 2) state.currentAct = 'act3';
    else if (fragmentNumber === 3) state.currentAct = 'climax';

    saveGame();
  }

  function setFlag(flag, val = true) {
    state.flags[flag] = val;
  }

  function hasFlag(flag) {
    return !!state.flags[flag];
  }

  // Current objective string for UI
  function getCurrentObjective() {
    if (!hasFlag('shattering_complete')) {
      return 'Enter the Aegis Sanctum at the top of Castle Town to meet Lord Malakor.';
    }
    if (!hasFlag('has_companion')) {
      return 'Escape through the secret sewer grate in the southwest corner of Castle Town.';
    }
    if (state.currentAct === 'prologue') {
      return 'Follow the outflow pipe to escape into the pastoral lands of Oakhaven!';
    }
    if (state.fragments === 0) {
      return 'Find the corrupted Mud-Toad at Oakhaven River Weir to recover Fragment 1.';
    }
    if (state.fragments === 1) {
      return 'Solve the Rustport dock crate puzzle and cleanse the Abyssal Crab for Fragment 2.';
    }
    if (state.fragments === 2) {
      return 'Slide across the ice paths of Whispering Peaks and cleanse Glacierwing for Fragment 3.';
    }
    return 'Confront Lord Malakor at the Ruined Keep and cleanse the Shadow Chimera!';
  }

  // --- STORY TRIGGER HANDLER ---
  function handleTrigger(trigger) {
    if (trigger.id) {
      setFlag(trigger.id + '_done', true);
    }

    if (trigger.event === 'shattering_cutscene' || trigger.id === 'sanctum_cutscene') {
      setFlag('sanctum_cutscene_done', true);

      // Lord Malakor shatters the Aegis Crystal in the Sanctum!
      DialogueEngine.showCutscene([
        {
          speaker: 'Lord Malakor',
          text: 'At last! The hour of reckoning has arrived! For centuries, your ancestors bound the true power of the Wilds inside this crystal.'
        },
        {
          speaker: 'Princess Aurelia',
          text: 'Malakor, stand down! That sacred seal protects the realm and keeps the Aura Spirits in peaceful harmony!'
        },
        {
          speaker: 'Lord Malakor',
          text: 'Peace?! It is a cage of false tranquility! Behold the shattering!',
          action: () => {
            SoundEngine.playSFX('shatter');
          }
        },
        {
          speaker: 'Narrator',
          text: 'With a deafening crash, Malakor drives a dark obsidian dagger into the Aegis Crystal! Blinding purple lightning cracks across the altar, shattering the relic into four pieces!'
        },
        {
          speaker: 'Princess Aurelia',
          text: 'The Aegis Crystal... shattered! But the core fragment... its radiant warmth answers my call!'
        },
        {
          speaker: 'Lord Malakor',
          text: 'Seize the princess! I shall take the master shards across the realm. The wild spirits are mine to corrupt!',
          action: () => {
            setFlag('shattering_complete', true);

            // Visually shatter crystal on map
            const curMap = MapEngine.getCurrentMap();
            if (curMap && curMap.mapId === 'castle_town') {
              // Replace crystal tiles with shattered altar
              curMap.tileData[2][10] = 8;
              curMap.tileData[2][11] = 8;
              curMap.tileData[2][12] = 8;
              curMap.tileData[2][13] = 8;
              curMap.tileData[3][10] = 8;
              curMap.tileData[3][11] = 8;
              curMap.tileData[3][12] = 8;
              curMap.tileData[3][13] = 8;

              // Disguise Aurelia in traveler cloak
              MapEngine.getPlayer().costume = 'traveler';

              // Update NPC dialogs
              const scholar = curMap.npcs.find(n => n.id === 'scholar_alistair');
              if (scholar) {
                scholar.dialogue = 'Aurelia! The secret sewer grate in the bottom-left corner is your escape route! Use the Core Fragment to purify the corrupted spirits!';
              }
              const guard = curMap.npcs.find(n => n.id === 'guard_left');
              if (guard) {
                guard.dialogue = 'Halt the princess! Lord Malakor has seized command of the castle!';
              }
              // Malakor vanishes to waste
              curMap.npcs = curMap.npcs.filter(n => n.id !== 'lord_malakor');
            }

            UI.showBanner('Crystal shattered! Escape through the sewer grate in the bottom-left corner!');
          }
        }
      ]);
    } else if (trigger.type === 'battle') {
      BattleEngine.startBattle({
        spiritId: trigger.spiritId,
        isCorrupted: trigger.isCorrupted,
        isBoss: trigger.isBoss,
        isTutorial: trigger.isTutorial,
        fragmentReward: trigger.fragmentReward
      });
    }
  }

  // --- INVENTORY ---
  function useItem(itemId, targetCompanionIndex = 0) {
    const item = state.inventory.find(i => i.id === itemId && i.count > 0);
    if (!item) return false;

    const companion = state.party[targetCompanionIndex] || state.party[0];
    if (itemId === 'aegis_salve') {
      if (companion) {
        companion.hp = Math.min(companion.maxHp, companion.hp + 40);
        item.count--;
        SoundEngine.playSFX('cleanse');
        UI.showBanner(`${companion.name} healed 40 HP!`);
        return true;
      }
    } else if (itemId === 'aura_elixir') {
      if (companion) {
        companion.energy = Math.min(companion.maxEnergy, companion.energy + 25);
        item.count--;
        SoundEngine.playSFX('cleanse');
        UI.showBanner(`${companion.name} restored 25 Energy!`);
        return true;
      }
    } else if (itemId === 'purifying_incense') {
      state.incenseActive = true;
      item.count--;
      SoundEngine.playSFX('cleanse');
      UI.showBanner('Purifying Incense lit! Aegis Cleanse resonance rate boosted!');
      return true;
    }
    return false;
  }

  function getInventory() {
    return state.inventory;
  }

  // --- SAVE / LOAD ---
  function saveGame() {
    try {
      localStorage.setItem('crown_of_wilds_save', JSON.stringify(state));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  }

  function loadGame() {
    try {
      const saved = localStorage.getItem('crown_of_wilds_save');
      if (saved) {
        state = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load save', e);
    }
  }

  function resetGame() {
    localStorage.removeItem('crown_of_wilds_save');
    state = {
      currentAct: 'prologue',
      fragments: 0,
      party: [],
      inventory: [
        { id: 'aegis_salve', count: 3 },
        { id: 'aura_elixir', count: 2 },
        { id: 'purifying_incense', count: 2 }
      ],
      flags: {},
      incenseActive: false
    };
  }

  return {
    init,
    getParty,
    addCompanion,
    getActiveCompanion,
    switchActiveCompanion,
    healParty,
    awardExp,
    hasWaterCrossing,
    hasBurnThorns,
    hasFreezeGeyser,
    collectFragment,
    getFragments: () => state.fragments,
    getCurrentAct: () => state.currentAct,
    getCurrentObjective,
    setAct: (act) => { state.currentAct = act; },
    setFlag,
    hasFlag,
    handleTrigger,
    getInventory,
    useItem,
    getIncenseActive: () => state.incenseActive,
    saveGame,
    loadGame,
    resetGame
  };
})();

if (typeof window !== 'undefined') {
  window.QuestEngine = QuestEngine;
}
