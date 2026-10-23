/**
 * Crown of the Wilds - Main Game Orchestrator
 * Fullscreen widescreen game loop (640x360), canvas mouse/touch input,
 * in-game pause menu, and state management.
 */

const Game = (function() {
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 360;

  let canvas = null;
  let ctx = null;
  let lastTime = 0;
  let gameState = 'TITLE'; // 'TITLE', 'OVERWORLD', 'BATTLE', 'CUTSCENE'
  let isMenuOpen = false;

  let titleSelectedOption = 0;
  const TITLE_OPTIONS = ['START GAME', 'CONTINUE', 'CODEX & LORE', 'CONTROLS'];

  const keys = {};

  async function init() {
    canvas = document.getElementById('game-canvas');
    if (!canvas) {
      console.error('Canvas #game-canvas not found!');
      return;
    }
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Initialize generators and engines
    TileGenerator.init();
    SpriteGenerator.init();
    QuestEngine.init();

    // Register input listeners
    setupKeyboardListeners();
    setupCanvasClickListeners();
    setupHudButtonListeners();
    setupTouchControls();

    // Start requestAnimationFrame loop
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);

    // Initial audio setup on first interaction
    const clickToStartSound = () => {
      SoundEngine.init();
      if (gameState === 'TITLE') {
        SoundEngine.playBGM('castle');
      }
      window.removeEventListener('click', clickToStartSound);
      window.removeEventListener('keydown', clickToStartSound);
    };
    window.addEventListener('click', clickToStartSound);
    window.addEventListener('keydown', clickToStartSound);
  }

  // --- FULLSCREEN API ---
  function toggleFullscreen() {
    const container = document.getElementById('game-container') || document.documentElement;
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // --- IN-GAME PAUSE MENU ---
  function toggleMenu() {
    if (gameState !== 'OVERWORLD') return;
    isMenuOpen = !isMenuOpen;
    const overlay = document.getElementById('pause-menu-overlay');
    if (overlay) {
      if (isMenuOpen) {
        UI.updatePauseMenu();
        overlay.classList.add('visible');
        SoundEngine.playSFX('select');
      } else {
        overlay.classList.remove('visible');
        SoundEngine.playSFX('select');
      }
    }
  }

  function saveProgress() {
    QuestEngine.saveGame();
    SoundEngine.playSFX('cleanse');
    UI.showBanner('Progress saved successfully!');
    toggleMenu();
  }

  // --- INPUT LISTENERS ---
  function setupHudButtonListeners() {
    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        SoundEngine.toggleMute();
        UI.updateSoundUI();
      });
    }

    const menuBtn = document.getElementById('btn-ingame-menu');
    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
  }

  function setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      keys[e.key] = true;

      // Fullscreen shortcut (F or F11)
      if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey) {
          toggleFullscreen();
          return;
        }
      }

      // Audio mute shortcut (M)
      if (e.key === 'm' || e.key === 'M') {
        SoundEngine.toggleMute();
        UI.updateSoundUI();
        UI.showBanner(SoundEngine.isMuted() ? 'Audio Muted' : 'Audio Enabled');
        return;
      }

      // In-Game Menu Toggle (Esc or X)
      if (e.key === 'Escape' || e.key === 'x' || e.key === 'X') {
        if (isMenuOpen) {
          toggleMenu();
          return;
        } else if (gameState === 'OVERWORLD' && !DialogueEngine.isActive() && !BattleEngine.isActive()) {
          toggleMenu();
          return;
        }
      }

      // Title Screen
      if (gameState === 'TITLE') {
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          titleSelectedOption = (titleSelectedOption + 1) % TITLE_OPTIONS.length;
          SoundEngine.playSFX('select');
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          titleSelectedOption = (titleSelectedOption - 1 + TITLE_OPTIONS.length) % TITLE_OPTIONS.length;
          SoundEngine.playSFX('select');
        } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
          handleTitleChoice(titleSelectedOption);
        }
        return;
      }

      // Dialogue
      if (DialogueEngine.isActive()) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
          DialogueEngine.advance();
        }
        return;
      }

      // Battle
      if (BattleEngine.isActive()) {
        BattleEngine.handleInput(e.key);
        return;
      }

      // Overworld Interact
      if (gameState === 'OVERWORLD' && !isMenuOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
          MapEngine.interact();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      keys[e.key] = false;
    });
  }

  function setupCanvasClickListeners() {
    canvas.addEventListener('click', (e) => {
      SoundEngine.init();

      // Get internal canvas click coordinates (0 to 640, 0 to 360)
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      if (gameState === 'TITLE') {
        // Check if clicked near menu options
        TITLE_OPTIONS.forEach((opt, idx) => {
          const y = 205 + idx * 28;
          if (clickY >= y - 16 && clickY <= y + 10 && clickX >= CANVAS_WIDTH / 2 - 120 && clickX <= CANVAS_WIDTH / 2 + 120) {
            handleTitleChoice(idx);
          }
        });
        // Default click to start if anywhere near center
        if (clickY > 150 && clickY < 330) {
          handleTitleChoice(0);
        }
        return;
      }

      if (DialogueEngine.isActive()) {
        DialogueEngine.advance();
        return;
      }

      if (BattleEngine.isActive()) {
        // Check action buttons in battle tray (y: 270 to 360)
        if (clickY >= 300) {
          const actions = ['FIGHT', 'CLEANSE', 'PARTY', 'BAG', 'RUN'];
          actions.forEach((act, idx) => {
            const bx = 20 + idx * 110;
            if (clickX >= bx - 10 && clickX <= bx + 90) {
              if (act === 'CLEANSE') BattleEngine.executeCleanse();
              else if (act === 'FIGHT') BattleEngine.handleInput('Enter');
              else if (act === 'PARTY') UI.openPartyModal();
              else if (act === 'BAG') UI.openBagModal();
              else if (act === 'RUN') BattleEngine.handleInput('Escape');
            }
          });
        }
        return;
      }

      if (gameState === 'OVERWORLD' && !isMenuOpen) {
        // Click to interact or walk in direction
        const player = MapEngine.getPlayer();
        const screenPx = player.pixelX + 16;
        const screenPy = player.pixelY + 16;
        const diffX = clickX - screenPx;
        const diffY = clickY - screenPy;

        if (Math.abs(diffX) < 24 && Math.abs(diffY) < 24) {
          MapEngine.interact();
        } else if (Math.abs(diffX) > Math.abs(diffY)) {
          MapEngine.movePlayer(diffX > 0 ? 1 : -1, 0);
        } else {
          MapEngine.movePlayer(0, diffY > 0 ? 1 : -1);
        }
      }
    });
  }

  function setupTouchControls() {
    const bindBtn = (id, onTrigger) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        SoundEngine.init();
        onTrigger();
      });
    };

    bindBtn('btn-up', () => handleDirectionInput(0, -1));
    bindBtn('btn-down', () => handleDirectionInput(0, 1));
    bindBtn('btn-left', () => handleDirectionInput(-1, 0));
    bindBtn('btn-right', () => handleDirectionInput(1, 0));

    bindBtn('btn-a', () => {
      if (gameState === 'TITLE') {
        handleTitleChoice(titleSelectedOption);
      } else if (DialogueEngine.isActive()) {
        DialogueEngine.advance();
      } else if (BattleEngine.isActive()) {
        BattleEngine.handleInput('Enter');
      } else {
        MapEngine.interact();
      }
    });

    bindBtn('btn-b', () => {
      if (BattleEngine.isActive()) {
        BattleEngine.handleInput('Escape');
      } else {
        toggleMenu();
      }
    });
  }

  function handleDirectionInput(dx, dy) {
    if (gameState === 'TITLE') {
      if (dy > 0) titleSelectedOption = (titleSelectedOption + 1) % TITLE_OPTIONS.length;
      if (dy < 0) titleSelectedOption = (titleSelectedOption - 1 + TITLE_OPTIONS.length) % TITLE_OPTIONS.length;
      SoundEngine.playSFX('select');
      return;
    }

    if (BattleEngine.isActive()) {
      if (dx > 0) BattleEngine.handleInput('ArrowRight');
      if (dx < 0) BattleEngine.handleInput('ArrowLeft');
      if (dy > 0) BattleEngine.handleInput('ArrowDown');
      if (dy < 0) BattleEngine.handleInput('ArrowUp');
      return;
    }

    if (gameState === 'OVERWORLD' && !DialogueEngine.isActive() && !isMenuOpen) {
      MapEngine.movePlayer(dx, dy);
    }
  }

  function handleTitleChoice(index) {
    SoundEngine.playSFX('select');
    if (index === 0) {
      // Start New Game
      QuestEngine.resetGame();
      UI.fadeOut(() => {
        MapEngine.loadMap('castle_town').then(() => {
          gameState = 'OVERWORLD';
          UI.fadeIn();
          UI.showLocationBanner('Castle Town - The Coronation');
        });
      });
    } else if (index === 1) {
      // Continue Saved Game
      const map = MapEngine.getCurrentMap();
      const mapId = map ? map.mapId : (QuestEngine.getCurrentAct() === 'prologue' ? 'castle_town' : 'oakhaven');
      UI.fadeOut(() => {
        MapEngine.loadMap(mapId).then(() => {
          gameState = 'OVERWORLD';
          UI.fadeIn();
          UI.showLocationBanner('Crown of the Wilds');
        });
      });
    } else if (index === 2) {
      UI.openCodexModal();
    } else if (index === 3) {
      UI.showBanner('Controls: WASD/Arrows to Walk | Space/Z to Interact | Esc/X for Menu | F for Fullscreen', 280);
    }
  }

  // --- GAME LOOP ---
  function gameLoop(now) {
    const delta = Math.min(now - lastTime, 100);
    lastTime = now;

    update(delta);
    render();

    requestAnimationFrame(gameLoop);
  }

  function update(delta) {
    UI.update();

    if (gameState === 'OVERWORLD' && !isMenuOpen) {
      if (!DialogueEngine.isActive() && !BattleEngine.isActive()) {
        if (keys['ArrowUp'] || keys['w'] || keys['W']) {
          MapEngine.movePlayer(0, -1);
        } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
          MapEngine.movePlayer(0, 1);
        } else if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
          MapEngine.movePlayer(-1, 0);
        } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
          MapEngine.movePlayer(1, 0);
        }
      }
      MapEngine.update(delta);
    }
  }

  function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gameState === 'TITLE') {
      renderTitleScreen();
    } else if (gameState === 'OVERWORLD') {
      MapEngine.render(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (BattleEngine.isActive()) {
        BattleEngine.render(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        DialogueEngine.render(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
        UI.renderHUD(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }
  }

  // --- TITLE SCREEN RENDERING ---
  let crystalGlow = 0;

  function renderTitleScreen() {
    crystalGlow += 0.05;

    // Dark Royal Velvet backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#0a0d1a');
    grad.addColorStop(0.5, '#17142b');
    grad.addColorStop(1, '#080711');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Decorative Gold Filigree Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, CANVAS_WIDTH - 28, CANVAS_HEIGHT - 28);
    ctx.strokeRect(18, 18, CANVAS_WIDTH - 36, CANVAS_HEIGHT - 36);

    // Aegis Crystal Center Emblem
    const crystalY = 82 + Math.sin(crystalGlow) * 4;
    const crystalGrad = ctx.createLinearGradient(CANVAS_WIDTH / 2, crystalY - 32, CANVAS_WIDTH / 2, crystalY + 32);
    crystalGrad.addColorStop(0, '#ffffff');
    crystalGrad.addColorStop(0.3, '#38bdf8');
    crystalGrad.addColorStop(0.7, '#818cf8');
    crystalGrad.addColorStop(1, '#c084fc');
    ctx.fillStyle = crystalGrad;

    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, crystalY - 28);
    ctx.lineTo(CANVAS_WIDTH / 2 + 22, crystalY);
    ctx.lineTo(CANVAS_WIDTH / 2, crystalY + 28);
    ctx.lineTo(CANVAS_WIDTH / 2 - 22, crystalY);
    ctx.closePath();
    ctx.fill();

    // Golden Halo
    ctx.strokeStyle = `rgba(250, 204, 21, ${0.4 + Math.sin(crystalGlow) * 0.3})`;
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, crystalY, 36, 0, Math.PI * 2);
    ctx.stroke();

    // Game Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px "Cinzel", "Georgia", serif';
    ctx.textAlign = 'center';
    ctx.fillText('CROWN OF THE WILDS', CANVAS_WIDTH / 2, 145);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 11px "Outfit", sans-serif';
    ctx.fillText('The Tale of Princess Aurelia & The Aegis Crystal', CANVAS_WIDTH / 2, 166);

    // Menu Options
    TITLE_OPTIONS.forEach((opt, idx) => {
      const y = 208 + idx * 28;
      const isSelected = (idx === titleSelectedOption);

      if (isSelected) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.fillRect(CANVAS_WIDTH / 2 - 110, y - 16, 220, 22);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(CANVAS_WIDTH / 2 - 110, y - 16, 220, 22);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px "Courier New", monospace';
        ctx.fillText(`► ${opt} ◄`, CANVAS_WIDTH / 2, y);
      } else {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px "Courier New", monospace';
        ctx.fillText(opt, CANVAS_WIDTH / 2, y);
      }
    });

    // Prompt footer
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.fillText('CLICK ANYWHERE TO START ADVENTURE', CANVAS_WIDTH / 2, 332);
    ctx.textAlign = 'left';
  }

  return {
    init,
    getState: () => gameState,
    setState: (s) => { gameState = s; },
    toggleMenu,
    saveProgress,
    toggleFullscreen
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
