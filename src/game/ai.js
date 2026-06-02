import {
  applyAction,
  canShoot,
  distance,
  getLegalMoveCells,
  getLegalPassTargets,
  getLegalTackleTargets,
  getPiece,
  goalDistance,
  opponent,
} from "./rules.js";

function scoreMove(piece, cell, game) {
  const side = piece.side;
  const currentGoalDistance = goalDistance(piece);
  const nextGoalDistance = side === "home" ? cell.y : 8 - cell.y;
  const forwardGain = currentGoalDistance - nextGoalDistance;
  const ballOwner = getPiece(game, game.ballOwnerId);
  const chase = ballOwner && ballOwner.side !== side ? -distance(cell, ballOwner) : 0;
  const center = -Math.abs(cell.x - 3) * 0.2;
  const withBall = game.ballOwnerId === piece.id ? 2 : 0;
  return forwardGain * 3 + chase + center + withBall;
}

export function chooseAiAction(game, side = "away") {
  if (game.winner || game.turn !== side) return null;
  const myPieces = game.pieces.filter((piece) => piece.side === side);
  const carrier = getPiece(game, game.ballOwnerId);

  for (const piece of myPieces) {
    const tackles = getLegalTackleTargets(game, piece.id);
    if (tackles.length) {
      return { type: "tackle", pieceId: piece.id, targetId: tackles[0].id };
    }
  }

  const myCarrier = carrier?.side === side ? carrier : null;
  if (myCarrier) {
    if (canShoot(game, myCarrier.id)) {
      return { type: "shoot", pieceId: myCarrier.id };
    }

    const passTargets = getLegalPassTargets(game, myCarrier.id)
      .map((target) => ({
        target,
        score: goalDistance(myCarrier) - goalDistance(target) + (target.role === "FW" ? 1 : 0),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (passTargets.length > 0) {
      return { type: "pass", pieceId: myCarrier.id, targetId: passTargets[0].target.id };
    }

    const bestMove = getLegalMoveCells(game, myCarrier.id)
      .map((cell) => ({ cell, score: scoreMove(myCarrier, cell, game) }))
      .sort((a, b) => b.score - a.score)[0];

    if (bestMove) {
      return { type: "move", pieceId: myCarrier.id, x: bestMove.cell.x, y: bestMove.cell.y };
    }
  }

  const target = carrier?.side === opponent(side) ? carrier : null;
  const chasers = myPieces
    .map((piece) => {
      const bestMove = getLegalMoveCells(game, piece.id)
        .map((cell) => ({ cell, d: target ? distance(cell, target) : 99 }))
        .sort((a, b) => a.d - b.d)[0];
      return { piece, bestMove, d: target ? distance(piece, target) : 99 };
    })
    .filter((item) => item.bestMove)
    .sort((a, b) => a.bestMove.d - b.bestMove.d || a.d - b.d);

  if (chasers.length) {
    const { piece, bestMove } = chasers[0];
    return { type: "move", pieceId: piece.id, x: bestMove.cell.x, y: bestMove.cell.y };
  }

  return null;
}

export function playAiTurn(game, side = "away") {
  const action = chooseAiAction(game, side);
  return action ? applyAction(game, action) : game;
}
