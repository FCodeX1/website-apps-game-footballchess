import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const checks = [];
function check(name, pass, detail = '') { checks.push({ name, pass: Boolean(pass), detail }); }

const app = read('src/App.jsx');
const css = read('src/styles.css');
const server = read('server/lan-server.js');
const fairness = read('src/game/fairnessTest.js');
check('No legacy backup source files', !exists('src/App.jsx.v9bak') && !exists('src/styles.css.v9bak') && !exists('src/FootballManager.jsx'));
check('Dead UI legacy dirs removed', !exists('src/components') && !exists('src/hooks') && !exists('src/game/ai.js') && !exists('src/game/rules.js'));
check('Save migration v22 installed', app.includes('function migrateSave') && app.includes('SAVE_VERSION = 22'));
check('V22 modular navigation installed', app.includes('NAV_GROUPS') && css.includes('V22 Super Update'));
check('V22 unexpected events installed', app.includes('EXTRA_MANAGER_EVENTS') && app.includes('speaker: e.speaker'));
check('V22 real-world data installed', app.includes('REAL_WORLD_CLUBS') && app.includes('CAREER_CLUB_CHOICES'));
check('V22 quick sim motion installed', app.includes('function quickSimMotion') && app.includes('QUICK_SIM_FRAME_MS = 150'));
check('V22 monthly meeting installed', app.includes('meetingUsed') && app.includes('bulan'));
check('Save migration maps injuredWeeks', app.includes('p?.injuredWeeks ?? p?.injuryWeeks') && app.includes('injuryWeeks: undefined'));
check('Red-card tactic counts sent-off players', app.includes('manDisadvantage') && app.includes('p.red && !p.vacant'));
check('Deterministic replay seed helpers installed', app.includes('function seededRandom') && app.includes('replaySeed: makeReplaySeed'));
check('LAN port meta fixed', server.includes('port: ACTIVE_PORT'));
check('LAN host authoritative tick guard', server.includes('Host authoritative tick hanya boleh dikirim host') && app.includes('actionType: "hostTick"'));
check('LAN stale revision guard', server.includes('baseRevision') && server.includes('expectedRevision'));
check('Full QA harness installed', fairness.includes('runEconomyStressTest') && fairness.includes('makeSeededRng'));
check('Mobile compact CSS installed', css.includes('V19 Stability + Mobile Compact Polish'));
check('QA panel enhanced', app.includes('transferValueSpread') && app.includes('compactQaGrid') && app.includes('Run 1000 Match'));
check('Production dist available', exists('dist/index.html'));

const failed = checks.filter((c) => !c.pass);
console.table(checks.map((c) => ({ check: c.name, status: c.pass ? 'OK' : 'FAIL', detail: c.detail })));
if (failed.length) {
  console.error(`QA static checks failed: ${failed.map((f) => f.name).join(', ')}`);
  process.exit(1);
}
console.log('QA static checks passed.');
