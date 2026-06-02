import {
  COLS,
  GOAL_COLS,
  ROWS,
  ROLE,
  SIDES,
  cellName,
  getLegalMoveCells,
  getLegalPassTargets,
  getLegalTackleTargets,
  hasBall,
  pieceAt,
} from "../game/rules.js";

function keyOf(x, y) {
  return `${x}:${y}`;
}

export default function Board({ game, selectedId, setSelectedId, onAction, canAct }) {
  const selectedPiece = selectedId ? game.pieces.find((piece) => piece.id === selectedId) : null;
  const legalMoves = selectedPiece ? getLegalMoveCells(game, selectedPiece.id) : [];
  const legalPasses = selectedPiece ? getLegalPassTargets(game, selectedPiece.id) : [];
  const legalTackles = selectedPiece ? getLegalTackleTargets(game, selectedPiece.id) : [];
  const moveSet = new Set(legalMoves.map((cell) => keyOf(cell.x, cell.y)));
  const passSet = new Set(legalPasses.map((piece) => piece.id));
  const tackleSet = new Set(legalTackles.map((piece) => piece.id));

  const handleCell = (x, y) => {
    if (!canAct || game.winner) return;
    const clickedPiece = pieceAt(game, x, y);

    if (clickedPiece) {
      if (selectedPiece?.id && passSet.has(clickedPiece.id)) {
        onAction({ type: "pass", pieceId: selectedPiece.id, targetId: clickedPiece.id });
        return;
      }
      if (selectedPiece?.id && tackleSet.has(clickedPiece.id)) {
        onAction({ type: "tackle", pieceId: selectedPiece.id, targetId: clickedPiece.id });
        return;
      }
      if (clickedPiece.side === game.turn) {
        setSelectedId(clickedPiece.id === selectedId ? null : clickedPiece.id);
      }
      return;
    }

    if (selectedPiece && moveSet.has(keyOf(x, y))) {
      onAction({ type: "move", pieceId: selectedPiece.id, x, y });
    }
  };

  const cells = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const piece = pieceAt(game, x, y);
      const legalMove = moveSet.has(keyOf(x, y));
      const isGoalLine = (y === 0 || y === ROWS - 1) && GOAL_COLS.includes(x);
      cells.push(
        <button
          className={`cell ${isGoalLine ? "goalCell" : ""} ${legalMove ? "legalMove" : ""}`}
          key={keyOf(x, y)}
          onClick={() => handleCell(x, y)}
          type="button"
          aria-label={cellName(x, y)}
        >
          <span className="cellName">{cellName(x, y)}</span>
          {piece ? (
            <Piece
              piece={piece}
              selected={piece.id === selectedId}
              ball={hasBall(game, piece.id)}
              pass={passSet.has(piece.id)}
              tackle={tackleSet.has(piece.id)}
              active={piece.side === game.turn}
            />
          ) : legalMove ? (
            <span className="moveDot" />
          ) : null}
        </button>
      );
    }
  }

  return (
    <section className="boardWrap card">
      <div className="goalLabel topGoal">Gawang Biru diserang Merah</div>
      <div className="board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {cells}
      </div>
      <div className="goalLabel bottomGoal">Gawang Merah diserang Biru</div>
    </section>
  );
}

function Piece({ piece, selected, ball, pass, tackle, active }) {
  return (
    <span
      className={`piece ${piece.side === "home" ? "homePiece" : "awayPiece"} ${selected ? "selectedPiece" : ""} ${pass ? "passTarget" : ""} ${tackle ? "tackleTarget" : ""} ${active ? "activePiece" : ""}`}
      title={`${SIDES[piece.side].name} - ${ROLE[piece.role].title}`}
    >
      <b>{ROLE[piece.role].label}</b>
      {ball ? <i>⚽</i> : null}
    </span>
  );
}
