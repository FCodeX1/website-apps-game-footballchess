import { useCallback, useEffect, useMemo, useState } from "react";
import { get, onDisconnect, onValue, ref, remove, serverTimestamp, set, update } from "firebase/database";
import { createInitialGame } from "../game/rules.js";
import { database, firebaseReady } from "../lib/firebase.js";

const CLIENT_KEY = "bola-catur-client-id";

function makeClientId() {
  const randomId = typeof window !== "undefined" && window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return randomId;
}

function getClientId() {
  try {
    const savedId = window.localStorage?.getItem(CLIENT_KEY);
    if (savedId) return savedId;

    const nextId = makeClientId();
    window.localStorage?.setItem(CLIENT_KEY, nextId);
    return nextId;
  } catch {
    return makeClientId();
  }
}

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

export function useFirebaseRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [playerSide, setPlayerSide] = useState(null);
  const [room, setRoom] = useState(null);
  const [roomError, setRoomError] = useState("");
  const clientId = useMemo(() => getClientId(), []);

  useEffect(() => {
    if (!firebaseReady || !roomCode) return undefined;
    const roomRef = ref(database, `rooms/${roomCode}`);
    return onValue(roomRef, (snapshot) => {
      const value = snapshot.val();
      setRoom(value || null);
    });
  }, [roomCode]);

  const attachDisconnect = useCallback((code, side) => {
    if (!firebaseReady || !code || !side) return;
    const playerRef = ref(database, `rooms/${code}/players/${side}`);
    onDisconnect(playerRef).update({ online: false, leftAt: serverTimestamp() }).catch(() => {});
  }, []);

  const createRoom = useCallback(
    async (name = "Pemain 1") => {
      setRoomError("");
      if (!firebaseReady) {
        setRoomError("Firebase belum diisi. Mode room online belum aktif.");
        return null;
      }

      let code = makeCode();
      let roomRef = ref(database, `rooms/${code}`);
      let snapshot = await get(roomRef);
      while (snapshot.exists()) {
        code = makeCode();
        roomRef = ref(database, `rooms/${code}`);
        snapshot = await get(roomRef);
      }

      const game = createInitialGame({ mode: "room", roomCode: code });
      const payload = {
        code,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "waiting",
        game,
        players: {
          home: { id: clientId, name, side: "home", online: true, joinedAt: serverTimestamp() },
        },
      };
      await set(roomRef, payload);
      setRoomCode(code);
      setPlayerSide("home");
      attachDisconnect(code, "home");
      return code;
    },
    [attachDisconnect, clientId]
  );

  const joinRoom = useCallback(
    async (codeInput, name = "Pemain 2") => {
      setRoomError("");
      if (!firebaseReady) {
        setRoomError("Firebase belum diisi. Mode room online belum aktif.");
        return null;
      }
      const code = codeInput.trim().toUpperCase();
      if (!code) {
        setRoomError("Kode room masih kosong.");
        return null;
      }

      const roomRef = ref(database, `rooms/${code}`);
      const snapshot = await get(roomRef);
      if (!snapshot.exists()) {
        setRoomError("Room tidak ditemukan.");
        return null;
      }

      const data = snapshot.val();
      const players = data.players || {};
      let side = null;
      if (players.home?.id === clientId) side = "home";
      else if (players.away?.id === clientId) side = "away";
      else if (!players.home) side = "home";
      else if (!players.away) side = "away";

      if (!side) {
        setRoomError("Room sudah penuh. Buat room baru.");
        return null;
      }

      await update(ref(database, `rooms/${code}`), {
        [`players/${side}`]: { id: clientId, name, side, online: true, joinedAt: serverTimestamp() },
        status: players.home || side === "home" ? "playing" : "waiting",
        updatedAt: serverTimestamp(),
      });
      setRoomCode(code);
      setPlayerSide(side);
      attachDisconnect(code, side);
      return side;
    },
    [attachDisconnect, clientId]
  );

  const syncGame = useCallback(
    async (nextGame) => {
      if (!firebaseReady || !roomCode) return;
      await update(ref(database, `rooms/${roomCode}`), {
        game: nextGame,
        status: nextGame.winner ? "finished" : "playing",
        updatedAt: serverTimestamp(),
      });
    },
    [roomCode]
  );

  const leaveRoom = useCallback(async () => {
    if (firebaseReady && roomCode && playerSide) {
      await update(ref(database, `rooms/${roomCode}/players/${playerSide}`), {
        online: false,
        leftAt: serverTimestamp(),
      }).catch(() => {});
    }
    setRoomCode("");
    setPlayerSide(null);
    setRoom(null);
  }, [playerSide, roomCode]);

  const deleteRoom = useCallback(async () => {
    if (firebaseReady && roomCode) await remove(ref(database, `rooms/${roomCode}`));
    setRoomCode("");
    setPlayerSide(null);
    setRoom(null);
  }, [roomCode]);

  return {
    firebaseReady,
    room,
    roomCode,
    playerSide,
    roomError,
    createRoom,
    joinRoom,
    syncGame,
    leaveRoom,
    deleteRoom,
  };
}
