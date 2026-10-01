// =====================================================
// ✏️ CHANGE YOUR RAFFLE DETAILS HERE
// =====================================================
const raffle = {
  title: "TODAY'S RAFFLE",
  prize: "₦50,000 CASH",
  headline: "WIN ₦50,000 CASH!",   // big text on the raffle card
  entry: "FREE",
  ticketsAvailable: 100,
  drawTime: "TODAY",

  // ✏️ ADD OR REMOVE PARTICIPANTS HERE
  participants: [
    "Pedro",
    "Pedra",
    "Daniel",
    "Sarah",
    "Michael",
    "David",
    "Grace",
    "John"
  ],

  // ✏️ CHANGE THE PRIZES HERE
  prizes: [
    { icon: "🥇", name: "FIRST PRIZE",  amount: "₦50,000 CASH" },
    { icon: "🥈", name: "SECOND PRIZE", amount: "₦20,000 CASH" },
    { icon: "🥉", name: "THIRD PRIZE",  amount: "₦10,000 CASH" }
  ],

  // ✏️ CHANGE THE STATISTICS HERE (number, suffix after the number, label)
  stats: [
    { number: 100, suffix: "",  label: "Participants" },
    { number: 250, suffix: "",  label: "Tickets" },
    { number: 3,   suffix: "",  label: "Winners" },
    { number: 100, suffix: "%", label: "Fun 😎" }
  ]
};
// =====================================================
// You don't need to change anything below this line 👇
// =====================================================

const $ = (id) => document.getElementById(id);

// ---------- Fill the page with the raffle details ----------
$("rTitle").textContent = "🎉 " + raffle.title;
$("rPrize").textContent = raffle.headline;
$("rTickets").textContent = raffle.ticketsAvailable;
$("rEntry").textContent = raffle.entry;
$("rTime").textContent = raffle.drawTime;

// ---------- Give every participant a random ticket number ----------
const people = raffle.participants.map((name) => ({ name: name, ticket: "" }));
const usedNumbers = [];
people.forEach((p) => {
  let num;
  do { num = 1000 + Math.floor(Math.random() * 9000); } while (usedNumbers.includes(num));
  usedNumbers.push(num);
  p.ticket = "LS-" + num;
});

// ---------- Show participant cards ----------
$("people").innerHTML = people.map((p) =>
  `<div class="person"><div class="avatar">${p.name[0]}</div><b>${p.name}</b><span>${p.ticket}</span></div>`
).join("");

// ---------- Show prize cards ----------
$("prizeList").innerHTML = raffle.prizes.map((z) =>
  `<div class="prize-card"><div class="icon">${z.icon}</div><h3>${z.name}</h3><p>${z.amount}</p></div>`
).join("");

// ---------- Show statistics (numbers start at 0 and count up) ----------
$("stats").innerHTML = raffle.stats.map((s) =>
  `<div><b class="count" data-to="${s.number}" data-suffix="${s.suffix}">0${s.suffix}</b>${s.label}</div>`
).join("");

function countUp(el) {
  const to = Number(el.dataset.to);
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / 1500, 1);
    el.textContent = Math.round(to * progress) + el.dataset.suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
// Start counting when the section scrolls into view
const watcher = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".count").forEach(countUp);
      watcher.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
watcher.observe($("stats"));

// ---------- Mobile menu ----------
$("burger").onclick = () => $("menu").classList.toggle("open");
document.querySelectorAll(".menu a").forEach((a) => {
  a.onclick = () => $("menu").classList.remove("open");
});

// ---------- THE DRAW ----------
let drawing = false;

function startDraw() {
  if (drawing || people.length === 0) return;
  drawing = true;
  $("menu").classList.remove("open");

  // 1. Pick the winner randomly
  const winner = people[Math.floor(Math.random() * people.length)];

  // 2. Show the popup
  $("modal").style.display = "flex";
  $("mResult").style.display = "none";
  $("mTitle").style.display = "block";
  $("mTitle").textContent = "GET READY…";
  $("mName").style.display = "block";
  $("mName").textContent = "🎲";

  // 3. After a short pause, cycle through names (fast, then slower)
  let count = 0;
  const totalSteps = 32;

  function cycle() {
    if (count >= totalSteps) return showWinner(winner);   // finished!
    // On the last step show the winner, otherwise show a random name
    const name = count === totalSteps - 1 ? winner.name : people[Math.floor(Math.random() * people.length)].name;
    $("mName").textContent = name;
    count++;
    // Wait longer and longer between names = slowing down
    setTimeout(cycle, 60 + (count / totalSteps) * (count / totalSteps) * 500);
  }
  setTimeout(() => { $("mTitle").textContent = "DRAWING…"; cycle(); }, 1500);
}

function showWinner(winner) {
  $("mTitle").style.display = "none";
  $("mName").style.display = "none";
  $("rName").textContent = winner.name.toUpperCase();
  $("rTicket").textContent = winner.ticket;
  $("rWon").textContent = raffle.prize;
  $("mResult").style.display = "block";
  launchConfetti();

  // Fill the winner card on the page
  $("wName").textContent = winner.name;
  $("wTicket").textContent = winner.ticket;
  $("wPrize").textContent = "You won " + raffle.prize + "!";
  $("winnerCard").classList.add("show");
  $("noWinner").style.display = "none";
  drawing = false;
}

$("startBtn").onclick = startDraw;
$("navDraw").onclick = startDraw;
$("againBtn").onclick = startDraw;
$("closeBtn").onclick = () => {
  $("modal").style.display = "none";
  $("winners").scrollIntoView();
};

// ---------- CONFETTI (simple, no libraries) ----------
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];

function launchConfetti() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ["#D4AF37", "#FFF8ED", "#6D1F3A", "#FFFFFF", "#f3d97a"];
  pieces = [];
  for (let i = 0; i < 160; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: 6 + Math.random() * 8,
      speed: 2 + Math.random() * 4,
      drift: Math.random() * 2 - 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.y += p.speed;
    p.x += p.drift;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
  });
  pieces = pieces.filter((p) => p.y < canvas.height + 20);
  if (pieces.length > 0) requestAnimationFrame(animateConfetti);
  else ctx.clearRect(0, 0, canvas.width, canvas.height);
}
