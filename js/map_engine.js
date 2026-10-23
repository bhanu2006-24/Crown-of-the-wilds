/**
 * Crown of the Wilds - Map Engine
 * Handles JSON map loading, camera positioning, collision detection,
 * crate-pushing physics, ice-sliding mechanics, wild encounters, and warps.
 */

const MapEngine = (function() {
  let currentMap = null;
  let player = {
    x: 12,
    y: 14,
    pixelX: 12 * 32,
    pixelY: 14 * 32,
    direction: 'down',
    isMoving: false,
    walkFrame: 0,
    costume: 'royal', // 'royal', 'traveler', 'queen'
    isSliding: false,
    slideDir: null
  };

  let crates = [];
  let camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let animTimer = 0;
  let animFrame = 0;
  let mapCache = {};

  // Weather particles (rain, snow, embers, leaves)
  let particles = [];

  function initParticles(theme) {
    particles = [];
    const count = theme === 'snow' ? 70 : (theme === 'wasteland' ? 45 : (theme === 'pastoral' ? 25 : 0));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        speedX: theme === 'snow' ? (Math.random() * 2 - 1) * 1.5 : (theme === 'wasteland' ? (Math.random() - 0.5) * 0.8 : 0.8),
        speedY: theme === 'snow' ? 2.5 + Math.random() * 2 : (theme === 'wasteland' ? -1.5 - Math.random() : 1.2),
        size: Math.random() * 3 + 1,
        color: theme === 'snow' ? '#ffffff' : (theme === 'wasteland' ? '#a855f7' : '#86efac')
      });
    }
  }

  function updateParticles(width, height) {
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y > height) p.y = -5;
      if (p.y < -10) p.y = height + 5;
      if (p.x > width) p.x = 0;
      if (p.x < 0) p.x = width;
    });
  }

  function renderParticles(ctx, viewWidth, viewHeight) {
    ctx.save();
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.restore();
  }

  // --- MAP LOADING ---
  async function loadMap(mapId, spawnX = null, spawnY = null) {
    let mapData = null;

    // Check if map is already cached
    if (mapCache[mapId]) {
      mapData = mapCache[mapId];
    } else {
      // Attempt to fetch plain JSON file from data/maps/
      try {
        const res = await fetch(`data/maps/${mapId}.json`);
        if (res.ok) {
          mapData = await res.json();
          mapCache[mapId] = mapData;
        }
      } catch (e) {
        console.warn(`Could not fetch data/maps/${mapId}.json directly (likely file:// protocol). Using embedded fallback.`);
      }
    }

    if (!mapData && DATA.maps && DATA.maps[mapId]) {
      mapData = DATA.maps[mapId];
    }

    if (!mapData) {
      console.error(`Failed to load map: ${mapId}`);
      return false;
    }

    currentMap = JSON.parse(JSON.stringify(mapData)); // Clone
    crates = currentMap.crates ? JSON.parse(JSON.stringify(currentMap.crates)) : [];

    // Set player position
    const startX = (spawnX !== null) ? spawnX : (currentMap.spawn ? currentMap.spawn.x : 5);
    const startY = (spawnY !== null) ? spawnY : (currentMap.spawn ? currentMap.spawn.y : 5);
    player.x = startX;
    player.y = startY;
    player.pixelX = startX * 32;
    player.pixelY = startY * 32;
    player.isMoving = false;
    player.isSliding = false;

    // Determine Aurelia's costume according to Act
    if (currentMap.mapId === 'castle_restored') {
      player.costume = 'queen';
    } else if (currentMap.mapId === 'castle_town' && !QuestEngine.hasFlag('shattering_complete')) {
      player.costume = 'royal';
    } else {
      player.costume = 'traveler';
    }

    // Play appropriate BGM
    if (window.SoundEngine) {
      if (currentMap.theme === 'castle') SoundEngine.playBGM('castle');
      else if (currentMap.theme === 'sewers') SoundEngine.playBGM('sewer');
      else if (currentMap.theme === 'pastoral') SoundEngine.playBGM('pastoral');
      else if (currentMap.theme === 'coastal') SoundEngine.playBGM('port');
      else if (currentMap.theme === 'snow') SoundEngine.playBGM('snow');
      else if (currentMap.theme === 'wasteland') SoundEngine.playBGM('boss');
      else if (currentMap.theme === 'castle_restored') SoundEngine.playBGM('epilogue');
    }

    initParticles(currentMap.theme);
    return true;
  }

  // --- COLLISION & TILE HELPERS ---
  function getTileAt(x, y) {
    if (!currentMap || !currentMap.tileData) return 1;
    if (x < 0 || x >= currentMap.width || y < 0 || y >= currentMap.height) return 1;
    return currentMap.tileData[y][x];
  }

  function getTileName(tileCode) {
    if (!currentMap || !currentMap.legend) return 'stone_floor';
    let name = currentMap.legend[tileCode.toString()] || 'stone_floor';
    if (name === 'polluted_river' && QuestEngine.hasFlag('fragment_1_collected')) {
      return 'clean_river';
    }
    return name;
  }

  function getCrateAt(x, y) {
    return crates.find(c => c.x === x && c.y === y);
  }

  function getNPCAt(x, y) {
    if (!currentMap || !currentMap.npcs) return null;
    return currentMap.npcs.find(n => n.x === x && n.y === y);
  }

  function isTileWalkable(x, y) {
    const tileCode = getTileAt(x, y);
    const tileName = getTileName(tileCode);

    // Explicit solid obstacle tiles (walls, pillars, altars, signs)
    const solidNames = [
      'stone_wall', 'sewer_wall', 'warehouse_wall', 'ruined_wall',
      'frosted_rock', 'radiant_wall', 'dense_trees',
      'pillar', 'monastery_pillar', 'flower_pillar',
      'aegis_crystal', 'crystal_altar', 'void_altar', 'sanctum_wall',
      'signpost'
    ];

    if (solidNames.includes(tileName)) {
      return false;
    }

    // Water & Hazard tiles (require water companion or pushed crate bridge)
    const waterNames = ['sewer_water', 'polluted_river', 'deep_ocean', 'shadow_fire_pit'];
    if (waterNames.includes(tileName)) {
      const crateInWater = crates.find(c => c.x === x && c.y === y && c.inWater);
      if (crateInWater) return true;

      if (QuestEngine.hasWaterCrossing()) {
        return true;
      }
      return false;
    }

    // Check NPC blocking
    if (getNPCAt(x, y)) return false;

    // Check crate blocking
    const crate = getCrateAt(x, y);
    if (crate && !crate.inWater) return false;

    return true;
  }

  // --- PUSHING CRATES ---
  function tryPushCrate(crate, dx, dy) {
    const targetX = crate.x + dx;
    const targetY = crate.y + dy;

    // Check target tile
    const targetTile = getTileAt(targetX, targetY);

    // If destination is water, push crate into water to form a bridge!
    if (targetTile === 2) {
      crate.x = targetX;
      crate.y = targetY;
      crate.inWater = true;
      SoundEngine.playSFX('splash');
      UI.showBanner('Crate filled the water gap! Path opened!');
      return true;
    }

    // Otherwise check if target tile is walkable and free
    if (isTileWalkable(targetX, targetY) && !getCrateAt(targetX, targetY)) {
      crate.x = targetX;
      crate.y = targetY;
      SoundEngine.playSFX('bump');
      return true;
    }

    return false;
  }

  // --- MOVEMENT & INPUT ---
  function movePlayer(dx, dy) {
    if (player.isMoving || player.isSliding) return;

    // Set direction
    if (dx > 0) player.direction = 'right';
    else if (dx < 0) player.direction = 'left';
    else if (dy > 0) player.direction = 'down';
    else if (dy < 0) player.direction = 'up';

    const targetX = player.x + dx;
    const targetY = player.y + dy;

    // Check for pushable crate
    const crate = getCrateAt(targetX, targetY);
    if (crate && !crate.inWater) {
      const pushed = tryPushCrate(crate, dx, dy);
      if (!pushed) {
        SoundEngine.playSFX('bump');
        return;
      }
    }

    // Check walkability
    if (!isTileWalkable(targetX, targetY)) {
      SoundEngine.playSFX('bump');
      return;
    }

    // Initiate movement
    player.x = targetX;
    player.y = targetY;
    player.isMoving = true;

    // Check for ice sliding (Tile 3 on snow theme)
    if (currentMap.theme === 'snow' && getTileAt(targetX, targetY) === 3) {
      player.isSliding = true;
      player.slideDir = { dx, dy };
      SoundEngine.playSFX('slide');
    }
  }

  function update(delta) {
    animTimer += delta;
    if (animTimer >= 200) {
      animTimer = 0;
      animFrame = (animFrame + 1) % 4;
    }

    // Smooth movement interpolation
    const speed = player.isSliding ? 8 : 4;
    const targetPixelX = player.x * 32;
    const targetPixelY = player.y * 32;

    if (player.pixelX < targetPixelX) {
      player.pixelX = Math.min(player.pixelX + speed, targetPixelX);
    } else if (player.pixelX > targetPixelX) {
      player.pixelX = Math.max(player.pixelX - speed, targetPixelX);
    }

    if (player.pixelY < targetPixelY) {
      player.pixelY = Math.min(player.pixelY + speed, targetPixelY);
    } else if (player.pixelY > targetPixelY) {
      player.pixelY = Math.max(player.pixelY - speed, targetPixelY);
    }

    // Update walk animation frame
    if (player.pixelX !== targetPixelX || player.pixelY !== targetPixelY) {
      player.walkFrame = Math.floor(animTimer / 100) % 3;
    } else {
      player.walkFrame = 0;
      if (player.isMoving) {
        player.isMoving = false;
        onPlayerArrivedAtTile(player.x, player.y);
      }
    }

    // Ice sliding continuation
    if (player.isSliding && !player.isMoving) {
      const { dx, dy } = player.slideDir;
      const nextX = player.x + dx;
      const nextY = player.y + dy;

      if (isTileWalkable(nextX, nextY) && getTileAt(player.x, player.y) === 3) {
        player.x = nextX;
        player.y = nextY;
        player.isMoving = true;
      } else {
        player.isSliding = false;
        player.slideDir = null;
      }
    }

    // Camera follow smoothly
    camera.targetX = player.pixelX + 16 - (640 / 2);
    camera.targetY = player.pixelY + 16 - (360 / 2);

    // Camera clamping
    const mapWidthPx = currentMap ? currentMap.width * 32 : 800;
    const mapHeightPx = currentMap ? currentMap.height * 32 : 600;
    camera.targetX = Math.max(0, Math.min(camera.targetX, Math.max(0, mapWidthPx - 640)));
    camera.targetY = Math.max(0, Math.min(camera.targetY, Math.max(0, mapHeightPx - 360)));

    camera.x += (camera.targetX - camera.x) * 0.15;
    camera.y += (camera.targetY - camera.y) * 0.15;

    updateParticles(640, 360);
  }

  // --- TILE ARRIVAL EVENTS (Wild Grass, Warps, Triggers) ---
  function onPlayerArrivedAtTile(x, y) {
    if (!currentMap) return;

    // 1. Check Warps
    if (currentMap.warps) {
      for (const w of currentMap.warps) {
        if (w.x === x && w.y === y) {
          if (w.condition && !QuestEngine.hasFlag(w.condition)) {
            if (w.condition === 'fragment_1_collected') {
              UI.showBanner('The road is choked with miasma! Cleanse Goliath Mud-Toad at the Weir first.');
            } else if (w.condition === 'fragment_2_collected') {
              UI.showBanner('The mountain trail is blockaded! Recover Fragment 2 from Abyssal Crab first.');
            } else if (w.condition === 'fragment_3_collected') {
              UI.showBanner('Freezing blizzards block the path! Purify Glacierwing on Whispering Peaks first.');
            } else {
              UI.showBanner('The path forward is barred.');
            }
            SoundEngine.playSFX('bump');
            return;
          }
          // Execute Warp!
          UI.fadeOut(() => {
            loadMap(w.targetMap, w.targetX, w.targetY).then(() => {
              UI.fadeIn();
              UI.showLocationBanner(currentMap.mapName);
            });
          });
          return;
        }
      }
    }

    // 2. Check Triggers (Bosses, Cutscenes)
    if (currentMap.triggers) {
      for (const t of currentMap.triggers) {
        if (t.x === x && t.y === y) {
          if (t.id && QuestEngine.hasFlag(t.id + '_done')) continue;
          if (t.fragmentReward && QuestEngine.hasFlag('fragment_' + t.fragmentReward + '_collected')) continue;
          QuestEngine.handleTrigger(t);
          return;
        }
      }
    }

    // 3. Check Wild Encounters (in tall grass)
    const tile = getTileAt(x, y);
    if ((tile === 4) && currentMap.wildZones && currentMap.wildZones.length > 0) {
      for (const zone of currentMap.wildZones) {
        if (x >= zone.x && x < zone.x + zone.w && y >= zone.y && y < zone.y + zone.h) {
          if (Math.random() < zone.encounterRate) {
            const spiritId = zone.spirits[Math.floor(Math.random() * zone.spirits.length)];
            BattleEngine.startBattle({
              spiritId: spiritId,
              isCorrupted: true,
              isWild: true
            });
            return;
          }
        }
      }
    }
  }

  // --- INTERACTION (NPCs, Objects) ---
  function interact() {
    let targetX = player.x;
    let targetY = player.y;

    if (player.direction === 'up') targetY--;
    else if (player.direction === 'down') targetY++;
    else if (player.direction === 'left') targetX--;
    else if (player.direction === 'right') targetX++;

    // 1. Check NPC
    const npc = getNPCAt(targetX, targetY);
    if (npc) {
      // If talking to Malakor before cutscene, trigger cutscene
      if (npc.id === 'lord_malakor' && !QuestEngine.hasFlag('sanctum_cutscene_done')) {
        QuestEngine.handleTrigger({ id: 'sanctum_cutscene', event: 'shattering_cutscene' });
        return;
      }

      // Check Boss NPCs
      if (npc.isBoss || npc.id.startsWith('boss_')) {
        if (npc.id === 'boss_mudtoad' && QuestEngine.hasFlag('fragment_1_collected')) {
          DialogueEngine.showObjectText('Goliath Mud-Toad', 'The mighty toad spirit croaks softly in peaceful harmony with the river.');
          return;
        }
        if (npc.id === 'boss_crab' && QuestEngine.hasFlag('fragment_2_collected')) {
          DialogueEngine.showObjectText('Abyssal Crab', 'The giant reef crab rests calmly near the tide pools.');
          return;
        }
        if (npc.id === 'boss_wyvern' && QuestEngine.hasFlag('fragment_3_collected')) {
          DialogueEngine.showObjectText('Glacierwing', 'The mythic ice-wyvern gently curls its frosted wings in slumber.');
          return;
        }

        // Start Boss Battle!
        const spiritId = (npc.id === 'boss_mudtoad' ? 'mudtoad' :
                         (npc.id === 'boss_crab' ? 'abyssalcrab' :
                         (npc.id === 'boss_wyvern' ? 'icewyvern' :
                         (npc.id === 'boss_chimera' ? 'shadow_chimera' : npc.id.replace('boss_', '')))));
        let frag = 1;
        if (spiritId === 'abyssalcrab') frag = 2;
        else if (spiritId === 'icewyvern') frag = 3;
        else if (spiritId === 'shadow_chimera') frag = 4;

        DialogueEngine.showCutscene([
          {
            speaker: npc.name,
            text: npc.dialogue || 'A fierce, primal roar reverberates across the ground!'
          }
        ], () => {
          BattleEngine.startBattle({
            spiritId: spiritId,
            isCorrupted: true,
            isBoss: true,
            fragmentReward: frag
          });
        });
        return;
      }

      // Dynamic dialogue for Mayor Cedric & Farmer Barnaby
      if (npc.id === 'mayor_cedric') {
        if (QuestEngine.hasFlag('fragment_1_collected')) {
          DialogueEngine.showObjectText('Mayor Cedric', 'Princess Aurelia, you cleansed the Goliath Mud-Toad and purified our waters! The road south to Rustport Harbor is now open. We are forever in your debt!');
          return;
        }
      }
      if (npc.id === 'farmer_barnaby') {
        if (QuestEngine.hasFlag('fragment_1_collected')) {
          DialogueEngine.showObjectText('Farmer Barnaby', 'The cattle are calm and the river is crystal clear once more! Thank you, Your Highness!');
          return;
        }
      }

      DialogueEngine.startDialogue(npc);
      return;
    }

    // 2. Check Interactive Objects
    if (currentMap.interactive) {
      const obj = currentMap.interactive.find(o => (o.x === targetX && o.y === targetY) || (o.x === player.x && o.y === player.y));
      if (obj) {
        if (obj.type === 'sewer_grate' && QuestEngine.hasFlag('shattering_complete')) {
          DialogueEngine.showCutscene([
            {
              speaker: 'Princess Aurelia',
              text: 'The secret sewer grate is unlocked! Escaping into the undercroft beneath Castle Town...'
            }
          ], () => {
            UI.fadeOut(() => {
              loadMap('castle_sewers', 2, 3).then(() => {
                UI.fadeIn();
                UI.showLocationBanner('Royal Sewers & Escape Passage');
              });
            });
          });
          return;
        }

        // Sacred Shrine: Rest & Heal Party
        if (obj.type === 'sacred_shrine' || obj.type === 'shrine') {
          QuestEngine.healParty();
          SoundEngine.playSFX('cleanse');
          UI.showBanner('Your companion spirits have been fully restored!');
          DialogueEngine.showObjectText(obj.name, 'A warm golden light envelops you. Your companion spirits are completely restored!');
          return;
        }

        DialogueEngine.showObjectText(obj.name, obj.description);
        return;
      }
    }

    // 3. Check Broken Pier gap (Rustport)
    if (currentMap.brokenBridges) {
      const bridge = currentMap.brokenBridges.find(b => b.x === targetX && b.y === targetY);
      if (bridge) {
        if (QuestEngine.hasWaterCrossing()) {
          DialogueEngine.showObjectText('Water Companion Ability', 'Your water companion manipulates the currents! A buoyant water-bridge allows safe passage across the gap.');
        } else {
          DialogueEngine.showObjectText('Broken Pier', 'A deep ocean gap over raging currents. You need a Water-type spirit companion or cargo crates to cross!');
        }
        return;
      }
    }
  }

  // --- RENDERING ---
  function render(ctx, viewWidth = 640, viewHeight = 360) {
    if (!currentMap) return;

    ctx.save();
    ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));

    const startCol = Math.max(0, Math.floor(camera.x / 32));
    const endCol = Math.min(currentMap.width - 1, Math.ceil((camera.x + viewWidth) / 32));
    const startRow = Math.max(0, Math.floor(camera.y / 32));
    const endRow = Math.min(currentMap.height - 1, Math.ceil((camera.y + viewHeight) / 32));

    // 1. Render Base Tiles
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tileCode = currentMap.tileData[r][c];
        const tileName = getTileName(tileCode);
        const tileCanvas = TileGenerator.getTile(tileName, animFrame);
        ctx.drawImage(tileCanvas, c * 32, r * 32);
      }
    }

    // 2. Render Crates
    crates.forEach(c => {
      if (c.inWater) {
        // Floating crate bridge
        ctx.globalAlpha = 0.85;
        ctx.drawImage(TileGenerator.getTile('crate'), c.x * 32, c.y * 32);
        ctx.globalAlpha = 1.0;
      } else {
        ctx.drawImage(TileGenerator.getTile('crate'), c.x * 32, c.y * 32);
      }
    });

    // 3. Render NPCs & Spirits
    if (currentMap.npcs) {
      currentMap.npcs.forEach(n => {
        // Determine whether sprite is character or spirit
        let spriteCanvas;
        if (n.sprite.startsWith('pyropaw') || n.sprite.startsWith('mudtoad') || n.sprite.startsWith('abyssalcrab') || n.sprite.startsWith('icewyvern')) {
          const isCorrupt = n.sprite.includes('corrupt');
          const cleanId = n.sprite.replace('_corrupt', '').replace('_clean', '');
          spriteCanvas = SpriteGenerator.getSpiritOverworld(cleanId, isCorrupt);
        } else if (n.sprite === 'malakor') {
          spriteCanvas = SpriteGenerator.getNPC('malakor');
        } else {
          spriteCanvas = SpriteGenerator.getNPC(n.sprite);
        }
        ctx.drawImage(spriteCanvas, n.x * 32, n.y * 32);

        // Name plate indicator on hover or proximity
        if (Math.abs(player.x - n.x) <= 1 && Math.abs(player.y - n.y) <= 1) {
          ctx.fillStyle = '#ffef9f';
          ctx.fillRect(n.x * 32 + 14, n.y * 32 - 6, 4, 4);
        }
      });
    }

    // 4. Render Player (Princess Aurelia)
    const playerCanvas = SpriteGenerator.getAurelia(
      player.direction,
      player.walkFrame,
      player.costume
    );
    ctx.drawImage(playerCanvas, Math.floor(player.pixelX), Math.floor(player.pixelY));

    // Follower companion if player has one!
    const activeCompanion = QuestEngine.getActiveCompanion();
    if (activeCompanion && currentMap.mapId !== 'castle_town') {
      const followX = player.pixelX - (player.direction === 'right' ? 26 : (player.direction === 'left' ? -26 : 0));
      const followY = player.pixelY - (player.direction === 'down' ? 24 : (player.direction === 'up' ? -24 : 0));
      const followerSprite = SpriteGenerator.getSpiritOverworld(activeCompanion.id, false);
      ctx.drawImage(followerSprite, Math.floor(followX), Math.floor(followY));
    }

    // 5. Render Animated Objective Waypoint Markers (Gates & Signs)
    const bounce = Math.sin(Date.now() * 0.006) * 3;
    let targetWaypoint = null;

    if (currentMap.mapId === 'castle_town') {
      if (!QuestEngine.hasFlag('shattering_complete')) {
        targetWaypoint = { x: 12, y: 5, label: 'Aegis Sanctum', color: '#fef08a' };
      } else {
        targetWaypoint = { x: 2, y: 16, label: 'Sewer Escape', color: '#38bdf8' };
      }
    } else if (currentMap.mapId === 'castle_sewers') {
      if (!QuestEngine.hasFlag('has_companion')) {
        targetWaypoint = { x: 11, y: 14, label: 'Corrupted Fox', color: '#c084fc' };
      } else {
        targetWaypoint = { x: 19, y: 15, label: 'Outflow to Wilds', color: '#4ade80' };
      }
    } else if (currentMap.mapId === 'oakhaven') {
      if (!QuestEngine.hasFlag('fragment_1_collected')) {
        targetWaypoint = { x: 13, y: 2, label: 'Goliath Mud-Toad (Boss)', color: '#c084fc' };
      } else {
        targetWaypoint = { x: 22, y: 21, label: 'Road to Rustport', color: '#38bdf8' };
      }
    } else if (currentMap.mapId === 'rustport') {
      if (!QuestEngine.hasFlag('fragment_2_collected')) {
        targetWaypoint = { x: 20, y: 18, label: 'Abyssal Crab (Boss)', color: '#c084fc' };
      } else {
        targetWaypoint = { x: 9, y: 21, label: 'Whispering Peaks', color: '#38bdf8' };
      }
    } else if (currentMap.mapId === 'whispering_peaks') {
      if (!QuestEngine.hasFlag('fragment_3_collected')) {
        targetWaypoint = { x: 13, y: 3, label: 'Glacierwing (Boss)', color: '#c084fc' };
      } else {
        targetWaypoint = { x: 13, y: 21, label: 'Ruined Keep', color: '#38bdf8' };
      }
    } else if (currentMap.mapId === 'ruined_keep') {
      targetWaypoint = { x: 12, y: 4, label: 'Lord Malakor', color: '#f87171' };
    }

    if (targetWaypoint) {
      const wx = targetWaypoint.x * 32 + 16;
      const wy = targetWaypoint.y * 32 - 6 + bounce;

      // Pulsing downward indicator arrow
      ctx.fillStyle = targetWaypoint.color;
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx - 5, wy - 8);
      ctx.lineTo(wx + 5, wy - 8);
      ctx.closePath();
      ctx.fill();

      // Tooltip pill
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = targetWaypoint.color;
      ctx.lineWidth = 1;
      const pillW = targetWaypoint.label.length * 7 + 12;
      ctx.fillRect(wx - pillW / 2, wy - 22, pillW, 14);
      ctx.strokeRect(wx - pillW / 2, wy - 22, pillW, 14);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(targetWaypoint.label, wx, wy - 12);
      ctx.textAlign = 'left';
    }

    ctx.restore();

    // 5. Render Atmospheric Weather Particles
    renderParticles(ctx, viewWidth, viewHeight);
  }

  return {
    loadMap,
    getCurrentMap: () => currentMap,
    getPlayer: () => player,
    movePlayer,
    interact,
    update,
    render,
    isTileWalkable
  };
})();

if (typeof window !== 'undefined') {
  window.MapEngine = MapEngine;
}
