/**
 * Crown of the Wilds - Procedural Sprite Generator
 * Generates characters, NPCs, and Aura Spirits dynamically using HTML5 Canvas drawing functions.
 * Supports 4-directional walking frames for characters and detailed battle portraits for spirits.
 */

const SpriteGenerator = (function() {
  const SPRITE_SIZE = 32;
  const BATTLE_SIZE = 72;
  const cache = {};

  function createCanvas(w = SPRITE_SIZE, h = SPRITE_SIZE) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas: c, ctx: ctx };
  }

  // Helper for drawing pixel blocks
  function px(ctx, color, x, y, w = 1, h = 1) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  // --- OVERWORLD CHARACTERS ---

  /**
   * Generates Aurelia sprite based on costume: 'royal', 'traveler', 'queen'
   */
  function drawAurelia(direction = 'down', frame = 0, costume = 'traveler') {
    const { canvas, ctx } = createCanvas();
    const walkOffset = (frame === 1) ? -1 : (frame === 2 ? 1 : 0);

    const hairColor = '#f5c842';
    const skinColor = '#fed3b1';
    const eyeColor = '#2b7fb3';
    let cloakColor = '#2a4870';
    let cloakTrim = '#5684ba';
    let dressColor = '#d9dfe8';

    if (costume === 'royal') {
      cloakColor = '#8a1f2e';
      cloakTrim = '#d4af37';
      dressColor = '#f2ebe4';
    } else if (costume === 'queen') {
      cloakColor = '#4a2574';
      cloakTrim = '#f3c938';
      dressColor = '#fff5de';
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(16, 28, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    if (direction === 'down') {
      // Hair back
      px(ctx, hairColor, 10, 8, 12, 10);
      // Face
      px(ctx, skinColor, 11, 8, 10, 8);
      // Bangs
      px(ctx, hairColor, 10, 6, 12, 4);
      px(ctx, hairColor, 9, 8, 2, 7);
      px(ctx, hairColor, 21, 8, 2, 7);
      // Eyes
      px(ctx, eyeColor, 13, 11, 2, 2);
      px(ctx, eyeColor, 17, 11, 2, 2);
      // Cheeks blush
      px(ctx, '#fca5a5', 12, 13, 1, 1);
      px(ctx, '#fca5a5', 19, 13, 1, 1);
      // Headwear
      if (costume === 'royal' || costume === 'queen') {
        px(ctx, '#ffd700', 12, 4, 8, 3);
        px(ctx, '#fff', 15, 3, 2, 2);
      } else {
        // Traveler's hood / mantle
        px(ctx, cloakColor, 9, 5, 14, 3);
        px(ctx, cloakTrim, 9, 5, 14, 1);
      }
      // Torso / Dress
      px(ctx, dressColor, 12, 16, 8, 8);
      px(ctx, cloakColor, 10, 16, 2, 8);
      px(ctx, cloakColor, 20, 16, 2, 8);
      px(ctx, cloakTrim, 14, 16, 4, 8);
      // Aegis Core pendant
      px(ctx, '#4dd2ff', 15, 17, 2, 2);
      // Legs / Boots
      px(ctx, '#453529', 12 + walkOffset, 24, 3, 5);
      px(ctx, '#453529', 17 - walkOffset, 24, 3, 5);
    } else if (direction === 'up') {
      // Full back hair
      px(ctx, hairColor, 10, 6, 12, 14);
      px(ctx, '#dca926', 11, 10, 10, 9);
      if (costume === 'traveler') {
        px(ctx, cloakColor, 9, 5, 14, 4);
      }
      // Cloak mantle back
      px(ctx, cloakColor, 10, 16, 12, 9);
      px(ctx, cloakTrim, 11, 23, 10, 2);
      // Boots
      px(ctx, '#453529', 12 + walkOffset, 25, 3, 4);
      px(ctx, '#453529', 17 - walkOffset, 25, 3, 4);
    } else if (direction === 'left') {
      // Hair
      px(ctx, hairColor, 11, 6, 10, 11);
      // Face profile
      px(ctx, skinColor, 10, 9, 7, 7);
      px(ctx, eyeColor, 11, 11, 2, 2);
      // Headwear
      if (costume === 'royal' || costume === 'queen') {
        px(ctx, '#ffd700', 11, 4, 7, 3);
      } else {
        px(ctx, cloakColor, 10, 5, 10, 3);
      }
      // Body
      px(ctx, dressColor, 12, 16, 7, 8);
      px(ctx, cloakColor, 15, 16, 4, 9);
      // Legs
      px(ctx, '#453529', 13 + walkOffset * 2, 24, 3, 5);
      px(ctx, '#30241c', 15 - walkOffset * 2, 24, 3, 5);
    } else if (direction === 'right') {
      // Mirror of left
      ctx.save();
      ctx.translate(32, 0);
      ctx.scale(-1, 1);
      const leftCanvas = drawAurelia('left', frame, costume);
      ctx.drawImage(leftCanvas, 0, 0);
      ctx.restore();
    }
    return canvas;
  }

  /**
   * Lord Malakor
   */
  function drawMalakor(direction = 'down', frame = 0) {
    const { canvas, ctx } = createCanvas();
    const walkOffset = (frame === 1) ? -1 : (frame === 2 ? 1 : 0);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(16, 28, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark sorcerer robes & silver hair
    px(ctx, '#22162b', 10, 15, 12, 11);
    px(ctx, '#67218a', 12, 15, 8, 11);
    px(ctx, '#d4af37', 15, 16, 2, 2); // Corrupted talisman
    // Face
    px(ctx, '#e0cfbe', 11, 8, 10, 7);
    // Dark goatee
    px(ctx, '#454552', 14, 14, 4, 3);
    // Silver slicked hair
    px(ctx, '#b0b5c0', 10, 5, 12, 4);
    px(ctx, '#b0b5c0', 9, 8, 2, 6);
    px(ctx, '#b0b5c0', 21, 8, 2, 6);
    // Piercing crimson eyes
    px(ctx, '#ff2e54', 13, 10, 2, 2);
    px(ctx, '#ff2e54', 17, 10, 2, 2);
    // Boots
    px(ctx, '#110c14', 12 + walkOffset, 26, 3, 3);
    px(ctx, '#110c14', 17 - walkOffset, 26, 3, 3);
    return canvas;
  }

  /**
   * Generic NPC generator
   */
  function drawNPC(type = 'scholar', direction = 'down') {
    const { canvas, ctx } = createCanvas();
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(16, 28, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    if (type === 'scholar') {
      // Alistair
      px(ctx, '#4a6fa5', 10, 15, 12, 11);
      px(ctx, '#fed3b1', 11, 8, 10, 7);
      px(ctx, '#70543e', 10, 5, 12, 4);
      px(ctx, '#1f3c6e', 13, 10, 2, 2);
      px(ctx, '#1f3c6e', 17, 10, 2, 2);
      // Spectacles
      px(ctx, '#ffd700', 12, 10, 4, 1);
      px(ctx, '#ffd700', 16, 10, 4, 1);
      // Scroll in hand
      px(ctx, '#ede5cf', 7, 18, 4, 6);
    } else if (type === 'chancellor') {
      // Vance
      px(ctx, '#5c2c35', 10, 15, 12, 11);
      px(ctx, '#ffd700', 11, 16, 10, 2);
      px(ctx, '#fed3b1', 11, 8, 10, 7);
      px(ctx, '#cfd4de', 10, 5, 12, 4);
      px(ctx, '#333', 13, 10, 2, 2);
      px(ctx, '#333', 17, 10, 2, 2);
    } else if (type === 'guard') {
      // Royal Guard
      px(ctx, '#7d8794', 10, 14, 12, 12);
      px(ctx, '#b0b8c4', 10, 6, 12, 8); // Helmet
      px(ctx, '#c72c41', 14, 2, 4, 5);  // Plume
      px(ctx, '#1a1d21', 12, 10, 8, 2); // Visor slit
      // Spear
      px(ctx, '#8a6542', 23, 4, 2, 24);
      px(ctx, '#d6dee8', 22, 2, 4, 5);
    } else if (type === 'mayor') {
      // Cedric
      px(ctx, '#387346', 10, 15, 12, 11);
      px(ctx, '#694a2b', 12, 15, 8, 8);
      px(ctx, '#fed3b1', 11, 8, 10, 7);
      px(ctx, '#543d2b', 12, 13, 8, 2); // Mustache
      px(ctx, '#8c6b4d', 10, 5, 12, 4);
    } else if (type === 'farmer') {
      // Barnaby
      px(ctx, '#3b628a', 10, 17, 12, 9);
      px(ctx, '#fed3b1', 11, 9, 10, 7);
      // Straw hat
      px(ctx, '#d4b359', 8, 6, 16, 3);
      px(ctx, '#b89639', 11, 3, 10, 4);
    } else if (type === 'captain') {
      // Drake
      px(ctx, '#1f3152', 9, 14, 14, 12);
      px(ctx, '#ffd700', 11, 15, 10, 1);
      px(ctx, '#fed3b1', 11, 8, 10, 7);
      // Tricorn hat
      px(ctx, '#111b2b', 7, 4, 18, 4);
      px(ctx, '#ffd700', 7, 4, 18, 1);
      // Eyepatch
      px(ctx, '#111', 12, 10, 3, 2);
    } else if (type === 'dockworker') {
      // Silas
      px(ctx, '#8c483b', 10, 15, 12, 11);
      px(ctx, '#fed3b1', 11, 8, 10, 7);
      px(ctx, '#b53a26', 10, 6, 12, 3); // Red bandana
    } else if (type === 'monk') {
      // Kaelen / Tomas
      px(ctx, '#e3dcd1', 9, 14, 14, 12);
      px(ctx, '#c47d2b', 12, 14, 8, 12); // Saffron sash
      px(ctx, '#fed3b1', 11, 8, 10, 7);
      px(ctx, '#8f7e6f', 11, 6, 10, 3);
    }
    return canvas;
  }

  // --- SPIRIT OVERWORLD SPRITES (32x32) ---
  function drawSpiritOverworld(spiritId, isCorrupted = false) {
    const { canvas, ctx } = createCanvas();
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(16, 26, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    if (spiritId === 'pyropaw') {
      const bodyColor = isCorrupted ? '#2e1c3b' : '#ff7a29';
      const flameColor = isCorrupted ? '#a82ee6' : '#ffd03b';
      const eyeColor = isCorrupted ? '#ff1e42' : '#2b5ea8';

      // Fox body
      px(ctx, bodyColor, 10, 15, 12, 9);
      // Fox head
      px(ctx, bodyColor, 9, 9, 14, 8);
      // White muzzle
      px(ctx, isCorrupted ? '#483557' : '#fff5eb', 12, 13, 8, 4);
      // Pointed ears
      px(ctx, bodyColor, 9, 5, 4, 5);
      px(ctx, bodyColor, 19, 5, 4, 5);
      px(ctx, flameColor, 10, 6, 2, 3);
      px(ctx, flameColor, 20, 6, 2, 3);
      // Eyes
      px(ctx, eyeColor, 11, 11, 2, 2);
      px(ctx, eyeColor, 19, 11, 2, 2);
      // Flame tail
      px(ctx, flameColor, 4, 14, 6, 6);
      px(ctx, isCorrupted ? '#e861ff' : '#ff4422', 2, 12, 4, 4);
      // Paws
      px(ctx, bodyColor, 10, 24, 3, 3);
      px(ctx, bodyColor, 19, 24, 3, 3);
    } else if (spiritId === 'sylphwing') {
      const wingColor = isCorrupted ? '#441d57' : '#4ade80';
      const bodyColor = isCorrupted ? '#201626' : '#f0fdf4';
      // Butterfly / Fairy spirit
      px(ctx, bodyColor, 14, 10, 4, 12);
      // Glowing wings
      px(ctx, wingColor, 6, 8, 8, 8);
      px(ctx, wingColor, 18, 8, 8, 8);
      px(ctx, isCorrupted ? '#9333ea' : '#86efac', 8, 16, 6, 6);
      px(ctx, isCorrupted ? '#9333ea' : '#86efac', 18, 16, 6, 6);
      // Antennae
      px(ctx, isCorrupted ? '#c084fc' : '#facc15', 13, 6, 2, 4);
      px(ctx, isCorrupted ? '#c084fc' : '#facc15', 17, 6, 2, 4);
    } else if (spiritId === 'bramblehorn') {
      // Sweeping-horned cattle
      const fur = isCorrupted ? '#3b2339' : '#8f5635';
      const horn = isCorrupted ? '#7c2d82' : '#ded1b8';
      px(ctx, fur, 7, 12, 18, 12);
      px(ctx, fur, 10, 8, 12, 8);
      // Sweeping curved horns
      px(ctx, horn, 4, 5, 7, 3);
      px(ctx, horn, 21, 5, 7, 3);
      px(ctx, horn, 3, 3, 3, 3);
      px(ctx, horn, 26, 3, 3, 3);
      // Eyes
      px(ctx, isCorrupted ? '#ff1a3c' : '#222', 12, 11, 2, 2);
      px(ctx, isCorrupted ? '#ff1a3c' : '#222', 18, 11, 2, 2);
    } else if (spiritId === 'mudtoad') {
      // Act 1 Boss
      const skin = isCorrupted ? '#291833' : '#4d733b';
      const belly = isCorrupted ? '#5a2e70' : '#8fbf67';
      px(ctx, skin, 6, 12, 20, 14);
      px(ctx, belly, 10, 16, 12, 8);
      // Big bulging eyes
      px(ctx, skin, 7, 8, 5, 5);
      px(ctx, skin, 20, 8, 5, 5);
      px(ctx, isCorrupted ? '#ff264a' : '#ffe14a', 8, 9, 3, 3);
      px(ctx, isCorrupted ? '#ff264a' : '#ffe14a', 21, 9, 3, 3);
      // Back moss / crystal shard
      if (isCorrupted) {
        px(ctx, '#bf36e3', 14, 9, 4, 5);
      } else {
        px(ctx, '#ff80bf', 14, 9, 4, 4); // Lotus bloom
      }
    } else if (spiritId === 'abyssalcrab') {
      // Act 2 Boss
      const shell = isCorrupted ? '#1c1b33' : '#2b5ea8';
      const claws = isCorrupted ? '#691c78' : '#e06238';
      px(ctx, shell, 8, 12, 16, 12);
      // Claws
      px(ctx, claws, 3, 9, 6, 6);
      px(ctx, claws, 23, 9, 6, 6);
      // Eye stalks
      px(ctx, shell, 11, 8, 3, 4);
      px(ctx, shell, 18, 8, 3, 4);
      px(ctx, isCorrupted ? '#ff1a40' : '#ffff66', 11, 7, 3, 2);
      px(ctx, isCorrupted ? '#ff1a40' : '#ffff66', 18, 7, 3, 2);
    } else if (spiritId === 'icewyvern') {
      // Act 3 Boss
      const scale = isCorrupted ? '#1a243d' : '#88dbfc';
      const wing = isCorrupted ? '#481f6e' : '#e0f7ff';
      px(ctx, scale, 12, 10, 8, 14);
      px(ctx, scale, 11, 6, 10, 6); // Head
      // Icicle wings
      px(ctx, wing, 4, 8, 8, 12);
      px(ctx, wing, 20, 8, 8, 12);
      // Eyes
      px(ctx, isCorrupted ? '#ff1e38' : '#3366cc', 13, 8, 2, 2);
      px(ctx, isCorrupted ? '#ff1e38' : '#3366cc', 17, 8, 2, 2);
    } else if (spiritId === 'shadow_chimera' || spiritId === 'chimera') {
      // Climax Final Boss
      const body = isCorrupted ? '#150f1f' : '#f5e4bc';
      const mane = isCorrupted ? '#5a1980' : '#e09e36';
      px(ctx, body, 8, 10, 16, 14);
      // Lion head & horns
      px(ctx, mane, 6, 6, 20, 10);
      px(ctx, body, 10, 8, 12, 8);
      px(ctx, '#7b2bb8', 8, 3, 4, 5);
      px(ctx, '#7b2bb8', 20, 3, 4, 5);
      // Terrifying eyes
      px(ctx, isCorrupted ? '#ff0033' : '#4a90e2', 12, 10, 3, 2);
      px(ctx, isCorrupted ? '#ff0033' : '#4a90e2', 17, 10, 3, 2);
      // Demon wings
      px(ctx, isCorrupted ? '#3b1054' : '#69b0fa', 2, 6, 6, 14);
      px(ctx, isCorrupted ? '#3b1054' : '#69b0fa', 24, 6, 6, 14);
    } else {
      // Default wild spirit (sparkfin, frostlynx, etc.)
      const col = isCorrupted ? '#38204d' : '#3ba6bf';
      px(ctx, col, 10, 12, 12, 12);
      px(ctx, isCorrupted ? '#e036e6' : '#ffd03b', 12, 10, 8, 4);
      px(ctx, isCorrupted ? '#ff1a3c' : '#222', 12, 14, 2, 2);
      px(ctx, isCorrupted ? '#ff1a3c' : '#222', 18, 14, 2, 2);
    }

    // Corrupted purple miasma particles
    if (isCorrupted) {
      ctx.fillStyle = 'rgba(168, 46, 230, 0.6)';
      ctx.fillRect(4, 8, 3, 3);
      ctx.fillRect(25, 12, 2, 3);
      ctx.fillRect(8, 22, 2, 2);
      ctx.fillRect(22, 20, 3, 2);
    }
    return canvas;
  }

  // --- DETAILED BATTLE SPRITES (72x72) ---
  function drawSpiritBattle(spiritId, isCorrupted = false, isBack = false) {
    const { canvas, ctx } = createCanvas(BATTLE_SIZE, BATTLE_SIZE);

    // Dynamic pedestal shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(36, 62, 24, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    if (spiritId === 'pyropaw') {
      const primary = isCorrupted ? '#2e1c3b' : '#ff7315';
      const flame = isCorrupted ? '#b532f0' : '#ffcf33';
      const flameCore = isCorrupted ? '#ff66ff' : '#ffffff';
      const whiteFur = isCorrupted ? '#493757' : '#fff3e3';

      if (!isBack) {
        // Front View
        // Body
        px(ctx, primary, 26, 32, 20, 24);
        // Chest fluff
        px(ctx, whiteFur, 30, 34, 12, 16);
        // Head
        px(ctx, primary, 22, 18, 28, 18);
        px(ctx, whiteFur, 28, 26, 16, 10);
        // Ears
        px(ctx, primary, 20, 8, 8, 12);
        px(ctx, primary, 44, 8, 8, 12);
        px(ctx, flame, 22, 10, 4, 8);
        px(ctx, flame, 46, 10, 4, 8);
        // Eyes
        px(ctx, isCorrupted ? '#ff1438' : '#215ba6', 26, 22, 4, 4);
        px(ctx, isCorrupted ? '#ff1438' : '#215ba6', 42, 22, 4, 4);
        px(ctx, '#fff', 27, 23, 2, 2);
        px(ctx, '#fff', 43, 23, 2, 2);
        // Snout
        px(ctx, '#22110c', 35, 29, 2, 2);
        // Paws
        px(ctx, primary, 24, 52, 6, 8);
        px(ctx, primary, 42, 52, 6, 8);
        // Majestic flame tail
        px(ctx, flame, 10, 24, 14, 18);
        px(ctx, flameCore, 12, 26, 8, 10);
      } else {
        // Back View (Aurelia's companion view)
        px(ctx, primary, 24, 30, 24, 26);
        px(ctx, primary, 22, 16, 28, 18);
        // Back of ears
        px(ctx, primary, 20, 8, 8, 12);
        px(ctx, primary, 44, 8, 8, 12);
        // Big radiant flame tail curling forward
        px(ctx, flame, 34, 20, 22, 26);
        px(ctx, flameCore, 38, 24, 14, 16);
        px(ctx, primary, 26, 52, 7, 8);
        px(ctx, primary, 39, 52, 7, 8);
      }
    } else if (spiritId === 'mudtoad') {
      // Goliath Mud-Toad (Boss)
      const skin = isCorrupted ? '#2b1b36' : '#4d753b';
      const belly = isCorrupted ? '#582b6e' : '#8bb860';
      const wart = isCorrupted ? '#c038e8' : '#e3843b';

      px(ctx, skin, 14, 24, 44, 32);
      px(ctx, belly, 22, 34, 28, 20);
      // Eyes
      px(ctx, skin, 16, 14, 12, 12);
      px(ctx, skin, 44, 14, 12, 12);
      px(ctx, isCorrupted ? '#ff1438' : '#ffd033', 18, 16, 8, 8);
      px(ctx, isCorrupted ? '#ff1438' : '#ffd033', 46, 16, 8, 8);
      px(ctx, '#000', 21, 19, 3, 3);
      px(ctx, '#000', 49, 19, 3, 3);
      // Warts / Fragment 1
      px(ctx, wart, 20, 28, 6, 5);
      px(ctx, wart, 46, 28, 6, 5);
      // Fragment 1 glowing embedded crystal!
      px(ctx, '#3bd9ff', 33, 16, 6, 8);
      px(ctx, '#ffffff', 34, 18, 3, 4);
      // Arms
      px(ctx, skin, 8, 38, 10, 16);
      px(ctx, skin, 54, 38, 10, 16);
    } else if (spiritId === 'abyssalcrab') {
      // Abyssal Crab (Boss 2)
      const shell = isCorrupted ? '#1c1b33' : '#265494';
      const pincer = isCorrupted ? '#701e82' : '#e0582b';
      px(ctx, shell, 18, 26, 36, 26);
      // Massive claws
      px(ctx, pincer, 4, 18, 16, 18);
      px(ctx, pincer, 52, 18, 16, 18);
      // Claws teeth
      px(ctx, '#fff', 8, 24, 6, 3);
      px(ctx, '#fff', 58, 24, 6, 3);
      // Eye stalks
      px(ctx, shell, 26, 16, 6, 12);
      px(ctx, shell, 40, 16, 6, 12);
      px(ctx, isCorrupted ? '#ff1438' : '#ffe142', 26, 14, 6, 5);
      px(ctx, isCorrupted ? '#ff1438' : '#ffe142', 40, 14, 6, 5);
      // Fragment 2 embedded in carapace
      px(ctx, '#3bd9ff', 33, 32, 6, 8);
      px(ctx, '#ffffff', 34, 34, 3, 4);
    } else if (spiritId === 'icewyvern') {
      // Ice-Wyvern (Boss 3)
      const scale = isCorrupted ? '#18243b' : '#73cbf2';
      const wing = isCorrupted ? '#48196e' : '#dff3fc';
      px(ctx, scale, 26, 22, 20, 32);
      // Dragon head & horns
      px(ctx, scale, 24, 12, 24, 14);
      px(ctx, '#d0f0ff', 20, 6, 6, 10);
      px(ctx, '#d0f0ff', 46, 6, 6, 10);
      // Eyes
      px(ctx, isCorrupted ? '#ff1438' : '#2255aa', 28, 16, 4, 4);
      px(ctx, isCorrupted ? '#ff1438' : '#2255aa', 40, 16, 4, 4);
      // Frost wings
      px(ctx, wing, 4, 16, 20, 28);
      px(ctx, wing, 48, 16, 20, 28);
      // Fragment 3 embedded
      px(ctx, '#3bd9ff', 33, 28, 6, 8);
      px(ctx, '#ffffff', 34, 30, 3, 4);
    } else if (spiritId === 'shadow_chimera' || spiritId === 'chimera') {
      // Final Boss
      const body = isCorrupted ? '#140c1f' : '#f7e2b7';
      const mane = isCorrupted ? '#631891' : '#e0982d';
      px(ctx, body, 18, 24, 36, 30);
      // Lion mane & dragon horns
      px(ctx, mane, 12, 12, 48, 22);
      px(ctx, body, 22, 16, 28, 18);
      // Void horns
      px(ctx, '#a826e8', 16, 4, 8, 12);
      px(ctx, '#a826e8', 48, 4, 8, 12);
      // Eyes
      px(ctx, isCorrupted ? '#ff0033' : '#4a90e2', 26, 20, 6, 4);
      px(ctx, isCorrupted ? '#ff0033' : '#4a90e2', 40, 20, 6, 4);
      // Demon wings
      px(ctx, isCorrupted ? '#380f52' : '#69b0fa', 2, 14, 18, 34);
      px(ctx, isCorrupted ? '#380f52' : '#69b0fa', 52, 14, 18, 34);
      // Serpent tail with void fire
      px(ctx, isCorrupted ? '#ff26a8' : '#ffd03b', 4, 10, 8, 8);
    } else {
      // Wild spirit (bramblehorn, sylphwing, etc.)
      px(ctx, isCorrupted ? '#2e1c3b' : '#3ba6bf', 22, 24, 28, 28);
      px(ctx, isCorrupted ? '#ff1438' : '#ffd03b', 26, 20, 20, 10);
      px(ctx, '#fff', 28, 28, 4, 4);
      px(ctx, '#fff', 40, 28, 4, 4);
    }

    // Corrupted dark aura tendrils
    if (isCorrupted) {
      ctx.fillStyle = 'rgba(180, 40, 240, 0.5)';
      ctx.fillRect(8, 10, 4, 8);
      ctx.fillRect(58, 12, 4, 8);
      ctx.fillRect(16, 50, 6, 4);
      ctx.fillRect(50, 48, 6, 4);
    }
    return canvas;
  }

  function init() {
    // Pre-cache primary Aurelia forms
    ['down', 'up', 'left', 'right'].forEach(dir => {
      [0, 1, 2].forEach(frame => {
        cache[`aurelia_traveler_${dir}_${frame}`] = drawAurelia(dir, frame, 'traveler');
        cache[`aurelia_royal_${dir}_${frame}`] = drawAurelia(dir, frame, 'royal');
        cache[`aurelia_queen_${dir}_${frame}`] = drawAurelia(dir, frame, 'queen');
      });
    });

    // NPCs
    ['scholar', 'chancellor', 'guard', 'mayor', 'farmer', 'captain', 'dockworker', 'monk'].forEach(t => {
      cache[`npc_${t}`] = drawNPC(t, 'down');
    });
    cache['npc_malakor'] = drawMalakor('down', 0);

    // Overworld Spirits
    const spirits = ['pyropaw', 'sylphwing', 'bramblehorn', 'mudtoad', 'abyssalcrab', 'icewyvern', 'shadow_chimera'];
    spirits.forEach(s => {
      cache[`spirit_ow_${s}_clean`] = drawSpiritOverworld(s, false);
      cache[`spirit_ow_${s}_corrupt`] = drawSpiritOverworld(s, true);
      cache[`spirit_bat_${s}_front`] = drawSpiritBattle(s, true, false);
      cache[`spirit_bat_${s}_front_clean`] = drawSpiritBattle(s, false, false);
      cache[`spirit_bat_${s}_back`] = drawSpiritBattle(s, false, true);
    });
  }

  return {
    init,
    getAurelia(dir = 'down', frame = 0, costume = 'traveler') {
      const key = `aurelia_${costume}_${dir}_${frame}`;
      return cache[key] || drawAurelia(dir, frame, costume);
    },
    getNPC(type) {
      return cache[`npc_${type}`] || drawNPC(type);
    },
    getSpiritOverworld(id, isCorrupted = false) {
      const key = `spirit_ow_${id}_${isCorrupted ? 'corrupt' : 'clean'}`;
      return cache[key] || drawSpiritOverworld(id, isCorrupted);
    },
    getSpiritBattle(id, isCorrupted = false, isBack = false) {
      if (isBack) return cache[`spirit_bat_${id}_back`] || drawSpiritBattle(id, false, true);
      const key = `spirit_bat_${id}_${isCorrupted ? 'front' : 'front_clean'}`;
      return cache[key] || drawSpiritBattle(id, isCorrupted, false);
    },
    SPRITE_SIZE,
    BATTLE_SIZE
  };
})();

if (typeof window !== 'undefined') {
  window.SpriteGenerator = SpriteGenerator;
}
