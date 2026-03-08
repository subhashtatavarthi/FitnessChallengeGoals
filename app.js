/* ═══════════════════════════════════════════
   LADIES WELLNESS CHALLENGE – APP.JS
   Full application logic with localStorage persistence
   ═══════════════════════════════════════════ */

// ─── ACTIVITIES CONFIG ─────────────────────
const CORE_ACTIVITIES = [
  { id: 'workout', name: 'Workout (30+ min)', icon: '🏋️‍♀️', points: 5 },
  { id: 'steps', name: '10,000 steps', icon: '👣', points: 3 },
  { id: 'meal', name: 'Healthy homemade meal', icon: '🥗', points: 3 },
  { id: 'nosugar', name: 'No sugar day', icon: '🚫🍫', points: 2 },
  { id: 'water', name: 'Drink 2.5L water', icon: '💧', points: 2 },
  { id: 'meditation', name: 'Meditation / Yoga', icon: '🧘‍♀️', points: 2 },
  { id: 'sleep', name: 'Sleep before 11pm', icon: '🌙', points: 2 },
];

const BONUS_ACTIVITIES = [
  { id: 'newrecipe', name: 'Try a new healthy recipe', icon: '👩‍🍳', points: 1 },
  { id: 'squats', name: 'Do 50 squats', icon: '🦵', points: 1 },
  { id: 'walkdinner', name: 'Walk after dinner', icon: '🚶‍♀️', points: 1 },
  { id: 'smoothie', name: 'Drink green smoothie', icon: '🥤', points: 1 },
  { id: 'newworkout', name: 'Try a new workout video', icon: '📺', points: 1 },
];

const MAX_CORE_POINTS = CORE_ACTIVITIES.reduce((s, a) => s + a.points, 0); // 19
const MAX_BONUS_POINTS = BONUS_ACTIVITIES.reduce((s, a) => s + a.points, 0); // 5
const MAX_DAILY_POINTS = MAX_CORE_POINTS + MAX_BONUS_POINTS;

const WEEKLY_CHALLENGES = [
  { id: 'movement', title: '🏃‍♀️ Movement Week', desc: 'Hit 10,000 steps every day this week. Walk, run, dance — just keep moving!', goal: 7, unit: 'days', track: 'steps' },
  { id: 'nosugar', title: '🍬 No Sugar Streak', desc: 'Avoid added sugar for as many days as possible. Longest streak wins!', goal: 7, unit: 'days', track: 'nosugar' },
  { id: 'hydration', title: '💧 Hydration Hero', desc: 'Drink at least 2.5L of water every day for 7 days straight.', goal: 7, unit: 'days', track: 'water' },
  { id: 'strength', title: '💪 Strength Week', desc: 'Complete a workout every day. Push-ups, squats, planks — mix it up!', goal: 7, unit: 'days', track: 'workout' },
  { id: 'mindful', title: '🧘‍♀️ Mindfulness Week', desc: 'Practice meditation or yoga every day. Even 10 minutes counts!', goal: 7, unit: 'days', track: 'meditation' },
  { id: 'cooking', title: '👩‍🍳 Healthy Chef Week', desc: 'Prepare healthy homemade meals every day. Bonus for new recipes!', goal: 7, unit: 'days', track: 'meal' },
  { id: 'diversity', title: '🌈 Activity Diversity', desc: 'Try 5 different workout types this week. Variety is key!', goal: 5, unit: 'types', track: 'workout' },
];

const AWARDS_CONFIG = [
  { id: 'champion', icon: '🏆', title: 'Challenge Champion', desc: 'Highest total points at the end of the challenge' },
  { id: 'consistent', icon: '🔥', title: 'Consistency Queen', desc: 'Longest daily check-in streak' },
  { id: 'improved', icon: '📈', title: 'Most Improved', desc: 'Greatest week-over-week point increase' },
  { id: 'hydrator', icon: '💧', title: 'Hydration Hero', desc: 'Most days with 2.5L water' },
  { id: 'earlybird', icon: '🌙', title: 'Early Bird', desc: 'Most days sleeping before 11pm' },
  { id: 'chef', icon: '🥗', title: 'Healthy Chef', desc: 'Most healthy homemade meals logged' },
];

// ─── FOOD DATABASE (per serving, approximate calories) ────
const FOOD_DATABASE = [
  // Indian breakfast
  { name: 'Idli (2 pcs)', cal: 130, category: 'healthy' },
  { name: 'Dosa (plain)', cal: 120, category: 'healthy' },
  { name: 'Masala Dosa', cal: 250, category: 'moderate' },
  { name: 'Upma', cal: 200, category: 'healthy' },
  { name: 'Poha', cal: 180, category: 'healthy' },
  { name: 'Uttapam', cal: 200, category: 'healthy' },
  { name: 'Vada (2 pcs)', cal: 290, category: 'indulgent' },
  { name: 'Paratha (plain)', cal: 260, category: 'moderate' },
  { name: 'Aloo Paratha', cal: 330, category: 'moderate' },
  { name: 'Puri (2 pcs)', cal: 300, category: 'indulgent' },
  { name: 'Pesarattu', cal: 150, category: 'healthy' },

  // Indian curries & dal
  { name: 'Dal (1 cup)', cal: 180, category: 'healthy' },
  { name: 'Sambar (1 cup)', cal: 130, category: 'healthy' },
  { name: 'Rasam (1 cup)', cal: 60, category: 'healthy' },
  { name: 'Palak Paneer', cal: 300, category: 'moderate' },
  { name: 'Paneer Butter Masala', cal: 400, category: 'indulgent' },
  { name: 'Chole (Chickpea Curry)', cal: 240, category: 'moderate' },
  { name: 'Rajma (Kidney Bean Curry)', cal: 220, category: 'moderate' },
  { name: 'Aloo Gobi', cal: 180, category: 'healthy' },
  { name: 'Baingan Bharta', cal: 160, category: 'healthy' },
  { name: 'Mixed Veg Curry', cal: 150, category: 'healthy' },
  { name: 'Egg Curry', cal: 250, category: 'moderate' },
  { name: 'Chicken Curry', cal: 300, category: 'moderate' },
  { name: 'Fish Curry', cal: 220, category: 'moderate' },
  { name: 'Butter Chicken', cal: 440, category: 'indulgent' },
  { name: 'Biryani (1 plate)', cal: 450, category: 'indulgent' },
  { name: 'Pulao (1 plate)', cal: 280, category: 'moderate' },

  // Indian rice & roti
  { name: 'Rice (1 cup cooked)', cal: 200, category: 'moderate' },
  { name: 'Brown Rice (1 cup)', cal: 215, category: 'healthy' },
  { name: 'Roti / Chapati', cal: 100, category: 'healthy' },
  { name: 'Naan', cal: 260, category: 'moderate' },
  { name: 'Garlic Naan', cal: 300, category: 'indulgent' },

  // Indian snacks
  { name: 'Samosa (1 pc)', cal: 260, category: 'indulgent' },
  { name: 'Pakora / Bhajji (4 pcs)', cal: 280, category: 'indulgent' },
  { name: 'Chaat', cal: 200, category: 'moderate' },
  { name: 'Pani Puri (6 pcs)', cal: 180, category: 'moderate' },
  { name: 'Murukku / Chakli', cal: 150, category: 'indulgent' },
  { name: 'Biscuits (4 pcs)', cal: 160, category: 'indulgent' },

  // Indian sweets
  { name: 'Gulab Jamun (2 pcs)', cal: 300, category: 'indulgent' },
  { name: 'Rasgulla (2 pcs)', cal: 250, category: 'indulgent' },
  { name: 'Jalebi (2 pcs)', cal: 300, category: 'indulgent' },
  { name: 'Laddu (1 pc)', cal: 200, category: 'indulgent' },
  { name: 'Halwa (1 serving)', cal: 300, category: 'indulgent' },
  { name: 'Payasam / Kheer', cal: 280, category: 'indulgent' },

  // Indian drinks
  { name: 'Chai (with milk & sugar)', cal: 90, category: 'moderate' },
  { name: 'Chai (black, no sugar)', cal: 5, category: 'healthy' },
  { name: 'Filter Coffee', cal: 100, category: 'moderate' },
  { name: 'Buttermilk / Chaas', cal: 40, category: 'healthy' },
  { name: 'Lassi (sweet)', cal: 200, category: 'moderate' },
  { name: 'Lassi (salted)', cal: 80, category: 'healthy' },
  { name: 'Fresh Lime Water', cal: 30, category: 'healthy' },
  { name: 'Coconut Water', cal: 45, category: 'healthy' },
  { name: 'Mango Juice', cal: 150, category: 'moderate' },

  // Global healthy
  { name: 'Oatmeal', cal: 150, category: 'healthy' },
  { name: 'Greek Yogurt', cal: 100, category: 'healthy' },
  { name: 'Green Salad', cal: 50, category: 'healthy' },
  { name: 'Fruit Salad', cal: 80, category: 'healthy' },
  { name: 'Boiled Eggs (2)', cal: 140, category: 'healthy' },
  { name: 'Avocado Toast', cal: 250, category: 'healthy' },
  { name: 'Smoothie (fruit)', cal: 180, category: 'healthy' },
  { name: 'Green Smoothie', cal: 120, category: 'healthy' },
  { name: 'Sprouts Salad', cal: 100, category: 'healthy' },
  { name: 'Quinoa Bowl', cal: 220, category: 'healthy' },
  { name: 'Mixed Nuts (handful)', cal: 170, category: 'healthy' },
  { name: 'Banana', cal: 105, category: 'healthy' },
  { name: 'Apple', cal: 95, category: 'healthy' },
  { name: 'Orange', cal: 60, category: 'healthy' },
  { name: 'Grapes (1 cup)', cal: 60, category: 'healthy' },

  // Global moderate
  { name: 'Sandwich', cal: 350, category: 'moderate' },
  { name: 'Pasta (1 plate)', cal: 400, category: 'moderate' },
  { name: 'Grilled Chicken Breast', cal: 230, category: 'healthy' },
  { name: 'Soup (1 bowl)', cal: 120, category: 'healthy' },
  { name: 'Wrap / Burrito', cal: 400, category: 'moderate' },

  // Indulgent
  { name: 'Pizza (2 slices)', cal: 550, category: 'indulgent' },
  { name: 'Burger', cal: 500, category: 'indulgent' },
  { name: 'French Fries', cal: 365, category: 'indulgent' },
  { name: 'Ice Cream (1 scoop)', cal: 200, category: 'indulgent' },
  { name: 'Cake (1 slice)', cal: 350, category: 'indulgent' },
  { name: 'Chocolate (small bar)', cal: 230, category: 'indulgent' },
  { name: 'Chips (small bag)', cal: 270, category: 'indulgent' },
  { name: 'Soda / Cola', cal: 140, category: 'indulgent' },
  { name: 'Fried Rice', cal: 350, category: 'moderate' },
  { name: 'Noodles / Maggi', cal: 300, category: 'moderate' },
];

// Points awarded by food category: healthy=3, moderate=1, indulgent=0
function getFoodPoints(category) {
  if (category === 'healthy') return 3;
  if (category === 'moderate') return 1;
  return 0; // indulgent
}

function lookupFood(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8);
}

// ─── STATE ─────────────────────────────────
let state = {
  challengeName: '',
  totalDays: 30,
  startDate: null,     // ISO string
  participants: [],    // [ "Name1", "Name2", … ]
  logs: {},            // { "Name1": { "1": { "workout": true, ... }, "2": { ... } } }
  customActivities: {}, // { "Name1": { "1": [ { id, name, points, done } ] } }
  foodLogs: {},        // { "Name1": { "1": [ { name, calories, category, points } ] } }
};

const STORAGE_KEY = 'wellness_challenge_data';

// ─── DOM REFS ──────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Setup
const setupScreen = $('#setup-screen');
const appWrapper = $('#app-wrapper');
const challengeNameInput = $('#challenge-name');
const participantNameInput = $('#participant-name-input');
const btnAddParticipant = $('#btn-add-participant');
const participantsList = $('#participants-list');
const btnStartChallenge = $('#btn-start-challenge');
const durationBtns = $$('.duration-btn');

// Tracker
let currentTrackerDay = 1;
let currentTrackerParticipant = null;

// ─── INIT ──────────────────────────────────
function init() {
  loadState();
  if (state.startDate && state.participants.length > 0) {
    showApp();
  } else {
    showSetup();
  }
  bindEvents();
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

// ─── UTILITIES ──────────────────────────────
function getCurrentDay() {
  if (!state.startDate) return 1;
  const start = new Date(state.startDate);
  const now = new Date();
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(diff, state.totalDays));
}

function getDateForDay(dayNum) {
  if (!state.startDate) return new Date();
  const d = new Date(state.startDate);
  d.setDate(d.getDate() + dayNum - 1);
  return d;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getCurrentWeek() {
  return Math.ceil(getCurrentDay() / 7);
}

function getPlayerDayPoints(player, day) {
  const dayLog = state.logs[player]?.[String(day)];
  let pts = 0;
  if (dayLog) {
    [...CORE_ACTIVITIES, ...BONUS_ACTIVITIES].forEach(a => {
      if (dayLog[a.id]) pts += a.points;
    });
  }
  // Add custom activity points
  const customs = state.customActivities[player]?.[String(day)] || [];
  customs.forEach(c => { if (c.done) pts += c.points; });
  // Add food points
  const foods = state.foodLogs?.[player]?.[String(day)] || [];
  foods.forEach(f => { pts += (f.points || 0); });
  return pts;
}

function getPlayerTotalPoints(player) {
  let total = 0;
  const maxDay = getCurrentDay();
  for (let d = 1; d <= maxDay; d++) {
    total += getPlayerDayPoints(player, d);
  }
  return total;
}

function getPlayerStreak(player) {
  let streak = 0;
  const maxDay = getCurrentDay();
  for (let d = maxDay; d >= 1; d--) {
    if (getPlayerDayPoints(player, d) > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getPlayerActivityCount(player, activityId) {
  let count = 0;
  const maxDay = getCurrentDay();
  for (let d = 1; d <= maxDay; d++) {
    if (state.logs[player]?.[String(d)]?.[activityId]) count++;
  }
  return count;
}

function getRankedPlayers() {
  return state.participants
    .map(p => ({
      name: p,
      points: getPlayerTotalPoints(p),
      streak: getPlayerStreak(p),
    }))
    .sort((a, b) => b.points - a.points || b.streak - a.streak);
}

function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function fireConfetti() {
  const colors = ['#f6c343', '#f687b3', '#4fd1c5', '#b794f4', '#68d391', '#ed64a6'];
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = -10 + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.animationDuration = (1.5 + Math.random()) + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

// ─── SETUP SCREEN ──────────────────────────
const DEFAULT_PARTICIPANTS = ['Kalyani', 'Chaitali', 'Soujanya', 'Kavya', 'Bhargavi'];
let setupParticipants = [];

function showSetup() {
  setupScreen.style.display = 'flex';
  setupScreen.classList.add('active');
  appWrapper.style.display = 'none';
  setupParticipants = [];
  renderSetupParticipants();
  updateStartButton();
}

function bindEvents() {
  // Duration buttons
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Add participant
  btnAddParticipant.addEventListener('click', addParticipant);
  participantNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addParticipant();
  });

  // Start challenge
  btnStartChallenge.addEventListener('click', startChallenge);

  // Navigation
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const screenId = btn.dataset.screen;
      navigateTo(screenId);
    });
  });

  // View all leaderboard
  $('#btn-view-leaderboard').addEventListener('click', () => navigateTo('leaderboard-screen'));

  // Tracker date nav
  $('#btn-prev-day').addEventListener('click', () => {
    if (currentTrackerDay > 1) {
      currentTrackerDay--;
      renderTracker();
    }
  });
  $('#btn-next-day').addEventListener('click', () => {
    if (currentTrackerDay < getCurrentDay()) {
      currentTrackerDay++;
      renderTracker();
    }
  });

  // Reset
  $('#btn-reset-challenge').addEventListener('click', () => {
    if (confirm('⚠️ Are you sure you want to reset the entire challenge? All data will be lost.')) {
      localStorage.removeItem(STORAGE_KEY);
      state = { challengeName: '', totalDays: 30, startDate: null, participants: [], logs: {}, customActivities: {}, foodLogs: {} };
      showSetup();
    }
  });

  // Manage Participants
  $('#btn-manage-participants').addEventListener('click', openManageModal);
  $('#modal-close-btn').addEventListener('click', closeManageModal);
  $('#btn-manage-done').addEventListener('click', closeManageModal);
  $('#manage-modal').addEventListener('click', (e) => {
    if (e.target.id === 'manage-modal') closeManageModal();
  });
  $('#btn-manage-add').addEventListener('click', manageAddParticipant);
  $('#manage-name-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') manageAddParticipant();
  });
}

// ─── MANAGE PARTICIPANTS MODAL ─────────────
function openManageModal() {
  $('#manage-modal').style.display = 'flex';
  renderManageModal();
}

function closeManageModal() {
  $('#manage-modal').style.display = 'none';
  saveState();
  renderDashboard();
}

function renderManageModal() {
  // Default name chips
  const chipsEl = $('#manage-default-chips');
  chipsEl.innerHTML = DEFAULT_PARTICIPANTS.map(name => {
    const active = state.participants.includes(name);
    return `<button class="participant-chip ${active ? 'active' : ''}" onclick="manageToggleDefault('${escapeHtml(name)}')" style="cursor:pointer">
      ${active ? '✓ ' : ''}${escapeHtml(name)}
    </button>`;
  }).join('');

  // Custom (non-default) participants
  const customNames = state.participants.filter(n => !DEFAULT_PARTICIPANTS.includes(n));
  const customListEl = $('#manage-custom-list');
  customListEl.innerHTML = customNames.map(name => `
    <li class="participant-tag">
      ${escapeHtml(name)}
      <button class="remove-btn" onclick="manageRemoveParticipant('${escapeHtml(name)}')" title="Remove">×</button>
    </li>
  `).join('');
}

function manageToggleDefault(name) {
  if (state.participants.includes(name)) {
    // Only allow removal if more than 2 participants will remain
    if (state.participants.length <= 2) {
      showToast('Need at least 2 participants');
      return;
    }
    state.participants = state.participants.filter(p => p !== name);
  } else {
    state.participants.push(name);
    // Initialize logs for new participant
    if (!state.logs[name]) state.logs[name] = {};
    if (!state.customActivities[name]) state.customActivities[name] = {};
    if (!state.foodLogs[name]) state.foodLogs[name] = {};
  }
  saveState();
  renderManageModal();
}

function manageAddParticipant() {
  const input = $('#manage-name-input');
  const name = input.value.trim();
  if (!name) return;
  if (state.participants.includes(name) || DEFAULT_PARTICIPANTS.includes(name)) {
    showToast('Name already exists!');
    return;
  }
  if (state.participants.length >= 12) {
    showToast('Max 12 participants');
    return;
  }
  state.participants.push(name);
  state.logs[name] = {};
  state.customActivities[name] = {};
  state.foodLogs[name] = {};
  input.value = '';
  input.focus();
  saveState();
  renderManageModal();
  showToast(`✅ ${name} added!`);
}

function manageRemoveParticipant(name) {
  if (state.participants.length <= 2) {
    showToast('Need at least 2 participants');
    return;
  }
  if (confirm(`Remove ${name} from the challenge?`)) {
    state.participants = state.participants.filter(p => p !== name);
    saveState();
    renderManageModal();
    showToast(`${name} removed`);
  }
}

function toggleDefaultParticipant(name) {
  if (setupParticipants.includes(name)) {
    setupParticipants = setupParticipants.filter(p => p !== name);
  } else {
    setupParticipants.push(name);
  }
  renderSetupParticipants();
  updateStartButton();
}

function addParticipant() {
  const name = participantNameInput.value.trim();
  if (!name) return;
  if (setupParticipants.includes(name) || DEFAULT_PARTICIPANTS.includes(name)) {
    showToast('Name already exists!');
    return;
  }
  if (setupParticipants.length >= 12) {
    showToast('Max 12 participants');
    return;
  }
  setupParticipants.push(name);
  participantNameInput.value = '';
  participantNameInput.focus();
  renderSetupParticipants();
  updateStartButton();
}

function removeParticipant(name) {
  setupParticipants = setupParticipants.filter(p => p !== name);
  renderSetupParticipants();
  updateStartButton();
}

function renderSetupParticipants() {
  // Default name toggle chips
  const defaultChipsHtml = DEFAULT_PARTICIPANTS.map(name => {
    const selected = setupParticipants.includes(name);
    return `<button class="participant-chip ${selected ? 'active' : ''}" onclick="toggleDefaultParticipant('${escapeHtml(name)}')" style="cursor:pointer">
      ${selected ? '✓ ' : ''}${escapeHtml(name)}
    </button>`;
  }).join('');

  // Custom-added names (non-default)
  const customNames = setupParticipants.filter(n => !DEFAULT_PARTICIPANTS.includes(n));
  const customTagsHtml = customNames.map(name => `
    <li class="participant-tag">
      ${escapeHtml(name)}
      <button class="remove-btn" onclick="removeParticipant('${escapeHtml(name)}')" title="Remove">×</button>
    </li>
  `).join('');

  participantsList.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:${customNames.length ? '12px' : '0'}">${defaultChipsHtml}</div>
    ${customTagsHtml}
  `;
}

function updateStartButton() {
  btnStartChallenge.disabled = setupParticipants.length < 2;
  btnStartChallenge.textContent = setupParticipants.length < 2
    ? '👥 Add at least 2 participants'
    : `🚀 Start Challenge (${setupParticipants.length} players)`;
}

function startChallenge() {
  const selectedDuration = document.querySelector('.duration-btn.selected');
  state.totalDays = parseInt(selectedDuration.dataset.days);
  state.challengeName = challengeNameInput.value.trim() || 'Glow & Grow Fitness Challenge';
  state.startDate = new Date().toISOString();
  state.participants = [...setupParticipants];
  state.logs = {};
  state.customActivities = {};
  state.foodLogs = {};
  state.participants.forEach(p => { state.logs[p] = {}; state.customActivities[p] = {}; state.foodLogs[p] = {}; });
  saveState();
  fireConfetti();
  showToast('🎉 Challenge started!');
  showApp();
}

// ─── APP / NAVIGATION ──────────────────────
function showApp() {
  setupScreen.style.display = 'none';
  setupScreen.classList.remove('active');
  appWrapper.style.display = 'block';

  // Set header
  $('#app-challenge-name').textContent = state.challengeName;
  $('#app-day-number').textContent = getCurrentDay();
  $('#app-total-days').textContent = state.totalDays;

  currentTrackerDay = getCurrentDay();
  currentTrackerParticipant = state.participants[0] || null;

  navigateTo('dashboard-screen');
}

function navigateTo(screenId) {
  // Update nav
  $$('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenId);
  });

  // Switch screens
  $$('#app-wrapper > .screen, #app-wrapper .screen').forEach(s => s.classList.remove('active'));
  const target = $(`#${screenId}`);
  if (target) {
    target.classList.add('active');
    // Re-trigger animation
    target.style.animation = 'none';
    target.offsetHeight; // force reflow
    target.style.animation = '';
  }

  // Render the screen
  switch (screenId) {
    case 'dashboard-screen': renderDashboard(); break;
    case 'tracker-screen': renderTracker(); break;
    case 'leaderboard-screen': renderLeaderboard(); break;
    case 'challenges-screen': renderChallenges(); break;
    case 'history-screen': renderHistory(); break;
    case 'awards-screen': renderAwards(); break;
  }
}

// ─── DASHBOARD ─────────────────────────────
function renderDashboard() {
  const day = getCurrentDay();
  const totalDays = state.totalDays;
  const progress = day / totalDays;

  // Update header
  $('#app-day-number').textContent = day;
  $('#app-total-days').textContent = totalDays;

  // Progress ring
  const circumference = 2 * Math.PI * 60; // r=60
  const offset = circumference * (1 - progress);
  $('#progress-circle').style.strokeDashoffset = offset;
  $('#ring-day').textContent = day;
  $('#ring-total').textContent = totalDays;

  if (progress < 0.3) {
    $('#progress-subtitle').textContent = "You've got this! 💪";
  } else if (progress < 0.7) {
    $('#progress-subtitle').textContent = "Halfway there! Keep going! 🔥";
  } else if (progress < 1) {
    $('#progress-subtitle').textContent = "Almost done! Final push! ⚡";
  } else {
    $('#progress-subtitle').textContent = "Challenge complete! 🎉";
  }

  // Stats
  const ranked = getRankedPlayers();
  const totalGroupPoints = ranked.reduce((s, r) => s + r.points, 0);
  const bestStreak = Math.max(...ranked.map(r => r.streak), 0);
  const daysLogged = day;
  const avgPerDay = daysLogged > 0 && state.participants.length > 0
    ? (totalGroupPoints / (daysLogged * state.participants.length)).toFixed(1)
    : 0;

  $('#stat-participants').textContent = state.participants.length;
  $('#stat-total-points').textContent = totalGroupPoints;
  $('#stat-best-streak').textContent = bestStreak;
  $('#stat-avg-points').textContent = avgPerDay;

  // Leaderboard preview (top 3)
  const previewItems = ranked.slice(0, 3);
  const leaderboardContainer = $('#dashboard-leaderboard');
  leaderboardContainer.innerHTML = previewItems.map((p, i) => `
    <div class="leader-row rank-${i + 1}">
      <div class="rank-badge">${i + 1}</div>
      <div class="leader-info">
        <div class="leader-name">${escapeHtml(p.name)}</div>
        <div class="leader-streak"><span class="fire">🔥</span> ${p.streak} day streak</div>
      </div>
      <div class="leader-points">${p.points} <small>pts</small></div>
    </div>
  `).join('');

  // Weekly challenge
  const weekIdx = Math.min(getCurrentWeek() - 1, WEEKLY_CHALLENGES.length - 1);
  const wc = WEEKLY_CHALLENGES[weekIdx];
  $('#weekly-challenge-title').textContent = wc.title;
  $('#weekly-challenge-desc').textContent = wc.desc;

  // Calculate group progress for weekly challenge
  let weekProgress = 0;
  const weekStart = (getCurrentWeek() - 1) * 7 + 1;
  const weekEnd = Math.min(weekStart + 6, getCurrentDay());
  for (let d = weekStart; d <= weekEnd; d++) {
    let anyoneCompleted = false;
    state.participants.forEach(p => {
      if (state.logs[p]?.[String(d)]?.[wc.track]) anyoneCompleted = true;
    });
    if (anyoneCompleted) weekProgress++;
  }
  const wcPercent = Math.min(100, (weekProgress / wc.goal) * 100);
  $('#weekly-challenge-fill').style.width = wcPercent + '%';
  $('#weekly-challenge-meta-left').textContent = `${weekProgress} / ${wc.goal} ${wc.unit}`;
  $('#weekly-challenge-meta-right').textContent = `Week ${getCurrentWeek()}`;
}

// ─── DAILY TRACKER ─────────────────────────
function renderTracker() {
  const day = currentTrackerDay;
  const maxDay = getCurrentDay();

  // Date nav
  $('#tracker-current-date').textContent = `Day ${day}`;
  $('#btn-prev-day').disabled = day <= 1;
  $('#btn-next-day').disabled = day >= maxDay;
  $('#tracker-date-subtitle').textContent = formatDate(getDateForDay(day));

  // Participant chips
  const selectorEl = $('#participant-selector');
  selectorEl.innerHTML = state.participants.map(p => `
    <button class="participant-chip ${p === currentTrackerParticipant ? 'active' : ''}" data-player="${escapeHtml(p)}">
      ${escapeHtml(p)}
    </button>
  `).join('');

  selectorEl.querySelectorAll('.participant-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentTrackerParticipant = chip.dataset.player;
      renderTracker();
    });
  });

  if (!currentTrackerParticipant && state.participants.length > 0) {
    currentTrackerParticipant = state.participants[0];
  }

  const player = currentTrackerParticipant;
  $('#tracker-player-title').textContent = player ? `${player}'s Activities` : 'Select a participant';

  if (!player) return;

  // Ensure log structure
  if (!state.logs[player]) state.logs[player] = {};
  if (!state.logs[player][String(day)]) state.logs[player][String(day)] = {};
  if (!state.customActivities[player]) state.customActivities[player] = {};
  if (!state.customActivities[player][String(day)]) state.customActivities[player][String(day)] = [];
  const dayLog = state.logs[player][String(day)];
  const customList = state.customActivities[player][String(day)];

  // Render core activities
  const coreList = $('#core-activity-list');
  coreList.innerHTML = CORE_ACTIVITIES.map(a => {
    const checked = dayLog[a.id] ? 'checked' : '';
    return `
      <div class="activity-item ${checked}" data-activity="${a.id}">
        <div class="activity-checkbox">${checked ? '✓' : ''}</div>
        <div class="activity-details">
          <div class="activity-name">${a.icon} ${a.name}</div>
        </div>
        <div class="activity-points">+${a.points}</div>
      </div>
    `;
  }).join('');

  // Render bonus activities
  const bonusList = $('#bonus-activity-list');
  bonusList.innerHTML = BONUS_ACTIVITIES.map(a => {
    const checked = dayLog[a.id] ? 'checked' : '';
    return `
      <div class="activity-item ${checked}" data-activity="${a.id}">
        <div class="activity-checkbox">${checked ? '✓' : ''}</div>
        <div class="activity-details">
          <div class="activity-name">${a.icon} ${a.name}</div>
        </div>
        <div class="activity-points">+${a.points}</div>
      </div>
    `;
  }).join('');

  // Render custom activities
  const customListEl = $('#custom-activity-list');
  customListEl.innerHTML = customList.map((c, idx) => {
    const checked = c.done ? 'checked' : '';
    return `
      <div class="activity-item ${checked}" data-custom-idx="${idx}">
        <div class="activity-checkbox">${checked ? '✓' : ''}</div>
        <div class="activity-details">
          <div class="activity-name">⭐ ${escapeHtml(c.name)}</div>
        </div>
        <div class="activity-points">+${c.points}</div>
        <button class="remove-btn custom-remove-btn" data-custom-remove="${idx}" title="Remove">×</button>
      </div>
    `;
  }).join('');

  // Bind click handlers for core/bonus
  $$('#core-activity-list .activity-item, #bonus-activity-list .activity-item').forEach(item => {
    item.addEventListener('click', () => {
      const actId = item.dataset.activity;
      dayLog[actId] = !dayLog[actId];
      saveState();
      renderTracker();
    });
  });

  // Bind click handlers for custom activities (toggle done)
  $$('#custom-activity-list .activity-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.custom-remove-btn')) return; // don't toggle if removing
      const idx = parseInt(item.dataset.customIdx);
      customList[idx].done = !customList[idx].done;
      saveState();
      renderTracker();
    });
  });

  // Bind remove buttons for custom activities
  $$('.custom-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.customRemove);
      customList.splice(idx, 1);
      saveState();
      renderTracker();
    });
  });

  // Bind add custom activity button
  const addCustomBtn = $('#btn-add-custom-activity');
  // Remove old listeners by cloning
  const newAddBtn = addCustomBtn.cloneNode(true);
  addCustomBtn.parentNode.replaceChild(newAddBtn, addCustomBtn);
  newAddBtn.addEventListener('click', () => {
    const nameInput = $('#custom-activity-name');
    const ptsInput = $('#custom-activity-points');
    const name = nameInput.value.trim();
    const pts = Math.max(1, Math.min(10, parseInt(ptsInput.value) || 1));
    if (!name) { showToast('Enter an activity name'); return; }
    customList.push({ id: 'custom_' + Date.now(), name, points: pts, done: true });
    nameInput.value = '';
    ptsInput.value = '1';
    saveState();
    renderTracker();
    showToast(`✅ "${name}" added (+${pts} pts)`);
  });

  // Also allow Enter key in custom name input
  const customNameInput = $('#custom-activity-name');
  const newNameInput = customNameInput.cloneNode(true);
  customNameInput.parentNode.replaceChild(newNameInput, customNameInput);
  newNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('btn-add-custom-activity').click();
    }
  });

  // Points summary
  const todayPts = getPlayerDayPoints(player, day);
  $('#today-total-points').textContent = todayPts;

  // ─── FOOD TRACKER ────────────────────────
  if (!state.foodLogs) state.foodLogs = {};
  if (!state.foodLogs[player]) state.foodLogs[player] = {};
  if (!state.foodLogs[player][String(day)]) state.foodLogs[player][String(day)] = [];
  const foodList = state.foodLogs[player][String(day)];

  // Render food log list
  const foodLogEl = $('#food-log-list');
  foodLogEl.innerHTML = foodList.map((f, idx) => {
    const catEmoji = f.category === 'healthy' ? '🥬' : f.category === 'moderate' ? '🍽️' : '🍩';
    return `
      <div class="activity-item checked" data-food-idx="${idx}">
        <div class="activity-checkbox">${catEmoji}</div>
        <div class="activity-details">
          <div class="activity-name">${escapeHtml(f.name)}</div>
          <div class="food-cal-detail">${f.calories} cal · ${f.category} · +${f.points} pts</div>
        </div>
        <div class="activity-points">+${f.points}</div>
        <button class="remove-btn custom-remove-btn food-remove-btn" data-food-remove="${idx}" title="Remove">×</button>
      </div>
    `;
  }).join('');

  // Food remove buttons
  $$('.food-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.foodRemove);
      foodList.splice(idx, 1);
      saveState();
      renderTracker();
    });
  });

  // Food summary
  const foodSummaryEl = $('#food-day-summary');
  if (foodList.length > 0) {
    foodSummaryEl.style.display = 'flex';
    const totalCal = foodList.reduce((s, f) => s + f.calories, 0);
    const totalFoodPts = foodList.reduce((s, f) => s + f.points, 0);
    $('#food-total-calories').textContent = totalCal + ' cal';
    $('#food-total-points').textContent = '+' + totalFoodPts;
  } else {
    foodSummaryEl.style.display = 'none';
  }

  // Food autocomplete input
  const foodInput = $('#food-name-input');
  const suggestionsEl = $('#food-suggestions');
  const calDisplay = $('#food-cal-display');
  let selectedFood = null;

  // Clone to remove old listeners
  const newFoodInput = foodInput.cloneNode(true);
  foodInput.parentNode.replaceChild(newFoodInput, foodInput);

  newFoodInput.addEventListener('input', () => {
    const q = newFoodInput.value.trim();
    const results = lookupFood(q);
    if (results.length > 0 && q.length >= 2) {
      suggestionsEl.style.display = 'block';
      suggestionsEl.innerHTML = results.map(f => `
        <div class="food-suggestion-item" data-food-name="${escapeHtml(f.name)}" data-food-cal="${f.cal}" data-food-cat="${f.category}">
          <span>${escapeHtml(f.name)}</span>
          <span class="cal-hint">${f.cal} cal</span>
        </div>
      `).join('');

      suggestionsEl.querySelectorAll('.food-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          selectedFood = { name: item.dataset.foodName, calories: parseInt(item.dataset.foodCal), category: item.dataset.foodCat };
          newFoodInput.value = selectedFood.name;
          calDisplay.textContent = selectedFood.calories + ' cal';
          suggestionsEl.style.display = 'none';
        });
      });
    } else {
      suggestionsEl.style.display = 'none';
      // If no match, estimate based on text
      selectedFood = null;
      calDisplay.textContent = q ? '? cal' : '0 cal';
    }
  });

  newFoodInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('btn-add-food').click();
    }
  });

  // Click outside to close suggestions
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.food-input-wrapper')) {
      suggestionsEl.style.display = 'none';
    }
  });

  // Add food button
  const addFoodBtn = $('#btn-add-food');
  const newAddFoodBtn = addFoodBtn.cloneNode(true);
  addFoodBtn.parentNode.replaceChild(newAddFoodBtn, addFoodBtn);
  newAddFoodBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('food-name-input');
    const name = nameInput.value.trim();
    if (!name) { showToast('Enter a food item'); return; }

    let cal, category;
    if (selectedFood && selectedFood.name.toLowerCase() === name.toLowerCase()) {
      cal = selectedFood.calories;
      category = selectedFood.category;
    } else {
      // Try to find in database
      const match = FOOD_DATABASE.find(f => f.name.toLowerCase() === name.toLowerCase());
      if (match) {
        cal = match.cal;
        category = match.category;
      } else {
        // Unknown food — default moderate 200 cal
        cal = 200;
        category = 'moderate';
      }
    }

    const pts = getFoodPoints(category);
    foodList.push({ name, calories: cal, category, points: pts });
    nameInput.value = '';
    selectedFood = null;
    calDisplay.textContent = '0 cal';
    suggestionsEl.style.display = 'none';
    saveState();
    renderTracker();
    const catLabel = category === 'healthy' ? '🥬 Healthy' : category === 'moderate' ? '🍽️ Moderate' : '🍩 Indulgent';
    showToast(`${catLabel}: ${name} (${cal} cal, +${pts} pts)`);
  });
}



// ─── LEADERBOARD ───────────────────────────
function renderLeaderboard() {
  const ranked = getRankedPlayers();

  // Podium
  const podiumContainer = $('#leaderboard-podium');
  if (ranked.length >= 3) {
    const places = [
      { ...ranked[1], class: 'second', label: '🥈' },
      { ...ranked[0], class: 'first', label: '🥇' },
      { ...ranked[2], class: 'third', label: '🥉' },
    ];
    podiumContainer.innerHTML = places.map(p => `
      <div class="podium-place ${p.class}">
        <div class="podium-avatar">${p.name.charAt(0).toUpperCase()}</div>
        <div class="podium-name">${escapeHtml(p.name)}</div>
        <div class="podium-pts">${p.points} pts</div>
        <div class="podium-bar"></div>
        <div class="place-label">${p.label}</div>
      </div>
    `).join('');
  } else {
    podiumContainer.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Need at least 3 participants for podium</p>';
  }

  // Full list
  const fullList = $('#full-leaderboard');
  fullList.innerHTML = ranked.map((p, i) => `
    <div class="leader-row ${i < 3 ? 'rank-' + (i + 1) : ''}">
      <div class="rank-badge">${i + 1}</div>
      <div class="leader-info">
        <div class="leader-name">${escapeHtml(p.name)}</div>
        <div class="leader-streak"><span class="fire">🔥</span> ${p.streak} day streak</div>
      </div>
      <div class="leader-points">${p.points} <small>pts</small></div>
    </div>
  `).join('');
}

// ─── CHALLENGES ────────────────────────────
function renderChallenges() {
  const list = $('#challenges-list');
  list.innerHTML = WEEKLY_CHALLENGES.map((wc, idx) => {
    const weekNum = idx + 1;
    const isCurrentWeek = weekNum === getCurrentWeek();
    const isPast = weekNum < getCurrentWeek();

    // Calculate progress
    const weekStart = idx * 7 + 1;
    const weekEnd = Math.min(weekStart + 6, getCurrentDay());
    let progress = 0;

    if (weekStart <= getCurrentDay()) {
      for (let d = weekStart; d <= weekEnd; d++) {
        let anyoneCompleted = false;
        state.participants.forEach(p => {
          if (state.logs[p]?.[String(d)]?.[wc.track]) anyoneCompleted = true;
        });
        if (anyoneCompleted) progress++;
      }
    }

    const percent = Math.min(100, (progress / wc.goal) * 100);
    const statusClass = isCurrentWeek ? 'active-challenge' : '';

    return `
      <div class="glass-card challenge-card ${statusClass}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <h3>${wc.title}</h3>
          <span style="font-size:0.75rem;color:var(--text-muted);padding:4px 10px;background:rgba(255,255,255,0.06);border-radius:20px">
            ${isCurrentWeek ? '🟢 Active' : isPast ? '✅ Done' : '⏳ Upcoming'}
          </span>
        </div>
        <p>${wc.desc}</p>
        <div class="challenge-progress">
          <div class="challenge-progress-fill" style="width:${percent}%"></div>
        </div>
        <div class="challenge-meta">
          <span>${progress} / ${wc.goal} ${wc.unit}</span>
          <span>Week ${weekNum}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ─── HISTORY ───────────────────────────────
let historySelectedPlayer = null;

function renderHistory() {
  if (!historySelectedPlayer) historySelectedPlayer = state.participants[0] || null;

  // Participant selector for history
  const selectorEl = $('#history-participant-selector');
  selectorEl.innerHTML = state.participants.map(p => `
    <button class="participant-chip ${p === historySelectedPlayer ? 'active' : ''}" data-player="${escapeHtml(p)}">
      ${escapeHtml(p)}
    </button>
  `).join('');

  selectorEl.querySelectorAll('.participant-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      historySelectedPlayer = chip.dataset.player;
      renderHistory();
    });
  });

  if (!historySelectedPlayer) return;

  const calendarEl = $('#history-calendar');
  const currentDay = getCurrentDay();
  const startDate = new Date(state.startDate);
  startDate.setHours(0, 0, 0, 0);

  // Day labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let html = dayLabels.map(d => `<div class="calendar-day-label">${d}</div>`).join('');

  // Empty cells before first day
  const startDayOfWeek = startDate.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    html += '<div class="calendar-cell empty"></div>';
  }

  // Day cells
  for (let d = 1; d <= state.totalDays; d++) {
    const pts = getPlayerDayPoints(historySelectedPlayer, d);
    const isFuture = d > currentDay;
    const isToday = d === currentDay;

    let heatLevel = 0;
    if (!isFuture && pts > 0) {
      const pctOfMax = pts / MAX_DAILY_POINTS;
      if (pctOfMax <= 0.2) heatLevel = 1;
      else if (pctOfMax <= 0.4) heatLevel = 2;
      else if (pctOfMax <= 0.6) heatLevel = 3;
      else if (pctOfMax <= 0.8) heatLevel = 4;
      else heatLevel = 5;
    }

    const classes = [
      'calendar-cell',
      isFuture ? 'future' : '',
      isToday ? 'today' : '',
      !isFuture && pts > 0 ? 'logged' : '',
      `heat-${heatLevel}`,
    ].filter(Boolean).join(' ');

    html += `<div class="${classes}" data-day="${d}" title="Day ${d}: ${pts} pts">${d}</div>`;
  }

  calendarEl.innerHTML = html;

  // Click handler for day cells
  calendarEl.querySelectorAll('.calendar-cell:not(.empty):not(.future)').forEach(cell => {
    cell.addEventListener('click', () => {
      const d = parseInt(cell.dataset.day);
      showDayDetail(historySelectedPlayer, d);
    });
  });

  // Hide detail card initially
  $('#history-day-detail').style.display = 'none';
}

function showDayDetail(player, day) {
  const detailCard = $('#history-day-detail');
  detailCard.style.display = 'block';
  $('#history-detail-title').textContent = `Day ${day} — ${formatDate(getDateForDay(day))}`;

  const dayLog = state.logs[player]?.[String(day)] || {};
  const allActivities = [...CORE_ACTIVITIES, ...BONUS_ACTIVITIES];

  const activitiesHtml = allActivities.map(a => {
    const done = dayLog[a.id];
    return `
      <div class="detail-item">
        <span>${a.icon} ${a.name}</span>
        <span class="status-icon">${done ? '✅' : '❌'}</span>
      </div>
    `;
  }).join('');

  const total = getPlayerDayPoints(player, day);
  $('#history-detail-activities').innerHTML = activitiesHtml +
    `<div class="detail-item" style="font-weight:700;border:none;margin-top:8px">
      <span>Total Points</span>
      <span style="color:var(--accent-gold)">${total}</span>
    </div>`;

  detailCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── AWARDS ────────────────────────────────
function renderAwards() {
  const ranked = getRankedPlayers();
  const currentDay = getCurrentDay();
  const challengeComplete = currentDay >= state.totalDays;

  const awards = AWARDS_CONFIG.map(award => {
    let winner = null;
    let value = '';

    switch (award.id) {
      case 'champion':
        if (ranked.length > 0) {
          winner = ranked[0].name;
          value = `${ranked[0].points} pts`;
        }
        break;
      case 'consistent': {
        let best = { name: null, streak: 0 };
        state.participants.forEach(p => {
          // Calculate max streak (not just current)
          let maxStreak = 0, curr = 0;
          for (let d = 1; d <= currentDay; d++) {
            if (getPlayerDayPoints(p, d) > 0) {
              curr++;
              maxStreak = Math.max(maxStreak, curr);
            } else {
              curr = 0;
            }
          }
          if (maxStreak > best.streak) {
            best = { name: p, streak: maxStreak };
          }
        });
        if (best.name) {
          winner = best.name;
          value = `${best.streak} day streak`;
        }
        break;
      }
      case 'improved': {
        let best = { name: null, improvement: -Infinity };
        state.participants.forEach(p => {
          // Compare last 7 days vs the 7 before that
          let recent = 0, prev = 0;
          const end = currentDay;
          const mid = Math.max(1, end - 6);
          const start = Math.max(1, mid - 7);
          for (let d = mid; d <= end; d++) recent += getPlayerDayPoints(p, d);
          for (let d = start; d < mid; d++) prev += getPlayerDayPoints(p, d);
          const imp = recent - prev;
          if (imp > best.improvement) {
            best = { name: p, improvement: imp };
          }
        });
        if (best.name && best.improvement > 0) {
          winner = best.name;
          value = `+${best.improvement} pts vs prev week`;
        }
        break;
      }
      case 'hydrator': {
        let best = { name: null, count: 0 };
        state.participants.forEach(p => {
          const c = getPlayerActivityCount(p, 'water');
          if (c > best.count) best = { name: p, count: c };
        });
        if (best.name && best.count > 0) {
          winner = best.name;
          value = `${best.count} days`;
        }
        break;
      }
      case 'earlybird': {
        let best = { name: null, count: 0 };
        state.participants.forEach(p => {
          const c = getPlayerActivityCount(p, 'sleep');
          if (c > best.count) best = { name: p, count: c };
        });
        if (best.name && best.count > 0) {
          winner = best.name;
          value = `${best.count} nights`;
        }
        break;
      }
      case 'chef': {
        let best = { name: null, count: 0 };
        state.participants.forEach(p => {
          const c = getPlayerActivityCount(p, 'meal');
          if (c > best.count) best = { name: p, count: c };
        });
        if (best.name && best.count > 0) {
          winner = best.name;
          value = `${best.count} meals`;
        }
        break;
      }
    }

    return { ...award, winner, value };
  });

  $('#awards-list').innerHTML = awards.map(a => `
    <div class="glass-card award-card">
      <div class="award-icon">${a.icon}</div>
      <div class="award-info">
        <h3>${a.title}</h3>
        <div class="award-desc">${a.desc}</div>
        ${a.winner
      ? `<div class="award-winner">👑 ${escapeHtml(a.winner)} · ${a.value}</div>`
      : `<div class="award-winner pending">⏳ ${challengeComplete ? 'No winner' : 'In progress…'}</div>`
    }
      </div>
    </div>
  `).join('');
}

// ─── HELPERS ───────────────────────────────
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ─── BOOT ──────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
