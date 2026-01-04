/* =========================
   GLOBAL STATE
========================= */
const state = {
  coins: 0,
  btc: 0,
  level: 1,
  fingers: 1,
  tapValue: 1,
  refill: 0,
  refillMax: 100,
  soundOn: true
};

const LEVELS = [
  { name: "Stone", value: 1, img: "assets/coin1.png" },
  { name: "Iron", value: 2, img: "assets/coin2.png" },
  { name: "Gold", value: 5, img: "assets/coin3.png" },
  { name: "Diamond", value: 10, img: "assets/coin4.png" },
  { name: "Red Diamond", value: 25, img: "assets/coin5.png" },
  { name: "Californium", value: 100, img: "assets/coin6.png" }
];

/* =========================
   ELEMENTS
========================= */
const coinImg = document.getElementById("coin");
const coinCount = document.getElementById("coinCount");
const btcCount = document.getElementById("btcCount");
const levelName = document.getElementById("levelName");
const refillBar = document.querySelector(".refill-progress");
const claimBtn = document.querySelector(".claim-btn");
const particleLayer = document.getElementById("particleLayer");

/* =========================
   LOAD / SAVE
========================= */
function saveGame() {
  localStorage.setItem("tapGameState", JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem("tapGameState");
  if (!saved) return;
  Object.assign(state, JSON.parse(saved));
}

/* =========================
   UI UPDATE
========================= */
function updateUI() {
  coinCount.textContent = state.coins.toLocaleString();
  btcCount.textContent = state.btc.toFixed(6);
  levelName.textContent = LEVELS[state.level - 1].name;
  coinImg.src = LEVELS[state.level - 1].img;

  refillBar.style.width = `${(state.refill / state.refillMax) * 100}%`;
  claimBtn.disabled = state.refill < state.refillMax;
}

function unlockLevel() {
  if (state.coins >= state.level * 50000) {
    state.level++;
    updateUI();
  }
}


/* =========================
   PARTICLES
========================= */
function spawnParticle(x, y, value) {
  const p = document.createElement("div");
  p.className = "particle";
  p.textContent = `+${value}`;
  p.style.left = x + "px";
  p.style.top = y + "px";
  particleLayer.appendChild(p);

  setTimeout(() => p.remove(), 1200);
}

/* =========================
   SOUND
========================= */
const tapSound = new Audio("assets/tap.mp3");

function playSound() {
  if (!state.soundOn) return;
  tapSound.currentTime = 0;
  tapSound.play();
}

/* =========================
   MULTI-TOUCH TAP
========================= */
coinImg.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touches = e.touches.length;
  state.fingers = Math.min(touches, 10);

  const gain =
    state.fingers *
    LEVELS[state.level - 1].value *
    state.tapValue;

  state.coins += gain;
  state.refill = Math.min(state.refill + gain, state.refillMax);

  [...e.touches].forEach(t => {
    spawnParticle(t.clientX - 30, t.clientY - 40, gain);
  });

  playSound();
  updateUI();
  saveGame();
}, { passive: false });

/* =========================
   DESKTOP CLICK
========================= */
coinImg.addEventListener("click", (e) => {
  const gain =
    LEVELS[state.level - 1].value * state.tapValue;

  state.coins += gain;
  state.refill = Math.min(state.refill + gain, state.refillMax);

  spawnParticle(e.clientX - 30, e.clientY - 40, gain);
  playSound();
  updateUI();
  saveGame();
});

/* =========================
   CLAIM / CONVERT
========================= */
claimBtn.addEventListener("click", () => {
  if (state.refill < state.refillMax) return;

  const btcEarned = state.coins / 1_000_000;
  state.btc += btcEarned;
  state.coins = 0;
  state.refill = 0;

  updateUI();
  saveGame();
});

/* =========================
   LEVEL CHANGE (HIDE + RESET ONLY)
========================= */
function setLevel(lvl) {
  state.level = Math.min(lvl, LEVELS.length);
  updateUI();
  saveGame();
}

/* =========================
   RESET (ALLOWED)
========================= */
function resetGame() {
  localStorage.removeItem("tapGameState");
  location.reload();
}

/* =========================
   INIT
========================= */
loadGame();
updateUI();

/* =========================
   SIDE MENU CONTROL
========================= */
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeMenuBtn = document.getElementById("closeMenu");
const soundStatus = document.getElementById("soundStatus");

menuBtn.onclick = () => sideMenu.classList.add("active");
closeMenuBtn.onclick = () => sideMenu.classList.remove("active");

/* =========================
   MENU ACTIONS
========================= */
sideMenu.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  sideMenu.classList.remove("active");

  if (action === "login") loginPopup();
  if (action === "register") registerPopup();
  if (action === "forgot") forgotPopup();

  if (action === "sound") {
    state.soundOn = !state.soundOn;
    soundStatus.textContent = state.soundOn ? "ON" : "OFF";
    saveGame();
  }

  if (action === "reset") {
    if (confirm("Reset all progress?")) resetGame();
  }
});

/* =========================
   ANTI AUTO-TAP (B)
========================= */
let lastTap = 0;
function tapAllowed() {
  const now = Date.now();
  if (now - lastTap < 40) return false;
  lastTap = now;
  return true;
}
