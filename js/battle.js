/**
 * Crown of the Wilds - Turn-Based Battle Engine
 * Handles Pokémon-style spirit combat, corruption gauges, Aurelia's Cleanse resonance,
 * companion catching/recruiting, skill animations, floating damage numbers, and experience.
 */

const BattleEngine = (function() {
  let active = false;
  let battleState = 'ACTION_SELECT'; // 'ACTION_SELECT', 'MOVE_SELECT', 'BAG_SELECT', 'PARTY_SELECT', 'ANIMATING', 'VICTORY', 'DEFEAT'
  let enemy = null;
  let playerSpirit = null;
  let isBossBattle = false;
  let isTutorial = false;
  let fragmentReward = null;

  let menuIndex = 0;
  let moveIndex = 0;
  let messageQueue = [];
  let currentMessage = '';
  let shakeOffset = { x: 0, y: 0 };
  let floatingNumbers = [];
  let animations = []; // visual effects currently playing

  // Action Menu Items
  const ACTIONS = ['FIGHT', 'CLEANSE', 'PARTY', 'BAG', 'RUN'];

  function startBattle(options) {
    active = true;
    battleState = 'ACTION_SELECT';
    menuIndex = 0;
    moveIndex = 0;
    messageQueue = [];
    floatingNumbers = [];
    animations = [];

    isBossBattle = !!options.isBoss;
    isTutorial = !!options.isTutorial;
    fragmentReward = options.fragmentReward || null;

    // Load enemy spirit data
    const spiritData = DATA.spirits[options.spiritId] || DATA.spirits.pyropaw;
    enemy = {
      ...spiritData,
      isCorrupted: options.isCorrupted !== false,
      maxHp: spiritData.baseHp + (options.levelBonus || 0) * 8,
      hp: spiritData.baseHp + (options.levelBonus || 0) * 8,
      level: options.level || (isBossBattle ? 12 : 5),
      energy: 50,
      maxEnergy: 50
    };

    // Load player's active companion
    const party = QuestEngine.getParty();
    if (party.length === 0) {
      // If tutorial before starter is recruited, Aurelia uses royal protective ward
      playerSpirit = {
        name: 'Princess Aurelia',
        element: 'aegis',
        hp: 100,
        maxHp: 100,
        energy: 100,
        maxEnergy: 100,
        moves: ['aegis_resonance'],
        baseAtk: 18,
        baseDef: 18,
        level: 5
      };
    } else {
      playerSpirit = QuestEngine.getActiveCompanion();
    }

    // Play battle BGM
    if (window.SoundEngine) {
      SoundEngine.playBGM(isBossBattle ? 'boss' : 'battle');
    }

    if (enemy.isCorrupted) {
      queueMessage(`A wild Corrupted ${enemy.name} appeared!`);
      queueMessage(`Its aura is writhing with Lord Malakor's dark energy!`);
    } else {
      queueMessage(`A peaceful wild ${enemy.name} stepped forward!`);
    }
  }

  function queueMessage(text, callback = null) {
    messageQueue.push({ text, callback });
    if (!currentMessage && messageQueue.length > 0) {
      advanceMessage();
    }
  }

  function advanceMessage() {
    if (messageQueue.length > 0) {
      const item = messageQueue.shift();
      currentMessage = item.text;
      SoundEngine.playSFX('text');
      if (item.callback) item.callback();
    } else {
      currentMessage = '';
      if (battleState === 'ANIMATING') {
        battleState = 'ACTION_SELECT';
      }
    }
  }

  // --- FLOATING TEXT & FX ---
  function spawnDamageNumber(val, x, y, color = '#ff4d4d') {
    floatingNumbers.push({
      text: val.toString(),
      x,
      y,
      color,
      alpha: 1.0,
      life: 40
    });
  }

  function triggerShake(magnitude = 8) {
    shakeOffset.x = (Math.random() - 0.5) * magnitude * 2;
    shakeOffset.y = (Math.random() - 0.5) * magnitude * 2;
    setTimeout(() => {
      shakeOffset.x = 0;
      shakeOffset.y = 0;
    }, 120);
  }

  // --- COMBAT ACTIONS ---

  function executePlayerMove(moveKey) {
    const move = DATA.moves[moveKey];
    if (!move) return;

    battleState = 'ANIMATING';
    queueMessage(`${playerSpirit.name} used ${move.name}!`);

    // Energy check
    if (playerSpirit.energy < move.cost) {
      queueMessage(`Not enough Aura energy to channel this move!`);
      return;
    }
    playerSpirit.energy = Math.max(0, playerSpirit.energy - move.cost);

    // Damage calculation
    let power = move.power;
    // Type advantage check
    const elemData = DATA.elements[move.element];
    if (elemData && elemData.strongAgainst.includes(enemy.element)) {
      power = Math.floor(power * 1.5);
    }

    const damage = Math.max(5, Math.floor(power + (playerSpirit.baseAtk || 15) * 0.8 - enemy.baseDef * 0.4));

    // Play attack FX
    SoundEngine.playSFX(move.sfx || 'hit');
    triggerShake(6);

    setTimeout(() => {
      enemy.hp = Math.max(0, enemy.hp - damage);
      spawnDamageNumber(damage, 340, 110, '#ffffff');

      if (enemy.hp <= 0) {
        if (enemy.isCorrupted) {
          queueMessage(`The corrupted spirit was overwhelmed by pure force!`);
          if (isBossBattle && fragmentReward) {
            QuestEngine.collectFragment(fragmentReward);
            queueMessage(`Recovered Aegis Crystal Fragment #${fragmentReward}!`);
          }
          onBattleWin(false); // Defeated without cleansing
        } else {
          queueMessage(`The opposing spirit fainted!`);
          onBattleWin(false);
        }
      } else {
        // Enemy retaliates
        setTimeout(executeEnemyTurn, 800);
      }
    }, 500);
  }

  /**
   * Aurelia's Signature Ability: Aegis Crystal Cleanse
   */
  function executeCleanse() {
    if (!enemy.isCorrupted) {
      queueMessage(`This spirit is already pure and peaceful!`);
      return;
    }

    battleState = 'ANIMATING';
    queueMessage(`Aurelia raises the Aegis Crystal Fragment!`);
    queueMessage(`"By the ancient harmony of the Wilds, be cleansed!"`);

    // Cleanse calculation: HP % remaining inverted + incense bonus
    const hpRatio = enemy.hp / enemy.maxHp;
    const incenseBonus = QuestEngine.getIncenseActive() ? 0.35 : 0;
    const baseChance = (1 - hpRatio) * 1.2 + incenseBonus;

    // Guaranteed in tutorial sewer fight
    const success = isTutorial || Math.random() < baseChance || hpRatio <= (enemy.cleanseThreshold || 0.4);

    SoundEngine.playSFX('cleanse');
    triggerShake(3);

    // Visual beam animation
    animations.push({
      type: 'cleanse_beam',
      x: 340,
      y: 120,
      radius: 40,
      timer: 50
    });

    setTimeout(() => {
      if (success) {
        enemy.isCorrupted = false;
        queueMessage(`The dark miasma dissolves into sparkling golden light!`);
        SoundEngine.playSFX('cleanse');
        queueMessage(`${enemy.name} has been purified and restored!`);

        // Recruit into party or reserve!
        const result = QuestEngine.addCompanion(enemy);
        if (result && result.inReserve) {
          queueMessage(`${enemy.name} was purified and sent to Aegis Sanctuary Reserve!`);
        } else if (result) {
          queueMessage(`${enemy.name} has joined your companion party!`);
        }

        if (isBossBattle && fragmentReward) {
          QuestEngine.collectFragment(fragmentReward);
          queueMessage(`Recovered Aegis Crystal Fragment #${fragmentReward}!`);
        }

        onBattleWin(true);
      } else {
        queueMessage(`The shadow corruption resists the purifying light!`);
        queueMessage(`Weaken the spirit further before channeling the Aegis!`);
        setTimeout(executeEnemyTurn, 800);
      }
    }, 1200);
  }

  function executeEnemyTurn() {
    if (enemy.hp <= 0) return;

    // Pick random enemy move
    const moveKey = enemy.moves[Math.floor(Math.random() * enemy.moves.length)] || 'tackle';
    const move = DATA.moves[moveKey] || DATA.moves.tackle;

    queueMessage(`Corrupted ${enemy.name} retaliates with ${move.name}!`);

    setTimeout(() => {
      SoundEngine.playSFX(move.sfx || 'hit');
      triggerShake(7);

      const damage = Math.max(4, Math.floor(move.power * 0.8 + enemy.baseAtk * 0.6 - (playerSpirit.baseDef || 12) * 0.3));
      playerSpirit.hp = Math.max(0, playerSpirit.hp - damage);
      spawnDamageNumber(damage, 140, 230, '#ff4d4d');

      if (playerSpirit.hp <= 0) {
        queueMessage(`${playerSpirit.name} fainted!`);
        // Check if other companions exist
        const living = QuestEngine.getParty().find(c => c.hp > 0);
        if (living) {
          queueMessage(`Switching to ${living.name}!`);
          playerSpirit = living;
          battleState = 'ACTION_SELECT';
        } else {
          onBattleLose();
        }
      } else {
        battleState = 'ACTION_SELECT';
      }
    }, 600);
  }

  function onBattleWin(wasCleansed = false) {
    battleState = 'VICTORY';
    SoundEngine.playSFX('level_up');

    // Experience award
    const xpGain = isBossBattle ? 250 : 60;
    queueMessage(`Your party gained ${xpGain} Aura Experience!`, () => {
      QuestEngine.awardExp(xpGain);
    });

    if (enemy && (enemy.id === 'shadow_chimera' || (isBossBattle && fragmentReward === 4))) {
      queueMessage(`The Primordial Shadow dissolves into radiant starlight!`, () => {
        endBattle();
        QuestEngine.triggerEpilogueCutscene();
      });
      return;
    }

    queueMessage(`Victory!`, () => {
      endBattle();
    });
  }

  function onBattleLose() {
    battleState = 'DEFEAT';
    queueMessage(`Aurelia's companions were overwhelmed...`);
    queueMessage(`The ancient Aegis Core warps you back safely to the sanctuary.`);
    setTimeout(() => {
      QuestEngine.healParty();
      endBattle();
    }, 2000);
  }

  function endBattle() {
    active = false;
    currentMessage = '';
    messageQueue = [];

    // Return to map theme BGM
    const map = MapEngine.getCurrentMap();
    if (map && window.SoundEngine) {
      if (map.theme === 'castle') SoundEngine.playBGM('castle');
      else if (map.theme === 'sewers') SoundEngine.playBGM('sewer');
      else if (map.theme === 'pastoral') SoundEngine.playBGM('pastoral');
      else if (map.theme === 'coastal') SoundEngine.playBGM('port');
      else if (map.theme === 'snow') SoundEngine.playBGM('snow');
      else if (map.theme === 'wasteland') SoundEngine.playBGM('boss');
      else if (map.theme === 'castle_restored') SoundEngine.playBGM('epilogue');
    }
  }

  // --- INPUT HANDLING ---
  function handleInput(key) {
    if (!active) return;

    // Advance message
    if (currentMessage) {
      if (key === 'Enter' || key === ' ' || key === 'z' || key === 'Z') {
        advanceMessage();
      }
      return;
    }

    if (battleState === 'ACTION_SELECT') {
      if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        menuIndex = (menuIndex + 1) % ACTIONS.length;
        SoundEngine.playSFX('select');
      } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        menuIndex = (menuIndex - 1 + ACTIONS.length) % ACTIONS.length;
        SoundEngine.playSFX('select');
      } else if (key === 'Enter' || key === ' ' || key === 'z' || key === 'Z') {
        SoundEngine.playSFX('select');
        const chosen = ACTIONS[menuIndex];
        if (chosen === 'FIGHT') {
          battleState = 'MOVE_SELECT';
          moveIndex = 0;
        } else if (chosen === 'CLEANSE') {
          executeCleanse();
        } else if (chosen === 'PARTY') {
          UI.openPartyModal();
        } else if (chosen === 'BAG') {
          UI.openBagModal();
        } else if (chosen === 'RUN') {
          if (isBossBattle) {
            queueMessage(`You cannot flee from this crucial battle!`);
          } else {
            queueMessage(`Safely escaped back to the path.`);
            setTimeout(endBattle, 700);
          }
        }
      }
    } else if (battleState === 'MOVE_SELECT') {
      const moves = playerSpirit.moves || ['tackle'];
      if (key === 'ArrowDown' || key === 's' || key === 'S' || key === 'ArrowRight') {
        moveIndex = (moveIndex + 1) % moves.length;
        SoundEngine.playSFX('select');
      } else if (key === 'ArrowUp' || key === 'w' || key === 'W' || key === 'ArrowLeft') {
        moveIndex = (moveIndex - 1 + moves.length) % moves.length;
        SoundEngine.playSFX('select');
      } else if (key === 'Escape' || key === 'x' || key === 'X') {
        battleState = 'ACTION_SELECT';
        SoundEngine.playSFX('select');
      } else if (key === 'Enter' || key === ' ' || key === 'z' || key === 'Z') {
        executePlayerMove(moves[moveIndex]);
      }
    }
  }

  // --- RENDERING ---
  function render(ctx, width = 640, height = 360) {
    if (!active) return;

    ctx.save();
    ctx.translate(shakeOffset.x, shakeOffset.y);

    // 1. Battle Backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    if (isBossBattle) {
      grad.addColorStop(0, '#2d1138');
      grad.addColorStop(0.6, '#4d1c61');
      grad.addColorStop(1, '#1b0a21');
    } else {
      grad.addColorStop(0, '#2c4b75');
      grad.addColorStop(0.6, '#4973a8');
      grad.addColorStop(1, '#2d4d2d');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Battle platforms
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    // Enemy platform
    ctx.beginPath();
    ctx.ellipse(460, 140, 95, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    // Player platform
    ctx.beginPath();
    ctx.ellipse(170, 255, 100, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Render Enemy Spirit (Front view)
    if (enemy) {
      const enemySprite = SpriteGenerator.getSpiritBattle(enemy.id, enemy.isCorrupted, false);
      ctx.drawImage(enemySprite, 460 - 36, 140 - 60);

      // Enemy Status Card
      ctx.fillStyle = 'rgba(18, 22, 34, 0.88)';
      ctx.fillRect(360, 20, 250, 52);
      ctx.strokeStyle = enemy.isCorrupted ? '#a855f7' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(360, 20, 250, 52);

      // Name & Level
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText(`${enemy.name} Lv.${enemy.level}`, 372, 38);

      // HP Bar
      const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
      ctx.fillStyle = '#333333';
      ctx.fillRect(372, 46, 160, 8);
      ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : (hpRatio > 0.2 ? '#f59e0b' : '#ef4444');
      ctx.fillRect(372, 46, Math.floor(160 * hpRatio), 8);

      // Corruption badge or HP text
      if (enemy.isCorrupted) {
        ctx.fillStyle = '#d8b4fe';
        ctx.font = '9px "Courier New", monospace';
        ctx.fillText(`CORRUPTED`, 542, 53);
      }
    }

    // 3. Render Player Spirit (Back view)
    if (playerSpirit) {
      const playerSprite = SpriteGenerator.getSpiritBattle(playerSpirit.id || 'pyropaw', false, true);
      ctx.drawImage(playerSprite, 170 - 36, 255 - 64);

      // Player Status Card
      ctx.fillStyle = 'rgba(18, 22, 34, 0.88)';
      ctx.fillRect(30, 145, 220, 55);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 145, 220, 55);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText(`${playerSpirit.name} Lv.${playerSpirit.level || 5}`, 42, 163);

      // HP Bar
      const pHpRatio = Math.max(0, playerSpirit.hp / playerSpirit.maxHp);
      ctx.fillStyle = '#333333';
      ctx.fillRect(42, 171, 130, 8);
      ctx.fillStyle = pHpRatio > 0.5 ? '#22c55e' : (pHpRatio > 0.2 ? '#f59e0b' : '#ef4444');
      ctx.fillRect(42, 171, Math.floor(130 * pHpRatio), 8);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px "Courier New", monospace';
      ctx.fillText(`${playerSpirit.hp}/${playerSpirit.maxHp}`, 178, 179);

      // Aura Energy Bar
      const pEnergyRatio = Math.max(0, playerSpirit.energy / playerSpirit.maxEnergy);
      ctx.fillStyle = '#333333';
      ctx.fillRect(42, 184, 130, 5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(42, 184, Math.floor(130 * pEnergyRatio), 5);
    }

    // 4. Render Active Animations (e.g. Cleanse Beam)
    animations.forEach((anim, idx) => {
      if (anim.type === 'cleanse_beam') {
        ctx.save();
        ctx.strokeStyle = 'rgba(126, 248, 255, 0.85)';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(170, 220);
        ctx.lineTo(anim.x, anim.y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(anim.x, anim.y, anim.radius * (anim.timer / 50), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        anim.timer--;
        if (anim.timer <= 0) animations.splice(idx, 1);
      }
    });

    // 5. Render Floating Damage Numbers
    floatingNumbers.forEach((f, idx) => {
      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle = f.color;
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();

      f.y -= 0.8;
      f.life--;
      f.alpha = f.life / 40;
      if (f.life <= 0) floatingNumbers.splice(idx, 1);
    });

    // 6. Bottom Dialogue & Command Tray
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(0, 268, width, 92);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 268, width - 4, 90);

    if (currentMessage) {
      // Display Message text
      ctx.fillStyle = '#f8fafc';
      ctx.font = '14px "Courier New", monospace';
      ctx.fillText(currentMessage, 30, 310);

      ctx.fillStyle = '#facc15';
      ctx.font = '11px "Courier New", monospace';
      ctx.fillText('Press [Space] / [Enter] or Click to continue', 30, 340);
    } else if (battleState === 'ACTION_SELECT') {
      // Display Action Menu
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Courier New", monospace';
      ctx.fillText(`What will Aurelia & ${playerSpirit.name} do?`, 30, 290);

      ACTIONS.forEach((act, idx) => {
        const x = 30 + idx * 118;
        const y = 325;
        const isSelected = (idx === menuIndex);

        if (isSelected) {
          ctx.fillStyle = act === 'CLEANSE' ? '#a855f7' : '#38bdf8';
          ctx.fillRect(x - 6, y - 16, 96, 24);
          ctx.fillStyle = '#0f172a';
        } else {
          ctx.fillStyle = act === 'CLEANSE' ? '#c084fc' : '#e2e8f0';
        }

        ctx.font = 'bold 13px "Courier New", monospace';
        ctx.fillText(act, x + 6, y);
      });
    } else if (battleState === 'MOVE_SELECT') {
      // Display Moves
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Courier New", monospace';
      ctx.fillText(`Select Move (Esc to cancel):`, 30, 290);

      const moves = playerSpirit.moves || ['tackle'];
      moves.forEach((moveKey, idx) => {
        const move = DATA.moves[moveKey] || { name: moveKey, element: 'nature', power: 30, cost: 0 };
        const x = 30 + (idx % 2) * 280;
        const y = 315 + Math.floor(idx / 2) * 24;
        const isSelected = (idx === moveIndex);

        if (isSelected) {
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`> ${move.name} (${move.element.toUpperCase()}) [${move.cost} EP]`, x, y);
        } else {
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`  ${move.name} (${move.element.toUpperCase()}) [${move.cost} EP]`, x, y);
        }
      });
    }

    ctx.restore();
  }

  return {
    startBattle,
    handleInput,
    render,
    isActive: () => active,
    executeCleanse
  };
})();

if (typeof window !== 'undefined') {
  window.BattleEngine = BattleEngine;
}
