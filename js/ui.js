/**
 * Crown of the Wilds - UI & HUD Engine
 * Floating top HUD, in-game RPG pause menu, modals, and screen notifications.
 */

const UI = (function() {
  let fadeAlpha = 0.0;
  let isFading = false;
  let bannerText = '';
  let bannerTimer = 0;
  let locationBanner = '';
  let locationBannerTimer = 0;

  function showBanner(text, duration = 160) {
    bannerText = text;
    bannerTimer = duration;
  }

  function showLocationBanner(text, duration = 180) {
    locationBanner = text;
    locationBannerTimer = duration;
    updateHUD();
  }

  function fadeOut(callback) {
    isFading = true;
    let alpha = 0;
    const interval = setInterval(() => {
      alpha += 0.1;
      fadeAlpha = Math.min(1.0, alpha);
      if (fadeAlpha >= 1.0) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 25);
  }

  function fadeIn(callback) {
    let alpha = 1.0;
    const interval = setInterval(() => {
      alpha -= 0.1;
      fadeAlpha = Math.max(0.0, alpha);
      if (fadeAlpha <= 0) {
        clearInterval(interval);
        isFading = false;
        if (callback) callback();
      }
    }, 25);
  }

  function update() {
    if (bannerTimer > 0) bannerTimer--;
    if (locationBannerTimer > 0) locationBannerTimer--;
    updateHUD();
  }

  function updateHUD() {
    const locEl = document.getElementById('hud-location-text');
    const actEl = document.getElementById('hud-act-text');
    const objEl = document.getElementById('hud-objective-text');

    const curMap = MapEngine.getCurrentMap();
    if (curMap) {
      if (locEl) locEl.textContent = curMap.mapName.split('-')[0].trim();
      if (actEl) actEl.textContent = curMap.act || 'Prologue';
    }

    if (objEl && window.QuestEngine) {
      objEl.textContent = QuestEngine.getCurrentObjective();
    }
  }

  function updateSoundUI() {
    const icon = document.getElementById('sound-icon');
    const sub = document.getElementById('menu-audio-sub');
    const muted = SoundEngine.isMuted();

    if (icon) icon.textContent = muted ? '🔇' : '🔊';
    if (sub) sub.textContent = muted ? 'Sound is currently MUTED' : 'Sound is currently ON';
  }

  function updatePauseMenu() {
    const fragEl = document.getElementById('menu-frag-count');
    const actEl = document.getElementById('menu-act-badge');
    const titleEl = document.getElementById('menu-hero-title');
    const avatarEl = document.getElementById('menu-hero-avatar');

    const frags = QuestEngine.getFragments();
    if (fragEl) {
      if (frags === 0) fragEl.textContent = 'Core Shard (1/4)';
      else if (frags === 1) fragEl.textContent = 'Pastoral Shard (2/4)';
      else if (frags === 2) fragEl.textContent = 'Coastal Shard (3/4)';
      else if (frags === 3) fragEl.textContent = 'Glacial Shard (4/4)';
      else fragEl.textContent = 'Unified Aegis Crystal';
    }

    if (actEl) {
      actEl.textContent = QuestEngine.getCurrentAct().toUpperCase();
    }

    if (titleEl) {
      const costume = MapEngine.getPlayer().costume;
      titleEl.textContent = costume === 'queen' ? 'Queen of the Wilds' : (costume === 'traveler' ? 'The Disguised Princess' : 'Heir to the Throne');
    }

    if (avatarEl && window.SpriteGenerator) {
      avatarEl.innerHTML = '';
      const sprite = SpriteGenerator.getAurelia('down', 0, MapEngine.getPlayer().costume);
      sprite.style.width = '36px';
      sprite.style.height = '36px';
      avatarEl.appendChild(sprite);
    }

    updateSoundUI();
  }

  // --- RENDER NOTIFICATIONS & FADES ON CANVAS ---
  function renderHUD(ctx, width = 640, height = 360) {
    ctx.save();

    // 1. Notification Banner Popup
    if (bannerTimer > 0) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(width / 2 - 200, 48, 400, 30);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(width / 2 - 200, 48, 400, 30);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(bannerText, width / 2, 68);
      ctx.textAlign = 'left';
    }

    // 2. Location Banner on Entry
    if (locationBannerTimer > 0) {
      const alpha = Math.min(1.0, locationBannerTimer / 40);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
      ctx.fillRect(40, height / 2 - 28, width - 80, 56);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, height / 2 - 28, width - 80, 56);

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 16px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText(locationBanner, width / 2, height / 2 + 7);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1.0;
    }

    // 3. Screen Fade Overlay
    if (fadeAlpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  }

  // --- MODALS ---
  function openPartyModal() {
    const party = QuestEngine.getParty();
    const modal = document.getElementById('party-modal');
    const list = document.getElementById('party-list');
    if (!modal || !list) return;

    list.innerHTML = '';
    if (party.length === 0) {
      list.innerHTML = '<div class="empty-state">No companions recruited yet.<br><br>Find corrupted Aura Spirits in the Sewers or Wilds and use Aurelia’s <strong>Aegis Cleanse</strong> to recruit them!</div>';
    } else {
      party.forEach((comp, idx) => {
        const item = document.createElement('div');
        item.className = 'party-card';
        item.innerHTML = `
          <div class="party-info">
            <div class="party-name">${comp.name} <span class="badge ${comp.element}">${comp.element.toUpperCase()}</span> Lv.${comp.level}</div>
            <div class="party-title">${comp.title || 'Aura Spirit'}</div>
            <div class="party-stats">
              HP: ${comp.hp}/${comp.maxHp} | Energy: ${comp.energy}/${comp.maxEnergy} | Atk: ${comp.baseAtk} | Def: ${comp.baseDef}
            </div>
            <div class="party-ability">Field Ability: <strong>${comp.fieldAbility}</strong></div>
          </div>
          <button class="action-btn" onclick="QuestEngine.switchActiveCompanion(${idx}); UI.openPartyModal();">Make Lead</button>
        `;
        list.appendChild(item);
      });
    }

    modal.classList.add('visible');
  }

  function openBagModal() {
    const inv = QuestEngine.getInventory();
    const modal = document.getElementById('bag-modal');
    const list = document.getElementById('bag-list');
    if (!modal || !list) return;

    list.innerHTML = '';
    inv.forEach(item => {
      const data = DATA.items[item.id];
      const div = document.createElement('div');
      div.className = 'bag-card';
      div.innerHTML = `
        <div class="bag-info">
          <div class="bag-name">${data.name} <span class="badge">x${item.count}</span></div>
          <div class="bag-desc">${data.desc}</div>
        </div>
        <button class="action-btn" ${item.count <= 0 ? 'disabled' : ''} onclick="QuestEngine.useItem('${item.id}'); UI.openBagModal();">Use</button>
      `;
      list.appendChild(div);
    });

    modal.classList.add('visible');
  }

  function openCodexModal() {
    const modal = document.getElementById('codex-modal');
    if (modal) modal.classList.add('visible');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('visible');
  }

  return {
    showBanner,
    showLocationBanner,
    fadeOut,
    fadeIn,
    update,
    updateHUD,
    updateSoundUI,
    updatePauseMenu,
    renderHUD,
    openPartyModal,
    openBagModal,
    openCodexModal,
    closeModal
  };
})();

if (typeof window !== 'undefined') {
  window.UI = UI;
}
