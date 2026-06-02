import React, { useCallback, useEffect, useMemo, useState } from "react";

// ── DATA LIGA ────────────────────────────────────────────────────────────────
const CLUBS = [
  { id: 1, name: "FC Nusantara", city: "Jakarta", color: "#e63946", bg: "#1d3557", fans: 52000 },
  { id: 2, name: "Garuda FC", city: "Surabaya", color: "#f4a261", bg: "#264653", fans: 48000 },
  { id: 3, name: "Elang Merah", city: "Bandung", color: "#2a9d8f", bg: "#1a1a2e", fans: 41000 },
  { id: 4, name: "Rajawali SC", city: "Medan", color: "#e9c46a", bg: "#16213e", fans: 39000 },
  { id: 5, name: "Badak United", city: "Semarang", color: "#a8dadc", bg: "#0f3460", fans: 31000 },
  { id: 6, name: "Macan Selatan", city: "Yogyakarta", color: "#ffb703", bg: "#081c15", fans: 35000 },
  { id: 7, name: "Krakatau City", city: "Cilegon", color: "#fb8500", bg: "#1b263b", fans: 28000 },
  { id: 8, name: "Borneo Rovers", city: "Samarinda", color: "#90be6d", bg: "#14213d", fans: 33000 },
  { id: 9, name: "Papua Star", city: "Jayapura", color: "#43aa8b", bg: "#081c15", fans: 30000 },
  { id: 10, name: "Malaka Warriors", city: "Banda Aceh", color: "#577590", bg: "#111827", fans: 27000 },
  { id: 11, name: "Celebes United", city: "Makassar", color: "#f94144", bg: "#0b132b", fans: 37000 },
  { id: 12, name: "Bali Phoenix", city: "Denpasar", color: "#f3722c", bg: "#27187e", fans: 36000 },
  { id: 13, name: "Komodo Athletic", city: "Kupang", color: "#9b5de5", bg: "#1a1a2e", fans: 26000 },
  { id: 14, name: "Sumatra Thunder", city: "Palembang", color: "#00bbf9", bg: "#001219", fans: 34000 },
  { id: 15, name: "Tugu Muda FC", city: "Solo", color: "#fee440", bg: "#0f172a", fans: 29000 },
  { id: 16, name: "Khatulistiwa FC", city: "Pontianak", color: "#00f5d4", bg: "#073b4c", fans: 32000 },
];

const POSITIONS = ["GK", "CB", "CB", "LB", "RB", "CDM", "CM", "CM", "CAM", "LW", "RW", "ST"];
const EXTRA_POSITIONS = ["GK", "CB", "CB", "LB", "RB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "ST", "ST"];
const POS_LABELS = {
  GK: "Kiper", CB: "Bek Tengah", LB: "Bek Kiri", RB: "Bek Kanan", CDM: "Gelandang Bertahan",
  CM: "Gelandang", CAM: "Gelandang Serang", LM: "Sayap Kiri", RM: "Sayap Kanan", LW: "Winger Kiri", RW: "Winger Kanan", ST: "Striker",
};
const FIRST_NAMES = ["Arya","Bima","Candra","Dani","Eko","Fajar","Galih","Hendra","Ilham","Joko","Kevin","Luthfi","Mirza","Nanda","Oki","Putra","Rafi","Sandi","Tama","Udin","Wahyu","Yogi","Zaki","Andre","Bayu","Rangga","Dimas","Iqbal","Rizky","Aditya","Farhan","Bagas","Reza","Daffa","Agus","Rian","Aldo","Gilang","Yoga","Alif"];
const LAST_NAMES = ["Pratama","Santoso","Wijaya","Kusuma","Ramadhan","Hidayat","Nugraha","Setiawan","Firmansyah","Wibowo","Susanto","Suryadi","Hartono","Handoko","Purnomo","Gunawan","Kurniawan","Saputra","Mahendra","Perdana","Pamungkas","Siregar","Nasution","Lubis","Manurung","Tanjung","Latuconsina","Wanggai","Rumakiek","Sulaeman"];

function rng(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[rng(0, arr.length - 1)]; }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function money(n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }
function genName() { return pick(FIRST_NAMES) + " " + pick(LAST_NAMES); }

let pid = 1;
function genPlayer(pos, teamId = null, tier = 0) {
  const base = rng(52 + tier, 78 + tier);
  const overall = clamp(base + (pos === "ST" || pos === "CAM" ? rng(-2, 4) : rng(-3, 3)), 45, 93);
  const attackBias = ["ST", "LW", "RW", "CAM", "LM", "RM"].includes(pos) ? 10 : 0;
  const defendBias = ["GK", "CB", "LB", "RB", "CDM"].includes(pos) ? 10 : 0;
  const passBias = ["CM", "CDM", "CAM"].includes(pos) ? 10 : 0;
  return {
    id: pid++, name: genName(), pos, age: rng(17, 35), overall,
    pace: clamp(rng(42, 88) + (pos === "LW" || pos === "RW" || pos === "ST" ? 8 : 0), 35, 99),
    shoot: clamp(rng(35, 78) + attackBias, 25, 99),
    pass: clamp(rng(38, 80) + passBias, 30, 99),
    dribble: clamp(rng(38, 82) + attackBias, 30, 99),
    defend: clamp(rng(30, 78) + defendBias, 25, 99),
    value: Math.round(overall * overall * rng(9, 22)),
    wage: rng(5, 80) * 100,
    teamId,
    morale: "Good",
    contract: rng(1, 5),
  };
}

function buildLeague() {
  const teams = CLUBS.map((club, index) => ({
    ...club,
    players: [], wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0, form: [],
    preferredFormation: pick(["4-3-3", "4-2-3-1", "4-4-2", "3-5-2", "4-1-4-1"]),
    ratingTier: Math.max(0, 8 - Math.floor(index / 2)),
  }));
  teams.forEach((team) => {
    POSITIONS.forEach((pos) => team.players.push(genPlayer(pos, team.id, team.ratingTier)));
    for (let i = 0; i < 11; i += 1) team.players.push(genPlayer(pick(EXTRA_POSITIONS), team.id, team.ratingTier - 1));
  });
  return teams;
}

const initialTeams = buildLeague();
const MY_TEAM_ID = 1;

function buildFixtures(teamIds) {
  const ids = [...teamIds];
  if (ids.length % 2) ids.push(null);
  const rounds = [];
  const list = [...ids];
  const n = list.length;
  for (let round = 0; round < n - 1; round += 1) {
    const fixtures = [];
    for (let i = 0; i < n / 2; i += 1) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) {
        const flip = round % 2 === 1;
        fixtures.push({ homeId: flip ? b : a, awayId: flip ? a : b });
      }
    }
    rounds.push(fixtures);
    list.splice(1, 0, list.pop());
  }
  const secondLeg = rounds.map((week) => week.map((m) => ({ homeId: m.awayId, awayId: m.homeId })));
  return [...rounds, ...secondLeg];
}

const SEASON_FIXTURES = buildFixtures(CLUBS.map((c) => c.id));

// ── FORMASI ──────────────────────────────────────────────────────────────────
const BOARD_ROWS = 11;
const BOARD_COLS = 7;
const GOAL_COLS = [2, 3, 4];
const MAX_TURNS = 24;

const FORMATIONS = {
  "4-3-3": [
    { pos: "GK", x: 3, y: 10 }, { pos: "LB", x: 0, y: 8 }, { pos: "CB", x: 2, y: 8 }, { pos: "CB", x: 4, y: 8 }, { pos: "RB", x: 6, y: 8 },
    { pos: "CM", x: 2, y: 6 }, { pos: "CDM", x: 3, y: 7 }, { pos: "CM", x: 4, y: 6 },
    { pos: "LW", x: 1, y: 4 }, { pos: "ST", x: 3, y: 3 }, { pos: "RW", x: 5, y: 4 },
  ],
  "4-2-3-1": [
    { pos: "GK", x: 3, y: 10 }, { pos: "LB", x: 0, y: 8 }, { pos: "CB", x: 2, y: 8 }, { pos: "CB", x: 4, y: 8 }, { pos: "RB", x: 6, y: 8 },
    { pos: "CDM", x: 2, y: 7 }, { pos: "CDM", x: 4, y: 7 }, { pos: "LW", x: 1, y: 5 }, { pos: "CAM", x: 3, y: 5 }, { pos: "RW", x: 5, y: 5 }, { pos: "ST", x: 3, y: 3 },
  ],
  "4-4-2": [
    { pos: "GK", x: 3, y: 10 }, { pos: "LB", x: 0, y: 8 }, { pos: "CB", x: 2, y: 8 }, { pos: "CB", x: 4, y: 8 }, { pos: "RB", x: 6, y: 8 },
    { pos: "LM", x: 0, y: 6 }, { pos: "CM", x: 2, y: 6 }, { pos: "CM", x: 4, y: 6 }, { pos: "RM", x: 6, y: 6 }, { pos: "ST", x: 2, y: 3 }, { pos: "ST", x: 4, y: 3 },
  ],
  "3-5-2": [
    { pos: "GK", x: 3, y: 10 }, { pos: "CB", x: 1, y: 8 }, { pos: "CB", x: 3, y: 8 }, { pos: "CB", x: 5, y: 8 },
    { pos: "LM", x: 0, y: 6 }, { pos: "CM", x: 2, y: 6 }, { pos: "CDM", x: 3, y: 7 }, { pos: "CM", x: 4, y: 6 }, { pos: "RM", x: 6, y: 6 }, { pos: "ST", x: 2, y: 3 }, { pos: "ST", x: 4, y: 3 },
  ],
  "5-3-2": [
    { pos: "GK", x: 3, y: 10 }, { pos: "LB", x: 0, y: 8 }, { pos: "CB", x: 1, y: 8 }, { pos: "CB", x: 3, y: 8 }, { pos: "CB", x: 5, y: 8 }, { pos: "RB", x: 6, y: 8 },
    { pos: "CM", x: 2, y: 6 }, { pos: "CDM", x: 3, y: 7 }, { pos: "CM", x: 4, y: 6 }, { pos: "ST", x: 2, y: 3 }, { pos: "ST", x: 4, y: 3 },
  ],
  "3-4-3": [
    { pos: "GK", x: 3, y: 10 }, { pos: "CB", x: 1, y: 8 }, { pos: "CB", x: 3, y: 8 }, { pos: "CB", x: 5, y: 8 },
    { pos: "LM", x: 0, y: 6 }, { pos: "CM", x: 2, y: 6 }, { pos: "CM", x: 4, y: 6 }, { pos: "RM", x: 6, y: 6 }, { pos: "LW", x: 1, y: 4 }, { pos: "ST", x: 3, y: 3 }, { pos: "RW", x: 5, y: 4 },
  ],
  "4-1-4-1": [
    { pos: "GK", x: 3, y: 10 }, { pos: "LB", x: 0, y: 8 }, { pos: "CB", x: 2, y: 8 }, { pos: "CB", x: 4, y: 8 }, { pos: "RB", x: 6, y: 8 },
    { pos: "CDM", x: 3, y: 7 }, { pos: "LM", x: 0, y: 5 }, { pos: "CM", x: 2, y: 5 }, { pos: "CM", x: 4, y: 5 }, { pos: "RM", x: 6, y: 5 }, { pos: "ST", x: 3, y: 3 },
  ],
  "4-3-1-2": [
    { pos: "GK", x: 3, y: 10 }, { pos: "LB", x: 0, y: 8 }, { pos: "CB", x: 2, y: 8 }, { pos: "CB", x: 4, y: 8 }, { pos: "RB", x: 6, y: 8 },
    { pos: "CM", x: 1, y: 6 }, { pos: "CDM", x: 3, y: 7 }, { pos: "CM", x: 5, y: 6 }, { pos: "CAM", x: 3, y: 5 }, { pos: "ST", x: 2, y: 3 }, { pos: "ST", x: 4, y: 3 },
  ],
  "4-5-1": [
    { pos: "GK", x: 3, y: 10 }, { pos: "LB", x: 0, y: 8 }, { pos: "CB", x: 2, y: 8 }, { pos: "CB", x: 4, y: 8 }, { pos: "RB", x: 6, y: 8 },
    { pos: "LM", x: 0, y: 6 }, { pos: "CM", x: 2, y: 6 }, { pos: "CDM", x: 3, y: 7 }, { pos: "CM", x: 4, y: 6 }, { pos: "RM", x: 6, y: 6 }, { pos: "ST", x: 3, y: 3 },
  ],
};

const COMPATIBLE = {
  GK: ["GK"], CB: ["CB", "LB", "RB", "CDM"], LB: ["LB", "CB", "LM"], RB: ["RB", "CB", "RM"],
  CDM: ["CDM", "CM", "CB"], CM: ["CM", "CDM", "CAM", "LM", "RM"], CAM: ["CAM", "CM", "ST", "LW", "RW"],
  LM: ["LM", "LW", "CM", "LB"], RM: ["RM", "RW", "CM", "RB"], LW: ["LW", "LM", "RW", "ST"], RW: ["RW", "RM", "LW", "ST"], ST: ["ST", "CAM", "LW", "RW"],
};

function roleMove(pos) { return pos === "GK" ? 1 : ["ST", "LW", "RW", "LM", "RM"].includes(pos) ? 3 : 2; }
function rolePass(pos, p) { return pos === "GK" ? 3 : clamp(Math.round(p.pass / 18), 3, 6); }
function roleShot(pos, p) { return pos === "GK" ? 0 : clamp(Math.round(p.shoot / 20), 2, 5); }
function boardName(x, y) { return `${String.fromCharCode(65 + x)}${BOARD_ROWS - y}`; }
function sideName(side) { return side === "home" ? "Home" : "Away"; }
function otherSide(side) { return side === "home" ? "away" : "home"; }
function attackGoalRow(side) { return side === "home" ? 0 : BOARD_ROWS - 1; }
function goalDistance(piece) { return piece.side === "home" ? piece.y : BOARD_ROWS - 1 - piece.y; }
function mirrorSpot(spot) { return { ...spot, y: BOARD_ROWS - 1 - spot.y }; }
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

function pickLineup(team, formationName) {
  const formation = FORMATIONS[formationName] || FORMATIONS["4-3-3"];
  const used = new Set();
  return formation.map((slot) => {
    const compatible = COMPATIBLE[slot.pos] || [slot.pos];
    let candidates = team.players.filter((p) => !used.has(p.id) && compatible.includes(p.pos));
    if (candidates.length === 0) candidates = team.players.filter((p) => !used.has(p.id));
    const best = [...candidates].sort((a, b) => {
      const exactA = a.pos === slot.pos ? 8 : 0;
      const exactB = b.pos === slot.pos ? 8 : 0;
      return (b.overall + exactB) - (a.overall + exactA);
    })[0];
    used.add(best.id);
    return { player: best, slot };
  });
}

function makePieces(team, side, formationName) {
  return pickLineup(team, formationName).map(({ player, slot }) => {
    const spot = side === "home" ? slot : mirrorSpot(slot);
    return {
      id: `${side}-${player.id}`,
      playerId: player.id,
      teamId: team.id,
      teamName: team.name,
      side,
      role: slot.pos,
      x: spot.x,
      y: spot.y,
      name: player.name,
      overall: player.overall,
      pace: player.pace,
      shoot: player.shoot,
      pass: player.pass,
      dribble: player.dribble,
      defend: player.defend,
    };
  });
}

function findKickoffPlayer(pieces, side) {
  return pieces.filter((p) => p.side === side).sort((a, b) => goalDistance(a) - goalDistance(b) || b.overall - a.overall)[0]?.id;
}

function createPlayableMatch({ homeTeam, awayTeam, userSide, userFormation, awayFormation, homeFormation }) {
  const hForm = homeTeam.id === MY_TEAM_ID ? userFormation : homeFormation || homeTeam.preferredFormation || "4-3-3";
  const aForm = awayTeam.id === MY_TEAM_ID ? userFormation : awayFormation || awayTeam.preferredFormation || "4-3-3";
  const pieces = [...makePieces(homeTeam, "home", hForm), ...makePieces(awayTeam, "away", aForm)];
  const kickoff = findKickoffPlayer(pieces, "home");
  return {
    homeId: homeTeam.id,
    awayId: awayTeam.id,
    homeName: homeTeam.name,
    awayName: awayTeam.name,
    homeFormation: hForm,
    awayFormation: aForm,
    userSide,
    pieces,
    ballOwnerId: kickoff,
    turn: "home",
    score: { home: 0, away: 0 },
    turnNo: 1,
    maxTurns: MAX_TURNS,
    ended: false,
    winner: null,
    lastAction: `Kick off ${homeTeam.name}. Pilih pemain Home yang pegang bola.`,
    events: [],
    history: [{ minute: 1, text: `Kick off ${homeTeam.name}.` }],
  };
}

function getPiece(game, id) { return game.pieces.find((p) => p.id === id) || null; }
function pieceAt(game, x, y) { return game.pieces.find((p) => p.x === x && p.y === y) || null; }
function distance(a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); }
function currentMinute(game) { return Math.min(90, 1 + Math.floor((game.turnNo - 1) * (89 / game.maxTurns))); }
function pressureAt(game, side, x, y) { return game.pieces.filter((p) => p.side !== side && distance(p, { x, y }) <= 1).length; }
function supportAt(game, side, x, y) { return game.pieces.filter((p) => p.side === side && distance(p, { x, y }) <= 1).length; }
function appendMatchHistory(game, text, event = null) {
  const minute = currentMinute(game);
  game.history = [{ minute, text }, ...(game.history || [])].slice(0, 40);
  if (event) game.events = [...(game.events || []), { ...event, min: minute }];
}

function finishIfFullTime(game) {
  if (game.turnNo > game.maxTurns) {
    game.ended = true;
    game.winner = game.score.home > game.score.away ? "home" : game.score.away > game.score.home ? "away" : "draw";
    game.lastAction = `Full time: ${game.homeName} ${game.score.home}-${game.score.away} ${game.awayName}.`;
    appendMatchHistory(game, game.lastAction);
    return true;
  }
  return false;
}

function endTurn(game) {
  game.turnNo += 1;
  if (!finishIfFullTime(game)) game.turn = otherSide(game.turn);
}

function advanceClockKeepTurn(game) {
  game.turnNo += 1;
  finishIfFullTime(game);
}

function resetAfterGoal(game, scorerSide) {
  const homeTeam = { id: game.homeId, name: game.homeName, preferredFormation: game.homeFormation, players: game.pieces.filter((p) => p.side === "home").map((p) => ({ ...p, id: p.playerId, pos: p.role })) };
  const awayTeam = { id: game.awayId, name: game.awayName, preferredFormation: game.awayFormation, players: game.pieces.filter((p) => p.side === "away").map((p) => ({ ...p, id: p.playerId, pos: p.role })) };
  // Use existing pieces but reset coordinates by current formations, preserving stats.
  const homeFormation = FORMATIONS[game.homeFormation] || FORMATIONS["4-3-3"];
  const awayFormation = FORMATIONS[game.awayFormation] || FORMATIONS["4-3-3"];
  const oldByPlayer = new Map(game.pieces.map((p) => [`${p.side}-${p.playerId}`, p]));
  const resetHome = homeFormation.map((slot, i) => ({ ...oldByPlayer.get(`home-${homeTeam.players[i]?.id}`), x: slot.x, y: slot.y }));
  const resetAway = awayFormation.map((slot, i) => ({ ...oldByPlayer.get(`away-${awayTeam.players[i]?.id}`), x: slot.x, y: mirrorSpot(slot).y }));
  if (resetHome.every(Boolean) && resetAway.every(Boolean)) game.pieces = [...resetHome, ...resetAway];
  const restartSide = otherSide(scorerSide);
  game.ballOwnerId = findKickoffPlayer(game.pieces, restartSide);
  game.turn = restartSide;
}

function legalMoves(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ended || piece.side !== game.turn) return [];
  const range = roleMove(piece.role) + (piece.pace >= 85 ? 1 : 0);
  const cells = [];
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      if (x === piece.x && y === piece.y) continue;
      if (pieceAt(game, x, y)) continue;
      if (distance(piece, { x, y }) <= range) cells.push({ x, y });
    }
  }
  return cells;
}

function legalPasses(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ended || piece.side !== game.turn || game.ballOwnerId !== piece.id) return [];
  const range = rolePass(piece.role, piece);
  return game.pieces.filter((p) => p.side === piece.side && p.id !== piece.id && distance(piece, p) <= range);
}

function legalTackles(game, pieceId) {
  const piece = getPiece(game, pieceId);
  const carrier = getPiece(game, game.ballOwnerId);
  if (!piece || !carrier || game.ended || piece.side !== game.turn || piece.side === carrier.side) return [];
  return distance(piece, carrier) <= 1 ? [carrier] : [];
}

function shotInfo(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ended || piece.side !== game.turn || game.ballOwnerId !== piece.id || piece.role === "GK") return { can: false, chance: 0, label: "Tidak bisa tembak" };
  const d = goalDistance(piece);
  const centerBonus = GOAL_COLS.includes(piece.x) ? 10 : piece.x === 1 || piece.x === 5 ? 4 : -6;
  const pressure = pressureAt(game, piece.side, piece.x, piece.y);
  const keeper = game.pieces.find((p) => p.side !== piece.side && p.role === "GK");
  const keeperRating = keeper ? keeper.overall * 0.38 : 25;
  const maxRange = roleShot(piece.role, piece) + (piece.shoot >= 82 ? 1 : 0);
  const chance = clamp(18 + piece.shoot * 0.65 + centerBonus - d * 8 - pressure * 11 - keeperRating * 0.45, 8, 88);
  return {
    can: d <= maxRange,
    chance: Math.round(chance),
    label: chance >= 60 ? "Peluang besar" : chance >= 38 ? "Peluang sedang" : "Peluang sulit",
  };
}

function interceptTarget(game, target) {
  return game.pieces
    .filter((p) => p.side !== target.side)
    .map((p) => ({ p, d: distance(p, target) }))
    .sort((a, b) => a.d - b.d || b.p.defend - a.p.defend)[0]?.p || null;
}

function applyMatchAction(game, action) {
  const next = clone(game);
  if (next.ended) return next;
  const piece = getPiece(next, action.pieceId);
  if (!piece || piece.side !== next.turn) return next;

  if (action.type === "move") {
    const ok = legalMoves(next, piece.id).some((c) => c.x === action.x && c.y === action.y);
    if (!ok) return next;
    piece.x = action.x;
    piece.y = action.y;
    const text = `${sideName(piece.side)}: ${piece.name.split(" ")[0]} (${piece.role}) bergerak ke ${boardName(action.x, action.y)}.`;
    next.lastAction = text;
    appendMatchHistory(next, text);
    endTurn(next);
    return next;
  }

  if (action.type === "pass") {
    const target = getPiece(next, action.targetId);
    const ok = target && legalPasses(next, piece.id).some((p) => p.id === target.id);
    if (!ok) return next;
    const dist = distance(piece, target);
    const press = pressureAt(next, piece.side, piece.x, piece.y) + pressureAt(next, target.side, target.x, target.y);
    const chance = clamp(78 + piece.pass * 0.35 - dist * 5 - press * 9, 28, 96);
    if (Math.random() * 100 <= chance) {
      next.ballOwnerId = target.id;
      const text = `${sideName(piece.side)}: umpan ${piece.name.split(" ")[0]} ke ${target.name.split(" ")[0]} (${Math.round(chance)}%).`;
      next.lastAction = text;
      appendMatchHistory(next, text);
    } else {
      const enemy = interceptTarget(next, target);
      if (enemy) next.ballOwnerId = enemy.id;
      const text = `${sideName(piece.side)}: umpan dipotong ${enemy ? enemy.name.split(" ")[0] : "lawan"}.`;
      next.lastAction = text;
      appendMatchHistory(next, text);
    }
    endTurn(next);
    return next;
  }

  if (action.type === "tackle") {
    const carrier = getPiece(next, action.targetId);
    const ok = carrier && legalTackles(next, piece.id).some((p) => p.id === carrier.id);
    if (!ok) return next;
    const chance = clamp(48 + (piece.defend - carrier.dribble) * 0.55 + supportAt(next, piece.side, carrier.x, carrier.y) * 5, 18, 86);
    if (Math.random() * 100 <= chance) {
      next.ballOwnerId = piece.id;
      const text = `${sideName(piece.side)}: ${piece.name.split(" ")[0]} sukses merebut bola (${Math.round(chance)}%).`;
      next.lastAction = text;
      appendMatchHistory(next, text);
    } else {
      const text = `${sideName(piece.side)}: tackle gagal, ${carrier.name.split(" ")[0]} masih pegang bola.`;
      next.lastAction = text;
      appendMatchHistory(next, text);
    }
    endTurn(next);
    return next;
  }

  if (action.type === "shoot") {
    const info = shotInfo(next, piece.id);
    if (!info.can) return next;
    if (Math.random() * 100 <= info.chance) {
      next.score[piece.side] += 1;
      const text = `GOOOL! ${piece.teamName} mencetak gol lewat ${piece.name} (${info.chance}%).`;
      next.lastAction = text;
      appendMatchHistory(next, text, { type: "goal", team: piece.teamName, player: piece.name, side: piece.side });
      resetAfterGoal(next, piece.side);
      advanceClockKeepTurn(next);
    } else {
      const keeper = next.pieces.find((p) => p.side !== piece.side && p.role === "GK");
      if (keeper) next.ballOwnerId = keeper.id;
      const text = `${piece.name.split(" ")[0]} menembak, tapi ${keeper ? keeper.name.split(" ")[0] : "kiper"} menyelamatkan (${info.chance}%).`;
      next.lastAction = text;
      appendMatchHistory(next, text);
      endTurn(next);
    }
    return next;
  }
  return next;
}

function scoreMoveForAi(piece, cell, game) {
  const carrier = getPiece(game, game.ballOwnerId);
  const forward = goalDistance(piece) - (piece.side === "home" ? cell.y : BOARD_ROWS - 1 - cell.y);
  const center = -Math.abs(cell.x - 3) * 0.4;
  const pressurePenalty = pressureAt(game, piece.side, cell.x, cell.y) * -1.2;
  const chase = carrier && carrier.side !== piece.side ? -distance(cell, carrier) : 0;
  const hasBall = game.ballOwnerId === piece.id ? 4 : 0;
  return forward * 2.4 + center + pressurePenalty + chase + hasBall;
}

function chooseAiAction(game, side) {
  if (game.ended || game.turn !== side) return null;
  const mine = game.pieces.filter((p) => p.side === side);
  const carrier = getPiece(game, game.ballOwnerId);

  for (const p of mine) {
    const tackle = legalTackles(game, p.id)[0];
    if (tackle) return { type: "tackle", pieceId: p.id, targetId: tackle.id };
  }

  if (carrier?.side === side) {
    const shot = shotInfo(game, carrier.id);
    if (shot.can && shot.chance >= 35) return { type: "shoot", pieceId: carrier.id };

    const goodPass = legalPasses(game, carrier.id)
      .map((target) => ({ target, score: goalDistance(carrier) - goalDistance(target) + (target.role === "ST" ? 1.5 : 0) + target.overall / 100 }))
      .filter((x) => x.score > 0.6)
      .sort((a, b) => b.score - a.score)[0];
    if (goodPass) return { type: "pass", pieceId: carrier.id, targetId: goodPass.target.id };

    const move = legalMoves(game, carrier.id)
      .map((cell) => ({ cell, score: scoreMoveForAi(carrier, cell, game) }))
      .sort((a, b) => b.score - a.score)[0];
    if (move) return { type: "move", pieceId: carrier.id, x: move.cell.x, y: move.cell.y };
  }

  const target = carrier?.side !== side ? carrier : null;
  const chase = mine
    .map((p) => {
      const move = legalMoves(game, p.id)
        .map((cell) => ({ cell, d: target ? distance(cell, target) : 99, score: scoreMoveForAi(p, cell, game) }))
        .sort((a, b) => a.d - b.d || b.score - a.score)[0];
      return { p, move };
    })
    .filter((x) => x.move)
    .sort((a, b) => a.move.d - b.move.d)[0];
  return chase ? { type: "move", pieceId: chase.p.id, x: chase.move.cell.x, y: chase.move.cell.y } : null;
}

// ── SIMULASI LIGA ────────────────────────────────────────────────────────────
function teamPower(team) {
  return team.players.slice().sort((a, b) => b.overall - a.overall).slice(0, 11).reduce((s, p) => s + p.overall, 0) / 11;
}

function simulateMatch(homeTeam, awayTeam, weekNo) {
  const homePow = teamPower(homeTeam) + 4;
  const awayPow = teamPower(awayTeam);
  const hBase = Math.max(0, (homePow / Math.max(1, awayPow)) * rng(0, 3) + Math.random() - 0.25);
  const aBase = Math.max(0, (awayPow / Math.max(1, homePow)) * rng(0, 3) + Math.random() - 0.35);
  const homeGoals = clamp(Math.round(hBase), 0, 5);
  const awayGoals = clamp(Math.round(aBase), 0, 5);
  const events = [];
  for (let g = 0; g < homeGoals; g += 1) events.push({ min: rng(3, 89), type: "goal", team: homeTeam.name, player: pick(homeTeam.players.slice(0, 16)).name, side: "home" });
  for (let g = 0; g < awayGoals; g += 1) events.push({ min: rng(3, 89), type: "goal", team: awayTeam.name, player: pick(awayTeam.players.slice(0, 16)).name, side: "away" });
  events.sort((a, b) => a.min - b.min);
  return { week: weekNo, homeId: homeTeam.id, awayId: awayTeam.id, home: homeTeam.name, away: awayTeam.name, homeGoals, awayGoals, events, myMatch: homeTeam.id === MY_TEAM_ID || awayTeam.id === MY_TEAM_ID, played: true };
}

function resultFromPlayable(game, weekNo) {
  return {
    week: weekNo,
    homeId: game.homeId,
    awayId: game.awayId,
    home: game.homeName,
    away: game.awayName,
    homeGoals: game.score.home,
    awayGoals: game.score.away,
    events: game.events || [],
    myMatch: true,
    played: true,
  };
}

function applyResultToTeams(teams, result) {
  return teams.map((team) => {
    if (team.id !== result.homeId && team.id !== result.awayId) return team;
    const isHome = team.id === result.homeId;
    const gf = isHome ? result.homeGoals : result.awayGoals;
    const ga = isHome ? result.awayGoals : result.homeGoals;
    const won = gf > ga;
    const drew = gf === ga;
    return {
      ...team,
      players: [...team.players],
      gf: team.gf + gf,
      ga: team.ga + ga,
      wins: team.wins + (won ? 1 : 0),
      draws: team.draws + (drew ? 1 : 0),
      losses: team.losses + (!won && !drew ? 1 : 0),
      pts: team.pts + (won ? 3 : drew ? 1 : 0),
      form: [...(team.form || []).slice(-4), won ? "W" : drew ? "D" : "L"],
    };
  });
}

function calculateHomeIncome(team, result, rank) {
  const base = Math.round(team.fans * 1.35);
  const hype = Math.max(0, 18 - rank) * 2500;
  const goalBonus = result.homeGoals * 12000;
  const winBonus = result.homeGoals > result.awayGoals ? 25000 : 0;
  return base + hype + goalBonus + winBonus;
}

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function FootballManager() {
  const [teams, setTeams] = useState(initialTeams);
  const [week, setWeek] = useState(1);
  const [tab, setTab] = useState("squad");
  const [matchLog, setMatchLog] = useState([]);
  const [transferMarket, setTransferMarket] = useState([]);
  const [notification, setNotification] = useState(null);
  const [budget, setBudget] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [formation, setFormation] = useState("4-3-3");
  const [activeMatch, setActiveMatch] = useState(null);
  const [selectedPieceId, setSelectedPieceId] = useState(null);

  const myTeam = teams.find((t) => t.id === MY_TEAM_ID);
  const sorted = useMemo(() => [...teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf), [teams]);
  const myRank = sorted.findIndex((t) => t.id === MY_TEAM_ID) + 1;
  const currentFixtures = SEASON_FIXTURES[week - 1] || [];
  const myFixture = currentFixtures.find((m) => m.homeId === MY_TEAM_ID || m.awayId === MY_TEAM_ID);

  useEffect(() => {
    const free = [];
    for (let i = 0; i < 36; i += 1) free.push(genPlayer(pick(EXTRA_POSITIONS), null, rng(0, 5)));
    setTransferMarket(free.sort((a, b) => b.overall - a.overall));
  }, []);

  const notify = useCallback((msg, type = "info") => {
    setNotification({ msg, type });
    window.setTimeout(() => setNotification(null), 3000);
  }, []);

  const startPlayableWeek = useCallback(() => {
    if (week > SEASON_FIXTURES.length) { notify("Musim telah berakhir!", "warn"); return; }
    if (activeMatch) { setTab("live"); return; }
    const fixture = myFixture;
    if (!fixture) { notify("Tidak ada pertandingan untuk tim kamu minggu ini.", "warn"); return; }
    const homeTeam = teams.find((t) => t.id === fixture.homeId);
    const awayTeam = teams.find((t) => t.id === fixture.awayId);
    const userSide = fixture.homeId === MY_TEAM_ID ? "home" : "away";
    const game = createPlayableMatch({
      homeTeam,
      awayTeam,
      userSide,
      userFormation: formation,
      homeFormation: homeTeam.preferredFormation,
      awayFormation: awayTeam.preferredFormation,
    });
    setActiveMatch({ week, fixture, game, otherResults: [] });
    setSelectedPieceId(null);
    setTab("live");
    notify(`${homeTeam.name} vs ${awayTeam.name}. Kamu bermain sebagai ${sideName(userSide)}.`, "success");
  }, [activeMatch, formation, myFixture, notify, teams, week]);

  useEffect(() => {
    if (!activeMatch?.game || activeMatch.game.ended) return undefined;
    const game = activeMatch.game;
    if (game.turn === game.userSide) return undefined;
    const timer = window.setTimeout(() => {
      setActiveMatch((prev) => {
        if (!prev?.game || prev.game.ended || prev.game.turn === prev.game.userSide) return prev;
        const aiAction = chooseAiAction(prev.game, prev.game.turn);
        if (!aiAction) return prev;
        return { ...prev, game: applyMatchAction(prev.game, aiAction) };
      });
      setSelectedPieceId(null);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [activeMatch]);

  const playMatchAction = useCallback((action) => {
    setActiveMatch((prev) => {
      if (!prev?.game || prev.game.ended || prev.game.turn !== prev.game.userSide) return prev;
      return { ...prev, game: applyMatchAction(prev.game, action) };
    });
    setSelectedPieceId(null);
  }, []);

  const finishWeek = useCallback(() => {
    if (!activeMatch?.game?.ended) { notify("Pertandingan belum selesai.", "warn"); return; }
    const playableResult = resultFromPlayable(activeMatch.game, activeMatch.week);
    const otherResults = currentFixtures
      .filter((m) => m.homeId !== MY_TEAM_ID && m.awayId !== MY_TEAM_ID)
      .map((m) => simulateMatch(teams.find((t) => t.id === m.homeId), teams.find((t) => t.id === m.awayId), activeMatch.week));
    const allResults = [playableResult, ...otherResults];
    const updatedTeams = allResults.reduce((acc, res) => applyResultToTeams(acc, res), teams);
    setTeams(updatedTeams);
    setMatchLog((prev) => [...allResults, ...prev].slice(0, 160));

    if (playableResult.homeId === MY_TEAM_ID) {
      const rankNow = sorted.findIndex((t) => t.id === MY_TEAM_ID) + 1;
      const income = calculateHomeIncome(myTeam, playableResult, rankNow);
      setBudget((b) => b + income);
      notify(`Home match income masuk: ${money(income)}.`, "success");
    } else {
      notify("Laga away selesai. Tidak ada pemasukan tiket.", "info");
    }
    setWeek((w) => w + 1);
    setActiveMatch(null);
    setSelectedPieceId(null);
    setTab("match");
  }, [activeMatch, currentFixtures, myTeam, notify, sorted, teams]);

  const buyPlayer = (player) => {
    if (budget < player.value) { notify(`Budget tidak cukup. Butuh ${money(player.value)}.`, "error"); return; }
    if (myTeam.players.length >= 30) { notify("Skuad penuh, maksimal 30 pemain.", "warn"); return; }
    setBudget((b) => b - player.value);
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: [...t.players, { ...player, teamId: MY_TEAM_ID }] } : t));
    setTransferMarket((prev) => prev.filter((p) => p.id !== player.id));
    notify(`${player.name} resmi bergabung!`, "success");
  };

  const sellPlayer = (player) => {
    if (myTeam.players.length <= 16) { notify("Jangan jual lagi. Minimal skuad 16 pemain.", "warn"); return; }
    const fee = Math.round(player.value * 0.72);
    setBudget((b) => b + fee);
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.filter((p) => p.id !== player.id) } : t));
    setTransferMarket((prev) => [{ ...player, teamId: null }, ...prev]);
    setSelectedPlayer(null);
    notify(`${player.name} dijual. Kas masuk ${money(fee)}.`, "success");
  };

  const TABS = ["squad", "tactics", "live", "match", "table", "transfer", "clubs"];
  const TAB_LABELS = { squad: "Skuad", tactics: "Taktik", live: "Main", match: "Jadwal", table: "Klasemen", transfer: "Transfer", clubs: "Klub" };

  return (
    <div className="legacyManager" style={{ minHeight: "100vh", background: "#0a0e1a", color: "#e8eaf6", fontFamily: "'Barlow Condensed',sans-serif", position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,500;0,700;0,900;1,700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(230,57,70,0.18) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 90% 80%,rgba(42,157,143,0.28) 0%,transparent 60%)", pointerEvents: "none", zIndex: 0 }} />
      {notification && <Notice notification={notification} />}

      <header style={{ position: "relative", zIndex: 10, padding: "20px 24px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: myTeam.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: `0 0 20px ${myTeam.color}77` }}>🦅</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{myTeam.name}</div>
              <div style={{ fontSize: 12, color: "#7986cb", letterSpacing: 3, textTransform: "uppercase" }}>Playable Football Manager</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <Stat label="Pekan" val={week <= SEASON_FIXTURES.length ? week : "End"} accent="#7986cb" />
            <Stat label="Posisi" val={`#${myRank}`} accent="#e63946" />
            <Stat label="Poin" val={myTeam.pts} accent="#2a9d8f" />
            <Stat label="Kas" val={money(budget)} accent="#e9c46a" />
            <button onClick={startPlayableWeek} disabled={week > SEASON_FIXTURES.length} style={{ padding: "11px 22px", background: week > SEASON_FIXTURES.length ? "#333" : "#e63946", border: "none", borderRadius: 8, color: "#fff", fontWeight: 900, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", cursor: week > SEASON_FIXTURES.length ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(230,57,70,0.4)" }}>
              {activeMatch ? "▶ LANJUT MATCH" : week > SEASON_FIXTURES.length ? "MUSIM SELESAI" : `▶ MAIN PEKAN ${week}`}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, maxWidth: 1180, margin: "16px auto 0", paddingBottom: 0 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 18px", background: "transparent", border: "none", borderBottom: tab === t ? "2px solid #e63946" : "2px solid transparent", color: tab === t ? "#e63946" : "#7986cb", fontFamily: "inherit", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px", position: "relative", zIndex: 5 }}>
        {tab === "squad" && <SquadTab team={myTeam} onSelect={setSelectedPlayer} selected={selectedPlayer} onSell={sellPlayer} />}
        {tab === "tactics" && <TacticsTab formation={formation} setFormation={setFormation} team={myTeam} />}
        {tab === "live" && <LiveMatchTab activeMatch={activeMatch} selectedPieceId={selectedPieceId} setSelectedPieceId={setSelectedPieceId} onAction={playMatchAction} onStart={startPlayableWeek} onFinish={finishWeek} />}
        {tab === "match" && <ScheduleTab fixtures={currentFixtures} teams={teams} week={week} log={matchLog} myId={MY_TEAM_ID} seasonLength={SEASON_FIXTURES.length} />}
        {tab === "table" && <TableTab teams={sorted} myId={MY_TEAM_ID} />}
        {tab === "transfer" && <TransferTab market={transferMarket} onBuy={buyPlayer} budget={budget} />}
        {tab === "clubs" && <ClubsTab teams={teams} />}
      </main>

      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        *::-webkit-scrollbar{width:4px;height:4px} *::-webkit-scrollbar-track{background:transparent} *::-webkit-scrollbar-thumb{background:#2d3561;border-radius:4px}
        .managerCard{background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.075);border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.22)}
        .managerGrid{display:grid;grid-template-columns:300px minmax(340px,1fr) 280px;gap:16px;align-items:start}.matchBoard{display:grid;grid-template-columns:repeat(${BOARD_COLS},minmax(0,1fr));gap:5px;aspect-ratio:${BOARD_COLS}/${BOARD_ROWS};padding:8px;border-radius:18px;border:2px solid rgba(255,255,255,.16);background:linear-gradient(rgba(255,255,255,.14),rgba(255,255,255,.14)) 0 50%/100% 2px no-repeat,radial-gradient(circle at center,transparent 0 10%,rgba(255,255,255,.18) 10.5% 11%,transparent 11.5%),linear-gradient(180deg,#1a6538,#114f34)}
        .matchCell{position:relative;border:1px solid rgba(255,255,255,.11);border-radius:11px;background:rgba(255,255,255,.04);min-width:0;display:grid;place-items:center;cursor:pointer;overflow:hidden}.matchCell:hover{border-color:rgba(255,255,255,.35)}.matchCell.goal{background:rgba(233,196,106,.14)}.matchCell.move{background:rgba(42,157,143,.22);border-color:rgba(42,157,143,.5)}
        .cellName{position:absolute;top:3px;left:5px;color:rgba(255,255,255,.34);font-size:10px;font-weight:900}.matchPiece{width:min(78%,54px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;position:relative;border:2px solid rgba(255,255,255,.42);box-shadow:0 10px 20px rgba(0,0,0,.35);font-size:11px;font-weight:900}.matchPiece.home{background:linear-gradient(135deg,#174ea6,#3ea2ff)}.matchPiece.away{background:linear-gradient(135deg,#9b1730,#ff5d73)}.matchPiece.selected{outline:4px solid #e9c46a;transform:scale(1.07)}.matchPiece.pass{outline:4px solid #2a9d8f}.matchPiece.tackle{outline:4px solid #ff4757}.matchPiece i{position:absolute;right:-7px;bottom:-9px;font-style:normal}.moveDot{width:18px;aspect-ratio:1;border-radius:50%;background:#2a9d8f;box-shadow:0 0 18px rgba(42,157,143,.75)}
        .pill{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#b7c3d7;font-size:12px;font-weight:800}.buttonPrimary{padding:9px 14px;border:0;border-radius:8px;background:#2a9d8f;color:#fff;font-weight:900;letter-spacing:1px;cursor:pointer}.buttonDanger{padding:9px 14px;border:0;border-radius:8px;background:#e63946;color:#fff;font-weight:900;letter-spacing:1px;cursor:pointer}.buttonGhost{padding:8px 12px;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(255,255,255,.04);color:#e8eaf6;font-weight:800;cursor:pointer}.buttonGhost:disabled,.buttonPrimary:disabled{opacity:.45;cursor:not-allowed}
        @media(max-width:980px){.managerGrid{grid-template-columns:1fr}.liveSide{order:2}.liveBoard{order:1}.liveRight{order:3}}
        @media(max-width:760px){.tacticsGrid{grid-template-columns:1fr!important}.legacyManager header{padding:14px 12px 0!important}.legacyManager header>div:first-child{align-items:flex-start!important}.legacyManager header>div:first-child>div:last-child{width:100%;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px!important}.legacyManager header button{grid-column:1/-1;width:100%}.legacyManager header>div:last-child{overflow-x:auto;padding-bottom:6px!important;scrollbar-width:none}.legacyManager header>div:last-child button{flex:0 0 auto}.legacyManager main{padding:18px 10px 70px!important}.matchBoard{gap:3px;padding:5px;border-radius:14px}.matchCell{border-radius:8px}.matchPiece{font-size:9px}.cellName{display:none}}
      `}</style>
    </div>
  );
}

function Notice({ notification }) {
  return <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, background: notification.type === "success" ? "#2a9d8f" : notification.type === "error" ? "#e63946" : notification.type === "warn" ? "#e9c46a" : "#457b9d", color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideIn 0.3s ease" }}>{notification.msg}</div>;
}

function Stat({ label, val, accent }) {
  return <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: accent, letterSpacing: 1 }}>{val}</div><div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 2, textTransform: "uppercase" }}>{label}</div></div>;
}

function SectionHeader({ title, sub }) {
  return <div style={{ marginBottom: 20 }}><h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>{title}</h2>{sub && <div style={{ fontSize: 12, color: "#546e7a", letterSpacing: 2, marginTop: 4 }}>{sub}</div>}</div>;
}

function Empty({ text }) { return <div style={{ textAlign: "center", padding: "48px 0", color: "#546e7a", fontSize: 14, letterSpacing: 1 }}>{text}</div>; }

// ── LIVE MATCH ───────────────────────────────────────────────────────────────
function LiveMatchTab({ activeMatch, selectedPieceId, setSelectedPieceId, onAction, onStart, onFinish }) {
  if (!activeMatch) {
    return <div style={{ animation: "fadeUp .4s ease" }}><SectionHeader title="MAIN PEKAN" sub="Klik tombol di bawah untuk membuka pertandingan pekan ini." /><div className="managerCard" style={{ padding: 24 }}><p style={{ color: "#9ea7b4" }}>Di versi ini tombol MAIN PEKAN tidak lagi simulasi otomatis. Kamu akan masuk ke papan taktik dan benar-benar memainkan laga melawan AI.</p><button className="buttonPrimary" onClick={onStart}>Mulai Pekan Ini</button></div></div>;
  }
  const game = activeMatch.game;
  const selected = selectedPieceId ? getPiece(game, selectedPieceId) : null;
  const canHumanAct = !game.ended && game.turn === game.userSide;
  const moves = selected ? legalMoves(game, selected.id) : [];
  const passes = selected ? legalPasses(game, selected.id) : [];
  const tackles = selected ? legalTackles(game, selected.id) : [];
  const shot = selected ? shotInfo(game, selected.id) : { can: false, chance: 0 };
  const selectedIsMine = selected && selected.side === game.userSide && selected.side === game.turn;

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <SectionHeader title="PERTANDINGAN LIVE" sub={`Pekan ${activeMatch.week}: ${game.homeName} vs ${game.awayName}`} />
      <div className="managerGrid">
        <aside className="managerCard liveSide" style={{ padding: 16 }}>
          <ScoreBlock game={game} />
          <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
            <span className="pill">⏱ Menit {currentMinute(game)}</span>
            <span className="pill">🎮 Kamu: {sideName(game.userSide)}</span>
            <span className="pill">♟ Giliran: {sideName(game.turn)}</span>
          </div>
          <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}>
            <b>Aksi terakhir</b>
            <div style={{ color: "#b7c3d7", marginTop: 6, lineHeight: 1.45 }}>{game.lastAction}</div>
          </div>
          {selected ? (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", display: "grid", gap: 8 }}>
              <small style={{ color: "#7986cb", letterSpacing: 2 }}>PEMAIN DIPILIH</small>
              <b>{selected.name}</b>
              <span style={{ color: "#b7c3d7" }}>{selected.role} · OVR {selected.overall} · {selected.id === game.ballOwnerId ? "menguasai bola" : "tanpa bola"}</span>
              <span style={{ color: "#e9c46a" }}>Shot: {shot.can ? `${shot.chance}% · ${shot.label}` : "Belum di posisi tembak"}</span>
              <button className="buttonDanger" disabled={!selectedIsMine || !shot.can} onClick={() => onAction({ type: "shoot", pieceId: selected.id })}>Tembak</button>
            </div>
          ) : <div style={{ marginTop: 14, color: "#9ea7b4" }}>Klik pemain {sideName(game.userSide)} saat giliran kamu. Pemain pembawa bola bisa umpan/tembak.</div>}
          {game.ended && <button className="buttonPrimary" onClick={onFinish} style={{ width: "100%", marginTop: 14 }}>Simpan Hasil & Lanjut Pekan</button>}
        </aside>

        <section className="managerCard liveBoard" style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 10, flexWrap: "wrap" }}>
            <span className="pill">Gawang {game.homeName}</span>
            <span className="pill">{canHumanAct ? "Giliran kamu" : game.ended ? "Full Time" : "AI berpikir..."}</span>
            <span className="pill">Gawang {game.awayName}</span>
          </div>
          <MatchBoard game={game} selectedPieceId={selectedPieceId} setSelectedPieceId={setSelectedPieceId} moves={moves} passes={passes} tackles={tackles} onAction={onAction} canHumanAct={canHumanAct} />
        </section>

        <aside className="managerCard liveRight" style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Riwayat Laga</h3>
          <div style={{ display: "grid", gap: 8, maxHeight: 560, overflow: "auto" }}>
            {game.history.map((h, i) => <div key={`${h.minute}-${i}`} style={{ padding: 10, border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, background: "rgba(255,255,255,.035)" }}><small style={{ color: "#7986cb" }}>Menit {h.minute}</small><div>{h.text}</div></div>)}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ScoreBlock({ game }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", padding: 14, borderRadius: 14, background: "rgba(0,0,0,.25)", border: "1px solid rgba(255,255,255,.08)" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 12, color: "#7986cb" }}>HOME</div><b style={{ fontSize: 28 }}>{game.homeName}</b></div><div style={{ fontSize: 34, fontWeight: 900 }}>{game.score.home} - {game.score.away}</div><div style={{ textAlign: "center" }}><div style={{ fontSize: 12, color: "#7986cb" }}>AWAY</div><b style={{ fontSize: 28 }}>{game.awayName}</b></div></div>;
}

function MatchBoard({ game, selectedPieceId, setSelectedPieceId, moves, passes, tackles, onAction, canHumanAct }) {
  const selected = selectedPieceId ? getPiece(game, selectedPieceId) : null;
  const moveSet = new Set(moves.map((c) => `${c.x}:${c.y}`));
  const passSet = new Set(passes.map((p) => p.id));
  const tackleSet = new Set(tackles.map((p) => p.id));
  const cells = [];
  const handle = (x, y) => {
    if (!canHumanAct) return;
    const clicked = pieceAt(game, x, y);
    if (clicked) {
      if (selected && passSet.has(clicked.id)) { onAction({ type: "pass", pieceId: selected.id, targetId: clicked.id }); return; }
      if (selected && tackleSet.has(clicked.id)) { onAction({ type: "tackle", pieceId: selected.id, targetId: clicked.id }); return; }
      if (clicked.side === game.userSide && clicked.side === game.turn) setSelectedPieceId(clicked.id === selectedPieceId ? null : clicked.id);
      return;
    }
    if (selected && moveSet.has(`${x}:${y}`)) onAction({ type: "move", pieceId: selected.id, x, y });
  };
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      const piece = pieceAt(game, x, y);
      const isMove = moveSet.has(`${x}:${y}`);
      const isGoal = (y === 0 || y === BOARD_ROWS - 1) && GOAL_COLS.includes(x);
      cells.push(<button key={`${x}:${y}`} type="button" className={`matchCell ${isGoal ? "goal" : ""} ${isMove ? "move" : ""}`} onClick={() => handle(x, y)}><span className="cellName">{boardName(x, y)}</span>{piece ? <span className={`matchPiece ${piece.side} ${piece.id === selectedPieceId ? "selected" : ""} ${passSet.has(piece.id) ? "pass" : ""} ${tackleSet.has(piece.id) ? "tackle" : ""}`} title={piece.name}><b>{piece.role}</b>{piece.id === game.ballOwnerId ? <i>⚽</i> : null}</span> : isMove ? <span className="moveDot" /> : null}</button>);
    }
  }
  return <div className="matchBoard">{cells}</div>;
}

// ── TABS ─────────────────────────────────────────────────────────────────────
function SquadTab({ team, onSelect, selected, onSell }) {
  const posOrder = { GK: 0, CB: 1, LB: 2, RB: 3, CDM: 4, CM: 5, CAM: 6, LM: 7, RM: 8, LW: 9, RW: 10, ST: 11 };
  const sorted = [...team.players].sort((a, b) => (posOrder[a.pos] ?? 99) - (posOrder[b.pos] ?? 99) || b.overall - a.overall);
  return <div style={{ animation: "fadeUp 0.4s ease" }}><SectionHeader title="SKUAD PEMAIN" sub={`${team.players.length} pemain · pilih pemain untuk detail/jual`} /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>{sorted.map((p) => <PlayerCard key={p.id} player={p} selected={selected?.id === p.id} onClick={() => onSelect(selected?.id === p.id ? null : p)} />)}</div>{selected && <PlayerDetail player={selected} onSell={onSell} />}</div>;
}

function PlayerCard({ player, selected, onClick }) {
  const col = player.overall >= 75 ? "#2a9d8f" : player.overall >= 65 ? "#e9c46a" : "#e63946";
  return <div onClick={onClick} className="managerCard" style={{ background: selected ? "rgba(230,57,70,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${selected ? "rgba(230,57,70,0.5)" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: 14, cursor: "pointer", transform: selected ? "translateY(-2px)" : "none" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><div style={{ fontSize: 10, color: "#7986cb", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" }}>{player.pos}</div><div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{player.name}</div><div style={{ fontSize: 11, color: "#546e7a", marginTop: 2 }}>{player.age} thn · {money(player.value)}</div></div><div style={{ fontSize: 26, fontWeight: 900, color: col, lineHeight: 1 }}>{player.overall}</div></div><div style={{ marginTop: 12, display: "flex", gap: 6 }}>{[["Pac", player.pace], ["Sho", player.shoot], ["Pas", player.pass], ["Def", player.defend]].map(([k, v]) => <div key={k} style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#aaa" }}>{v}</div><div style={{ fontSize: 9, color: "#546e7a" }}>{k}</div></div>)}</div></div>;
}

function PlayerDetail({ player, onSell }) {
  return <div className="managerCard" style={{ marginTop: 20, background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: 12, padding: 20, animation: "fadeUp 0.3s ease" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}><div><div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>{player.name}</div><div style={{ fontSize: 12, color: "#7986cb", marginTop: 4, letterSpacing: 2 }}>{POS_LABELS[player.pos]} · {player.age} tahun · kontrak {player.contract} tahun</div><div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>{[["PAC", player.pace], ["SHO", player.shoot], ["PAS", player.pass], ["DRI", player.dribble], ["DEF", player.defend]].map(([k, v]) => <div key={k} style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 900, color: v >= 75 ? "#2a9d8f" : v >= 65 ? "#e9c46a" : "#e63946" }}>{v}</div><div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 2 }}>{k}</div></div>)}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 12, color: "#546e7a", marginBottom: 4 }}>NILAI PASAR</div><div style={{ fontSize: 18, fontWeight: 900, color: "#e9c46a" }}>{money(player.value)}</div><button onClick={() => onSell(player)} className="buttonDanger" style={{ marginTop: 12 }}>JUAL ({money(Math.round(player.value * 0.72))})</button></div></div></div>;
}

function TacticsTab({ formation, setFormation, team }) {
  const lineup = pickLineup(team, formation);
  return <div style={{ animation: "fadeUp 0.4s ease" }}><SectionHeader title="TAKTIK & FORMASI" sub="Formasi ini langsung dipakai saat kamu menekan MAIN PEKAN." /><div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>{Object.keys(FORMATIONS).map((f) => <button key={f} onClick={() => setFormation(f)} className={formation === f ? "buttonPrimary" : "buttonGhost"}>{f}</button>)}</div><div style={{ display: "grid", gridTemplateColumns: "minmax(260px,360px) 1fr", gap: 18 }} className="tacticsGrid"><MiniPitch formation={formation} lineup={lineup} /><div className="managerCard" style={{ padding: 16 }}><h3 style={{ marginTop: 0 }}>Starting XI otomatis</h3><div style={{ display: "grid", gap: 8 }}>{lineup.map(({ player, slot }, i) => <div key={`${player.id}-${i}`} style={{ display: "grid", gridTemplateColumns: "42px 1fr 42px", gap: 8, alignItems: "center", padding: 9, borderRadius: 10, background: "rgba(255,255,255,.04)" }}><b style={{ color: "#e9c46a" }}>{slot.pos}</b><span>{player.name}</span><b>{player.overall}</b></div>)}</div></div></div></div>;
}

function MiniPitch({ formation, lineup }) {
  const spots = FORMATIONS[formation] || FORMATIONS["4-3-3"];
  return <div style={{ position: "relative", background: "linear-gradient(180deg,#1a4a2e 0%,#1e5c35 40%,#1a4a2e 100%)", borderRadius: 12, overflow: "hidden", aspectRatio: "7/11", maxWidth: 360, margin: "0 auto", border: "2px solid rgba(255,255,255,0.08)" }}><svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 70 110"><rect x="8" y="4" width="54" height="102" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" /><line x1="8" y1="55" x2="62" y2="55" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" /><circle cx="35" cy="55" r="9" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" /><rect x="22" y="4" width="26" height="12" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" /><rect x="22" y="94" width="26" height="12" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" /></svg>{spots.map((spot, i) => { const player = lineup[i]?.player; return <div key={i} style={{ position: "absolute", left: `${(spot.x / (BOARD_COLS - 1)) * 100}%`, top: `${(spot.y / (BOARD_ROWS - 1)) * 100}%`, transform: "translate(-50%,-50%)", textAlign: "center", zIndex: 2 }}><div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e63946", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", border: "2px solid rgba(255,255,255,0.3)", margin: "0 auto 2px" }}>{player?.overall || "?"}</div><div style={{ fontSize: 8, color: "rgba(255,255,255,0.9)", fontWeight: 700, background: "rgba(0,0,0,0.5)", borderRadius: 3, padding: "1px 4px", whiteSpace: "nowrap", maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis" }}>{spot.pos} {player?.name.split(" ")[0] || ""}</div></div>; })}</div>;
}

function ScheduleTab({ fixtures, teams, week, log, myId, seasonLength }) {
  return <div style={{ animation: "fadeUp 0.4s ease" }}><SectionHeader title="JADWAL & HASIL" sub={week <= seasonLength ? `Pekan ${week} dari ${seasonLength}` : "Musim selesai"} /><div className="managerCard" style={{ padding: 16, marginBottom: 18 }}><h3 style={{ marginTop: 0 }}>Pekan ini</h3>{fixtures.length === 0 ? <Empty text="Tidak ada jadwal." /> : <div style={{ display: "grid", gap: 8 }}>{fixtures.map((f) => { const h = teams.find((t) => t.id === f.homeId); const a = teams.find((t) => t.id === f.awayId); const mine = h.id === myId || a.id === myId; return <div key={`${f.homeId}-${f.awayId}`} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", padding: 10, borderRadius: 10, background: mine ? "rgba(230,57,70,.12)" : "rgba(255,255,255,.04)", border: mine ? "1px solid rgba(230,57,70,.35)" : "1px solid rgba(255,255,255,.06)" }}><b style={{ textAlign: "right" }}>{h.name}</b><span className="pill">vs</span><b>{a.name}</b>{mine && <small style={{ gridColumn: "1 / -1", textAlign: "center", color: "#e9c46a" }}>Ini laga kamu. Kalau kamu Home, kas dapat pemasukan tiket setelah laga selesai.</small>}</div>; })}</div>}</div><SectionHeader title="HASIL TERAKHIR" sub={`${log.length} pertandingan tercatat`} />{log.length === 0 ? <Empty text="Belum ada pertandingan. Klik MAIN PEKAN untuk memulai." /> : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{log.map((m, i) => <ResultRow key={`${m.week}-${m.homeId}-${m.awayId}-${i}`} m={m} myId={myId} />)}</div>}</div>;
}

function ResultRow({ m, myId }) {
  const isMy = m.homeId === myId || m.awayId === myId;
  const myWon = (m.homeId === myId && m.homeGoals > m.awayGoals) || (m.awayId === myId && m.awayGoals > m.homeGoals);
  const myDrew = m.homeGoals === m.awayGoals;
  const accent = isMy ? (myWon ? "#2a9d8f" : myDrew ? "#7986cb" : "#e63946") : "rgba(255,255,255,0.04)";
  return <div style={{ background: isMy ? `${accent}18` : "rgba(255,255,255,.03)", border: `1px solid ${isMy ? `${accent}66` : "rgba(255,255,255,.06)"}`, borderRadius: 10, padding: "12px 16px" }}><div style={{ display: "grid", gridTemplateColumns: "70px 1fr auto 1fr", gap: 12, alignItems: "center" }}><div style={{ fontSize: 10, color: "#546e7a", letterSpacing: 2 }}>PEKAN {m.week}</div><div style={{ textAlign: "right", fontSize: 14, fontWeight: 700 }}>{m.home}</div><div style={{ padding: "4px 14px", background: "rgba(0,0,0,0.3)", borderRadius: 6, fontSize: 18, fontWeight: 900, letterSpacing: 4 }}>{m.homeGoals} – {m.awayGoals}</div><div style={{ fontSize: 14, fontWeight: 700 }}>{m.away}</div></div>{isMy && m.events?.length > 0 && <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexWrap: "wrap", gap: 8 }}>{m.events.map((e, j) => <span key={j} style={{ fontSize: 11, color: "#aaa", background: "rgba(255,255,255,0.06)", borderRadius: 4, padding: "2px 8px" }}>⚽ {e.min}' {e.player}</span>)}</div>}</div>;
}

function TableTab({ teams, myId }) {
  return <div style={{ animation: "fadeUp 0.4s ease" }}><SectionHeader title="KLASEMEN LIGA" sub="Liga Indonesia Virtual · 16 klub" /><div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, overflowX: "auto", border: "1px solid rgba(255,255,255,0.06)" }}><div style={{ minWidth: 720 }}><div style={{ display: "grid", gridTemplateColumns: "36px 1fr 48px 48px 48px 48px 48px 60px", padding: "10px 16px", fontSize: 10, color: "#546e7a", letterSpacing: 2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{["#", "TIM", "P", "M", "S", "K", "GD", "PTS"].map((h, i) => <div key={i} style={{ textAlign: i > 1 ? "center" : "left" }}>{h}</div>)}</div>{teams.map((t, i) => { const isMy = t.id === myId; const gd = t.gf - t.ga; const played = t.wins + t.draws + t.losses; const formColors = { W: "#2a9d8f", D: "#7986cb", L: "#e63946" }; return <div key={t.id} style={{ display: "grid", gridTemplateColumns: "36px 1fr 48px 48px 48px 48px 48px 60px", padding: "12px 16px", alignItems: "center", background: isMy ? "rgba(230,57,70,0.08)" : "transparent", borderLeft: isMy ? "3px solid #e63946" : "3px solid transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><div style={{ fontSize: 12, fontWeight: 900, color: i < 4 ? "#e9c46a" : "#546e7a" }}>{i + 1}</div><div><div style={{ fontWeight: 700, fontSize: 14, color: isMy ? "#e8eaf6" : "#b0bec5" }}>{t.name}</div><div style={{ display: "flex", gap: 3, marginTop: 3 }}>{(t.form || []).map((f, j) => <span key={j} style={{ width: 14, height: 14, borderRadius: 3, background: formColors[f] || "#333", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "#fff" }}>{f}</span>)}</div></div>{[played, t.wins, t.draws, t.losses, gd > 0 ? `+${gd}` : gd].map((v, j) => <div key={j} style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#7986cb" }}>{v}</div>)}<div style={{ textAlign: "center", fontSize: 18, fontWeight: 900, color: isMy ? "#e63946" : "#e8eaf6" }}>{t.pts}</div></div>; })}</div></div></div>;
}

function TransferTab({ market, onBuy, budget }) {
  const [filter, setFilter] = useState("ALL");
  const positions = ["ALL", "GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "ST"];
  const filtered = filter === "ALL" ? market : market.filter((p) => p.pos === filter);
  return <div style={{ animation: "fadeUp 0.4s ease" }}><SectionHeader title="PASAR TRANSFER" sub={`Kas mulai dari 0. Dapat uang hanya dari laga Home atau jual pemain. Kas saat ini: ${money(budget)}`} /><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>{positions.map((p) => <button key={p} onClick={() => setFilter(p)} className={filter === p ? "buttonPrimary" : "buttonGhost"}>{p}</button>)}</div>{filtered.length === 0 && <Empty text="Tidak ada pemain tersedia untuk posisi ini." />}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>{filtered.map((p) => { const canAfford = budget >= p.value; return <div key={p.id} className="managerCard" style={{ padding: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}><div><div style={{ fontSize: 10, color: "#7986cb", letterSpacing: 2, marginBottom: 4 }}>{p.pos}</div><div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 11, color: "#546e7a", marginTop: 2 }}>{p.age} tahun</div></div><div style={{ fontSize: 26, fontWeight: 900, color: p.overall >= 75 ? "#2a9d8f" : p.overall >= 65 ? "#e9c46a" : "#e63946" }}>{p.overall}</div></div><div style={{ display: "flex", gap: 8, marginBottom: 12 }}>{[["Pac", p.pace], ["Sho", p.shoot], ["Pas", p.pass], ["Def", p.defend]].map(([k, v]) => <div key={k} style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#aaa" }}>{v}</div><div style={{ fontSize: 9, color: "#546e7a" }}>{k}</div></div>)}</div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><div style={{ fontSize: 12, color: "#e9c46a", fontWeight: 700 }}>{money(p.value)}</div><button onClick={() => onBuy(p)} disabled={!canAfford} className="buttonPrimary">BELI</button></div></div>; })}</div></div>;
}

function ClubsTab({ teams }) {
  return <div style={{ animation: "fadeUp .4s ease" }}><SectionHeader title="DAFTAR KLUB" sub="Lebih banyak lawan, lebih panjang musim, lebih banyak pemain." /><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 12 }}>{teams.map((t) => <div key={t.id} className="managerCard" style={{ padding: 16, borderTop: `4px solid ${t.color}` }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><div style={{ width: 42, height: 42, borderRadius: "50%", background: t.color, display: "grid", placeItems: "center", color: "#111", fontWeight: 900 }}>FC</div><div><b style={{ fontSize: 17 }}>{t.name}</b><div style={{ color: "#7986cb", fontSize: 12 }}>{t.city}</div></div></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}><span className="pill">👥 {t.players.length} pemain</span><span className="pill">⭐ {Math.round(teamPower(t))}</span><span className="pill">🏟 {t.fans.toLocaleString("id-ID")}</span><span className="pill">🧩 {t.preferredFormation}</span></div></div>)}</div></div>;
}
