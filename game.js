import { clamp, formatStats, summarize } from "./engine.js";
import { getEvent } from "./events.js";

const statsEl = document.getElementById("stats");
const storyEl = document.getElementById("story");
const choicesEl = document.getElementById("choices");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");

let state = null;

function renderStats() {
  statsEl.innerHTML = "";
  formatStats(state).forEach(({ key, value }) => {
    const div = document.createElement("div");
    div.className = "stat";
    div.textContent = `${key}: ${value}`;
    statsEl.appendChild(div);
  });
}

function applyBounds() {
  state.energy = clamp(state.energy, -999, 100);
  state.supplies = clamp(state.supplies, -999, 100);
  state.hope = clamp(state.hope, 0, 100);
}

function checkEnd() {
  if (state.supplies <= 0) {
    storyEl.textContent = `You run out of supplies. The AI narrator falls silent. You made it to day ${state.day}.`;
    choicesEl.innerHTML = "";
    return true;
  }
  if (state.energy <= 0) {
    storyEl.textContent = `You collapse from exhaustion. The AI narrator ends the story. You made it to day ${state.day}.`;
    choicesEl.innerHTML = "";
    return true;
  }
  if (state.day >= 21) {
    storyEl.textContent = `Three weeks pass. A rescue convoy arrives. You survived. AI narrator declares you a statistical anomaly.`;
    choicesEl.innerHTML = "";
    return true;
  }
  return false;
}

function runDay(event, choice) {
  state.day += 1;
  state.supplies -= 4;
  state.energy -= 2;

  const outcome = choice.resolve(state);

  applyBounds();
  const narrative = summarize(state, event, outcome);

  storyEl.textContent = narrative;
  renderStats();

  if (checkEnd()) return;

  setTimeout(() => {
    const nextEvent = getEvent(state);
    presentEvent(nextEvent);
  }, 600);
}

function presentEvent(event) {
  choicesEl.innerHTML = "";
  storyEl.textContent = event.description;

  event.choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = c.label;
    btn.onclick = () => runDay(event, c);
    choicesEl.appendChild(btn);
  });
}

function start() {
  const name = nameInput.value.trim() || "Traveler";
  state = {
    name,
    day: 0,
    energy: 80,
    supplies: 60,
    hope: 55,
  };

  applyBounds();
  renderStats();

  const firstEvent = getEvent(state);
  presentEvent(firstEvent);
}

startBtn.addEventListener("click", start);
