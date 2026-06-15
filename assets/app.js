const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function parseLines(value) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function updateClock() {
  const clock = $("#liveClock");
  if (!clock) return;

  const now = new Date();
  const time = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul"
  }).format(now);
  const date = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "full",
    timeZone: "Asia/Seoul"
  }).format(now);

  clock.textContent = time;
  const dateNode = $("#liveDate");
  if (dateNode) dateNode.textContent = `${date} · 한국 표준시(KST)`;

  const target = $("#targetTime");
  const countdown = $("#countdown");
  if (target && countdown && target.value) {
    const [hour, minute, second = "0"] = target.value.split(":");
    const goal = new Date(now);
    goal.setHours(Number(hour), Number(minute), Number(second), 0);
    if (goal < now) goal.setDate(goal.getDate() + 1);
    const diff = Math.max(0, goal - now);
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    countdown.textContent = `${h}:${m}:${s} 남음`;
  }
}

function initClock() {
  if (!$("#liveClock")) return;
  updateClock();
  setInterval(updateClock, 250);
  const target = $("#targetTime");
  if (target) target.addEventListener("input", updateClock);
  $$(".quick-time").forEach((button) => {
    button.addEventListener("click", () => {
      $("#targetTime").value = button.dataset.time;
      updateClock();
    });
  });
}

function initLadder() {
  const button = $("#ladderRun");
  if (!button) return;

  button.addEventListener("click", () => {
    const names = parseLines($("#ladderNames").value);
    const prizes = parseLines($("#ladderPrizes").value);
    const result = $("#ladderResult");

    if (names.length < 2 || prizes.length < 2) {
      result.innerHTML = "이름과 결과를 각각 2개 이상 입력해 주세요.";
      return;
    }

    const matched = shuffle(prizes);
    result.innerHTML = `<div class="ladder-grid">${names.map((name, index) => `
      <div class="ladder-row">
        <strong>${escapeHtml(name)}</strong>
        <span class="ladder-arrow">→</span>
        <span>${escapeHtml(matched[index % matched.length])}</span>
      </div>
    `).join("")}</div>`;
  });
}

function initRoulette() {
  const button = $("#rouletteRun");
  if (!button) return;

  button.addEventListener("click", () => {
    const items = parseLines($("#rouletteItems").value);
    const result = $("#rouletteResult");
    const board = $("#rouletteBoard");

    if (items.length < 2) {
      result.innerHTML = "룰렛 항목을 2개 이상 입력해 주세요.";
      return;
    }

    board.classList.remove("spin");
    void board.offsetWidth;
    board.classList.add("spin");

    const winner = items[Math.floor(Math.random() * items.length)];
    setTimeout(() => {
      result.innerHTML = `<div class="winner">${escapeHtml(winner)}</div><p>총 ${items.length}개 항목 중 무작위로 선택했어요.</p>`;
      const center = $(".roulette-center");
      if (center) center.textContent = winner;
    }, 720);
  });
}

function initPicker() {
  const drawButton = $("#pickOne");
  const teamButton = $("#makeTeams");
  if (!drawButton || !teamButton) return;

  drawButton.addEventListener("click", () => {
    const items = parseLines($("#pickerItems").value);
    const result = $("#pickerResult");
    if (items.length < 1) {
      result.textContent = "항목을 1개 이상 입력해 주세요.";
      return;
    }
    const winner = items[Math.floor(Math.random() * items.length)];
    result.innerHTML = `<div class="winner">${escapeHtml(winner)}</div>`;
  });

  teamButton.addEventListener("click", () => {
    const items = shuffle(parseLines($("#pickerItems").value));
    const count = Number($("#teamCount").value || 2);
    const result = $("#pickerResult");
    if (items.length < count) {
      result.textContent = "팀 수보다 많은 항목을 입력해 주세요.";
      return;
    }
    const teams = Array.from({ length: count }, () => []);
    items.forEach((item, index) => teams[index % count].push(item));
    result.innerHTML = `<ul class="result-list">${teams.map((team, index) => `
      <li><strong>${index + 1}팀</strong><br>${team.map(escapeHtml).join(", ")}</li>
    `).join("")}</ul>`;
  });
}

function initOrderPicker() {
  const button = $("#orderRun");
  if (!button) return;

  button.addEventListener("click", () => {
    const items = shuffle(parseLines($("#orderItems").value));
    const result = $("#orderResult");
    if (items.length < 2) {
      result.textContent = "발표자를 2명 이상 입력해 주세요.";
      return;
    }

    result.innerHTML = `<ol class="result-list">${items.map((item) => `
      <li>${escapeHtml(item)}</li>
    `).join("")}</ol>`;
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

initClock();
initLadder();
initRoulette();
initPicker();
initOrderPicker();
