/**
 * Crown of the Wilds - Dialogue Engine
 * Manages character dialogue trees, animated text typing, character portraits,
 * and cutscene slide sequences.
 */

const DialogueEngine = (function() {
  let active = false;
  let currentSequence = [];
  let currentIndex = 0;
  let displayedText = '';
  let fullText = '';
  let typingTimer = null;
  let isTyping = false;
  let currentSpeaker = '';
  let currentPortrait = null;
  let onSequenceComplete = null;

  function startDialogue(npc) {
    active = true;
    currentSpeaker = npc.name;
    fullText = npc.dialogue || '...';
    displayedText = '';
    currentSequence = [];
    currentIndex = 0;
    currentPortrait = npc.sprite;
    onSequenceComplete = null;
    startTyping();
  }

  function showCutscene(slides, onComplete = null) {
    if (!slides || slides.length === 0) return;
    active = true;
    currentSequence = slides;
    currentIndex = 0;
    onSequenceComplete = onComplete;
    loadSlide(0);
  }

  function loadSlide(index) {
    const slide = currentSequence[index];
    currentSpeaker = slide.speaker || '';
    fullText = slide.text || '';
    displayedText = '';
    currentPortrait = slide.speaker.toLowerCase().includes('aurelia') ? 'aurelia' : (slide.speaker.toLowerCase().includes('malakor') ? 'malakor' : null);
    if (slide.action) {
      slide.action();
    }
    startTyping();
  }

  function showObjectText(title, description) {
    active = true;
    currentSpeaker = title;
    fullText = description;
    displayedText = '';
    currentSequence = [];
    currentIndex = 0;
    currentPortrait = null;
    onSequenceComplete = null;
    startTyping();
  }

  function startTyping() {
    if (typingTimer) clearInterval(typingTimer);
    isTyping = true;
    let charIndex = 0;

    typingTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        displayedText += fullText.charAt(charIndex);
        charIndex++;
        if (charIndex % 3 === 0 && window.SoundEngine) {
          SoundEngine.playSFX('text');
        }
      } else {
        isTyping = false;
        clearInterval(typingTimer);
        typingTimer = null;
      }
    }, 20);
  }

  function advance() {
    if (!active) return;

    if (isTyping) {
      // Complete current line immediately
      clearInterval(typingTimer);
      typingTimer = null;
      displayedText = fullText;
      isTyping = false;
      return;
    }

    // Advance to next slide in cutscene if available
    if (currentSequence.length > 0 && currentIndex < currentSequence.length - 1) {
      currentIndex++;
      loadSlide(currentIndex);
    } else {
      // End dialogue
      active = false;
      const callback = onSequenceComplete;
      onSequenceComplete = null;
      currentSequence = [];
      if (callback) callback();
    }
  }

  function render(ctx, width = 640, height = 360) {
    if (!active) return;

    ctx.save();

    // Box dimensions
    const boxX = 16;
    const boxY = height - 100;
    const boxW = width - 32;
    const boxH = 88;

    // Outer dark translucent frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Speaker Name Banner
    if (currentSpeaker) {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(boxX + 12, boxY - 14, currentSpeaker.length * 9 + 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.fillText(currentSpeaker, boxX + 20, boxY);
    }

    // Character Portrait (if available)
    let textStartX = boxX + 20;
    if (currentPortrait) {
      const portraitCanvas = currentPortrait === 'aurelia'
        ? SpriteGenerator.getAurelia('down', 0, MapEngine.getPlayer().costume)
        : (currentPortrait === 'malakor' ? SpriteGenerator.getNPC('malakor') : SpriteGenerator.getNPC(currentPortrait));

      if (portraitCanvas) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(boxX + 16, boxY + 12, 48, 48);
        ctx.drawImage(portraitCanvas, 0, 0, 32, 32, boxX + 16, boxY + 12, 48, 48);
        textStartX = boxX + 76;
      }
    }

    // Wrap and render text
    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px "Courier New", monospace';
    const maxWidth = boxW - (textStartX - boxX) - 24;
    wrapText(ctx, displayedText, textStartX, boxY + 28, maxWidth, 18);

    // Advance Prompt arrow
    if (!isTyping) {
      ctx.fillStyle = '#facc15';
      ctx.fillText('▼', boxX + boxW - 24, boxY + boxH - 12);
    }

    ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  }

  return {
    startDialogue,
    showCutscene,
    showObjectText,
    advance,
    render,
    isActive: () => active
  };
})();

if (typeof window !== 'undefined') {
  window.DialogueEngine = DialogueEngine;
}
