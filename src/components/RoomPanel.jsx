import { useState } from "react";

export default function RoomPanel({ firebaseReady, room, roomCode, roomError, createRoom, joinRoom, onBack, onUseRoom }) {
  const [name, setName] = useState(() => localStorage.getItem("bola-catur-name") || "Pemain");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const saveName = (value) => {
    setName(value);
    localStorage.setItem("bola-catur-name", value);
  };

  const doCreate = async () => {
    setBusy(true);
    const madeCode = await createRoom(name || "Pemain 1");
    setBusy(false);
    if (madeCode) onUseRoom();
  };

  const doJoin = async () => {
    setBusy(true);
    const side = await joinRoom(code, name || "Pemain 2");
    setBusy(false);
    if (side) onUseRoom();
  };

  return (
    <main className="menuPage">
      <section className="roomPanel card">
        <button className="backBtn" onClick={onBack} type="button">← Kembali</button>
        <div className="badge">Room Multiplayer</div>
        <h1>Bikin / Join Room</h1>
        <p>
          Mode ini memakai Firebase Realtime Database supaya room tetap bisa jalan saat project
          di-upload ke Netlify.
        </p>

        {!firebaseReady ? (
          <div className="alertBox">
            Firebase belum dikonfigurasi. Isi file <b>.env</b> dari <b>.env.example</b>, lalu restart
            <b> npm run dev</b>. Mode AI dan lokal tetap bisa dimainkan tanpa Firebase.
          </div>
        ) : null}

        {roomError ? <div className="alertBox errorBox">{roomError}</div> : null}

        <label className="fieldLabel">
          Nama pemain
          <input value={name} onChange={(event) => saveName(event.target.value)} placeholder="Nama kamu" />
        </label>

        <div className="roomActions">
          <button className="primaryBtn" onClick={doCreate} disabled={!firebaseReady || busy} type="button">
            Buat Room Baru
          </button>
          <div className="joinBox">
            <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Kode room" maxLength={5} />
            <button className="ghostBtn" onClick={doJoin} disabled={!firebaseReady || busy} type="button">
              Join
            </button>
          </div>
        </div>

        {roomCode || room ? (
          <div className="roomInfo">
            <b>Kode room: {roomCode}</b>
            <span>Bagikan kode ini ke temanmu.</span>
          </div>
        ) : null}
      </section>
    </main>
  );
}
