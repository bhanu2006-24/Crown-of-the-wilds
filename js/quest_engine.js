/**
 * Crown of the Wilds - Quest & Party Engine
 * Tracks story acts, crystal fragment collection, party roster, inventory items,
 * and handles story cutscene triggers and field abilities.
 */

const QuestEngine = (function() {
  let state = {
    currentAct: 'prologue', // 'prologue', 'act1', 'act2', 'act3', 'climax', 'epilogue'
    fragments: 0,           // 0 to 4 (Core + 3 recovered fragments)
    party: [],              // Aura Spirit companions (Active party, max 6)
    reserve: [],            // Stored companions (Aegis Sanctuary Reserve)
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

    setFlag('has_companion', true);

    // If recruited in sewers, remove corrupted NPC on map
    const curMap = MapEngine.getCurrentMap();
    if (curMap && curMap.mapId === 'castle_sewers' && curMap.npcs) {
      curMap.npcs = curMap.npcs.filter(n => n.id !== 'corrupted_starter');
    }

    if (state.party.length < 6) {
      state.party.push(companion);
      saveGame();
      return { recruited: true, inReserve: false, name: companion.name };
    } else {
      if (!state.reserve) state.reserve = [];
      state.reserve.push(companion);
      saveGame();
      UI.showBanner(`${companion.name} sent to Aegis Sanctuary Reserve!`);
      return { recruited: true, inReserve: true, name: companion.name };
    }
  }

  function getParty() {
    return state.party;
  }

  function getReserve() {
    return state.reserve || [];
  }

  function depositToReserve(index) {
    if (state.party.length <= 1) {
      UI.showBanner('You must keep at least 1 companion in your active party!');
      return false;
    }
    if (index >= 0 && index < state.party.length) {
      if (!state.reserve) state.reserve = [];
      const companion = state.party.splice(index, 1)[0];
      state.reserve.push(companion);
      saveGame();
      UI.showBanner(`${companion.name} was sent to Sanctuary Reserve.`);
      return true;
    }
    return false;
  }

  function withdrawFromReserve(index) {
    if (state.party.length >= 6) {
      UI.showBanner('Active party full (Max 6)! Send a companion to Sanctuary first.');
      return false;
    }
    if (state.reserve && index >= 0 && index < state.reserve.length) {
      const companion = state.reserve.splice(index, 1)[0];
      state.party.push(companion);
      saveGame();
      UI.showBanner(`${companion.name} joined your active party!`);
      return true;
    }
    return false;
  }

  function releaseCompanion(index, fromReserve = false) {
    if (!fromReserve && state.party.length <= 1) {
      UI.showBanner('You cannot release your only companion!');
      return false;
    }
    let released = null;
    if (fromReserve) {
      if (state.reserve && index >= 0 && index < state.reserve.length) {
        released = state.reserve.splice(index, 1)[0];
      }
    } else {
      if (index >= 0 && index < state.party.length) {
        released = state.party.splice(index, 1)[0];
      }
    }
    if (released) {
      saveGame();
      UI.showBanner(`${released.name} was lovingly released back to the Wilds.`);
      return true;
    }
    return false;
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
    return state.party.some(c => c.fieldAbility === 'water_step' || c.fieldAbility === 'mud_step' || c.element === 'water');
  }

  function hasBurnThorns() {
    return state.party.some(c => c.fieldAbility === 'burn_thorns' || c.element === 'fire');
  }

  function hasFreezeGeyser() {
    return state.party.some(c => c.fieldAbility === 'freeze_geyser' || c.element === 'ice');
  }

  function collectFragment(fragmentNumber) {
    state.fragments = Math.max(state.fragments, fragmentNumber);
    setFlag(`fragment_${fragmentNumber}_collected`, true);

    if (fragmentNumber === 1) state.currentAct = 'act2';
    else if (fragmentNumber === 2) state.currentAct = 'act3';
    else if (fragmentNumber === 3) state.currentAct = 'climax';
    else if (fragmentNumber === 4) state.currentAct = 'epilogue';

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
    if (state.fragments === 3 || state.currentAct === 'climax') {
      return 'Confront Lord Malakor at the Ruined Keep and cleanse the Shadow Chimera!';
    }
    return 'Rejoice! The Aegis Crystal is restored. Attend Queen Aurelia’s Coronation in the Sanctum!';
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
    } else if (trigger.type === 'climax_battle' || trigger.id === 'final_boss_trigger') {
      if (hasFlag('chimera_cleansed')) return;
      DialogueEngine.showCutscene([
        {
          speaker: 'Lord Malakor',
          text: 'You are too late, Aurelia! With the void altars ignited, I summon the Primordial Shadow Chimera! Devour her light!'
        },
        {
          speaker: 'Princess Aurelia',
          text: 'The four crystal fragments resonate within my Aegis Core! We will cleanse the darkness and free the Wilds!'
        }
      ], () => {
        BattleEngine.startBattle({
          spiritId: 'shadow_chimera',
          isCorrupted: true,
          isBoss: true,
          fragmentReward: 4
        });
      });
    }
  }

  function triggerEpilogueCutscene() {
    setFlag('chimera_cleansed', true);
    collectFragment(4);
    state.currentAct = 'epilogue';

    DialogueEngine.showCutscene([
      {
        speaker: 'Narrator',
        text: 'A blinding explosion of crystalline radiance erupts from Aurelia’s Aegis Core! The dark miasma shatters into golden motes of dawn light.'
      },
      {
        speaker: 'Lord Malakor',
        text: 'Impossible... The shadow... dissolved?! My plans... ruined!'
      },
      {
        speaker: 'Princess Aurelia',
        text: 'The four fragments are reunited! Let the sacred Aegis Crystal shine over a restored kingdom!'
      },
      {
        speaker: 'Narrator',
        text: 'With a triumphant chiming of ancient royal bells, the four crystal fragments fuse into a radiant beacon. A golden wave of peace purifies the entire realm!'
      }
    ], () => {
      UI.fadeOut(() => {
        MapEngine.loadMap('castle_restored', 12, 14).then(() => {
          UI.fadeIn();
          UI.showBanner('THE CORONATION OF QUEEN AURELIA — THE REALM IS RESTORED!');
          UI.showLocationBanner('Castle Town Restored - The Coronation');
          if (window.SoundEngine) {
            SoundEngine.playBGM('epilogue');
          }
        });
      });
    });
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
        if (!state.reserve) state.reserve = [];
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
      reserve: [],
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
    getReserve,
    addCompanion,
    depositToReserve,
    withdrawFromReserve,
    releaseCompanion,
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
    triggerEpilogueCutscene,
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
