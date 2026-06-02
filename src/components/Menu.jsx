export default function Menu({ onStartAi, onStartLocal, onOpenRoom, firebaseReady }) {
  return (
    <main className="menuPage">
      <section className="hero card">
        <div className="badge">⚽ ♟️ Turn Based Football</div>
        <h1>Bola Catur Arena</h1>
        <p>
          Permainan logika dan strategi seperti catur, tetapi tujuannya menyerang, mengoper,
          merebut bola, lalu mencetak 3 gol.
        </p>
        <div className="modeGrid">
          <button className="modeCard" onClick={onStartAi} type="button">
            <strong>Lawan AI</strong>
            <span>AI otomatis mengejar bola, passing, dan menembak.</span>
          </button>
          <button className="modeCard" onClick={onStartLocal} type="button">
            <strong>Lawan Kawan Lokal</strong>
            <span>2 pemain di 1 device. Cocok untuk test cepat.</span>
          </button>
          <button className="modeCard" onClick={onOpenRoom} type="button">
            <strong>Bikin / Join Room</strong>
            <span>{firebaseReady ? "Online real-time via Firebase." : "Aktifkan Firebase dulu untuk room online."}</span>
          </button>
        </div>
      </section>
    </main>
  );
}
