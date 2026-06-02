export const COLS = 7;
export const ROWS = 9;
export const GOAL_COLS = [2, 3, 4];

export const SIDES = {
  home: {
    key: "home",
    name: "Biru",
    direction: -1,
    goalRow: -1,
    ownGoalRow: ROWS,
    scoreKey: "home",
  },
  away: {
    key: "away",
    name: "Merah",
    direction: 1,
    goalRow: ROWS,
    ownGoalRow: -1,
    scoreKey: "away",
  },
};

export const ROLE = {
  GK: { label: "GK", title: "Kiper", move: 1, pass: 4, shot: 2, power: 1 },
  DF: { label: "DF", title: "Bek", move: 2, pass: 4, shot: 2, power: 1 },
  MF: { label: "MF", title: "Gelandang", move: 2, pass: 5, shot: 3, power: 2 },
  FW: { label: "FW", title: "Striker", move: 3, pass: 4, shot: 4, power: 3 },
};

const STARTERS = [
  { id: "h-gk", side: "home", role: "GK", x: 3, y: 8, name: "Kiper Biru" },
  { id: "h-df1", side: "home", role: "DF", x: 2, y: 7, name: "Bek Kiri" },
  { id: "h-df2", side: "home", role: "DF", x: 4, y: 7, name: "Bek Kanan" },
  { id: "h-mf1", side: "home", role: "MF", x: 1, y: 6, name: "Playmaker" },
  { id: "h-mf2", side: "home", role: "MF", x: 5, y: 6, name: "Winger" },
  { id: "h-fw", side: "home", role: "FW", x: 3, y: 5, name: "Striker Biru" },
  { id: "a-gk", side: "away", role: "GK", x: 3, y: 0, name: "Kiper Merah" },
  { id: "a-df1", side: "away", role: "DF", x: 2, y: 1, name: "Bek Kiri" },
  { id: "a-df2", side: "away", role: "DF", x: 4, y: 1, name: "Bek Kanan" },
  { id: "a-mf1", side: "away", role: "MF", x: 1, y: 2, name: "Playmaker" },
  { id: "a-mf2", side: "away", role: "MF", x: 5, y: 2, name: "Winger" },
  { id: "a-fw", side: "away", role: "FW", x: 3, y: 3, name: "Striker Merah" },
];

export function createInitialGame({ mode = "ai", roomCode = null } = {}) {
  return {
    version: 1,
    mode,
    roomCode,
    pieces: STARTERS.map((p) => ({ ...p })),
    ballOwnerId: "h-fw",
    turn: "home",
    score: { home: 0, away: 0 },
    moveNo: 1,
    lastAction: "Kick off! Biru mulai dari striker.",
    winner: null,
    history: [],
  };
}

export function cloneGame(game) {
  return JSON.parse(JSON.stringify(game));
}

export function opponent(side) {
  return side === "home" ? "away" : "home";
}

export function insideBoard(x, y) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS;
}

export function distance(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function getPiece(game, pieceId) {
  return game.pieces.find((piece) => piece.id === pieceId) || null;
}

export function pieceAt(game, x, y) {
  return game.pieces.find((piece) => piece.x === x && piece.y === y) || null;
}

export function hasBall(game, pieceId) {
  return game.ballOwnerId === pieceId;
}

export function goalDistance(piece) {
  if (piece.side === "home") return piece.y;
  return ROWS - 1 - piece.y;
}

export function isForwardMove(piece, target) {
  const direction = SIDES[piece.side].direction;
  return (target.y - piece.y) * direction > 0;
}

export function getLegalMoveCells(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.winner || piece.side !== game.turn) return [];

  const range = ROLE[piece.role].move;
  const cells = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (piece.x === x && piece.y === y) continue;
      if (pieceAt(game, x, y)) continue;
      const d = distance(piece, { x, y });
      if (d > 0 && d <= range) {
        cells.push({ x, y, kind: "move" });
      }
    }
  }
  return cells;
}

export function getLegalPassTargets(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.winner || !hasBall(game, piece.id) || piece.side !== game.turn) return [];

  const passRange = ROLE[piece.role].pass;
  return game.pieces
    .filter((target) => target.side === piece.side && target.id !== piece.id)
    .filter((target) => distance(piece, target) <= passRange)
    .map((target) => ({ ...target, kind: "pass" }));
}

export function getLegalTackleTargets(game, pieceId) {
  const piece = getPiece(game, pieceId);
  const carrier = getPiece(game, game.ballOwnerId);
  if (!piece || !carrier || game.winner || piece.side !== game.turn) return [];
  if (carrier.side === piece.side) return [];
  return distance(piece, carrier) <= 1 ? [{ ...carrier, kind: "tackle" }] : [];
}

export function getPressureOnCell(game, side, x, y) {
  return game.pieces.filter((piece) => piece.side !== side && distance(piece, { x, y }) <= 1).length;
}

export function canShoot(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.winner || !hasBall(game, piece.id) || piece.side !== game.turn) return false;
  if (piece.role === "GK") return false;
  const dGoal = goalDistance(piece);
  const wideBonus = GOAL_COLS.includes(piece.x) ? 1 : 0;
  return dGoal <= ROLE[piece.role].shot + wideBonus;
}

export function previewShot(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || !hasBall(game, piece.id)) return null;
  const dGoal = goalDistance(piece);
  const centerBonus = piece.x === 3 ? 2 : GOAL_COLS.includes(piece.x) ? 1 : 0;
  const pressure = getPressureOnCell(game, piece.side, piece.x, piece.y);
  const rating = ROLE[piece.role].power + centerBonus + Math.max(0, 4 - dGoal) - pressure;
  return {
    rating,
    label: rating >= 4 ? "Peluang besar" : rating >= 3 ? "Peluang sedang" : "Rawan ditepis",
    willScore: rating >= 4,
  };
}

function resetAfterGoal(game, scoringSide) {
  const next = cloneGame(game);
  next.pieces = STARTERS.map((p) => ({ ...p }));
  next.ballOwnerId = scoringSide === "home" ? "a-fw" : "h-fw";
  next.turn = opponent(scoringSide);
  next.moveNo += 1;
  if (next.score.home >= 3 || next.score.away >= 3) {
    next.winner = next.score.home > next.score.away ? "home" : "away";
    next.lastAction = `${SIDES[scoringSide].name} mencetak gol dan menang ${next.score.home}-${next.score.away}!`;
  }
  return next;
}

function appendHistory(game, text) {
  game.history = [{ moveNo: game.moveNo, text }, ...(game.history || [])].slice(0, 20);
}

export function applyAction(game, action) {
  const next = cloneGame(game);
  if (next.winner) return next;

  const piece = getPiece(next, action.pieceId);
  if (!piece || piece.side !== next.turn) return next;

  if (action.type === "move") {
    const legal = getLegalMoveCells(next, piece.id).some((cell) => cell.x === action.x && cell.y === action.y);
    if (!legal) return next;
    piece.x = action.x;
    piece.y = action.y;
    const text = `${SIDES[piece.side].name}: ${ROLE[piece.role].label} bergerak ke ${cellName(action.x, action.y)}.`;
    next.lastAction = text;
    appendHistory(next, text);
    next.turn = opponent(next.turn);
    next.moveNo += 1;
    return next;
  }

  if (action.type === "pass") {
    const target = getPiece(next, action.targetId);
    const legal = target && getLegalPassTargets(next, piece.id).some((p) => p.id === target.id);
    if (!legal) return next;
    next.ballOwnerId = target.id;
    const text = `${SIDES[piece.side].name}: umpan ke ${ROLE[target.role].label} di ${cellName(target.x, target.y)}.`;
    next.lastAction = text;
    appendHistory(next, text);
    next.turn = opponent(next.turn);
    next.moveNo += 1;
    return next;
  }

  if (action.type === "tackle") {
    const target = getPiece(next, action.targetId);
    const legal = target && getLegalTackleTargets(next, piece.id).some((p) => p.id === target.id);
    if (!legal) return next;
    next.ballOwnerId = piece.id;
    const text = `${SIDES[piece.side].name}: ${ROLE[piece.role].label} merebut bola!`;
    next.lastAction = text;
    appendHistory(next, text);
    next.turn = opponent(next.turn);
    next.moveNo += 1;
    return next;
  }

  if (action.type === "shoot") {
    if (!canShoot(next, piece.id)) return next;
    const shot = previewShot(next, piece.id);
    if (shot?.willScore) {
      next.score[piece.side] += 1;
      const goalText = `GOOOL! ${SIDES[piece.side].name} unggul lewat ${ROLE[piece.role].label}.`;
      next.lastAction = goalText;
      appendHistory(next, goalText);
      return resetAfterGoal(next, piece.side);
    }

    const keeperId = piece.side === "home" ? "a-gk" : "h-gk";
    next.ballOwnerId = keeperId;
    const text = `${SIDES[piece.side].name}: tembakan ditepis kiper.`;
    next.lastAction = text;
    appendHistory(next, text);
    next.turn = opponent(next.turn);
    next.moveNo += 1;
    return next;
  }

  return next;
}

export function cellName(x, y) {
  return `${String.fromCharCode(65 + x)}${ROWS - y}`;
}

export function isSameGame(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
