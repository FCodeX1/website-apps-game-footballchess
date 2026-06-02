# Bola Catur Arena Polished V4

Game football manager + match tactics turn-based. Versi ini fokus memperbaiki gameplay agar AI lebih menyerang, UI lebih responsif, scout lebih fair, dan career lebih panjang.

## Fitur utama

- 48 klub Indonesia virtual.
- Match playable setiap pekan, bukan simulasi kosong.
- AI random-terarah berdasarkan style klub dan plan tersembunyi.
- Action Point 3 AP per turn.
- Dribel, run, umpan, through ball, tackle, skill move, tembak.
- Goal overlay manual: gol tidak langsung terskip, klik `Lanjut Kick Off`.
- Setelah gol, bola restart untuk tim yang kebobolan.
- Offside line lebih jelas untuk through ball.
- Auto defensive retreat saat bek terlalu tinggi dan lawan mendekati kiper.
- Formasi lebih banyak + starting XI bisa diganti dari bench.
- Career mode, save/load manual, board trust, fan trust, reputasi manager.
- Youth academy dan player growth.
- Personality pemain.
- Story events.
- Scout tertunda 1 match, batas scout mengikuti level akademi, maksimal 3.
- Rare high potential hanya sekitar 5%.
- Kas awal 0. Kalau belum save manual, refresh mulai fresh dari awal.
- Income utama dari pertandingan home.
- Cup bonus di pekan tertentu.
- UI lebih responsif untuk mobile/desktop.

## Cara jalan di VS Code

```powershell
npm install
npm run dev
```

Buka:

```txt
http://localhost:5173/
```

## Build production

```powershell
npm run build
```

## Deploy Netlify

Build command:

```txt
npm run build
```

Publish directory:

```txt
dist
```
