import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const START_PORT = Number(process.env.PORT || 8080);
let ACTIVE_PORT = START_PORT;
const rooms = new Map();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}
function publicIps() {
  const found = [];
  const nets = os.networkInterfaces();
  for (const entries of Object.values(nets)) {
    for (const net of entries || []) {
      if (net.family === "IPv4" && !net.internal) found.push(net.address);
    }
  }
  return found;
}
function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(payload));
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; if (data.length > 2_000_000) req.destroy(); });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}
function cleanRoom(room) {
  const clone = JSON.parse(JSON.stringify(room));
  return clone;
}
function createRoom(clientId, name) {
  let code = makeCode();
  while (rooms.has(code)) code = makeCode();
  const now = Date.now();
  const room = {
    code,
    status: "waiting",
    createdAt: now,
    updatedAt: now,
    hostClientId: clientId,
    players: {
      home: { clientId, name: name || "Host", side: "home", accepted: true, online: true, joinedAt: now, clubKey: "man-city" },
    },
    pending: [],
    match: null,
    events: [{ id: `${now}-create`, text: `${name || "Host"} membuat room ${code}.`, at: now }],
  };
  rooms.set(code, room);
  return room;
}
function getSide(room, clientId) {
  if (room.players.home?.clientId === clientId) return "home";
  if (room.players.away?.clientId === clientId) return "away";
  return null;
}
function touch(room, text = "") {
  room.updatedAt = Date.now();
  if (text) room.events = [{ id: `${room.updatedAt}-${Math.random()}`, text, at: room.updatedAt }, ...(room.events || [])].slice(0, 30);
}
function scoreTotal(game) {
  return Number(game?.score?.home || 0) + Number(game?.score?.away || 0);
}
function validateMatchMutation({ room, clientId, side, body, currentRevision }) {
  const actionType = String(body.actionType || "unknown");
  const isHost = room.hostClientId === clientId;
  const previousGame = room.match?.game || null;
  const nextGame = body.game || null;
  if (actionType === "hostTick" && !isHost) return "Host authoritative tick hanya boleh dikirim host.";
  if (nextGame?.mode === "realtimeSoccer" && previousGame?.mode === "realtimeSoccer") {
    const previousScore = scoreTotal(previousGame);
    const nextScore = scoreTotal(nextGame);
    if (nextScore < previousScore) return "Skor tidak boleh mundur.";
    if (nextScore - previousScore > 1) return "Perubahan skor terlalu besar untuk satu sync.";
    const prevClock = Number(previousGame.clockSeconds || 0);
    const nextClock = Number(nextGame.clockSeconds || 0);
    if (actionType !== "hostTick" && !isHost && nextClock - prevClock > 2.5) return "Clock realtime hanya boleh dimajukan host.";
    if (nextClock + 1 < prevClock) return "Clock realtime tidak boleh mundur.";
    if (body.playerSide && body.playerSide !== side) return "playerSide tidak cocok dengan room.";
  }
  if (Number(body.baseRevision ?? currentRevision) !== currentRevision) return "Room sudah berubah. Sinkron ulang sebelum aksi berikutnya.";
  return "";
}
async function api(req, res, url) {
  if (url.pathname === "/api/lan/meta") {
    const lans = publicIps().map((ip) => `http://${ip}:${ACTIVE_PORT}`);
    return json(res, 200, { ok: true, local: `http://127.0.0.1:${ACTIVE_PORT}`, lan: lans, port: ACTIVE_PORT });
  }
  if (url.pathname === "/api/lan/rooms" && req.method === "POST") {
    const body = await readBody(req);
    if (!body.clientId) return json(res, 400, { ok: false, error: "clientId kosong" });
    const room = createRoom(body.clientId, body.name);
    return json(res, 200, { ok: true, room: cleanRoom(room) });
  }
  const match = url.pathname.match(/^\/api\/lan\/rooms\/([A-Z0-9]{5})(?:\/(\w+))?$/);
  if (!match) return json(res, 404, { ok: false, error: "API tidak ditemukan" });
  const code = match[1];
  const action = match[2] || "";
  const room = rooms.get(code);
  if (!room) return json(res, 404, { ok: false, error: "Room tidak ditemukan" });

  if (!action && req.method === "GET") return json(res, 200, { ok: true, room: cleanRoom(room) });

  const body = await readBody(req);
  const clientId = body.clientId;

  if (action === "join" && req.method === "POST") {
    if (getSide(room, clientId)) return json(res, 200, { ok: true, room: cleanRoom(room), side: getSide(room, clientId) });
    if (room.players.away) return json(res, 409, { ok: false, error: "Room sudah penuh" });
    const pendingExists = room.pending.some((p) => p.clientId === clientId);
    if (!pendingExists) room.pending.push({ clientId, name: body.name || "Teman", requestedAt: Date.now(), clubKey: "real-madrid" });
    touch(room, `${body.name || "Teman"} meminta join. Host harus accept dulu.`);
    return json(res, 200, { ok: true, room: cleanRoom(room), side: null });
  }

  if (action === "accept" && req.method === "POST") {
    if (room.hostClientId !== clientId) return json(res, 403, { ok: false, error: "Hanya host yang bisa accept invitation" });
    const inviteId = body.inviteClientId;
    const invite = room.pending.find((p) => p.clientId === inviteId) || room.pending[0];
    if (!invite) return json(res, 404, { ok: false, error: "Tidak ada invitation" });
    room.players.away = { clientId: invite.clientId, name: invite.name || "Away", side: "away", accepted: true, online: true, joinedAt: Date.now(), clubKey: invite.clubKey || "real-madrid" };
    room.pending = room.pending.filter((p) => p.clientId !== invite.clientId);
    room.status = "accepted";
    touch(room, `${room.players.away.name} diterima masuk room.`);
    return json(res, 200, { ok: true, room: cleanRoom(room) });
  }

  if (action === "decline" && req.method === "POST") {
    if (room.hostClientId !== clientId) return json(res, 403, { ok: false, error: "Hanya host yang bisa decline" });
    const before = room.pending.length;
    room.pending = room.pending.filter((p) => p.clientId !== body.inviteClientId);
    touch(room, before !== room.pending.length ? "Invitation ditolak host." : "Tidak ada invitation yang diubah.");
    return json(res, 200, { ok: true, room: cleanRoom(room) });
  }

  if (action === "club" && req.method === "POST") {
    const side = getSide(room, clientId);
    if (!side) return json(res, 403, { ok: false, error: "Belum accepted di room" });
    room.players[side].clubKey = body.clubKey;
    touch(room, `${room.players[side].name} memilih klub.`);
    return json(res, 200, { ok: true, room: cleanRoom(room), side });
  }

  if (action === "start" && req.method === "POST") {
    if (room.hostClientId !== clientId) return json(res, 403, { ok: false, error: "Hanya host yang bisa mulai match" });
    if (!room.players.home?.clubKey || !room.players.away?.clubKey) return json(res, 409, { ok: false, error: "Kedua pemain harus memilih klub" });
    room.status = "playing";
    room.match = { game: body.game || null, startedAt: Date.now(), updatedAt: Date.now(), revision: 1, authority: "host", inputQueue: [] };
    touch(room, "Match LAN dimulai.");
    return json(res, 200, { ok: true, room: cleanRoom(room) });
  }

  if (action === "sync" && req.method === "POST") {
    const side = getSide(room, clientId);
    if (!side) return json(res, 403, { ok: false, error: "Belum accepted di room" });
    if (!room.match) room.match = { game: null, startedAt: Date.now(), revision: 0 };
    const currentRevision = Number(room.match.revision || 0);
    const validationError = validateMatchMutation({ room, clientId, side, body, currentRevision });
    if (validationError) return json(res, 409, { ok: false, error: validationError, room: cleanRoom(room), expectedRevision: currentRevision });
    const currentTurn = room.match.game?.turn;
    if (room.match.game && room.match.game.mode !== "realtimeSoccer" && currentTurn && currentTurn !== side && body.actionType !== "resumeGoal") return json(res, 409, { ok: false, error: "Bukan giliran player ini.", room: cleanRoom(room) });
    const nextGame = body.game || null;
    if (nextGame) {
      nextGame.lanSync = { revision: currentRevision + 1, updatedBy: side, updatedAt: Date.now(), authority: room.match.authority || "host", actionType: body.actionType || "unknown" };
      nextGame.userSide = "home";
    }
    room.match.game = nextGame;
    room.match.revision = currentRevision + 1;
    room.match.updatedAt = Date.now();
    room.status = nextGame?.ended ? "finished" : "playing";
    touch(room, body.eventText || `${room.players[side].name} melakukan aksi.`);
    return json(res, 200, { ok: true, room: cleanRoom(room), side });
  }

  if (action === "leave" && req.method === "POST") {
    const side = getSide(room, clientId);
    if (side) {
      room.players[side].online = false;
      touch(room, `${room.players[side].name} keluar room.`);
    }
    return json(res, 200, { ok: true, room: cleanRoom(room) });
  }

  return json(res, 404, { ok: false, error: "Action tidak ditemukan" });
}
function serveStatic(req, res, url) {
  if (!fs.existsSync(dist)) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Folder dist belum ada. Jalankan: npm run build lalu npm run lan:server, atau cukup npm run lan.");
    return;
  }
  let filePath = path.join(dist, decodeURIComponent(url.pathname));
  if (url.pathname === "/" || !path.extname(filePath)) filePath = path.join(dist, "index.html");
  if (!filePath.startsWith(dist)) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(dist, "index.html"), (indexErr, indexData) => {
        if (indexErr) { res.writeHead(404); res.end("Not found"); return; }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(indexData);
      });
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
  if (url.pathname.startsWith("/api/lan")) {
    api(req, res, url).catch((error) => json(res, 500, { ok: false, error: error.message }));
  } else {
    serveStatic(req, res, url);
  }
});
function printAddresses(port) {
  const lans = publicIps();
  console.log(`Local: http://127.0.0.1:${port}`);
  if (lans.length) lans.forEach((ip) => console.log(`LAN:   http://${ip}:${port}`));
  else console.log("LAN:   Tidak ditemukan IP LAN. Pastikan WiFi/LAN aktif.");
  console.log("Teman harus buka alamat LAN, bukan 127.0.0.1.");
}
function listenWithFallback(port, triesLeft = 10) {
  ACTIVE_PORT = port;
  server.once("error", (err) => {
    if (err?.code === "EADDRINUSE" && triesLeft > 0) {
      const nextPort = port + 1;
      console.log(`Port ${port} sedang dipakai. Mencoba port ${nextPort}...`);
      listenWithFallback(nextPort, triesLeft - 1);
      return;
    }
    console.error("Gagal menjalankan server LAN:", err?.message || err);
    process.exit(1);
  });
  server.listen(port, "0.0.0.0", () => printAddresses(port));
}
listenWithFallback(START_PORT);
