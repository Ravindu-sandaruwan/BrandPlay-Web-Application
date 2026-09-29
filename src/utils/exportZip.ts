import JSZip from 'jszip';
import { Brand, Game } from '../types';

export async function generateGameZip(game: Game, brand?: Brand): Promise<Blob> {
  const zip = new JSZip();

  const cfg = game.configuration;
  const brandName = brand?.brandName || 'BrandPlay Game';
  const primaryColor = cfg.branding.primaryColour || '#2563eb';
  const secondaryColor = cfg.branding.secondaryColour || '#0f172a';
  const accentColor = cfg.branding.accentColour || '#ffffff';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${cfg.branding.customTitle || game.gameName} - Powered by BrandPlay</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-container">
    <header class="game-header">
      <div class="brand-badge">
        <div class="logo-box" id="brand-logo-container"></div>
        <div class="brand-text">
          <h1>${cfg.branding.customTitle || game.gameName}</h1>
          <p class="tagline">${cfg.branding.tagline || 'Play & win exclusive brand rewards!'}</p>
        </div>
      </div>
      <div class="hud">
        <div class="hud-item"><span class="hud-label">SCORE</span><span id="score-display" class="hud-value">0</span></div>
        <div class="hud-item"><span class="hud-label">LIVES / TIME</span><span id="time-display" class="hud-value">--</span></div>
      </div>
    </header>

    <div class="canvas-wrapper">
      <canvas id="gameCanvas" width="800" height="460"></canvas>
      
      <div id="overlay-screen" class="overlay">
        <div class="overlay-card">
          <div class="overlay-badge" id="overlay-logo"></div>
          <h2 id="overlay-title">${game.gameName}</h2>
          <p id="overlay-msg">${cfg.content.welcomeMessage}</p>
          <div class="action-buttons">
            <button id="start-btn" class="btn btn-primary">Start Game</button>
          </div>
          <div id="reward-box" class="reward-box" style="display:none;">
            <p class="reward-title">🎁 YOUR REWARD VOUCHER</p>
            <div class="promo-code" id="promo-code">${cfg.branding.promoCode || 'REWARD20'}</div>
            <a id="cta-link" href="${cfg.branding.ctaUrl || '#'}" target="_blank" class="btn btn-cta">${cfg.branding.ctaButtonText || 'Claim Offer'}</a>
          </div>
        </div>
      </div>
    </div>

    <footer class="game-footer">
      <span>Controls: Space/Click to Jump, Arrows or Mouse to Move</span>
      <span class="powered-by">Created with <strong>BrandPlay</strong></span>
    </footer>
  </div>

  <script src="game-engine.js"></script>
</body>
</html>`;

  const cssContent = `:root {
  --primary: ${primaryColor};
  --secondary: ${secondaryColor};
  --accent: ${accentColor};
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0b0f19;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
}

.game-container {
  width: 100%;
  max-width: 840px;
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1f2937;
}

.brand-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 44px;
  height: 44px;
  background: var(--primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 6px;
  overflow: hidden;
}

.logo-box svg {
  width: 100%;
  height: 100%;
}

.brand-text h1 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.tagline {
  font-size: 12px;
  color: #94a3b8;
}

.hud {
  display: flex;
  gap: 12px;
}

.hud-item {
  background: #1e293b;
  padding: 6px 14px;
  border-radius: 10px;
  border: 1px solid #334155;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hud-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.hud-value {
  font-size: 18px;
  font-weight: 800;
  color: #38bdf8;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  background: #030712;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 800 / 460;
}

canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(3, 7, 18, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  transition: opacity 0.2s ease;
}

.overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.overlay-card {
  background: #111827;
  border: 1px solid #374151;
  border-radius: 20px;
  padding: 28px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.overlay-badge {
  width: 56px;
  height: 56px;
  background: var(--primary);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: white;
}

.overlay-card h2 {
  font-size: 24px;
  font-weight: 800;
}

.overlay-card p {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.5;
}

.btn {
  display: inline-block;
  cursor: pointer;
  border: none;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 28px;
  border-radius: 12px;
  transition: transform 0.1s ease, filter 0.2s ease;
  text-decoration: none;
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
}

.btn-primary:hover {
  filter: brightness(1.15);
}

.btn-cta {
  background: var(--accent);
  color: #030712;
  margin-top: 10px;
  width: 100%;
}

.reward-box {
  width: 100%;
  background: #1e293b;
  border: 1px dashed var(--accent);
  border-radius: 14px;
  padding: 16px;
  margin-top: 8px;
}

.reward-title {
  font-size: 11px;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.promo-code {
  font-family: monospace;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  background: #0f172a;
  padding: 8px 16px;
  border-radius: 8px;
  letter-spacing: 0.1em;
}

.game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #64748b;
  padding-top: 4px;
}

.powered-by strong {
  color: #818cf8;
}

@media (max-width: 600px) {
  .game-container {
    padding: 10px;
  }
  .overlay-card {
    padding: 20px;
  }
}
`;

  const jsEngineContent = `// Standalone HTML5 Game Engine generated by BrandPlay
(function() {
  const config = ${JSON.stringify(cfg, null, 2)};
  const templateId = "${game.templateId}";

  // Insert Logo
  const logoContainers = [document.getElementById('brand-logo-container'), document.getElementById('overlay-logo')];
  logoContainers.forEach(container => {
    if (container && config.branding.logo) {
      if (config.branding.logo.startsWith('<svg')) {
        container.innerHTML = config.branding.logo;
      } else {
        container.innerHTML = '<img src="' + config.branding.logo + '" style="width:100%;height:100%;object-fit:contain" />';
      }
    }
  });

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('score-display');
  const timeDisplay = document.getElementById('time-display');
  const overlay = document.getElementById('overlay-screen');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayMsg = document.getElementById('overlay-msg');
  const startBtn = document.getElementById('start-btn');
  const rewardBox = document.getElementById('reward-box');

  let gameState = 'ready'; // ready, playing, gameover, won
  let score = 0;
  let animId = null;
  let lastTime = 0;

  // Sound Synth
  let audioCtx = null;
  function playBeep(freq, type = 'sine', duration = 0.1) {
    if (!config.gameplay.soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch(e){}
  }

  // Engine state depending on template
  let runner = {
    x: 80, y: 320, vy: 0, w: 42, h: 48,
    groundY: 340, isGrounded: true,
    speed: config.gameplay.speed * 1.2,
    obstacles: [], collectibles: [], particles: [],
    distance: 0, lives: config.gameplay.lives || 3
  };

  let catcher = {
    x: 360, y: 380, w: 70, h: 22,
    speed: 7, targetX: 360,
    items: [], particles: [], timeLeft: config.gameplay.durationSeconds || 45
  };

  let quizState = {
    currentIdx: 0,
    timeLeft: 15,
    questions: config.content.questions || []
  };

  function initGame() {
    score = 0;
    scoreDisplay.innerText = '0';
    rewardBox.style.display = 'none';

    if (templateId === 'endless-runner') {
      runner.y = 320;
      runner.vy = 0;
      runner.isGrounded = true;
      runner.obstacles = [];
      runner.collectibles = [];
      runner.particles = [];
      runner.lives = config.gameplay.lives || 3;
      timeDisplay.innerText = '❤️ x ' + runner.lives;
    } else if (templateId === 'coin-collector') {
      catcher.x = 360;
      catcher.targetX = 360;
      catcher.items = [];
      catcher.particles = [];
      catcher.timeLeft = config.gameplay.durationSeconds || 45;
      timeDisplay.innerText = catcher.timeLeft + 's';
    } else {
      quizState.currentIdx = 0;
      quizState.timeLeft = 15;
      timeDisplay.innerText = quizState.timeLeft + 's';
    }
  }

  // Keyboard and Touch Handlers
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      if (gameState === 'ready') startGame();
      else if (gameState === 'playing' && templateId === 'endless-runner') jump();
      e.preventDefault();
    }
    if (e.code === 'ArrowLeft' && templateId === 'coin-collector') {
      catcher.targetX = Math.max(0, catcher.targetX - 35);
    }
    if (e.code === 'ArrowRight' && templateId === 'coin-collector') {
      catcher.targetX = Math.min(canvas.width - catcher.w, catcher.targetX + 35);
    }
  });

  canvas.addEventListener('click', (e) => {
    if (gameState === 'playing' && templateId === 'endless-runner') {
      jump();
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (gameState === 'playing' && templateId === 'coin-collector') {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      catcher.targetX = Math.max(0, Math.min(canvas.width - catcher.w, mouseX - catcher.w / 2));
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (gameState === 'playing' && templateId === 'coin-collector' && e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const touchX = (e.touches[0].clientX - rect.left) * scaleX;
      catcher.targetX = Math.max(0, Math.min(canvas.width - catcher.w, touchX - catcher.w / 2));
    }
  }, { passive: true });

  function jump() {
    if (runner.isGrounded) {
      runner.vy = -14.5;
      runner.isGrounded = false;
      playBeep(440, 'triangle', 0.12);
    }
  }

  function startGame() {
    initGame();
    gameState = 'playing';
    overlay.classList.add('hidden');
    lastTime = performance.now();
    cancelAnimationFrame(animId);
    animId = requestAnimationFrame(gameLoop);
  }

  function endGame(won) {
    gameState = won ? 'won' : 'gameover';
    overlay.classList.remove('hidden');
    overlayTitle.innerText = won ? '🎉 VICTORY!' : 'GAME OVER';
    overlayMsg.innerText = won ? config.content.winMessage : config.content.gameOverMessage;
    startBtn.innerText = 'Play Again';
    if (won && config.branding.promoCode) {
      rewardBox.style.display = 'block';
      playBeep(659, 'sine', 0.3);
    } else {
      playBeep(180, 'sawtooth', 0.3);
    }
  }

  startBtn.addEventListener('click', startGame);

  // Main Loop
  function gameLoop(time) {
    if (gameState !== 'playing') return;
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (templateId === 'spin-wheel') {
      updateWheel(dt);
      drawWheel();
    } else if (templateId === 'endless-runner') {
      updateRunner(dt);
      drawRunner();
    } else if (templateId === 'coin-collector') {
      updateCatcher(dt);
      drawCatcher();
    } else {
      drawQuizScreen();
    }

    animId = requestAnimationFrame(gameLoop);
  }

  // Endless Runner Logic
  function updateRunner(dt) {
    runner.vy += 38 * dt * 30;
    runner.y += runner.vy * dt * 30;
    if (runner.y >= runner.groundY) {
      runner.y = runner.groundY;
      runner.vy = 0;
      runner.isGrounded = true;
    }

    runner.distance += runner.speed * 60 * dt;
    score = Math.floor((runner.distance / 10) * config.gameplay.scoreMultiplier);
    scoreDisplay.innerText = score;

    // Spawn obstacles
    if (Math.random() < 0.015 && runner.obstacles.length < 3) {
      const lastX = runner.obstacles.length ? runner.obstacles[runner.obstacles.length - 1].x : 0;
      if (800 - lastX > 220) {
        runner.obstacles.push({ x: 800, y: runner.groundY + 12, w: 28, h: 36 });
      }
    }

    // Spawn collectibles
    if (Math.random() < 0.02 && runner.collectibles.length < 4) {
      runner.collectibles.push({ x: 820, y: runner.groundY - 45 - Math.random() * 40, r: 14 });
    }

    // Move & Collide Obstacles
    for (let i = runner.obstacles.length - 1; i >= 0; i--) {
      const ob = runner.obstacles[i];
      ob.x -= runner.speed * 60 * dt;
      // Collision AABB
      if (runner.x < ob.x + ob.w && runner.x + runner.w > ob.x &&
          runner.y < ob.y + ob.h && runner.y + runner.h > ob.y) {
        runner.obstacles.splice(i, 1);
        runner.lives--;
        timeDisplay.innerText = '❤️ x ' + runner.lives;
        playBeep(200, 'sawtooth', 0.15);
        if (runner.lives <= 0) {
          endGame(false);
          return;
        }
      } else if (ob.x < -40) {
        runner.obstacles.splice(i, 1);
      }
    }

    // Collectibles
    for (let i = runner.collectibles.length - 1; i >= 0; i--) {
      const c = runner.collectibles[i];
      c.x -= runner.speed * 60 * dt;
      const dx = (runner.x + runner.w/2) - c.x;
      const dy = (runner.y + runner.h/2) - c.y;
      if (Math.sqrt(dx*dx + dy*dy) < 32) {
        runner.collectibles.splice(i, 1);
        score += 50 * config.gameplay.scoreMultiplier;
        scoreDisplay.innerText = score;
        playBeep(880, 'sine', 0.1);
        if (score >= config.gameplay.targetScore) {
          endGame(true);
          return;
        }
      } else if (c.x < -30) {
        runner.collectibles.splice(i, 1);
      }
    }
  }

  function drawRunner() {
    // Sky
    const grad = ctx.createLinearGradient(0, 0, 0, 460);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 460);

    // Billboards / Brand Banner
    ctx.fillStyle = config.branding.primaryColour;
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('★ ' + (config.branding.customTitle || 'BRANDPLAY') + ' ★', 50, 40);

    // Ground
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, runner.groundY + runner.h, 800, 460);
    ctx.fillStyle = config.branding.primaryColour;
    ctx.fillRect(0, runner.groundY + runner.h, 800, 5);

    // Player
    ctx.fillStyle = config.branding.accentColour;
    ctx.beginPath();
    ctx.roundRect(runner.x, runner.y, runner.w, runner.h, 8);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(runner.x + 26, runner.y + 12, 6, 6);

    // Obstacles
    ctx.fillStyle = '#ef4444';
    runner.obstacles.forEach(ob => {
      ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
    });

    // Collectibles
    ctx.fillStyle = '#eab308';
    runner.collectibles.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Catcher Logic
  function updateCatcher(dt) {
    catcher.x += (catcher.targetX - catcher.x) * 0.18;
    catcher.timeLeft -= dt;
    timeDisplay.innerText = Math.max(0, Math.ceil(catcher.timeLeft)) + 's';

    if (catcher.timeLeft <= 0) {
      endGame(score >= config.gameplay.targetScore);
      return;
    }

    if (Math.random() < 0.04 && catcher.items.length < 6) {
      const isBomb = Math.random() < 0.25;
      catcher.items.push({
        x: 40 + Math.random() * 720,
        y: -20,
        r: 16,
        isBomb: isBomb,
        speed: (2.5 + Math.random() * 2) * config.gameplay.speed * 0.7
      });
    }

    for (let i = catcher.items.length - 1; i >= 0; i--) {
      const item = catcher.items[i];
      item.y += item.speed * 60 * dt;

      // Caught by player
      if (item.y + item.r >= catcher.y && item.y - item.r <= catcher.y + catcher.h &&
          item.x >= catcher.x - 10 && item.x <= catcher.x + catcher.w + 10) {
        catcher.items.splice(i, 1);
        if (item.isBomb) {
          score = Math.max(0, score - 30);
          playBeep(180, 'sawtooth', 0.15);
        } else {
          score += 25 * config.gameplay.scoreMultiplier;
          playBeep(987, 'sine', 0.08);
          if (score >= config.gameplay.targetScore) {
            endGame(true);
            return;
          }
        }
        scoreDisplay.innerText = score;
      } else if (item.y > 480) {
        catcher.items.splice(i, 1);
      }
    }
  }

  function drawCatcher() {
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, 800, 460);

    // Basket / Catcher
    ctx.fillStyle = config.branding.primaryColour;
    ctx.beginPath();
    ctx.roundRect(catcher.x, catcher.y, catcher.w, catcher.h, 8);
    ctx.fill();

    // Items
    catcher.items.forEach(it => {
      ctx.fillStyle = it.isBomb ? '#ef4444' : config.branding.accentColour;
      ctx.beginPath();
      ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  let wheelAngle = 0;
  let wheelSpeed = 0;
  let wheelSegments = (config.spinWheel && config.spinWheel.segments) ? config.spinWheel.segments : [
    { text: '10% OFF', color: config.branding.primaryColour, isWinning: true },
    { text: 'Free Delivery', color: config.branding.accentColour, isWinning: true },
    { text: 'Try Again', color: '#475569', isWinning: false },
    { text: '20% OFF', color: config.branding.primaryColour, isWinning: true },
    { text: 'Free Gift', color: '#0ea5e9', isWinning: true },
    { text: 'Better Luck', color: '#334155', isWinning: false }
  ];

  function updateWheel(dt) {
    if (wheelSpeed > 0.05) {
      wheelAngle += wheelSpeed * dt;
      wheelSpeed *= Math.pow(0.98, dt * 60);
      if (Math.random() < 0.25) playBeep(600, 'triangle', 0.03);
    } else if (wheelSpeed > 0) {
      wheelSpeed = 0;
      endGame(true);
    }
  }

  function drawWheel() {
    ctx.fillStyle = config.branding.backgroundColour || '#090d16';
    ctx.fillRect(0, 0, 800, 460);

    const cx = 400, cy = 230, r = 165;
    const count = wheelSegments.length;
    const arc = (Math.PI * 2) / count;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(wheelAngle);

    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, i * arc, (i + 1) * arc);
      ctx.fillStyle = wheelSegments[i].color || (i % 2 === 0 ? config.branding.primaryColour : config.branding.secondaryColour);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(i * arc + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(wheelSegments[i].text, r - 20, 5);
      ctx.restore();
    }

    ctx.restore();

    // Center Hub
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, Math.PI * 2);
    ctx.fillStyle = config.branding.primaryColour;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', cx, cy + 4);

    // Pointer
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - r - 8);
    ctx.lineTo(cx + 10, cy - r - 8);
    ctx.lineTo(cx, cy - r + 14);
    ctx.fillStyle = config.branding.accentColour || '#38bdf8';
    ctx.fill();
  }

  // Canvas click to spin wheel
  canvas.addEventListener('click', () => {
    if (templateId === 'spin-wheel' && wheelSpeed <= 0.05) {
      wheelSpeed = 12 + Math.random() * 8;
      gameState = 'playing';
      overlay.classList.add('hidden');
    }
  });

  function drawQuizScreen() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 800, 460);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '22px sans-serif';
    ctx.fillText('Trivia Master Running in Web View', 240, 230);
  }

  // Draw initial scene
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, 800, 460);
})();
`;

  const readmeContent = `# ${cfg.branding.customTitle || game.gameName}
### Standalone HTML5 Game Package generated by BrandPlay

**Brand:** ${brandName}
**Template:** ${game.templateId}
**Export Date:** ${new Date().toISOString()}

---

## How to Run Offline
1. Extract all files from this ZIP into a single folder.
2. Double-click \`index.html\` to open and play directly in Chrome, Firefox, Safari, or Edge.
3. No server or internet connection required!

## How to Host Online
Upload these files to any web hosting service:
- **Netlify / Vercel**: Drag and drop the extracted folder into the deploy panel.
- **Shopify / WordPress**: Upload files to your media manager or assets folder, and embed using an \`<iframe>\`.
- **AWS S3 / Firebase Hosting / GitHub Pages**: Deploy the static directory.

## Embedding in Any Website
\`\`\`html
<iframe
  src="https://your-domain.com/index.html"
  width="800"
  height="540"
  style="border: none; border-radius: 16px; overflow: hidden;"
  allow="autoplay">
</iframe>
\`\`\`

---
*Created with BrandPlay – The No-Code Web-Based Customizable Brand Game Platform.*
`;

  zip.file('index.html', htmlContent);
  zip.file('style.css', cssContent);
  zip.file('game-engine.js', jsEngineContent);
  zip.file('brand-config.json', JSON.stringify({ game, brand }, null, 2));
  zip.file('README.md', readmeContent);

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
