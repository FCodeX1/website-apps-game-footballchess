import { ROLE, SIDES, previewShot } from "../game/rules.js";

export default function Hud({ game, selectedPiece, canAct, onShoot, onReset, modeLabel, roomCode, playerSide }) {
  const shot = selectedPiece ? previewShot(game, selectedPiece.id) : null;
  const selectedHasBall = selectedPiece?.id === game.ballOwnerId;
  const sideName = SIDES[game.turn].name;

  return (
    <aside className="hud card">
      <div className="scoreBox">
        <div>
          <span className="scoreName blueText">Biru</span>
          <strong>{game.score.home}</strong>
        </div>
        <div className="scoreDivider">:</div>
        <div>
          <strong>{game.score.away}</strong>
          <span className="scoreName redText">Merah</span>
        </div>
      </div>

      <div className="turnPanel">
        <span>Giliran</span>
        <b className={game.turn === "home" ? "blueText" : "redText"}>{sideName}</b>
      </div>

      <div className="metaGrid">
        <div>
          <small>Mode</small>
          <b>{modeLabel}</b>
        </div>
        <div>
          <small>Langkah</small>
          <b>{game.moveNo}</b>
        </div>
        {roomCode ? (
          <div>
            <small>Room</small>
            <b>{roomCode}</b>
          </div>
        ) : null}
        {playerSide ? (
          <div>
            <small>Kamu</small>
            <b>{SIDES[playerSide].name}</b>
          </div>
        ) : null}
      </div>

      <div className="lastAction">{game.lastAction}</div>

      {game.winner ? (
        <div className="winner">🏆 {SIDES[game.winner].name} menang!</div>
      ) : null}

      <div className="selectedBox">
        <small>Pemain dipilih</small>
        {selectedPiece ? (
          <>
            <b>{ROLE[selectedPiece.role].title}</b>
            <span>
              {selectedPiece.name} · {selectedHasBall ? "menguasai bola" : "tanpa bola"}
            </span>
            {selectedHasBall && shot ? <em>{shot.label}</em> : null}
            <button
              className="primaryBtn full"
              disabled={!canAct || !selectedHasBall || !shot}
              onClick={onShoot}
              type="button"
            >
              Tembak ke Gawang
            </button>
          </>
        ) : (
          <span>Klik pemain yang sedang mendapat giliran.</span>
        )}
      </div>

      <div className="helpBox">
        <b>Cara main singkat</b>
        <span>1 aksi per giliran: gerak, umpan, tackle, atau tembak.</span>
        <span>Menang saat mencapai 3 gol.</span>
      </div>

      <button className="ghostBtn full" onClick={onReset} type="button">
        Reset Pertandingan
      </button>
    </aside>
  );
}
