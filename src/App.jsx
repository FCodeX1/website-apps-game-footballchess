import React, { useCallback, useEffect, useMemo, useState } from "react";

const MY_TEAM_ID = 1;
const BOARD_ROWS = 12;
const BOARD_COLS = 8;
const MAX_ACTIONS = 62;
const MAX_AP = 3;
const GOAL_COLS = [3, 4];
const INITIAL_CASH = 0;
const SAVE_KEY = "bola-catur-arena-career-v5";
const SAVE_VERSION = 5;
const SAVE_FILE_NAME = "bola-catur-arena-save.json";
const COMPETITIONS = {
  liga48: { key: "liga48", title: "Liga Utama 48 Klub", subtitle: "Musim penuh, home/away, piala selingan, ekonomi kandang.", badge: "Career" },
};

const CLUB_DATA = [
  [1, "FC Nusantara", "Jakarta", "#e63946", 60000, "Possession"],
  [2, "Garuda FC", "Surabaya", "#f4a261", 57000, "High Press"],
  [3, "Elang Merah", "Bandung", "#2a9d8f", 53000, "Counter"],
  [4, "Rajawali SC", "Medan", "#e9c46a", 50000, "Long Ball"],
  [5, "Badak United", "Semarang", "#a8dadc", 43000, "Park Bus"],
  [6, "Macan Selatan", "Yogyakarta", "#ffb703", 45500, "Wing Play"],
  [7, "Krakatau City", "Cilegon", "#fb8500", 39000, "Physical"],
  [8, "Borneo Rovers", "Samarinda", "#90be6d", 42000, "Chaos"],
  [9, "Papua Star", "Jayapura", "#c77dff", 34000, "Counter"],
  [10, "Celebes United", "Makassar", "#48cae4", 45500, "Possession"],
  [11, "Bali Phoenix", "Denpasar", "#ff006e", 47000, "Wing Play"],
  [12, "Malang Tigers", "Malang", "#ffd166", 37000, "High Press"],
  [13, "Lampung Sailors", "Lampung", "#06d6a0", 30500, "Long Ball"],
  [14, "Riau Thunder", "Pekanbaru", "#118ab2", 32000, "Park Bus"],
  [15, "Solo Knights", "Solo", "#ef476f", 36500, "Physical"],
  [16, "Madura Bulls", "Madura", "#8ecae6", 31500, "Chaos"],
  [17, "Batavia Crown", "Jakarta", "#ff595e", 58000, "Tiki Taka"],
  [18, "Sunda Royals", "Bogor", "#1982c4", 41000, "Possession"],
  [19, "Bekasi Iron", "Bekasi", "#6a4c93", 39500, "Physical"],
  [20, "Tangerang Meteor", "Tangerang", "#8ac926", 36000, "High Press"],
  [21, "Aceh Rencong", "Banda Aceh", "#00b4d8", 33500, "Counter"],
  [22, "Minang Warriors", "Padang", "#ffca3a", 35000, "Wing Play"],
  [23, "Jambi Jaguars", "Jambi", "#8338ec", 28500, "Long Ball"],
  [24, "Palembang River", "Palembang", "#3a86ff", 37000, "Tiki Taka"],
  [25, "Pontianak Hornbills", "Pontianak", "#06d6a0", 30000, "Park Bus"],
  [26, "Banjar Emerald", "Banjarmasin", "#2ec4b6", 31500, "Chaos"],
  [27, "Kupang Waves", "Kupang", "#ff9f1c", 24500, "Counter"],
  [28, "Ambon Spice", "Ambon", "#bc6c25", 26000, "Possession"],
  [29, "Manado Sharks", "Manado", "#0077b6", 28000, "Wing Play"],
  [30, "Ternate Volcano", "Ternate", "#d62828", 22500, "Physical"],
  [31, "Lombok Galaxy", "Mataram", "#7209b7", 30000, "High Press"],
  [32, "Cirebon Mariners", "Cirebon", "#4cc9f0", 29000, "Long Ball"],
  [33, "Pati Guardians", "Pati", "#ffafcc", 25500, "Possession"],
  [34, "Kediri Armada", "Kediri", "#bde0fe", 33500, "Wing Play"],
  [35, "Madiun Locos", "Madiun", "#a2d2ff", 24500, "Counter"],
  [36, "Ponorogo Reog", "Ponorogo", "#ffc8dd", 23500, "Physical"],
  [37, "Purwokerto Oaks", "Purwokerto", "#cdb4db", 27500, "Park Bus"],
  [38, "Banyuwangi Bulls", "Banyuwangi", "#90dbf4", 26500, "High Press"],
  [39, "Karawang Steel", "Karawang", "#f7a072", 32000, "Long Ball"],
  [40, "Depok Wolves", "Depok", "#6dd3ce", 30000, "Chaos"],
  [41, "Tasik Tornado", "Tasikmalaya", "#f4d35e", 28500, "Tiki Taka"],
  [42, "Sukabumi Atlas", "Sukabumi", "#ee964b", 27000, "Counter"],
  [43, "Palu Eagles", "Palu", "#0ead69", 24500, "Wing Play"],
  [44, "Gorontalo Moon", "Gorontalo", "#4361ee", 23000, "Possession"],
  [45, "Bitung Harbor", "Bitung", "#ff477e", 22000, "Long Ball"],
  [46, "Serang Spartans", "Serang", "#ffd60a", 32500, "High Press"],
  [47, "Kudus Kretek", "Kudus", "#00bbf9", 25500, "Physical"],
  [48, "Probolinggo Comets", "Probolinggo", "#9b5de5", 24500, "Chaos"],
];

const FIRST_NAMES = ["Arya", "Bima", "Candra", "Dani", "Eko", "Fajar", "Galih", "Hendra", "Ilham", "Joko", "Kevin", "Luthfi", "Mirza", "Nanda", "Oki", "Putra", "Rafi", "Sandi", "Tama", "Udin", "Wahyu", "Yogi", "Zaki", "Andre", "Bayu", "Rendra", "Fikri", "Aditya", "Dimas", "Reza", "Hafiz", "Arkan", "Farrel", "Rizky", "Irfan", "Yudha", "Rama", "Bagas", "Gilang", "Nabil"];
const LAST_NAMES = ["Pratama", "Santoso", "Wijaya", "Kusuma", "Ramadhan", "Hidayat", "Nugraha", "Setiawan", "Firmansyah", "Wibowo", "Susanto", "Suryadi", "Hartono", "Handoko", "Purnomo", "Gunawan", "Kurniawan", "Saputra", "Mahendra", "Perdana", "Hakim", "Nugroho", "Utama", "Prakoso", "Siregar", "Lubis", "Hasibuan", "Tanjung", "Latuconsina", "Mandagi"];
const BASE_POSITIONS = ["GK", "LB", "CB", "CB", "RB", "CDM", "CM", "CM", "CAM", "LW", "ST", "RW"];
const EXTRA_POSITIONS = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "ST"];
const POS_LABELS = { GK: "Kiper", LB: "Bek Kiri", CB: "Bek Tengah", RB: "Bek Kanan", CDM: "Gelandang Bertahan", CM: "Gelandang", CAM: "Gelandang Serang", LM: "Sayap Kiri", RM: "Sayap Kanan", LW: "Winger Kiri", RW: "Winger Kanan", ST: "Striker" };

const TRAITS = [
  { key: "Poacher", icon: "🎯", desc: "+12 finishing di kotak penalti" },
  { key: "Playmaker", icon: "🧠", desc: "+12 umpan progresif" },
  { key: "Speedster", icon: "⚡", desc: "+1 jarak dribel/run" },
  { key: "Destroyer", icon: "🛡️", desc: "+12 tackle dan pressing" },
  { key: "Wall Defender", icon: "🧱", desc: "+10 blok shot" },
  { key: "Sweeper Keeper", icon: "🧤", desc: "Kiper lebih aktif saat clearance" },
  { key: "Captain", icon: "👑", desc: "+1 momentum tim" },
  { key: "Super Sub", icon: "🔥", desc: "+8 semua aksi saat energi tinggi" },
  { key: "Set Piece Ace", icon: "🎲", desc: "+15 free kick / corner" },
  { key: "Trickster", icon: "🌀", desc: "+15 skill move" },
];


const PERSONALITIES = [
  { key: "Leader", icon: "👑", desc: "Morale tim lebih stabil." },
  { key: "Ambitious", icon: "🚀", desc: "Cepat berkembang, tapi bisa minta pindah." },
  { key: "Loyal", icon: "🤝", desc: "Lebih jarang drama kontrak." },
  { key: "Professional", icon: "📋", desc: "Training lebih konsisten." },
  { key: "Big Match", icon: "🔥", desc: "Bonus di derby dan laga besar." },
  { key: "Inconsistent", icon: "🎲", desc: "Performa lebih naik turun." },
  { key: "Hot Temper", icon: "🌶️", desc: "Lebih rawan kartu." },
  { key: "Injury Prone", icon: "🏥", desc: "Cedera lebih mungkin terjadi." },
  { key: "Lazy", icon: "😴", desc: "Training lebih lambat." },
  { key: "Wonderkid Mindset", icon: "🌟", desc: "5% rare: potensi besar kalau benar ditemukan scout." },
];
const CUP_WEEKS = new Set([8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88]);
const MANAGER_EVENTS = [
  { key: "press", title: "Media mempertanyakan taktik", choices: ["Jawab tenang", "Serang balik media", "Fokus ke pemain" ] },
  { key: "captain", title: "Kapten meminta rotasi pemain muda", choices: ["Setuju", "Tolak", "Janji minggu depan" ] },
  { key: "sponsor", title: "Sponsor menawarkan bonus kemenangan kandang", choices: ["Ambil target", "Tolak tekanan", "Minta bonus seri" ] },
  { key: "fans", title: "Fans menuntut permainan menyerang", choices: ["Main ofensif", "Tetap realistis", "Rotasi sayap" ] },
  { key: "youth", title: "Pemain akademi tampil bagus di latihan", choices: ["Promosikan", "Pantau dulu", "Pinjamkan" ] },
];

const FORMATIONS = {
  "4-3-3": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 3, 8], ["CM", 2, 6], ["CM", 5, 6], ["LW", 1, 4], ["ST", 3, 3], ["RW", 6, 4]],
  "4-2-3-1": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 2, 8], ["CDM", 5, 8], ["LW", 1, 5], ["CAM", 3, 5], ["RW", 6, 5], ["ST", 3, 3]],
  "4-4-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["LM", 0, 6], ["CM", 2, 7], ["CM", 5, 7], ["RM", 7, 6], ["ST", 2, 3], ["ST", 5, 3]],
  "3-5-2": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["LM", 0, 7], ["CM", 2, 7], ["CDM", 3, 8], ["CM", 5, 7], ["RM", 7, 7], ["ST", 2, 3], ["ST", 5, 3]],
  "5-3-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 1, 9], ["CB", 3, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 2, 7], ["CDM", 3, 8], ["CM", 5, 7], ["ST", 2, 3], ["ST", 5, 3]],
  "3-4-3": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["LM", 0, 7], ["CM", 2, 7], ["CM", 5, 7], ["RM", 7, 7], ["LW", 1, 4], ["ST", 3, 3], ["RW", 6, 4]],
  "4-1-4-1": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 3, 8], ["LM", 0, 6], ["CM", 2, 6], ["CM", 5, 6], ["RM", 7, 6], ["ST", 3, 3]],
  "4-3-1-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 1, 7], ["CDM", 3, 8], ["CM", 6, 7], ["CAM", 3, 5], ["ST", 2, 3], ["ST", 5, 3]],
  "4-5-1": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["LM", 0, 6], ["CM", 2, 7], ["CDM", 3, 8], ["CM", 5, 7], ["RM", 7, 6], ["ST", 3, 3]],
  "4-2-2-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 2, 8], ["CDM", 5, 8], ["CAM", 2, 5], ["CAM", 5, 5], ["ST", 2, 3], ["ST", 5, 3]],
  "3-4-1-2": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["LM", 0, 7], ["CM", 2, 7], ["CM", 5, 7], ["RM", 7, 7], ["CAM", 3, 5], ["ST", 2, 3], ["ST", 5, 3]],
  "5-2-3": [["GK", 3, 11], ["LB", 0, 9], ["CB", 1, 9], ["CB", 3, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 2, 7], ["CM", 5, 7], ["LW", 1, 4], ["ST", 3, 3], ["RW", 6, 4]],
  "4-2-4": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 2, 7], ["CM", 5, 7], ["LW", 0, 4], ["ST", 2, 3], ["ST", 5, 3], ["RW", 7, 4]],
  "3-3-3-1": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["CDM", 2, 8], ["CM", 3, 7], ["CDM", 5, 8], ["LW", 1, 5], ["CAM", 3, 5], ["RW", 6, 5], ["ST", 3, 3]],
  "4-6-0": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 2, 8], ["CDM", 5, 8], ["LM", 0, 6], ["CM", 2, 6], ["CM", 5, 6], ["RM", 7, 6]],
};

const COMPATIBLE = {
  GK: ["GK"], CB: ["CB", "LB", "RB", "CDM"], LB: ["LB", "CB", "LM"], RB: ["RB", "CB", "RM"],
  CDM: ["CDM", "CM", "CB"], CM: ["CM", "CDM", "CAM", "LM", "RM"], CAM: ["CAM", "CM", "ST", "LW", "RW"],
  LM: ["LM", "LW", "CM", "LB"], RM: ["RM", "RW", "CM", "RB"], LW: ["LW", "LM", "RW", "ST"], RW: ["RW", "RM", "LW", "ST"], ST: ["ST", "CAM", "LW", "RW"],
};

const TRAINING_PLANS = {
  balanced: { label: "Balanced", icon: "⚖️", desc: "Sedikit bonus semua aspek.", pass: 3, shot: 3, tackle: 3, recovery: 2 },
  finishing: { label: "Finishing", icon: "🥅", desc: "+9 shot, striker dapat XP.", shot: 9 },
  pressing: { label: "Pressing", icon: "🐺", desc: "+9 tackle dan pressure.", tackle: 9, pressure: 1 },
  passing: { label: "Passing", icon: "🎯", desc: "+9 passing dan through ball.", pass: 9 },
  recovery: { label: "Recovery", icon: "💚", desc: "Energi lebih awet dan cedera turun.", recovery: 8, injuryGuard: 12 },
  youth: { label: "Youth Focus", icon: "🌱", desc: "Pemain muda lebih cepat berkembang.", youthXp: 1 },
  setpiece: { label: "Set Piece", icon: "🎲", desc: "Corner/free kick lebih berbahaya.", setPiece: 12 },
};

const FACILITY_DEF = {
  stadium: { label: "Stadion", icon: "🏟️", baseCost: 180000, desc: "Pendapatan laga kandang naik." },
  training: { label: "Training Ground", icon: "🏋️", baseCost: 160000, desc: "XP dan bonus latihan naik." },
  academy: { label: "Akademi", icon: "🌱", baseCost: 140000, desc: "Pemain muda murah muncul di market." },
  medical: { label: "Medical Center", icon: "🏥", baseCost: 130000, desc: "Durasi cedera turun." },
  merchandise: { label: "Merchandise", icon: "🧢", baseCost: 150000, desc: "Bonus uang kalau menang kandang." },
  sponsor: { label: "Sponsor Lokal", icon: "🤝", baseCost: 170000, desc: "Bonus kecil di laga kandang." },
};

const TACTIC_CARDS = [
  { key: "counter", name: "Counter Attack", icon: "⚡", desc: "4 aksi: dribel/run maju +1 dan shot saat transisi +10." },
  { key: "through", name: "Through Ball", icon: "🪄", desc: "4 aksi: umpan progresif +18, risiko offside tetap ada." },
  { key: "press", name: "High Press", icon: "🐺", desc: "4 aksi: tackle +12 dan passing lawan lebih tertekan." },
  { key: "park", name: "Park The Bus", icon: "🚌", desc: "5 aksi: blok shot +15 dan lawan sulit menembak." },
  { key: "onetwo", name: "One-Two Pass", icon: "🔁", desc: "3 aksi: umpan pendek tidak menghabiskan AP jika sukses." },
  { key: "longshot", name: "Long Shot", icon: "💣", desc: "3 aksi: shot jarak jauh +22." },
  { key: "setpiece", name: "Set Piece Trap", icon: "🎲", desc: "5 aksi: corner/free kick +20." },
  { key: "wing", name: "Wing Overload", icon: "🪽", desc: "4 aksi: aksi di sisi lapangan +16." },
  { key: "calm", name: "Calm Tempo", icon: "🧊", desc: "4 aksi: intersep lawan turun dan stamina lebih hemat." },
  { key: "chaos", name: "Chaos Ball", icon: "🎰", desc: "3 aksi: semua aksi berisiko, tapi bisa meledak." },
];

const AI_PLANS = ["Probe", "Overload Wing", "Sudden Through Ball", "Shoot Early", "Bait Press", "Counter Burst", "Park & Break", "Risky Dribble", "Long Switch", "Tempo Control", "Chaos Gambit"];

let playerId = 1;
const rng = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rng(0, arr.length - 1)];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const clone = (obj) => JSON.parse(JSON.stringify(obj));
const otherSide = (side) => (side === "home" ? "away" : "home");
const sideLabel = (side) => (side === "home" ? "Home" : "Away");
const directionOf = (side) => (side === "home" ? -1 : 1);
const goalDistance = (piece) => (piece.side === "home" ? piece.y : BOARD_ROWS - 1 - piece.y);
const money = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;
const boardCellName = (x, y) => `${String.fromCharCode(65 + x)}${BOARD_ROWS - y}`;
const distance = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const roll = (chance) => Math.random() * 100 <= chance;
const firstName = (name = "Pemain") => String(name).split(" ")[0];

function genName() { return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`; }
function traitForPosition(pos) {
  const pool = pos === "GK" ? ["Sweeper Keeper", "Captain"]
    : ["CB", "LB", "RB", "CDM"].includes(pos) ? ["Destroyer", "Wall Defender", "Captain", "Set Piece Ace"]
    : ["CM", "CAM", "LM", "RM"].includes(pos) ? ["Playmaker", "Captain", "Speedster", "Set Piece Ace", "Trickster"]
    : ["Poacher", "Speedster", "Trickster", "Super Sub", "Set Piece Ace"];
  return pick(pool);
}
function genPlayer(pos, teamId, tier = 0, academy = false) {
  const attack = ["ST", "LW", "RW", "CAM", "LM", "RM"].includes(pos) ? 8 : 0;
  const defend = ["GK", "CB", "LB", "RB", "CDM"].includes(pos) ? 9 : 0;
  const passBonus = ["CM", "CDM", "CAM", "LM", "RM"].includes(pos) ? 8 : 0;
  const overall = clamp(rng(50, 77) + tier + rng(-3, 5), 43, 95);
  const age = academy ? rng(16, 21) : rng(17, 35);
  const rarePotential = Math.random() < 0.05;
  const potential = clamp(overall + (rarePotential ? rng(18, 33) + (age <= 21 ? 8 : 0) : rng(2, 10) + (age <= 21 ? rng(0, 7) : 0)), overall, 99);
  const trait = traitForPosition(pos);
  const personality = rarePotential ? "Wonderkid Mindset" : pick(PERSONALITIES.filter((p) => p.key !== "Wonderkid Mindset")).key;
  return {
    id: playerId++, teamId, name: genName(), pos, age, overall, potential, rarePotential, personality, scouted: false, scoutStatus: "unknown", loan: false,
    trait, morale: rng(58, 84), fitness: 100, injuredWeeks: 0, bannedWeeks: 0, yellowCards: 0,
    pace: clamp(rng(44, 82) + attack + (pos === "GK" ? -12 : 0), 25, 99),
    shoot: clamp(rng(35, 73) + attack - (pos === "GK" ? 25 : 0), 10, 99),
    pass: clamp(rng(38, 77) + passBonus, 20, 99),
    dribble: clamp(rng(38, 79) + attack, 20, 99),
    defend: clamp(rng(32, 78) + defend - (pos === "ST" ? 12 : 0), 15, 99),
    stamina: clamp(rng(50, 89), 25, 99),
    value: Math.round(overall * overall * rng(12, 32) * (academy ? 0.75 : 1)),
    wage: rng(5, 95) * 100,
    contract: rng(1, 5),
  };
}
function lineForFormation(formation) {
  return (FORMATIONS[formation] || FORMATIONS["4-3-3"]).map(([pos, x, y]) => ({ pos, x, y }));
}
function mirror(slot) { return { ...slot, y: BOARD_ROWS - 1 - slot.y }; }
function buildClubs() {
  const clubs = CLUB_DATA.map(([id, name, city, color, fans, style], idx) => ({
    id, name, city, color, fans, style,
    rivalId: id % 2 === 1 ? id + 1 : id - 1,
    players: [], preferredFormation: pick(Object.keys(FORMATIONS)),
    wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0, form: [], morale: 70,
  }));
  clubs.forEach((team, idx) => {
    const tier = Math.max(-4, 16 - Math.floor(idx * 0.8));
    BASE_POSITIONS.forEach((pos) => team.players.push(genPlayer(pos, team.id, tier)));
    for (let i = 0; i < 18; i += 1) team.players.push(genPlayer(pick(EXTRA_POSITIONS), team.id, tier - 2));
    team.players.sort((a, b) => b.overall - a.overall);
  });
  return clubs;
}
function buildFixtures(teamIds) {
  const ids = [...teamIds];
  if (ids.length % 2) ids.push(null);
  const list = [...ids];
  const n = list.length;
  const rounds = [];
  for (let r = 0; r < n - 1; r += 1) {
    const week = [];
    for (let i = 0; i < n / 2; i += 1) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) {
        const flip = r % 2 === 1;
        week.push({ homeId: flip ? b : a, awayId: flip ? a : b });
      }
    }
    rounds.push(week);
    list.splice(1, 0, list.pop());
  }
  return [...rounds, ...rounds.map((week) => week.map((m) => ({ homeId: m.awayId, awayId: m.homeId })))] ;
}
const INITIAL_TEAMS = buildClubs();
const SEASON_FIXTURES = buildFixtures(CLUB_DATA.map((c) => c[0]));

function teamPower(team) {
  return team.players.filter((p) => p.injuredWeeks <= 0 && p.bannedWeeks <= 0).slice().sort((a, b) => b.overall - a.overall).slice(0, 11).reduce((sum, p) => sum + p.overall, 0) / 11 || 55;
}
function pickLineup(team, formationName, overrides = {}) {
  const slots = lineForFormation(formationName);
  const used = new Set();
  return slots.map((slot, idx) => {
    const forcedId = Number(overrides[idx]);
    const forced = forcedId ? team.players.find((p) => p.id === forcedId && !used.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0) : null;
    if (forced) { used.add(forced.id); return { player: forced, slot, manual: true }; }
    const compat = COMPATIBLE[slot.pos] || [slot.pos];
    let candidates = team.players.filter((p) => !used.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0 && compat.includes(p.pos));
    if (!candidates.length) candidates = team.players.filter((p) => !used.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0);
    if (!candidates.length) candidates = team.players.filter((p) => !used.has(p.id));
    const chosen = candidates.slice().sort((a, b) => {
      const exactA = a.pos === slot.pos ? 12 : 0;
      const exactB = b.pos === slot.pos ? 12 : 0;
      const fitA = Math.round((a.fitness || 100) / 10);
      const fitB = Math.round((b.fitness || 100) / 10);
      return (b.overall + exactB + fitB) - (a.overall + exactA + fitA);
    })[0];
    used.add(chosen.id);
    return { player: chosen, slot };
  });
}
function benchFor(team, formationName, overrides = {}) {
  const lineup = pickLineup(team, formationName, overrides);
  const used = new Set(lineup.map(({ player }) => player.id));
  return team.players
    .filter((p) => !used.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0)
    .slice()
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 9);
}
function piecesFor(team, side, formationName, facilities, overrides = {}) {
  return pickLineup(team, formationName, overrides).map(({ player, slot }, idx) => {
    const spot = side === "home" ? slot : mirror(slot);
    const moraleBoost = player.trait === "Captain" ? 2 : 0;
    return {
      id: `${side}-${player.id}`, playerId: player.id, side, teamId: team.id, teamName: team.name,
      role: slot.pos, x: spot.x, y: spot.y, name: player.name, trait: player.trait, personality: player.personality,
      overall: player.overall, pace: player.pace, shoot: player.shoot, pass: player.pass, dribble: player.dribble, defend: player.defend,
      stamina: player.stamina, energy: clamp(player.fitness || 100, 45, 100), morale: clamp(player.morale + moraleBoost, 40, 99), yellow: 0, red: false,
      startingIndex: idx,
    };
  });
}
function kickoffPlayer(pieces, side) {
  return pieces.filter((p) => p.side === side && !p.red).sort((a, b) => goalDistance(a) - goalDistance(b) || b.overall - a.overall)[0]?.id;
}
function drawCards(count = 3) {
  const pool = [...TACTIC_CARDS].sort(() => Math.random() - 0.5);
  return pool.slice(0, count).map((c) => ({ ...c, uid: `${c.key}-${Date.now()}-${Math.random().toString(36).slice(2)}` }));
}
function createMatch({ homeTeam, awayTeam, userSide, userFormation, trainingPlan, facilities, lineupOverrides = {} }) {
  const homeFormation = homeTeam.id === MY_TEAM_ID ? userFormation : homeTeam.preferredFormation;
  const awayFormation = awayTeam.id === MY_TEAM_ID ? userFormation : awayTeam.preferredFormation;
  const homeOverrides = homeTeam.id === MY_TEAM_ID ? lineupOverrides : {};
  const awayOverrides = awayTeam.id === MY_TEAM_ID ? lineupOverrides : {};
  const pieces = [...piecesFor(homeTeam, "home", homeFormation, facilities, homeOverrides), ...piecesFor(awayTeam, "away", awayFormation, facilities, awayOverrides)];
  const isDerby = homeTeam.rivalId === awayTeam.id || awayTeam.rivalId === homeTeam.id;
  const game = {
    homeId: homeTeam.id, awayId: awayTeam.id, homeName: homeTeam.name, awayName: awayTeam.name,
    homeColor: homeTeam.color, awayColor: awayTeam.color, homeStyle: homeTeam.style, awayStyle: awayTeam.style,
    homeFormation, awayFormation, userSide, trainingPlan, facilities, isDerby,
    pieces, ballOwnerId: kickoffPlayer(pieces, "home"), turn: "home", ap: MAX_AP, score: { home: 0, away: 0 }, actionNo: 1, maxActions: MAX_ACTIONS,
    ended: false, winner: null, momentum: { home: 1, away: 0 }, effects: { home: [], away: [] }, usedCards: [], userCards: drawCards(4),
    bench: { home: benchFor(homeTeam, homeFormation, homeOverrides), away: benchFor(awayTeam, awayFormation, awayOverrides) },
    aiPlan: pick(AI_PLANS), goalPause: null, highlights: [], lastGoalRestartSide: null,
    stats: { home: emptyStats(), away: emptyStats() },
    lastAction: `Kick off ${homeTeam.name}.`,
    history: [{ minute: 1, icon: isDerby ? "🔥" : "⚽", text: isDerby ? `Derby panas: ${homeTeam.name} vs ${awayTeam.name}.` : `Kick off ${homeTeam.name}.` }],
    events: [],
  };
  return game;
}
function emptyStats() { return { shots: 0, onTarget: 0, goals: 0, passes: 0, passOk: 0, tackles: 0, tackleOk: 0, fouls: 0, yellows: 0, reds: 0, corners: 0, offsides: 0, possession: 0, injuries: 0, xg: 0 }; }
function minuteOf(game) { return Math.min(90, Math.max(1, Math.floor((game.actionNo / game.maxActions) * 90))); }
function getPiece(game, id) { return game.pieces.find((p) => p.id === id) || null; }
function pieceAt(game, x, y) { return game.pieces.find((p) => p.x === x && p.y === y && !p.red) || null; }
function sideStyle(game, side) { return side === "home" ? game.homeStyle : game.awayStyle; }
function hasTrait(piece, trait) { return piece?.trait === trait; }
function effect(game, side, key) { return (game.effects?.[side] || []).some((e) => e.key === key && e.ttl > 0); }
function opponentGoalY(side) { return side === "home" ? 0 : BOARD_ROWS - 1; }
function ownGoalY(side) { return side === "home" ? BOARD_ROWS - 1 : 0; }
function secondLastDefenderLine(game, defendingSide) {
  const ys = game.pieces.filter((p) => !p.red && p.side === defendingSide).map((p) => p.y).sort((a, b) => defendingSide === "home" ? b - a : a - b);
  return ys[1] ?? (defendingSide === "home" ? BOARD_ROWS - 2 : 1);
}
function isOffsidePosition(game, passer, target) {
  if (!passer || !target || passer.side !== target.side) return false;
  const defendingSide = otherSide(passer.side);
  const line = secondLastDefenderLine(game, defendingSide);
  const targetAheadOfBall = passer.side === "home" ? target.y < passer.y : target.y > passer.y;
  const inOppHalf = passer.side === "home" ? target.y <= 5 : target.y >= 6;
  const beyondLine = passer.side === "home" ? target.y < line : target.y > line;
  return targetAheadOfBall && inOppHalf && beyondLine;
}
function normalizeDefensiveLine(game, defendingSide) {
  const keeper = game.pieces.find((p) => !p.red && p.side === defendingSide && p.role === "GK");
  const carrier = getPiece(game, game.ballOwnerId);
  if (!keeper || !carrier || carrier.side === defendingSide) return;
  const danger = manhattan(carrier, keeper) <= 5 || goalDistance(carrier) <= 4;
  if (!danger) return;
  const maxGap = 3;
  const defenders = game.pieces.filter((p) => !p.red && p.side === defendingSide && ["CB", "LB", "RB", "CDM"].includes(p.role));
  defenders.forEach((p) => {
    const gap = Math.abs(p.y - keeper.y);
    if (gap <= maxGap) return;
    const dir = p.y < keeper.y ? 1 : -1;
    const nx = clamp(p.x + (keeper.x > p.x ? 1 : keeper.x < p.x ? -1 : 0), 0, BOARD_COLS - 1);
    const ny = clamp(p.y + dir, 0, BOARD_ROWS - 1);
    if (!pieceAt(game, nx, ny)) { p.x = nx; p.y = ny; }
    else if (!pieceAt(game, p.x, ny)) p.y = ny;
  });
}
function applyAutoShape(game) {
  normalizeDefensiveLine(game, "home");
  normalizeDefensiveLine(game, "away");
  return game;
}
function saveCareer(payload) { try { window.localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), ...payload })); return true; } catch { return false; } }
function loadCareer() { try { const raw = window.localStorage.getItem(SAVE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
function clearCareer() { try { window.localStorage.removeItem(SAVE_KEY); } catch {} }
function downloadCareerFile(payload) {
  try {
    const blob = new Blob([JSON.stringify({ version: SAVE_VERSION, exportedAt: Date.now(), ...payload }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = SAVE_FILE_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch { return false; }
}
function makeFreshMarket(academyLevel = 1) {
  const free = [];
  for (let i = 0; i < 96; i += 1) free.push(genPlayer(pick(EXTRA_POSITIONS), null, rng(-4, 8), i < 8 + academyLevel * 2));
  return free.sort((a, b) => b.overall - a.overall);
}
function cupBonusForWeek(week, team, result) {
  if (!CUP_WEEKS.has(week)) return 0;
  const won = (result.homeId === team.id && result.homeGoals > result.awayGoals) || (result.awayId === team.id && result.awayGoals > result.homeGoals);
  return won ? 110000 : 25000;
}
function randomStoryEvent(week) { const e = pick(MANAGER_EVENTS); return { id: `${week}-${Date.now()}-${Math.random().toString(36).slice(2)}`, week, title: e.title, choices: e.choices, choice: null, effect: null }; }

function trainingBonus(game, key) { return TRAINING_PLANS[game.trainingPlan]?.[key] || 0; }
function isWide(x) { return x === 0 || x === 1 || x === BOARD_COLS - 2 || x === BOARD_COLS - 1; }
function pressureAt(game, side, x, y) {
  const highPress = effect(game, otherSide(side), "press") ? 1 : 0;
  const stylePress = ["High Press", "Physical"].includes(sideStyle(game, otherSide(side))) ? 0.4 : 0;
  return game.pieces.filter((p) => !p.red && p.side !== side && distance(p, { x, y }) <= 1).length + highPress + stylePress;
}
function supportAt(game, side, x, y) { return game.pieces.filter((p) => !p.red && p.side === side && p.id !== game.ballOwnerId && distance(p, { x, y }) <= 1).length; }
function lanePressure(game, from, to) {
  const steps = Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
  let pressure = 0;
  if (steps <= 1) return pressureAt(game, from.side, to.x, to.y);
  for (let i = 1; i < steps; i += 1) {
    const x = Math.round(from.x + ((to.x - from.x) * i) / steps);
    const y = Math.round(from.y + ((to.y - from.y) * i) / steps);
    pressure += game.pieces.filter((p) => !p.red && p.side !== from.side && p.x === x && p.y === y).length * 3;
    pressure += game.pieces.filter((p) => !p.red && p.side !== from.side && distance(p, { x, y }) === 1).length;
  }
  return pressure;
}
function energyMod(piece) { return piece.energy >= 75 ? 6 : piece.energy >= 50 ? 0 : piece.energy >= 30 ? -8 : -17; }
function traitBonus(piece, area) {
  if (!piece) return 0;
  if (area === "pass" && piece.trait === "Playmaker") return 12;
  if (area === "shot" && piece.trait === "Poacher") return 12;
  if (area === "dribble" && ["Speedster", "Trickster"].includes(piece.trait)) return piece.trait === "Speedster" ? 8 : 15;
  if (area === "tackle" && piece.trait === "Destroyer") return 12;
  if (area === "block" && piece.trait === "Wall Defender") return 12;
  if (area === "setpiece" && piece.trait === "Set Piece Ace") return 15;
  if (piece.trait === "Super Sub" && piece.energy >= 80) return 6;
  return 0;
}
function legalRunCells(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ended || piece.red || piece.side !== game.turn || game.ap < 1) return [];
  const hasBall = game.ballOwnerId === piece.id;
  let range = hasBall ? 2 : 3;
  if (piece.pace >= 80) range += 1;
  if (piece.trait === "Speedster") range += 1;
  if (effect(game, piece.side, "counter")) range += 1;
  if (effect(game, piece.side, "calm") && hasBall) range -= 1;
  range = clamp(range, 1, 5);
  const cells = [];
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      if (x === piece.x && y === piece.y) continue;
      if (pieceAt(game, x, y)) continue;
      const d = distance(piece, { x, y });
      if (d > range) continue;
      if (hasBall && goalDistance({ ...piece, x, y }) > goalDistance(piece) + 1) continue;
      const cost = hasBall && pressureAt(game, piece.side, x, y) >= 1.5 ? 2 : 1;
      if (game.ap < cost) continue;
      cells.push({ x, y, kind: hasBall ? "dribble" : "run", cost });
    }
  }
  return cells;
}
function passOptions(game, pieceId, through = false) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ended || piece.red || piece.side !== game.turn || game.ballOwnerId !== piece.id || game.ap < (through ? 2 : 1)) return [];
  return game.pieces.filter((p) => !p.red && p.side === piece.side && p.id !== piece.id).map((target) => {
    const d = distance(piece, target);
    const maxRange = clamp(Math.round(piece.pass / (through ? 10 : 12)), 4, through ? 9 : 8);
    if (d > maxRange) return null;
    const forwardBonus = goalDistance(piece) - goalDistance(target);
    const lane = lanePressure(game, piece, target);
    const targetPressure = pressureAt(game, target.side, target.x, target.y);
    let chance = 70 + piece.pass * 0.28 + target.overall * 0.07 + energyMod(piece) + traitBonus(piece, "pass") + trainingBonus(game, "pass") + game.momentum[piece.side] * 3;
    chance += forwardBonus * (through ? 4 : 2);
    chance -= d * (through ? 4.5 : 3.5) + lane * 11 + targetPressure * 6;
    if (through) chance += effect(game, piece.side, "through") ? 18 : 0;
    if (effect(game, piece.side, "onetwo") && d <= 3) chance += 8;
    if (effect(game, piece.side, "wing") && (isWide(piece.x) || isWide(target.x))) chance += 16;
    if (effect(game, otherSide(piece.side), "press")) chance -= 8;
    if (sideStyle(game, piece.side) === "Tiki Taka" && !through) chance += 6;
    if (sideStyle(game, piece.side) === "Long Ball" && through) chance += 7;
    chance = clamp(chance, 12, 97);
    return { target, chance: Math.round(chance), d, forwardBonus, lane, cost: through ? 2 : 1, through };
  }).filter(Boolean).sort((a, b) => b.chance + b.forwardBonus * 6 - (a.chance + a.forwardBonus * 6));
}
function tackleOptions(game, pieceId) {
  const piece = getPiece(game, pieceId);
  const carrier = getPiece(game, game.ballOwnerId);
  if (!piece || !carrier || game.ended || piece.red || piece.side !== game.turn || carrier.side === piece.side || game.ap < 1) return [];
  const d = distance(piece, carrier);
  if (d > 1) return [];
  const help = supportAt(game, piece.side, carrier.x, carrier.y);
  let chance = 41 + piece.defend * 0.43 - carrier.dribble * 0.25 + help * 5 + energyMod(piece) + traitBonus(piece, "tackle") + trainingBonus(game, "tackle") + game.momentum[piece.side] * 2;
  if (effect(game, piece.side, "press")) chance += 12;
  if (sideStyle(game, piece.side) === "Physical") chance += 8;
  if (game.isDerby) chance += 2;
  chance = clamp(chance, 17, 88);
  return [{ target: carrier, chance: Math.round(chance), cost: 1 }];
}
function shotInfo(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ended || piece.red || piece.side !== game.turn || game.ballOwnerId !== piece.id || piece.role === "GK" || game.ap < 2) return { can: false, chance: 0, cost: 2, label: "Tidak bisa tembak" };
  const d = goalDistance(piece);
  const center = GOAL_COLS.includes(piece.x) ? 13 : piece.x === 2 || piece.x === 5 ? 5 : -9;
  const press = pressureAt(game, piece.side, piece.x, piece.y);
  const keeper = game.pieces.find((p) => !p.red && p.side !== piece.side && p.role === "GK");
  const inBox = d <= 3 && GOAL_COLS.includes(piece.x);
  let maxRange = clamp(Math.round(piece.shoot / 17), 2, 6) + (piece.role === "ST" ? 1 : 0);
  if (effect(game, piece.side, "longshot")) maxRange += 2;
  let chance = 13 + piece.shoot * 0.58 + center + energyMod(piece) + traitBonus(piece, "shot") + trainingBonus(game, "shot") + game.momentum[piece.side] * 4;
  chance += piece.side === "home" ? 3 : 0;
  if (effect(game, piece.side, "longshot")) chance += d > 3 ? 22 : 8;
  if (effect(game, piece.side, "counter")) chance += 10;
  if (effect(game, otherSide(piece.side), "park")) chance -= 15;
  chance -= d * 7.2 + press * 11 + (keeper?.overall || 65) * 0.16 + traitBonus(keeper, "block");
  if (inBox) chance += 10;
  if (game.isDerby) chance += 2;
  chance = clamp(chance, 3, 91);
  return { can: d <= maxRange, chance: Math.round(chance), cost: 2, xg: clamp(chance / 100, 0.03, 0.91), label: chance >= 65 ? "Peluang emas" : chance >= 45 ? "Bagus" : chance >= 25 ? "Spekulasi" : "Sulit" };
}
function appendLog(game, icon, text, event = null) {
  const minute = minuteOf(game);
  game.history = [{ minute, icon, text }, ...(game.history || [])].slice(0, 90);
  game.lastAction = text;
  if (event) game.events = [...(game.events || []), { ...event, min: minute }];
}
function tickEffects(game, side) {
  game.effects[side] = (game.effects[side] || []).map((e) => ({ ...e, ttl: e.ttl - 1 })).filter((e) => e.ttl > 0);
}
function spendAp(game, side, cost) {
  game.ap = clamp(game.ap - cost, 0, MAX_AP);
  tickEffects(game, side);
  applyAutoShape(game);
  if (game.ap <= 0 && !game.ended) switchTurn(game);
}
function switchTurn(game) {
  game.turn = otherSide(game.turn);
  game.ap = MAX_AP;
  game.actionNo += 1;
  game.aiPlan = pick(AI_PLANS);
  const carrier = getPiece(game, game.ballOwnerId);
  if (carrier) game.stats[carrier.side].possession += 1;
  game.pieces.forEach((p) => { if (!p.red && p.side === game.turn) p.energy = clamp(p.energy + 1, 0, 100); });
  applyAutoShape(game);
  finishIfNeeded(game);
}
function finishIfNeeded(game) {
  if (game.actionNo > game.maxActions) {
    game.ended = true;
    game.winner = game.score.home === game.score.away ? "draw" : game.score.home > game.score.away ? "home" : "away";
    appendLog(game, "🏁", `Full time: ${game.homeName} ${game.score.home}-${game.score.away} ${game.awayName}.`);
    return true;
  }
  return false;
}
function resetAfterGoal(game, scorerSide) {
  const restart = otherSide(scorerSide);
  const homeSlots = lineForFormation(game.homeFormation);
  const awaySlots = lineForFormation(game.awayFormation).map(mirror);
  const homePieces = game.pieces.filter((p) => p.side === "home");
  const awayPieces = game.pieces.filter((p) => p.side === "away");
  homePieces.forEach((p, i) => { if (!p.red) { p.x = homeSlots[i]?.x ?? p.x; p.y = homeSlots[i]?.y ?? p.y; } });
  awayPieces.forEach((p, i) => { if (!p.red) { p.x = awaySlots[i]?.x ?? p.x; p.y = awaySlots[i]?.y ?? p.y; } });
  game.ballOwnerId = kickoffPlayer(game.pieces, restart);
  game.turn = restart;
  game.ap = MAX_AP;
  game.momentum[scorerSide] = 1;
  game.momentum[restart] = 2;
  game.lastGoalRestartSide = restart;
  game.goalPause = { scorerSide, restartSide: restart, score: { ...game.score }, minute: minuteOf(game), text: game.lastAction };
  game.highlights = [{ minute: minuteOf(game), icon: "🥅", text: game.lastAction, score: { ...game.score } }, ...(game.highlights || [])].slice(0, 12);
  game.actionNo += 1;
}
function nearestEnemy(game, side, cell) {
  return game.pieces.filter((p) => !p.red && p.side !== side).map((p) => ({ p, d: manhattan(p, cell) })).sort((a, b) => a.d - b.d || b.p.defend - a.p.defend)[0]?.p || null;
}
function nearestFriend(game, side, cell) {
  return game.pieces.filter((p) => !p.red && p.side === side).map((p) => ({ p, d: manhattan(p, cell) })).sort((a, b) => a.d - b.d || b.p.overall - a.p.overall)[0]?.p || null;
}
function isPenaltyArea(piece) {
  const d = goalDistance(piece);
  return d <= 2 && GOAL_COLS.some((c) => Math.abs(piece.x - c) <= 1);
}
function possibleInjury(game, piece, reason = "duel") {
  const guard = trainingBonus(game, "injuryGuard") + (game.facilities?.medical || 1) * 2;
  const risk = clamp((piece.energy < 35 ? 9 : 2) + (reason === "hard" ? 5 : 0) + (piece.personality === "Injury Prone" ? 5 : 0) + (game.isDerby ? 2 : 0) - guard, 0, 22);
  if (roll(risk)) {
    piece.injured = true;
    game.stats[piece.side].injuries += 1;
    appendLog(game, "🏥", `${firstName(piece.name)} cedera setelah ${reason}.`, { type: "injury", side: piece.side, playerId: piece.playerId, player: piece.name, weeks: rng(1, 4) });
  }
}
function autoReplaceInjuredPiece(game, piece, reason = "duel") {
  if (!piece || piece.red) return;
  const oldName = piece.name;
  const oldPlayerId = piece.playerId;
  const weeks = rng(1, 5);
  piece.injured = true;
  game.stats[piece.side].injuries += 1;
  appendLog(game, "🏥", `${firstName(oldName)} cedera (${reason}) dan harus diganti.`, { type: "injury", side: piece.side, playerId: oldPlayerId, player: oldName, weeks });
  const bench = game.bench?.[piece.side] || [];
  const compat = COMPATIBLE[piece.role] || [piece.role];
  let idx = bench.findIndex((p) => compat.includes(p.pos));
  if (idx < 0) idx = bench.findIndex(Boolean);
  const sub = idx >= 0 ? bench.splice(idx, 1)[0] : null;
  if (!sub) {
    piece.red = true;
    appendLog(game, "🚑", `${piece.teamName} tidak punya pengganti siap. Tim bermain dengan 10 pemain.`);
    if (game.ballOwnerId === piece.id) game.ballOwnerId = kickoffPlayer(game.pieces, otherSide(piece.side)) || game.ballOwnerId;
    return;
  }
  Object.assign(piece, {
    playerId: sub.id, name: sub.name, trait: sub.trait, personality: sub.personality, overall: sub.overall,
    pace: sub.pace, shoot: sub.shoot, pass: sub.pass, dribble: sub.dribble, defend: sub.defend,
    stamina: sub.stamina, energy: clamp(sub.fitness || 88, 50, 100), morale: clamp(sub.morale || 70, 40, 99),
    yellow: 0, red: false, injured: false, subbedIn: true, role: piece.role,
  });
  appendLog(game, "🔁", `${firstName(sub.name)} masuk menggantikan ${firstName(oldName)}.`);
}
function lowChanceTackleChaos(game, tackler, target, chance) {
  if (chance > 38 || !roll(3)) return false;
  const side = tackler.side;
  game.stats[side].fouls += 1;
  game.momentum[side] = 0;
  game.momentum[target.side] = clamp(game.momentum[target.side] + 2, 0, 7);
  tackler.energy = clamp(tackler.energy - 9, 0, 100);
  const outcome = rng(1, 3);
  let text = `${firstName(tackler.name)} telat tackle karena peluangnya rendah (${Math.round(chance)}%). Pelanggaran.`;
  if (outcome === 2) text += ` ${firstName(target.name)} cedera.`;
  if (outcome === 3) text += ` Duel kacau: keduanya cedera.`;
  tackler.yellow += 1;
  game.stats[side].yellows += 1;
  appendLog(game, "💥", text + " Kartu kuning.");
  if (outcome === 2 || outcome === 3) autoReplaceInjuredPiece(game, target, "tackle keras");
  if (outcome === 3) autoReplaceInjuredPiece(game, tackler, "benturan saat tackle");
  game.ballOwnerId = target.id;
  spendAp(game, side, 1);
  if (!game.ended) { game.turn = target.side; game.ap = MAX_AP; }
  return true;
}
function applyCard(game, cardKey, side) {
  const card = TACTIC_CARDS.find((c) => c.key === cardKey);
  if (!card || side !== game.userSide) return game;
  if (!game.userCards?.some((c) => c.key === cardKey)) return game;
  const ttl = cardKey === "park" || cardKey === "setpiece" ? 5 : cardKey === "onetwo" || cardKey === "longshot" || cardKey === "chaos" ? 3 : 4;
  game.effects[side] = [...(game.effects[side] || []).filter((e) => e.key !== cardKey), { key: cardKey, ttl }];
  game.userCards = game.userCards.filter((c) => c.key !== cardKey);
  game.usedCards = [...game.usedCards, cardKey];
  appendLog(game, card.icon, `${card.name} aktif selama ${ttl} aksi.`);
  return game;
}
function applyAction(game, action) {
  const next = clone(game);
  if (action.type === "resumeGoal") { next.goalPause = null; return applyAutoShape(next); }
  if (next.ended) return next;
  if (next.goalPause) return next;
  if (action.type === "card") return applyCard(next, action.cardKey, next.userSide);
  if (action.type === "end") { appendLog(next, "⏭️", `${sideLabel(next.turn)} mengakhiri giliran.`); switchTurn(next); return next; }

  const piece = getPiece(next, action.pieceId);
  if (!piece || piece.red || piece.side !== next.turn) return next;
  const side = piece.side;
  const chaotic = effect(next, side, "chaos") ? rng(-18, 24) : 0;

  if (action.type === "move") {
    const cell = legalRunCells(next, piece.id).find((c) => c.x === action.x && c.y === action.y);
    if (!cell || next.ap < cell.cost) return next;
    const hadBall = next.ballOwnerId === piece.id;
    const oldDistance = goalDistance(piece);
    const press = pressureAt(next, side, action.x, action.y);
    let chance = 72 + piece.dribble * 0.25 + piece.pace * 0.10 + energyMod(piece) + traitBonus(piece, "dribble") + next.momentum[side] * 3 + chaotic;
    if (effect(next, side, "wing") && isWide(action.x)) chance += 16;
    if (effect(next, side, "calm")) chance += 7;
    chance -= press * 17;
    chance = clamp(chance, 12, 97);
    if (hadBall && press >= 1 && !roll(chance)) {
      const enemy = nearestEnemy(next, side, { x: action.x, y: action.y });
      if (enemy) next.ballOwnerId = enemy.id;
      next.momentum[side] = 0;
      next.momentum[otherSide(side)] = clamp(next.momentum[otherSide(side)] + 2, 0, 7);
      piece.energy = clamp(piece.energy - 7, 0, 100);
      appendLog(next, "💥", `${firstName(piece.name)} gagal dribel ke ${boardCellName(action.x, action.y)} (${Math.round(chance)}%). Bola direbut ${firstName(enemy?.name)}.`);
      spendAp(next, side, cell.cost);
      if (!next.ended && enemy) { next.turn = enemy.side; next.ap = MAX_AP; }
      return next;
    }
    piece.x = action.x; piece.y = action.y;
    piece.energy = clamp(piece.energy - (hadBall ? 6 + cell.cost : 3), 0, 100);
    const progress = oldDistance - goalDistance(piece);
    if (progress > 0) next.momentum[side] = clamp(next.momentum[side] + progress, 0, 7);
    appendLog(next, hadBall ? "🌀" : "🏃", hadBall ? `${firstName(piece.name)} dribel ke ${boardCellName(action.x, action.y)} (${Math.round(chance)}%).` : `${firstName(piece.name)} run ke ${boardCellName(action.x, action.y)}.`);
    possibleInjury(next, piece, hadBall ? "dribel" : "sprint");
    spendAp(next, side, cell.cost);
    return next;
  }

  if (action.type === "pass" || action.type === "through") {
    const through = action.type === "through";
    const option = passOptions(next, piece.id, through).find((o) => o.target.id === action.targetId);
    if (!option || next.ap < option.cost) return next;
    next.stats[side].passes += 1;
    const chance = clamp(option.chance + chaotic, 5, 98);
    if ((through && isOffsidePosition(next, piece, option.target)) || (through && option.forwardBonus >= 3 && roll(clamp(7 + pressureAt(next, option.target.side, option.target.x, option.target.y) * 3 - traitBonus(piece, "pass"), 1, 22)))) {
      next.stats[side].offsides += 1;
      const defender = nearestEnemy(next, side, option.target);
      if (defender) next.ballOwnerId = defender.id;
      next.momentum[side] = clamp(next.momentum[side] - 1, 0, 7);
      appendLog(next, "🚩", `Offside! Umpan terobosan ${firstName(piece.name)} ke ${firstName(option.target.name)} terlalu cepat.`, { type: "offside", side });
      spendAp(next, side, option.cost);
      if (!next.ended && defender) { next.turn = defender.side; next.ap = MAX_AP; }
      return next;
    }
    if (roll(chance)) {
      next.ballOwnerId = option.target.id;
      next.stats[side].passOk += 1;
      next.momentum[side] = clamp(next.momentum[side] + (option.forwardBonus > 0 ? 2 : 1), 0, 7);
      const freeAp = effect(next, side, "onetwo") && !through && option.d <= 3 ? 1 : 0;
      appendLog(next, through ? "🪄" : "🎯", `${firstName(piece.name)} ${through ? "through ball" : "umpan"} ke ${firstName(option.target.name)} (${Math.round(chance)}%).${freeAp ? " One-two: AP dikembalikan." : ""}`);
      spendAp(next, side, Math.max(0, option.cost - freeAp));
    } else {
      const enemy = nearestEnemy(next, side, option.target);
      if (enemy) next.ballOwnerId = enemy.id;
      next.momentum[side] = 0;
      next.momentum[otherSide(side)] = clamp(next.momentum[otherSide(side)] + 2, 0, 7);
      appendLog(next, "🧱", `${through ? "Through ball" : "Umpan"} ${firstName(piece.name)} dipotong ${firstName(enemy?.name)} (${Math.round(chance)}%).`);
      spendAp(next, side, option.cost);
      if (!next.ended && enemy) { next.turn = enemy.side; next.ap = MAX_AP; }
    }
    return next;
  }

  if (action.type === "tackle") {
    const option = tackleOptions(next, piece.id)[0];
    if (!option || option.target.id !== action.targetId || next.ap < 1) return next;
    next.stats[side].tackles += 1;
    const chance = clamp(option.chance + chaotic, 5, 94);
    piece.energy = clamp(piece.energy - 6, 0, 100);
    if (roll(chance)) {
      next.ballOwnerId = piece.id;
      next.stats[side].tackleOk += 1;
      next.momentum[side] = clamp(next.momentum[side] + 2, 0, 7);
      next.momentum[otherSide(side)] = 0;
      appendLog(next, "⚔️", `${firstName(piece.name)} sukses tackle ${firstName(option.target.name)} (${Math.round(chance)}%).`);
      possibleInjury(next, option.target, "duel keras");
      spendAp(next, side, 1);
      return next;
    }
    if (lowChanceTackleChaos(next, piece, option.target, chance)) return next;
    const foulRisk = clamp(18 + (sideStyle(next, side) === "Physical" ? 8 : 0) + (next.isDerby ? 5 : 0), 8, 42);
    if (roll(foulRisk)) {
      next.stats[side].fouls += 1;
      const yellowRisk = clamp(20 + (next.isDerby ? 10 : 0) + (piece.personality === "Hot Temper" ? 12 : 0) + (piece.yellow ? 20 : 0), 8, 78);
      let cardText = "";
      if (roll(yellowRisk)) {
        piece.yellow += 1;
        next.stats[side].yellows += 1;
        piece.playerCard = piece.yellow >= 2 ? "red" : "yellow";
        cardText = piece.yellow >= 2 ? " Kartu kuning kedua, merah!" : " Kartu kuning.";
        if (piece.yellow >= 2) { piece.red = true; next.stats[side].reds += 1; }
      }
      if (isPenaltyArea(option.target)) {
        const shooter = option.target;
        const penChance = clamp(62 + shooter.shoot * 0.25 + trainingBonus(next, "setPiece"), 55, 88);
        next.stats[option.target.side].shots += 1; next.stats[option.target.side].xg += 0.76;
        if (roll(penChance)) {
          next.score[option.target.side] += 1; next.stats[option.target.side].goals += 1; next.stats[option.target.side].onTarget += 1;
          appendLog(next, "🚨", `PENALTI! ${firstName(shooter.name)} mencetak gol (${Math.round(penChance)}%).${cardText}`, { type: "goal", side: option.target.side, team: shooter.teamName, player: shooter.name });
          resetAfterGoal(next, option.target.side);
          finishIfNeeded(next);
        } else {
          const keeper = next.pieces.find((p) => p.side === side && p.role === "GK" && !p.red);
          if (keeper) next.ballOwnerId = keeper.id;
          appendLog(next, "🧤", `PENALTI gagal! ${firstName(shooter.name)} ditahan kiper.${cardText}`, { type: "penaltyMiss", side: option.target.side, player: shooter.name });
          spendAp(next, side, 1);
          if (!next.ended && keeper) { next.turn = keeper.side; next.ap = MAX_AP; }
        }
        return next;
      }
      const freeKick = roll(35 + trainingBonus(next, "setPiece") + traitBonus(option.target, "setpiece"));
      if (freeKick) {
        next.stats[option.target.side].shots += 1; next.stats[option.target.side].xg += 0.08;
        if (roll(18 + trainingBonus(next, "setPiece") + traitBonus(option.target, "setpiece"))) {
          next.score[option.target.side] += 1; next.stats[option.target.side].goals += 1; next.stats[option.target.side].onTarget += 1;
          appendLog(next, "🎯", `Free kick masuk! ${firstName(option.target.name)} menghukum pelanggaran.${cardText}`, { type: "goal", side: option.target.side, team: option.target.teamName, player: option.target.name });
          resetAfterGoal(next, option.target.side);
        } else {
          next.stats[option.target.side].corners += 1;
          appendLog(next, "🎲", `Free kick ${firstName(option.target.name)} diblok, jadi corner.${cardText}`);
          next.ballOwnerId = option.target.id;
          spendAp(next, side, 1);
          if (!next.ended) { next.turn = option.target.side; next.ap = Math.max(1, next.ap); }
        }
        return next;
      }
      appendLog(next, "🟨", `${firstName(piece.name)} melanggar ${firstName(option.target.name)}.${cardText}`);
      next.ballOwnerId = option.target.id;
      spendAp(next, side, 1);
      if (!next.ended) { next.turn = option.target.side; next.ap = MAX_AP; }
      return next;
    }
    next.momentum[option.target.side] = clamp(next.momentum[option.target.side] + 1, 0, 7);
    appendLog(next, "😬", `${firstName(piece.name)} gagal tackle. ${firstName(option.target.name)} lolos (${Math.round(chance)}%).`);
    spendAp(next, side, 1);
    return next;
  }

  if (action.type === "shoot") {
    const info = shotInfo(next, piece.id);
    if (!info.can || next.ap < info.cost) return next;
    next.stats[side].shots += 1;
    next.stats[side].xg += info.xg;
    const chance = clamp(info.chance + chaotic, 2, 95);
    piece.energy = clamp(piece.energy - 9, 0, 100);
    if (roll(chance)) {
      next.score[side] += 1;
      next.stats[side].goals += 1; next.stats[side].onTarget += 1;
      appendLog(next, "🥅", `GOOOL! ${piece.teamName} unggul lewat ${piece.name} (${Math.round(chance)}%).`, { type: "goal", side, team: piece.teamName, player: piece.name });
      resetAfterGoal(next, side);
      finishIfNeeded(next);
      return next;
    }
    const keeper = next.pieces.find((p) => !p.red && p.side !== side && p.role === "GK");
    const onTarget = roll(clamp(chance + 22, 15, 88));
    if (onTarget) next.stats[side].onTarget += 1;
    if (onTarget && roll(50)) {
      next.stats[side].corners += 1;
      appendLog(next, "🧤", `${firstName(piece.name)} menembak, ${firstName(keeper?.name)} menepis jadi corner (${Math.round(chance)}%).`);
      next.ballOwnerId = nearestFriend(next, side, { x: piece.x, y: piece.y })?.id || piece.id;
    } else if (!onTarget) {
      appendLog(next, "💨", `${firstName(piece.name)} melepas tembakan melebar (${Math.round(chance)}%).`);
      if (keeper) next.ballOwnerId = keeper.id;
    } else {
      appendLog(next, "🧱", `${firstName(piece.name)} menembak, diblok lini belakang (${Math.round(chance)}%).`);
      const blocker = nearestEnemy(next, side, piece);
      if (blocker && roll(40)) next.ballOwnerId = blocker.id;
    }
    next.momentum[side] = clamp(next.momentum[side] - 1, 0, 7);
    next.momentum[otherSide(side)] = clamp(next.momentum[otherSide(side)] + 1, 0, 7);
    spendAp(next, side, info.cost);
    if (!next.ended && keeper && next.ballOwnerId === keeper.id) { next.turn = keeper.side; next.ap = MAX_AP; }
    return next;
  }

  if (action.type === "skill") {
    if (next.ballOwnerId !== piece.id || next.ap < 2) return next;
    let chance = clamp(50 + piece.dribble * 0.35 + traitBonus(piece, "dribble") + energyMod(piece) + next.momentum[side] * 3, 15, 91);
    if (piece.trait === "Playmaker") chance += 5;
    if (roll(chance)) {
      next.momentum[side] = clamp(next.momentum[side] + 3, 0, 7);
      piece.energy = clamp(piece.energy - 8, 0, 100);
      appendLog(next, "✨", `${firstName(piece.name)} melakukan skill move. Momentum naik (${Math.round(chance)}%).`);
    } else {
      const enemy = nearestEnemy(next, side, piece);
      if (enemy) next.ballOwnerId = enemy.id;
      next.momentum[side] = 0;
      appendLog(next, "🙃", `Skill ${firstName(piece.name)} gagal. Bola lepas ke ${firstName(enemy?.name)} (${Math.round(chance)}%).`);
      if (enemy) { next.turn = enemy.side; next.ap = MAX_AP; }
    }
    spendAp(next, side, 2);
    return next;
  }

  return next;
}

function scoreActionNoise(style) {
  const chaos = style === "Chaos" ? 35 : style === "Physical" ? 20 : 14;
  return rng(-chaos, chaos);
}
function bestAiAction(game) {
  if (game.ended || game.goalPause) return null;
  const style = sideStyle(game, game.turn);
  const mine = game.pieces.filter((p) => !p.red && p.side === game.turn);
  const carrier = getPiece(game, game.ballOwnerId);
  const candidates = [];
  const add = (action, score, label) => candidates.push({ action, score: score + scoreActionNoise(style), label });

  if (carrier && carrier.side === game.turn) {
    const shot = shotInfo(game, carrier.id);
    if (shot.can) {
      const threshold = style === "Chaos" || game.aiPlan === "Shoot Early" ? 20 : style === "Long Ball" ? 25 : 32;
      if (shot.chance >= threshold && rng(1, 100) <= (shot.chance >= 55 ? 72 : 38)) return { type: "shoot", pieceId: carrier.id };
      add({ type: "shoot", pieceId: carrier.id }, shot.chance + 54 + (game.aiPlan === "Shoot Early" ? 32 : 0), "shoot");
    }

    const through = passOptions(game, carrier.id, true).slice(0, 10);
    through.forEach((p) => {
      const offsidePenalty = isOffsidePosition(game, carrier, p.target) ? -50 : 0;
      let score = p.chance + p.forwardBonus * 24 + (p.target.role === "ST" ? 28 : 0) - p.d * 1.5 + offsidePenalty;
      if (["Counter", "Long Ball", "Wing Play"].includes(style)) score += 22;
      if (["Sudden Through Ball", "Long Switch", "Counter Burst"].includes(game.aiPlan)) score += 30;
      if (goalDistance(p.target) <= 3) score += 22;
      add({ type: "through", pieceId: carrier.id, targetId: p.target.id }, score, "killer pass");
    });

    const passes = passOptions(game, carrier.id, false).slice(0, 10);
    passes.forEach((p) => {
      let score = p.chance + p.forwardBonus * 12 + (p.target.role === "ST" ? 14 : 0);
      if (["Possession", "Tiki Taka"].includes(style)) score += p.d <= 3 ? 20 : -2;
      if (game.aiPlan === "Tempo Control") score += p.d <= 4 ? 16 : 0;
      if (goalDistance(p.target) < goalDistance(carrier)) score += 12;
      add({ type: "pass", pieceId: carrier.id, targetId: p.target.id }, score, "pass");
    });

    const forwardRuns = legalRunCells(game, carrier.id)
      .map((cell) => ({ cell, progress: goalDistance(carrier) - goalDistance({ ...carrier, ...cell }), pressure: pressureAt(game, carrier.side, cell.x, cell.y) }))
      .filter((r) => r.progress >= 0)
      .sort((a, b) => (b.progress * 12 - b.pressure * 3) - (a.progress * 12 - a.pressure * 3));
    if (forwardRuns.length && rng(1, 100) <= (style === "Counter" || game.aiPlan === "Risky Dribble" ? 50 : 28)) {
      const top = forwardRuns.slice(0, Math.min(3, forwardRuns.length));
      const chosen = pick(top).cell;
      return { type: "move", pieceId: carrier.id, x: chosen.x, y: chosen.y };
    }
    legalRunCells(game, carrier.id).forEach((cell) => {
      const progress = goalDistance(carrier) - goalDistance({ ...carrier, ...cell });
      let score = progress * 34 - Math.abs(cell.x - 3.5) * 2 - pressureAt(game, carrier.side, cell.x, cell.y) * 7;
      if (goalDistance({ ...carrier, ...cell }) <= 3) score += 34;
      if (style === "Wing Play" && isWide(cell.x)) score += 22;
      if (["Risky Dribble", "Counter Burst", "Chaos Gambit"].includes(game.aiPlan)) score += 28;
      if (progress < 0) score -= 40;
      add({ type: "move", pieceId: carrier.id, x: cell.x, y: cell.y }, score, "drive forward");
    });
    if (game.ap >= 2 && rng(1, 100) <= (style === "Chaos" ? 38 : 16)) add({ type: "skill", pieceId: carrier.id }, 64 + game.momentum[game.turn] * 5, "skill");
  } else if (carrier && carrier.side !== game.turn) {
    mine.forEach((p) => {
      const t = tackleOptions(game, p.id)[0];
      if (t) add({ type: "tackle", pieceId: p.id, targetId: t.target.id }, t.chance + 36 + (style === "High Press" ? 20 : 0) + (style === "Physical" ? 14 : 0), "tackle");
      legalRunCells(game, p.id).forEach((cell) => {
        const closeCarrier = 34 - manhattan(cell, carrier) * 6;
        const protectGoal = 16 - goalDistance({ ...p, ...cell });
        const blockLane = Math.abs(cell.x - carrier.x) <= 1 ? 10 : 0;
        add({ type: "move", pieceId: p.id, x: cell.x, y: cell.y }, closeCarrier + protectGoal + blockLane + (style === "Park Bus" ? 14 : 0), "press/cover");
      });
    });
  } else {
    mine.forEach((p) => legalRunCells(game, p.id).forEach((cell) => {
      const progress = goalDistance(p) - goalDistance({ ...p, ...cell });
      const central = 4 - Math.abs(cell.x - 3.5);
      add({ type: "move", pieceId: p.id, x: cell.x, y: cell.y }, progress * 18 + central, "support run");
    }));
  }

  if (!candidates.length) return { type: "end" };
  candidates.sort((a, b) => b.score - a.score);
  const poolSize = style === "Chaos" ? 9 : style === "Tiki Taka" ? 6 : 7;
  const filtered = candidates.slice(0, poolSize).filter((c) => c.score > candidates[0].score - 38);
  if (rng(1, 100) <= 1) return { type: "end" };
  return pick(filtered.length ? filtered : candidates.slice(0, 4)).action;
}

function simulateOtherMatch(home, away, week) {
  const hp = teamPower(home) + 5;
  const ap = teamPower(away);
  const derby = home.rivalId === away.id || away.rivalId === home.id;
  const h = Math.max(0, Math.round((hp / ap) * rng(0, 4) - 0.1 + Math.random() + (derby ? Math.random() * 0.4 : 0)));
  const a = Math.max(0, Math.round((ap / hp) * rng(0, 4) - 0.2 + Math.random() + (derby ? Math.random() * 0.4 : 0)));
  const events = [];
  for (let i = 0; i < h; i += 1) events.push({ min: rng(1, 90), type: "goal", side: "home", team: home.name, player: pick(home.players.slice(0, 11)).name });
  for (let i = 0; i < a; i += 1) events.push({ min: rng(1, 90), type: "goal", side: "away", team: away.name, player: pick(away.players.slice(0, 11)).name });
  events.sort((x, y) => x.min - y.min);
  return { week, homeId: home.id, awayId: away.id, home: home.name, away: away.name, homeGoals: h, awayGoals: a, events, derby };
}
function resultFromGame(game, week) {
  return { week, homeId: game.homeId, awayId: game.awayId, home: game.homeName, away: game.awayName, homeGoals: game.score.home, awayGoals: game.score.away, events: game.events || [], derby: game.isDerby, stats: game.stats };
}
function applyResult(teams, result, userTeamId = MY_TEAM_ID) {
  return teams.map((team) => {
    if (team.id !== result.homeId && team.id !== result.awayId) return { ...team, players: tickPlayerStatus(team.players) };
    const isHome = team.id === result.homeId;
    const gf = isHome ? result.homeGoals : result.awayGoals;
    const ga = isHome ? result.awayGoals : result.homeGoals;
    const win = gf > ga;
    const draw = gf === ga;
    const playerEvents = (result.events || []).filter((e) => e.side === (isHome ? "home" : "away"));
    const affectedIds = new Map();
    playerEvents.forEach((e) => {
      if (e.playerId) affectedIds.set(e.playerId, e);
    });
    return {
      ...team,
      wins: team.wins + (win ? 1 : 0), draws: team.draws + (draw ? 1 : 0), losses: team.losses + (!win && !draw ? 1 : 0),
      gf: team.gf + gf, ga: team.ga + ga, pts: team.pts + (win ? 3 : draw ? 1 : 0),
      morale: clamp((team.morale || 70) + (win ? 4 : draw ? 1 : -3) + (result.derby && win ? 3 : 0), 35, 99),
      form: [...(team.form || []).slice(-4), win ? "W" : draw ? "D" : "L"],
      players: tickPlayerStatus(team.players, affectedIds, win),
    };
  });
}
function tickPlayerStatus(players, affected = new Map(), win = false) {
  return players.map((p) => {
    const ev = affected.get(p.id);
    let next = { ...p };
    next.injuredWeeks = Math.max(0, (next.injuredWeeks || 0) - 1);
    next.bannedWeeks = Math.max(0, (next.bannedWeeks || 0) - 1);
    next.fitness = clamp((next.fitness || 100) + 9 - rng(0, 8), 35, 100);
    next.morale = clamp((next.morale || 70) + (win ? 2 : -1), 35, 99);
    if (ev?.type === "injury") next.injuredWeeks = Math.max(next.injuredWeeks, ev.weeks || 1);
    if (ev?.type === "red") next.bannedWeeks = Math.max(next.bannedWeeks, 1);
    if (ev?.type === "goal") {
      next.morale = clamp(next.morale + 4, 35, 99);
      if (next.overall < next.potential && roll(22)) next.overall += 1;
    }
    return next;
  });
}
function homeIncome(team, result, rank, facilities) {
  const base = Math.round(team.fans * (1.25 + facilities.stadium * 0.18));
  const rankBonus = Math.max(0, 34 - rank) * 1900;
  const goalBonus = result.homeGoals * 16000;
  const winBonus = result.homeGoals > result.awayGoals ? 54000 : result.homeGoals === result.awayGoals ? 17000 : 0;
  const derbyBonus = result.derby ? 65000 : 0;
  const merch = result.homeGoals > result.awayGoals ? facilities.merchandise * 14000 : 0;
  const sponsor = facilities.sponsor * 9500;
  return base + rankBonus + goalBonus + winBonus + derbyBonus + merch + sponsor;
}
function makeObjectives(myTeam, teams) {
  const rival = teams.find((t) => t.id === myTeam.rivalId);
  return [
    { key: "top8", title: "Finish Top 8", desc: "Akhiri musim di posisi 8 besar.", reward: 260000, type: "rank", target: 8, done: false },
    { key: "goals35", title: "Cetak 35 Gol", desc: "Total gol liga minimal 35.", reward: 190000, type: "goals", target: 35, done: false },
    { key: "home5", title: "Menang 5 Laga Home", desc: "Menang kandang 5 kali.", reward: 210000, type: "homeWins", target: 5, done: false },
    { key: "derby", title: `Menang Derby vs ${rival?.name || "Rival"}`, desc: "Kalahkan rival minimal sekali.", reward: 240000, type: "derbyWins", target: 1, done: false },
    { key: "youth", title: "Bangun Masa Depan", desc: "Kembangkan 3 pemain muda/akademi.", reward: 180000, type: "youthDeveloped", target: 3, done: false },
  ];
}
function objectiveProgress(obj, ctx) {
  if (obj.type === "rank") return Math.max(0, obj.target - ctx.rank + 1);
  return ctx.stats[obj.type] || 0;
}
function objectiveComplete(obj, ctx) {
  if (obj.type === "rank") return ctx.rank <= obj.target;
  return (ctx.stats[obj.type] || 0) >= obj.target;
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return <div className="fatal"><h1>Aplikasi gagal render</h1><p>Salin error ini kalau masih terjadi.</p><pre>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre></div>;
    }
    return this.props.children;
  }
}
export default function App() { return <ErrorBoundary><FootballManager /></ErrorBoundary>; }

function FootballManager() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [week, setWeek] = useState(1);
  const [cash, setCash] = useState(INITIAL_CASH);
  const [formation, setFormation] = useState("4-3-3");
  const [trainingPlan, setTrainingPlan] = useState("balanced");
  const [facilities, setFacilities] = useState({ stadium: 1, training: 1, academy: 1, medical: 1, merchandise: 1, sponsor: 1 });
  const [seasonStats, setSeasonStats] = useState({ homeWins: 0, derbyWins: 0, goals: 0, youthDeveloped: 0 });
  const [claimed, setClaimed] = useState([]);
  const [market, setMarket] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [active, setActive] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [log, setLog] = useState([]);
  const [notice, setNotice] = useState(null);
  const [aiPaused, setAiPaused] = useState(false);
  const [lineupOverrides, setLineupOverrides] = useState({});
  const [scoutQueue, setScoutQueue] = useState([]);
  const [scoutUsed, setScoutUsed] = useState(0);
  const [manager, setManager] = useState({ name: "Coach Fakhri", reputation: 1, boardTrust: 70, fanTrust: 70 });
  const [storyLog, setStoryLog] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [competition, setCompetition] = useState("liga48");

  const sorted = useMemo(() => [...teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf), [teams]);
  const myTeam = teams.find((t) => t.id === MY_TEAM_ID);
  const myRank = sorted.findIndex((t) => t.id === MY_TEAM_ID) + 1;
  const fixtures = SEASON_FIXTURES[week - 1] || [];
  const myFixture = fixtures.find((m) => m.homeId === MY_TEAM_ID || m.awayId === MY_TEAM_ID);
  const objectives = useMemo(() => makeObjectives(myTeam, teams), [myTeam, teams]);
  const objectiveCtx = useMemo(() => ({ rank: myRank, stats: { ...seasonStats, goals: myTeam.gf } }), [myRank, seasonStats, myTeam.gf]);

  useEffect(() => {
    setMarket(makeFreshMarket(facilities.academy || 1));
  }, []);

  const notify = useCallback((text, type = "info") => {
    setNotice({ text, type });
    window.setTimeout(() => setNotice(null), 3200);
  }, []);

  const currentSavePayload = useCallback(() => ({
    competition, teams, week, cash, formation, trainingPlan, facilities, seasonStats, claimed, market, log, manager, storyLog, lineupOverrides,
  }), [cash, claimed, competition, facilities, formation, lineupOverrides, log, manager, market, seasonStats, storyLog, teams, trainingPlan, week]);

  const applyLoadedData = useCallback((data, source = "save") => {
    if (!data?.teams || !Array.isArray(data.teams)) { notify("File save tidak valid.", "error"); return; }
    setCompetition(data.competition || "liga48");
    setTeams(data.teams); setWeek(data.week || 1); setCash(Number(data.cash || 0)); setFormation(data.formation || "4-3-3");
    setTrainingPlan(data.trainingPlan || "balanced"); setFacilities(data.facilities || { stadium: 1, training: 1, academy: 1, medical: 1, merchandise: 1, sponsor: 1 });
    setSeasonStats(data.seasonStats || { homeWins: 0, derbyWins: 0, goals: 0, youthDeveloped: 0 }); setClaimed(data.claimed || []);
    setMarket(data.market || makeFreshMarket(data.facilities?.academy || 1)); setLog(data.log || []); setManager(data.manager || { name: "Coach Fakhri", reputation: 1, boardTrust: 70, fanTrust: 70 });
    setStoryLog(data.storyLog || []); setLineupOverrides(data.lineupOverrides || {});
    setScoutQueue([]); setScoutUsed(0); setActive(null); setSelectedId(null); setSelectedPlayer(null); setGameStarted(true); setTab("dashboard");
    notify(source === "file" ? "Save file berhasil dimuat." : "Save manual berhasil dimuat.", "success");
  }, [notify]);

  const startNewCareer = useCallback(() => {
    const freshTeams = buildClubs();
    setCompetition("liga48"); setTeams(freshTeams); setWeek(1); setCash(INITIAL_CASH); setFormation("4-3-3"); setTrainingPlan("balanced");
    setFacilities({ stadium: 1, training: 1, academy: 1, medical: 1, merchandise: 1, sponsor: 1 });
    setSeasonStats({ homeWins: 0, derbyWins: 0, goals: 0, youthDeveloped: 0 }); setClaimed([]); setMarket(makeFreshMarket(1)); setLog([]);
    setManager({ name: "Coach Fakhri", reputation: 1, boardTrust: 70, fanTrust: 70 }); setStoryLog([]); setLineupOverrides({});
    setScoutQueue([]); setScoutUsed(0); setActive(null); setSelectedId(null); setSelectedPlayer(null); setTab("dashboard"); setGameStarted(true);
    notify("Career baru dimulai. Semua data fresh dan kas mulai dari Rp 0.", "success");
  }, [notify]);

  const importSaveFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { applyLoadedData(JSON.parse(String(reader.result || "{}")), "file"); }
      catch { notify("Gagal membaca file save JSON.", "error"); }
    };
    reader.onerror = () => notify("Gagal membuka file save.", "error");
    reader.readAsText(file);
  }, [applyLoadedData, notify]);

  const startMatch = useCallback(() => {
    if (!gameStarted) { setTab("dashboard"); return; }
    if (active) { setTab("match"); return; }
    if (week > SEASON_FIXTURES.length) { notify("Musim selesai. Kamu bisa deploy dan mulai season baru dengan refresh.", "warn"); return; }
    if (!myFixture) { notify("Tidak ada jadwal tim kamu minggu ini.", "warn"); return; }
    const homeTeam = teams.find((t) => t.id === myFixture.homeId);
    const awayTeam = teams.find((t) => t.id === myFixture.awayId);
    const userSide = myFixture.homeId === MY_TEAM_ID ? "home" : "away";
    const game = createMatch({ homeTeam, awayTeam, userSide, userFormation: formation, trainingPlan, facilities, lineupOverrides });
    setActive({ week, fixture: myFixture, game });
    setSelectedId(game.ballOwnerId && getPiece(game, game.ballOwnerId)?.side === userSide ? game.ballOwnerId : null);
    setTab("match");
    notify(`${homeTeam.name} vs ${awayTeam.name}. Kamu bermain sebagai ${sideLabel(userSide)}.`, game.isDerby ? "derby" : "success");
  }, [active, facilities, formation, gameStarted, lineupOverrides, myFixture, notify, teams, trainingPlan, week]);

  useEffect(() => {
    if (aiPaused || !active?.game || active.game.ended || active.game.goalPause || active.game.turn === active.game.userSide) return undefined;
    const timer = window.setTimeout(() => {
      setActive((prev) => {
        if (!prev?.game || prev.game.ended || prev.game.turn === prev.game.userSide) return prev;
        const action = bestAiAction(prev.game);
        return action ? { ...prev, game: applyAction(prev.game, action) } : prev;
      });
      setSelectedId(null);
    }, 590 + rng(0, 290));
    return () => window.clearTimeout(timer);
  }, [active, aiPaused]);

  useEffect(() => {
    if (!active?.game || active.game.ended || active.game.turn !== active.game.userSide) return;
    const carrier = getPiece(active.game, active.game.ballOwnerId);
    if (carrier?.side === active.game.userSide) setSelectedId(carrier.id);
  }, [active?.game?.turn, active?.game?.ballOwnerId]);

  const doAction = useCallback((action) => {
    setActive((prev) => {
      if (!prev?.game) return prev;
      if (prev.game.ended && action.type !== "resumeGoal") return prev;
      if (action.type !== "resumeGoal" && action.type !== "card" && prev.game.turn !== prev.game.userSide) return prev;
      return { ...prev, game: applyAction(prev.game, action) };
    });
  }, []);

  const finishWeek = useCallback(() => {
    if (!active?.game?.ended) { notify("Pertandingan belum selesai.", "warn"); return; }
    const played = resultFromGame(active.game, active.week);
    const other = fixtures.filter((m) => m.homeId !== MY_TEAM_ID && m.awayId !== MY_TEAM_ID).map((m) => simulateOtherMatch(teams.find((t) => t.id === m.homeId), teams.find((t) => t.id === m.awayId), active.week));
    const results = [played, ...other];
    const nextTeams = results.reduce((acc, result) => applyResult(acc, result), teams);
    setTeams(nextTeams);
    setLog((prev) => [...results, ...prev].slice(0, 420));

    const userWon = (played.homeId === MY_TEAM_ID && played.homeGoals > played.awayGoals) || (played.awayId === MY_TEAM_ID && played.awayGoals > played.homeGoals);
    const userHomeWin = played.homeId === MY_TEAM_ID && played.homeGoals > played.awayGoals;
    const userDerbyWin = played.derby && userWon;
    const youngGrowth = trainingPlan === "youth" ? rng(0, 2) + facilities.academy >= 3 ? 1 : 0 : 0;
    setSeasonStats((s) => ({ ...s, homeWins: s.homeWins + (userHomeWin ? 1 : 0), derbyWins: s.derbyWins + (userDerbyWin ? 1 : 0), goals: s.goals + (played.homeId === MY_TEAM_ID ? played.homeGoals : played.awayGoals), youthDeveloped: s.youthDeveloped + youngGrowth }));

    const cupBonus = cupBonusForWeek(active.week, myTeam, played);
    if (played.homeId === MY_TEAM_ID) {
      const income = homeIncome(myTeam, played, myRank, facilities) + cupBonus;
      setCash((c) => c + income);
      notify(`Pemasukan kandang masuk: ${money(income)}${cupBonus ? " termasuk bonus cup" : ""}.`, "success");
    } else {
      if (cupBonus) setCash((c) => c + cupBonus);
      notify(cupBonus ? `Laga tandang selesai. Bonus cup ${money(cupBonus)}.` : "Laga tandang selesai. Tidak ada pemasukan tiket.", "info");
    }
    setScoutUsed(0);
    if (scoutQueue.length) {
      const doneIds = scoutQueue.map((q) => q.id);
      setMarket((prev) => prev.map((p) => doneIds.includes(p.id) ? { ...p, scouted: true, scoutStatus: p.rarePotential ? "gem" : "normal" } : p));
      setScoutQueue([]);
      notify(`Scout report selesai untuk ${doneIds.length} pemain. Wonderkid tetap langka ±5%.`, "info");
    }
    if (active.week % 3 === 0 || played.derby) {
      setStoryLog((prev) => [randomStoryEvent(active.week), ...prev].slice(0, 20));
    }
    setManager((m) => ({ ...m, reputation: clamp(m.reputation + (userWon ? 1 : 0), 1, 99), boardTrust: clamp(m.boardTrust + (userWon ? 3 : -2), 0, 100), fanTrust: clamp(m.fanTrust + (userWon ? 4 : -3) + (played.derby && userWon ? 4 : 0), 0, 100) }));

    setActive(null);
    setSelectedId(null);
    setWeek((w) => w + 1);
    setTab("schedule");
  }, [active, facilities, fixtures, myRank, myTeam, notify, scoutQueue, teams, trainingPlan]);

  useEffect(() => {
    const completed = objectives.filter((o) => !claimed.includes(o.key) && objectiveComplete(o, objectiveCtx));
    if (!completed.length) return;
    const reward = completed.reduce((sum, o) => sum + o.reward, 0);
    setClaimed((c) => [...c, ...completed.map((o) => o.key)]);
    setCash((c) => c + reward);
    notify(`Objective selesai: ${completed.map((o) => o.title).join(", ")}. Bonus ${money(reward)}.`, "success");
  }, [claimed, objectiveCtx, objectives, notify]);

  const buy = (player) => {
    if (cash < player.value) { notify(`Kas tidak cukup. Butuh ${money(player.value)}.`, "error"); return; }
    if (myTeam.players.length >= 38) { notify("Skuad penuh. Maksimal 38 pemain.", "warn"); return; }
    setCash((c) => c - player.value);
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: [...t.players, { ...player, teamId: MY_TEAM_ID, scouted: true }] } : t));
    setMarket((prev) => prev.filter((p) => p.id !== player.id));
    notify(`${player.name} bergabung permanen.`, "success");
  };
  const loan = (player) => {
    const fee = Math.round(player.value * 0.14);
    if (cash < fee) { notify(`Loan fee kurang. Butuh ${money(fee)}.`, "error"); return; }
    setCash((c) => c - fee);
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: [...t.players, { ...player, teamId: MY_TEAM_ID, loan: true, value: Math.round(player.value * 0.3), scouted: true }] } : t));
    setMarket((prev) => prev.filter((p) => p.id !== player.id));
    notify(`${player.name} datang sebagai pinjaman.`, "success");
  };
  const scout = (player) => {
    if (player.scouted) { notify(`${player.name} sudah punya report.`, "info"); return; }
    if (scoutQueue.some((q) => q.id === player.id)) { notify(`${player.name} sedang di-scout. Tunggu 1 match.`, "warn"); return; }
    if (scoutUsed >= scoutLimit) { notify(`Batas scout fase ini ${scoutLimit}. Tunggu pertandingan berikutnya.`, "warn"); return; }
    setScoutUsed((n) => n + 1);
    setScoutQueue((q) => [...q, { id: player.id, name: player.name, dueWeek: week + 1 }]);
    setMarket((prev) => prev.map((p) => p.id === player.id ? { ...p, scoutStatus: "pending" } : p));
    notify(`Scout dikirim untuk ${player.name}. Hasil keluar setelah 1 match.`, "info");
  };
  const sell = (player) => {
    if (myTeam.players.length <= 18) { notify("Minimal skuad 18 pemain.", "warn"); return; }
    const fee = Math.round(player.value * (player.loan ? 0.15 : 0.72));
    setCash((c) => c + fee);
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.filter((p) => p.id !== player.id) } : t));
    if (!player.loan) setMarket((prev) => [{ ...player, teamId: null, scouted: true }, ...prev]);
    setSelectedPlayer(null);
    notify(`${player.name} dilepas. Kas +${money(fee)}.`, "success");
  };

  const scoutLimit = Math.min(3, 1 + Math.floor((facilities.academy || 1) / 2));
  const saveNow = () => {
    const ok = saveCareer(currentSavePayload());
    notify(ok ? "Career disimpan manual ke browser." : "Gagal menyimpan career.", ok ? "success" : "error");
  };
  const exportSave = () => {
    const payload = currentSavePayload();
    saveCareer(payload);
    const ok = downloadCareerFile(payload);
    notify(ok ? "Save di-download sebagai file JSON." : "Gagal download save.", ok ? "success" : "error");
  };
  const loadNow = () => {
    const data = loadCareer();
    if (!data?.teams) { notify("Belum ada save manual. Pilih Career Baru atau import file save.", "warn"); return; }
    applyLoadedData(data, "local");
  };
  const resetSave = () => { clearCareer(); notify("Save manual di browser dihapus. File download tetap aman kalau kamu punya.", "warn"); };
  const answerStory = (eventId, choice) => {
    setStoryLog((prev) => prev.map((e) => e.id === eventId ? { ...e, choice, effect: choice.includes("Promosikan") ? "+Youth" : choice.includes("ofensif") ? "+Fans" : "+Board" } : e));
    setManager((m) => ({ ...m, fanTrust: clamp(m.fanTrust + (choice.includes("ofensif") ? 3 : 1), 0, 100), boardTrust: clamp(m.boardTrust + (choice.includes("tenang") || choice.includes("realistis") ? 3 : 0), 0, 100) }));
  };

  const upgradeFacility = (key) => {
    const level = facilities[key] || 1;
    if (level >= 5) { notify("Level fasilitas sudah maksimal.", "warn"); return; }
    const cost = Math.round(FACILITY_DEF[key].baseCost * Math.pow(1.65, level - 1));
    if (cash < cost) { notify(`Kas tidak cukup untuk upgrade ${FACILITY_DEF[key].label}. Butuh ${money(cost)}.`, "error"); return; }
    setCash((c) => c - cost);
    setFacilities((f) => ({ ...f, [key]: level + 1 }));
    notify(`${FACILITY_DEF[key].label} naik ke level ${level + 1}.`, "success");
  };

  const tabs = [["dashboard", "Home"], ["career", "Career"], ["training", "Latihan"], ["squad", "Skuad"], ["tactics", "Taktik"], ["match", "Main"], ["schedule", "Jadwal"], ["table", "Klasemen"], ["transfer", "Transfer"], ["youth", "Youth"], ["story", "Story"], ["facilities", "Fasilitas"], ["objectives", "Target"], ["clubs", "Klub"]];
  if (!gameStarted) {
    return <div className="appShell landingShell">
      {notice && <Notice notice={notice} />}
      <LandingScreen competition={competition} setCompetition={setCompetition} startNewCareer={startNewCareer} loadNow={loadNow} importSaveFile={importSaveFile} />
    </div>;
  }
  return <div className="appShell">
    {notice && <Notice notice={notice} />}
    <header className="topbar">
      <div className="brand"><div className="logo" style={{ background: myTeam.color }}>⚽</div><div><h1>{myTeam.name}</h1><p>Bola Catur Arena V5</p></div></div>
      <div className="quickStats"><Stat label="Pekan" value={`${Math.min(week, SEASON_FIXTURES.length)}/${SEASON_FIXTURES.length}`} /><Stat label="Posisi" value={`#${myRank}`} /><Stat label="Kas" value={money(cash)} /><Stat label="AP" value={active?.game ? active.game.ap : "-"} /></div>
      <button className="primary big" onClick={startMatch}>{active ? "LANJUT MATCH" : "MAIN PEKAN"}</button>
    </header>
    <nav className="tabs">{tabs.map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}</nav>
    <main>
      {tab === "dashboard" && <Dashboard team={myTeam} rank={myRank} week={week} cash={cash} fixture={myFixture} teams={teams} startMatch={startMatch} active={active} facilities={facilities} trainingPlan={trainingPlan} objectives={objectives} objectiveCtx={objectiveCtx} claimed={claimed} />}
      {tab === "career" && <CareerTab manager={manager} saveNow={saveNow} exportSave={exportSave} loadNow={loadNow} resetSave={resetSave} importSaveFile={importSaveFile} />}
      {tab === "training" && <TrainingTab trainingPlan={trainingPlan} setTrainingPlan={setTrainingPlan} />}
      {tab === "squad" && <SquadTab team={myTeam} selected={selectedPlayer} setSelected={setSelectedPlayer} sell={sell} />}
      {tab === "tactics" && <TacticsTab team={myTeam} formation={formation} setFormation={setFormation} lineupOverrides={lineupOverrides} setLineupOverrides={setLineupOverrides} />}
      {tab === "match" && <MatchTab active={active} selectedId={selectedId} setSelectedId={setSelectedId} onAction={doAction} finishWeek={finishWeek} startMatch={startMatch} aiPaused={aiPaused} setAiPaused={setAiPaused} />}
      {tab === "schedule" && <ScheduleTab fixtures={fixtures} teams={teams} week={week} log={log} />}
      {tab === "table" && <TableTab teams={sorted} />}
      {tab === "transfer" && <TransferTab market={market} cash={cash} buy={buy} loan={loan} scout={scout} scoutQueue={scoutQueue} scoutUsed={scoutUsed} scoutLimit={scoutLimit} />}
      {tab === "youth" && <YouthTab team={myTeam} facilities={facilities} />}
      {tab === "story" && <StoryTab storyLog={storyLog} answerStory={answerStory} />}
      {tab === "facilities" && <FacilitiesTab facilities={facilities} cash={cash} upgrade={upgradeFacility} />}
      {tab === "objectives" && <ObjectivesTab objectives={objectives} ctx={objectiveCtx} claimed={claimed} />}
      {tab === "clubs" && <ClubsTab teams={teams} />}
    </main>
  </div>;
}

function LandingScreen({ competition, setCompetition, startNewCareer, loadNow, importSaveFile }) {
  const menus = ["Career", "Latihan", "Skuad", "Taktik", "Main Pekan", "Transfer", "Youth", "Fasilitas", "Klasemen", "Klub"];
  return <main className="landingMain">
    <section className="landingHero">
      <div className="landingBall">⚽</div>
      <p className="eyebrow">Bola Catur Arena</p>
      <h1>Mulai dari Beranda, lalu pilih kariermu.</h1>
      <p>Data tidak langsung dimuat ke laga. Pilih kompetisi, mulai career baru, load save browser, atau import file save JSON. Kalau tidak ada save, semuanya fresh dari kas Rp 0.</p>
      <div className="landingActions"><button className="primary big" onClick={startNewCareer}>Career Baru</button><button className="ghost big" onClick={loadNow}>Load Browser Save</button><label className="fileButton big">Load File Save<input type="file" accept="application/json,.json" onChange={(e) => importSaveFile(e.target.files?.[0])} /></label></div>
    </section>
    <section className="landingGrid">
      <Card><h3>Pilih Kompetisi</h3><div className="competitionGrid">{Object.values(COMPETITIONS).map((c) => <button key={c.key} className={competition === c.key ? "active" : ""} onClick={() => setCompetition(c.key)}><b>{c.title}</b><span>{c.subtitle}</span><small>{c.badge}</small></button>)}</div></Card>
      <Card><h3>Menu Setelah Mulai</h3><p className="muted">Tombol menu utama baru muncul setelah kamu memulai/load career, seperti game pada umumnya.</p><div className="menuPreview">{menus.map((m) => <span key={m}>{m}</span>)}</div></Card>
      <Card><h3>Aturan Ekonomi</h3><div className="infoGrid"><span>Kas awal</span><b>Rp 0</b><span>Pemasukan utama</span><b>Laga Home</b><span>Save</span><b>Manual + JSON</b><span>Refresh tanpa save</span><b>Fresh</b></div></Card>
    </section>
  </main>;
}
function Notice({ notice }) { return <div className={`notice ${notice.type}`}>{notice.text}</div>; }
function Stat({ label, value }) { return <div className="stat"><b>{value}</b><span>{label}</span></div>; }
function Card({ children, className = "", style }) { return <div className={`card ${className}`} style={style}>{children}</div>; }
function Section({ title, sub, children }) { return <section className="section"><div className="sectionHead"><h2>{title}</h2>{sub && <p>{sub}</p>}</div>{children}</section>; }

function Dashboard({ team, rank, week, cash, fixture, teams, startMatch, active, facilities, trainingPlan, objectives, objectiveCtx, claimed }) {
  const home = fixture && teams.find((t) => t.id === fixture.homeId);
  const away = fixture && teams.find((t) => t.id === fixture.awayId);
  const isHome = fixture?.homeId === MY_TEAM_ID;
  const completedCount = objectives.filter((o) => claimed.includes(o.key) || objectiveComplete(o, objectiveCtx)).length;
  return <Section title="Dashboard" sub="Sekarang setiap pekan adalah pertandingan taktik playable dengan AP, skill, kartu taktik, stamina, kartu merah, cedera, ekonomi, dan target season.">
    <div className="dashboardGrid">
      <Card className="heroCard"><h3>{team.name}</h3><p>{team.city} · Rank #{rank} · Style kamu ditentukan oleh formasi dan pilihan taktik.</p><div className="heroNumbers"><span><b>{money(cash)}</b><small>Kas mulai dari 0</small></span><span><b>{team.gf}-{team.ga}</b><small>Gol</small></span><span><b>{team.pts}</b><small>Poin</small></span></div><button className="primary" onClick={startMatch}>{active ? "Kembali ke Match" : "Main Pekan Ini"}</button></Card>
      <Card><h3>Jadwal Pekan {week}</h3>{fixture ? <div className="fixtureBig"><b>{home.name}</b><strong>vs</strong><b>{away.name}</b><small className={isHome ? "good" : "muted"}>{isHome ? "HOME: menang/seri/kalah tetap dapat tiket. Menang lebih besar." : "AWAY: tidak ada pemasukan tiket."}</small><small>{home.rivalId === away.id ? "🔥 DERBY: emosi, kartu, bonus fanbase lebih tinggi." : `${home.style} vs ${away.style}`}</small></div> : <p className="muted">Tidak ada jadwal.</p>}</Card>
      <Card><h3>Persiapan</h3><div className="infoGrid"><span>Latihan</span><b>{TRAINING_PLANS[trainingPlan].icon} {TRAINING_PLANS[trainingPlan].label}</b><span>Stadion</span><b>Lv {facilities.stadium}</b><span>Training</span><b>Lv {facilities.training}</b><span>Medical</span><b>Lv {facilities.medical}</b></div></Card>
      <Card><h3>Target Season</h3><p className="muted">{completedCount}/{objectives.length} target selesai atau hampir selesai.</p>{objectives.slice(0, 3).map((o) => <ProgressLine key={o.key} label={o.title} value={objectiveProgress(o, objectiveCtx)} target={o.target} done={claimed.includes(o.key)} />)}</Card>
    </div>
  </Section>;
}
function ProgressLine({ label, value, target, done }) { const pct = clamp((value / target) * 100, 0, 100); return <div className="progressLine"><span>{label}</span><b>{done ? "Diklaim" : `${Math.min(value, target)}/${target}`}</b><i><em style={{ width: `${pct}%` }} /></i></div>; }
function TrainingTab({ trainingPlan, setTrainingPlan }) {
  return <Section title="Latihan Mingguan" sub="Pilih satu latihan sebelum MAIN PEKAN. Latihan langsung mengubah peluang di match engine."><div className="cardsGrid">{Object.entries(TRAINING_PLANS).map(([key, plan]) => <button key={key} className={`trainingCard ${trainingPlan === key ? "active" : ""}`} onClick={() => setTrainingPlan(key)}><strong>{plan.icon}</strong><b>{plan.label}</b><span>{plan.desc}</span></button>)}</div></Section>;
}

function MatchTab({ active, selectedId, setSelectedId, onAction, finishWeek, startMatch, aiPaused, setAiPaused }) {
  if (!active) return <Section title="Match" sub="Belum ada pertandingan aktif."><Card className="empty"><h3>Belum mulai</h3><p>Klik MAIN PEKAN untuk membuka pertandingan playable.</p><button className="primary" onClick={startMatch}>Main Pekan</button></Card></Section>;
  const game = active.game;
  const humanTurn = game.turn === game.userSide && !game.ended && !game.goalPause;
  const selected = getPiece(game, selectedId);
  const carrier = getPiece(game, game.ballOwnerId);
  const runCells = selected ? legalRunCells(game, selected.id) : [];
  const passes = selected ? passOptions(game, selected.id, false) : [];
  const throughs = selected ? passOptions(game, selected.id, true) : [];
  const tackles = selected ? tackleOptions(game, selected.id) : [];
  const shot = selected ? shotInfo(game, selected.id) : { can: false, chance: 0 };
  return <Section title="Live Match" sub={game.isDerby ? "🔥 Derby mode aktif: kartu, emosi, bonus pemasukan home lebih tinggi." : "Gameplay dibuat seperti catur bola: pilih pemain, baca peluang, pakai AP, lalu eksekusi."}>
    <div className="matchGridV5">
      <Card className="matchInfoDock">
        <div className="turnBox compact"><b>{game.ended ? "FULL TIME" : `${sideLabel(game.turn)} TURN`}</b><span>AP {game.ap}/{MAX_AP} · Menit {minuteOf(game)}'</span><small>{game.turn !== game.userSide ? `AI sedang menjalankan rencana tersembunyi.` : getCoachHint(game)}</small></div>
        <div className="carrierBox">Bola: <b>{carrier?.name}</b><small>{carrier?.teamName}</small></div>
        <div className="momentum"><span>Home <b>{game.momentum.home}</b></span><span>Away <b>{game.momentum.away}</b></span></div>
        <ActiveEffects game={game} />
        <button className="ghost full" onClick={() => setAiPaused(!aiPaused)}>{aiPaused ? "Lanjutkan AI" : "Pause AI"}</button>
      </Card>

      <Card className="boardCard boardFocus">
        <Scoreboard game={game} />
        {game.goalPause && <GoalOverlay game={game} onResume={() => onAction({ type: "resumeGoal" })} />}
        <Board game={game} selectedId={selectedId} setSelectedId={setSelectedId} runCells={runCells} passes={passes} throughs={throughs} tackles={tackles} onAction={onAction} humanTurn={humanTurn} />
        {game.ended && <button className="primary full" onClick={finishWeek}>Simpan Hasil & Lanjut Pekan</button>}
      </Card>

      <Card className="actionDock">
        <h3>Aksi Utama</h3>
        {selected ? <div className="selectedBox"><b>{selected.role} · {selected.name}</b><small>{selected.trait} · Energy {selected.energy}% · {selected.teamName}</small>
          <div className="actionButtons pro"><button className="shootButton" disabled={!shot.can || !humanTurn} onClick={() => onAction({ type: "shoot", pieceId: selected.id })}>🥅 TEMBAK {shot.can ? `${shot.chance}%` : "-"}<small>2AP</small></button><button disabled={!humanTurn || game.ballOwnerId !== selected.id || game.ap < 2} onClick={() => onAction({ type: "skill", pieceId: selected.id })}>✨ Skill<small>2AP</small></button>{tackles[0] && <button disabled={!humanTurn} onClick={() => onAction({ type: "tackle", pieceId: selected.id, targetId: tackles[0].target.id })}>⚔️ Tackle {tackles[0].chance}%<small>1AP</small></button>}<button disabled={!humanTurn} onClick={() => onAction({ type: "end" })}>⏭️ End<small>Turn</small></button></div>
          <PassList title="Umpan Terbaik" options={passes} type="pass" piece={selected} onAction={onAction} humanTurn={humanTurn} />
          <PassList title="Through Ball" options={throughs} type="through" piece={selected} onAction={onAction} humanTurn={humanTurn} />
        </div> : <p className="muted">Pilih pemain kamu di papan. Opsi aksi akan muncul di sini.</p>}
        <h3>Kartu Taktik</h3><div className="tacticHand compactCards">{game.userCards?.map((c) => <button key={c.uid} disabled={!humanTurn} onClick={() => onAction({ type: "card", cardKey: c.key })}><b>{c.icon} {c.name}</b><small>{c.desc}</small></button>)}</div>
      </Card>

      <Card className="matchBottomDock"><StatsBox game={game} /><div className="history compactHistory">{game.history.slice(0, 6).map((h, i) => <div key={`${h.minute}-${i}`}><small>{h.minute}'</small><span>{h.icon}</span><p>{h.text}</p></div>)}</div></Card>
    </div>
  </Section>;
}

function ActiveEffects({ game }) { const all = ["home", "away"].flatMap((side) => (game.effects[side] || []).map((e) => ({ ...e, side }))); return <div className="effects">{all.length === 0 ? <small className="muted">Belum ada efek taktik aktif.</small> : all.map((e) => <span key={`${e.side}-${e.key}`}>{sideLabel(e.side)}: {e.key} ({e.ttl})</span>)}</div>; }
function PassList({ title, options, type, piece, onAction, humanTurn }) { if (!options.length) return null; return <div className="passList"><b>{title}</b>{options.slice(0, 3).map((o) => <button key={`${type}-${o.target.id}`} disabled={!humanTurn} onClick={() => onAction({ type, pieceId: piece.id, targetId: o.target.id })}><span>{o.target.role} {firstName(o.target.name)}</span><small>{o.chance}% · {o.cost}AP</small></button>)}</div>; }
function getCoachHint(game) {
  const carrier = getPiece(game, game.ballOwnerId);
  if (!carrier) return "Cari pemain bebas dan rebut bola.";
  if (game.turn !== game.userSide) return "AI bergerak acak-terarah: mereka punya style klub dan plan tersembunyi per turn.";
  if (carrier.side === game.userSide) {
    const shot = shotInfo(game, carrier.id); if (shot.can && shot.chance >= 45) return `Tembak sekarang: ${shot.chance}% (${shot.label}).`;
    const through = passOptions(game, carrier.id, true)[0]; if (through && through.forwardBonus > 1 && through.chance > 44) return `Through ball ke ${firstName(through.target.name)} menarik: ${through.chance}%.`;
    const pass = passOptions(game, carrier.id, false)[0]; if (pass) return `Umpan aman ke ${firstName(pass.target.name)}: ${pass.chance}%.`;
    return "Dribel ke ruang kosong, atau pakai kartu taktik untuk membuka blok.";
  }
  const tackler = game.pieces.filter((p) => p.side === game.userSide && !p.red).map((p) => ({ p, t: tackleOptions(game, p.id)[0], d: manhattan(p, carrier) })).sort((a, b) => (b.t?.chance || 0) - (a.t?.chance || 0) || a.d - b.d)[0];
  if (tackler?.t) return `Tackle dengan ${firstName(tackler.p.name)}: ${tackler.t.chance}%.`;
  return `Tutup jalur ${firstName(carrier.name)}. Pilih pemain dekat lalu run mendekat.`;
}
function Scoreboard({ game }) { return <div className="scoreboard"><div><b>{game.homeName}</b><span>Home · {game.homeFormation} · {game.homeStyle}</span></div><strong>{game.score.home} - {game.score.away}</strong><div><b>{game.awayName}</b><span>Away · {game.awayFormation} · {game.awayStyle}</span></div></div>; }
function Board({ game, selectedId, setSelectedId, runCells, passes, throughs, tackles, onAction, humanTurn }) {
  const runKey = new Map(runCells.map((c) => [`${c.x}-${c.y}`, c]));
  const passIds = new Map(passes.map((p) => [p.target.id, p]));
  const throughIds = new Map(throughs.map((p) => [p.target.id, p]));
  const tackleIds = new Map(tackles.map((t) => [t.target.id, t]));
  const cells = [];
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      const piece = pieceAt(game, x, y);
      const run = runKey.get(`${x}-${y}`);
      const isGoal = (y === 0 || y === BOARD_ROWS - 1) && GOAL_COLS.includes(x);
      const pass = piece ? passIds.get(piece.id) : null;
      const through = piece ? throughIds.get(piece.id) : null;
      const tackle = piece ? tackleIds.get(piece.id) : null;
      const selected = piece?.id === selectedId;
      const canSelect = humanTurn && piece?.side === game.userSide;
      const onClick = () => {
        if (!humanTurn) return;
        if (run && selectedId) { onAction({ type: "move", pieceId: selectedId, x, y }); return; }
        if (through && selectedId) { onAction({ type: "through", pieceId: selectedId, targetId: piece.id }); return; }
        if (pass && selectedId) { onAction({ type: "pass", pieceId: selectedId, targetId: piece.id }); return; }
        if (tackle && selectedId) { onAction({ type: "tackle", pieceId: selectedId, targetId: piece.id }); return; }
        if (canSelect) setSelectedId(piece.id);
      };
      cells.push(<button key={`${x}-${y}`} className={`cell ${isGoal ? "goal" : ""} ${run ? "run" : ""}`} onClick={onClick}><span className="coord">{boardCellName(x, y)}</span>{piece && <span className={`piece ${piece.side} ${selected ? "selected" : ""} ${pass ? "pass" : ""} ${through ? "through" : ""} ${tackle ? "tackle" : ""} ${piece.red ? "sentOff" : ""}`} title={`${piece.name} · ${piece.role} · ${piece.trait}`}><b>{piece.role}</b><small>{piece.overall}</small>{piece.id === game.ballOwnerId && <i>⚽</i>}{piece.yellow > 0 && <u>🟨</u>}{pass && <em>{pass.chance}%</em>}{through && <em>TB {through.chance}%</em>}{tackle && <em>{tackle.chance}%</em>}</span>}{!piece && run && <span className="runDot">{run.kind === "dribble" ? "🌀" : "🏃"}<small>{run.cost}AP</small></span>}</button>);
    }
  }
  return <div className="board">{cells}</div>;
}
function StatsBox({ game }) { return <div className="statsBox"><div><b>{game.stats.home.shots}</b><span>Shots</span><b>{game.stats.away.shots}</b></div><div><b>{game.stats.home.onTarget}</b><span>On Target</span><b>{game.stats.away.onTarget}</b></div><div><b>{Math.round(game.stats.home.xg * 100) / 100}</b><span>xG</span><b>{Math.round(game.stats.away.xg * 100) / 100}</b></div><div><b>{game.stats.home.fouls}</b><span>Fouls</span><b>{game.stats.away.fouls}</b></div><div><b>{game.stats.home.corners}</b><span>Corners</span><b>{game.stats.away.corners}</b></div></div>; }

function SquadTab({ team, selected, setSelected, sell }) {
  const order = { GK: 0, LB: 1, CB: 2, RB: 3, CDM: 4, CM: 5, CAM: 6, LM: 7, RM: 8, LW: 9, RW: 10, ST: 11 };
  const players = [...team.players].sort((a, b) => (order[a.pos] ?? 99) - (order[b.pos] ?? 99) || b.overall - a.overall);
  return <Section title="Skuad" sub={`${team.players.length} pemain. Cedera/sanksi otomatis memengaruhi starting XI.`}><div className="playerGrid">{players.map((p) => <PlayerCard key={p.id} player={p} active={selected?.id === p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)} />)}</div>{selected && <Card className="detail"><div><h3>{selected.name}</h3><p>{POS_LABELS[selected.pos]} · {selected.age} tahun · {traitText(selected.trait)} · kontrak {selected.contract} tahun</p><div className="skillBars big"><span>PAC <b>{selected.pace}</b></span><span>SHO <b>{selected.shoot}</b></span><span>PAS <b>{selected.pass}</b></span><span>DRI <b>{selected.dribble}</b></span><span>DEF <b>{selected.defend}</b></span></div><p className="muted">Fitness {selected.fitness}% · Morale {selected.morale} · Potential {selected.potential}</p></div><div><p className="bigMoney">{money(selected.value)}</p><button className="danger" onClick={() => sell(selected)}>Jual {money(Math.round(selected.value * (selected.loan ? 0.15 : 0.72)))}</button></div></Card>}</Section>;
}
function traitText(key) { const t = TRAITS.find((x) => x.key === key); return t ? `${t.icon} ${t.key}` : key; }
function PlayerCard({ player, active, onClick }) { return <button className={`playerCard ${active ? "active" : ""} ${player.injuredWeeks > 0 || player.bannedWeeks > 0 ? "unavailable" : ""}`} onClick={onClick}><span>{player.pos}</span><b>{player.name}</b><small>{player.age} thn · {player.scouted ? `POT ${player.potential}` : "POT ??"} · {player.personality || "Professional"} · {player.loan ? "Loan" : money(player.value)}</small><strong>{player.overall}</strong><div><i>PAC {player.pace}</i><i>SHO {player.shoot}</i><i>PAS {player.pass}</i><i>DEF {player.defend}</i></div><small>{traitText(player.trait)} {player.injuredWeeks ? `· 🏥 ${player.injuredWeeks}w` : ""}{player.bannedWeeks ? `· 🟥 ${player.bannedWeeks}w` : ""}</small></button>; }
function TacticsTab({ team, formation, setFormation, lineupOverrides, setLineupOverrides }) {
  const [selectedSlot, setSelectedSlot] = useState(0);
  const lineup = pickLineup(team, formation, lineupOverrides);
  const selected = lineup[selectedSlot];
  const usedIds = new Set(lineup.map((x) => x.player.id));
  const bench = team.players.filter((p) => !usedIds.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0).sort((a, b) => b.overall - a.overall);
  const changePlayer = (playerId) => setLineupOverrides((old) => ({ ...old, [selectedSlot]: playerId }));
  const clearManual = () => setLineupOverrides({});
  return <Section title="Taktik & Formasi" sub="Klik slot starting XI lalu pilih pemain cadangan. Susunan ini langsung dipakai saat MAIN PEKAN.">
    <div className="formationButtons">{Object.keys(FORMATIONS).map((f) => <button key={f} className={formation === f ? "active" : ""} onClick={() => { setFormation(f); setSelectedSlot(0); }}>{f}</button>)}</div>
    <div className="tacticsGrid pro">
      <Card><MiniPitch formation={formation} lineup={lineup} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} /></Card>
      <Card><div className="cardTop"><h3>Starting XI</h3><button className="ghost" onClick={clearManual}>Auto XI</button></div><div className="lineupList editable">{lineup.map(({ player, slot, manual }, idx) => <button key={`${slot.pos}-${player.id}-${idx}`} className={idx === selectedSlot ? "active" : ""} onClick={() => setSelectedSlot(idx)}><b>{slot.pos}</b><span>{player.name}</span><small>{manual ? "Manual" : player.trait}</small><strong>{player.overall}</strong></button>)}</div></Card>
      <Card><h3>Cadangan untuk {selected?.slot.pos}</h3><p className="muted">Pilih pengganti. Pemain cedera/sanksi otomatis tidak masuk daftar.</p><div className="benchList">{bench.slice(0, 18).map((p) => <button key={p.id} onClick={() => changePlayer(p.id)}><b>{p.pos}</b><span>{p.name}</span><small>{traitText(p.trait)} · {p.personality}</small><strong>{p.overall}</strong></button>)}</div></Card>
    </div>
  </Section>;
}
function MiniPitch({ formation, lineup, selectedSlot = -1, setSelectedSlot = () => {} }) { const slots = lineForFormation(formation); return <div className="miniPitch">{slots.map((slot, i) => <button key={`${slot.pos}-${i}`} className={selectedSlot === i ? "active" : ""} onClick={() => setSelectedSlot(i)} style={{ left: `${(slot.x / (BOARD_COLS - 1)) * 100}%`, top: `${(slot.y / (BOARD_ROWS - 1)) * 100}%` }}><b>{lineup[i]?.player.overall || "?"}</b><span>{slot.pos}</span><small>{lineup[i]?.player.name.split(" ")[0]}</small></button>)}</div>; }
function ScheduleTab({ fixtures, teams, week, log }) { return <Section title="Jadwal & Hasil" sub={`Pekan ${week} dari ${SEASON_FIXTURES.length}`}><Card><h3>Pekan ini</h3><div className="fixtureList">{fixtures.map((f) => { const h = teams.find((t) => t.id === f.homeId); const a = teams.find((t) => t.id === f.awayId); const mine = f.homeId === MY_TEAM_ID || f.awayId === MY_TEAM_ID; const derby = h.rivalId === a.id; return <div key={`${f.homeId}-${f.awayId}`} className={mine ? "mine" : derby ? "derby" : ""}><b>{h.name}</b><span>vs</span><b>{a.name}</b>{mine && <small>{f.homeId === MY_TEAM_ID ? "Kandang: pemasukan aktif" : "Tandang: tanpa tiket"}</small>}{derby && <small>🔥 Derby</small>}</div>; })}</div></Card><Card><h3>Hasil terakhir</h3>{log.length === 0 ? <p className="muted">Belum ada hasil.</p> : <div className="resultList">{log.map((m, i) => <ResultRow key={`${m.week}-${m.homeId}-${m.awayId}-${i}`} m={m} />)}</div>}</Card></Section>; }
function ResultRow({ m }) { const mine = m.homeId === MY_TEAM_ID || m.awayId === MY_TEAM_ID; return <div className={`resultRow ${mine ? "mine" : ""}`}><small>Pekan {m.week}{m.derby ? " · Derby" : ""}</small><b>{m.home}</b><strong>{m.homeGoals} - {m.awayGoals}</strong><b>{m.away}</b>{m.events?.length > 0 && <p>{m.events.filter((e) => e.type === "goal").map((e) => `⚽ ${e.min}' ${e.player}`).join(" · ")}</p>}</div>; }
function TableTab({ teams }) { return <Section title="Klasemen" sub="Liga Indonesia Virtual · 48 klub"><Card className="tableWrap"><div className="table"><div className="thead"><span>#</span><span>Tim</span><span>P</span><span>M</span><span>S</span><span>K</span><span>GD</span><span>PTS</span></div>{teams.map((t, i) => { const p = t.wins + t.draws + t.losses; const gd = t.gf - t.ga; return <div className={`tr ${t.id === MY_TEAM_ID ? "mine" : ""}`} key={t.id}><span>{i + 1}</span><span><b>{t.name}</b><small>{t.style} · {(t.form || []).join(" ")}</small></span><span>{p}</span><span>{t.wins}</span><span>{t.draws}</span><span>{t.losses}</span><span>{gd > 0 ? `+${gd}` : gd}</span><strong>{t.pts}</strong></div>; })}</div></Card></Section>; }
function TransferTab({ market, cash, buy, loan, scout, scoutQueue, scoutUsed, scoutLimit }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? market : market.filter((p) => p.pos === filter);
  return <Section title="Transfer & Scout" sub={`Kas: ${money(cash)}. Scout tertunda 1 match. Slot scout fase ini: ${scoutUsed}/${scoutLimit}. Wonderkid report benar-benar langka ±5%.`}>
    <div className="scoutQueue">{scoutQueue.length ? scoutQueue.map((q) => <span key={q.id}>🔎 {q.name}: selesai setelah match</span>) : <span>Belum ada scout berjalan.</span>}</div>
    <div className="formationButtons">{["ALL", ...EXTRA_POSITIONS].filter((v, i, a) => a.indexOf(v) === i).map((p) => <button key={p} className={filter === p ? "active" : ""} onClick={() => setFilter(p)}>{p}</button>)}</div>
    <div className="playerGrid">{filtered.map((p) => <div key={p.id} className={`transferCard ${p.scoutStatus === "pending" ? "pending" : ""} ${p.scoutStatus === "gem" ? "gem" : ""}`}><PlayerCard player={p} active={false} onClick={() => scout(p)} /><div className="scoutBadge">{p.scoutStatus === "pending" ? "🔎 Scout berjalan" : p.scouted ? (p.rarePotential ? "🌟 Rare potential" : "📋 Scout normal") : "POT ??"}</div><div className="transferActions"><button className="ghost" disabled={p.scouted || p.scoutStatus === "pending" || scoutUsed >= scoutLimit} onClick={() => scout(p)}>Scout</button><button disabled={cash < Math.round(p.value * 0.14)} onClick={() => loan(p)}>Loan {money(Math.round(p.value * 0.14))}</button><button disabled={cash < p.value} onClick={() => buy(p)}>Buy {money(p.value)}</button></div></div>)}</div>
  </Section>;
}
function CareerTab({ manager, saveNow, exportSave, loadNow, resetSave, importSaveFile }) {
  return <Section title="Career Mode" sub="Save tidak otomatis. Kalau tidak pernah Save Manual atau import file, refresh akan mulai fresh dari kas 0.">
    <div className="cardsGrid">
      <Card><h3>Manager</h3><div className="infoGrid"><span>Nama</span><b>{manager.name}</b><span>Reputasi</span><b>Lv {manager.reputation}</b><span>Board Trust</span><b>{manager.boardTrust}%</b><span>Fans Trust</span><b>{manager.fanTrust}%</b></div></Card>
      <Card><h3>Save Game</h3><p className="muted">Save Manual menyimpan ke browser. Download Save membuat file JSON yang bisa kamu simpan dan load lagi di device lain.</p><div className="saveButtons"><button className="primary" onClick={saveNow}>Save ke Browser</button><button className="primary" onClick={exportSave}>Download Save JSON</button><button className="ghost" onClick={loadNow}>Load Browser Save</button><label className="fileButton">Load File Save<input type="file" accept="application/json,.json" onChange={(e) => importSaveFile(e.target.files?.[0])} /></label><button className="danger" onClick={resetSave}>Hapus Save Browser</button></div></Card>
      <Card><h3>Kontrak Manager</h3><p>Board akan menilai hasil, gaya main, target season, dan derby. Jika trust rendah, tekanan naik.</p><ProgressLine label="Board" value={manager.boardTrust} target={100} /><ProgressLine label="Fans" value={manager.fanTrust} target={100} /></Card>
    </div>
  </Section>;
}
function YouthTab({ team, facilities }) {
  const youths = team.players.filter((p) => p.age <= 21).sort((a, b) => (b.potential - b.overall) - (a.potential - a.overall)).slice(0, 12);
  return <Section title="Youth Academy & Growth" sub={`Akademi Lv ${facilities.academy}. Pemain muda berkembang lewat latihan, match, goal, dan personality.`}>
    <div className="playerGrid">{youths.map((p) => <PlayerCard key={p.id} player={p} active={false} onClick={() => {}} />)}</div>
  </Section>;
}
function StoryTab({ storyLog, answerStory }) {
  return <Section title="Story Event" sub="Event muncul tiap beberapa match/derby. Pilihan kecil ini mengubah trust, fans, dan arah career.">
    {storyLog.length === 0 ? <Card className="empty"><h3>Belum ada story event</h3><p className="muted">Mainkan beberapa pekan untuk memicu media, fans, sponsor, atau drama skuad.</p></Card> : <div className="cardsGrid">{storyLog.map((e) => <Card key={e.id}><h3>{e.title}</h3><p className="muted">Pekan {e.week}{e.choice ? ` · Pilihan: ${e.choice}` : ""}</p>{e.choice ? <b>Efek: {e.effect}</b> : <div className="choiceList">{e.choices.map((c) => <button key={c} onClick={() => answerStory(e.id, c)}>{c}</button>)}</div>}</Card>)}</div>}
  </Section>;
}
function GoalOverlay({ game, onResume }) {
  const pause = game.goalPause;
  if (!pause) return null;
  return <div className="goalOverlay"><div><strong>GOOOAL!</strong><h3>{game.homeName} {pause.score.home} - {pause.score.away} {game.awayName}</h3><p>{pause.text}</p><small>Restart: bola untuk tim yang kebobolan ({sideLabel(pause.restartSide)}). Klik lanjut saat siap.</small><button className="primary" onClick={onResume}>Lanjut Kick Off</button></div></div>;
}

function FacilitiesTab({ facilities, cash, upgrade }) { return <Section title="Fasilitas & Ekonomi" sub={`Kas: ${money(cash)}. Uang utama datang dari laga HOME. Upgrade membuat pemasukan dan perkembangan lebih besar.`}><div className="cardsGrid">{Object.entries(FACILITY_DEF).map(([key, def]) => { const level = facilities[key]; const cost = Math.round(def.baseCost * Math.pow(1.65, level - 1)); return <Card key={key}><h3>{def.icon} {def.label}</h3><p>{def.desc}</p><div className="facilityLevel">Level {level}/5</div><button disabled={level >= 5 || cash < cost} onClick={() => upgrade(key)}>{level >= 5 ? "Maks" : `Upgrade ${money(cost)}`}</button></Card>; })}</div></Section>; }
function ObjectivesTab({ objectives, ctx, claimed }) { return <Section title="Objective & Story Season" sub="Target manajemen memberi arah musim dan bonus kas saat selesai."><div className="cardsGrid">{objectives.map((o) => { const val = objectiveProgress(o, ctx); const done = claimed.includes(o.key) || objectiveComplete(o, ctx); return <Card key={o.key} className={done ? "done" : ""}><h3>{done ? "✅" : "🎯"} {o.title}</h3><p>{o.desc}</p><ProgressLine label="Progress" value={val} target={o.target} done={claimed.includes(o.key)} /><b>Reward: {money(o.reward)}</b></Card>; })}</div></Section>; }
function ClubsTab({ teams }) { return <Section title="Klub" sub="48 klub, masing-masing punya style AI. Gerakan AI dibuat random-terarah, jadi tidak selalu bisa ditebak."><div className="clubGrid">{teams.map((t) => <Card key={t.id} style={{ borderTop: `4px solid ${t.color}` }}><h3>{t.name}</h3><p className="muted">{t.city}</p><div className="infoGrid"><span>Power</span><b>{Math.round(teamPower(t))}</b><span>Fans</span><b>{t.fans.toLocaleString("id-ID")}</b><span>Pemain</span><b>{t.players.length}</b><span>AI Style</span><b>{t.style}</b><span>Formasi</span><b>{t.preferredFormation}</b></div></Card>)}</div></Section>; }
