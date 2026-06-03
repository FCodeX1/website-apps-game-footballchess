# Bola Catur Arena Polished V5

Game football manager + tactical board match engine.

## Jalankan di VS Code

```powershell
npm install
npm run dev
```

Buka:

```txt
http://localhost:5173/
```

## Build

```powershell
npm run build
```

Untuk Netlify:

```txt
Build command: npm run build
Publish directory: dist
```

## V5 update

- Awal aplikasi sekarang masuk ke Beranda/Landing Menu, bukan langsung tampilan liga atau laga.
- Data fresh mulai dari kas Rp 0 selama belum load save.
- Save bisa disimpan ke browser, di-download sebagai JSON, dan di-load lagi dari file JSON.
- Panel gameplay dirombak agar aksi penting terlihat di sekitar papan dan tidak perlu banyak scroll.
- AI dibuat lebih agresif menyerang dan lebih random-terarah.
- Tackle peluang rendah punya 3% kejadian chaos: foul, cedera lawan, atau dua pemain cedera lalu auto-substitution.
- Goal tetap pause sampai user klik lanjut kick off.
- Setelah gol, bola kick off untuk tim yang kebobolan.


## Netlify build fix
Project ini dipin ke Node 20 dan npm 10.8.2 agar Netlify tidak memakai Node 22/npm 10.9.x yang kadang memunculkan error `Exit handler never called!` saat install dependency.

File penting:
- `.nvmrc`
- `.node-version`
- `netlify.toml`
- `package.json` engines

Di Netlify gunakan:
- Build command: `npm run build`
- Publish directory: `dist`

Jika deploy masih memakai cache lama, jalankan **Clear cache and deploy**.

## Multiplayer LAN v11

Mode LAN dipakai untuk main melawan teman di jaringan lokal yang sama.

1. Host jalankan:

```bash
npm install
npm run lan
```

2. Terminal akan menampilkan alamat seperti:

```txt
Local: http://127.0.0.1:8080
LAN:   http://192.168.1.25:8080
```

3. Host boleh membuka `http://127.0.0.1:8080` atau alamat LAN.
4. Teman harus membuka alamat LAN, misalnya `http://192.168.1.25:8080`, bukan `127.0.0.1`.
5. Di menu awal pilih **Multiplayer LAN**.
6. Host klik **Host Buat Room**.
7. Teman join memakai kode room / invite link.
8. Host harus menekan **Accept** invitation.
9. Setelah accepted, kedua pemain pilih klub asli lintas Inggris, Spanyol, Paris/Prancis, Jerman, Italia, Arab Saudi, dan Indonesia.
10. Host klik **Mulai Match LAN**.

Jika port 8080 dipakai aplikasi lain, jalankan:

```bash
PORT=8090 npm run lan
```
