/**
 * Crown of the Wilds - Procedural Tile Generator
 * Generates self-contained 32x32 pixel-art tiles using HTML5 Canvas drawing functions.
 * No external images needed!
 */

const TileGenerator = (function() {
  const TILE_SIZE = 32;
  const cache = {};

  function createCanvas() {
    const c = document.createElement('canvas');
    c.width = TILE_SIZE;
    c.height = TILE_SIZE;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas: c, ctx: ctx };
  }

  // --- CASTLE TILES ---
  function drawStoneFloor() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#6e7485';
    ctx.fillRect(0, 0, 32, 32);
    // Pavers pattern
    ctx.fillStyle = '#7d8496';
    ctx.fillRect(1, 1, 14, 14);
    ctx.fillRect(17, 1, 14, 14);
    ctx.fillRect(1, 17, 14, 14);
    ctx.fillRect(17, 17, 14, 14);
    // Highlights & shadows
    ctx.fillStyle = '#8f97ab';
    ctx.fillRect(1, 1, 14, 2);
    ctx.fillRect(17, 1, 14, 2);
    ctx.fillRect(1, 17, 14, 2);
    ctx.fillRect(17, 17, 14, 2);
    ctx.fillStyle = '#4c515e';
    ctx.fillRect(0, 15, 32, 2);
    ctx.fillRect(15, 0, 2, 32);
    // Subtle noise
    ctx.fillStyle = '#5d6270';
    ctx.fillRect(4, 7, 2, 2);
    ctx.fillRect(22, 10, 2, 2);
    ctx.fillRect(8, 24, 2, 2);
    return canvas;
  }

  function drawStoneWall() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#3a3e4a';
    ctx.fillRect(0, 0, 32, 32);
    // Brick rows
    ctx.fillStyle = '#4f5566';
    ctx.fillRect(1, 1, 14, 6);
    ctx.fillRect(17, 1, 14, 6);
    ctx.fillRect(1, 9, 22, 6);
    ctx.fillRect(25, 9, 6, 6);
    ctx.fillRect(1, 17, 10, 6);
    ctx.fillRect(13, 17, 18, 6);
    ctx.fillRect(1, 25, 18, 6);
    ctx.fillRect(21, 25, 10, 6);
    // Top parapet shadow
    ctx.fillStyle = '#2a2c35';
    ctx.fillRect(0, 0, 32, 2);
    ctx.fillRect(0, 7, 32, 2);
    ctx.fillRect(0, 15, 32, 2);
    ctx.fillRect(0, 23, 32, 2);
    ctx.fillRect(0, 31, 32, 1);
    // Highlights
    ctx.fillStyle = '#656c80';
    ctx.fillRect(1, 2, 14, 1);
    ctx.fillRect(17, 2, 14, 1);
    ctx.fillRect(1, 10, 22, 1);
    return canvas;
  }

  function drawRedCarpet() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#8b1e2c';
    ctx.fillRect(0, 0, 32, 32);
    // Gold filigree edge borders
    ctx.fillStyle = '#dfaf37';
    ctx.fillRect(0, 0, 3, 32);
    ctx.fillRect(29, 0, 3, 32);
    ctx.fillStyle = '#a82939';
    ctx.fillRect(4, 0, 24, 32);
    // Velvet weave texture
    ctx.fillStyle = '#731622';
    for (let y = 2; y < 32; y += 4) {
      ctx.fillRect(5, y, 22, 1);
    }
    // Gold diamond emblems
    ctx.fillStyle = '#f7d05e';
    ctx.fillRect(15, 6, 2, 2);
    ctx.fillRect(14, 7, 4, 2);
    ctx.fillRect(15, 9, 2, 2);

    ctx.fillRect(15, 22, 2, 2);
    ctx.fillRect(14, 23, 4, 2);
    ctx.fillRect(15, 25, 2, 2);
    return canvas;
  }

  function drawPillar() {
    const { canvas, ctx } = createCanvas();
    // Base floor
    ctx.drawImage(drawStoneFloor(), 0, 0);
    // Column base
    ctx.fillStyle = '#4c515e';
    ctx.fillRect(6, 22, 20, 8);
    ctx.fillStyle = '#9aa1b3';
    ctx.fillRect(7, 21, 18, 2);
    // Shaft
    ctx.fillStyle = '#d3d7e3';
    ctx.fillRect(8, 6, 16, 16);
    // Column fluting
    ctx.fillStyle = '#adb3c4';
    ctx.fillRect(10, 6, 3, 16);
    ctx.fillRect(19, 6, 3, 16);
    // Column capital
    ctx.fillStyle = '#e8ecf7';
    ctx.fillRect(6, 2, 20, 4);
    ctx.fillStyle = '#b5bccf';
    ctx.fillRect(5, 0, 22, 2);
    return canvas;
  }

  function drawAegisCrystal(shattered = false) {
    const { canvas, ctx } = createCanvas();
    ctx.drawImage(drawStoneFloor(), 0, 0);
    // Altar pedestal
    ctx.fillStyle = '#3a3a4f';
    ctx.fillRect(6, 20, 20, 10);
    ctx.fillStyle = '#545472';
    ctx.fillRect(8, 18, 16, 2);

    if (!shattered) {
      // Radiant crystal
      const grad = ctx.createLinearGradient(16, 2, 16, 18);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#7ef8ff');
      grad.addColorStop(0.7, '#2498db');
      grad.addColorStop(1, '#6b20c9');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(16, 2);
      ctx.lineTo(24, 10);
      ctx.lineTo(16, 19);
      ctx.lineTo(8, 10);
      ctx.closePath();
      ctx.fill();

      // Specular highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(16, 3);
      ctx.lineTo(19, 10);
      ctx.lineTo(16, 17);
      ctx.lineTo(15, 10);
      ctx.closePath();
      ctx.fill();

      // Glowing aura particles
      ctx.fillStyle = 'rgba(126, 248, 255, 0.6)';
      ctx.fillRect(6, 8, 2, 2);
      ctx.fillRect(24, 7, 2, 2);
      ctx.fillRect(15, 0, 2, 2);
    } else {
      // Shattered pedestal with dark remnants
      ctx.fillStyle = '#221929';
      ctx.fillRect(10, 14, 4, 5);
      ctx.fillRect(17, 16, 3, 3);
      // Purple smoke wisps
      ctx.fillStyle = 'rgba(170, 40, 230, 0.7)';
      ctx.fillRect(11, 8, 3, 4);
      ctx.fillRect(17, 6, 2, 6);
    }
    return canvas;
  }

  // --- NAVIGATION TILES: GATES, SIGNPOSTS, TORCHES ---
  function drawSignpost() {
    const { canvas, ctx } = createCanvas();
    ctx.drawImage(drawStoneFloor(), 0, 0);
    // Wooden post
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(14, 16, 4, 14);
    // Wooden board
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(6, 6, 20, 11);
    ctx.fillStyle = '#a6723c';
    ctx.fillRect(7, 7, 18, 9);
    // Pointer arrow
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(15, 9, 2, 5);
    ctx.fillRect(14, 10, 4, 2);
    return canvas;
  }

  function drawSanctumGate() {
    const { canvas, ctx } = createCanvas();
    ctx.drawImage(drawStoneFloor(), 0, 0);
    // Royal marble pillars on sides
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 0, 6, 32);
    ctx.fillRect(26, 0, 6, 32);
    // Golden arch top
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, 32, 6);
    // Royal purple banner
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(8, 0, 16, 12);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(15, 3, 2, 6);
    ctx.fillRect(13, 5, 6, 2);
    return canvas;
  }

  function drawWallTorch(frame = 0) {
    const { canvas, ctx } = createCanvas();
    ctx.drawImage(drawStoneWall(), 0, 0);
    // Iron sconce
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(14, 14, 4, 8);
    ctx.fillRect(12, 12, 8, 3);
    // Flickering flame
    const flicker = (frame % 3) * 1.5;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(16, 10 - flicker, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(16, 9 - flicker, 3, 0, Math.PI * 2);
    ctx.fill();
    return canvas;
  }

  function drawSewerGrateOpen(frame = 0) {
    const { canvas, ctx } = createCanvas();
    ctx.drawImage(drawStoneFloor(), 0, 0);
    // Circular pit
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(16, 16, 13, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    // Iron bars
    ctx.fillStyle = '#64748b';
    ctx.fillRect(6, 15, 20, 2);
    ctx.fillRect(15, 6, 2, 20);
    // Pulsing cyan magic aura indicating secret entrance!
    const auraPulse = (Math.sin(frame * 1.2) + 1) * 0.35 + 0.3;
    ctx.strokeStyle = `rgba(56, 189, 248, ${auraPulse})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, 26, 26);
    ctx.fillStyle = `rgba(56, 189, 248, ${auraPulse * 0.8})`;
    ctx.fillRect(14, 12, 4, 8);
    return canvas;
  }

  function drawSunlitExit() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 32);
    // Radiant daylight outflow
    const grad = ctx.createLinearGradient(0, 0, 32, 32);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#7dd3fc');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.fill();
    return canvas;
  }

  // --- SEWER TILES ---
  function drawSewerStone() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#2d332d';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#3b453b';
    ctx.fillRect(2, 2, 12, 12);
    ctx.fillRect(18, 2, 12, 12);
    ctx.fillRect(2, 18, 12, 12);
    ctx.fillRect(18, 18, 12, 12);
    // Moss stains
    ctx.fillStyle = '#485e3d';
    ctx.fillRect(2, 12, 6, 3);
    ctx.fillRect(22, 4, 5, 2);
    ctx.fillRect(16, 24, 7, 3);
    // Dark mortar
    ctx.fillStyle = '#1c211c';
    ctx.fillRect(0, 15, 32, 2);
    ctx.fillRect(15, 0, 2, 32);
    return canvas;
  }

  function drawSewerWall() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#1f241f';
    ctx.fillRect(0, 0, 32, 32);
    // Damp bricks
    ctx.fillStyle = '#323b32';
    ctx.fillRect(1, 1, 14, 6);
    ctx.fillRect(17, 1, 14, 6);
    ctx.fillRect(1, 9, 20, 6);
    ctx.fillRect(23, 9, 8, 6);
    ctx.fillRect(1, 17, 12, 6);
    ctx.fillRect(15, 17, 16, 6);
    ctx.fillRect(1, 25, 24, 6);
    // Dripping slime
    ctx.fillStyle = '#5c8a38';
    ctx.fillRect(8, 7, 2, 4);
    ctx.fillRect(22, 15, 2, 5);
    return canvas;
  }

  function drawSewerWater(frame = 0) {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#1b382b';
    ctx.fillRect(0, 0, 32, 32);
    // Murky ripples
    ctx.fillStyle = '#28543f';
    const offset = (frame % 4) * 4;
    ctx.fillRect(2, (4 + offset) % 32, 12, 3);
    ctx.fillRect(18, (12 + offset) % 32, 10, 3);
    ctx.fillRect(6, (20 + offset) % 32, 14, 3);
    // Toxic violet streaks
    ctx.fillStyle = 'rgba(150, 50, 200, 0.4)';
    ctx.fillRect(4, (16 + offset) % 32, 18, 2);
    return canvas;
  }

  // --- PASTORAL (OAKHAVEN) TILES ---
  function drawMeadowGrass() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#56963e';
    ctx.fillRect(0, 0, 32, 32);
    // Grass texture dots
    ctx.fillStyle = '#67ab4c';
    ctx.fillRect(3, 4, 3, 2);
    ctx.fillRect(14, 9, 2, 3);
    ctx.fillRect(24, 5, 3, 2);
    ctx.fillRect(8, 19, 3, 2);
    ctx.fillRect(20, 22, 3, 2);
    ctx.fillRect(2, 27, 2, 3);
    // Small wildflowers
    ctx.fillStyle = '#ffe066';
    ctx.fillRect(6, 12, 2, 2);
    ctx.fillRect(26, 18, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 28, 2, 2);
    return canvas;
  }

  function drawTallWildGrass() {
    const { canvas, ctx } = createCanvas();
    // Grass base
    ctx.fillStyle = '#4c8a36';
    ctx.fillRect(0, 0, 32, 32);
    // Tall swaying blades
    ctx.fillStyle = '#64ab44';
    ctx.fillRect(4, 8, 3, 20);
    ctx.fillRect(7, 4, 3, 24);
    ctx.fillRect(13, 10, 3, 18);
    ctx.fillRect(16, 6, 3, 22);
    ctx.fillRect(22, 9, 3, 19);
    ctx.fillRect(25, 5, 3, 23);
    // Bright tips
    ctx.fillStyle = '#82cf59';
    ctx.fillRect(7, 2, 3, 4);
    ctx.fillRect(16, 4, 3, 4);
    ctx.fillRect(25, 3, 3, 4);
    // Shaded base
    ctx.fillStyle = '#376926';
    ctx.fillRect(0, 26, 32, 6);
    return canvas;
  }

  function drawDenseTrees() {
    const { canvas, ctx } = createCanvas();
    // Rich green leafy canopy
    ctx.fillStyle = '#22521f';
    ctx.fillRect(0, 0, 32, 32);
    // Canopy volume foliage layers
    ctx.fillStyle = '#2f6e2b';
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#41913b';
    ctx.beginPath();
    ctx.arc(14, 13, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#59b552';
    ctx.beginPath();
    ctx.arc(12, 10, 6, 0, Math.PI * 2);
    ctx.fill();
    // Shadow rim
    ctx.fillStyle = '#173b15';
    ctx.fillRect(0, 28, 32, 4);
    ctx.fillRect(28, 0, 4, 32);
    return canvas;
  }

  function drawPollutedRiver(frame = 0) {
    const { canvas, ctx } = createCanvas();
    // Corrupted river water
    ctx.fillStyle = '#23445e';
    ctx.fillRect(0, 0, 32, 32);
    // Violet corruption swirl
    ctx.fillStyle = '#5b2b73';
    const offset = (frame % 4) * 4;
    ctx.fillRect(0, (2 + offset) % 32, 32, 6);
    ctx.fillRect(0, (18 + offset) % 32, 32, 5);
    // Corrupted foam/bubbles
    ctx.fillStyle = '#b05fd4';
    ctx.fillRect(6, (4 + offset) % 32, 4, 2);
    ctx.fillRect(18, (20 + offset) % 32, 5, 2);
    ctx.fillStyle = '#7de8ea';
    ctx.fillRect(12, (10 + offset) % 32, 6, 2);
    return canvas;
  }

  function drawFarmCrops() {
    const { canvas, ctx } = createCanvas();
    // Furrow soil
    ctx.fillStyle = '#573d26';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#6e4f32';
    ctx.fillRect(0, 2, 32, 6);
    ctx.fillRect(0, 12, 32, 6);
    ctx.fillRect(0, 22, 32, 6);
    // Golden wheat / corn stalks
    ctx.fillStyle = '#d4a837';
    for (let x = 4; x < 32; x += 8) {
      ctx.fillRect(x, 4, 2, 4);
      ctx.fillRect(x - 1, 14, 2, 4);
      ctx.fillRect(x, 24, 2, 4);
      // Wheat ears
      ctx.fillStyle = '#fce468';
      ctx.fillRect(x - 1, 3, 4, 2);
      ctx.fillRect(x - 2, 13, 4, 2);
      ctx.fillRect(x - 1, 23, 4, 2);
      ctx.fillStyle = '#d4a837';
    }
    return canvas;
  }

  // --- COASTAL (RUSTPORT) TILES ---
  function drawCobblestonePier() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#7a766e';
    ctx.fillRect(0, 0, 32, 32);
    // Rounded stones
    ctx.fillStyle = '#8f8b83';
    ctx.fillRect(2, 2, 12, 8);
    ctx.fillRect(16, 2, 14, 8);
    ctx.fillRect(2, 12, 8, 8);
    ctx.fillRect(12, 12, 12, 8);
    ctx.fillRect(26, 12, 5, 8);
    ctx.fillRect(2, 22, 14, 8);
    ctx.fillRect(18, 22, 12, 8);
    // Mortar lines
    ctx.fillStyle = '#5c5850';
    ctx.fillRect(0, 10, 32, 2);
    ctx.fillRect(0, 20, 32, 2);
    ctx.fillRect(14, 0, 2, 10);
    ctx.fillRect(10, 10, 2, 10);
    ctx.fillRect(16, 20, 2, 12);
    return canvas;
  }

  function drawWoodenDock() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#78502d';
    ctx.fillRect(0, 0, 32, 32);
    // Planks
    ctx.fillStyle = '#94663c';
    ctx.fillRect(0, 1, 32, 8);
    ctx.fillRect(0, 11, 32, 8);
    ctx.fillRect(0, 21, 32, 8);
    // Gaps and iron nails
    ctx.fillStyle = '#4f3219';
    ctx.fillRect(0, 9, 32, 2);
    ctx.fillRect(0, 19, 32, 2);
    ctx.fillRect(0, 29, 32, 2);
    // Nails
    ctx.fillStyle = '#2b2219';
    ctx.fillRect(4, 5, 2, 2);
    ctx.fillRect(26, 5, 2, 2);
    ctx.fillRect(4, 15, 2, 2);
    ctx.fillRect(26, 15, 2, 2);
    ctx.fillRect(4, 25, 2, 2);
    ctx.fillRect(26, 25, 2, 2);
    return canvas;
  }

  function drawDeepOcean(frame = 0) {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#11355e';
    ctx.fillRect(0, 0, 32, 32);
    // Ocean rolling waves
    ctx.fillStyle = '#1c4d87';
    const offset = (frame % 4) * 4;
    ctx.fillRect(0, (2 + offset) % 32, 32, 6);
    ctx.fillRect(0, (18 + offset) % 32, 32, 6);
    // White foam wave caps
    ctx.fillStyle = '#5fb3e8';
    ctx.fillRect(4, (4 + offset) % 32, 10, 2);
    ctx.fillRect(18, (20 + offset) % 32, 12, 2);
    ctx.fillStyle = '#d5f0ff';
    ctx.fillRect(8, (4 + offset) % 32, 4, 1);
    ctx.fillRect(22, (20 + offset) % 32, 5, 1);
    return canvas;
  }

  function drawCrate() {
    const { canvas, ctx } = createCanvas();
    // Wood base
    ctx.fillStyle = '#9e6e3f';
    ctx.fillRect(2, 2, 28, 28);
    // Iron/dark wood border
    ctx.fillStyle = '#5e3e20';
    ctx.strokeRect(2.5, 2.5, 27, 27);
    // Diagonal brace
    ctx.beginPath();
    ctx.moveTo(3, 3);
    ctx.lineTo(29, 29);
    ctx.moveTo(29, 3);
    ctx.lineTo(3, 29);
    ctx.strokeStyle = '#5e3e20';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Wood highlight
    ctx.fillStyle = '#bf8a54';
    ctx.fillRect(4, 4, 4, 4);
    // Iron corner brackets
    ctx.fillStyle = '#363430';
    ctx.fillRect(2, 2, 4, 4);
    ctx.fillRect(26, 2, 4, 4);
    ctx.fillRect(2, 26, 4, 4);
    ctx.fillRect(26, 26, 4, 4);
    return canvas;
  }

  // --- SNOW / ICE (WHISPERING PEAKS) TILES ---
  function drawSnowPath() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#e8f0f8';
    ctx.fillRect(0, 0, 32, 32);
    // Soft blue shadows & powder texture
    ctx.fillStyle = '#c8daf0';
    ctx.fillRect(4, 6, 4, 3);
    ctx.fillRect(18, 12, 6, 3);
    ctx.fillRect(8, 22, 5, 3);
    ctx.fillRect(24, 25, 4, 2);
    // Glistening sparkle
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, 4, 2, 2);
    ctx.fillRect(20, 10, 2, 2);
    ctx.fillRect(10, 20, 2, 2);
    return canvas;
  }

  function drawFrostedRock() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#414e61';
    ctx.fillRect(0, 0, 32, 32);
    // Mountain crags
    ctx.fillStyle = '#596980';
    ctx.fillRect(2, 2, 14, 12);
    ctx.fillRect(16, 14, 14, 14);
    // Snow cap
    ctx.fillStyle = '#eaf3ff';
    ctx.fillRect(0, 0, 32, 6);
    ctx.fillRect(4, 6, 12, 3);
    ctx.fillRect(18, 6, 8, 2);
    // Dark crevice
    ctx.fillStyle = '#26303d';
    ctx.fillRect(0, 16, 16, 2);
    ctx.fillRect(14, 14, 2, 16);
    return canvas;
  }

  function drawSlickIce() {
    const { canvas, ctx } = createCanvas();
    // Glassy cyan ice
    ctx.fillStyle = '#77cbe6';
    ctx.fillRect(0, 0, 32, 32);
    // Frozen fracture lines
    ctx.fillStyle = '#a6e7fa';
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(14, 16);
    ctx.lineTo(26, 12);
    ctx.lineTo(32, 20);
    ctx.strokeStyle = '#c6f5ff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Mirror specular glare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(4, 4, 12, 2);
    ctx.fillRect(18, 22, 10, 2);
    ctx.fillRect(6, 6, 2, 2);
    return canvas;
  }

  // --- WASTELANDS (RUINED KEEP) TILES ---
  function drawWastelandStone() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#2c2730';
    ctx.fillRect(0, 0, 32, 32);
    // Volcanic ash & obsidian
    ctx.fillStyle = '#3f3845';
    ctx.fillRect(2, 2, 13, 13);
    ctx.fillRect(17, 2, 13, 13);
    ctx.fillRect(2, 17, 13, 13);
    ctx.fillRect(17, 17, 13, 13);
    // Glowing purple fissures
    ctx.fillStyle = '#8f29c2';
    ctx.fillRect(0, 15, 32, 1);
    ctx.fillRect(15, 0, 1, 32);
    ctx.fillStyle = '#e861ff';
    ctx.fillRect(6, 15, 4, 1);
    ctx.fillRect(15, 22, 1, 4);
    return canvas;
  }

  function drawRuinedWall() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#1c1821';
    ctx.fillRect(0, 0, 32, 32);
    // Broken stone battlements
    ctx.fillStyle = '#332d3d';
    ctx.fillRect(1, 1, 12, 7);
    ctx.fillRect(15, 1, 15, 7);
    ctx.fillRect(1, 10, 22, 7);
    ctx.fillRect(1, 19, 14, 7);
    ctx.fillRect(17, 19, 14, 7);
    // Purple shadow seepage
    ctx.fillStyle = '#651c8a';
    ctx.fillRect(6, 8, 2, 5);
    ctx.fillRect(20, 17, 2, 4);
    return canvas;
  }

  function drawShadowFirePit(frame = 0) {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#1a1421';
    ctx.fillRect(0, 0, 32, 32);
    // Fire rim
    ctx.fillStyle = '#473657';
    ctx.beginPath();
    ctx.arc(16, 16, 13, 0, Math.PI * 2);
    ctx.fill();
    // Violet void fire
    const offset = (frame % 4) * 2;
    ctx.fillStyle = '#8f20c9';
    ctx.beginPath();
    ctx.arc(16, 16 - offset, 9, 0, Math.PI * 2);
    ctx.fill();
    // Bright core
    ctx.fillStyle = '#f375ff';
    ctx.beginPath();
    ctx.arc(16, 15, 5, 0, Math.PI * 2);
    ctx.fill();
    return canvas;
  }

  // --- RESTORED / EPILOGUE TILES ---
  function drawGoldenMarble() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#f7eed4';
    ctx.fillRect(0, 0, 32, 32);
    // Polished marble tiles
    ctx.fillStyle = '#fff9eb';
    ctx.fillRect(1, 1, 14, 14);
    ctx.fillRect(17, 1, 14, 14);
    ctx.fillRect(1, 17, 14, 14);
    ctx.fillRect(17, 17, 14, 14);
    // Golden veins
    ctx.fillStyle = '#e6c86a';
    ctx.fillRect(4, 5, 6, 1);
    ctx.fillRect(9, 6, 1, 4);
    ctx.fillRect(20, 21, 8, 1);
    // Gold mortar
    ctx.fillStyle = '#d4ae48';
    ctx.fillRect(0, 15, 32, 2);
    ctx.fillRect(15, 0, 2, 32);
    return canvas;
  }

  function drawGoldenCarpet() {
    const { canvas, ctx } = createCanvas();
    ctx.fillStyle = '#3a5099';
    ctx.fillRect(0, 0, 32, 32);
    // Royal gold trim
    ctx.fillStyle = '#ffcf40';
    ctx.fillRect(0, 0, 3, 32);
    ctx.fillRect(29, 0, 3, 32);
    // Star motifs
    ctx.fillStyle = '#ffeaa6';
    ctx.fillRect(15, 8, 2, 2);
    ctx.fillRect(14, 9, 4, 1);
    ctx.fillRect(15, 23, 2, 2);
    ctx.fillRect(14, 24, 4, 1);
    return canvas;
  }

  function drawFlowerPillar() {
    const { canvas, ctx } = createCanvas();
    ctx.drawImage(drawGoldenMarble(), 0, 0);
    // White marble column
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 4, 16, 24);
    ctx.fillStyle = '#f0d999';
    ctx.fillRect(6, 2, 20, 3);
    ctx.fillRect(6, 26, 20, 4);
    // Woven ivy & blossom garlands
    ctx.fillStyle = '#4ba84a';
    ctx.fillRect(9, 8, 4, 3);
    ctx.fillRect(18, 14, 4, 3);
    ctx.fillRect(10, 20, 4, 3);
    // Pink & gold petals
    ctx.fillStyle = '#ff7dbb';
    ctx.fillRect(12, 9, 2, 2);
    ctx.fillRect(17, 15, 2, 2);
    return canvas;
  }

  // --- INIT AND ACCESSOR ---
  function init() {
    // Castle
    cache['stone_floor'] = drawStoneFloor();
    cache['stone_wall'] = drawStoneWall();
    cache['red_carpet'] = drawRedCarpet();
    cache['pillar'] = drawPillar();
    cache['aegis_crystal'] = drawAegisCrystal(false);
    cache['crystal_altar'] = drawAegisCrystal(true);
    cache['sanctum_wall'] = drawStoneWall();
    cache['signpost'] = drawSignpost();
    cache['sanctum_gate'] = drawSanctumGate();
    cache['wall_torch'] = drawWallTorch(0);
    cache['sewer_grate_open'] = drawSewerGrateOpen(0);
    cache['sunlit_exit'] = drawSunlitExit();

    // Sewer
    cache['sewer_stone'] = drawSewerStone();
    cache['sewer_wall'] = drawSewerWall();
    cache['sewer_water'] = drawSewerWater(0);
    cache['slimy_growth'] = drawTallWildGrass();

    // Pastoral
    cache['meadow_grass'] = drawMeadowGrass();
    cache['tall_wild_grass'] = drawTallWildGrass();
    cache['dense_trees'] = drawDenseTrees();
    cache['polluted_river'] = drawPollutedRiver(0);
    cache['farm_crops'] = drawFarmCrops();

    // Coastal
    cache['cobblestone_pier'] = drawCobblestonePier();
    cache['wooden_dock'] = drawWoodenDock();
    cache['deep_ocean'] = drawDeepOcean(0);
    cache['warehouse_wall'] = drawStoneWall();
    cache['crate'] = drawCrate();
    cache['seaweed_patch'] = drawTallWildGrass();

    // Snow
    cache['snow_path'] = drawSnowPath();
    cache['frosted_rock'] = drawFrostedRock();
    cache['slick_ice'] = drawSlickIce();
    cache['monastery_pillar'] = drawPillar();

    // Wasteland
    cache['wasteland_stone'] = drawWastelandStone();
    cache['ruined_wall'] = drawRuinedWall();
    cache['shadow_fire_pit'] = drawShadowFirePit(0);
    cache['void_altar'] = drawAegisCrystal(true);

    // Epilogue
    cache['golden_marble'] = drawGoldenMarble();
    cache['radiant_wall'] = drawStoneWall();
    cache['golden_carpet'] = drawGoldenCarpet();
    cache['flower_pillar'] = drawFlowerPillar();
    cache['aegis_crystal_whole'] = drawAegisCrystal(false);
    cache['sanctum_pedestal'] = drawAegisCrystal(false);
    cache['sanctum_arch'] = drawStoneWall();
  }

  return {
    init,
    getTile(name, animFrame = 0) {
      if (name === 'sewer_water') return drawSewerWater(animFrame);
      if (name === 'polluted_river') return drawPollutedRiver(animFrame);
      if (name === 'deep_ocean') return drawDeepOcean(animFrame);
      if (name === 'shadow_fire_pit') return drawShadowFirePit(animFrame);
      if (name === 'wall_torch') return drawWallTorch(animFrame);
      if (name === 'sewer_grate_open') return drawSewerGrateOpen(animFrame);
      return cache[name] || cache['stone_floor'];
    },
    TILE_SIZE
  };
})();

if (typeof window !== 'undefined') {
  window.TileGenerator = TileGenerator;
}
