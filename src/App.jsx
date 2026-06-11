import React from "react";
const { useCallback, useEffect, useMemo, useState } = React;

const MY_TEAM_ID = 1;
const BOARD_ROWS = 14;
const BOARD_COLS = 9;
const MAX_ACTIONS = 70;
const MAX_AP = 3;
const GOAL_COLS = [4];
const SHOT_STRAIGHT_RANGE = 3;
const SHOT_SIDE_RANGE = 2;
const SKILL_SHOT_RANGE_BONUS = 1;
const INITIAL_CASH = 50000;
const SAVE_KEY = "bola-catur-arena-career-v6";
const SAVE_VERSION = 20;
const SAVE_FILE_NAME = "bola-catur-arena-save.json";
const COMPETITIONS = {
  liga48: { key: "liga48", title: "Career 4 Liga", subtitle: "Mulai dari Liga Championship, promosi ke Liga 3, Liga 2, lalu Liga 1.", badge: "Multi Season" },
  managerWorld: { key: "managerWorld", title: "Manager World Calendar", subtitle: "Liga 4 tier + Number 1 Championship + berita/event/transfer window.", badge: "Full Calendar" },
};
const CAREER_START_DATE = new Date(2026, 7, 8); // 8 Agustus 2026, sengaja stabil agar calendar selalu konsisten.
const GAME_COMPETITIONS = [
  { key: "league", name: "Liga Utama", icon: "🏆", scope: "Domestik", weeks: "Setiap pekan", prize: 0, desc: "Kompetisi utama 48 klub, home/away." },
  { key: "domesticCup", name: "National Cup", icon: "🏅", scope: "Domestik", weeks: "8, 16, 24, 32", prize: 45000, desc: "Piala gugur domestik, rotasi skuad sangat berguna." },
  { key: "leagueCup", name: "League Cup", icon: "🏵️", scope: "Domestik", weeks: "20, 42, 58", prize: 42000, desc: "Cup tambahan untuk rotasi pemain cadangan." },
  { key: "superCup", name: "Super Cup", icon: "⚡", scope: "One-off", weeks: "60", prize: 90000, desc: "Laga besar akhir musim untuk klub performa terbaik." },
  { key: "champions", name: "Champions Cup", icon: "🌟", scope: "Kontinental", weeks: "34, 42, 50, 58", prize: 110000, desc: "Top 16 sementara masuk laga bonus bergengsi." },
  { key: "europa", name: "Europa Cup", icon: "🟠", scope: "Kontinental", weeks: "38, 48, 60", prize: 85000, desc: "Jalur kontinental kedua untuk klub yang sedang naik." },
  { key: "conference", name: "Conference Cup", icon: "🟢", scope: "Kontinental", weeks: "28, 46, 60", prize: 62000, desc: "Kompetisi kontinental tambahan untuk klub berkembang." },
  { key: "libertadores", name: "Libertadores Series", icon: "🔴", scope: "Amerika Selatan", weeks: "Event berita", prize: 0, desc: "Headline global, scout, dan rumor pemain teknikal." },
  { key: "sudamericana", name: "Sudamericana Series", icon: "🟡", scope: "Amerika Selatan", weeks: "Event berita", prize: 0, desc: "Sumber rumor pemain murah dengan teknik tinggi." },
  { key: "asiaChampions", name: "Asia Champions League", icon: "🌏", scope: "Asia", weeks: "36, 52, 60", prize: 95000, desc: "Kompetisi elite Asia versi game." },
  { key: "africaChampions", name: "Africa Champions League", icon: "🌍", scope: "Afrika", weeks: "Event berita", prize: 0, desc: "Berita global dan bursa pemain fisikal." },
  { key: "northChampions", name: "North America Champions Cup", icon: "🌎", scope: "Amerika Utara", weeks: "Event berita", prize: 0, desc: "Rumor pemain cepat dan market value naik." },
  { key: "worldClub", name: "Club World Series", icon: "🌍", scope: "Global", weeks: "46, 59", prize: 160000, desc: "Turnamen global antar klub terbaik versi game." },
  { key: "intercontinental", name: "Intercontinental Final", icon: "🪐", scope: "Global", weeks: "60", prize: 200000, desc: "Final global event akhir season 60 pekan." },
  { key: "worldCup", name: "World Cup", icon: "🏳️", scope: "Internasional", weeks: "Event berita", prize: 0, desc: "Ajang internasional besar untuk berita, reputasi, dan transfer." },
  { key: "continentalNations", name: "Continental Nations Cups", icon: "🗺️", scope: "Internasional", weeks: "10, 30, 50", prize: 0, desc: "Kabar Euro/Copa/Asia/Africa/Gold Cup versi game." },
  { key: "nationsLeague", name: "Nations League", icon: "🏁", scope: "Internasional", weeks: "Event berita", prize: 0, desc: "Headline performa pemain nasional." },
  { key: "u20World", name: "U20 World Cup", icon: "🌱", scope: "Youth", weeks: "12, 36, 60", prize: 35000, desc: "Ajang pemain muda dan hidden potential viral." },
  { key: "u17World", name: "U17 World Cup", icon: "🧒", scope: "Youth", weeks: "Event scout", prize: 0, desc: "Munculkan rumor wonderkid sangat muda." },
  { key: "olympic", name: "Olympic Football", icon: "🥇", scope: "U23/Internasional", weeks: "Event berita", prize: 0, desc: "Event berita dan kenaikan reputasi pemain muda." },
  { key: "preseason", name: "Preseason Invitational", icon: "🤝", scope: "Friendly", weeks: "Sebelum musim", prize: 0, desc: "Latihan taktik tanpa merusak career." },
];
const COACH_PRESETS = [
  { key: "balanced", name: "Coach Arjuna", style: "Balanced", icon: "🧠", boardTrust: 70, fanTrust: 70, reputation: 1, desc: "Seimbang, cocok untuk belajar career." },
  { key: "tactician", name: "Ari Tactico", style: "Tactician", icon: "📋", boardTrust: 73, fanTrust: 66, reputation: 1, desc: "Lebih kuat di struktur taktik dan game plan." },
  { key: "youth", name: "Bima Akademi", style: "Youth Builder", icon: "🌱", boardTrust: 68, fanTrust: 72, reputation: 1, desc: "Cocok untuk membesarkan pemain muda dan hidden potential." },
  { key: "attacker", name: "Raka Offensif", style: "Attacking", icon: "🔥", boardTrust: 64, fanTrust: 78, reputation: 1, desc: "Fans senang, risiko kebobolan lebih tinggi." },
  { key: "defensive", name: "Damar Pragmatic", style: "Defensive", icon: "🧱", boardTrust: 76, fanTrust: 63, reputation: 1, desc: "Aman, compact, cocok untuk skuad murah." },
];

const LEAGUES = [
  { key: "liga1", name: "Liga 1", short: "L1", level: 1, target: 86, promo: 0, relegation: 3, prize: { champion: 900000, top5: 420000, stay: 180000 }, desc: "Liga tertinggi; klub kuat, target kontinental, tekanan tinggi." },
  { key: "liga2", name: "Liga 2", short: "L2", level: 2, target: 79, promo: 3, relegation: 3, prize: { champion: 520000, top5: 260000, stay: 95000 }, desc: "Liga penantang; OVR inti sekitar 78+ dan promosi menjadi target besar." },
  { key: "liga3", name: "Liga 3", short: "L3", level: 3, target: 72, promo: 3, relegation: 3, prize: { champion: 310000, top5: 150000, stay: 60000 }, desc: "Liga berkembang; akademi dan transfer murah sangat penting." },
  { key: "championship", name: "Liga Championship", short: "LC", level: 4, target: 68, promo: 3, relegation: 0, prize: { champion: 180000, top5: 85000, stay: 35000 }, desc: "Liga paling bawah; semua career user dimulai dari sini." },
];
const LEAGUE_ORDER = ["liga1", "liga2", "liga3", "championship"];
const LEAGUE_BY_KEY = Object.fromEntries(LEAGUES.map((l) => [l.key, l]));
const TEAMS_PER_LEAGUE = 12;
const SEASON_LENGTH_WEEKS = 60;
const NUMBER_ONE_WEEKS = { groups: [50, 51, 52, 53, 54], semi: 56, final: 58 };
const TRANSFER_WINDOWS = [
  { key: "summer", name: "Awal Musim", from: 1, to: 6 },
  { key: "mid", name: "Mid Season", from: 24, to: 30 },
  { key: "preEnd", name: "Akhir Musim", from: 55, to: 60 },
];
function leagueInfo(key) { return LEAGUE_BY_KEY[key] || LEAGUE_BY_KEY.championship; }
function leagueName(key) { return leagueInfo(key).name; }
function leagueIndex(key) { return LEAGUE_ORDER.indexOf(key); }
function isTransferWindow(week) { return TRANSFER_WINDOWS.some((w) => week >= w.from && week <= w.to); }
function transferWindowLabel(week) {
  const w = TRANSFER_WINDOWS.find((x) => week >= x.from && week <= x.to);
  return w ? `${w.name} (Pekan ${w.from}-${w.to})` : "Transfer window tutup";
}
function initialLeagueKeyByIndex(idx) {
  if (idx < TEAMS_PER_LEAGUE) return "liga1";
  if (idx < TEAMS_PER_LEAGUE * 2) return "liga2";
  if (idx < TEAMS_PER_LEAGUE * 3) return "liga3";
  return "championship";
}
function softOverallForLeague(pos, leagueKey, idx = 0) {
  const target = leagueInfo(leagueKey).target;
  const roleBump = ["GK", "ST", "CAM", "CB"].includes(pos) ? 1 : 0;
  const topBump = idx < 14 ? 1 : idx < 22 ? 0 : -2;
  const spread = leagueKey === "liga1" ? rng(-3, 3) : leagueKey === "liga2" ? rng(-4, 3) : rng(-5, 4);
  return clamp(target + roleBump + topBump + spread, 52, leagueKey === "liga1" ? 91 : leagueKey === "liga2" ? 84 : leagueKey === "liga3" ? 78 : 74);
}
function rebalancePlayerForLeague(player, leagueKey, idx = 0) {
  const desired = softOverallForLeague(player.pos, leagueKey, idx);
  const old = Math.max(1, player.overall || desired);
  const factor = desired / old;
  const capPotential = leagueKey === "liga1" ? 93 : leagueKey === "liga2" ? 88 : leagueKey === "liga3" ? 84 : 82;
  const rare = (player.rarePotential || Math.random() < (leagueKey === "liga1" ? 0.018 : 0.012)) && desired < 90;
  const next = { ...player, overall: desired, rarePotential: rare };
  ["pace", "shoot", "pass", "dribble", "defend", "stamina"].forEach((k) => { next[k] = clamp(Math.round((player[k] || old) * factor + rng(-2, 2)), 10, 99); });
  next.potential = clamp(Math.max(desired, desired + (rare ? rng(6, 12) : rng(1, 6))), desired, rare ? Math.max(capPotential, desired + 1) : Math.min(capPotential, 86));
  if (desired >= 90 && !rare) next.overall = 89;
  return recalcPlayerValue(next, player.teamId);
}
function rebalanceTeamForLeague(team, leagueKey) {
  const players = (team.players || []).map((p, idx) => rebalancePlayerForLeague({ ...p, teamId: team.id }, leagueKey, idx)).sort((a, b) => b.overall - a.overall || b.potential - a.potential);
  return { ...team, leagueKey, leagueLevel: leagueInfo(leagueKey).level, leagueName: leagueName(leagueKey), players, trophies: team.trophies || [], numberOneTitles: team.numberOneTitles || 0 };
}
function resetLeagueTable(team) {
  return { ...team, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0, form: [], seasonGF: 0, seasonGA: 0 };
}
function sortLeagueTeams(teams, leagueKey) {
  return teams.filter((t) => t.leagueKey === leagueKey).slice().sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || teamPower(b) - teamPower(a));
}
function groupedLeagueTables(teams) {
  return LEAGUE_ORDER.map((key) => ({ ...leagueInfo(key), teams: sortLeagueTeams(teams, key) }));
}
function seniorPlayers(team) { return (team?.players || []).filter((p) => !p.academy && !p.pendingArrival); }
function academyPlayers(team) { return (team?.players || []).filter((p) => p.academy); }
function teamWeeklyWage(team) { return seniorPlayers(team).reduce((sum, p) => sum + Math.max(250, p.wage || 0), 0); }
function maxAiBudgetForLeague(leagueKey) {
  return ({ liga1: 1300000, liga2: 680000, liga3: 360000, championship: 190000 })[leagueKey] || 220000;
}
function starChaos(team) {
  const stars90 = seniorPlayers(team).filter((p) => p.overall >= 90).length;
  const stars85 = seniorPlayers(team).filter((p) => p.overall >= 85).length;
  const tooMany = stars90 >= 3 || stars85 >= 8;
  return { stars90, stars85, tooMany, penalty: tooMany ? Math.min(9, (stars90 - 1) * 2.2 + Math.max(0, stars85 - 7) * 0.6) : 0 };
}
function cleanMarket(market, teams = []) {
  const owned = new Set(teams.flatMap((t) => (t.players || []).map((p) => p.id)));
  const seen = new Set();
  return (market || []).filter((p) => {
    if (!p || seen.has(p.id)) return false;
    seen.add(p.id);
    if (p.userListed) return true;
    if (p.ownerTeamId && !owned.has(p.id)) return true;
    if (p.ownerTeamId && owned.has(p.id)) return false;
    return true;
  }).map((p) => ({ ...p, value: Math.max(500, Math.round((p.value || calcMarketValue(p, p.ownerTeamId || p.teamId, p.academy)) / 500) * 500) })).slice(0, 180);
}
function buildLeagueFixtures(teams, season = 1) {
  const byLeague = Object.fromEntries(LEAGUE_ORDER.map((k) => [k, teams.filter((t) => t.leagueKey === k).map((t) => t.id)]));
  const weeks = Array.from({ length: SEASON_LENGTH_WEEKS }, () => []);
  Object.entries(byLeague).forEach(([leagueKey, ids]) => {
    const cycle = buildFixtures(ids);
    const extended = [...cycle, ...cycle.map((week) => week.map((m) => ({ homeId: m.awayId, awayId: m.homeId })))];
    extended.slice(0, 44).forEach((round, idx) => {
      round.forEach((m) => weeks[idx].push({ ...m, competition: "league", leagueKey, season }));
    });
  });
  return weeks;
}
function initialCompetitionState(season = 1) {
  return { season, numberOne: { status: "waiting", stage: "waiting", participants: [], groups: [], groupTables: {}, matches: [], knockouts: [], championId: null, championName: null, completedKeys: [] }, champions: [], records: [] };
}
function qualifiedNumberOneTeams(teams) {
  return LEAGUE_ORDER.flatMap((key) => sortLeagueTeams(teams, key).slice(0, 5));
}
function makeGroupTable(ids) { return Object.fromEntries(ids.map((id) => [id, { id, pts: 0, gf: 0, ga: 0, w: 0, d: 0, l: 0 }])); }
function updateMiniTable(table, result) {
  const next = { ...(table || {}) };
  const apply = (id, gf, ga) => {
    const row = next[id] || { id, pts: 0, gf: 0, ga: 0, w: 0, d: 0, l: 0 };
    const win = gf > ga;
    const draw = gf === ga;
    next[id] = { ...row, pts: row.pts + (win ? 3 : draw ? 1 : 0), gf: row.gf + gf, ga: row.ga + ga, w: row.w + (win ? 1 : 0), d: row.d + (draw ? 1 : 0), l: row.l + (!win && !draw ? 1 : 0) };
  };
  apply(result.homeId, result.homeGoals, result.awayGoals);
  apply(result.awayId, result.awayGoals, result.homeGoals);
  return next;
}
function sortMiniTable(table) {
  return Object.values(table || {}).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
}
function makeRoundRobinRounds(ids) {
  const list = [...ids];
  if (list.length % 2) list.push(null);
  const n = list.length;
  const rounds = [];
  for (let r = 0; r < n - 1; r += 1) {
    const week = [];
    for (let i = 0; i < n / 2; i += 1) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) week.push({ homeId: r % 2 ? b : a, awayId: r % 2 ? a : b });
    }
    rounds.push(week);
    list.splice(1, 0, list.pop());
  }
  return rounds;
}
function createNumberOneTournament(teams, season) {
  const participants = qualifiedNumberOneTeams(teams);
  const seeded = participants.slice().sort((a, b) => teamPower(b) - teamPower(a));
  const groups = [0, 1, 2, 3].map((i) => ({ key: String.fromCharCode(65 + i), teamIds: [] }));
  seeded.forEach((t, i) => groups[i % 4].teamIds.push(t.id));
  const groupTables = Object.fromEntries(groups.map((g) => [g.key, makeGroupTable(g.teamIds)]));
  const matches = [];
  groups.forEach((g) => {
    const rounds = makeRoundRobinRounds(g.teamIds).slice(0, NUMBER_ONE_WEEKS.groups.length);
    rounds.forEach((round, idx) => round.forEach((m, j) => matches.push({ ...m, key: `no1-${season}-g${g.key}-${idx}-${j}`, competition: "numberOne", cupName: "Number 1 Championship", stage: "Group", group: g.key, week: NUMBER_ONE_WEEKS.groups[idx], season })));
  });
  return { status: "active", stage: "groups", participants: participants.map((t) => t.id), groups, groupTables, matches, knockouts: [], championId: null, championName: null, completedKeys: [] };
}
function ensureNumberOneState(state, teams, week, season) {
  let next = state?.season === season ? clone(state) : initialCompetitionState(season);
  if (week >= NUMBER_ONE_WEEKS.groups[0] && next.numberOne?.status === "waiting") {
    next.numberOne = createNumberOneTournament(teams, season);
  }
  return next;
}
function numberOneFixturesForWeek(state, week) {
  const no1 = state?.numberOne;
  if (!no1 || no1.status === "waiting") return [];
  return [...(no1.matches || []), ...(no1.knockouts || [])].filter((m) => m.week === week && !(no1.completedKeys || []).includes(m.key));
}
function numberOneMyFixture(state, week) {
  return numberOneFixturesForWeek(state, week).find((m) => m.homeId === MY_TEAM_ID || m.awayId === MY_TEAM_ID) || null;
}
function createNumberOneKnockouts(no1, teams, season) {
  const winners = (no1.groups || []).map((g) => sortMiniTable(no1.groupTables?.[g.key] || {}).slice(0, 1)[0]).filter(Boolean);
  const semiTeams = winners.slice().sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga)).slice(0, 4).map((r) => r.id);
  if (semiTeams.length < 4) return [];
  return [
    { key: `no1-${season}-semi-1`, competition: "numberOne", cupName: "Number 1 Championship", stage: "Semi Final", week: NUMBER_ONE_WEEKS.semi, homeId: semiTeams[0], awayId: semiTeams[3], season },
    { key: `no1-${season}-semi-2`, competition: "numberOne", cupName: "Number 1 Championship", stage: "Semi Final", week: NUMBER_ONE_WEEKS.semi, homeId: semiTeams[1], awayId: semiTeams[2], season },
  ];
}
function createNumberOneFinal(no1, results, season) {
  const winners = (results || []).filter((r) => r.competition === "numberOne" && r.stage === "Semi Final").map((r) => r.homeGoals >= r.awayGoals ? r.homeId : r.awayId);
  if (winners.length < 2) return [];
  return [{ key: `no1-${season}-final`, competition: "numberOne", cupName: "Number 1 Championship", stage: "Final", week: NUMBER_ONE_WEEKS.final, homeId: winners[0], awayId: winners[1], season }];
}
function updateNumberOneState(state, teams, week, results, season) {
  let next = ensureNumberOneState(state, teams, week, season);
  const no1 = next.numberOne;
  if (!no1 || no1.status === "waiting") return next;
  const completed = new Set(no1.completedKeys || []);
  (results || []).filter((r) => r.competition === "numberOne").forEach((r) => {
    if (r.matchKey) completed.add(r.matchKey);
    if (r.stage === "Group" && r.group) no1.groupTables = { ...no1.groupTables, [r.group]: updateMiniTable(no1.groupTables?.[r.group], r) };
  });
  no1.completedKeys = [...completed];
  if (week >= NUMBER_ONE_WEEKS.groups.at(-1) && no1.stage === "groups") {
    no1.knockouts = createNumberOneKnockouts(no1, teams, season);
    no1.stage = "semi";
  }
  if (week >= NUMBER_ONE_WEEKS.semi && no1.stage === "semi") {
    const finals = createNumberOneFinal(no1, results, season);
    if (finals.length) {
      no1.knockouts = [...(no1.knockouts || []), ...finals];
      no1.stage = "final";
    }
  }
  const finalResult = (results || []).find((r) => r.competition === "numberOne" && r.stage === "Final");
  if (finalResult && no1.stage === "final") {
    const champId = finalResult.homeGoals >= finalResult.awayGoals ? finalResult.homeId : finalResult.awayId;
    const champ = teams.find((t) => t.id === champId);
    no1.stage = "done";
    no1.status = "finished";
    no1.championId = champId;
    no1.championName = champ?.name || "Juara";
    next.champions = [{ season, competition: "Number 1 Championship", championId: champId, championName: champ?.name || "Juara" }, ...(next.champions || [])].slice(0, 40);
  }
  next.numberOne = no1;
  return next;
}
const WORLD_EXTERNAL_CLUBS = ["Aurora Madrid", "London Royal Foxes", "Munich Adler", "Sao Paulo Eclipse", "Miami Meteors", "Riyadh Galaxy", "Johannesburg Gold", "Casablanca Lions", "Shanghai Dragons", "Melbourne Crown", "Oslo Polar", "Santiago Andes", "Istanbul Crescent", "Zurich Alpine", "Dublin Shamrocks"];
const SPECIAL_CUP_CONFIGS = [
  { competition: "domesticCup", cupName: "National Cup", icon: "🏅", weeks: [8, 16, 24, 32], stages: ["Round 32", "Quarter Final", "Semi Final", "Final"], minRank: 12, prize: 140000, prestige: 3, note: "Piala domestik per liga. Juara mendapat tanda NC dan fans trust." },
  { competition: "leagueCup", cupName: "League Cup", icon: "🏵️", weeks: [20, 42, 58], stages: ["Quarter Final", "Semi Final", "Final"], minRank: 10, prize: 125000, prestige: 2, note: "Cup rotasi, cocok untuk pemain cadangan." },
  { competition: "champions", cupName: "Champions Cup", icon: "🌟", weeks: [34, 42, 50, 58], stages: ["Group Elite", "Quarter Final", "Semi Final", "Final"], minRank: 4, prize: 450000, prestige: 6, note: "Top 4 tiap liga. Hadiah dan reputasi besar." },
  { competition: "clubWorld", cupName: "Club World Series", icon: "🌍", weeks: [46, 59], stages: ["Semi Final", "Final"], minRank: 2, prize: 750000, prestige: 8, note: "Turnamen global klub elite." },
  { competition: "superCup", cupName: "Super Cup", icon: "⚡", weeks: [60], stages: ["Final"], minRank: 1, prize: 650000, prestige: 7, note: "Final bergengsi untuk juara liga sementara." },
];
const LEAGUE_CHAMPIONSHIP_NAMES = {
  liga1: "Elite Shield Championship",
  liga2: "Promotion Masters Championship",
  liga3: "Rising League Championship",
  championship: "Founders Road Championship",
};
const LEAGUE_CHAMPIONSHIP_IMPACT = {
  liga1: "Badge ESC, sponsor elite, gengsi global, dan daya tarik pemain bintang naik.",
  liga2: "Badge PMC, promosi makin dipercaya, fan trust naik, dan sponsor regional tertarik.",
  liga3: "Badge RLC, reputasi pembangunan naik, akademi lebih mudah viral.",
  championship: "Badge FRC, tanda klub pendaki dari bawah, morale dan fans lokal ikut naik.",
};
const WORLD_CUP_CHAMPIONSHIP = { competition: "worldCupChampionship", cupName: "World Cup Championship", icon: "🏆🌍", weeks: [6, 30, 45, 60], stages: ["Group Clash", "Quarter Final", "Semi Final", "Final"], minRank: 3, prize: 1800000, prestige: 12, note: "Spesial tiap 3 season: top 3 tiap liga + 15 klub undangan dunia." };
function worldCupSeasonActive(season) { return season === 1 || season % 3 === 1; }
function specialCupByWeek(week, season) {
  const cup = SPECIAL_CUP_CONFIGS.find((c) => c.weeks.includes(week));
  if (cup) return { ...cup, stage: cup.stages[cup.weeks.indexOf(week)] || "Round" };
  if (worldCupSeasonActive(season) && WORLD_CUP_CHAMPIONSHIP.weeks.includes(week)) return { ...WORLD_CUP_CHAMPIONSHIP, stage: WORLD_CUP_CHAMPIONSHIP.stages[WORLD_CUP_CHAMPIONSHIP.weeks.indexOf(week)] || "Round" };
  return null;
}
function rankInLeague(teams, teamId) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return 99;
  return sortLeagueTeams(teams, team.leagueKey).findIndex((t) => t.id === teamId) + 1 || 99;
}
function eligibleCupTeams(teams, cup, teamId = MY_TEAM_ID) {
  const my = teams.find((t) => t.id === teamId);
  if (!my) return [];
  if (cup.competition === "worldCupChampionship") return LEAGUE_ORDER.flatMap((key) => sortLeagueTeams(teams, key).slice(0, 3));
  return sortLeagueTeams(teams, my.leagueKey).slice(0, cup.minRank || 12);
}
function makeExternalTeam(seed, strength = 84) {
  const name = WORLD_EXTERNAL_CLUBS[Math.abs(seed) % WORLD_EXTERNAL_CLUBS.length];
  const team = { id: seed, name, city: "Undangan Dunia", color: ["#e63946", "#2a9d8f", "#5e7ce2", "#e9c46a", "#9b5de5"][Math.abs(seed) % 5], fans: 90000 + Math.abs(seed % 50000), style: pick(AI_STYLE_POOL), leagueKey: "world", leagueLevel: 0, leagueName: "World Invite", rivalId: null, players: [], preferredFormation: pick(Object.keys(FORMATIONS)), wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0, form: [], morale: 82, budget: 2500000, wagePressure: 0, growthScore: strength, aiNews: [], transferPolicy: "World", trophies: [] };
  BASE_POSITIONS.forEach((pos, i) => team.players.push(recalcPlayerValue(genPlayer(pos, seed, Math.round((strength - 70) / 3) + rng(-1, 2)), seed)));
  for (let i = 0; i < 14; i += 1) team.players.push(recalcPlayerValue(genPlayer(pick(EXTRA_POSITIONS), seed, Math.round((strength - 72) / 4) + rng(-3, 1)), seed));
  team.players = team.players.map((p) => ({ ...p, teamId: seed, sourceClub: name, scouted: false })).sort((a, b) => b.overall - a.overall);
  return team;
}
function teamForFixture(teams, id, season = 1, stage = "") {
  return teams.find((t) => t.id === id) || makeExternalTeam(Number(id) || -999, stage === "Final" ? 88 + season : 82 + season);
}
function makeSpecialCompetitionFixture(teams, week, season, teamId = MY_TEAM_ID) {
  const cup = specialCupByWeek(week, season);
  if (!cup) return null;
  const rank = rankInLeague(teams, teamId);
  if (rank > (cup.minRank || 99)) return null;
  const eligible = eligibleCupTeams(teams, cup, teamId).filter((t) => t.id !== teamId);
  let opponent = null;
  const seed = Math.abs(season * 7919 + week * 313 + teamId * 17);
  if (cup.competition === "worldCupChampionship" && seed % 100 < 55) {
    const extId = -10000 - season * 100 - week - (seed % WORLD_EXTERNAL_CLUBS.length);
    opponent = { id: extId, name: WORLD_EXTERNAL_CLUBS[Math.abs(extId) % WORLD_EXTERNAL_CLUBS.length], external: true };
  } else {
    const pool = eligible.length ? eligible : teams.filter((t) => t.id !== teamId);
    opponent = pool[seed % Math.max(1, pool.length)] || teams.find((t) => t.id !== teamId);
  }
  if (!opponent) return null;
  const homeUser = seed % 3 !== 0;
  const key = `${cup.competition}-${season}-${week}-${teamId}-${opponent.id}`;
  return { key, competition: cup.competition, cupName: cup.cupName, stage: cup.stage, icon: cup.icon, leagueKey: teams.find((t) => t.id === teamId)?.leagueKey, homeId: homeUser ? teamId : opponent.id, awayId: homeUser ? opponent.id : teamId, homeName: homeUser ? null : opponent.name, awayName: homeUser ? opponent.name : null, externalOpponent: opponent.external || opponent.id < 0, prestige: cup.prestige, prize: cup.prize, note: cup.note, season };
}
function competitionFixtureForTeam(competitionState, week, teams = [], season = 1, teamId = MY_TEAM_ID) {
  return numberOneMyFixture(competitionState, week) || makeSpecialCompetitionFixture(teams, week, season, teamId);
}
function fixtureDayOffset(fixture) {
  const comp = fixture?.competition || "league";
  const map = { league: 0, domesticCup: 3, leagueCup: 2, champions: 4, clubWorld: 5, superCup: 6, worldCupChampionship: 5, numberOne: 4 };
  return map[comp] ?? 4;
}
function fixtureUniqueKey(fixture) {
  if (!fixture) return "";
  return fixture.key || `${fixture.competition || "league"}-${fixture.season || ""}-${fixture.week || ""}-${fixture.homeId}-${fixture.awayId}`;
}
function resultUniqueKey(result) {
  if (!result) return "";
  return result.matchKey || `${result.competition || "league"}-${result.season || ""}-${result.week || ""}-${result.homeId}-${result.awayId}`;
}
function fixtureAlreadyPlayed(log = [], fixture) {
  const fKey = fixtureUniqueKey(fixture);
  return (log || []).some((r) => {
    if (!r || r.week !== fixture.week) return false;
    if (r.matchKey && fKey && r.matchKey === fKey) return true;
    return (r.competition || "league") === (fixture.competition || "league") && r.homeId === fixture.homeId && r.awayId === fixture.awayId;
  });
}
function userFixturesForWeek(competitionState, fixtureCalendar, teams, week, season, teamId = MY_TEAM_ID) {
  const fixtures = [];
  const leagueFix = (fixtureCalendar?.[week - 1] || []).find((m) => m.homeId === teamId || m.awayId === teamId);
  if (leagueFix) fixtures.push({ ...leagueFix, competition: leagueFix.competition || "league", week, season, matchDayOffset: 0 });
  const compFix = competitionFixtureForTeam(competitionState, week, teams, season, teamId);
  if (compFix) fixtures.push({ ...compFix, week, season, matchDayOffset: fixtureDayOffset(compFix) });
  const seen = new Set();
  return fixtures
    .filter((f) => { const key = fixtureUniqueKey(f); if (seen.has(key)) return false; seen.add(key); return true; })
    .sort((a, b) => fixtureDayOffset(a) - fixtureDayOffset(b));
}
function remainingUserFixturesAfter(competitionState, fixtureCalendar, teams, week, season, log = [], justPlayed = null, teamId = MY_TEAM_ID) {
  const playedKey = resultUniqueKey(justPlayed);
  return userFixturesForWeek(competitionState, fixtureCalendar, teams, week, season, teamId).filter((f) => {
    if (fixtureUniqueKey(f) === playedKey) return false;
    if (justPlayed && (f.competition || "league") === (justPlayed.competition || "league") && f.homeId === justPlayed.homeId && f.awayId === justPlayed.awayId) return false;
    return !fixtureAlreadyPlayed(log, f);
  });
}
function simulateCompetitionFixturesForWeek(state, teams, week, userResult = null) {
  const fixtures = numberOneFixturesForWeek(state, week);
  return fixtures.map((f) => {
    if (userResult && userResult.matchKey === f.key) return userResult;
    const home = teamForFixture(teams, f.homeId, f.season, f.stage);
    const away = teamForFixture(teams, f.awayId, f.season, f.stage);
    if (!home || !away) return null;
    return simulateOtherMatch(home, away, week, f);
  }).filter(Boolean);
}

function competitionPrizeForResult(result, teamId) {
  if (!result?.competition || result.competition === "league") return 0;
  const won = (result.homeId === teamId && result.homeGoals >= result.awayGoals) || (result.awayId === teamId && result.awayGoals >= result.homeGoals);
  if (result.competition === "numberOne") {
    if (result.stage === "Final") return won ? 600000 : 220000;
    if (result.stage === "Semi Final") return won ? 220000 : 95000;
    return won ? 65000 : 25000;
  }
  if (result.competition === "worldCupChampionship") {
    if (result.stage === "Final") return won ? 1800000 : 650000;
    if (result.stage === "Semi Final") return won ? 720000 : 260000;
    return won ? 320000 : 120000;
  }
  if (["champions", "clubWorld", "superCup"].includes(result.competition)) {
    if (result.stage === "Final") return won ? 750000 : 260000;
    return won ? 280000 : 95000;
  }
  if (["domesticCup", "leagueCup"].includes(result.competition)) return won ? 145000 : 42000;
  return won ? 65000 : 22000;
}
function competitionPrestigeImpact(result, won) {
  if (!result?.competition || result.competition === "league") return 0;
  if (result.competition === "worldCupChampionship") return won ? 12 : 3;
  if (result.competition === "numberOne") return won ? 7 : 2;
  if (["champions", "clubWorld", "superCup"].includes(result.competition)) return won ? 6 : 2;
  return won ? 3 : 1;
}
function trophyMarkForResult(result) {
  if (!result || result.stage !== "Final") return null;
  const map = { numberOne: "NO.1", worldCupChampionship: "WCC", champions: "CH", clubWorld: "CWS", superCup: "SC", domesticCup: "NC", leagueCup: "LCUP" };
  return map[result.competition] || "CUP";
}
function matchIncomeMultiplier(competition) {
  if (competition === "worldCupChampionship") return 3.6;
  if (competition === "numberOne") return 2.3;
  if (["champions", "clubWorld", "superCup"].includes(competition)) return 1.9;
  if (competition === "domesticCup" || competition === "leagueCup") return 1.35;
  return 1;
}
function broadRandomNews(teams, week, season) {
  const t = pick(teams);
  const p = pick((t.players || []).slice(0, 18));
  const templates = [
    { tag: "Rumor Besar", icon: "🗞️", title: `${firstName(p?.name)} jadi buah bibir media`, body: `${t.name} menolak bicara soal masa depan ${p?.pos || "pemain"} itu. Harga bisa bergerak saat transfer window dibuka.` },
    { tag: "Ruang Ganti", icon: "🚪", title: `${t.name} menjaga harmoni skuad`, body: `Coach menegaskan pemain bintang harus tetap disiplin. Terlalu banyak 90+ bisa membuat tim berantakan.` },
    { tag: "Scout Viral", icon: "🔭", title: `Talenta tersembunyi terlihat di pekan ${week}`, body: `Beberapa scout melaporkan pemain U21 berpotensi tinggi. 85+ tetap langka, jadi kabar seperti ini patut ditunggu.` },
    { tag: "Taktik Dunia", icon: "📊", title: `Tren ${pick(AI_STYLE_POOL)} sedang naik`, body: `Klub AI dapat mengubah gaya main setelah rentetan hasil buruk atau momentum bagus.` },
    { tag: "Finansial", icon: "💼", title: `Board klub mulai menghitung wage`, body: `Budget tidak bisa membesar liar karena gaji mingguan dan batas liga sekarang aktif.` },
  ];
  return { id: `broad-${season}-${week}-${Math.random().toString(36).slice(2)}`, week, season, ...pick(templates) };
}

function managerFromPreset(key) {
  const c = COACH_PRESETS.find((x) => x.key === key) || COACH_PRESETS[0];
  return { name: c.name, style: c.style, reputation: c.reputation, boardTrust: c.boardTrust, fanTrust: c.fanTrust };
}

const CLUB_DATA = [
  [1, "FC Nusantara", "Jakarta", "#e63946", 60000, "Possession"],
  [2, "Tokyo Ravens", "Tokyo/Jepang", "#f4a261", 57000, "High Press"],
  [3, "Lisbon Mariners", "Lisbon/Portugal", "#2a9d8f", 53000, "Counter"],
  [4, "Seoul Tigers", "Seoul/Korea", "#e9c46a", 50000, "Long Ball"],
  [5, "Cairo Pharaohs", "Cairo/Mesir", "#a8dadc", 43000, "Park Bus"],
  [6, "Buenos Aires Azul", "Buenos Aires/Argentina", "#ffb703", 45500, "Wing Play"],
  [7, "Krakatau City", "Cilegon", "#fb8500", 39000, "Physical"],
  [8, "Lagos United", "Lagos/Nigeria", "#90be6d", 42000, "Chaos"],
  [9, "Vancouver North", "Vancouver/Kanada", "#c77dff", 34000, "Counter"],
  [10, "Celebes United", "Makassar", "#48cae4", 45500, "Possession"],
  [11, "Bali Phoenix", "Denpasar", "#ff006e", 47000, "Wing Play"],
  [12, "Stockholm Wolves", "Stockholm/Swedia", "#ffd166", 37000, "High Press"],
  [13, "Nairobi Kings", "Nairobi/Kenya", "#06d6a0", 30500, "Long Ball"],
  [14, "Doha Falcons", "Doha/Qatar", "#118ab2", 32000, "Park Bus"],
  [15, "Solo Knights", "Solo", "#ef476f", 36500, "Physical"],
  [16, "Sydney Harbor FC", "Sydney/Australia", "#8ecae6", 31500, "Chaos"],
  [17, "Batavia Crown", "Jakarta", "#ff595e", 58000, "Tiki Taka"],
  [18, "Cape Town Waves", "Cape Town/Afrika Selatan", "#1982c4", 41000, "Possession"],
  [19, "Bekasi Iron", "Bekasi", "#6a4c93", 39500, "Physical"],
  [20, "Mexico City Meteors", "Mexico City/Meksiko", "#8ac926", 36000, "High Press"],
  [21, "Marrakesh Atlas", "Marrakesh/Maroko", "#00b4d8", 33500, "Counter"],
  [22, "Minang Warriors", "Padang", "#ffca3a", 35000, "Wing Play"],
  [23, "Prague Lions", "Prague/Ceko", "#8338ec", 28500, "Long Ball"],
  [24, "Palembang River", "Palembang", "#3a86ff", 37000, "Tiki Taka"],
  [25, "Osaka Blazers", "Osaka/Jepang", "#06d6a0", 30000, "Park Bus"],
  [26, "Banjar Emerald", "Banjarmasin", "#2ec4b6", 31500, "Chaos"],
  [27, "Reykjavik Aurora", "Reykjavik/Islandia", "#ff9f1c", 24500, "Counter"],
  [28, "Ambon Spice", "Ambon", "#bc6c25", 26000, "Possession"],
  [29, "Manila Comets", "Manila/Filipina", "#0077b6", 28000, "Wing Play"],
  [30, "Ternate Volcano", "Ternate", "#d62828", 22500, "Physical"],
  [31, "Lombok Galaxy", "Mataram", "#7209b7", 30000, "High Press"],
  [32, "Glasgow Forge", "Glasgow/Skotlandia", "#4cc9f0", 29000, "Long Ball"],
  [33, "Pati Guardians", "Pati", "#ffafcc", 25500, "Possession"],
  [34, "Kigali Stars", "Kigali/Rwanda", "#bde0fe", 33500, "Wing Play"],
  [35, "Milan Navigli", "Milan/Italia", "#a2d2ff", 24500, "Counter"],
  [36, "Ponorogo Reog", "Ponorogo", "#ffc8dd", 23500, "Physical"],
  [37, "Helsinki Frost", "Helsinki/Finlandia", "#cdb4db", 27500, "Park Bus"],
  [38, "Banyuwangi Bulls", "Banyuwangi", "#90dbf4", 26500, "High Press"],
  [39, "Karachi Royals", "Karachi/Pakistan", "#f7a072", 32000, "Long Ball"],
  [40, "Depok Wolves", "Depok", "#6dd3ce", 30000, "Chaos"],
  [41, "Valencia Solaris", "Valencia/Spanyol", "#f4d35e", 28500, "Tiki Taka"],
  [42, "Sukabumi Atlas", "Sukabumi", "#ee964b", 27000, "Counter"],
  [43, "Palu Eagles", "Palu", "#0ead69", 24500, "Wing Play"],
  [44, "Gorontalo Moon", "Gorontalo", "#4361ee", 23000, "Possession"],
  [45, "Dubai Crescent", "Dubai/UEA", "#ff477e", 22000, "Long Ball"],
  [46, "Serang Spartans", "Serang", "#ffd60a", 32500, "High Press"],
  [47, "Bogota Verde", "Bogota/Kolombia", "#00bbf9", 25500, "Physical"],
  [48, "Probolinggo Comets", "Probolinggo", "#9b5de5", 24500, "Chaos"],
];


const LAN_REAL_CLUBS = [
  { key: "man-city", name: "Manchester City", country: "Inggris", color: "#6cabdd", style: "Possession" },
  { key: "arsenal", name: "Arsenal", country: "Inggris", color: "#ef0107", style: "High Press" },
  { key: "liverpool", name: "Liverpool", country: "Inggris", color: "#c8102e", style: "Counter" },
  { key: "man-united", name: "Manchester United", country: "Inggris", color: "#da291c", style: "Physical" },
  { key: "chelsea", name: "Chelsea", country: "Inggris", color: "#034694", style: "Tiki Taka" },
  { key: "tottenham", name: "Tottenham Hotspur", country: "Inggris", color: "#132257", style: "Wing Play" },
  { key: "real-madrid", name: "Real Madrid", country: "Spanyol", color: "#f4f4f4", style: "Tiki Taka" },
  { key: "barcelona", name: "Barcelona", country: "Spanyol", color: "#a50044", style: "Possession" },
  { key: "atletico", name: "Atletico Madrid", country: "Spanyol", color: "#cb3524", style: "Park Bus" },
  { key: "sevilla", name: "Sevilla", country: "Spanyol", color: "#d71920", style: "Wing Play" },
  { key: "valencia", name: "Valencia", country: "Spanyol", color: "#f37021", style: "Counter" },
  { key: "psg", name: "Paris Saint-Germain", country: "Paris/Prancis", color: "#004170", style: "Chaos" },
  { key: "bayern", name: "Bayern Munich", country: "Jerman", color: "#dc052d", style: "High Press" },
  { key: "dortmund", name: "Borussia Dortmund", country: "Jerman", color: "#fde100", style: "Counter" },
  { key: "leverkusen", name: "Bayer Leverkusen", country: "Jerman", color: "#e32221", style: "Tiki Taka" },
  { key: "leipzig", name: "RB Leipzig", country: "Jerman", color: "#dd0741", style: "High Press" },
  { key: "juventus", name: "Juventus", country: "Italia", color: "#111111", style: "Physical" },
  { key: "inter", name: "Inter Milan", country: "Italia", color: "#0068a8", style: "Counter" },
  { key: "milan", name: "AC Milan", country: "Italia", color: "#fb090b", style: "Wing Play" },
  { key: "napoli", name: "Napoli", country: "Italia", color: "#12a0d7", style: "Possession" },
  { key: "roma", name: "AS Roma", country: "Italia", color: "#8e1f2f", style: "Long Ball" },
  { key: "al-hilal", name: "Al Hilal", country: "Arab Saudi", color: "#005baa", style: "Possession" },
  { key: "al-nassr", name: "Al Nassr", country: "Arab Saudi", color: "#f9d71c", style: "Chaos" },
  { key: "al-ittihad", name: "Al Ittihad", country: "Arab Saudi", color: "#f6c500", style: "Physical" },
  { key: "al-ahli", name: "Al Ahli Saudi", country: "Arab Saudi", color: "#00843d", style: "Wing Play" },
  { key: "persib", name: "Persib Bandung", country: "Indonesia", color: "#005baa", style: "Possession" },
  { key: "persija", name: "Persija Jakarta", country: "Indonesia", color: "#f15b2a", style: "High Press" },
  { key: "bali-united", name: "Bali United", country: "Indonesia", color: "#b50000", style: "Tiki Taka" },
  { key: "arema", name: "Arema FC", country: "Indonesia", color: "#0b4ea2", style: "Physical" },
  { key: "persebaya", name: "Persebaya Surabaya", country: "Indonesia", color: "#01843f", style: "Wing Play" },
];


// Khusus mode Multiplayer LAN: klub boleh memakai nama klub dan nama pemain asli.
// Career tetap memakai sistem generated/balanced agar mode jangka panjang tetap fair.
// Catatan: ini roster LAN statis untuk game lokal, bukan sinkron database transfer real-time.
const LAN_REAL_SQUADS = {
  "man-city": [
    ["GK", "Ederson"], ["RB", "Kyle Walker"], ["CB", "Ruben Dias"], ["CB", "John Stones"], ["LB", "Josko Gvardiol"],
    ["CDM", "Rodri"], ["CM", "Bernardo Silva"], ["CM", "Kevin De Bruyne"], ["RW", "Phil Foden"], ["LW", "Jeremy Doku"], ["ST", "Erling Haaland"],
    ["GK", "Stefan Ortega"], ["CB", "Nathan Ake"], ["CM", "Mateo Kovacic"], ["CM", "Ilkay Gundogan"], ["LW", "Jack Grealish"], ["RW", "Savinho"], ["ST", "Julian Alvarez"]
  ],
  "arsenal": [
    ["GK", "David Raya"], ["RB", "Ben White"], ["CB", "William Saliba"], ["CB", "Gabriel Magalhaes"], ["LB", "Jurrien Timber"],
    ["CDM", "Declan Rice"], ["CM", "Martin Odegaard"], ["CM", "Thomas Partey"], ["RW", "Bukayo Saka"], ["LW", "Gabriel Martinelli"], ["ST", "Kai Havertz"],
    ["GK", "Aaron Ramsdale"], ["LB", "Oleksandr Zinchenko"], ["CB", "Jakub Kiwior"], ["CM", "Mikel Merino"], ["CAM", "Leandro Trossard"], ["LW", "Raheem Sterling"], ["ST", "Gabriel Jesus"]
  ],
  "liverpool": [
    ["GK", "Alisson Becker"], ["RB", "Trent Alexander-Arnold"], ["CB", "Virgil van Dijk"], ["CB", "Ibrahima Konate"], ["LB", "Andrew Robertson"],
    ["CDM", "Wataru Endo"], ["CM", "Alexis Mac Allister"], ["CM", "Dominik Szoboszlai"], ["RW", "Mohamed Salah"], ["LW", "Luis Diaz"], ["ST", "Darwin Nunez"],
    ["GK", "Caoimhin Kelleher"], ["CB", "Joe Gomez"], ["LB", "Kostas Tsimikas"], ["CM", "Ryan Gravenberch"], ["RW", "Harvey Elliott"], ["LW", "Cody Gakpo"], ["ST", "Diogo Jota"]
  ],
  "man-united": [
    ["GK", "Andre Onana"], ["RB", "Diogo Dalot"], ["CB", "Lisandro Martinez"], ["CB", "Harry Maguire"], ["LB", "Luke Shaw"],
    ["CDM", "Casemiro"], ["CM", "Kobbie Mainoo"], ["CAM", "Bruno Fernandes"], ["RW", "Alejandro Garnacho"], ["LW", "Marcus Rashford"], ["ST", "Rasmus Hojlund"],
    ["GK", "Altay Bayindir"], ["CB", "Matthijs de Ligt"], ["CB", "Leny Yoro"], ["CM", "Christian Eriksen"], ["CM", "Mason Mount"], ["RW", "Antony"], ["ST", "Joshua Zirkzee"]
  ],
  "chelsea": [
    ["GK", "Robert Sanchez"], ["RB", "Reece James"], ["CB", "Levi Colwill"], ["CB", "Wesley Fofana"], ["LB", "Marc Cucurella"],
    ["CDM", "Moises Caicedo"], ["CM", "Enzo Fernandez"], ["CAM", "Cole Palmer"], ["RW", "Noni Madueke"], ["LW", "Mykhailo Mudryk"], ["ST", "Nicolas Jackson"],
    ["GK", "Filip Jorgensen"], ["CB", "Tosin Adarabioyo"], ["RB", "Malo Gusto"], ["CM", "Romeo Lavia"], ["CAM", "Christopher Nkunku"], ["LW", "Pedro Neto"], ["ST", "Marc Guiu"]
  ],
  "tottenham": [
    ["GK", "Guglielmo Vicario"], ["RB", "Pedro Porro"], ["CB", "Cristian Romero"], ["CB", "Micky van de Ven"], ["LB", "Destiny Udogie"],
    ["CDM", "Yves Bissouma"], ["CM", "Rodrigo Bentancur"], ["CAM", "James Maddison"], ["RW", "Dejan Kulusevski"], ["LW", "Son Heung-min"], ["ST", "Richarlison"],
    ["GK", "Fraser Forster"], ["CB", "Radu Dragusin"], ["CM", "Pape Matar Sarr"], ["CM", "Archie Gray"], ["RW", "Brennan Johnson"], ["LW", "Timo Werner"], ["ST", "Dominic Solanke"]
  ],
  "real-madrid": [
    ["GK", "Thibaut Courtois"], ["RB", "Dani Carvajal"], ["CB", "Eder Militao"], ["CB", "Antonio Rudiger"], ["LB", "Ferland Mendy"],
    ["CDM", "Aurelien Tchouameni"], ["CM", "Federico Valverde"], ["CAM", "Jude Bellingham"], ["RW", "Rodrygo"], ["LW", "Vinicius Junior"], ["ST", "Kylian Mbappe"],
    ["GK", "Andriy Lunin"], ["CB", "David Alaba"], ["CM", "Eduardo Camavinga"], ["CM", "Luka Modric"], ["CAM", "Brahim Diaz"], ["ST", "Endrick"], ["RW", "Arda Guler"]
  ],
  "barcelona": [
    ["GK", "Marc-Andre ter Stegen"], ["RB", "Jules Kounde"], ["CB", "Ronald Araujo"], ["CB", "Pau Cubarsi"], ["LB", "Alejandro Balde"],
    ["CDM", "Frenkie de Jong"], ["CM", "Pedri"], ["CM", "Gavi"], ["RW", "Lamine Yamal"], ["LW", "Raphinha"], ["ST", "Robert Lewandowski"],
    ["GK", "Inaki Pena"], ["CB", "Andreas Christensen"], ["LB", "Gerard Martin"], ["CM", "Fermin Lopez"], ["CAM", "Dani Olmo"], ["LW", "Ferran Torres"], ["ST", "Vitor Roque"]
  ],
  "atletico": [
    ["GK", "Jan Oblak"], ["RB", "Nahuel Molina"], ["CB", "Jose Maria Gimenez"], ["CB", "Robin Le Normand"], ["LB", "Reinildo Mandava"],
    ["CDM", "Koke"], ["CM", "Rodrigo De Paul"], ["CM", "Pablo Barrios"], ["RW", "Marcos Llorente"], ["LW", "Samuel Lino"], ["ST", "Antoine Griezmann"],
    ["GK", "Juan Musso"], ["CB", "Cesar Azpilicueta"], ["CM", "Conor Gallagher"], ["CAM", "Angel Correa"], ["ST", "Julian Alvarez"], ["ST", "Alexander Sorloth"], ["RW", "Giuliano Simeone"]
  ],
  "sevilla": [
    ["GK", "Orjan Nyland"], ["RB", "Jesus Navas"], ["CB", "Loic Bade"], ["CB", "Tanguy Nianzou"], ["LB", "Adria Pedrosa"],
    ["CDM", "Nemanja Gudelj"], ["CM", "Djibril Sow"], ["CAM", "Suso"], ["RW", "Dodi Lukebakio"], ["LW", "Lucas Ocampos"], ["ST", "Youssef En-Nesyri"],
    ["GK", "Marko Dmitrovic"], ["CB", "Kike Salas"], ["RB", "Juanlu Sanchez"], ["CM", "Joan Jordan"], ["CAM", "Oliver Torres"], ["LW", "Chidera Ejuke"], ["ST", "Isaac Romero"]
  ],
  "valencia": [
    ["GK", "Giorgi Mamardashvili"], ["RB", "Thierry Correia"], ["CB", "Cristhian Mosquera"], ["CB", "Mouctar Diakhaby"], ["LB", "Jose Gaya"],
    ["CDM", "Pepelu"], ["CM", "Javi Guerra"], ["CM", "Andre Almeida"], ["RW", "Diego Lopez"], ["LW", "Sergi Canos"], ["ST", "Hugo Duro"],
    ["GK", "Jaume Domenech"], ["CB", "Cenk Ozkacar"], ["LB", "Jesus Vazquez"], ["CM", "Hugo Guillamon"], ["CAM", "Fran Perez"], ["LW", "Luis Rioja"], ["ST", "Rafa Mir"]
  ],
  "psg": [
    ["GK", "Gianluigi Donnarumma"], ["RB", "Achraf Hakimi"], ["CB", "Marquinhos"], ["CB", "Lucas Hernandez"], ["LB", "Nuno Mendes"],
    ["CDM", "Vitinha"], ["CM", "Fabian Ruiz"], ["CM", "Warren Zaire-Emery"], ["RW", "Ousmane Dembele"], ["LW", "Bradley Barcola"], ["ST", "Goncalo Ramos"],
    ["GK", "Matvey Safonov"], ["CB", "Milan Skriniar"], ["CM", "Joao Neves"], ["CAM", "Marco Asensio"], ["LW", "Khvicha Kvaratskhelia"], ["RW", "Desire Doue"], ["ST", "Randal Kolo Muani"]
  ],
  "bayern": [
    ["GK", "Manuel Neuer"], ["RB", "Joshua Kimmich"], ["CB", "Dayot Upamecano"], ["CB", "Kim Min-jae"], ["LB", "Alphonso Davies"],
    ["CDM", "Leon Goretzka"], ["CM", "Aleksandar Pavlovic"], ["CAM", "Jamal Musiala"], ["RW", "Michael Olise"], ["LW", "Leroy Sane"], ["ST", "Harry Kane"],
    ["GK", "Sven Ulreich"], ["CB", "Eric Dier"], ["LB", "Raphael Guerreiro"], ["CM", "Konrad Laimer"], ["RW", "Serge Gnabry"], ["LW", "Kingsley Coman"], ["ST", "Thomas Muller"]
  ],
  "dortmund": [
    ["GK", "Gregor Kobel"], ["RB", "Julian Ryerson"], ["CB", "Nico Schlotterbeck"], ["CB", "Niklas Sule"], ["LB", "Ramy Bensebaini"],
    ["CDM", "Emre Can"], ["CM", "Pascal Gross"], ["CAM", "Julian Brandt"], ["RW", "Karim Adeyemi"], ["LW", "Jamie Bynoe-Gittens"], ["ST", "Serhou Guirassy"],
    ["GK", "Alexander Meyer"], ["CB", "Waldemar Anton"], ["CM", "Marcel Sabitzer"], ["CM", "Felix Nmecha"], ["RW", "Donyell Malen"], ["LW", "Giovanni Reyna"], ["ST", "Maximilian Beier"]
  ],
  "leverkusen": [
    ["GK", "Lukas Hradecky"], ["RB", "Jeremie Frimpong"], ["CB", "Jonathan Tah"], ["CB", "Edmond Tapsoba"], ["LB", "Alex Grimaldo"],
    ["CDM", "Granit Xhaka"], ["CM", "Robert Andrich"], ["CAM", "Florian Wirtz"], ["RW", "Jonas Hofmann"], ["LW", "Amine Adli"], ["ST", "Victor Boniface"],
    ["GK", "Matej Kovar"], ["CB", "Piero Hincapie"], ["CM", "Exequiel Palacios"], ["CAM", "Aleix Garcia"], ["RW", "Nathan Tella"], ["ST", "Patrik Schick"], ["LW", "Martin Terrier"]
  ],
  "leipzig": [
    ["GK", "Peter Gulacsi"], ["RB", "Benjamin Henrichs"], ["CB", "Willi Orban"], ["CB", "Castello Lukeba"], ["LB", "David Raum"],
    ["CDM", "Xaver Schlager"], ["CM", "Amadou Haidara"], ["CAM", "Xavi Simons"], ["RW", "Antonio Nusa"], ["LW", "Christoph Baumgartner"], ["ST", "Benjamin Sesko"],
    ["GK", "Maarten Vandevoordt"], ["CB", "Lukas Klostermann"], ["CM", "Nicolas Seiwald"], ["CAM", "Eljif Elmas"], ["RW", "Yussuf Poulsen"], ["ST", "Lois Openda"], ["LW", "Timo Werner"]
  ],
  "juventus": [
    ["GK", "Michele Di Gregorio"], ["RB", "Danilo"], ["CB", "Bremer"], ["CB", "Federico Gatti"], ["LB", "Andrea Cambiaso"],
    ["CDM", "Manuel Locatelli"], ["CM", "Weston McKennie"], ["CAM", "Teun Koopmeiners"], ["RW", "Francisco Conceicao"], ["LW", "Kenan Yildiz"], ["ST", "Dusan Vlahovic"],
    ["GK", "Mattia Perin"], ["CB", "Pierre Kalulu"], ["LB", "Juan Cabal"], ["CM", "Khephren Thuram"], ["CM", "Nicolo Fagioli"], ["RW", "Timothy Weah"], ["ST", "Arkadiusz Milik"]
  ],
  "inter": [
    ["GK", "Yann Sommer"], ["RB", "Denzel Dumfries"], ["CB", "Alessandro Bastoni"], ["CB", "Benjamin Pavard"], ["LB", "Federico Dimarco"],
    ["CDM", "Hakan Calhanoglu"], ["CM", "Nicolo Barella"], ["CM", "Henrikh Mkhitaryan"], ["RW", "Matteo Darmian"], ["LW", "Carlos Augusto"], ["ST", "Lautaro Martinez"],
    ["GK", "Josep Martinez"], ["CB", "Francesco Acerbi"], ["CB", "Stefan de Vrij"], ["CM", "Davide Frattesi"], ["CAM", "Kristjan Asllani"], ["ST", "Marcus Thuram"], ["ST", "Marko Arnautovic"]
  ],
  "milan": [
    ["GK", "Mike Maignan"], ["RB", "Davide Calabria"], ["CB", "Fikayo Tomori"], ["CB", "Matteo Gabbia"], ["LB", "Theo Hernandez"],
    ["CDM", "Ismael Bennacer"], ["CM", "Tijjani Reijnders"], ["CAM", "Ruben Loftus-Cheek"], ["RW", "Christian Pulisic"], ["LW", "Rafael Leao"], ["ST", "Alvaro Morata"],
    ["GK", "Marco Sportiello"], ["CB", "Malick Thiaw"], ["RB", "Emerson Royal"], ["CM", "Yunus Musah"], ["CAM", "Samuel Chukwueze"], ["ST", "Tammy Abraham"], ["LW", "Noah Okafor"]
  ],
  "napoli": [
    ["GK", "Alex Meret"], ["RB", "Giovanni Di Lorenzo"], ["CB", "Amir Rrahmani"], ["CB", "Alessandro Buongiorno"], ["LB", "Mathias Olivera"],
    ["CDM", "Stanislav Lobotka"], ["CM", "Andre-Frank Zambo Anguissa"], ["CM", "Scott McTominay"], ["RW", "Matteo Politano"], ["LW", "Khvicha Kvaratskhelia"], ["ST", "Romelu Lukaku"],
    ["GK", "Elia Caprile"], ["CB", "Juan Jesus"], ["LB", "Leonardo Spinazzola"], ["CM", "Billy Gilmour"], ["CAM", "Giacomo Raspadori"], ["LW", "David Neres"], ["ST", "Giovanni Simeone"]
  ],
  "roma": [
    ["GK", "Mile Svilar"], ["RB", "Zeki Celik"], ["CB", "Gianluca Mancini"], ["CB", "Evan Ndicka"], ["LB", "Angelino"],
    ["CDM", "Bryan Cristante"], ["CM", "Leandro Paredes"], ["CAM", "Lorenzo Pellegrini"], ["RW", "Paulo Dybala"], ["LW", "Stephan El Shaarawy"], ["ST", "Artem Dovbyk"],
    ["GK", "Mathew Ryan"], ["CB", "Mario Hermoso"], ["CM", "Manu Kone"], ["CM", "Nicola Zalewski"], ["RW", "Matias Soule"], ["LW", "Niccolo Pisilli"], ["ST", "Eldor Shomurodov"]
  ],
  "al-hilal": [
    ["GK", "Yassine Bounou"], ["RB", "Joao Cancelo"], ["CB", "Kalidou Koulibaly"], ["CB", "Ali Al-Bulaihi"], ["LB", "Renan Lodi"],
    ["CDM", "Ruben Neves"], ["CM", "Sergej Milinkovic-Savic"], ["CAM", "Malcom"], ["RW", "Salem Al-Dawsari"], ["LW", "Neymar"], ["ST", "Aleksandar Mitrovic"],
    ["GK", "Mohammed Al-Owais"], ["CB", "Hassan Tambakti"], ["CM", "Mohamed Kanno"], ["CM", "Nasser Al-Dawsari"], ["RW", "Michael"], ["LW", "Abdullah Al-Hamdan"], ["ST", "Saleh Al-Shehri"]
  ],
  "al-nassr": [
    ["GK", "Bento"], ["RB", "Sultan Al-Ghannam"], ["CB", "Aymeric Laporte"], ["CB", "Mohammed Al-Fatil"], ["LB", "Alex Telles"],
    ["CDM", "Marcelo Brozovic"], ["CM", "Otavio"], ["CAM", "Anderson Talisca"], ["RW", "Sadio Mane"], ["LW", "Ayman Yahya"], ["ST", "Cristiano Ronaldo"],
    ["GK", "Nawaf Al-Aqidi"], ["CB", "Ali Lajami"], ["CM", "Abdullah Alkhaibari"], ["CM", "Ali Al-Hassan"], ["RW", "Abdulrahman Ghareeb"], ["LW", "Wesley"], ["ST", "Mohammed Maran"]
  ],
  "al-ittihad": [
    ["GK", "Predrag Rajkovic"], ["RB", "Fawaz Al-Sqoor"], ["CB", "Luiz Felipe"], ["CB", "Hassan Kadesh"], ["LB", "Mario Mitaj"],
    ["CDM", "N'Golo Kante"], ["CM", "Fabinho"], ["CAM", "Houssem Aouar"], ["RW", "Moussa Diaby"], ["LW", "Steven Bergwijn"], ["ST", "Karim Benzema"],
    ["GK", "Abdullah Al-Mayouf"], ["CB", "Ahmed Hegazy"], ["CM", "Faisal Al-Ghamdi"], ["CM", "Saleh Al-Amri"], ["RW", "Jota"], ["LW", "Marwan Al-Sahafi"], ["ST", "Abderrazak Hamdallah"]
  ],
  "al-ahli": [
    ["GK", "Edouard Mendy"], ["RB", "Ali Majrashi"], ["CB", "Merih Demiral"], ["CB", "Roger Ibanez"], ["LB", "Bassam Al-Hurayji"],
    ["CDM", "Franck Kessie"], ["CM", "Gabri Veiga"], ["CAM", "Roberto Firmino"], ["RW", "Riyad Mahrez"], ["LW", "Allan Saint-Maximin"], ["ST", "Ivan Toney"],
    ["GK", "Abdulrahman Al-Sanbi"], ["CB", "Fahad Al-Hamad"], ["CM", "Ziyad Al-Johani"], ["CM", "Mohammed Al-Majhad"], ["RW", "Feras Al-Buraikan"], ["LW", "Sumaihan Al-Nabit"], ["ST", "Fahad Al-Rashidi"]
  ],
  "persib": [
    ["GK", "Teja Paku Alam"], ["RB", "Henhen Herdiana"], ["CB", "Nick Kuipers"], ["CB", "Kakang Rudianto"], ["LB", "Rezaldi Hehanussa"],
    ["CDM", "Marc Klok"], ["CM", "Dedi Kusnandar"], ["CAM", "Beckham Putra"], ["RW", "Ciro Alves"], ["LW", "Febri Hariyadi"], ["ST", "David da Silva"],
    ["GK", "Kevin Ray Mendoza"], ["CB", "Victor Igbonefo"], ["LB", "Edo Febriansah"], ["CM", "Rachmat Irianto"], ["CAM", "Stefano Beltrame"], ["RW", "Ryan Kurnia"], ["ST", "Dimas Drajad"]
  ],
  "persija": [
    ["GK", "Andritany Ardhiyasa"], ["RB", "Rio Fahmi"], ["CB", "Rizky Ridho"], ["CB", "Ondrej Kudela"], ["LB", "Firza Andika"],
    ["CDM", "Syahrian Abimanyu"], ["CM", "Hanif Sjahbandi"], ["CAM", "Maciej Gajos"], ["RW", "Ryo Matsumura"], ["LW", "Witan Sulaeman"], ["ST", "Marko Simic"],
    ["GK", "Cahya Supriadi"], ["CB", "Muhammad Ferarri"], ["CM", "Rayhan Hannan"], ["CM", "Resky Fandi"], ["RW", "Riko Simanjuntak"], ["LW", "Osvaldo Haay"], ["ST", "Gustavo Almeida"]
  ],
  "bali-united": [
    ["GK", "Adilson Maringa"], ["RB", "Made Andhika"], ["CB", "Haudi Abdillah"], ["CB", "Kadek Arel"], ["LB", "Ricky Fajrin"],
    ["CDM", "Brandon Wilson"], ["CM", "Eber Bessa"], ["CAM", "Mohammed Rashid"], ["RW", "Privat Mbarga"], ["LW", "Irfan Jaya"], ["ST", "Ilija Spasojevic"],
    ["GK", "Muhammad Ridho"], ["CB", "Jajang Mulyana"], ["CM", "Tegar Infantrie"], ["CM", "Fadil Sausu"], ["RW", "Rahmat Arjuna"], ["LW", "Yabes Roni"], ["ST", "Jefferson Assis"]
  ],
  "arema": [
    ["GK", "Teguh Amiruddin"], ["RB", "Achmad Figo"], ["CB", "Syaeful Anwar"], ["CB", "Julian Guevara"], ["LB", "Johan Farizi"],
    ["CDM", "Jayus Hariono"], ["CM", "Arkhan Fikri"], ["CAM", "Charles Lokolingoy"], ["RW", "Dendi Santoso"], ["LW", "Dedik Setiawan"], ["ST", "Gustavo Almeida"],
    ["GK", "Adixi Lenzivio"], ["CB", "Bagas Adi"], ["CM", "Hanis Saghara"], ["CM", "Rafli"], ["RW", "M. Rafli"], ["LW", "Ilham Udin"], ["ST", "Dalberto"]
  ],
  "persebaya": [
    ["GK", "Ernando Ari"], ["RB", "Ardi Idrus"], ["CB", "Kadek Raditya"], ["CB", "Slavko Damjanovic"], ["LB", "Reva Adi"],
    ["CDM", "Mohammad Hidayat"], ["CM", "Andre Oktaviansyah"], ["CAM", "Francisco Rivera"], ["RW", "Bruno Moreira"], ["LW", "Oktafianus Fernando"], ["ST", "Flavio Silva"],
    ["GK", "Andhika Ramadhani"], ["CB", "Rachmat Irianto"], ["CM", "M. Iqbal"], ["CM", "Ripaldy Bawuo"], ["RW", "Malik Risaldi"], ["LW", "Kasim Botan"], ["ST", "Paulo Henrique"]
  ],
};

const FIRST_NAMES = ["Arya", "Bima", "Candra", "Dani", "Eko", "Fajar", "Galih", "Hendra", "Ilham", "Joko", "Kevin", "Luthfi", "Mirza", "Nanda", "Oki", "Putra", "Rafi", "Sandi", "Tama", "Udin", "Wahyu", "Yogi", "Zaki", "Andre", "Bayu", "Rendra", "Fikri", "Aditya", "Dimas", "Reza", "Hafiz", "Arkan", "Farrel", "Rizky", "Irfan", "Yudha", "Rama", "Bagas", "Gilang", "Nabil", "Luca", "Mateo", "Noah", "Ethan", "Kai", "Leo", "Milan", "Nikolai", "Santiago", "Thiago", "Rafael", "Oscar", "Felix", "Kenji", "Hiro", "Min-Jae", "Joon", "Omar", "Youssef", "Malik", "Andre", "Diego", "Marco", "Ivan", "Arman", "Samir", "Luis", "Jonas", "Kofi", "Tariq"];
const LAST_NAMES = ["Pratama", "Santoso", "Wijaya", "Kusuma", "Ramadhan", "Hidayat", "Nugraha", "Setiawan", "Firmansyah", "Wibowo", "Susanto", "Suryadi", "Hartono", "Handoko", "Purnomo", "Gunawan", "Kurniawan", "Saputra", "Mahendra", "Perdana", "Hakim", "Nugroho", "Utama", "Prakoso", "Siregar", "Lubis", "Hasibuan", "Tanjung", "Latuconsina", "Mandagi", "Silva", "Costa", "Rossi", "Bianchi", "Garcia", "Martinez", "Kovacic", "Novak", "Muller", "Schmidt", "Tanaka", "Sato", "Kim", "Park", "Hassan", "Diallo", "Okafor", "Mensah", "Fernandez", "Santos", "Ivanov", "Petrov", "Jensen", "Olsen", "Haddad", "Alvarez", "Rivera", "Moreau", "Dubois", "Khan"];
const BASE_POSITIONS = ["GK", "LB", "CB", "CB", "RB", "CDM", "CM", "CM", "CAM", "LW", "ST", "RW"];
const EXTRA_POSITIONS = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "ST"];
const POS_LABELS = { GK: "Kiper", LB: "Bek Kiri", CB: "Bek Tengah", RB: "Bek Kanan", CDM: "Gelandang Bertahan", CM: "Gelandang", CAM: "Gelandang Serang", LM: "Sayap Kiri", RM: "Sayap Kanan", LW: "Winger Kiri", RW: "Winger Kanan", ST: "Striker" };

const ROLE_SKILLS = {
  GK: ["Save Reflex", "Sweeper Clearance", "Long Throw"],
  CB: ["Block Shot", "Body Duel", "Clearance"],
  LB: ["Overlap", "Cross", "Recovery Run"],
  RB: ["Overlap", "Cross", "Recovery Run"],
  CDM: ["Intercept", "Shield", "Break Counter"],
  CM: ["Tempo Pass", "Support Run", "Switch Play"],
  CAM: ["Through Ball", "Final Pass", "Skill Move"],
  LM: ["Wide Dribble", "Cross", "Track Back"],
  RM: ["Wide Dribble", "Cross", "Track Back"],
  LW: ["Cut Inside", "Dribble Burst", "Cross"],
  RW: ["Cut Inside", "Dribble Burst", "Cross"],
  ST: ["Finishing", "First Touch Shot", "Poacher Run"],
};
const ROLE_SKILL_ICONS = {
  "Save Reflex": "🧤", "Sweeper Clearance": "🧹", "Long Throw": "🚀", "Block Shot": "🧱", "Body Duel": "💪", Clearance: "🦶",
  Overlap: "🏃", Cross: "🎯", "Recovery Run": "↩️", Intercept: "🛡️", Shield: "🧲", "Break Counter": "⚡",
  "Tempo Pass": "🎼", "Support Run": "🤝", "Switch Play": "🔁", "Through Ball": "🪄", "Final Pass": "🔑", "Skill Move": "✨",
  "Wide Dribble": "🌪️", "Track Back": "⬇️", "Cut Inside": "✂️", "Dribble Burst": "💨", Finishing: "🥅", "First Touch Shot": "👟", "Poacher Run": "🦊",
};
const ROLE_SKILL_DESCS = {
  GK: "GK: save lebih kuat, clearance aktif, bisa maju maksimal 4 grid dari gawang dengan biaya 2 AP.",
  CB: "CB: blok, duel badan, dan clearance lebih aman.",
  LB: "Fullback: overlap, crossing, dan recovery run di sisi lapangan.",
  RB: "Fullback: overlap, crossing, dan recovery run di sisi lapangan.",
  CDM: "CDM: intercept, shield bola, dan memutus counter.",
  CM: "CM: tempo pass, support run, dan switch play.",
  CAM: "CAM: through ball, final pass, dan skill move lebih tajam.",
  LM: "Wide midfielder: dribble sisi, crossing, dan track back.",
  RM: "Wide midfielder: dribble sisi, crossing, dan track back.",
  LW: "Winger: cut inside, dribble burst, dan crossing.",
  RW: "Winger: cut inside, dribble burst, dan crossing.",
  ST: "ST: finishing, first-touch shot, dan poacher run.",
};
const MATCH_CLOCK_SECONDS = 90 * 60;
const EXTRA_TIME_CLOCK_SECONDS = 120 * 60;
const REALTIME_TICK_SECONDS = 10;
const REAL_SOCCER_FRAME_MS = 33;
// v14: fisik pemain tetap halus per frame, tetapi clock match dipercepat: 1 menit game = ±1 detik real-time.
const REAL_SOCCER_TICK_SECONDS = Number(((REAL_SOCCER_FRAME_MS / 1000) * 4).toFixed(3));
const REAL_SOCCER_CLOCK_SECONDS = Number(((REAL_SOCCER_FRAME_MS / 1000) * 60).toFixed(3));
const QUICK_SIM_TICK_SECONDS = 180;
const QUICK_SIM_FRAME_MS = 520;
const SUBSTITUTION_LIMIT = 3;
const RT_STICK_DEADZONE = 0.075;
const RT_STICK_SPRINT_ZONE = 0.72;
const FIELD_W = 100;
const FIELD_H = 64;
const GOAL_W = 18;


const TRAITS = [
  { key: "Poacher", icon: "🎯", desc: "+12 finishing di kotak penalti" },
  { key: "Playmaker", icon: "🧠", desc: "+12 umpan progresif" },
  { key: "Speedster", icon: "⚡", desc: "+1 jarak dribel/run" },
  { key: "Destroyer", icon: "🛡️", desc: "+12 tackle dan pressing" },
  { key: "Wall Defender", icon: "🧱", desc: "+10 blok shot" },
  { key: "Sweeper Keeper", icon: "🧤", desc: "Kiper lebih aktif saat clearance" },
  { key: "Captain", icon: "👑", desc: "+1 momentum tim" },
  { key: "Super Sub", icon: "🔥", desc: "+8 semua aksi saat energi tinggi" },
  { key: "Set Piece Ace", icon: "🎲", desc: "+15 free kick / corner" },
  { key: "Trickster", icon: "🌀", desc: "+15 skill move" },
];


const EFFECT_LABELS = {
  press: "Press Tinggi",
  through: "Through Ball",
  wing: "Wing Attack",
  calm: "Calm Tempo",
  counter: "Counter Burst",
  park: "Park Bus",
  onetwo: "One-Two",
  longshot: "Long Shot",
  chaos: "Chaos",
  setpiece: "Set Piece",
  skillshot: "Skill Shot Ready",
};

const PERSONALITIES = [
  { key: "Leader", icon: "👑", desc: "Morale tim lebih stabil." },
  { key: "Ambitious", icon: "🚀", desc: "Cepat berkembang, tapi bisa minta pindah." },
  { key: "Loyal", icon: "🤝", desc: "Lebih jarang drama kontrak." },
  { key: "Professional", icon: "📋", desc: "Training lebih konsisten." },
  { key: "Big Match", icon: "🔥", desc: "Bonus di derby dan laga besar." },
  { key: "Inconsistent", icon: "🎲", desc: "Performa lebih naik turun." },
  { key: "Hot Temper", icon: "🌶️", desc: "Lebih rawan kartu." },
  { key: "Injury Prone", icon: "🏥", desc: "Cedera lebih mungkin terjadi." },
  { key: "Lazy", icon: "😴", desc: "Training lebih lambat." },
  { key: "Wonderkid Mindset", icon: "🌟", desc: "5% rare: potensi besar kalau benar ditemukan scout." },
];
const CUP_WEEKS = new Set([8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88]);
const MANAGER_EVENTS = [
  { key: "press", type: "media", title: "Media mempertanyakan taktik", stakes: "Jawaban publik memengaruhi headline, fans trust, dan tekanan board.", choices: ["Jawab tenang", "Serang balik media", "Fokus ke pemain" ] },
  { key: "captain", type: "locker", title: "Kapten meminta rotasi pemain muda", stakes: "Ruang ganti dan akademi menunggu arah manager.", choices: ["Setuju", "Tolak", "Janji minggu depan" ] },
  { key: "sponsor", type: "sponsor", title: "Sponsor menawarkan bonus kemenangan kandang", stakes: "Target sponsor bisa menaikkan kas, tapi tekanan board ikut naik.", choices: ["Ambil target", "Tolak tekanan", "Minta bonus seri" ] },
  { key: "fans", type: "fans", title: "Fans menuntut permainan menyerang", stakes: "Ultras ingin identitas klub lebih berani dan cepat dikenal.", choices: ["Main ofensif", "Tetap realistis", "Rotasi sayap" ] },
  { key: "youth", type: "youth", title: "Pemain akademi tampil bagus di latihan", stakes: "Keputusan menentukan hype wonderkid dan jalur promosi.", choices: ["Promosikan", "Pantau dulu", "Pinjamkan" ] },
  { key: "rival", type: "rivalry", title: "Media ingin membangun rivalitas baru", stakes: "Rivalitas tersimpan dan membuat derby berikutnya lebih panas.", choices: ["Terima rivalitas", "Hormati lawan", "Panas-panasi derby" ] },
  { key: "locker", type: "locker", title: "Ruang ganti meminta bonus clean sheet", stakes: "Pemain bertahan ingin dihargai, finansial dan morale ikut terpengaruh.", choices: ["Janji bonus", "Minta bukti dulu", "Alihkan ke latihan bertahan" ] },
  { key: "facility", type: "facility", title: "Direktur menawarkan proyek fasilitas", stakes: "Pilihan fasilitas memengaruhi growth jangka panjang.", choices: ["Prioritaskan Training Ground", "Prioritaskan Akademi", "Prioritaskan Stadion" ] },
  { key: "transfer", type: "agent", title: "Agen menawarkan pemain viral", stakes: "Rumor bisa membuka scout, menaikkan hype, atau mengganggu ruang ganti.", choices: ["Minta laporan scout", "Tolak rumor", "Buka negosiasi" ] },
  { key: "worldcup", type: "world", title: "Rumor World Cup Championship mulai ramai", stakes: "Ambisi global memberi reputasi besar, tapi board akan menilai target itu.", choices: ["Target juara", "Rotasi skuad", "Fokus liga dulu" ] },
  { key: "ultimatum", type: "board", title: "Board memberi ultimatum performa", stakes: "Trust board dapat jatuh atau pulih tergantung nada bicara manager.", choices: ["Minta waktu 3 pekan", "Janji perubahan besar", "Salahkan jadwal padat" ] },
  { key: "agentDrama", type: "agent", title: "Agen pemain inti meminta kenaikan gaji", stakes: "Abaikan terlalu lama bisa membuat pemain ingin pindah.", choices: ["Buka negosiasi kontrak", "Tahan sesuai budget", "Kirim pesan tegas" ] },
  { key: "ultras", type: "fans", title: "Fans ultras meminta identitas klub", stakes: "Fanbase bisa makin loyal, tapi risiko rivalitas meningkat.", choices: ["Dekati komunitas fans", "Jaga jarak profesional", "Buat deklarasi derby" ] },
  { key: "ownerProject", type: "board", title: "Owner meminta proyek 5 pekan", stakes: "Board ingin rencana jelas: akademi, promosi, finansial, atau piala. Jawaban tersimpan sebagai headline jangka panjang.", choices: ["Bangun akademi", "Kejar piala", "Sehatkan finansial" ] },
  { key: "starUnhappy", type: "locker", title: "Pemain inti mulai gelisah", stakes: "Pemain besar ingin bukti ambisi klub. Salah jawab bisa menurunkan morale dan membuka rumor pindah.", choices: ["Janji rekrutmen", "Naikkan peran kapten", "Tegaskan disiplin" ] },
  { key: "localDerby", type: "rivalry", title: "Kota mulai panas jelang derby", stakes: "Media lokal mencari rival baru. Pilihanmu bisa membuat laga berikutnya lebih emosional dan berita lebih besar.", choices: ["Panas-panasi rival", "Hormati tradisi", "Fokus tiga poin" ] },
  { key: "academyParent", type: "youth", title: "Keluarga wonderkid meminta kejelasan", stakes: "Akademi butuh jalur nyata. Keputusan memengaruhi minat youth bertahan, loan, atau promosi.", choices: ["Beri jalur promosi", "Siapkan loan", "Tunggu laporan pelatih" ] },
  { key: "mediaLeak", type: "media", title: "Bocoran ruang ganti masuk media", stakes: "Respons publik menentukan apakah krisis melebar atau berubah menjadi motivasi tim.", choices: ["Lindungi pemain", "Bantah keras", "Akui dan perbaiki" ] },
  { key: "globalSponsor", type: "sponsor", title: "Sponsor global memantau klub", stakes: "Reputasi dan gaya bicara manager bisa membuka bonus uang, tapi target klub ikut naik.", choices: ["Ambil panggung global", "Negosiasi bonus aman", "Tolak tekanan besar" ] },
];

const FORMATIONS = {
  "4-3-3": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 3, 8], ["CM", 2, 6], ["CM", 5, 6], ["LW", 1, 4], ["ST", 3, 3], ["RW", 6, 4]],
  "4-2-3-1": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 2, 8], ["CDM", 5, 8], ["LW", 1, 5], ["CAM", 3, 5], ["RW", 6, 5], ["ST", 3, 3]],
  "4-4-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["LM", 0, 6], ["CM", 2, 7], ["CM", 5, 7], ["RM", 7, 6], ["ST", 2, 3], ["ST", 5, 3]],
  "3-5-2": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["LM", 0, 7], ["CM", 2, 7], ["CDM", 3, 8], ["CM", 5, 7], ["RM", 7, 7], ["ST", 2, 3], ["ST", 5, 3]],
  "5-3-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 1, 9], ["CB", 3, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 2, 7], ["CDM", 3, 8], ["CM", 5, 7], ["ST", 2, 3], ["ST", 5, 3]],
  "3-4-3": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["LM", 0, 7], ["CM", 2, 7], ["CM", 5, 7], ["RM", 7, 7], ["LW", 1, 4], ["ST", 3, 3], ["RW", 6, 4]],
  "4-1-4-1": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 3, 8], ["LM", 0, 6], ["CM", 2, 6], ["CM", 5, 6], ["RM", 7, 6], ["ST", 3, 3]],
  "4-3-1-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 1, 7], ["CDM", 3, 8], ["CM", 6, 7], ["CAM", 3, 5], ["ST", 2, 3], ["ST", 5, 3]],
  "4-5-1": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["LM", 0, 6], ["CM", 2, 7], ["CDM", 3, 8], ["CM", 5, 7], ["RM", 7, 6], ["ST", 3, 3]],
  "4-2-2-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 2, 8], ["CDM", 5, 8], ["CAM", 2, 5], ["CAM", 5, 5], ["ST", 2, 3], ["ST", 5, 3]],
  "3-4-1-2": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["LM", 0, 7], ["CM", 2, 7], ["CM", 5, 7], ["RM", 7, 7], ["CAM", 3, 5], ["ST", 2, 3], ["ST", 5, 3]],
  "5-2-3": [["GK", 3, 11], ["LB", 0, 9], ["CB", 1, 9], ["CB", 3, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 2, 7], ["CM", 5, 7], ["LW", 1, 4], ["ST", 3, 3], ["RW", 6, 4]],
  "4-2-4": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 2, 7], ["CM", 5, 7], ["LW", 0, 4], ["ST", 2, 3], ["ST", 5, 3], ["RW", 7, 4]],
  "3-3-3-1": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["CDM", 2, 8], ["CM", 3, 7], ["CDM", 5, 8], ["LW", 1, 5], ["CAM", 3, 5], ["RW", 6, 5], ["ST", 3, 3]],
  "4-6-0": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 2, 8], ["CDM", 5, 8], ["LM", 0, 6], ["CM", 2, 6], ["CM", 5, 6], ["RM", 7, 6]],
  "4-1-2-1-2": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 3, 8], ["CM", 2, 6], ["CM", 5, 6], ["CAM", 3, 5], ["ST", 2, 3], ["ST", 5, 3]],
  "4-3-2-1": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CM", 1, 7], ["CDM", 3, 8], ["CM", 6, 7], ["CAM", 2, 5], ["CAM", 5, 5], ["ST", 3, 3]],
  "3-2-4-1": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["CDM", 2, 8], ["CDM", 5, 8], ["LM", 0, 6], ["CAM", 2, 5], ["CAM", 5, 5], ["RM", 7, 6], ["ST", 3, 3]],
  "5-4-1": [["GK", 3, 11], ["LB", 0, 9], ["CB", 1, 9], ["CB", 3, 9], ["CB", 5, 9], ["RB", 7, 9], ["LM", 0, 6], ["CM", 2, 7], ["CM", 5, 7], ["RM", 7, 6], ["ST", 3, 3]],
  "3-4-2-1": [["GK", 3, 11], ["CB", 1, 9], ["CB", 3, 9], ["CB", 6, 9], ["LM", 0, 7], ["CM", 2, 7], ["CM", 5, 7], ["RM", 7, 7], ["CAM", 2, 5], ["CAM", 5, 5], ["ST", 3, 3]],
  "4-2-1-3": [["GK", 3, 11], ["LB", 0, 9], ["CB", 2, 9], ["CB", 5, 9], ["RB", 7, 9], ["CDM", 2, 8], ["CDM", 5, 8], ["CAM", 3, 6], ["LW", 1, 4], ["ST", 3, 3], ["RW", 6, 4]],
};

const COMPATIBLE = {
  GK: ["GK"], CB: ["CB", "LB", "RB", "CDM"], LB: ["LB", "CB", "LM"], RB: ["RB", "CB", "RM"],
  CDM: ["CDM", "CM", "CB"], CM: ["CM", "CDM", "CAM", "LM", "RM"], CAM: ["CAM", "CM", "ST", "LW", "RW"],
  LM: ["LM", "LW", "CM", "LB"], RM: ["RM", "RW", "CM", "RB"], LW: ["LW", "LM", "RW", "ST"], RW: ["RW", "RM", "LW", "ST"], ST: ["ST", "CAM", "LW", "RW"],
};

const TRAINING_PLANS = {
  balanced: { label: "Balanced", icon: "⚖️", desc: "Sedikit bonus semua aspek.", pass: 3, shot: 3, tackle: 3, recovery: 2 },
  finishing: { label: "Finishing", icon: "🥅", desc: "+9 shot, striker dapat XP.", shot: 9 },
  pressing: { label: "Pressing", icon: "🐺", desc: "+9 tackle dan pressure.", tackle: 9, pressure: 1 },
  passing: { label: "Passing", icon: "🎯", desc: "+9 passing dan through ball.", pass: 9 },
  recovery: { label: "Recovery", icon: "💚", desc: "Energi lebih awet dan cedera turun.", recovery: 8, injuryGuard: 12 },
  youth: { label: "Youth Focus", icon: "🌱", desc: "Pemain muda lebih cepat berkembang.", youthXp: 1 },
  setpiece: { label: "Set Piece", icon: "🎲", desc: "Corner/free kick lebih berbahaya.", setPiece: 12 },
};

const FACILITY_DEF = {
  stadium: { label: "Stadion", icon: "🏟️", baseCost: 180000, desc: "Pendapatan laga kandang naik." },
  training: { label: "Training Ground", icon: "🏋️", baseCost: 160000, desc: "XP dan bonus latihan naik." },
  academy: { label: "Akademi", icon: "🌱", baseCost: 140000, desc: "Pemain muda murah muncul di market." },
  medical: { label: "Medical Center", icon: "🏥", baseCost: 130000, desc: "Durasi cedera turun." },
  merchandise: { label: "Merchandise", icon: "🧢", baseCost: 150000, desc: "Bonus uang kalau menang kandang." },
  sponsor: { label: "Sponsor Lokal", icon: "🤝", baseCost: 170000, desc: "Bonus kecil di laga kandang." },
};

const TACTIC_CARDS = [
  { key: "counter", name: "Counter Attack", icon: "⚡", desc: "4 aksi: dribel/run maju +1 dan shot saat transisi +10." },
  { key: "through", name: "Through Ball", icon: "🪄", desc: "4 aksi: umpan progresif +18, risiko offside tetap ada." },
  { key: "press", name: "High Press", icon: "🐺", desc: "4 aksi: tackle +12 dan passing lawan lebih tertekan." },
  { key: "park", name: "Park The Bus", icon: "🚌", desc: "5 aksi: blok shot +15 dan lawan sulit menembak." },
  { key: "onetwo", name: "One-Two Pass", icon: "🔁", desc: "3 aksi: umpan pendek tidak menghabiskan AP jika sukses." },
  { key: "longshot", name: "Long Shot", icon: "💣", desc: "3 aksi: shot jarak jauh +22." },
  { key: "setpiece", name: "Set Piece Trap", icon: "🎲", desc: "5 aksi: corner/free kick +20." },
  { key: "wing", name: "Wing Overload", icon: "🪽", desc: "4 aksi: aksi di sisi lapangan +16." },
  { key: "calm", name: "Calm Tempo", icon: "🧊", desc: "4 aksi: intersep lawan turun dan stamina lebih hemat." },
  { key: "chaos", name: "Chaos Ball", icon: "🎰", desc: "3 aksi: semua aksi berisiko, tapi bisa meledak." },
];

const AI_PLANS = ["Probe", "Overload Wing", "Sudden Through Ball", "Shoot Early", "Bait Press", "Counter Burst", "Park & Break", "Risky Dribble", "Long Switch", "Tempo Control", "Chaos Gambit"];
const STYLE_PROFILES = {
  Possession: { pass: 9, shortPass: 10, through: -3, shot: -4, press: 0, support: 16, offBall: 18, width: 0, risk: -8, tempo: "short passing" },
  "Tiki Taka": { pass: 12, shortPass: 13, through: 2, shot: -5, press: 2, support: 22, offBall: 22, width: 0, risk: -10, tempo: "triangles" },
  Counter: { pass: 0, shortPass: -2, through: 12, shot: 6, press: -1, support: 7, offBall: 15, width: 3, risk: 5, tempo: "fast break" },
  "High Press": { pass: -2, shortPass: 0, through: 3, shot: 2, press: 10, support: 8, offBall: 16, width: 0, risk: 4, tempo: "press trap" },
  "Long Ball": { pass: -5, shortPass: -5, through: 14, shot: 3, press: -2, support: 4, offBall: 12, width: 2, risk: 7, tempo: "direct" },
  "Park Bus": { pass: -4, shortPass: 4, through: -6, shot: -2, press: -4, support: 2, offBall: 10, width: -2, risk: -12, block: 12, tempo: "compact" },
  "Wing Play": { pass: 3, shortPass: 0, through: 4, shot: 1, press: 1, support: 10, offBall: 18, width: 16, risk: 2, tempo: "wide overload" },
  Physical: { pass: -5, shortPass: -2, through: 0, shot: 2, press: 8, support: 6, offBall: 10, width: 0, risk: 5, tackle: 10, tempo: "duel" },
  Chaos: { pass: -8, shortPass: -4, through: 7, shot: 7, press: 3, support: 4, offBall: 14, width: 5, risk: 14, tempo: "unpredictable" },
  Gegenpress: { pass: -1, shortPass: 1, through: 6, shot: 5, press: 14, support: 9, offBall: 18, width: 1, risk: 8, tackle: 8, tempo: "gegenpress" },
  "Vertical Tiki Taka": { pass: 10, shortPass: 9, through: 9, shot: 1, press: 5, support: 18, offBall: 24, width: 0, risk: 2, tempo: "vertical triangles" },
  Catenaccio: { pass: -2, shortPass: 5, through: -3, shot: -1, press: -2, support: 4, offBall: 12, width: -3, risk: -14, block: 18, tempo: "deep defensive" },
};
const AI_STYLE_POOL = Object.keys(STYLE_PROFILES);
const AI_DEVELOPMENT_ARCHETYPES = {
  Possession: { focus: "pass", youth: 7, transfer: "technical midfielder", desc: "membangun kontrol bola" },
  "Tiki Taka": { focus: "pass", youth: 9, transfer: "playmaker muda", desc: "mencari kombinasi umpan pendek" },
  Counter: { focus: "pace", youth: 6, transfer: "penyerang cepat", desc: "mempercepat transisi" },
  "High Press": { focus: "stamina", youth: 6, transfer: "pemain bertenaga", desc: "menekan lebih tinggi" },
  "Long Ball": { focus: "shoot", youth: 4, transfer: "target man", desc: "mencari opsi direct" },
  "Park Bus": { focus: "defend", youth: 4, transfer: "bek tangguh", desc: "memperkuat blok rendah" },
  "Wing Play": { focus: "pace", youth: 7, transfer: "winger eksplosif", desc: "menambah lebar serangan" },
  Physical: { focus: "defend", youth: 5, transfer: "duelist fisik", desc: "menang duel dan second ball" },
  Chaos: { focus: "dribble", youth: 8, transfer: "talenta liar", desc: "memburu pemain unpredictable" },
  Gegenpress: { focus: "stamina", youth: 7, transfer: "pressing forward", desc: "mencari pemain dengan work rate tinggi" },
  "Vertical Tiki Taka": { focus: "pass", youth: 8, transfer: "playmaker progresif", desc: "mencari kombinasi cepat vertikal" },
  Catenaccio: { focus: "defend", youth: 5, transfer: "bek taktis", desc: "membangun blok bertahan elite" },
};
const AI_DIFFICULTIES = {
  Easy: { label: "Easy", desc: "AI lebih banyak salah posisi dan jarang killer pass.", noise: 42, bestPick: 44, aiBonus: -8, offBall: -8 },
  Normal: { label: "Normal", desc: "AI seimbang untuk belajar career.", noise: 24, bestPick: 68, aiBonus: 0, offBall: 0 },
  Hard: { label: "Hard", desc: "AI lebih pintar menutup ruang, pressing, dan through ball.", noise: 16, bestPick: 82, aiBonus: 7, offBall: 8 },
  Master: { label: "Master", desc: "AI agresif, rapi off-ball, dan jarang mengambil opsi buruk.", noise: 9, bestPick: 92, aiBonus: 13, offBall: 14 },
};
function difficultyProfile(gameOrKey) {
  const key = typeof gameOrKey === "string" ? gameOrKey : gameOrKey?.aiDifficulty;
  return AI_DIFFICULTIES[key] || AI_DIFFICULTIES.Normal;
}


let playerId = 1;
const rng = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rng(0, arr.length - 1)];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const clone = (obj) => JSON.parse(JSON.stringify(obj));
const otherSide = (side) => (side === "home" ? "away" : "home");
const sideLabel = (side) => (side === "home" ? "Home" : "Away");
const directionOf = (side) => (side === "home" ? -1 : 1);
const goalDistance = (piece) => (piece.side === "home" ? piece.y : BOARD_ROWS - 1 - piece.y);
const money = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;
const boardCellName = (x, y) => `${String.fromCharCode(65 + x)}${BOARD_ROWS - y}`;
const distance = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const roll = (chance) => Math.random() * 100 <= chance;
const firstName = (name = "Pemain") => String(name).split(" ")[0];

function genName() { return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`; }
function traitForPosition(pos) {
  const pool = pos === "GK" ? ["Sweeper Keeper", "Captain"]
    : ["CB", "LB", "RB", "CDM"].includes(pos) ? ["Destroyer", "Wall Defender", "Captain", "Set Piece Ace"]
    : ["CM", "CAM", "LM", "RM"].includes(pos) ? ["Playmaker", "Captain", "Speedster", "Set Piece Ace", "Trickster"]
    : ["Poacher", "Speedster", "Trickster", "Super Sub", "Set Piece Ace"];
  return pick(pool);
}

function roleSkillsFor(pos) { return ROLE_SKILLS[pos] || ["Work Rate"]; }
function roleSkillText(posOrPiece) {
  const pos = typeof posOrPiece === "string" ? posOrPiece : posOrPiece?.role || posOrPiece?.pos;
  return roleSkillsFor(pos).map((k) => `${ROLE_SKILL_ICONS[k] || "•"} ${k}`).join(" · ");
}
function roleSkillDesc(posOrPiece) {
  const pos = typeof posOrPiece === "string" ? posOrPiece : posOrPiece?.role || posOrPiece?.pos;
  return ROLE_SKILL_DESCS[pos] || "Role ini memberi bonus kecil sesuai posisinya.";
}
function roleSkillBonus(piece, area, ctx = {}) {
  if (!piece) return 0;
  const role = piece.role || piece.pos;
  const wideCtx = isWide(ctx.x ?? piece.x ?? 3) || isWide(ctx.target?.x ?? -9);
  const closeGoal = typeof ctx.goalDistance === "number" ? ctx.goalDistance <= 3 : goalDistance(piece) <= 3;
  let bonus = 0;
  if (role === "GK") {
    if (["save", "block"].includes(area)) bonus += 10;
    if (["pass", "clearance"].includes(area)) bonus += 6;
    if (area === "run") bonus += 1;
  }
  if (role === "CB") {
    if (area === "block") bonus += 12;
    if (area === "tackle") bonus += 9;
    if (area === "clearance") bonus += 10;
  }
  if (["LB", "RB"].includes(role)) {
    if (area === "run" && wideCtx) bonus += 1;
    if (["pass", "cross"].includes(area) && wideCtx) bonus += 9;
    if (area === "tackle") bonus += 5;
  }
  if (role === "CDM") {
    if (["tackle", "intercept"].includes(area)) bonus += 11;
    if (area === "pass" && !ctx.through) bonus += 5;
    if (area === "shield") bonus += 10;
  }
  if (role === "CM") {
    if (area === "pass") bonus += 10;
    if (area === "through") bonus += 5;
    if (area === "run") bonus += 1;
  }
  if (role === "CAM") {
    if (area === "through") bonus += 13;
    if (area === "pass") bonus += 7;
    if (["dribble", "skill"].includes(area)) bonus += 8;
  }
  if (["LM", "RM"].includes(role)) {
    if (["pass", "cross"].includes(area) && wideCtx) bonus += 10;
    if (area === "dribble" && wideCtx) bonus += 7;
    if (area === "tackle") bonus += 4;
  }
  if (["LW", "RW"].includes(role)) {
    if (area === "dribble") bonus += 10;
    if (["pass", "cross"].includes(area) && wideCtx) bonus += 7;
    if (area === "shot" && closeGoal) bonus += 7;
  }
  if (role === "ST") {
    if (area === "shot") bonus += 13;
    if (area === "receive" && closeGoal) bonus += 7;
    if (area === "run") bonus += 1;
  }
  return bonus;
}
function trapInfo(game, piece) {
  if (!piece || game.ballOwnerId !== piece.id) return { level: 0, trapped: false, passPenalty: 0, label: "" };
  const enemiesNear = game.pieces.filter((p) => !p.red && p.side !== piece.side && distance(p, piece) <= 1).length;
  const enemiesRing = game.pieces.filter((p) => !p.red && p.side !== piece.side && distance(p, piece) === 2).length;
  const friendsNear = game.pieces.filter((p) => !p.red && p.side === piece.side && p.id !== piece.id && distance(p, piece) <= 1).length;
  let openAdjacent = 0;
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (!dx && !dy) continue;
      const x = piece.x + dx;
      const y = piece.y + dy;
      if (!insideBoard(x, y) || pieceAt(game, x, y)) continue;
      if (pressureAt(game, piece.side, x, y) < 2.2) openAdjacent += 1;
    }
  }
  const level = clamp(enemiesNear * 0.9 + enemiesRing * 0.18 + Math.max(0, 3 - openAdjacent) * 0.55 - friendsNear * 0.55, 0, 5);
  const trapped = enemiesNear >= 3 || (enemiesNear >= 2 && openAdjacent <= 1) || level >= 2.6;
  const crowded = !trapped && level >= 1.55;
  const passPenalty = trapped ? clamp(30 + enemiesNear * 8 + Math.max(0, 2 - openAdjacent) * 8 - friendsNear * 4, 26, 62) : crowded ? clamp(12 + enemiesNear * 5 - friendsNear * 3, 8, 28) : 0;
  const label = trapped ? `Terkepung: -${passPenalty}% operan` : crowded ? `Ditekan: -${passPenalty}% operan` : "";
  return { level, trapped, crowded, passPenalty, label, enemiesNear, openAdjacent };
}
function formatClock(game) {
  const max = matchMaxSeconds(game);
  const seconds = clamp(Math.floor(game?.clockSeconds || 0), 0, max);
  const m = Math.min(Math.round(max / 60), Math.floor(seconds / 60));
  const s = seconds >= max ? 0 : seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function dateForWeek(week, offsetDays = 0) {
  const d = new Date(CAREER_START_DATE);
  d.setDate(d.getDate() + (Math.max(1, week) - 1) * 7 + offsetDays);
  return d;
}
function formatDateId(d) {
  return d.toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}
function competitionEventsForWeek(week, teams = []) {
  const events = [{ key: `league-${week}`, type: "league", icon: "🏆", competition: "Liga Utama", date: formatDateId(dateForWeek(week)), note: "Matchday liga" }];
  if ([8, 16, 24, 32].includes(week)) events.push({ key: `cup-${week}`, type: "domesticCup", icon: "🏅", competition: "National Cup", date: formatDateId(dateForWeek(week, 3)), note: "Babak gugur domestik" });
  if ([12, 36, 60].includes(week)) events.push({ key: `youth-${week}`, type: "u20World", icon: "🌱", competition: "U20 World Cup", date: formatDateId(dateForWeek(week, 4)), note: "Scout pemain muda & hidden potential" });
  if ([20, 42, 58].includes(week)) events.push({ key: `leaguecup-${week}`, type: "leagueCup", icon: "🏵️", competition: "League Cup", date: formatDateId(dateForWeek(week, 2)), note: "Rotasi pemain cadangan bisa menentukan hasil" });
  if ([36, 52, 60].includes(week)) events.push({ key: `asia-${week}`, type: "asiaChampions", icon: "🌏", competition: "Asia Champions League", date: formatDateId(dateForWeek(week, 5)), note: "Laga elite Asia versi game" });
  if ([34, 42, 50, 58].includes(week)) events.push({ key: `champ-${week}`, type: "champions", icon: "🌟", competition: "Champions Cup", date: formatDateId(dateForWeek(week, 3)), note: "Top 16 sementara mendapat laga bonus" });
  if ([46, 59].includes(week)) events.push({ key: `world-${week}`, type: "worldClub", icon: "🌍", competition: "Club World Series", date: formatDateId(dateForWeek(week, 4)), note: "Turnamen global versi game" });
  if (week === 60) events.push({ key: `super-${week}`, type: "superCup", icon: "⚡", competition: "Super Cup", date: formatDateId(dateForWeek(week, 5)), note: "Final event akhir musim" });
  if ([10, 30, 50].includes(week)) events.push({ key: `nation-${week}`, type: "continentalNations", icon: "🗺️", competition: "Continental Nations Cups", date: formatDateId(dateForWeek(week, 2)), note: "Berita internasional & rumor transfer" });
  if (week % 10 === 0) events.push({ key: `worldcup-${week}`, type: "worldCup", icon: "🏳️", competition: "World Cup Watch", date: formatDateId(dateForWeek(week, 1)), note: "Headline global memengaruhi rumor dan market value" });
  return events;
}
function fairClubAverage(team) {
  const core = (team.players || []).slice().sort((a, b) => b.overall - a.overall).slice(0, 18);
  return Math.round(core.reduce((sum, p) => sum + p.overall, 0) / (core.length || 1));
}
function applyUserClubChoice(teams, selectedClubId) {
  const chosenId = Number(selectedClubId) || MY_TEAM_ID;
  const swapped = teams.map((team) => {
    if (team.id === chosenId) return { ...team, id: MY_TEAM_ID, budget: INITIAL_CASH, originalClubId: chosenId };
    if (team.id === MY_TEAM_ID && chosenId !== MY_TEAM_ID) return { ...team, id: chosenId, budget: INITIAL_CASH, originalClubId: MY_TEAM_ID };
    return team;
  }).map((team) => ({ ...team, rivalId: team.rivalId === chosenId ? MY_TEAM_ID : team.rivalId === MY_TEAM_ID ? chosenId : team.rivalId, players: team.players.map((p) => ({ ...p, teamId: team.id })) }));
  const userTeam = swapped.find((t) => t.id === MY_TEAM_ID);
  const others = swapped.filter((t) => t.id !== MY_TEAM_ID);
  const slots = [
    ...Array(12).fill("liga1"), ...Array(12).fill("liga2"), ...Array(12).fill("liga3"), ...Array(11).fill("championship"),
  ];
  const arrangedOthers = others.slice().sort((a, b) => leagueInfo(a.leagueKey).level - leagueInfo(b.leagueKey).level || teamPower(b) - teamPower(a)).map((team, idx) => rebalanceTeamForLeague(team, slots[idx] || "championship"));
  const arranged = [rebalanceTeamForLeague(userTeam, "championship"), ...arrangedOthers].map((t) => ({ ...t, players: (t.players || []).map((p) => ({ ...p, teamId: t.id })) }));
  return ensureUserAcademyInTeams(arranged, 1, 1, 6);
}
function viralCandidate(teams) {
  return teams.flatMap((t) => (t.players || []).map((p) => ({ ...p, clubName: t.name, clubColor: t.color })))
    .filter((p) => p.age <= 23 && (p.rarePotential || p.potential - p.overall >= 14))
    .sort((a, b) => (b.potential - b.overall) - (a.potential - a.overall) || b.overall - a.overall)[0];
}
function newsItems({ teams, week, market, cash, storyLog, log, myTeam, worldNews = [] }) {
  const items = [...(worldNews || []).slice(0, 8)];
  const viral = viralCandidate(teams);
  const latest = log?.[0];
  const affordable = (market || []).filter((p) => p.value <= Math.max(cash, INITIAL_CASH)).sort((a, b) => (b.potential - b.overall) - (a.potential - a.overall))[0];
  if (latest) items.push({ tag: "Match Report", icon: "📰", title: `${latest.home} ${latest.homeGoals}-${latest.awayGoals} ${latest.away}`, body: latest.derby ? "Derby panas jadi headline pekan ini." : "Hasil terbaru mengubah momentum klasemen." });
  if (viral) items.push({ tag: "Viral Talent", icon: "🔥", title: `${firstName(viral.name)} viral sebagai hidden potential`, body: `${viral.clubName} punya pemain ${viral.pos} usia ${viral.age}, OVR ${viral.overall}, POT ${viral.potential}. Scout bisa mengungkap harga dan potensinya.` });
  if (affordable) items.push({ tag: "Transfer Watch", icon: "🔎", title: `${affordable.name} masuk radar klub kecil`, body: `${affordable.pos} OVR ${affordable.overall}, harga ${money(affordable.value)}. Budget awal tetap ketat, jadi loan/scout penting.` });
  competitionEventsForWeek(week, teams).slice(1).forEach((e) => items.push({ tag: e.competition, icon: e.icon, title: `${e.competition} hadir pekan ${week}`, body: e.note }));
  if (storyLog?.some((e) => !e.choice)) items.push({ tag: "Club Story", icon: "💬", title: "Ada isu ruang ganti belum dijawab", body: "Pilihan manager bisa menaikkan board trust, fan trust, atau arah perkembangan skuad." });
  const offers = (myTeam?.players || []).filter((p) => p.pendingOffer).length;
  const injuries = (myTeam?.players || []).filter((p) => (p.injuredWeeks || 0) > 0).sort((a, b) => b.injuredWeeks - a.injuredWeeks)[0];
  const academyGem = (myTeam?.players || []).filter((p) => p.academy || p.age <= 21).sort((a, b) => (b.potential - b.overall) - (a.potential - a.overall))[0];
  if (offers) items.push({ tag: "Transfer Inbox", icon: "📩", title: `${offers} offer menunggu keputusan`, body: "Buka menu Skuad untuk menerima, menolak, atau ajukan ulang. Keputusan transfer memengaruhi kas dan kedalaman skuad." });
  if (injuries) items.push({ tag: "Medical Report", icon: "🏥", title: `${injuries.name} masih cedera`, body: `${injuries.pos} absen ${injuries.injuredWeeks} pekan. Medical Center mengurangi risiko cedera fatal dan durasi absen.` });
  if (academyGem) items.push({ tag: "Youth Report", icon: "🌱", title: `${firstName(academyGem.name)} dipantau pelatih akademi`, body: `${academyGem.pos} usia ${academyGem.age}, OVR ${academyGem.overall}, ${academyGem.scouted ? `POT ${academyGem.potential}` : "potensi belum dicek"}. EXP youth naik setiap pekan.` });
  const unhappy = seniorPlayers(myTeam || {}).filter((p) => (p.morale || 70) < 50).sort((a, b) => (a.morale || 0) - (b.morale || 0))[0];
  const contractRisk = seniorPlayers(myTeam || {}).filter((p) => (p.contract || 0) <= 1).sort((a, b) => b.overall - a.overall)[0];
  const listed = seniorPlayers(myTeam || {}).filter((p) => p.listedForSale || p.listedForLoan).length;
  const trophy = (myTeam?.trophies || [])[0];
  const rival = teams.find((t) => t.id === myTeam?.rivalId);
  if (unhappy) items.push({ tag: "Locker Room", icon: "😡", title: `${firstName(unhappy.name)} kurang puas`, body: `${unhappy.pos} OVR ${unhappy.overall} morale ${unhappy.morale}. Story, kontrak, rotasi, atau kemenangan bisa mengubah suasana ruang ganti.` });
  if (contractRisk) items.push({ tag: "Contract Watch", icon: "🧾", title: `Kontrak ${firstName(contractRisk.name)} perlu perhatian`, body: `${contractRisk.pos} OVR ${contractRisk.overall} kontrak ${contractRisk.contract || 0} tahun. Jika diabaikan, pemain bisa masuk free agent di akhir proses season.` });
  if (listed) items.push({ tag: "Market Signal", icon: "📡", title: `${listed} pemain klub masuk radar market`, body: "Pemain yang ditandai jual/loan muncul di menu Transfer dan bisa mendapat offer AI setelah pekan berjalan." });
  if (trophy) items.push({ tag: "Trophy Legacy", icon: "🏆", title: `${myTeam.name} membawa tanda ${trophy.mark || trophy.name}`, body: `Gelar ${trophy.name} season ${trophy.season} meningkatkan gengsi, sponsor, fanbase, dan daya tarik klub di mata pemain.` });
  if (rival) items.push({ tag: "Rivalry Heat", icon: "🔥", title: `Rivalitas dengan ${rival.name} mulai terasa`, body: "Derby memengaruhi kartu, emosi, headline, fan trust, dan atmosfer kompetisi. Story bisa membuat panasnya bertahan lebih lama." });
  if (myTeam) items.push({ tag: "Club Pulse", icon: "📊", title: `${myTeam.name}: rata-rata skuad inti ${fairClubAverage(myTeam)}`, body: "Semua klub dimulai fair sekitar 70. Klub menjadi kuat karena training, transfer, youth, fasilitas, piala, dan keputusan story." });
  return items.slice(0, 24);
}

function clubPrestige(teamId) {
  const idx = CLUB_DATA.findIndex((c) => c[0] === teamId);
  if (idx < 0) return 1;
  return clamp(1.18 - idx * 0.008, 0.82, 1.22);
}
function positionValueMultiplier(pos) {
  return ({ GK: 0.92, CB: 0.96, LB: 0.97, RB: 0.97, CDM: 1.02, CM: 1.06, CAM: 1.14, LM: 1.04, RM: 1.04, LW: 1.16, RW: 1.16, ST: 1.22 })[pos] || 1;
}
function calcMarketValue({ overall, potential, age, pos, pace, shoot, pass, dribble, defend, stamina }, teamId, academy = false) {
  // Harga dibuat jauh lebih realistis: 80-85 sudah jutaan, 85+ puluhan juta,
  // 90+ sangat mahal. Youth academy tetap murah saat belum dipromosikan.
  const base = overall >= 95 ? rng(80000000, 180000000)
    : overall >= 90 ? rng(35000000, 110000000)
    : overall >= 85 ? rng(12000000, 55000000)
    : overall >= 80 ? rng(2000000, 12000000)
    : overall >= 70 ? rng(250000, 1800000)
    : overall >= 60 ? rng(45000, 180000)
    : rng(12000, 42000);
  const roleSkill = pos === "GK" ? (defend * 0.55 + pass * 0.18 + stamina * 0.27)
    : ["CB", "LB", "RB", "CDM"].includes(pos) ? (defend * 0.45 + pace * 0.18 + pass * 0.18 + stamina * 0.19)
    : ["CM", "CAM", "LM", "RM"].includes(pos) ? (pass * 0.38 + dribble * 0.25 + stamina * 0.18 + shoot * 0.19)
    : (shoot * 0.38 + pace * 0.24 + dribble * 0.25 + pass * 0.13);
  const potentialPremium = clamp(1 + Math.max(0, potential - overall) * (age <= 21 ? 0.055 : 0.025), 1, overall >= 85 ? 3.1 : 2.35);
  const ageMult = age <= 19 ? 1.25 : age <= 22 ? 1.18 : age <= 26 ? 1.1 : age <= 30 ? 1 : age <= 33 ? 0.78 : 0.58;
  const skillMult = clamp(0.72 + roleSkill / 100, 0.9, 1.68);
  const rarityMult = overall >= 95 ? 1.55 : overall >= 90 ? 1.22 : 1;
  const randomTaste = rng(86, 122) / 100;
  const raw = base * positionValueMultiplier(pos) * clubPrestige(teamId) * potentialPremium * ageMult * skillMult * rarityMult * randomTaste * (academy ? 0.45 : 1);
  return Math.max(500, Math.round(raw / 500) * 500);
}
function genPlayer(pos, teamId, tier = 0, academy = false) {
  const attack = ["ST", "LW", "RW", "CAM", "LM", "RM"].includes(pos) ? 8 : 0;
  const defendBonus = ["GK", "CB", "LB", "RB", "CDM"].includes(pos) ? 9 : 0;
  const passBonus = ["CM", "CDM", "CAM", "LM", "RM"].includes(pos) ? 8 : 0;
  const ultraRare = Math.random() < 0.001; // rating 98/potential 98 benar-benar 1 banding 1000.
  const rarePotential = ultraRare || Math.random() < 0.025;
  const overallBase = clamp(rng(64, 74) + tier + rng(-2, 2) + (ultraRare ? rng(5, 10) : 0), 55, ultraRare ? 94 : 88);
  const overall = Math.min(98, overallBase);
  const age = academy ? rng(16, 21) : rng(17, 35);
  const potentialCap = ultraRare ? 98 : rarePotential ? (overall >= 84 ? 96 : 92) : (overall >= 84 ? 90 : 86);
  const potential = clamp(overall + (rarePotential ? rng(8, 18) + (age <= 21 ? 4 : 0) : rng(1, 7) + (age <= 21 ? rng(0, 4) : 0)), overall, potentialCap);
  const trait = traitForPosition(pos);
  const personality = rarePotential ? "Wonderkid Mindset" : pick(PERSONALITIES.filter((p) => p.key !== "Wonderkid Mindset")).key;
  const pace = clamp(rng(44, 82) + attack + (pos === "GK" ? -12 : 0) + (ultraRare ? 4 : 0), 25, 99);
  const shoot = clamp(rng(35, 73) + attack - (pos === "GK" ? 25 : 0) + (ultraRare ? 4 : 0), 10, 99);
  const pass = clamp(rng(38, 77) + passBonus + (ultraRare ? 4 : 0), 20, 99);
  const dribble = clamp(rng(38, 79) + attack + (ultraRare ? 4 : 0), 20, 99);
  const defend = clamp(rng(32, 78) + defendBonus - (pos === "ST" ? 12 : 0) + (ultraRare ? 4 : 0), 15, 99);
  const stamina = clamp(rng(50, 89) + (ultraRare ? 4 : 0), 25, 99);
  const value = calcMarketValue({ overall, potential, age, pos, pace, shoot, pass, dribble, defend, stamina }, teamId, academy);
  return {
    id: playerId++, teamId, name: genName(), pos, age, overall, potential, rarePotential, ultraRare, personality, scouted: false, scoutStatus: "unknown", loan: false,
    trait, roleSkills: roleSkillsFor(pos), morale: rng(58, 84), fitness: 100, injuredWeeks: 0, bannedWeeks: 0, yellowCards: 0, xp: rng(0, 30), level: Math.max(1, Math.floor((overall - 55) / 5)), listedForSale: false, listedForLoan: false,
    pace, shoot, pass, dribble, defend, stamina, value,
    wage: Math.round(clamp(value * rng(35, 85) / 10000, 500, overall >= 85 ? 260000 : 65000) / 100) * 100,
    contract: rng(1, 5),
  };
}
function makeAcademyIntake(team, season = 1, academyLevel = 1, count = 6) {
  const positions = ["GK", "CB", "LB", "CM", "CAM", "RW", "ST", "CDM", "RB", "LW"];
  const levelBoost = Math.max(0, (academyLevel || 1) - 1);
  return Array.from({ length: count }, (_, i) => {
    const pos = positions[i % positions.length];
    const kid = genPlayer(pos, team.id, rng(-12 + levelBoost, -4 + levelBoost), true);
    const next = {
      ...kid,
      academy: true,
      sourceClub: `${team.name} Academy`,
      contract: 0,
      wage: 0,
      scouted: false,
      xp: rng(0, 25),
      level: Math.max(1, Math.floor((kid.overall - 55) / 5)),
      pendingSquadAction: null,
      listedForSale: false,
      listedForLoan: false,
      freeAgent: false,
      loan: false,
    };
    return recalcPlayerValue(next, team.id);
  });
}
function ensureAcademyForTeam(team, season = 1, academyLevel = 1, minAcademy = 6) {
  const existing = academyPlayers(team);
  if (existing.length >= minAcademy) return team;
  const additions = makeAcademyIntake(team, season, academyLevel, minAcademy - existing.length);
  return { ...team, players: [...(team.players || []), ...additions].sort((a, b) => Number(a.academy) - Number(b.academy) || b.overall - a.overall) };
}
function ensureUserAcademyInTeams(teams, season = 1, academyLevel = 1, minAcademy = 6) {
  return (teams || []).map((t) => t.id === MY_TEAM_ID ? ensureAcademyForTeam(t, season, academyLevel, minAcademy) : t);
}

function lineForFormation(formation) {
  // Kick-off dibuat seperti sepakbola asli: semua starting XI berada di area sendiri,
  // tidak ada striker/winger yang melewati garis tengah saat match baru dimulai.
  // Board v7 lebih compact (9x14), jadi posisi ditata by-role supaya formasi tidak ngaco/menumpuk.
  const raw = FORMATIONS[formation] || FORMATIONS["4-3-3"];
  const ownHalfStart = Math.ceil((BOARD_ROWS - 1) / 2);
  const yByRole = {
    GK: BOARD_ROWS - 2,
    LB: BOARD_ROWS - 3, CB: BOARD_ROWS - 3, RB: BOARD_ROWS - 3,
    CDM: BOARD_ROWS - 4,
    CM: BOARD_ROWS - 5, LM: BOARD_ROWS - 5, RM: BOARD_ROWS - 5,
    CAM: BOARD_ROWS - 6, LW: BOARD_ROWS - 6, RW: BOARD_ROWS - 6, ST: BOARD_ROWS - 6,
  };
  return raw.map(([pos, x, y], idx) => {
    const baseX = pos === "GK" ? Math.round(centerX()) : Math.round((x / 7) * (BOARD_COLS - 1));
    const fallbackY = Math.round(ownHalfStart + 1 + clamp((y - 3) / 8, 0, 1) * (BOARD_ROWS - ownHalfStart - 3));
    return {
      pos,
      x: clamp(baseX, 0, BOARD_COLS - 1),
      y: clamp(yByRole[pos] ?? fallbackY, ownHalfStart + 1, BOARD_ROWS - 2),
      slotIndex: idx,
    };
  });
}
function mirror(slot) { return { ...slot, y: BOARD_ROWS - 1 - slot.y }; }
function buildClubs() {
  const clubs = CLUB_DATA.map(([id, name, city, color, fans, style], idx) => {
    const leagueKey = initialLeagueKeyByIndex(idx);
    return {
      id, name, city, color, fans, style, leagueKey, leagueLevel: leagueInfo(leagueKey).level, leagueName: leagueName(leagueKey),
      rivalId: id % 2 === 1 ? id + 1 : id - 1,
      players: [], preferredFormation: pick(Object.keys(FORMATIONS)),
      wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0, form: [], morale: 70, budget: INITIAL_CASH,
      wagePressure: 0, growthScore: 0, aiNews: [], transferPolicy: style, trophies: [], numberOneTitles: 0,
    };
  });
  clubs.forEach((team, idx) => {
    const leagueKey = team.leagueKey;
    BASE_POSITIONS.forEach((pos, i) => team.players.push(genPlayer(pos, team.id, rng(-2, 2))));
    for (let i = 0; i < 18; i += 1) team.players.push(genPlayer(pick(EXTRA_POSITIONS), team.id, rng(-4, 1)));
    const rebalanced = rebalanceTeamForLeague(team, leagueKey);
    Object.assign(team, rebalanced, { budget: INITIAL_CASH });
  });
  return ensureUserAcademyInTeams(clubs, 1, 1, 6);
}
function buildFixtures(teamIds) {
  const ids = [...teamIds];
  if (ids.length % 2) ids.push(null);
  const list = [...ids];
  const n = list.length;
  const rounds = [];
  for (let r = 0; r < n - 1; r += 1) {
    const week = [];
    for (let i = 0; i < n / 2; i += 1) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a && b) {
        const flip = r % 2 === 1;
        week.push({ homeId: flip ? b : a, awayId: flip ? a : b });
      }
    }
    rounds.push(week);
    list.splice(1, 0, list.pop());
  }
  return [...rounds, ...rounds.map((week) => week.map((m) => ({ homeId: m.awayId, awayId: m.homeId })))] ;
}

function balanceLanPlayer(player, teamId) {
  const desired = clamp(70 + rng(-5, 5) + (["GK", "ST", "CAM", "CB"].includes(player.pos) ? rng(0, 2) : 0), 62, 77);
  const old = Math.max(1, player.overall || desired);
  const factor = desired / old;
  const next = { ...player, teamId, overall: desired, rarePotential: Math.random() < 0.012, age: clamp(player.age || rng(18, 33), 17, 36), fitness: 100, morale: rng(66, 82), injuredWeeks: 0, bannedWeeks: 0 };
  ["pace", "shoot", "pass", "dribble", "defend", "stamina"].forEach((k) => { next[k] = clamp(Math.round((player[k] || old) * factor + rng(-2, 2)), 25, 86); });
  next.potential = clamp(Math.max(desired, desired + (next.rarePotential ? rng(6, 11) : rng(1, 5))), desired, next.rarePotential ? 85 : 81);
  return recalcPlayerValue(next, teamId);
}
function makeLanTeam(clubKey, id) {
  const def = LAN_REAL_CLUBS.find((c) => c.key === clubKey) || LAN_REAL_CLUBS[0];
  const team = {
    id, name: def.name, city: def.country, color: def.color, fans: 75000, style: def.style, leagueKey: "lan", leagueLevel: 0, leagueName: "LAN Friendly",
    rivalId: null, players: [], preferredFormation: pick(Object.keys(FORMATIONS)), wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0, form: [], morale: 72, budget: INITIAL_CASH,
    wagePressure: 0, growthScore: 0, aiNews: [], transferPolicy: def.style, trophies: [], numberOneTitles: 0, lanClubKey: def.key,
  };
  const realSquad = LAN_REAL_SQUADS[def.key] || [];
  const usedNames = new Set();
  const addReal = ([pos, name]) => {
    if (!name || usedNames.has(name)) return;
    usedNames.add(name);
    const generated = genPlayer(pos, id, rng(-3, 2));
    team.players.push(balanceLanPlayer({ ...generated, name, pos }, id));
  };
  realSquad.forEach(addReal);
  const minimumSquadSize = Math.max(18, realSquad.length);
  const fallbackPositions = [...BASE_POSITIONS, ...EXTRA_POSITIONS, ...EXTRA_POSITIONS];
  let idx = 0;
  while (team.players.length < minimumSquadSize) {
    const pos = fallbackPositions[idx % fallbackPositions.length];
    const generated = genPlayer(pos, id, rng(-4, 1));
    generated.name = `${def.name.split(" ")[0]} ${POS_LABELS[pos]?.split(" ")[0] || pos} ${team.players.length + 1}`;
    team.players.push(balanceLanPlayer(generated, id));
    idx += 1;
  }
  team.players = team.players.sort((a, b) => {
    const posOrder = BASE_POSITIONS.indexOf(a.pos) - BASE_POSITIONS.indexOf(b.pos);
    return (posOrder || 0) || b.overall - a.overall || b.potential - a.potential;
  });
  return team;
}
function makeLanMatch(homeClubKey, awayClubKey, hostSide = "home", helpMode = false) {
  const homeTeam = makeLanTeam(homeClubKey || "man-city", 701);
  const awayTeam = makeLanTeam(awayClubKey || "real-madrid", 702);
  const game = createMatch({ homeTeam, awayTeam, userSide: hostSide, userFormation: "4-3-3", trainingPlan: "balanced", facilities: { stadium: 1, training: 1, academy: 1, medical: 2, merchandise: 1, sponsor: 1 }, lineupOverrides: {}, aiDifficulty: "Normal", helpMode, friendly: true });
  game.lan = true;
  game.maxActions = 80;
  game.history = [{ minute: 1, icon: "📡", text: `LAN Match dimulai: ${homeTeam.name} vs ${awayTeam.name}. Tidak ada coach; murni duel player vs player.` }];
  return game;
}

const INITIAL_TEAMS = buildClubs();
const SEASON_FIXTURES = buildLeagueFixtures(INITIAL_TEAMS, 1);

function teamPower(team) {
  const core = seniorPlayers(team).filter((p) => p.injuredWeeks <= 0 && p.bannedWeeks <= 0).slice().sort((a, b) => b.overall - a.overall).slice(0, 11);
  const base = core.reduce((sum, p) => sum + p.overall, 0) / 11 || 55;
  const chaos = starChaos(team);
  const moraleMod = ((team.morale || 70) - 70) / 18;
  return clamp(base + moraleMod - chaos.penalty, 40, 96);
}
function pickLineup(team, formationName, overrides = {}) {
  const slots = lineForFormation(formationName);
  const used = new Set();
  return slots.map((slot, idx) => {
    const forcedId = Number(overrides[idx]);
    const forced = forcedId ? team.players.find((p) => p.id === forcedId && !p.academy && !p.pendingArrival && !used.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0) : null;
    if (forced) { used.add(forced.id); return { player: forced, slot, manual: true }; }
    const compat = COMPATIBLE[slot.pos] || [slot.pos];
    let candidates = team.players.filter((p) => !p.academy && !p.pendingArrival && !used.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0 && compat.includes(p.pos));
    if (!candidates.length) candidates = team.players.filter((p) => !p.academy && !p.pendingArrival && !used.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0);
    if (!candidates.length) candidates = team.players.filter((p) => !p.academy && !p.pendingArrival && !used.has(p.id));
    const chosen = candidates.slice().sort((a, b) => {
      const exactA = a.pos === slot.pos ? 12 : 0;
      const exactB = b.pos === slot.pos ? 12 : 0;
      const fitA = Math.round((a.fitness || 100) / 10);
      const fitB = Math.round((b.fitness || 100) / 10);
      return (b.overall + exactB + fitB) - (a.overall + exactA + fitA);
    })[0];
    used.add(chosen.id);
    return { player: chosen, slot };
  });
}
function benchFor(team, formationName, overrides = {}) {
  const lineup = pickLineup(team, formationName, overrides);
  const used = new Set(lineup.map(({ player }) => player.id));
  return team.players
    .filter((p) => !p.academy && !p.pendingArrival && !used.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0)
    .slice()
    .sort((a, b) => b.overall - a.overall);
}
function piecesFor(team, side, formationName, facilities, overrides = {}) {
  return pickLineup(team, formationName, overrides).map(({ player, slot }, idx) => {
    const spot = side === "home" ? slot : mirror(slot);
    const moraleBoost = player.trait === "Captain" ? 2 : 0;
    return {
      id: `${side}-${player.id}`, playerId: player.id, side, teamId: team.id, teamName: team.name,
      role: slot.pos, roleSkills: roleSkillsFor(slot.pos), x: spot.x, y: spot.y, name: player.name, trait: player.trait, personality: player.personality,
      overall: player.overall, pace: player.pace, shoot: player.shoot, pass: player.pass, dribble: player.dribble, defend: player.defend,
      stamina: player.stamina, energy: clamp(player.fitness || 100, 45, 100), morale: clamp(player.morale + moraleBoost, 40, 99), yellow: 0, red: false,
      startingIndex: idx,
    };
  });
}
function kickoffPlayer(pieces, side) {
  // Kick-off awal dan restart setelah gol selalu diberikan ke pemain menyerang,
  // tetapi posisi semua pemain tetap berada di area sendiri sebelum garis tengah.
  const attackers = ["ST", "CAM", "LW", "RW", "LM", "RM", "CM"];
  const alive = pieces.filter((p) => p.side === side && !p.red && !p.vacant && !pieceTemporarilyOut(null, p));
  const preferred = alive.filter((p) => attackers.includes(p.role));
  const pool = preferred.length ? preferred : alive;
  const roleRank = (role) => ({ ST: 80, CAM: 62, LW: 56, RW: 56, LM: 42, RM: 42, CM: 28, CDM: 18, LB: 12, RB: 12, CB: 6, GK: 0 })[role] || 0;
  return pool.slice().sort((a, b) => roleRank(b.role) - roleRank(a.role) || goalDistance(a) - goalDistance(b) || b.overall - a.overall)[0]?.id || alive[0]?.id;
}
function drawCards(count = 3) {
  const pool = [...TACTIC_CARDS].sort(() => Math.random() - 0.5);
  return pool.slice(0, count).map((c) => ({ ...c, uid: `${c.key}-${Date.now()}-${Math.random().toString(36).slice(2)}` }));
}
function hashSeed(input = "bola-catur-arena") {
  let h = 2166136261;
  const text = String(input);
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function seededRandom(seedInput = "debug") {
  let state = hashSeed(seedInput) || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223 >>> 0;
    return state / 4294967296;
  };
}
function makeReplaySeed(label = "match") { return `${label}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
function createMatch({ homeTeam, awayTeam, userSide, userFormation, trainingPlan, facilities, lineupOverrides = {}, aiDifficulty = "Normal", helpMode = false, friendly = false }) {
  const homeFormation = homeTeam.id === MY_TEAM_ID ? userFormation : homeTeam.preferredFormation;
  const awayFormation = awayTeam.id === MY_TEAM_ID ? userFormation : awayTeam.preferredFormation;
  const homeOverrides = homeTeam.id === MY_TEAM_ID ? lineupOverrides : {};
  const awayOverrides = awayTeam.id === MY_TEAM_ID ? lineupOverrides : {};
  const pieces = [...piecesFor(homeTeam, "home", homeFormation, facilities, homeOverrides), ...piecesFor(awayTeam, "away", awayFormation, facilities, awayOverrides)];
  const isDerby = homeTeam.rivalId === awayTeam.id || awayTeam.rivalId === homeTeam.id;
  const firstKickoffSide = Math.random() < 0.5 ? "home" : "away";
  const secondHalfKickoffSide = otherSide(firstKickoffSide);
  const firstKickoffTeamName = firstKickoffSide === "home" ? homeTeam.name : awayTeam.name;
  const game = {
    homeId: homeTeam.id, awayId: awayTeam.id, homeName: homeTeam.name, awayName: awayTeam.name,
    homeColor: homeTeam.color, awayColor: awayTeam.color, homeStyle: homeTeam.style, awayStyle: awayTeam.style,
    homeFormation, awayFormation, userSide, trainingPlan, facilities, isDerby, aiDifficulty, helpMode, friendly, replaySeed: makeReplaySeed(`${homeTeam.name}-vs-${awayTeam.name}`),
    pieces, ballOwnerId: kickoffPlayer(pieces, firstKickoffSide), turn: firstKickoffSide, ap: MAX_AP, score: { home: 0, away: 0 }, actionNo: 1, maxActions: MAX_ACTIONS, clockSeconds: 0,
    kickoff: { firstSide: firstKickoffSide, secondSide: secondHalfKickoffSide, half: 1, halftimeDone: false },
    ended: false, winner: null, momentum: { home: firstKickoffSide === "home" ? 1 : 0, away: firstKickoffSide === "away" ? 1 : 0 }, effects: { home: [], away: [] }, usedCards: [], userCards: drawCards(4),
    bench: { home: benchFor(homeTeam, homeFormation, homeOverrides), away: benchFor(awayTeam, awayFormation, awayOverrides) },
    aiPlan: pick(AI_PLANS), goalPause: null, highlights: [], lastGoalRestartSide: null, setPiece: null, subCount: { home: 0, away: 0 }, actionFx: null,
    stats: { home: emptyStats(), away: emptyStats() },
    lastAction: `Kick off ${firstKickoffTeamName}.`,
    history: [{ minute: 1, icon: isDerby ? "🔥" : "⚽", text: isDerby ? `Derby panas: ${homeTeam.name} vs ${awayTeam.name}. Kick off ${firstKickoffTeamName}.` : `Kick off ${firstKickoffTeamName}.` }],
    events: [],
  };
  return makeRealtimeSoccerGame(applyAutoShape(game));
}
function emptyStats() { return { shots: 0, onTarget: 0, goals: 0, passes: 0, passOk: 0, tackles: 0, tackleOk: 0, fouls: 0, yellows: 0, reds: 0, corners: 0, offsides: 0, possession: 0, possessionSeconds: 0, saves: 0, injuries: 0, xg: 0 }; }
function matchMaxSeconds(game) { return game?.matchMaxSeconds || MATCH_CLOCK_SECONDS; }
function minuteOf(game) {
  const maxMinute = Math.round(matchMaxSeconds(game) / 60);
  return Math.min(maxMinute, Math.max(1, Math.floor(((game.clockSeconds ?? ((game.actionNo / game.maxActions) * matchMaxSeconds(game))) / 60)) + 1));
}
function getPiece(game, id) { return game.pieces.find((p) => p.id === id) || null; }
function pieceAt(game, x, y) { return game.pieces.find((p) => p.x === x && p.y === y && !p.red) || null; }
function sideStyle(game, side) { return side === "home" ? game.homeStyle : game.awayStyle; }
function styleProfile(game, side) { return STYLE_PROFILES[sideStyle(game, side)] || STYLE_PROFILES.Possession; }
function tacticMod(game, side, key) { return Number(styleProfile(game, side)?.[key] || 0); }
function centerX() { return (BOARD_COLS - 1) / 2; }
function hasTrait(piece, trait) { return piece?.trait === trait; }
function effect(game, side, key) { return (game.effects?.[side] || []).some((e) => e.key === key && e.ttl > 0); }
function opponentGoalY(side) { return side === "home" ? 0 : BOARD_ROWS - 1; }
function ownGoalY(side) { return side === "home" ? BOARD_ROWS - 1 : 0; }
function insideBoard(x, y) { return x >= 0 && x < BOARD_COLS && y >= 0 && y < BOARD_ROWS; }
function ownGoalDistance(pieceOrSide, cell = null) {
  const side = typeof pieceOrSide === "string" ? pieceOrSide : pieceOrSide?.side;
  const y = cell?.y ?? pieceOrSide?.y ?? 0;
  return Math.abs(y - ownGoalY(side));
}
function shotLaneInfo(piece) {
  const laneOffset = Math.min(...GOAL_COLS.map((c) => Math.abs(piece.x - c)));
  if (laneOffset === 0) return { lane: "straight", baseRange: SHOT_STRAIGHT_RANGE, laneOffset };
  if (laneOffset === 1) return { lane: "side", baseRange: SHOT_SIDE_RANGE, laneOffset };
  return { lane: "wide", baseRange: 0, laneOffset };
}
function hasShotSkill(game, side) { return effect(game, side, "skillshot") || effect(game, side, "longshot"); }
function keeperForSide(game, side) { return game.pieces.find((p) => !p.red && p.side === side && p.role === "GK") || null; }
function keeperCoverage(game, defendingSide) {
  const keeper = keeperForSide(game, defendingSide);
  if (!keeper) return { keeper: null, inGoal: false, coverage: 0, label: "GK tidak ada" };
  const goalSideOffset = Math.min(...GOAL_COLS.map((c) => Math.abs(keeper.x - c)));
  const depth = ownGoalDistance(defendingSide, keeper);
  const coverage = clamp(1 - Math.max(0, depth - 1) * 0.27 - goalSideOffset * 0.16, 0.18, 1);
  const inGoal = depth <= 2 && goalSideOffset <= 2;
  return { keeper, inGoal, coverage, label: inGoal ? "GK siap" : "GK keluar posisi" };
}
function setPieceName(type) {
  return type === "corner" ? "Corner" : type === "freeKick" ? "Free kick" : type === "penalty" ? "Penalty" : type === "goalKick" ? "Goal kick" : "Set piece";
}
function goalKickTarget(game, side, taker) {
  const dir = directionOf(side);
  return game.pieces
    .filter((p) => !p.red && p.side === side && p.id !== taker?.id)
    .map((p) => ({ p, score: p.overall + p.pass * 0.25 + p.stamina * 0.12 - Math.abs(p.x - centerX()) * 2 + Math.max(0, (p.y - (taker?.y ?? ownGoalY(side))) * dir) * 3 - pressureAt(game, side, p.x, p.y) * 9 }))
    .sort((a, b) => b.score - a.score)[0]?.p || nearestFriend(game, side, { x: centerX(), y: ownGoalY(side) + dir * 5 });
}
function openPlayRunSuggestions(game, side, limit = 6) {
  if (!game || game.ended || game.goalPause || game.turn !== side) return [];
  const carrier = getPiece(game, game.ballOwnerId);
  return game.pieces
    .filter((p) => !p.red && p.side === side && p.id !== game.ballOwnerId)
    .flatMap((p) => legalRunCells(game, p.id).map((cell) => {
      const towardGoal = goalDistance(p) - goalDistance({ ...p, x: cell.x, y: cell.y });
      const support = carrier ? Math.max(0, 5 - distance(cell, carrier)) : 0;
      const width = Math.abs(cell.x - centerX());
      const style = styleProfile(game, side);
      const score = towardGoal * 13 + support * 5 - pressureAt(game, side, cell.x, cell.y) * 8 + roleSkillBonus(p, "run", cell) * 5 + (style.width > 0 ? width * 1.4 : -Math.max(0, width - 3)) + (p.role === "ST" || p.role === "LW" || p.role === "RW" ? 7 : 0);
      return { piece: p, cell, score };
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
function shotZoneText(info) {
  if (!info?.laneInfo || info.laneInfo.baseRange <= 0) return "Lurus dari tiang gawang saja";
  return info.laneInfo.lane === "straight" ? `Lurus ≤${SHOT_STRAIGHT_RANGE} grid` : `Samping ≤${SHOT_SIDE_RANGE} grid`;
}
function secondLastDefenderLine(game, defendingSide) {
  const ys = game.pieces.filter((p) => !p.red && p.side === defendingSide).map((p) => p.y).sort((a, b) => defendingSide === "home" ? b - a : a - b);
  return ys[1] ?? (defendingSide === "home" ? BOARD_ROWS - 2 : 1);
}
function isOffsidePosition(game, passer, target) {
  if (!passer || !target || passer.side !== target.side) return false;
  const defendingSide = otherSide(passer.side);
  const line = secondLastDefenderLine(game, defendingSide);
  const targetAheadOfBall = passer.side === "home" ? target.y < passer.y : target.y > passer.y;
  const halfLine = (BOARD_ROWS - 1) / 2;
  const inOppHalf = passer.side === "home" ? target.y <= halfLine : target.y >= halfLine;
  const beyondLine = passer.side === "home" ? target.y < line : target.y > line;
  return targetAheadOfBall && inOppHalf && beyondLine;
}
function normalizeDefensiveLine(game, defendingSide) {
  const keeper = game.pieces.find((p) => !p.red && p.side === defendingSide && p.role === "GK");
  const carrier = getPiece(game, game.ballOwnerId);
  if (!keeper || !carrier || carrier.side === defendingSide) return;
  const danger = manhattan(carrier, keeper) <= 5 || goalDistance(carrier) <= 4;
  if (!danger) return;
  const maxGap = 3;
  const defenders = game.pieces.filter((p) => !p.red && p.side === defendingSide && ["CB", "LB", "RB", "CDM"].includes(p.role));
  defenders.forEach((p) => {
    const gap = Math.abs(p.y - keeper.y);
    if (gap <= maxGap) return;
    const dir = p.y < keeper.y ? 1 : -1;
    const nx = clamp(p.x + (keeper.x > p.x ? 1 : keeper.x < p.x ? -1 : 0), 0, BOARD_COLS - 1);
    const ny = clamp(p.y + dir, 0, BOARD_ROWS - 1);
    if (!pieceAt(game, nx, ny)) { p.x = nx; p.y = ny; }
    else if (!pieceAt(game, p.x, ny)) p.y = ny;
  });
}
function findNearestOpenCell(game, piece, occupied) {
  const preferredForward = piece.side === "home" ? -1 : 1;
  const offsets = [
    [0, preferredForward], [-1, 0], [1, 0], [0, -preferredForward], [-1, preferredForward], [1, preferredForward], [-1, -preferredForward], [1, -preferredForward],
    [0, preferredForward * 2], [-2, 0], [2, 0], [0, -preferredForward * 2], [-2, preferredForward], [2, preferredForward],
  ];
  for (const [dx, dy] of offsets) {
    const x = clamp(piece.x + dx, 0, BOARD_COLS - 1);
    const y = clamp(piece.y + dy, 0, BOARD_ROWS - 1);
    const key = `${x},${y}`;
    if (insideBoard(x, y) && !occupied.has(key)) return { x, y };
  }
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) return { x, y };
    }
  }
  return { x: piece.x, y: piece.y };
}
function resolvePieceCollisions(game) {
  const occupied = new Set();
  game.pieces
    .filter((p) => !p.red)
    .sort((a, b) => (a.side === b.side ? a.startingIndex - b.startingIndex : a.side === "home" ? -1 : 1))
    .forEach((piece) => {
      piece.x = clamp(piece.x, 0, BOARD_COLS - 1);
      piece.y = clamp(piece.y, 0, BOARD_ROWS - 1);
      let key = `${piece.x},${piece.y}`;
      if (occupied.has(key)) {
        const open = findNearestOpenCell(game, piece, occupied);
        piece.x = open.x;
        piece.y = open.y;
        key = `${piece.x},${piece.y}`;
      }
      occupied.add(key);
    });
  return game;
}
function applyAutoShape(game) {
  normalizeDefensiveLine(game, "home");
  normalizeDefensiveLine(game, "away");
  resolvePieceCollisions(game);
  return game;
}
function defaultFacilities() { return { stadium: 1, training: 1, academy: 1, medical: 1, merchandise: 1, sponsor: 1 }; }
function defaultSeasonStats() { return { homeWins: 0, derbyWins: 0, goals: 0, youthDeveloped: 0 }; }
function normalizeSavePlayer(p, idx, teamId) {
  const legacyInjury = Math.max(0, Number(p?.injuredWeeks ?? p?.injuryWeeks ?? 0));
  const legacyBan = Math.max(0, Number(p?.bannedWeeks ?? p?.banWeeks ?? 0));
  return {
    ...(p || {}),
    teamId: teamId ?? p?.teamId,
    id: p?.id ?? Number(`${teamId || 0}${idx + 100}`),
    morale: clamp(Number(p?.morale ?? 70), 0, 100),
    fitness: clamp(Number(p?.fitness ?? p?.stamina ?? 100), 0, 100),
    stamina: clamp(Number(p?.stamina ?? p?.fitness ?? 100), 0, 100),
    injuredWeeks: legacyInjury,
    injuryWeeks: undefined,
    bannedWeeks: legacyBan,
    yellowCards: Math.max(0, Number(p?.yellowCards || 0)),
    redCard: Boolean(p?.redCard || p?.red),
  };
}
function normalizeSaveTeam(team, fallbackLeague = "championship") {
  const safe = { ...(team || {}) };
  safe.players = Array.isArray(safe.players) ? safe.players.map((p, idx) => normalizeSavePlayer(p, idx, safe.id)) : [];
  safe.leagueKey = safe.leagueKey || fallbackLeague;
  safe.budget = Number.isFinite(Number(safe.budget)) ? Number(safe.budget) : INITIAL_CASH;
  safe.style = safe.style || "Balanced";
  safe.preferredFormation = safe.preferredFormation || "4-3-3";
  safe.news = Array.isArray(safe.news) ? safe.news : [];
  safe.aiNews = Array.isArray(safe.aiNews) ? safe.aiNews : [];
  safe.transferPolicy = safe.transferPolicy || safe.style;
  return safe;
}
function migrateSave(raw) {
  if (!raw || typeof raw !== "object") return null;
  const version = Number(raw.version || 0);
  const migrated = { ...raw, version: SAVE_VERSION, migratedFrom: version || "legacy", migratedAt: Date.now() };
  migrated.facilities = { ...defaultFacilities(), ...(raw.facilities || {}) };
  migrated.seasonStats = { ...defaultSeasonStats(), ...(raw.seasonStats || {}) };
  migrated.week = Math.max(1, Number(raw.week || 1));
  migrated.season = Math.max(1, Number(raw.season || 1));
  migrated.cash = Number.isFinite(Number(raw.cash)) ? Number(raw.cash) : INITIAL_CASH;
  migrated.formation = raw.formation || "4-3-3";
  migrated.trainingPlan = TRAINING_PLANS[raw.trainingPlan] ? raw.trainingPlan : "balanced";
  migrated.aiDifficulty = AI_DIFFICULTIES[raw.aiDifficulty] ? raw.aiDifficulty : "Normal";
  migrated.helpMode = Boolean(raw.helpMode);
  migrated.selectedClubId = raw.selectedClubId || MY_TEAM_ID;
  migrated.selectedCoachKey = raw.selectedCoachKey || "balanced";
  migrated.teams = Array.isArray(raw.teams) ? raw.teams.map((t) => normalizeSaveTeam(t)) : [];
  migrated.market = Array.isArray(raw.market) ? raw.market : [];
  migrated.log = Array.isArray(raw.log) ? raw.log : [];
  migrated.storyLog = Array.isArray(raw.storyLog) ? raw.storyLog : [];
  migrated.worldNews = Array.isArray(raw.worldNews) ? raw.worldNews : [];
  migrated.lineupOverrides = raw.lineupOverrides && typeof raw.lineupOverrides === "object" ? raw.lineupOverrides : {};
  migrated.scoutQueue = Array.isArray(raw.scoutQueue) ? raw.scoutQueue : [];
  migrated.pendingTransfers = Array.isArray(raw.pendingTransfers) ? raw.pendingTransfers : [];
  migrated.claimed = Array.isArray(raw.claimed) ? raw.claimed : [];
  migrated.seasonHistory = Array.isArray(raw.seasonHistory) ? raw.seasonHistory : [];
  migrated.fixtureCalendar = Array.isArray(raw.fixtureCalendar) ? raw.fixtureCalendar : buildLeagueFixtures(migrated.teams.length ? migrated.teams : INITIAL_TEAMS, migrated.season);
  migrated.competitionState = raw.competitionState || initialCompetitionState(migrated.season);
  migrated.manager = raw.manager || { name: "Coach Arjuna", reputation: 1, boardTrust: 70, fanTrust: 70 };
  return migrated;
}
function saveCareer(payload) { try { window.localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), ...payload })); return true; } catch { return false; } }
function loadCareer() { try { const raw = window.localStorage.getItem(SAVE_KEY); return raw ? migrateSave(JSON.parse(raw)) : null; } catch { return null; } }
function clearCareer() { try { window.localStorage.removeItem(SAVE_KEY); } catch {} }
function downloadCareerFile(payload) {
  try {
    const blob = new Blob([JSON.stringify(migrateSave({ version: SAVE_VERSION, exportedAt: Date.now(), ...payload }), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = SAVE_FILE_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch { return false; }
}
function makeFreshMarket(academyLevel = 1) {
  const free = [];
  for (let i = 0; i < 96; i += 1) free.push({ ...genPlayer(pick(EXTRA_POSITIONS), null, rng(-4, 8), i < 8 + academyLevel * 2), sourceClub: "Free Agent", ownerTeamId: null });
  return free.sort((a, b) => b.overall - a.overall);
}
function makeTransferMarket(teams, academyLevel = 1) {
  const free = makeFreshMarket(academyLevel).slice(0, 58);
  const listed = (teams || []).filter((t) => t.id !== MY_TEAM_ID).flatMap((team) => {
    const pool = team.players.slice().sort((a, b) => b.value - a.value);
    const count = teamPower(team) >= 76 ? 1 : teamPower(team) >= 70 ? 2 : 3;
    return pool.slice(8, 8 + count).map((p) => ({ ...p, sourceClub: team.name, ownerTeamId: team.id, transferListed: true, value: Math.round(p.value * rng(104, 138) / 100 / 500) * 500 }));
  });
  return [...listed, ...free].sort((a, b) => b.overall - a.overall || b.value - a.value).slice(0, 160);
}
function cupBonusForWeek(week, team, result) {
  if (!CUP_WEEKS.has(week)) return 0;
  const won = (result.homeId === team.id && result.homeGoals > result.awayGoals) || (result.awayId === team.id && result.awayGoals > result.homeGoals);
  return won ? 110000 : 25000;
}
function randomStoryEvent(week, teams = [], myTeam = null, manager = {}) {
  const e = pick(MANAGER_EVENTS);
  const rivals = (teams || []).filter((t) => t.id !== MY_TEAM_ID && t.leagueKey === myTeam?.leagueKey).slice().sort((a, b) => teamPower(b) - teamPower(a));
  const rival = rivals[(week + (myTeam?.id || 1)) % Math.max(1, rivals.length)] || (teams || []).find((t) => t.id !== MY_TEAM_ID);
  const arc = e.type === "rivalry" && rival ? `Calon rival: ${rival.name}. Derby akan menaikkan emosi, kartu, berita, fan trust, dan gengsi.`
    : e.type === "sponsor" ? "Sponsor dapat memberi uang cepat, tetapi target membuat board lebih menuntut."
    : e.type === "youth" ? "Keputusan bisa mempercepat breakthrough akademi atau membuka offer loan untuk youth."
    : e.type === "board" ? "Board akan mengingat nada jawaban ini sampai beberapa pekan berikutnya."
    : e.stakes;
  return { id: `${week}-${Date.now()}-${Math.random().toString(36).slice(2)}`, week, key: e.key, type: e.type, title: e.title, stakes: e.stakes, arc, relatedClubId: rival?.id || null, relatedClubName: rival?.name || null, choices: e.choices, choice: null, effect: null };
}

function trainingBonus(game, key) { return TRAINING_PLANS[game.trainingPlan]?.[key] || 0; }
function isWide(x) { return x === 0 || x === 1 || x === BOARD_COLS - 2 || x === BOARD_COLS - 1; }
function aiCornerPenalty(cell, side, style = "") {
  const edge = Math.min(cell.x, BOARD_COLS - 1 - cell.x);
  const nearGoalLine = goalDistance({ ...cell, side }) <= 2 || ownGoalDistance(side, cell) <= 2;
  // AI lama terlalu sering membawa bola ke pojok. Penalti dibuat jauh lebih tegas,
  // tetapi Wing Play masih boleh memakai sisi lapangan selama bukan terjebak di sudut.
  const sidelinePenalty = edge === 0 ? 54 : edge === 1 ? 22 : 0;
  const cornerTrap = nearGoalLine && edge <= 1 ? 72 : nearGoalLine && edge <= 2 ? 24 : 0;
  const wingDiscount = style === "Wing Play" ? 0.62 : style === "Long Ball" || style === "Counter" ? 0.78 : 1;
  return Math.round((sidelinePenalty + cornerTrap) * wingDiscount);
}
function pressureAt(game, side, x, y) {
  const highPress = effect(game, otherSide(side), "press") ? 1 : 0;
  const stylePress = tacticMod(game, otherSide(side), "press") / 12;
  return game.pieces.filter((p) => !p.red && p.side !== side && distance(p, { x, y }) <= 1).length + highPress + stylePress;
}
function supportAt(game, side, x, y) { return game.pieces.filter((p) => !p.red && p.side === side && p.id !== game.ballOwnerId && distance(p, { x, y }) <= 1).length; }
function lanePressure(game, from, to) {
  const steps = Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
  let pressure = 0;
  if (steps <= 1) return pressureAt(game, from.side, to.x, to.y);
  for (let i = 1; i < steps; i += 1) {
    const x = Math.round(from.x + ((to.x - from.x) * i) / steps);
    const y = Math.round(from.y + ((to.y - from.y) * i) / steps);
    pressure += game.pieces.filter((p) => !p.red && p.side !== from.side && p.x === x && p.y === y).length * 3;
    pressure += game.pieces.filter((p) => !p.red && p.side !== from.side && distance(p, { x, y }) === 1).length;
  }
  return pressure;
}

function tiredLevel(piece) { return piece.energy < 25 ? 2 : piece.energy < 45 ? 1 : 0; }
function staminaPenalty(piece, area) {
  const tired = tiredLevel(piece);
  if (!tired) return 0;
  const map = { skill: [0, -13, -25], tackle: [0, -9, -18], shot: [0, -8, -16], pass: [0, -5, -11], dribble: [0, -8, -17] };
  return (map[area] || [0, -6, -12])[tired];
}
function reason(label, value) { return { label, value: Math.round(value) }; }
function reasonsToText(reasons = []) { return reasons.filter((r) => r.value).map((r) => `${r.value > 0 ? "+" : ""}${r.value} ${r.label}`).join(" · "); }
function lineCellsBetween(from, to) {
  const steps = Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
  const cells = [];
  for (let i = 1; i < steps; i += 1) cells.push({ x: Math.round(from.x + ((to.x - from.x) * i) / steps), y: Math.round(from.y + ((to.y - from.y) * i) / steps) });
  return cells;
}
function interceptionInfo(game, from, to, through = false) {
  const cells = lineCellsBetween(from, to);
  if (!cells.length) return { risk: 0, defender: null, label: "Jalur aman", reasons: [] };
  const defenders = game.pieces.filter((p) => !p.red && p.side !== from.side && p.role !== "GK").map((p) => {
    const laneDist = Math.min(...cells.map((c) => distance(p, c)));
    if (laneDist > 1) return null;
    const role = roleSkillBonus(p, "intercept");
    const base = 5 + p.defend * 0.13 + p.pace * 0.05 + role + (through ? 7 : 0) + tacticMod(game, p.side, "press") * 0.45;
    const risk = clamp(base - laneDist * 9 + (p.role === "CDM" ? 7 : 0) + (p.role === "CB" ? 3 : 0), 3, through ? 38 : 26);
    return { defender: p, risk };
  }).filter(Boolean).sort((a, b) => b.risk - a.risk);
  const best = defenders[0];
  if (!best) return { risk: 0, defender: null, label: "Jalur aman", reasons: [] };
  return { risk: Math.round(best.risk), defender: best.defender, label: `Intersep ${Math.round(best.risk)}% oleh ${firstName(best.defender.name)}`, reasons: [reason("risiko intersep", -best.risk)] };
}

function energyMod(piece) { return piece.energy >= 75 ? 6 : piece.energy >= 50 ? 0 : piece.energy >= 30 ? -11 : -22; }
function traitBonus(piece, area) {
  if (!piece) return 0;
  if (area === "pass" && piece.trait === "Playmaker") return 12;
  if (area === "shot" && piece.trait === "Poacher") return 12;
  if (area === "dribble" && ["Speedster", "Trickster"].includes(piece.trait)) return piece.trait === "Speedster" ? 8 : 15;
  if (area === "tackle" && piece.trait === "Destroyer") return 12;
  if (area === "block" && piece.trait === "Wall Defender") return 12;
  if (area === "setpiece" && piece.trait === "Set Piece Ace") return 15;
  if (piece.trait === "Super Sub" && piece.energy >= 80) return 6;
  return 0;
}
function legalRunCells(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ended || piece.red || piece.vacant || pieceTemporarilyOut(game, piece) || piece.side !== game.turn || game.ap < 1) return [];
  const hasBall = game.ballOwnerId === piece.id;
  const isKeeper = piece.role === "GK";
  let range = isKeeper ? 4 : (hasBall ? 2 : 3);
  if (!isKeeper && tiredLevel(piece) >= 1) range -= 1;
  if (!isKeeper && piece.pace >= 80) range += 1;
  if (!isKeeper && piece.trait === "Speedster") range += 1;
  if (!isKeeper) range += roleSkillBonus(piece, "run", { x: piece.x, y: piece.y });
  if (!isKeeper && effect(game, piece.side, "counter")) range += 1;
  if (!isKeeper && effect(game, piece.side, "calm") && hasBall) range -= 1;
  range = clamp(range, 1, isKeeper ? 4 : 5);
  const cells = [];
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      if (x === piece.x && y === piece.y) continue;
      if (pieceAt(game, x, y)) continue;
      const d = distance(piece, { x, y });
      if (d > range) continue;
      if (isKeeper && ownGoalDistance(piece, { x, y }) > 4) continue;
      if (!isKeeper && hasBall && goalDistance({ ...piece, x, y }) > goalDistance(piece) + 1) continue;
      let cost = isKeeper ? 2 : (hasBall && pressureAt(game, piece.side, x, y) >= 1.5 ? 2 : 1);
      if (!isKeeper && tiredLevel(piece) >= 1 && d >= 3) cost += 1;
      if (!isKeeper && tiredLevel(piece) >= 2) cost += 1;
      if (game.ap < cost) continue;
      cells.push({ x, y, kind: isKeeper ? "keeper" : hasBall ? "dribble" : "run", cost });
    }
  }
  return cells;
}
function passOptions(game, pieceId, through = false) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ended || piece.red || piece.vacant || pieceTemporarilyOut(game, piece) || piece.side !== game.turn || game.ballOwnerId !== piece.id || game.ap < (through ? 2 : 1)) return [];
  return game.pieces.filter((p) => !p.red && !p.vacant && !pieceTemporarilyOut(game, p) && p.side === piece.side && p.id !== piece.id).map((target) => {
    const d = distance(piece, target);
    const maxRange = clamp(Math.round(piece.pass / (through ? 10 : 12)), 4, through ? 9 : 8);
    if (d > maxRange) return null;
    const forwardBonus = goalDistance(piece) - goalDistance(target);
    const lane = lanePressure(game, piece, target);
    const targetPressure = pressureAt(game, target.side, target.x, target.y);
    const trap = trapInfo(game, piece);
    const intercept = interceptionInfo(game, piece, target, through);
    const roleCtx = { target, through, x: piece.x, y: piece.y, goalDistance: goalDistance(piece) };
    const roleBonus = roleSkillBonus(piece, through ? "through" : "pass", roleCtx) + roleSkillBonus(target, "receive", { goalDistance: goalDistance(target) });
    const stylePass = tacticMod(game, piece.side, "pass") + (!through && d <= 3 ? tacticMod(game, piece.side, "shortPass") : 0) + (through ? tacticMod(game, piece.side, "through") : 0);
    const stamina = energyMod(piece) + staminaPenalty(piece, "pass");
    let chance = 70 + piece.pass * 0.28 + target.overall * 0.07 + stamina + traitBonus(piece, "pass") + roleBonus + trainingBonus(game, "pass") + game.momentum[piece.side] * 3 + stylePass;
    chance += forwardBonus * (through ? 4 : 2);
    chance -= d * (through ? 4.5 : 3.5) + lane * 11 + targetPressure * 6;
    chance -= trap.passPenalty + (through && trap.passPenalty ? 8 : 0) + intercept.risk * (through ? 0.55 : 0.35);
    if (through) chance += effect(game, piece.side, "through") ? 18 : 0;
    if (effect(game, piece.side, "onetwo") && d <= 3) chance += 8;
    if (effect(game, piece.side, "wing") && (isWide(piece.x) || isWide(target.x))) chance += 16 + roleSkillBonus(piece, "cross", { target });
    if (effect(game, otherSide(piece.side), "press")) chance -= 8;
    chance = clamp(chance, trap.trapped ? 5 : 12, trap.trapped ? 68 : 97);
    const reasons = [reason("base", 70), reason("passing", piece.pass * 0.28), reason("role", roleBonus), reason("taktik", stylePass), reason("stamina", stamina), reason("progress", forwardBonus * (through ? 4 : 2)), reason("jarak", -d * (through ? 4.5 : 3.5)), reason("jalur tertekan", -lane * 11), reason("target ditekan", -targetPressure * 6), reason(trap.trapped ? "terkepung" : "ditekan", -trap.passPenalty), ...intercept.reasons];
    return { target, chance: Math.round(chance), d, forwardBonus, lane, cost: through ? 2 : 1, through, trap, intercept, reasons };
  }).filter(Boolean).sort((a, b) => b.chance + b.forwardBonus * 6 - (a.chance + a.forwardBonus * 6));
}
function tackleOptions(game, pieceId) {
  const piece = getPiece(game, pieceId);
  const carrier = getPiece(game, game.ballOwnerId);
  if (!piece || !carrier || game.ended || piece.red || piece.vacant || pieceTemporarilyOut(game, piece) || piece.side !== game.turn || carrier.side === piece.side || game.ap < 1) return [];
  const d = distance(piece, carrier);
  if (d > 1) return [];
  const help = supportAt(game, piece.side, carrier.x, carrier.y);
  const roleBonus = roleSkillBonus(piece, "tackle", { target: carrier });
  const stamina = energyMod(piece) + staminaPenalty(piece, "tackle");
  let chance = 41 + piece.defend * 0.43 - carrier.dribble * 0.25 + help * 5 + stamina + traitBonus(piece, "tackle") + roleBonus + trainingBonus(game, "tackle") + game.momentum[piece.side] * 2 + tacticMod(game, piece.side, "tackle");
  if (effect(game, piece.side, "press")) chance += 12;
  if (sideStyle(game, piece.side) === "Physical") chance += 8;
  if (game.isDerby) chance += 2;
  chance = clamp(chance, tiredLevel(piece) >= 2 ? 8 : 17, tiredLevel(piece) ? 78 : 88);
  const reasons = [reason("defend", piece.defend * 0.43), reason("bantuan", help * 5), reason("role", roleBonus), reason("stamina", stamina), reason("taktik", tacticMod(game, piece.side, "tackle")), reason("dribble lawan", -carrier.dribble * 0.25)];
  return [{ target: carrier, chance: Math.round(chance), cost: 1, reasons }];
}
function oneOnOneInfo(game, piece) {
  if (!piece) return { active: false, defenders: 0, label: "" };
  const dir = directionOf(piece.side);
  const defenders = game.pieces.filter((p) => {
    if (p.red || p.vacant || pieceTemporarilyOut(game, p) || p.side === piece.side || p.role === "GK") return false;
    const forward = (p.y - piece.y) * dir;
    if (forward < 1 || forward > 4) return false;
    return Math.abs(p.x - piece.x) <= 2;
  });
  const keeper = keeperForSide(game, otherSide(piece.side));
  const active = goalDistance(piece) <= 4 && defenders.length === 0 && Boolean(keeper);
  return { active, defenders: defenders.length, label: active ? "One on one: tidak ada bek di depan" : "" };
}

function shotInfo(game, pieceId) {
  const piece = getPiece(game, pieceId);
  const blocked = { can: false, chance: 0, cost: 2, xg: 0, label: "Tidak bisa tembak", laneInfo: null, needsSkill: false };
  if (!piece || game.ended || piece.red || piece.vacant || pieceTemporarilyOut(game, piece) || piece.side !== game.turn || game.ballOwnerId !== piece.id || piece.role === "GK" || game.ap < 1) return blocked;

  const d = goalDistance(piece);
  const laneInfo = shotLaneInfo(piece);
  const skillMoveShot = effect(game, piece.side, "skillshot");
  const skillShot = hasShotSkill(game, piece.side);
  const maxRange = laneInfo.baseRange + (skillShot && laneInfo.baseRange > 0 ? SKILL_SHOT_RANGE_BONUS : 0);
  const needsSkill = laneInfo.baseRange > 0 && d > laneInfo.baseRange && d <= laneInfo.baseRange + SKILL_SHOT_RANGE_BONUS;
  const cost = skillMoveShot && d > laneInfo.baseRange ? 1 : 2;
  const zoneAllowed = laneInfo.baseRange > 0 && d <= maxRange;
  const can = zoneAllowed && game.ap >= cost;
  const rawPress = pressureAt(game, piece.side, piece.x, piece.y);
  const oneOnOne = oneOnOneInfo(game, piece);
  const press = oneOnOne.active ? 0 : rawPress;
  const keeperStatus = keeperCoverage(game, otherSide(piece.side));
  const keeper = keeperStatus.keeper;
  const laneBonus = laneInfo.lane === "straight" ? 13 : laneInfo.lane === "side" ? 4 : -18;
  const inBox = d <= 2 && laneInfo.lane !== "wide";
  const emptyGoalBonus = keeperStatus.inGoal ? 0 : clamp(9 + piece.shoot * 0.10 - d * 1.8 - press * 2.5, 2, 24);

  const roleBonus = roleSkillBonus(piece, "shot", { goalDistance: d });
  const stamina = energyMod(piece) + staminaPenalty(piece, "shot");
  let chance = 11 + piece.shoot * 0.56 + laneBonus + stamina + traitBonus(piece, "shot") + roleBonus + trainingBonus(game, "shot") + game.momentum[piece.side] * 4 + tacticMod(game, piece.side, "shot");
  chance += piece.side === "home" ? 2 : 0;
  if (skillShot) chance += d > laneInfo.baseRange ? 14 : 6;
  if (effect(game, piece.side, "counter")) chance += 9;
  if (effect(game, otherSide(piece.side), "park") && !oneOnOne.active) chance -= 15;
  if (oneOnOne.active) chance += 17;
  const keeperWall = keeper ? ((keeper.overall || 65) * 0.16 + traitBonus(keeper, "block") + roleSkillBonus(keeper, "save") + tacticMod(game, keeper.side, "block")) * keeperStatus.coverage : 0;
  chance += emptyGoalBonus;
  chance -= d * 7.5 + press * 11 + keeperWall;
  if (inBox) chance += 11;
  if (needsSkill && skillShot) chance -= 7;
  if (game.isDerby) chance += 2;
  chance = clamp(chance, 3, keeperStatus.inGoal ? 91 : 88);

  let label = chance >= 65 ? "Peluang emas" : chance >= 45 ? "Bagus" : chance >= 25 ? "Spekulasi" : "Sulit";
  if (oneOnOne.active && can) label = `One on one ${label}`;
  else if (!keeperStatus.inGoal && can) label = `Gawang kosong ${label}`;
  if (!can) {
    label = !zoneAllowed ? (laneInfo.baseRange <= 0 ? "Geser ke jalur gawang" : needsSkill ? "Butuh skill/Long Shot" : `Terlalu jauh (${shotZoneText({ laneInfo })})`) : `AP kurang (${cost}AP)`;
  } else if (skillShot && d > laneInfo.baseRange) {
    label = `Skill shot ${label}`;
  }
  const reasons = [reason("shoot/akurasi", piece.shoot * 0.56), reason("jalur", laneBonus), reason("role", roleBonus), reason("stamina", stamina), reason("taktik", tacticMod(game, piece.side, "shot")), reason("one on one", oneOnOne.active ? 17 : 0), reason("jarak", -d * 7.5), reason("pressure", -press * 11), reason(keeperStatus.inGoal ? "GK/blok" : "GK keluar/gawang kosong", keeperStatus.inGoal ? -keeperWall : emptyGoalBonus), reason("kotak", inBox ? 11 : 0)];
  return { can, chance: Math.round(chance), cost, xg: clamp(chance / 100, 0.03, 0.91), label, laneInfo, maxRange, needsSkill: needsSkill && !skillShot, reasons, keeperInGoal: keeperStatus.inGoal, keeperCoverage: keeperStatus.coverage };
}

function shotZoneCellsFor(game, pieceId) {
  const piece = getPiece(game, pieceId);
  if (!piece || game.ballOwnerId !== piece.id || piece.role === "GK") return new Map();
  const skillShot = hasShotSkill(game, piece.side);
  const map = new Map();
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      const laneInfo = shotLaneInfo({ ...piece, x, y });
      if (laneInfo.baseRange <= 0) continue;
      const d = goalDistance({ ...piece, x, y });
      if (d <= laneInfo.baseRange) map.set(`${x}-${y}`, { kind: "shotZone", text: "Normal shot" });
      else if (skillShot && d <= laneInfo.baseRange + SKILL_SHOT_RANGE_BONUS) map.set(`${x}-${y}`, { kind: "skillShotZone", text: "Skill shot" });
    }
  }
  return map;
}

function tacticalMarkers(game, selectedId, passes = [], throughs = [], runCells = []) {
  const map = new Map();
  const selected = getPiece(game, selectedId);
  const carrier = getPiece(game, game.ballOwnerId);
  const mark = (x, y, kind, label = "") => {
    if (!insideBoard(x, y)) return;
    const key = `${x}-${y}`;
    const prev = map.get(key);
    if (!prev || kind === "dangerLane" || kind === "openSpace") map.set(key, { kind, label });
  };
  [...passes.slice(0, 5), ...throughs.slice(0, 5)].forEach((o) => {
    if (!selected || !o?.target) return;
    const risky = (o.intercept?.risk || 0) >= 24 || o.chance < 45;
    lineCellsBetween(selected, o.target).forEach((c) => mark(c.x, c.y, risky ? "dangerLane" : "passLane", risky ? "Risk intersep" : "Jalur oper"));
  });
  runCells.slice(0, 12).forEach((c) => {
    const pressure = pressureAt(game, selected?.side || game.userSide, c.x, c.y);
    if (pressure <= 0 && c.cost <= 1) mark(c.x, c.y, "openSpace", "Ruang kosong");
    else if (pressure >= 2) mark(c.x, c.y, "dangerLane", "Pressure");
  });
  if (carrier?.side !== game.userSide && selected?.side === game.userSide) {
    lineCellsBetween(selected, carrier).forEach((c) => mark(c.x, c.y, "dangerLane", "Jalur bahaya"));
  }
  return map;
}
function matchMvp(game) {
  const goalEvents = game.events?.filter((e) => e.type === "goal") || [];
  const goalNames = goalEvents.map((e) => e.player).filter(Boolean);
  const byGoals = game.pieces.map((p) => ({ p, goals: goalNames.filter((n) => n === p.name).length, bonus: p.id === game.ballOwnerId ? 1 : 0 }))
    .sort((a, b) => (b.goals * 20 + b.p.overall + b.bonus) - (a.goals * 20 + a.p.overall + a.bonus))[0];
  return byGoals?.p || game.pieces.slice().sort((a, b) => b.overall - a.overall)[0];
}
function keyMomentText(game) {
  const moments = (game.history || []).filter((h) => /GOOOL|PENALTI|corner|Free kick|intercept|cedera|tackle|melenceng|menepis/i.test(h.text)).slice(0, 5);
  return moments.length ? moments : (game.history || []).slice(0, 5);
}
function inboxItems({ myTeam, fixture, fixtures = [], week, cash, scoutQueue, pendingTransfers = [], storyLog, market, facilities, trainingPlan, active }) {
  const items = [];
  const weekMatches = fixtures?.length || (fixture ? 1 : 0);
  if (active?.game) items.push({ icon: "⚽", title: "Match sedang berjalan", body: "Kembali ke Match untuk menyelesaikan pekan sebelum career loop lanjut.", actionTab: "match", actionLabel: "Kembali Match" });
  if (fixture) items.push({ icon: weekMatches > 1 ? "📅📅" : "📅", title: `Pekan ${week}: ${weekMatches} laga tim kamu`, body: `${fixture.homeId === MY_TEAM_ID ? "Home" : "Away"} · ${fixture.cupName || leagueName(fixture.leagueKey)}. Masuk pre-match untuk cek lawan, formasi, dan lineup sebelum mulai.`, actionTab: "match", actionLabel: "Atur Match" });
  const offers = seniorPlayers(myTeam).filter((p) => p.pendingOffer).length;
  if (offers) items.push({ icon: "📩", title: `${offers} offer transfer/loan menunggu`, body: "Keputusan ada di tangan user: terima, tolak, atau ajukan ulang. Jangan biarkan offer penting terlewat.", actionTab: "squad", actionLabel: "Buka Skuad" });
  const pendingYouth = academyPlayers(myTeam).filter((p) => p.pendingSquadAction?.type === "promoteYouth").length;
  const academyReady = academyPlayers(myTeam).filter((p) => !p.pendingSquadAction && !p.listedForSale && !p.listedForLoan).sort((a, b) => (b.potential - b.overall) - (a.potential - a.overall))[0];
  if (pendingYouth) items.push({ icon: "🌱", title: `${pendingYouth} youth menunggu promosi`, body: "Promosi akan diproses setelah pekan selesai. Pemain akan masuk skuad senior dengan gaji dan kontrak.", actionTab: "youth", actionLabel: "Cek Youth" });
  else if (academyReady) items.push({ icon: "🌱", title: `Akademi: ${firstName(academyReady.name)} siap dipantau`, body: `${academyReady.pos} OVR ${academyReady.overall}, potensi ${academyReady.scouted ? academyReady.potential : "belum dibuka"}. Youth refresh tiap 20 pekan, jadi pantau sebelum hilang.`, actionTab: "youth", actionLabel: "Buka Youth" });
  const expiring = seniorPlayers(myTeam).filter((p) => (p.contract || 0) <= 1 && !p.pendingSquadAction).length;
  if (expiring) items.push({ icon: "🧾", title: `${expiring} kontrak hampir habis`, body: "Perpanjang kontrak dari menu Skuad. Jika kontrak habis dan tidak diperpanjang, pemain bisa menjadi free agent.", actionTab: "squad", actionLabel: "Urus Kontrak" });
  if (cash <= INITIAL_CASH) items.push({ icon: "💰", title: "Budget ketat", body: "Kas awal tidak cukup untuk banyak pemain menengah. Manfaatkan loan, scout, home income, dan akademi.", actionTab: "transfer", actionLabel: "Cari Murah" });
  if (scoutQueue?.length) items.push({ icon: "🔎", title: `${scoutQueue.length} scout report berjalan`, body: `Scout selesai maksimal 7 pekan. Selama scout berjalan kamu tidak bisa spam pencarian lagi.`, actionTab: "transfer", actionLabel: "Cek Scout" });
  if (pendingTransfers?.length) items.push({ icon: "🕒", title: `${pendingTransfers.length} transfer masuk menunggu registrasi`, body: pendingTransfers.map((t) => `${t.player?.name || "Pemain"} masuk pekan ${t.dueWeek}`).join(" · "), actionTab: "transfer", actionLabel: "Cek Transfer" });
  const scoutReady = (market || []).filter((p) => p.randomScout || p.scoutReportWeek).sort((a, b) => (b.scoutReportWeek || 0) - (a.scoutReportWeek || 0))[0];
  if (scoutReady) items.push({ icon: "🔎", title: `Scout menemukan ${scoutReady.name}`, body: `${scoutReady.pos} OVR ${scoutReady.overall}, POT ${scoutReady.scouted ? scoutReady.potential : "??"}. Buka Transfer untuk lihat detail, kontrak sementara/loan, beli, atau tolak.`, actionTab: "transfer", actionLabel: "Buka Report" });
  const bestAffordable = (market || []).filter((p) => p.value <= cash && !p.userListed).sort((a, b) => b.overall - a.overall)[0];
  if (bestAffordable) items.push({ icon: "🛒", title: "Target transfer terjangkau", body: `${bestAffordable.name} (${bestAffordable.pos}, OVR ${bestAffordable.overall}) masuk budget sekarang. Cek dulu potensi lewat tombol scout/potensi.`, actionTab: "transfer", actionLabel: "Buka Transfer" });
  const openStory = storyLog?.filter((e) => !e.choice).length || 0;
  const meetingUsed = storyLog?.some((e) => e.manualMeeting && e.week === week);
  if (openStory) items.push({ icon: "🗞️", title: `${openStory} story event belum dijawab`, body: "Jawaban manager memengaruhi fans, board, kas, reputasi, rivalitas, berita, dan morale.", actionTab: "story", actionLabel: "Jawab Story" });
  else items.push({ icon: "🎙️", title: meetingUsed ? "Meeting media pekan ini sudah dipakai" : "Meeting media tersedia", body: meetingUsed ? "Buka meeting hanya 1x per pekan agar tidak bisa spam efek story." : "Buka 1 meeting opsional pekan ini untuk memancing berita dan dampak klub.", actionTab: "story", actionLabel: "Buka Story" });
  const tired = seniorPlayers(myTeam).filter((p) => (p.fitness || 100) < 65).length || 0;
  if (tired) items.push({ icon: "🩺", title: `${tired} pemain kurang fit`, body: `Training ${trainingPlan}; Medical Lv ${facilities?.medical || 1}. Rotasi dan recovery mengurangi risiko cedera fatal.`, actionTab: "training", actionLabel: "Atur Latihan" });
  items.push({ icon: "🗓️", title: "Kalender & jadwal", body: `Season 60 pekan. Pekan dengan 2+ laga dipisah tanggal supaya tidak terlalu berdekatan.`, actionTab: "calendar", actionLabel: "Lihat Kalender" });
  return items.slice(0, 10);
}

function appendLog(game, icon, text, event = null) {
  const minute = minuteOf(game);
  game.history = [{ minute, icon, text }, ...(game.history || [])].slice(0, 90);
  game.lastAction = text;
  game.actionFx = { icon, text, type: event?.type || icon, stamp: Date.now(), minute };
  if (event) game.events = [...(game.events || []), { ...event, min: minute }];
}

function advanceMatchClock(game, seconds = REALTIME_TICK_SECONDS) {
  if (!game || game.ended || game.goalPause) return game;
  game.clockSeconds = clamp((game.clockSeconds || 0) + seconds, 0, matchMaxSeconds(game));
  recoverMinorInjuries(game);
  finishIfNeeded(game);
  return game;
}
function tickRealtimeClock(game, seconds = REALTIME_TICK_SECONDS) {
  const next = clone(game);
  return advanceMatchClock(next, seconds);
}

function tickEffects(game, side) {
  game.effects[side] = (game.effects[side] || []).map((e) => ({ ...e, ttl: e.ttl - 1 })).filter((e) => e.ttl > 0);
}
function spendAp(game, side, cost) {
  game.ap = clamp(game.ap - cost, 0, MAX_AP);
  advanceMatchClock(game, 14 + cost * 8);
  tickEffects(game, side);
  applyAutoShape(game);
  if (game.ap <= 0 && !game.ended) switchTurn(game);
}
function switchTurn(game) {
  game.turn = otherSide(game.turn);
  game.ap = MAX_AP;
  game.actionNo += 1;
  game.aiPlan = pick(AI_PLANS);
  const carrier = getPiece(game, game.ballOwnerId);
  if (carrier) game.stats[carrier.side].possession += 1;
  game.pieces.forEach((p) => { if (!p.red && p.side === game.turn) p.energy = clamp(p.energy + 1, 0, 100); });
  applyAutoShape(game);
  finishIfNeeded(game);
}
function avgOverall(list = []) { return list.length ? list.reduce((sum, p) => sum + (p.overall || 55), 0) / list.length : 55; }
function isImportantEliminationGame(game) {
  const stage = String(game?.stage || "").toLowerCase();
  const comp = String(game?.competition || "league").toLowerCase();
  return comp !== "league" && /(semi|final|grand|penentu|knock|cup|championship)/i.test(`${stage} ${game?.cupName || ""}`);
}
function resolvePenaltyShootout(game) {
  const homePower = avgOverall(game.pieces.filter((p) => p.side === "home" && p.role !== "GK"));
  const awayPower = avgOverall(game.pieces.filter((p) => p.side === "away" && p.role !== "GK"));
  let homePens = 0; let awayPens = 0;
  for (let i = 0; i < 5; i += 1) {
    if (roll(clamp(70 + (homePower - awayPower) * 0.18 + rng(-8, 8), 52, 88))) homePens += 1;
    if (roll(clamp(70 + (awayPower - homePower) * 0.18 + rng(-8, 8), 52, 88))) awayPens += 1;
  }
  while (homePens === awayPens) {
    if (roll(72)) homePens += 1;
    if (roll(72)) awayPens += 1;
  }
  const winner = homePens > awayPens ? "home" : "away";
  game.penalty = { home: homePens, away: awayPens, winner };
  game.score[winner] += 1; // penanda pemenang supaya bracket/kompetisi tidak buntu saat skor seri.
  appendLog(game, "🎯", `Drama penalti: ${game.homeName} ${homePens}-${awayPens} ${game.awayName}. ${winner === "home" ? game.homeName : game.awayName} lolos.`, { type: "penalty", side: winner, team: winner === "home" ? game.homeName : game.awayName });
}
function finishMatchWithExtraTime(game, label = "Full time") {
  if (game.ended) return true;
  const tied = game.score.home === game.score.away;
  if (tied && isImportantEliminationGame(game) && !game.extraTimeStarted) {
    game.extraTimeStarted = true;
    game.matchMaxSeconds = EXTRA_TIME_CLOCK_SECONDS;
    game.clockSeconds = MATCH_CLOCK_SECONDS;
    appendLog(game, "⏱️", `${label}: skor imbang. Laga penting masuk Extra Time 30 menit.`);
    return false;
  }
  if (tied && isImportantEliminationGame(game) && game.extraTimeStarted && !game.penalty) resolvePenaltyShootout(game);
  game.clockSeconds = matchMaxSeconds(game);
  game.ended = true;
  game.winner = game.score.home === game.score.away ? "draw" : game.score.home > game.score.away ? "home" : "away";
  appendLog(game, "🏁", `${game.extraTimeStarted ? "AET" : label}: ${game.homeName} ${game.score.home}-${game.score.away} ${game.awayName}${game.penalty ? ` · Pens ${game.penalty.home}-${game.penalty.away}` : ""}.`);
  return true;
}
function finishIfNeeded(game) {
  const clockOver = (game.clockSeconds || 0) >= matchMaxSeconds(game);
  if (game.actionNo > game.maxActions || clockOver) return finishMatchWithExtraTime(game, "Full time");
  return false;
}
function resetAfterGoal(game, scorerSide) {
  const restart = otherSide(scorerSide);
  const homeSlots = lineForFormation(game.homeFormation);
  const awaySlots = lineForFormation(game.awayFormation).map(mirror);
  const homePieces = game.pieces.filter((p) => p.side === "home");
  const awayPieces = game.pieces.filter((p) => p.side === "away");
  homePieces.forEach((p, i) => { if (!p.red) { p.x = homeSlots[i]?.x ?? p.x; p.y = homeSlots[i]?.y ?? p.y; } });
  awayPieces.forEach((p, i) => { if (!p.red) { p.x = awaySlots[i]?.x ?? p.x; p.y = awaySlots[i]?.y ?? p.y; } });
  game.ballOwnerId = kickoffPlayer(game.pieces, restart);
  game.turn = restart;
  game.ap = MAX_AP;
  game.momentum[scorerSide] = 1;
  game.momentum[restart] = 2;
  game.lastGoalRestartSide = restart;
  resolvePieceCollisions(game);
  game.goalPause = { scorerSide, restartSide: restart, score: { ...game.score }, minute: minuteOf(game), text: game.lastAction };
  game.highlights = [{ minute: minuteOf(game), icon: "🥅", text: game.lastAction, score: { ...game.score } }, ...(game.highlights || [])].slice(0, 12);
  game.actionNo += 1;
}

// ── REAL SOCCER MODE ────────────────────────────────────────────────────────
function clampFieldX(x) { return clamp(Number.isFinite(x) ? x : FIELD_W / 2, 2, FIELD_W - 2); }
function clampFieldY(y) { return clamp(Number.isFinite(y) ? y : FIELD_H / 2, 2, FIELD_H - 2); }
function gridToFieldX(x) { return clampFieldX(4 + (Number(x) / Math.max(1, BOARD_COLS - 1)) * (FIELD_W - 8)); }
function gridToFieldY(y) { return clampFieldY(3 + (Number(y) / Math.max(1, BOARD_ROWS - 1)) * (FIELD_H - 6)); }
function goalCenterX() { return FIELD_W / 2; }
function goalX1() { return FIELD_W / 2 - GOAL_W / 2; }
function goalX2() { return FIELD_W / 2 + GOAL_W / 2; }
function sideGoalY(side) { return side === "home" ? 0 : FIELD_H; }
function sideOwnGoalY(side) { return side === "home" ? FIELD_H : 0; }
function rtDist(a, b) { const dx = (a?.rx ?? a?.x ?? 0) - (b?.rx ?? b?.x ?? 0); const dy = (a?.ry ?? a?.y ?? 0) - (b?.ry ?? b?.y ?? 0); return Math.hypot(dx, dy); }
function rtBallDist(piece, ball) { return Math.hypot((piece?.rx || 0) - (ball?.x || 0), (piece?.ry || 0) - (ball?.y || 0)); }
function rtAlive(game, p) { return p && !p.red && !p.vacant && !pieceTemporarilyOut(game, p); }
function rtTeam(game, side) { return (game.pieces || []).filter((p) => rtAlive(game, p) && p.side === side); }
function rtOpponent(game, side) { return (game.pieces || []).filter((p) => rtAlive(game, p) && p.side !== side); }
function rtRoleRank(role) { return ({ ST: 90, LW: 78, RW: 78, CAM: 68, LM: 55, RM: 55, CM: 46, CDM: 36, LB: 24, RB: 24, CB: 14, GK: 0 })[role] || 30; }
function rtXFromBoard(slotX) { return clamp(8 + (Number(slotX || 0) / Math.max(1, BOARD_COLS - 1)) * 84, 5, 95); }
function rtYFromRole(role, side, lineIndex = 0) {
  // Kick-off/restart selalu seperti sepakbola asli: semua pemain masih di area sendiri,
  // tidak ada attacker yang sudah melewati garis tengah sebelum bola dimainkan.
  const home = { GK: 58, CB: 51, LB: 50, RB: 50, CDM: 45, CM: 40, LM: 39, RM: 39, CAM: 36, LW: 35, RW: 35, ST: 34 };
  const raw = home[role] ?? (42 - lineIndex * 1.2);
  const y = side === "home" ? Math.max(FIELD_H / 2 + 1.4, raw) : Math.min(FIELD_H / 2 - 1.4, FIELD_H - raw);
  return clampFieldY(y);
}
function rtFormationFieldSlots(formation, side) {
  const raw = FORMATIONS[formation] || FORMATIONS["4-3-3"];
  const counts = {};
  return raw.map(([pos, x], idx) => {
    counts[pos] = (counts[pos] || 0) + 1;
    const xBase = pos === "GK" ? 50 : rtXFromBoard(x);
    const yBase = rtYFromRole(pos, side, idx);
    const laneNudge = ({ LW: -2.5, LM: -1.8, LB: -1.2, RW: 2.5, RM: 1.8, RB: 1.2, ST: counts[pos] === 2 ? (xBase < 50 ? -3 : 3) : 0, CB: counts[pos] === 2 ? (xBase < 50 ? -2 : 2) : 0 })[pos] || 0;
    return { pos, x: clampFieldX(xBase + laneNudge), y: clampFieldY(yBase), slotIndex: idx };
  });
}
function rtSideDir(side) { return side === "home" ? -1 : 1; }
function rtSanitizeStick(stick = {}) {
  const x = Number.isFinite(stick.x) ? clamp(stick.x, -1, 1) : 0;
  const y = Number.isFinite(stick.y) ? clamp(stick.y, -1, 1) : 0;
  const mag = Number.isFinite(stick.mag) ? clamp(stick.mag, 0, 1) : clamp(Math.hypot(x, y), 0, 1);
  if (mag < RT_STICK_DEADZONE) return { x: 0, y: 0, mag: 0 };
  const len = Math.max(0.001, Math.hypot(x, y));
  return { x: (x / len) * mag, y: (y / len) * mag, mag };
}
function rtStickFor(game, pieceId = null) {
  const stick = rtSanitizeStick(game?.rt?.stick || {});
  if (!stick.mag) return stick;
  if (pieceId && game?.rt?.stick?.pieceId && String(game.rt.stick.pieceId) !== String(pieceId)) return { x: 0, y: 0, mag: 0 };
  return stick;
}
function rtStickDirectionForAction(game, piece) {
  const stick = rtStickFor(game, piece?.id);
  if (stick.mag >= RT_STICK_DEADZONE) return stick;
  if (!piece) return { x: 0, y: rtSideDir(game?.userSide || "home"), mag: 0 };
  return { x: 0, y: rtSideDir(piece.side), mag: 0 };
}
function rtDotDir(ax, ay, bx, by) {
  const al = Math.max(0.001, Math.hypot(ax, ay));
  const bl = Math.max(0.001, Math.hypot(bx, by));
  return (ax / al) * (bx / bl) + (ay / al) * (by / bl);
}
function rtBlendTarget(piece, raw, strength = 0.38) {
  if (!piece || !raw) return { x: piece?.rx ?? FIELD_W / 2, y: piece?.ry ?? FIELD_H / 2 };
  const currentX = piece.targetX ?? piece.rx ?? raw.x;
  const currentY = piece.targetY ?? piece.ry ?? raw.y;
  const jump = Math.hypot(raw.x - currentX, raw.y - currentY);
  const adaptive = clamp(strength + Math.min(0.22, jump / 90), 0.14, 0.92);
  piece.targetX = clampFieldX(currentX * (1 - adaptive) + raw.x * adaptive);
  piece.targetY = clampFieldY(currentY * (1 - adaptive) + raw.y * adaptive);
  return { x: piece.targetX, y: piece.targetY };
}
function rtStyleDepthMod(game, side, phase = "attack") {
  const style = sideStyle(game, side);
  if (style === "Counter") return phase === "attack" ? 4.8 : -1.5;
  if (style === "Long Ball") return phase === "attack" ? 5.5 : -1.2;
  if (style === "High Press" || style === "Gegenpress") return phase === "attack" ? 2.8 : 4.2;
  if (style === "Park Bus" || style === "Catenaccio") return phase === "attack" ? -2.4 : -5.5;
  if (style === "Vertical Tiki Taka") return phase === "attack" ? 3.3 : 1.2;
  return 0;
}
function rtStyleWidthMod(game, side) {
  const profile = styleProfile(game, side);
  return clamp((profile?.width || 0) * 0.42, -7.5, 9.5);
}
function rtRoleDiscipline(piece) {
  if (!piece) return 0.5;
  if (["CB", "GK"].includes(piece.role)) return 0.86;
  if (["LB", "RB", "CDM"].includes(piece.role)) return 0.76;
  if (["CM", "LM", "RM"].includes(piece.role)) return 0.62;
  if (["CAM"].includes(piece.role)) return 0.48;
  return 0.38;
}
function rtRoleBand(side, role, phase = "neutral") {
  const homeBands = {
    GK: [54, 62], CB: [44, 57], LB: [42, 56], RB: [42, 56], CDM: [37, 50], CM: [30, 47], LM: [29, 47], RM: [29, 47],
    CAM: [20, 42], LW: [16, 40], RW: [16, 40], ST: [10, 38],
  };
  const band = homeBands[role] || [24, 48];
  let [minY, maxY] = side === "home" ? band : [FIELD_H - band[1], FIELD_H - band[0]];
  if (phase === "attack") { minY -= side === "home" ? 7 : 0; maxY += side === "away" ? 7 : 0; }
  if (phase === "defend") { minY += side === "home" ? 4 : -4; maxY += side === "home" ? 4 : -4; }
  return [clampFieldY(Math.min(minY, maxY)), clampFieldY(Math.max(minY, maxY))];
}
function rtRoleWidthAnchor(piece) {
  const role = piece?.role;
  if (["LW", "LM", "LB"].includes(role)) return 18;
  if (["RW", "RM", "RB"].includes(role)) return 82;
  if (["LCB", "RCB"].includes(role)) return piece.homeX || 50;
  if (["ST", "CAM", "CDM", "CM"].includes(role)) return clamp(piece.homeX || 50, 35, 65);
  return piece?.homeX ?? 50;
}
function rtTeamShapeTarget(game, piece, raw, carrier) {
  if (!piece || !raw || piece.role === "GK" || rtIsManuallyControlled(game, piece)) return raw;
  const phase = rtShapePhase(game, piece.side, carrier);
  const style = styleProfile(game, piece.side);
  const adaptive = rtAdaptiveTactic(game, piece.side);
  const roleIntent = rtRoleIntent(piece);
  const ball = game.ball || { x: FIELD_W / 2, y: FIELD_H / 2 };
  const dir = rtSideDir(piece.side);
  let x = raw.x;
  let y = raw.y;
  const [minY, maxY] = rtRoleBand(piece.side, piece.role, phase);
  y = clamp(y, minY, maxY);
  // Tactical adaptation: AI lebih agresif saat tertinggal dan lebih kompak saat unggul/tenaga habis.
  if (phase === "attack" && adaptive.attackBias) y = clampFieldY(y + dir * adaptive.attackBias * 4.8);
  if ((phase === "defend" || phase === "press") && adaptive.protectBias) y = clampFieldY(y - dir * adaptive.protectBias * 3.6);
  if (phase === "attack" && roleIntent.width) x = clampFieldX(x + Math.sign((piece.homeX ?? x) - 50) * Math.abs(roleIntent.width) * 0.18);
  const anchorX = rtRoleWidthAnchor(piece);
  const width = rtStyleWidthMod(game, piece.side);
  const line = rtRoleLine(piece.role);
  const horizontalShift = clamp((ball.x - FIELD_W / 2) * (line === "back" ? 0.10 : line === "mid" ? 0.16 : 0.22), -9, 9);
  const styleWide = ["LW", "LM", "LB"].includes(piece.role) ? -Math.max(0, width) : ["RW", "RM", "RB"].includes(piece.role) ? Math.max(0, width) : 0;
  const anchorWeight = line === "back" ? 0.34 : line === "mid" ? 0.24 : 0.16;
  x = x * (1 - anchorWeight) + clampFieldX(anchorX + horizontalShift + styleWide) * anchorWeight;
  const compact = style?.block ? 0.30 : sideStyle(game, piece.side) === "Gegenpress" ? 0.16 : 0.22;
  if (phase === "defend" || phase === "press") {
    const lineHomeY = piece.homeY ?? y;
    y = y * (1 - compact) + clampFieldY(lineHomeY + (ball.y - FIELD_H / 2) * 0.10) * compact;
  }
  const mates = rtTeam(game, piece.side).filter((m) => m.id !== piece.id && m.role !== "GK" && rtAlive(game, m));
  let pushX = 0; let pushY = 0;
  mates.forEach((m) => {
    const dx = x - (m.targetX ?? m.rx);
    const dy = y - (m.targetY ?? m.ry);
    const d = Math.hypot(dx, dy) || 0.1;
    if (d < 6.4) { const force = (6.4 - d) / 6.4; pushX += (dx / d) * force * 2.6; pushY += (dy / d) * force * 1.7; }
  });
  x = clampFieldX(x + pushX);
  y = clamp(y + pushY, minY, maxY);
  if (["CB", "LB", "RB", "CDM"].includes(piece.role) && carrier?.side === piece.side && rtProgressToGoal(piece.side, carrier.ry) < 0.48) {
    y = y * 0.78 + (piece.homeY ?? y) * 0.22;
  }
  if (phase === "attack" && ["ST", "LW", "RW", "CAM"].includes(piece.role)) y = rtClampSmartY(game, piece.side, piece.role, y, "attack");
  if (phase === "attack" && ["CB", "LB", "RB", "CDM"].includes(piece.role) && adaptive.protectBias > 0.45) y = y * 0.72 + (piece.homeY ?? y) * 0.28;
  return { x: clampFieldX(x), y: clampFieldY(y) };
}
function rtPassDecisionBias(game, carrier, passTarget, shot) {
  const style = styleProfile(game, carrier.side);
  if (!passTarget) return -99;
  const risk = rtPassLaneRisk(game, carrier, passTarget);
  const forward = rtForwardAmount(carrier.side, carrier.ry, passTarget.ry);
  const support = (style?.support || 0) * 0.20 + (style?.through || 0) * (forward > 6 ? 0.45 : 0.12) + (style?.risk || 0) * 0.16;
  const pressure = rtOpponent(game, carrier.side).filter((e) => rtDist(e, carrier) < 8).length * 4;
  const shotPull = shot?.can ? shot.chance * 0.18 : 0;
  return passTarget.overall * 0.08 + forward * 0.42 + support + pressure - risk * 0.55 - shotPull;
}

function rtScoreContext(game, side) {
  const minute = minuteOf(game);
  const own = Number(game?.score?.[side] || 0);
  const opp = Number(game?.score?.[otherSide(side)] || 0);
  const diff = own - opp;
  const active = rtTeam(game, side);
  const redFor = (game.pieces || []).filter((p) => p.side === side && p.red && !p.vacant).length;
  const redAgainst = (game.pieces || []).filter((p) => p.side === otherSide(side) && p.red && !p.vacant).length;
  const manDisadvantage = redFor - redAgainst;
  const avgEnergy = active.reduce((sum, p) => sum + (p.energy ?? 80), 0) / Math.max(1, active.length);
  return { minute, diff, trailing: diff < 0, leading: diff > 0, late: minute >= 70, urgent: diff < 0 && minute >= 62, protect: diff > 0 && minute >= 65, redFor, redAgainst, manDisadvantage, avgEnergy };
}
function rtAdaptiveTactic(game, side) {
  const ctx = rtScoreContext(game, side);
  const baseStyle = sideStyle(game, side);
  const losingBoost = ctx.urgent ? 1.35 : ctx.trailing ? 0.72 : 0;
  const protectBoost = ctx.protect ? 1.05 : ctx.leading ? 0.38 : 0;
  const redPenalty = ctx.manDisadvantage > 0 ? 0.55 + ctx.manDisadvantage * 0.18 : 0;
  const redAdvantageBoost = ctx.manDisadvantage < 0 ? Math.min(0.34, Math.abs(ctx.manDisadvantage) * 0.16) : 0;
  const tiredPenalty = ctx.avgEnergy < 45 ? 0.28 : 0;
  const styleRisk = ({ Counter: 0.22, "Long Ball": 0.26, "All Out Attack": 0.52, Gegenpress: 0.32, "High Press": 0.25, "Park Bus": -0.36, Catenaccio: -0.44, Possession: -0.14, "Tiki Taka": -0.08 })[baseStyle] || 0;
  const attackBias = clamp(styleRisk + losingBoost + redAdvantageBoost - protectBoost - redPenalty - tiredPenalty, -1.15, 1.65);
  const riskBias = clamp(styleRisk * 0.8 + losingBoost * 0.65 + redAdvantageBoost * 0.75 - protectBoost * 0.72 - redPenalty * 0.35, -1.05, 1.35);
  const pressBias = clamp((baseStyle === "High Press" || baseStyle === "Gegenpress" ? 0.42 : 0) + losingBoost * 0.35 + redAdvantageBoost * 0.35 - protectBoost * 0.25 - redPenalty * 0.4 - tiredPenalty * 0.55, -0.65, 1.1);
  const tempo = attackBias > 0.75 ? "chase" : protectBoost > 0.55 ? "protect" : baseStyle;
  return { ...ctx, baseStyle, attackBias, riskBias, pressBias, protectBias: protectBoost, tempo };
}
function rtRoleIntent(piece) {
  const role = piece?.role || "CM";
  if (role === "GK") return { shoot: -99, pass: 12, through: -8, carry: -20, width: 0, press: -12 };
  if (["CB"].includes(role)) return { shoot: -28, pass: 5, through: -10, carry: -8, width: 0, press: 4 };
  if (["LB", "RB"].includes(role)) return { shoot: -16, pass: 6, through: 2, carry: 4, width: 10, press: 7 };
  if (role === "CDM") return { shoot: -14, pass: 10, through: 0, carry: -2, width: 0, press: 8 };
  if (role === "CM") return { shoot: -4, pass: 12, through: 5, carry: 2, width: 0, press: 5 };
  if (["LM", "RM"].includes(role)) return { shoot: 0, pass: 8, through: 6, carry: 8, width: 12, press: 6 };
  if (role === "CAM") return { shoot: 8, pass: 10, through: 13, carry: 8, width: 0, press: 4 };
  if (["LW", "RW"].includes(role)) return { shoot: 9, pass: 5, through: 10, carry: 14, width: 14, press: 5 };
  if (role === "ST") return { shoot: 18, pass: -2, through: 4, carry: 8, width: -4, press: 3 };
  return { shoot: 0, pass: 0, through: 0, carry: 0, width: 0, press: 0 };
}
function rtShotQuality(game, piece, stick = { mag: 0, x: 0, y: 0 }) {
  if (!piece) return { value: 0, label: "none", weakFoot: 0, balance: 0, composure: 0, angle: 0, firstTime: 0 };
  const goalY = rtAttackGoalY(piece.side);
  const distGoal = Math.abs(piece.ry - goalY);
  const angle = clamp(1 - Math.abs(piece.rx - goalCenterX()) / 48, 0, 1);
  const pressure = rtOpponent(game, piece.side).filter((e) => rtDist(e, piece) < 7.4).length;
  const balance = clamp((piece.energy ?? 80) / 100 + (piece.dribble || 60) / 260 - pressure * 0.11, 0.15, 1.18);
  const composure = clamp((piece.overall || 60) / 100 + (piece.shoot || 60) / 310 - pressure * 0.08, 0.15, 1.16);
  const weakFoot = stick.mag && ((piece.role === "LW" && stick.x < -0.35) || (piece.role === "RW" && stick.x > 0.35)) ? -4.5 : 0;
  const firstTime = !game.ballOwnerId && game.ball?.intent?.targetId === piece.id ? 3.5 : 0;
  const closeBonus = distGoal < 15 ? 5 : distGoal < 22 ? 1.5 : -2.5;
  const role = rtRoleIntent(piece).shoot * 0.18;
  const value = angle * 9 + balance * 6 + composure * 6 + closeBonus + firstTime + weakFoot + role;
  const label = value >= 20 ? "elite" : value >= 13 ? "good" : value >= 6 ? "ok" : "poor";
  return { value, label, weakFoot, balance, composure, angle, firstTime, pressure };
}
function rtChoosePassType(game, carrier, shot) {
  const style = sideStyle(game, carrier.side);
  const adaptive = rtAdaptiveTactic(game, carrier.side);
  const role = rtRoleIntent(carrier);
  const pressure = rtOpponent(game, carrier.side).filter((e) => rtDist(e, carrier) < 7.5).length;
  const progress = rtProgressToGoal(carrier.side, carrier.ry);
  const directStyle = ["Counter", "Long Ball", "Vertical Tiki Taka", "Wing Play"].includes(style);
  const throughScore = role.through + adaptive.riskBias * 12 + (directStyle ? 10 : 0) + (pressure ? 5 : 0) + (progress > 0.45 ? 6 : 0) - (shot?.chance > 62 ? 8 : 0);
  const through = throughScore > 11;
  const cross = ["LW", "RW", "LM", "RM", "LB", "RB"].includes(carrier.role) && Math.abs(carrier.rx - goalCenterX()) > 23 && progress > 0.58;
  return { through, cross, throughScore, adaptive };
}
function rtIsManuallyControlled(game, p) {
  return Boolean(p && p.side === game?.userSide && String(p.id) === String(game?.rt?.selectedId));
}
function rtManualMoveTarget(game, piece, stick = rtStickFor(game, piece?.id)) {
  if (!piece || !stick.mag) return null;
  const reach = 7.2 + stick.mag * 4.6;
  return { x: clampFieldX(piece.rx + stick.x * reach), y: clampFieldY(piece.ry + stick.y * reach) };
}
function rtReceiverLead(game, from, teammate, through = false) {
  if (!from || !teammate) return { x: teammate?.rx || 50, y: teammate?.ry || 32 };
  const dir = rtSideDir(from.side);
  const runForward = Math.max(0, rtForwardAmount(from.side, from.ry, teammate.ry));
  const lead = through ? clamp(7 + runForward * 0.18 + (teammate.pace || 60) / 35, 6, 13) : clamp(runForward * 0.06, 0, 2.8);
  return { x: clampFieldX(teammate.rx + (through ? (teammate.rx - from.rx) * 0.16 : 0)), y: clampFieldY(teammate.ry + dir * lead) };
}
function rtShotTargetFromStick(game, piece, stick = rtStickDirectionForAction(game, piece)) {
  const goalY = sideGoalY(piece.side);
  const aimX = stick.mag ? stick.x : 0;
  const inside = clamp(goalCenterX() + aimX * (GOAL_W * 0.62), goalX1() + 1, goalX2() - 1);
  return { x: inside, y: piece.side === "home" ? -5 : FIELD_H + 5 };
}
function rtAttackGoalY(side) { return side === "home" ? 0 : FIELD_H; }
function rtOwnGoalY(side) { return side === "home" ? FIELD_H : 0; }
function rtForwardAmount(side, fromY, toY) { return (toY - fromY) * rtSideDir(side); }
function rtProgressToGoal(side, y) { return side === "home" ? (FIELD_H - y) / FIELD_H : y / FIELD_H; }
function rtRoleLine(role) {
  if (role === "GK") return "keeper";
  if (["CB", "LB", "RB"].includes(role)) return "back";
  if (["CDM", "CM", "LM", "RM"].includes(role)) return "mid";
  if (["CAM"].includes(role)) return "creator";
  return "front";
}
function rtPointToSegmentDistance(point, a, b) {
  const ax = a.rx ?? a.x ?? 0, ay = a.ry ?? a.y ?? 0;
  const bx = b.rx ?? b.x ?? 0, by = b.ry ?? b.y ?? 0;
  const px = point.rx ?? point.x ?? 0, py = point.ry ?? point.y ?? 0;
  const vx = bx - ax, vy = by - ay;
  const len2 = vx * vx + vy * vy || 1;
  const t = clamp(((px - ax) * vx + (py - ay) * vy) / len2, 0, 1);
  const sx = ax + vx * t, sy = ay + vy * t;
  return Math.hypot(px - sx, py - sy);
}
function rtPassLaneRisk(game, from, to) {
  if (!from || !to) return 99;
  const dist = Math.max(1, rtDist(from, to));
  const enemies = rtOpponent(game, from.side);
  return enemies.reduce((risk, e) => {
    const laneD = rtPointToSegmentDistance(e, from, to);
    if (laneD > 8.5) return risk;
    const along = (((e.rx - from.rx) * (to.rx - from.rx) + (e.ry - from.ry) * (to.ry - from.ry)) / (dist * dist));
    if (along <= 0.02 || along >= 1.02) return risk;
    const anticipation = (e.defend || 60) / 95;
    return risk + (8.5 - laneD) * (1.2 + anticipation) + (along > 0.18 && along < 0.86 ? 4 : 0);
  }, 0);
}
function rtShotLaneRisk(game, shooter) {
  const target = { rx: goalCenterX(), ry: rtAttackGoalY(shooter.side) };
  return rtOpponent(game, shooter.side).filter((e) => e.role !== "GK").reduce((risk, e) => {
    const d = rtPointToSegmentDistance(e, shooter, target);
    const ahead = rtForwardAmount(shooter.side, shooter.ry, e.ry) > 0;
    return risk + (ahead && d < 6 ? (6 - d) * 3 : 0);
  }, 0);
}
function rtOffsideLimit(game, side) {
  const defenders = rtOpponent(game, side).filter((p) => p.role !== "GK").map((p) => p.ry).sort((a, b) => side === "home" ? a - b : b - a);
  const line = defenders[1] ?? defenders[0] ?? FIELD_H / 2;
  return side === "home" ? line + 2.2 : line - 2.2;
}
function rtClampSmartY(game, side, role, y, phase) {
  let out = y;
  if (["ST", "LW", "RW", "CAM"].includes(role) && phase === "attack") {
    const off = rtOffsideLimit(game, side);
    out = side === "home" ? Math.max(out, off) : Math.min(out, off);
  }
  if (side === "home") return clampFieldY(clamp(out, phase === "attack" ? 7 : 14, FIELD_H - 3.5));
  return clampFieldY(clamp(out, 3.5, phase === "attack" ? FIELD_H - 7 : FIELD_H - 14));
}
function rtShapePhase(game, side, carrier) {
  if (!carrier) return "loose";
  if (carrier.side === side) return "attack";
  const ballY = game.ball?.y ?? FIELD_H / 2;
  const danger = side === "home" ? ballY > FIELD_H * 0.50 : ballY < FIELD_H * 0.50;
  return danger ? "defend" : "press";
}
function rtClampTeamHalf(side, y, phase, role) {
  if (["ST", "LW", "RW", "CAM"].includes(role) && phase === "attack") return clampFieldY(y);
  if (side === "home") return clamp(y, phase === "attack" ? 7 : 16, FIELD_H - 3.5);
  return clamp(y, 3.5, phase === "attack" ? FIELD_H - 7 : FIELD_H - 16);
}

function rtResolveSpacing(game) {
  const minD = 3.35;
  ["home", "away"].forEach((side) => {
    const team = rtTeam(game, side).filter((p) => p.role !== "GK");
    for (let loop = 0; loop < 3; loop += 1) {
      for (let i = 0; i < team.length; i += 1) {
        for (let j = i + 1; j < team.length; j += 1) {
          const a = team[i];
          const b = team[j];
          if (!rtAlive(game, a) || !rtAlive(game, b)) continue;
          const dx = b.rx - a.rx;
          const dy = b.ry - a.ry;
          const d = Math.hypot(dx, dy) || 0.1;
          if (d >= minD) continue;
          const push = (minD - d) * 0.36;
          const ux = dx / d;
          const uy = dy / d;
          if (game.ballOwnerId !== a.id && !(a.manualUntil && a.manualUntil > rtLiveNow(game))) {
            a.rx = clampFieldX(a.rx - ux * push);
            a.ry = clampFieldY(a.ry - uy * push);
          }
          if (game.ballOwnerId !== b.id && !(b.manualUntil && b.manualUntil > rtLiveNow(game))) {
            b.rx = clampFieldX(b.rx + ux * push);
            b.ry = clampFieldY(b.ry + uy * push);
          }
        }
      }
    }
  });
  (game.pieces || []).forEach((p) => {
    if (!rtAlive(game, p)) return;
    p.rx = clampFieldX(p.rx ?? gridToFieldX(p.x));
    p.ry = clampFieldY(p.ry ?? gridToFieldY(p.y));
    p.x = clamp(Math.round(((p.rx - 4) / (FIELD_W - 8)) * (BOARD_COLS - 1)), 0, BOARD_COLS - 1);
    p.y = clamp(Math.round(((p.ry - 3) / (FIELD_H - 6)) * (BOARD_ROWS - 1)), 0, BOARD_ROWS - 1);
  });
}
function rtSpeed(piece, sprint = false, onBall = false) {
  const pace = piece?.pace || 60;
  const energy = piece?.energy ?? 80;
  const stamina = piece?.stamina || 70;
  const base = 0.42 + pace / 185 + energy / 520 + stamina / 840;
  const roleBalance = piece?.role === "GK" ? 0.76 : ["CB", "CDM"].includes(piece?.role) ? 0.94 : ["LW", "RW", "ST"].includes(piece?.role) ? 1.05 : 1;
  const ballControl = onBall ? 0.88 + (piece?.dribble || 60) / 520 : 1;
  return base * roleBalance * (sprint ? 1.42 : 1) * ballControl * (piece?.minorInjury ? 0.55 : 1);
}
function rtLiveNow(game) { return game?.rt?.liveSeconds ?? 0; }
function rtLiveUntil(game, extra = 0) { return rtLiveNow(game) + extra; }
function rtMoveToward(piece, tx, ty, dt, sprint = false, onBall = false) {
  if (!piece || piece.red || piece.vacant) return;
  const targetX = clampFieldX(tx);
  const targetY = clampFieldY(ty);
  const ox = piece.rx ?? gridToFieldX(piece.x);
  const oy = piece.ry ?? gridToFieldY(piece.y);
  const dx = targetX - ox;
  const dy = targetY - oy;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.045) {
    piece.vx = (piece.vx || 0) * 0.68;
    piece.vy = (piece.vy || 0) * 0.68;
    return;
  }
  const speed = rtSpeed(piece, sprint, onBall);
  const maxStep = speed * dt;
  const desiredVx = (dx / dist) * speed;
  const desiredVy = (dy / dist) * speed;
  const turnSharpness = onBall ? 0.56 : (piece.role === "GK" ? 0.52 : 0.66);
  piece.vx = (piece.vx || 0) * (1 - turnSharpness) + desiredVx * turnSharpness;
  piece.vy = (piece.vy || 0) * (1 - turnSharpness) + desiredVy * turnSharpness;
  const vl = Math.max(0.001, Math.hypot(piece.vx, piece.vy));
  const step = Math.min(dist, maxStep, vl * dt);
  piece.rx = clampFieldX(ox + (piece.vx / vl) * step);
  piece.ry = clampFieldY(oy + (piece.vy / vl) * step);
  if (step > 0.015) {
    piece.faceX = piece.vx / vl;
    piece.faceY = piece.vy / vl;
  }
  piece.x = clamp(Math.round(((piece.rx - 4) / (FIELD_W - 8)) * (BOARD_COLS - 1)), 0, BOARD_COLS - 1);
  piece.y = clamp(Math.round(((piece.ry - 3) / (FIELD_H - 6)) * (BOARD_ROWS - 1)), 0, BOARD_ROWS - 1);
  piece.energy = clamp((piece.energy ?? 80) - (sprint ? 0.22 : 0.045) * dt * (onBall ? 1.12 : 1), 0, 100);
}

function rtPressAssignment(game, piece, carrier) {
  if (!carrier || carrier.side === piece.side || piece.role === "GK") return "zone";
  const side = piece.side;
  const ownGoal = { rx: goalCenterX(), ry: rtOwnGoalY(side) };
  const pool = rtTeam(game, side).filter((p) => p.role !== "GK").map((p) => {
    const d = rtDist(p, carrier);
    const line = rtRoleLine(p.role);
    const rolePenalty = line === "front" ? -2.5 : line === "mid" || line === "creator" ? 0 : 3.5;
    const betweenBonus = rtPointToSegmentDistance(p, carrier, ownGoal) < 10 ? -2.2 : 0;
    const wrongSide = rtForwardAmount(side, carrier.ry, p.ry) > 0 ? 4 : 0;
    return { p, score: d + rolePenalty + wrongSide + betweenBonus - (p.defend || 60) * 0.015 };
  }).sort((a, b) => a.score - b.score);
  const rank = pool.findIndex((r) => r.p.id === piece.id);
  const dist = rtDist(piece, carrier);
  const style = styleProfile(game, side);
  const pressBoost = clamp((style?.press || 0) * 0.62, -5, 10);
  if (rank === 0 && dist < 30 + pressBoost) return "press";
  if (rank === 1 && dist < 36 + pressBoost * 0.7) return "cover";
  if (rank === 2 && rtProgressToGoal(carrier.side, carrier.ry) > 0.45) return "blockLane";
  return "zone";
}
function rtMarkTarget(game, piece, carrier) {
  if (!carrier || carrier.side === piece.side) return null;
  const candidates = rtTeam(game, carrier.side).filter((p) => p.id !== carrier.id && p.role !== "GK").map((p) => {
    const lane = rtPointToSegmentDistance(piece, carrier, p);
    const threat = rtForwardAmount(carrier.side, carrier.ry, p.ry) * 0.8 + rtProgressToGoal(carrier.side, p.ry) * 16 - rtDist(piece, p) * 0.22 - lane * 0.32 + p.overall * 0.05;
    return { p, score: threat };
  }).sort((a, b) => b.score - a.score);
  return candidates[0]?.p || null;
}
function rtSupportLaneX(piece, carrier, style) {
  const base = piece.homeX ?? piece.rx;
  const wide = clamp((style?.width || 0) * 0.45, -7, 7);
  if (["LW", "LM", "LB"].includes(piece.role)) return clampFieldX(Math.min(base - 2 - Math.max(0, wide), carrier.rx - 12));
  if (["RW", "RM", "RB"].includes(piece.role)) return clampFieldX(Math.max(base + 2 + Math.max(0, wide), carrier.rx + 12));
  if (piece.role === "ST") return clampFieldX(base + (base < 50 ? -3 : base > 50 ? 3 : (carrier.rx < 50 ? 5 : -5)));
  if (piece.role === "CAM") return clampFieldX(carrier.rx + (carrier.rx < 50 ? 8 : -8));
  return clampFieldX(base + (carrier.rx - 50) * 0.12);
}
function rtIsDefensiveRole(role) { return ["GK", "CB", "LB", "RB"].includes(role); }
function rtIsMidfieldRole(role) { return ["CDM", "CM", "LM", "RM", "CAM"].includes(role); }
function rtIsForwardRole(role) { return ["ST", "LW", "RW"].includes(role); }
function rtTeamIsAdvanced(game, side, carrier) { return Boolean(carrier && carrier.side === side && rtProgressToGoal(side, carrier.ry) >= 0.48); }
function rtTeamIsFinalThird(game, side, carrier) { return Boolean(carrier && carrier.side === side && rtProgressToGoal(side, carrier.ry) >= 0.66); }
function rtThreatInOwnHalf(game, side, carrier) {
  if (!carrier || carrier.side === side) return false;
  const ballY = carrier.ry ?? game.ball?.y ?? FIELD_H / 2;
  return side === "home" ? ballY > FIELD_H * 0.46 : ballY < FIELD_H * 0.54;
}
function rtRoleLaneX(piece, carrier = null) {
  const home = piece?.homeX ?? piece?.rx ?? 50;
  if (["LW", "LM", "LB"].includes(piece?.role)) return clampFieldX(Math.min(24, home));
  if (["RW", "RM", "RB"].includes(piece?.role)) return clampFieldX(Math.max(76, home));
  if (piece?.role === "ST") return clampFieldX(home < 45 ? 42 : home > 55 ? 58 : (carrier?.rx || 50));
  if (piece?.role === "CAM") return clampFieldX((carrier?.rx || home) + ((carrier?.rx || 50) < 50 ? 7 : -7));
  if (["CM", "CDM"].includes(piece?.role)) return clampFieldX(home * 0.62 + (carrier?.rx || 50) * 0.38);
  return clampFieldX(home);
}
function rtSpaceScore(game, piece, point, carrier) {
  if (!piece || !point || !carrier) return -999;
  const p = { rx: clampFieldX(point.x), ry: clampFieldY(point.y) };
  const enemies = rtOpponent(game, piece.side);
  const mates = rtTeam(game, piece.side).filter((m) => m.id !== piece.id && m.id !== carrier.id && m.role !== "GK");
  const nearestEnemy = enemies.reduce((best, e) => Math.min(best, Math.hypot((e.rx || 0) - p.rx, (e.ry || 0) - p.ry)), 80);
  const nearestMate = mates.reduce((best, m) => Math.min(best, Math.hypot((m.rx || 0) - p.rx, (m.ry || 0) - p.ry)), 80);
  const laneRisk = rtPassLaneRisk(game, carrier, p);
  const forward = Math.max(-8, Math.min(18, rtForwardAmount(piece.side, carrier.ry, p.ry)));
  const progress = rtProgressToGoal(piece.side, p.ry);
  const central = 1 - Math.abs(p.rx - goalCenterX()) / 50;
  const wideFit = (["LW", "LM", "LB"].includes(piece.role) && p.rx < 36) || (["RW", "RM", "RB"].includes(piece.role) && p.rx > 64) ? 7 : 0;
  const roleLine = rtRoleLine(piece.role);
  const strikerBonus = roleLine === "front" ? progress * 15 + central * 5 : roleLine === "creator" ? progress * 9 + central * 7 : roleLine === "mid" ? progress * 5 : 0;
  const tooCloseCarrier = rtDist({ rx: p.rx, ry: p.ry }, carrier) < 5 ? -10 : 0;
  const offsideLimit = ["ST", "LW", "RW", "CAM"].includes(piece.role) ? rtOffsideLimit(game, piece.side) : null;
  const offsidePenalty = offsideLimit == null ? 0 : (piece.side === "home" ? (p.ry < offsideLimit - 0.2 ? -28 : 0) : (p.ry > offsideLimit + 0.2 ? -28 : 0));
  return nearestEnemy * 1.35 + Math.min(nearestMate, 12) * 0.7 - laneRisk * 0.82 + forward * 1.25 + strikerBonus + wideFit + tooCloseCarrier + offsidePenalty;
}
function rtPickBestSpace(game, piece, carrier, candidates) {
  const valid = (candidates || [])
    .filter(Boolean)
    .map((c) => ({ x: clampFieldX(c.x), y: rtClampSmartY(game, piece.side, piece.role, c.y, "attack") }))
    .map((c) => ({ ...c, score: rtSpaceScore(game, piece, c, carrier) }))
    .sort((a, b) => b.score - a.score);
  return valid[0] || { x: piece.homeX ?? piece.rx, y: piece.homeY ?? piece.ry };
}
function rtAdvancedSupportTarget(game, piece, carrier) {
  const side = piece.side;
  const dir = rtSideDir(side);
  const style = sideStyle(game, side);
  const finalThird = rtTeamIsFinalThird(game, side, carrier);
  const depth = finalThird ? 1.25 : 1;
  const laneX = rtRoleLaneX(piece, carrier);
  const homeX = piece.homeX ?? piece.rx;
  const homeY = piece.homeY ?? piece.ry;
  const width = rtStyleWidthMod(game, side);
  const candidates = [];
  const add = (x, y) => candidates.push({ x: clampFieldX(x), y: clampFieldY(y) });
  if (piece.role === "ST") {
    add(laneX, carrier.ry + dir * (12 * depth));
    add(goalCenterX() + (homeX < 50 ? -8 : homeX > 50 ? 8 : (carrier.rx < 50 ? 7 : -7)), carrier.ry + dir * (15 * depth));
    add(carrier.rx + (carrier.rx < 50 ? 11 : -11), carrier.ry + dir * (10 * depth));
  } else if (["LW", "RW"].includes(piece.role)) {
    const wideX = piece.role === "LW" ? 16 - Math.max(0, width * 0.3) : 84 + Math.max(0, width * 0.3);
    add(wideX, carrier.ry + dir * (9 * depth));
    add(wideX, carrier.ry + dir * (15 * depth));
    add(piece.role === "LW" ? 32 : 68, carrier.ry + dir * (13 * depth));
  } else if (piece.role === "CAM") {
    add(carrier.rx + (carrier.rx < 50 ? 9 : -9), carrier.ry - dir * 4);
    add(goalCenterX(), carrier.ry + dir * 7);
    add(laneX, carrier.ry - dir * 7);
  } else if (["CM", "LM", "RM"].includes(piece.role)) {
    const sideLane = piece.role === "LM" ? 22 : piece.role === "RM" ? 78 : laneX;
    add(sideLane, carrier.ry - dir * 7);
    add(carrier.rx + (homeX < carrier.rx ? -10 : 10), carrier.ry - dir * 8);
    add(sideLane, carrier.ry + dir * (style === "Counter" || style === "Vertical Tiki Taka" ? 6 : 3));
  } else if (piece.role === "CDM") {
    add(carrier.rx, carrier.ry - dir * 13);
    add(homeX * 0.72 + carrier.rx * 0.28, carrier.ry - dir * 15);
  } else if (["LB", "RB"].includes(piece.role)) {
    // Defender tidak ikut terlalu jauh, hanya menjadi outlet aman di belakang/tepi.
    const sideX = piece.role === "LB" ? 18 : 82;
    add(sideX, Math.min(Math.max(homeY + dir * 3.5, side === "home" ? FIELD_H * 0.46 : 0), side === "home" ? FIELD_H : FIELD_H * 0.54));
    add(sideX, carrier.ry - dir * 16);
  } else {
    add(homeX + (carrier.rx - 50) * 0.08, homeY + dir * 1.2);
  }
  const chosen = rtPickBestSpace(game, piece, carrier, candidates);
  // Midfielder dan attacker ikut naik saat bola sudah masuk zona musuh, tapi defensive line tetap aman.
  if (!rtIsDefensiveRole(piece.role)) {
    piece.aiRole = finalThird ? "chance-run" : "support-space";
    return chosen;
  }
  piece.aiRole = "rest-defense";
  return { x: chosen.x * 0.35 + (piece.homeX ?? chosen.x) * 0.65, y: chosen.y * 0.28 + (piece.homeY ?? chosen.y) * 0.72 };
}
function rtSupportTarget(game, piece, carrier) {
  const side = piece.side;
  const dir = rtSideDir(side);
  const style = styleProfile(game, side);
  const line = rtRoleLine(piece.role);
  if (rtTeamIsAdvanced(game, side, carrier)) return rtAdvancedSupportTarget(game, piece, carrier);
  let x = rtSupportLaneX(piece, carrier, style);
  let y = piece.homeY ?? piece.ry;
  const forward = rtForwardAmount(side, piece.ry, carrier.ry) < 0 ? 1 : 0;
  const d = rtDist(piece, carrier);
  const depthMod = rtStyleDepthMod(game, side, "attack");
  const widthMod = rtStyleWidthMod(game, side);
  if (["LW", "LM", "LB"].includes(piece.role)) x = clampFieldX(x - Math.max(0, widthMod));
  if (["RW", "RM", "RB"].includes(piece.role)) x = clampFieldX(x + Math.max(0, widthMod));
  if (line === "front") y = carrier.ry + dir * clamp(10.5 + depthMod + (piece.pace || 60) / 26, 8.5, 18.5);
  else if (line === "creator") y = carrier.ry - dir * clamp(5.5 - depthMod * 0.25, 3.5, 8.5);
  else if (line === "mid") y = carrier.ry - dir * clamp(d < 18 ? 8 : 4, 3, 9) + dir * depthMod * 0.25;
  else if (line === "back") y = (piece.homeY ?? piece.ry) + dir * (sideStyle(game, side) === "Wing Play" ? 5.5 : 2.2) + dir * Math.max(0, depthMod) * 0.35;
  if (["LB", "RB"].includes(piece.role) && ["Wing Play", "Gegenpress"].includes(sideStyle(game, side)) && Math.abs(piece.homeX - carrier.rx) < 24) y += dir * 4.2;
  if (forward && ["CM", "CAM", "LW", "RW", "ST"].includes(piece.role)) y += dir * 2.4;
  const discipline = rtRoleDiscipline(piece);
  const homeAnchorY = piece.homeY ?? piece.ry;
  y = y * (1 - discipline * 0.18) + homeAnchorY * (discipline * 0.18);
  return { x: clampFieldX(x), y: rtClampSmartY(game, side, piece.role, y, "attack") };
}
function rtDefensiveTarget(game, piece, carrier) {
  const side = piece.side;
  const dir = rtSideDir(side);
  const ball = game.ball || { x: FIELD_W / 2, y: FIELD_H / 2 };
  const phase = rtShapePhase(game, side, carrier);
  const assignment = rtPressAssignment(game, piece, carrier);
  const ownGoal = { rx: goalCenterX(), ry: rtOwnGoalY(side) };
  const danger = rtThreatInOwnHalf(game, side, carrier);
  const line = rtRoleLine(piece.role);
  piece.aiRole = assignment;

  // Saat diserang, hanya 1-2 pemain melakukan pressure. Bek dan gelandang lain turun menutup ruang/pemain.
  if (assignment === "press" && !["CB", "LB", "RB"].includes(piece.role)) {
    const offsetX = carrier.rx > 50 ? -1.6 : 1.6;
    const offsetY = -dir * (danger ? 1.0 : 1.4);
    return { x: clampFieldX(carrier.rx + offsetX), y: clampFieldY(carrier.ry + offsetY) };
  }
  if (assignment === "cover") {
    const coverWeight = danger ? 0.50 : 0.62;
    return { x: clampFieldX(carrier.rx * coverWeight + ownGoal.rx * (1 - coverWeight)), y: clampFieldY(carrier.ry * coverWeight + ownGoal.ry * (1 - coverWeight)) };
  }
  if (assignment === "blockLane") {
    const mark = rtMarkTarget(game, piece, carrier);
    if (mark) return { x: clampFieldX((carrier.rx + mark.rx) / 2), y: clampFieldY((carrier.ry + mark.ry) / 2) };
  }

  let x = piece.homeX ?? piece.rx;
  let y = piece.homeY ?? piece.ry;
  const style = styleProfile(game, side);
  const compactX = clamp((ball.x - FIELD_W / 2) * (0.20 + (style?.block || 0) / 145), -12, 12);
  const depthMod = rtStyleDepthMod(game, side, "defend");
  const mark = rtMarkTarget(game, piece, carrier);
  const ballShiftY = clamp((ball.y - FIELD_H / 2) * 0.18, -6.5, 6.5);

  if (piece.role === "CB") {
    // CB selalu menjadi pagar antara bola dan gawang, bukan ikut chase liar.
    x = (piece.homeX ?? x) * 0.46 + carrier.rx * 0.34 + goalCenterX() * 0.20 + compactX * 0.35;
    y = (piece.homeY ?? y) * 0.34 + carrier.ry * 0.26 + ownGoal.ry * 0.40;
    if (mark && rtDist(piece, mark) < 26) { x = x * 0.72 + mark.rx * 0.28; y = y * 0.72 + mark.ry * 0.28; }
    piece.aiRole = danger ? "deep-block" : "hold-line";
  } else if (["LB", "RB"].includes(piece.role)) {
    const flankX = piece.role === "LB" ? clamp(ball.x, 10, 34) : clamp(ball.x, 66, 90);
    const sideThreat = (piece.role === "LB" && ball.x < 46) || (piece.role === "RB" && ball.x > 54);
    x = (piece.homeX ?? x) * (sideThreat ? 0.35 : 0.58) + flankX * (sideThreat ? 0.65 : 0.42);
    y = (piece.homeY ?? y) * 0.45 + carrier.ry * 0.22 + ownGoal.ry * 0.33;
    if (mark && ((piece.role === "LB" && mark.rx < 50) || (piece.role === "RB" && mark.rx > 50))) {
      x = x * 0.58 + mark.rx * 0.42;
      y = y * 0.62 + mark.ry * 0.38;
    }
    piece.aiRole = sideThreat ? "track-wing" : "back-four";
  } else if (["CDM", "CM"].includes(piece.role)) {
    // Gelandang ikut mundur: tutup pemain dan jalur operan di depan bek.
    const screenY = carrier.ry * 0.55 + ownGoal.ry * 0.45;
    x = (piece.homeX ?? x) * 0.32 + carrier.rx * 0.46 + goalCenterX() * 0.22 + compactX * 0.55;
    y = (piece.homeY ?? y) * 0.25 + screenY * 0.75;
    if (mark && rtForwardAmount(carrier.side, carrier.ry, mark.ry) > -6) {
      const laneX = (carrier.rx + mark.rx) / 2;
      const laneY = (carrier.ry + mark.ry) / 2;
      x = x * 0.54 + laneX * 0.46;
      y = y * 0.56 + laneY * 0.44;
      piece.aiRole = "midfield-cover";
    } else piece.aiRole = "screen-defense";
  } else if (["LM", "RM"].includes(piece.role)) {
    const wideX = piece.role === "LM" ? 22 : 78;
    x = wideX * 0.48 + clampFieldX(ball.x + (piece.role === "LM" ? -5 : 5)) * 0.52;
    y = (piece.homeY ?? y) * 0.36 + carrier.ry * 0.28 + ownGoal.ry * 0.36 + ballShiftY * 0.25;
    piece.aiRole = "wide-track";
  } else if (piece.role === "CAM") {
    x = (piece.homeX ?? x) * 0.40 + carrier.rx * 0.42 + goalCenterX() * 0.18;
    y = (piece.homeY ?? y) * 0.35 + carrier.ry * 0.42 + ownGoal.ry * 0.23;
    piece.aiRole = danger ? "drop-press" : "shadow-six";
  } else if (["ST", "LW", "RW"].includes(piece.role)) {
    // Penyerang tidak ikut masuk kotak sendiri semua; mereka menutup passing outlet dan siap counter.
    const pressY = danger ? (carrier.ry * 0.35 + (piece.homeY ?? y) * 0.65) : (carrier.ry * 0.55 + (piece.homeY ?? y) * 0.45);
    x = (piece.homeX ?? x) * 0.58 + carrier.rx * 0.42;
    y = pressY;
    piece.aiRole = danger ? "counter-outlet" : "front-press";
  } else {
    x += compactX;
    y += ballShiftY - dir * (danger ? 3.5 : 1.4) + dir * Math.max(0, depthMod) * 0.15;
  }

  if ((danger || phase === "defend") && ["CB", "LB", "RB", "CDM", "CM", "LM", "RM"].includes(piece.role)) {
    // Jangan beri ruang tembak di tengah: rapatkan ke kanal bola tapi tetap ada jarak antar pemain.
    x = x * 0.88 + clampFieldX(goalCenterX() + (carrier.rx - goalCenterX()) * 0.55) * 0.12;
  }
  const [minY, maxY] = rtRoleBand(side, piece.role, danger ? "defend" : phase);
  y = clamp(y, minY, maxY);
  return { x: clampFieldX(x), y: rtClampSmartY(game, side, piece.role, y, danger ? "defend" : phase) };
}
function rtPitchSlotTarget(game, piece, carrier) {
  const side = piece.side;
  const ball = game.ball || { x: FIELD_W / 2, y: FIELD_H / 2 };
  const phase = rtShapePhase(game, side, carrier);
  if (piece.role === "GK") {
    if (rtKeeperRushActive(game, side)) return rtKeeperRushTarget(game, piece) || { x: piece.rx, y: piece.ry };
    const ownY = rtOwnGoalY(side);
    const dangerDepth = carrier && carrier.side !== side ? Math.max(0, 1 - Math.abs(carrier.ry - ownY) / 34) : 0;
    const gkY = ownY + (side === "home" ? -4.8 - dangerDepth * 4.5 : 4.8 + dangerDepth * 4.5);
    return { x: clamp(goalCenterX() + (ball.x - FIELD_W / 2) * (0.12 + dangerDepth * 0.15), 35, 65), y: clampFieldY(gkY) };
  }
  if (!carrier) {
    const nearest = rtNearestToBall(game, side);
    if (nearest?.id === piece.id) return { x: ball.x, y: ball.y };
    return { x: piece.homeX ?? piece.rx, y: piece.homeY ?? piece.ry };
  }
  if (carrier.id === piece.id) return { x: piece.targetX ?? piece.rx, y: piece.targetY ?? piece.ry };
  if (carrier.side === side) {
    piece.aiRole = "support";
    const target = rtSupportTarget(game, piece, carrier);
    const safe = rtPassLaneRisk(game, carrier, { rx: target.x, ry: target.y, side }) < 18;
    if (!safe && ["CM", "CAM", "ST"].includes(piece.role)) target.x = clampFieldX(target.x + (target.x < 50 ? -5 : 5));
    return target;
  }
  return rtDefensiveTarget(game, piece, carrier);
}

function rtNearestToBall(game, side = null) {
  const pool = (game.pieces || []).filter((p) => rtAlive(game, p) && (!side || p.side === side));
  return pool.map((p) => ({ p, d: rtBallDist(p, game.ball) })).sort((a, b) => a.d - b.d || b.p.pace - a.p.pace)[0]?.p || null;
}
function rtNearestEnemy(game, side, point) {
  return rtOpponent(game, side).map((p) => ({ p, d: Math.hypot(p.rx - point.x, p.ry - point.y) })).sort((a, b) => a.d - b.d || b.p.defend - a.p.defend)[0]?.p || null;
}
function rtNearestFriend(game, side, point) {
  return rtTeam(game, side).map((p) => ({ p, d: Math.hypot(p.rx - point.x, p.ry - point.y) })).sort((a, b) => a.d - b.d || b.p.overall - a.p.overall)[0]?.p || null;
}
function rtSwitchCandidates(game, side) {
  const ball = game.ball || { x: FIELD_W / 2, y: FIELD_H / 2 };
  const carrier = getPiece(game, game.ballOwnerId);
  const danger = carrier || { rx: ball.x, ry: ball.y, side: otherSide(side), role: "BALL", overall: 50 };
  return rtTeam(game, side)
    .filter((p) => p.role !== "GK")
    .map((p) => {
      const dBall = rtBallDist(p, ball);
      const dCarrier = carrier ? rtDist(p, carrier) : dBall;
      const rolePress = ({ ST: -1.4, LW: -1.1, RW: -1.1, CAM: -0.8, CM: -0.3, CDM: -0.1, LB: 0.5, RB: 0.5, CB: 1.6 })[p.role] || 0;
      const wrongSide = carrier && carrier.side !== side ? Math.max(0, rtForwardAmount(side, danger.ry, p.ry)) * 0.06 : 0;
      return { p, score: dBall * 0.72 + dCarrier * 0.38 + rolePress + wrongSide - (p.defend || 60) * 0.012 };
    })
    .sort((a, b) => a.score - b.score || rtBallDist(a.p, ball) - rtBallDist(b.p, ball))
    .map((x) => x.p);
}
function rtSwitchTarget(game, side, currentId = null) {
  const near = rtSwitchCandidates(game, side).slice(0, 6);
  if (!near.length) return rtNearestToBall(game, side);
  const idx = near.findIndex((p) => String(p.id) === String(currentId));
  if (idx < 0) return near[0];
  return near[(idx + 1) % near.length] || near[0];
}
function rtKeeperFor(game, side) {
  return rtTeam(game, side).find((p) => p.role === "GK") || null;
}
function rtKeeperRushActive(game, side) {
  return game?.rt?.keeperRush?.side === side && (game.rt.keeperRush.until || 0) > rtLiveNow(game);
}
function rtKeeperRushTarget(game, keeper) {
  if (!keeper) return null;
  const side = keeper.side;
  const carrier = getPiece(game, game.ballOwnerId);
  const ball = game.ball || { x: goalCenterX(), y: rtOwnGoalY(side) };
  const threat = carrier && carrier.side !== side ? { x: carrier.rx, y: carrier.ry } : { x: ball.x, y: ball.y };
  const ownY = rtOwnGoalY(side);
  const maxOutY = side === "home" ? clamp(threat.y, FIELD_H - 27, FIELD_H - 2.2) : clamp(threat.y, 2.2, 27);
  const x = clamp(threat.x, 13, 87);
  return { x, y: clampFieldY(maxOutY) };
}
function rtKeeperRushResolve(game, keeper) {
  if (!keeper || !rtKeeperRushActive(game, keeper.side)) return;
  const carrier = getPiece(game, game.ballOwnerId);
  if (carrier && carrier.side !== keeper.side && rtDist(keeper, carrier) < 5.2) {
    rtTackle(game, keeper, carrier, true);
    return;
  }
  if (!game.ballOwnerId && game.ball && rtBallDist(keeper, game.ball) < 3.25) {
    rtSetPossession(game, keeper, `🧤 ${firstName(keeper.name)} maju cepat dan mengamankan bola.`);
  }
}
function rtKickoffPlayer(game, side) {
  const pool = rtTeam(game, side);
  const attackers = pool.filter((p) => ["ST", "CAM", "LW", "RW", "LM", "RM", "CM"].includes(p.role));
  return (attackers.length ? attackers : pool).slice().sort((a, b) => rtRoleRank(b.role) - rtRoleRank(a.role) || b.overall - a.overall)[0]?.id || pool[0]?.id || null;
}

function rtSetupKickoff(game, side, label = "Kick off") {
  ["home", "away"].forEach((teamSide) => {
    const slots = rtFormationFieldSlots(teamSide === "home" ? game.homeFormation : game.awayFormation, teamSide);
    game.pieces.filter((p) => p.side === teamSide).forEach((p, i) => {
      if (!p.red && !p.vacant) {
        const slot = slots[i] || { x: p.rx ?? gridToFieldX(p.x), y: p.ry ?? gridToFieldY(p.y) };
        p.rx = clampFieldX(slot.x); p.ry = clampFieldY(slot.y);
        p.x = clamp(Math.round(((p.rx - 4) / (FIELD_W - 8)) * (BOARD_COLS - 1)), 0, BOARD_COLS - 1);
        p.y = clamp(Math.round(((p.ry - 3) / (FIELD_H - 6)) * (BOARD_ROWS - 1)), 0, BOARD_ROWS - 1);
        p.homeX = p.rx; p.homeY = p.ry; p.targetX = p.rx; p.targetY = p.ry;
        p.vx = 0; p.vy = 0; p.manualUntil = 0; p.sprintUntil = 0; p.aiCooldown = rng(1.5, 3.5);
      }
    });
  });
  const ownerId = rtKickoffPlayer(game, side);
  const owner = getPiece(game, ownerId);
  game.ballOwnerId = ownerId;
  game.turn = game.userSide || side;
  game.ball = { x: owner?.rx ?? FIELD_W / 2, y: owner?.ry ?? FIELD_H / 2, vx: 0, vy: 0, ownerId, intent: null, free: false };
  game.rt = { ...(game.rt || {}), lastTouchSide: side, lastTouchId: ownerId, ballState: { label: "KICK OFF", type: "kickoff", text: `${label} ${side === "home" ? game.homeName : game.awayName}`, until: rtLiveUntil(game, 5) } };
  return owner;
}
function rtCheckHalfTimeKickoff(game, prevClock = 0) {
  const halfTime = MATCH_CLOCK_SECONDS / 2;
  if (game.extraTimeStarted || game.kickoff?.halftimeDone || prevClock >= halfTime || (game.clockSeconds || 0) < halfTime) return false;
  const side = game.kickoff?.secondSide || otherSide(game.kickoff?.firstSide || "home");
  game.kickoff = { ...(game.kickoff || {}), half: 2, halftimeDone: true, secondSide: side };
  rtSetupKickoff(game, side, "Kick off babak 2");
  appendLog(game, "⏱️", `Babak 2 dimulai. Kick off bergantian untuk ${side === "home" ? game.homeName : game.awayName}.`, { type: "halfTime", side, team: side === "home" ? game.homeName : game.awayName });
  return true;
}
function makeRealtimeSoccerGame(game) {
  const next = clone(game);
  const setup = (side, formation) => {
    const slots = rtFormationFieldSlots(formation || "4-3-3", side);
    const pieces = next.pieces.filter((p) => p.side === side);
    pieces.forEach((p, i) => {
      const slot = slots[i] || { x: p.rx ?? gridToFieldX(p.x), y: p.ry ?? gridToFieldY(p.y), pos: p.role };
      const rx = clampFieldX(slot.x);
      const ry = clampFieldY(slot.y);
      Object.assign(p, {
        rx, ry,
        x: clamp(Math.round(((rx - 4) / (FIELD_W - 8)) * (BOARD_COLS - 1)), 0, BOARD_COLS - 1),
        y: clamp(Math.round(((ry - 3) / (FIELD_H - 6)) * (BOARD_ROWS - 1)), 0, BOARD_ROWS - 1),
        vx: 0, vy: 0, homeX: rx, homeY: ry, targetX: rx, targetY: ry,
        aiCooldown: rng(2, 4), tackleCooldown: 0, manualUntil: 0, sprintUntil: 0, realRating: p.overall,
      });
    });
  };
  setup("home", next.homeFormation);
  setup("away", next.awayFormation);
  const firstSide = next.kickoff?.firstSide || (Math.random() < 0.5 ? "home" : "away");
  next.kickoff = { ...(next.kickoff || {}), firstSide, secondSide: next.kickoff?.secondSide || otherSide(firstSide), half: 1, halftimeDone: false };
  const first = rtKickoffPlayer(next, firstSide);
  const owner = getPiece(next, first) || next.pieces[0];
  next.mode = "realtimeSoccer";
  next.turn = next.userSide;
  next.ap = 0;
  next.actionNo = 1;
  next.maxActions = 99999;
  next.ballOwnerId = owner?.id || null;
  next.ball = { x: owner?.rx ?? FIELD_W / 2, y: owner?.ry ?? FIELD_H / 2, vx: 0, vy: 0, ownerId: owner?.id || null, intent: null, free: false };
  next.rt = { tick: 0, liveSeconds: 0, selectedId: owner?.side === next.userSide ? owner.id : null, commentary: "Real-time football mode aktif", lastTouchSide: owner?.side || firstSide, lastTouchId: owner?.id || null, paused: true, viewMode: "normal" };
  next.history = [{ minute: 1, icon: "⚽", text: `Real-time v17 kick off: ${firstSide === "home" ? next.homeName : next.awayName}. Babak 2 otomatis untuk ${next.kickoff.secondSide === "home" ? next.homeName : next.awayName}.` }, ...(next.history || []).slice(0, 30)];
  next.lastAction = "Real-time v14 Pro AI Fast Match: movement lebih halus, gaya main lebih terasa, switch dekat bola, keeper rush, tackle tetap punya risiko kartu/cedera.";
  return next;
}
function rtResetAfterGoal(game, scoringSide) {
  const restart = otherSide(scoringSide);
  const owner = rtSetupKickoff(game, restart, "Restart setelah gol");
  if (owner) owner.aiCooldown = rng(1.2, 2.4);
  game.goalPause = { scorerSide: scoringSide, restartSide: restart, score: { ...game.score }, minute: minuteOf(game), text: game.lastAction };
  game.highlights = [{ minute: minuteOf(game), icon: "🥅", text: game.lastAction, score: { ...game.score } }, ...(game.highlights || [])].slice(0, 12);
}
function rtFinishIfNeeded(game) {
  if ((game.clockSeconds || 0) >= matchMaxSeconds(game)) return finishMatchWithExtraTime(game, "Full time real-time");
  return false;
}
function rtSetPossession(game, piece, text = "") {
  if (!piece || !rtAlive(game, piece)) return;
  game.ballOwnerId = piece.id;
  game.ball = { ...(game.ball || {}), x: piece.rx, y: piece.ry, vx: 0, vy: 0, ownerId: piece.id, free: false, intent: null };
  game.rt = { ...(game.rt || {}), lastTouchSide: piece.side, lastTouchId: piece.id, ballState: text ? { label: "BOLA IN", type: "in", text, until: rtLiveUntil(game, 5) } : game.rt?.ballState };
  if (text) appendLog(game, "⚽", text);
}
function rtRestartFromOut(game, type, side, point, reason = "") {
  const safePoint = { x: clampFieldX(point?.x ?? FIELD_W / 2), y: clampFieldY(point?.y ?? FIELD_H / 2) };
  const taker = type === "goalKick"
    ? (rtKeeperFor(game, side) || rtNearestFriend(game, side, safePoint))
    : rtNearestFriend(game, side, safePoint);
  if (!taker) return;
  if (type === "corner") game.stats[side].corners = (game.stats[side].corners || 0) + 1;
  const labels = { throwIn: "Throw-in", corner: "Corner", goalKick: "Goal kick" };
  const icons = { throwIn: "↔️", corner: "🚩", goalKick: "🧤" };
  game.ballOwnerId = taker.id;
  taker.rx = clampFieldX(type === "corner" ? (safePoint.x < 50 ? goalX1() : goalX2()) : safePoint.x);
  taker.ry = clampFieldY(type === "goalKick" ? sideOwnGoalY(side) + (side === "home" ? -5 : 5) : safePoint.y);
  taker.targetX = taker.rx; taker.targetY = taker.ry;
  game.ball = { x: taker.rx, y: taker.ry, vx: 0, vy: 0, ownerId: taker.id, free: false, intent: null };
  game.rt = { ...(game.rt || {}), lastTouchSide: side, lastTouchId: taker.id, ballState: { label: "BOLA IN", type: "in", restart: type, text: `${labels[type]} untuk ${taker.teamName}`, until: rtLiveUntil(game, 6) } };
  appendLog(game, icons[type] || "⚽", `Bola OUT${reason ? ` (${reason})` : ""}. ${labels[type]} cepat untuk ${taker.teamName} lewat ${firstName(taker.name)}.`, { type: "out", restart: type, side, team: taker.teamName });
}
function rtRestartFromFoul(game, fouled, tackler, reason = "pelanggaran") {
  if (!fouled || !rtAlive(game, fouled)) return;
  const side = fouled.side;
  const point = { x: clampFieldX(fouled.rx), y: clampFieldY(fouled.ry) };
  const taker = rtNearestFriend(game, side, point) || fouled;
  taker.rx = clampFieldX(point.x + (side === "home" ? 0.8 : -0.8));
  taker.ry = clampFieldY(point.y);
  taker.targetX = taker.rx; taker.targetY = taker.ry;
  game.ballOwnerId = taker.id;
  game.ball = { x: taker.rx, y: taker.ry, vx: 0, vy: 0, ownerId: taker.id, intent: null, free: false };
  game.rt = { ...(game.rt || {}), lastTouchSide: side, lastTouchId: taker.id, ballState: { label: "FREE KICK", type: "foul", text: `Free kick untuk ${taker.teamName} setelah ${reason}`, until: rtLiveUntil(game, 6) } };
  if (tackler) tackler.aiCooldown = Math.max(tackler.aiCooldown || 0, 1.6);
  appendLog(game, "🎯", `Free kick untuk ${taker.teamName}. ${firstName(taker.name)} mengambil restart dari titik foul.`, { type: "freeKick", side, team: taker.teamName });
}
function rtPassTarget(game, piece, through = false, aim = null) {
  if (!piece || !rtAlive(game, piece)) return null;
  const stick = aim ? rtSanitizeStick(aim) : rtStickDirectionForAction(game, piece);
  const enemies = rtOpponent(game, piece.side);
  const pressure = enemies.filter((e) => rtDist(e, piece) < 7.5).length;
  const adaptive = rtAdaptiveTactic(game, piece.side);
  const passerRole = rtRoleIntent(piece);
  const teammates = rtTeam(game, piece.side).filter((p) => p.id !== piece.id && p.role !== "GK");
  const options = teammates.map((p) => {
    const d = Math.max(1, rtDist(piece, p));
    const forward = rtForwardAmount(piece.side, piece.ry, p.ry);
    const laneRisk = rtPassLaneRisk(game, piece, p);
    const marked = enemies.filter((e) => rtDist(e, p) < 5.5).length;
    const receiverGoal = rtProgressToGoal(piece.side, p.ry) * 22;
    const receiverRole = rtRoleIntent(p);
    const lineBonus = ({ ST: 10, LW: 7, RW: 7, CAM: 8, CM: 5, LM: 4, RM: 4, CDM: 1, LB: -1, RB: -1, CB: -4 })[p.role] || 0;
    const shortSafety = d < 18 ? 8 : d < 30 ? 3 : -2;
    const throughBonus = through ? Math.max(0, forward) * (0.85 + adaptive.riskBias * 0.08) + receiverGoal * 0.4 : Math.min(Math.max(forward, -6), 12) * 0.45;
    const pressureNeed = pressure ? (d < 20 ? 5 : -2) : 0;
    const dx = p.rx - piece.rx;
    const dy = p.ry - piece.ry;
    const stickDot = stick.mag ? rtDotDir(stick.x, stick.y, dx, dy) : 0;
    const stickBonus = stick.mag ? clamp(stickDot, -1, 1) * (through ? 26 : 19) * stick.mag : 0;
    const badBackPass = through && forward < -3 ? -18 : 0;
    const tacticalPass = passerRole.pass * 0.45 + receiverRole.pass * 0.18 + (through ? passerRole.through * 0.52 + receiverRole.through * 0.28 : 0);
    const protectSafety = adaptive.protectBias > 0.5 && forward < 4 ? 5 : 0;
    const chaseRisk = adaptive.urgent && forward > 5 ? 7 : 0;
    const score = p.overall * 0.18 + p.pass * 0.08 + lineBonus + shortSafety + throughBonus + tacticalPass + protectSafety + chaseRisk + pressureNeed + stickBonus + badBackPass - laneRisk * (0.85 + Math.max(0, adaptive.protectBias) * 0.18) - marked * 8 - Math.abs(p.rx - piece.rx) * 0.035;
    return { p, score, laneRisk, d, forward, stickDot };
  }).filter((o) => o.laneRisk < (through ? 31 : 36) || o.d < 12 || (stick.mag && o.stickDot > 0.72))
    .sort((a, b) => b.score - a.score || a.d - b.d);
  return options[0]?.p || teammates.sort((a, b) => rtDist(piece, a) - rtDist(piece, b))[0] || null;
}
function rtBestDribbleTarget(game, carrier) {
  const dir = rtSideDir(carrier.side);
  const candidates = [
    { dx: 0, dy: dir * 7.5 },
    { dx: -6, dy: dir * 6.2 },
    { dx: 6, dy: dir * 6.2 },
    { dx: -8, dy: dir * 3.2 },
    { dx: 8, dy: dir * 3.2 },
    { dx: 0, dy: dir * 3.8 },
  ];
  const enemies = rtOpponent(game, carrier.side);
  const style = sideStyle(game, carrier.side);
  const adaptive = rtAdaptiveTactic(game, carrier.side);
  const roleIntent = rtRoleIntent(carrier);
  const laneHome = carrier.homeX ?? carrier.rx;
  const scored = candidates.map((c) => {
    const x = clampFieldX(carrier.rx + c.dx);
    const y = clampFieldY(carrier.ry + c.dy);
    const nearest = enemies.reduce((m, e) => Math.min(m, Math.hypot(e.rx - x, e.ry - y)), 99);
    const goalGain = rtForwardAmount(carrier.side, carrier.ry, y) * 1.8;
    const laneDiscipline = -Math.abs(x - laneHome) * (style === "Wing Play" && ["LW", "RW", "LM", "RM"].includes(carrier.role) ? 0.02 : 0.08);
    const centerBonus = carrier.role === "ST" || carrier.role === "CAM" ? -Math.abs(x - goalCenterX()) * 0.08 : 0;
    const sidelinePenalty = (x < 8 || x > 92) ? -7 : 0;
    const roleCarry = roleIntent.carry * 0.42 + adaptive.attackBias * 3.6 - adaptive.protectBias * 4.2;
    const widthBonus = roleIntent.width ? -Math.abs(Math.abs(x - 50) - 28) * 0.045 + Math.abs(roleIntent.width) * 0.11 : 0;
    return { x, y, score: nearest * 1.4 + goalGain + laneDiscipline + centerBonus + sidelinePenalty + roleCarry + widthBonus };
  }).sort((a, b) => b.score - a.score);
  return scored[0] || { x: carrier.rx, y: carrier.ry + dir * 3 };
}
function rtShootingWindow(game, carrier) {
  if (!carrier || carrier.role === "GK") return { can: false, chance: 0, reason: "GK" };
  const goalY = rtAttackGoalY(carrier.side);
  const distGoal = Math.abs(carrier.ry - goalY);
  const anglePenalty = Math.abs(carrier.rx - goalCenterX()) * 0.58;
  const pressure = rtOpponent(game, carrier.side).filter((e) => rtDist(e, carrier) < 7.2).length;
  const laneRisk = rtShotLaneRisk(game, carrier);
  const keeper = rtTeam(game, otherSide(carrier.side)).find((p) => p.role === "GK");
  const keeperPos = keeper ? Math.abs(keeper.rx - goalCenterX()) * 0.32 + Math.abs(keeper.ry - rtOwnGoalY(keeper.side)) * 0.22 : 6;
  const quality = rtShotQuality(game, carrier);
  const adaptive = rtAdaptiveTactic(game, carrier.side);
  const role = rtRoleIntent(carrier);
  const chance = clamp(70 + carrier.shoot * 0.27 + carrier.overall * 0.12 + quality.value + role.shoot * 0.18 + adaptive.attackBias * 5.5 - adaptive.protectBias * 4.2 - distGoal * 1.02 - anglePenalty - pressure * 9 - laneRisk * 0.7 - keeperPos, 4, 91);
  return { can: distGoal < (adaptive.urgent ? 31 : 27) && chance > (adaptive.urgent ? 38 : 42) && laneRisk < (adaptive.urgent ? 34 : 28), chance, laneRisk, distGoal, quality };
}

function rtLaunchBall(game, piece, targetX, targetY, speed, intent) {
  const dx = targetX - piece.rx;
  const dy = targetY - piece.ry;
  const dist = Math.max(1, Math.hypot(dx, dy));
  game.ballOwnerId = null;
  game.ball = { x: piece.rx, y: piece.ry, vx: (dx / dist) * speed, vy: (dy / dist) * speed, ownerId: null, free: true, intent: { ...intent, fromId: piece.id, side: piece.side, fromX: piece.rx, fromY: piece.ry, startX: piece.rx, startY: piece.ry, targetX, targetY } };
  game.rt = { ...(game.rt || {}), lastTouchSide: piece.side, lastTouchId: piece.id };
}
function rtPass(game, piece, target = null, through = false, aim = null) {
  if (!piece || !rtAlive(game, piece) || game.ballOwnerId !== piece.id) return;
  const stick = aim ? rtSanitizeStick(aim) : rtStickDirectionForAction(game, piece);
  const t = target || rtPassTarget(game, piece, through, stick);
  if (!t) return;
  const lead = rtReceiverLead(game, piece, t, through);
  let tx = lead.x;
  let ty = lead.y;
  // Jika user menahan stick kuat ke ruang kosong, through ball diarahkan ke ruang itu agar respons terasa langsung.
  if (through && stick.mag > 0.45) {
    tx = clampFieldX((tx * 0.58) + (piece.rx + stick.x * 22) * 0.42);
    ty = clampFieldY((ty * 0.58) + (piece.ry + stick.y * 20) * 0.42);
  }
  const dist = Math.hypot(tx - piece.rx, ty - piece.ry);
  rtLaunchBall(game, piece, tx, ty, (through ? 20 : 16) + Math.min(4, dist / 18), { kind: through ? "through" : "pass", targetId: t.id, targetName: t.name, expire: rtLiveUntil(game, through ? 8.5 : 6.5) });
  game.stats[piece.side].passes += 1;
  piece.energy = clamp((piece.energy || 80) - (through ? 1.4 : 0.9), 0, 100);
  appendLog(game, through ? "🪄" : "🎯", `${firstName(piece.name)} ${through ? "through ball" : "mengoper"} ke ${firstName(t.name)}${stick.mag ? " sesuai arah stick" : ""}.`);
}
function rtPointSegmentDistance(px, py, ax, ay, bx, by) {
  const vx = bx - ax; const vy = by - ay;
  const len2 = vx * vx + vy * vy || 1;
  const t = clamp(((px - ax) * vx + (py - ay) * vy) / len2, 0, 1);
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
}
function rtKeeperSaveChance(game, keeper, ball) {
  if (!keeper || !ball) return 0;
  const intent = ball.intent || {};
  const startX = intent.startX ?? intent.fromX ?? ball.x;
  const startY = intent.startY ?? intent.fromY ?? ball.y;
  const targetX = intent.targetX ?? ball.x;
  const targetY = intent.targetY ?? ball.y;
  const lineDist = rtPointSegmentDistance(keeper.rx, keeper.ry, startX, startY, targetX, targetY);
  const goalLineFit = Math.abs(keeper.ry - rtOwnGoalY(keeper.side));
  const reaction = 31 + (keeper.overall || 60) * 0.32 + (keeper.defend || 60) * 0.22 + (keeper.energy || 80) * 0.06;
  const shotPower = Math.hypot(ball.vx || 0, ball.vy || 0);
  return clamp(reaction - lineDist * 13.5 - goalLineFit * 0.22 - shotPower * 0.32 - (intent.chance || 55) * 0.34, 3, 88);
}
function rtShoot(game, piece, aim = null) {
  if (!piece || !rtAlive(game, piece) || game.ballOwnerId !== piece.id || piece.role === "GK") return;
  const stick = aim ? rtSanitizeStick(aim) : rtStickDirectionForAction(game, piece);
  const target = rtShotTargetFromStick(game, piece, stick);
  const goalY = sideGoalY(piece.side);
  const distGoal = Math.abs(piece.ry - goalY);
  const anglePenalty = Math.abs(piece.rx - goalCenterX()) * 0.55;
  const pressure = rtOpponent(game, piece.side).filter((e) => rtDist(e, piece) < 8).length;
  const laneRisk = rtShotLaneRisk(game, piece);
  const keeper = rtTeam(game, otherSide(piece.side)).find((p) => p.role === "GK");
  const keeperCover = keeper ? Math.max(0, 18 - Math.abs(keeper.rx - goalCenterX()) * 0.7 - Math.abs(keeper.ry - sideOwnGoalY(keeper.side)) * 0.18) : 6;
  const onBalance = stick.mag ? Math.max(0, rtDotDir(stick.x, stick.y, target.x - piece.rx, target.y - piece.ry)) : 0.58;
  const quality = rtShotQuality(game, piece, stick);
  const adaptive = rtAdaptiveTactic(game, piece.side);
  const role = rtRoleIntent(piece);
  const chance = clamp(68 + piece.shoot * 0.27 + piece.overall * 0.13 + onBalance * 5 + quality.value + role.shoot * 0.16 + adaptive.attackBias * 4.8 - adaptive.protectBias * 3.5 - distGoal * 0.92 - anglePenalty - pressure * 8 - laneRisk * 0.55 - keeperCover * 0.85, 5, 90);
  const accurate = roll(chance);
  const spreadBase = quality.label === "elite" ? 2 : quality.label === "good" ? 3 : quality.label === "ok" ? 5 : 7;
  const spread = accurate ? rng(-spreadBase, spreadBase) : pick([-1, 1]) * rng(9, 22 + Math.max(0, Math.round((1 - quality.balance) * 8)));
  const targetX = clamp(target.x + spread, -8, FIELD_W + 8);
  const targetY = piece.side === "home" ? -6 : FIELD_H + 6;
  rtLaunchBall(game, piece, targetX, targetY, 29 + Math.min(11, piece.shoot / 10), { kind: "shot", chance: Math.round(chance), accurate });
  game.stats[piece.side].shots += 1;
  game.stats[piece.side].xg += clamp(chance / 100, 0.03, 0.82);
  piece.energy = clamp((piece.energy || 80) - 5.4, 0, 100);
  appendLog(game, "🥅", `${firstName(piece.name)} menembak real-time dari ${Math.round(distGoal)}m virtual (${Math.round(chance)}%, quality ${quality.label})${stick.mag ? " sesuai arah stick" : ""}.`);
}
function rtTackle(game, tackler, carrier = null, forced = false) {
  carrier = carrier || getPiece(game, game.ballOwnerId);
  if (!tackler || !carrier || tackler.side === carrier.side || !rtAlive(game, tackler) || !rtAlive(game, carrier)) return false;
  const dist = rtDist(tackler, carrier);
  if (dist > (forced ? 6 : 3.2)) return false;
  if (!forced && (tackler.tackleCooldown || 0) > rtLiveNow(game)) return false;
  const isKeeperRush = tackler.role === "GK" && rtKeeperRushActive(game, tackler.side);
  const style = styleProfile(game, tackler.side);
  const chance = clamp(45 + (tackler.defend - carrier.dribble) * 0.45 + ((tackler.energy || 80) - 60) * 0.12 - (carrier.pace - tackler.pace) * 0.08 + (isKeeperRush ? 8 : 0) + (style?.tackle || 0) * 0.35 - Math.max(0, dist - 2.1) * 4, 10, isKeeperRush ? 88 : 84);
  tackler.tackleCooldown = rtLiveUntil(game, rng(isKeeperRush ? 6 : 4, isKeeperRush ? 10 : 8));
  game.stats[tackler.side].tackles += 1;
  tackler.energy = clamp((tackler.energy || 80) - (isKeeperRush ? 5.8 : forced ? 4.2 : 2.4), 0, 100);
  if (roll(chance)) {
    game.stats[tackler.side].tackleOk += 1;
    rtSetPossession(game, tackler, `${firstName(tackler.name)} merebut bola dari ${firstName(carrier.name)} (${Math.round(chance)}%).`);
    if (roll(isKeeperRush ? 10 : forced ? 7 : 3)) possibleInjury(game, carrier, isKeeperRush ? "tabrakan dengan kiper" : "duel tackle");
    return true;
  }
  const foulRisk = clamp((forced ? 18 : 6) + (isKeeperRush ? 16 : 0) + (style?.tackle || 0) * 0.35 + (tackler.energy < 30 ? 8 : 0), 4, 52);
  if (roll(foulRisk)) {
    game.stats[tackler.side].fouls += 1;
    const redRisk = isKeeperRush ? 8 : forced ? 4 : 1;
    const yellowRisk = clamp(22 + (isKeeperRush ? 20 : 0) + (tackler.yellow ? 22 : 0) + (tackler.personality === "Hot Temper" ? 10 : 0), 10, 82);
    if (roll(redRisk)) {
      tackler.red = true;
      game.stats[tackler.side].reds += 1;
      if (game.ballOwnerId === tackler.id) game.ballOwnerId = carrier.id;
      appendLog(game, "🟥", `${firstName(tackler.name)} melakukan tackle keras dan mendapat kartu merah. Pemain keluar dan tidak bisa digantikan.`);
    } else if (roll(yellowRisk)) {
      tackler.yellow = (tackler.yellow || 0) + 1;
      game.stats[tackler.side].yellows += 1;
      if (tackler.yellow >= 2) {
        tackler.red = true;
        game.stats[tackler.side].reds += 1;
        appendLog(game, "🟥", `${firstName(tackler.name)} mendapat kuning kedua setelah telat tackle ${firstName(carrier.name)}.`);
      } else appendLog(game, "🟨", `${firstName(tackler.name)} telat menekel ${firstName(carrier.name)}. Kartu kuning.`);
    } else appendLog(game, "⚠️", `${firstName(tackler.name)} melanggar ${firstName(carrier.name)}.`);
    rtRestartFromFoul(game, carrier, tackler, isKeeperRush ? "benturan kiper" : "tackle terlambat");
    if (roll(isKeeperRush ? 13 : forced ? 7 : 3)) possibleInjury(game, carrier, isKeeperRush ? "benturan kiper" : "tackle keras");
  }
  return false;
}
function rtHandleLooseBall(game, dt) {
  const ball = game.ball;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  ball.vx *= Math.pow(0.90, dt);
  ball.vy *= Math.pow(0.90, dt);
  const attackingSide = ball.vy < 0 ? "home" : "away";
  if (ball.y <= 0 || ball.y >= FIELD_H) {
    const inGoal = ball.x >= goalX1() && ball.x <= goalX2();
    const defendingSide = attackingSide === "home" ? "away" : "home";
    const keeper = rtTeam(game, defendingSide).find((p) => p.role === "GK") || rtNearestFriend(game, defendingSide, { x: goalCenterX(), y: sideOwnGoalY(defendingSide) });
    if (inGoal) {
      game.stats[attackingSide].onTarget += 1;
      const keeperReady = rtKeeperSaveChance(game, keeper, ball);
      if (keeper && roll(keeperReady)) {
        rtSetPossession(game, keeper, `🧤 ${firstName(keeper.name)} membaca trajectory dan menepis shot (${Math.round(keeperReady)}%).`);
        game.stats[defendingSide].saves = (game.stats[defendingSide].saves || 0) + 1;
        return;
      }
      game.score[attackingSide] += 1;
      game.stats[attackingSide].goals += 1;
      const scorer = getPiece(game, ball.intent?.fromId) || rtNearestFriend(game, attackingSide, ball);
      appendLog(game, "🥅", `GOOOL real-time! ${scorer?.teamName || sideLabel(attackingSide)} mencetak gol lewat ${firstName(scorer?.name)}.`, { type: "goal", side: attackingSide, team: scorer?.teamName, player: scorer?.name });
      rtResetAfterGoal(game, attackingSide);
      return;
    }
    const lastTouch = game.rt?.lastTouchSide || ball.intent?.side || attackingSide;
    if (lastTouch === attackingSide) rtRestartFromOut(game, "goalKick", defendingSide, { x: goalCenterX(), y: sideOwnGoalY(defendingSide) }, "shoot melebar");
    else rtRestartFromOut(game, "corner", attackingSide, { x: ball.x, y: attackingSide === "home" ? 2 : FIELD_H - 2 }, "blok bek");
    return;
  }
  if (ball.x < 0 || ball.x > FIELD_W) {
    const throwSide = otherSide(game.rt?.lastTouchSide || attackingSide);
    rtRestartFromOut(game, "throwIn", throwSide, { x: ball.x < 0 ? 2.4 : FIELD_W - 2.4, y: ball.y }, "sideline");
    return;
  }
  const collectors = (game.pieces || []).filter((p) => rtAlive(game, p)).map((p) => ({ p, d: rtBallDist(p, ball) })).sort((a, b) => a.d - b.d || b.p.overall - a.p.overall);
  const first = collectors[0];
  if (first && first.d < 2.25) {
    const targetId = ball.intent?.targetId;
    const isTarget = first.p.id === targetId;
    const chance = clamp((isTarget ? 78 : 52) + first.p.overall * 0.25 + first.p.dribble * 0.12 - first.d * 12, 28, 96);
    if (roll(chance)) {
      rtSetPossession(game, first.p);
      if (ball.intent?.kind === "pass" || ball.intent?.kind === "through") {
        if (first.p.side === ball.intent.side) { game.stats[first.p.side].passOk += 1; appendLog(game, "✅", `${firstName(first.p.name)} menerima ${ball.intent.kind === "through" ? "through ball" : "operan"}.`); }
        else appendLog(game, "🛡️", `${firstName(first.p.name)} meng-intercept bola liar.`);
      }
    }
  }
}


function safePick(arr, fallback = null) {
  return Array.isArray(arr) && arr.length ? arr[rng(0, arr.length - 1)] : fallback;
}
function poissonGoals(xg) {
  const lambda = clamp(Number.isFinite(xg) ? xg : 1.1, 0.05, 4.2);
  const limit = Math.exp(-lambda);
  let k = 0;
  let prod = 1;
  do { k += 1; prod *= Math.random(); } while (prod > limit && k < 9);
  return Math.max(0, k - 1);
}
function aiHomeAdvantage(home, away, context = {}) {
  const derby = context.derby || home?.rivalId === away?.id || away?.rivalId === home?.id;
  const important = context.important || context.competition === "numberOne" || context.competition === "worldCup" || context.stage;
  // Home edge dibuat kecil agar tidak menjadi bias utama; derby/knockout mengurangi efek kandang.
  return derby || important ? 0.08 : 0.16;
}
function aiStyleAttackBonus(style) {
  if (style === "All Out Attack") return 0.2;
  if (style === "High Press") return 0.12;
  if (style === "Counter") return 0.06;
  if (style === "Park Bus") return -0.1;
  return 0;
}
function aiStyleDisciplineRisk(style) {
  if (style === "High Press") return 1.22;
  if (style === "All Out Attack") return 1.12;
  if (style === "Park Bus") return 0.88;
  return 1;
}
function aiExpectedGoals(homePower, awayPower, homeStyle = "Balanced", awayStyle = "Balanced", context = {}) {
  const diff = clamp(homePower - awayPower, -32, 32);
  const derby = context.derby ? 0.08 : 0;
  const importantTightness = context.important ? -0.08 : 0;
  const homeXg = clamp(1.18 + aiHomeAdvantage(context.home, context.away, context) + diff * 0.033 + aiStyleAttackBonus(homeStyle) - aiStyleAttackBonus(awayStyle) * 0.35 + derby + importantTightness, 0.25, 3.3);
  const awayXg = clamp(1.05 - diff * 0.031 + aiStyleAttackBonus(awayStyle) - aiStyleAttackBonus(homeStyle) * 0.35 + derby + importantTightness, 0.2, 3.1);
  return { homeXg, awayXg };
}
function aiPlayerGoalWeight(player, idx = 0) {
  const role = player?.role || player?.position || "";
  const ovr = player?.overall || 65;
  const attack = (player?.shoot || player?.attack || player?.finishing || ovr) || ovr;
  let roleWeight = 1;
  if (["ST", "CF"].includes(role)) roleWeight = 5.2;
  else if (["LW", "RW", "WF"].includes(role)) roleWeight = 3.9;
  else if (["CAM", "AM"].includes(role)) roleWeight = 3.4;
  else if (["CM", "LM", "RM"].includes(role)) roleWeight = 2.1;
  else if (["CDM", "DM"].includes(role)) roleWeight = 1.15;
  else if (["LB", "RB", "CB"].includes(role)) roleWeight = 0.38;
  else if (role === "GK") roleWeight = 0.03;
  return Math.max(0.01, roleWeight * (0.75 + attack / 100) * (idx < 11 ? 1 : 0.35));
}
function weightedPickBy(arr, weightFn) {
  const items = (arr || []).filter(Boolean);
  if (!items.length) return null;
  const weighted = items.map((item, idx) => ({ item, w: Math.max(0, Number(weightFn(item, idx)) || 0) }));
  const total = weighted.reduce((sum, x) => sum + x.w, 0);
  if (total <= 0) return safePick(items);
  let cursor = Math.random() * total;
  for (const x of weighted) {
    cursor -= x.w;
    if (cursor <= 0) return x.item;
  }
  return weighted[weighted.length - 1].item;
}
function aiPickScorerFromPieces(pieces) {
  return weightedPickBy((pieces || []).filter((p) => !p.red && !p.vacant), aiPlayerGoalWeight);
}
function aiPickScorerFromTeam(team) {
  return weightedPickBy((team?.players || []).slice(0, 16), aiPlayerGoalWeight);
}
function aiMinuteBuckets(goalCount) {
  const mins = [];
  for (let i = 0; i < goalCount; i += 1) mins.push(clamp(rng(3, 90) + (roll(12) ? rng(1, 6) : 0), 1, 96));
  return mins.sort((a, b) => a - b);
}
function aiCardChanceForSide(power, style, trailing = false) {
  return clamp(20 + aiStyleDisciplineRisk(style) * 10 + (trailing ? 5 : 0) + Math.max(0, 72 - power) * 0.18, 16, 48);
}
function aiInjuryChanceForSide(power, style) {
  return clamp(6 + (style === "High Press" ? 3 : 0) + Math.max(0, 72 - power) * 0.12, 4, 18);
}

function quickSimPower(game, side) {
  const core = (game.pieces || []).filter((p) => p.side === side && !p.red && !p.vacant);
  const avg = avgOverall(core);
  const morale = core.reduce((sum, p) => sum + (p.morale || 70), 0) / Math.max(1, core.length);
  const stamina = core.reduce((sum, p) => sum + (p.stamina || 70), 0) / Math.max(1, core.length);
  return avg + (morale - 70) * 0.08 + (stamina - 70) * 0.05 + (sideStyle(game, side) === "High Press" ? 1.5 : 0);
}
function quickSimEventText(game, ev) {
  const team = ev.side === "home" ? game.homeName : game.awayName;
  const player = ev.playerName || firstName(ev.player?.name) || "pemain";
  if (ev.type === "goal") return `GOL! ${team} mencetak gol lewat ${player}.`;
  if (ev.type === "shot") return `${team} membangun serangan cepat, ${player} mendapat peluang.`;
  if (ev.type === "save") return `Kiper menggagalkan peluang ${team}; bola tetap hidup.`;
  if (ev.type === "yellow") return `${player} mendapat kartu kuning setelah duel keras.`;
  if (ev.type === "red") return `${player} kartu merah. Tim harus lanjut tanpa pengganti.`;
  if (ev.type === "injury") return `${player} cedera parah saat duel. Simulasi dipause agar manager bisa rotasi.`;
  if (ev.type === "sub") return `${team} melakukan pergantian pemain otomatis untuk menjaga stamina.`;
  return `${team} mengubah tempo dan mencari ruang.`;
}
function makeQuickSimTimeline(game) {
  const hp = quickSimPower(game, "home");
  const ap = quickSimPower(game, "away");
  const homeStyle = sideStyle(game, "home");
  const awayStyle = sideStyle(game, "away");
  const important = isImportantEliminationGame(game);
  const derby = Boolean(game.isDerby);
  const { homeXg, awayXg } = aiExpectedGoals(hp, ap, homeStyle, awayStyle, { home: { rivalId: game.awayId }, away: { rivalId: game.homeId }, derby, important, competition: game.competition, stage: game.stage });
  const moments = [];
  const add = (min, type, side, extra = {}) => moments.push({ id: `sim-${min}-${type}-${side}-${Math.random().toString(36).slice(2, 6)}`, min, type, side, ...extra });
  const goalPlan = { home: poissonGoals(homeXg), away: poissonGoals(awayXg) };
  ["home", "away"].forEach((side) => {
    const xg = side === "home" ? homeXg : awayXg;
    const pwr = side === "home" ? hp : ap;
    const style = side === "home" ? homeStyle : awayStyle;
    const nonGoalShots = clamp(Math.round(xg * rng(3, 5) + rng(1, 4)), 2, 15);
    aiMinuteBuckets(goalPlan[side]).forEach((min) => {
      const player = aiPickScorerFromPieces(rtTeam(game, side));
      add(min, "goal", side, { playerId: player?.playerId, pieceId: player?.id, playerName: player?.name, xg });
    });
    for (let i = 0; i < nonGoalShots; i += 1) {
      const min = rng(5, 90);
      const player = aiPickScorerFromPieces(rtTeam(game, side));
      const onTargetChance = clamp(34 + (pwr - 70) * 0.6 + (style === "All Out Attack" ? 3 : 0), 24, 56);
      add(min, roll(onTargetChance) ? "save" : "shot", side, { playerId: player?.playerId, pieceId: player?.id, playerName: player?.name, xg });
    }
    if (roll(aiCardChanceForSide(pwr, style, goalPlan[side] < goalPlan[otherSide(side)]))) {
      const p = safePick(rtTeam(game, side).filter((x) => x.role !== "GK"));
      add(rng(18, 84), roll(style === "High Press" ? 11 : 7) ? "red" : "yellow", side, { playerId: p?.playerId, pieceId: p?.id, playerName: p?.name });
    }
    if (roll(aiInjuryChanceForSide(pwr, style))) {
      const p = safePick(rtTeam(game, side).filter((x) => x.role !== "GK"));
      add(rng(25, 82), "injury", side, { playerId: p?.playerId, pieceId: p?.id, playerName: p?.name });
    }
  });
  [60, 72, 82].forEach((min) => {
    const tiredHome = rtTeam(game, "home").reduce((s, p) => s + (p.energy || 80), 0) / Math.max(1, rtTeam(game, "home").length);
    const tiredAway = rtTeam(game, "away").reduce((s, p) => s + (p.energy || 80), 0) / Math.max(1, rtTeam(game, "away").length);
    add(min, "sub", tiredHome <= tiredAway ? "home" : "away");
  });
  return moments.sort((a, b) => a.min - b.min || a.type.localeCompare(b.type));
}
function makeQuickSimGame(game) {
  const next = makeRealtimeSoccerGame(game);
  next.mode = "quickSim";
  next.clockSeconds = 0;
  next.matchMaxSeconds = MATCH_CLOCK_SECONDS;
  next.score = { home: 0, away: 0 };
  next.ballOwnerId = null;
  next.sim = { paused: false, timeline: makeQuickSimTimeline(next), processed: [], speedLabel: "Cuplikan cepat AI", staminaPulse: 0 };
  next.history = [{ minute: 1, icon: "📺", text: `Quick Sim dimulai: AI memainkan ${next.homeName} vs ${next.awayName}. User bisa pause dan ganti pemain.` }];
  next.lastAction = "Quick Sim aktif. Cuplikan gol, kartu, cedera, pergantian, dan tekanan lawan akan muncul cepat.";
  return next;
}
function processQuickSimEvent(game, ev) {
  if (!ev || (game.sim?.processed || []).includes(ev.id)) return;
  game.sim.processed = [...(game.sim?.processed || []), ev.id];
  const side = ev.side || (roll(50) ? "home" : "away");
  const teamPieces = rtTeam(game, side).filter((p) => p.role !== "GK");
  const piece = ev.pieceId ? getPiece(game, ev.pieceId) : (teamPieces.find((p) => p.playerId === ev.playerId) || pick(teamPieces));
  if (ev.type === "goal") {
    game.score[side] += 1;
    game.stats[side].goals += 1;
    game.stats[side].shots += 1;
    game.stats[side].onTarget += 1;
    game.stats[side].xg = (game.stats[side].xg || 0) + clamp(0.16 + (piece?.shoot || 70) / 420 + rng(0, 9) / 100, 0.18, 0.68);
    game.stats[side].passes = (game.stats[side].passes || 0) + rng(3, 9);
    game.stats[side].passOk = (game.stats[side].passOk || 0) + rng(2, 8);
    appendLog(game, "🥅", quickSimEventText(game, { ...ev, playerName: piece?.name || ev.playerName }), { type: "goal", side, team: side === "home" ? game.homeName : game.awayName, playerId: piece?.playerId, player: piece?.name });
  } else if (ev.type === "shot" || ev.type === "save") {
    game.stats[side].shots += 1;
    game.stats[side].xg = (game.stats[side].xg || 0) + (ev.type === "save" ? clamp(0.09 + rng(0, 18) / 100, 0.09, 0.32) : clamp(0.04 + rng(0, 12) / 100, 0.04, 0.20));
    game.stats[side].passes = (game.stats[side].passes || 0) + rng(2, 7);
    game.stats[side].passOk = (game.stats[side].passOk || 0) + rng(1, 6);
    if (ev.type === "save") { game.stats[side].onTarget += 1; game.stats[otherSide(side)].saves = (game.stats[otherSide(side)].saves || 0) + 1; }
    appendLog(game, ev.type === "save" ? "🧤" : "🎬", quickSimEventText(game, { ...ev, playerName: piece?.name || ev.playerName }));
  } else if (ev.type === "yellow" || ev.type === "red") {
    if (piece) {
      if (ev.type === "red") { piece.red = true; game.stats[side].reds += 1; appendLog(game, "🟥", quickSimEventText(game, { ...ev, playerName: piece.name }), { type: "red", side, playerId: piece.playerId, player: piece.name }); }
      else { piece.yellow = (piece.yellow || 0) + 1; game.stats[side].yellows += 1; appendLog(game, "🟨", quickSimEventText(game, { ...ev, playerName: piece.name })); }
    }
  } else if (ev.type === "injury") {
    if (piece) {
      autoReplaceInjuredPiece(game, piece, "simulate duel", true);
      if (side === game.userSide) game.sim.paused = true;
      else quickSimAutoSub(game, side);
    }
  } else if (ev.type === "sub") {
    quickSimAutoSub(game, side);
  } else appendLog(game, "📊", quickSimEventText(game, ev));
}
function quickSimAutoSub(game, side) {
  if ((game.subCount?.[side] || 0) >= SUBSTITUTION_LIMIT) return;
  const out = rtTeam(game, side).filter((p) => p.role !== "GK").sort((a, b) => (a.energy || 80) - (b.energy || 80))[0];
  const bench = game.bench?.[side] || [];
  const sub = out ? bench.slice().sort((a, b) => benchFitScore(b, out.role, out.overall) - benchFitScore(a, out.role, out.overall))[0] : null;
  if (!out || !sub) return;
  const idx = bench.findIndex((p) => String(p.id) === String(sub.id));
  if (idx >= 0) bench.splice(idx, 1);
  const old = { id: out.playerId, name: out.name, pos: out.role, trait: out.trait, overall: out.overall, pace: out.pace, shoot: out.shoot, pass: out.pass, dribble: out.dribble, defend: out.defend, stamina: out.stamina, fitness: clamp(out.energy - 8, 20, 100), personality: out.personality, morale: out.morale, value: 0 };
  if (!out.vacant && old.id) bench.push(old);
  Object.assign(out, { playerId: sub.id, name: sub.name, trait: sub.trait, personality: sub.personality, overall: sub.overall, pace: sub.pace, shoot: sub.shoot, pass: sub.pass, dribble: sub.dribble, defend: sub.defend, stamina: sub.stamina, energy: clamp(sub.fitness || 90, 55, 100), morale: clamp(sub.morale || 70, 40, 99), subbedIn: true, vacant: false, mustSub: false, injured: false, minorInjury: false, knockUntil: 0 });
  game.subCount[side] = (game.subCount?.[side] || 0) + 1;
  appendLog(game, "🔁", `${side === "home" ? game.homeName : game.awayName} melakukan pergantian AI: ${firstName(sub.name)} masuk menggantikan ${firstName(old.name)}. (${game.subCount[side]}/3)`);
}
function tickQuickSim(game, seconds = QUICK_SIM_TICK_SECONDS) {
  const next = clone(game);
  if (!next || next.ended || next.goalPause || next.mode !== "quickSim") return next;
  if (next.sim?.paused) return next;
  next.clockSeconds = clamp((next.clockSeconds || 0) + seconds, 0, matchMaxSeconds(next));
  next.sim = { ...(next.sim || {}), staminaPulse: (next.sim?.staminaPulse || 0) + 1 };
  (next.pieces || []).forEach((p) => { if (rtAlive(next, p)) p.energy = clamp((p.energy || 85) - (p.stamina ? clamp(88 - p.stamina, 0, 42) / 90 : 0.18) - 0.55, 18, 100); });
  {
    const hp = quickSimPower(next, "home");
    const ap = quickSimPower(next, "away");
    const homeShare = clamp(50 + (hp - ap) * 0.72 + (sideStyle(next, "home") === "Possession" ? 3 : 0) - (sideStyle(next, "away") === "Possession" ? 3 : 0), 34, 66);
    next.stats.home.possessionSeconds = (next.stats.home.possessionSeconds || 0) + seconds * (homeShare / 100);
    next.stats.away.possessionSeconds = (next.stats.away.possessionSeconds || 0) + seconds * ((100 - homeShare) / 100);
    next.stats.home.possession = Math.round(next.stats.home.possessionSeconds || 0);
    next.stats.away.possession = Math.round(next.stats.away.possessionSeconds || 0);
  }
  const minute = minuteOf(next);
  (next.sim?.timeline || []).filter((ev) => ev.min <= minute && !(next.sim?.processed || []).includes(ev.id)).forEach((ev) => processQuickSimEvent(next, ev));
  if ((next.clockSeconds || 0) >= matchMaxSeconds(next)) finishMatchWithExtraTime(next, next.extraTimeStarted ? "AET" : "Quick Sim full time");
  return next;
}
function applyQuickSimAction(game, action) {
  const next = clone(game);
  if (action.type === "start") { next.sim = { ...(next.sim || {}), paused: false }; appendLog(next, "▶️", "Quick Sim dilanjutkan."); return next; }
  if (action.type === "pause") { next.sim = { ...(next.sim || {}), paused: true }; appendLog(next, "⏸️", "Quick Sim dipause. Kamu bisa ganti pemain maksimal 3 kali."); return next; }
  if (action.type === "surrender") {
    const loseSide = next.userSide; const winSide = otherSide(loseSide);
    next.score = loseSide === "home" ? { home: 0, away: 3 } : { home: 3, away: 0 };
    next.clockSeconds = matchMaxSeconds(next); next.ended = true; next.winner = winSide;
    appendLog(next, "🏳️", `User surrender di Quick Sim. ${winSide === "home" ? next.homeName : next.awayName} menang 3-0.`, { type: "surrender", side: loseSide });
    return next;
  }
  if (action.type === "sub") return applyRealtimeAction(next, action);
  return next;
}
function rtAutoDecideWithBall(game, carrier) {
  if (!carrier || !rtAlive(game, carrier)) return;
  carrier.aiCooldown = Math.max(0, (carrier.aiCooldown || 0) - REAL_SOCCER_TICK_SECONDS);
  const isUserCarrier = carrier.side === game.userSide;
  const dir = rtSideDir(carrier.side);
  const pressureCount = rtOpponent(game, carrier.side).filter((e) => rtDist(e, carrier) < 7.5).length;

  // User carrier sepenuhnya mengikuti stick. Jika stick diam, jangan diambil alih AI agar feel mobile presisi.
  if (isUserCarrier) {
    const stick = rtStickFor(game, carrier.id);
    if (stick.mag) {
      const target = rtManualMoveTarget(game, carrier, stick);
      if (target) { carrier.targetX = target.x; carrier.targetY = target.y; carrier.manualUntil = rtLiveUntil(game, 0.55); }
    } else if (!carrier.manualUntil || carrier.manualUntil < rtLiveNow(game)) {
      carrier.targetX = carrier.rx;
      carrier.targetY = carrier.ry;
      carrier.vx = (carrier.vx || 0) * 0.74;
      carrier.vy = (carrier.vy || 0) * 0.74;
    }
    return;
  }

  if ((carrier.aiCooldown || 0) > 0) return;
  const shot = rtShootingWindow(game, carrier);
  const passChoice = rtChoosePassType(game, carrier, shot);
  const throughIntent = passChoice.through;
  const passTarget = rtPassTarget(game, carrier, throughIntent);
  const passRisk = passTarget ? rtPassLaneRisk(game, carrier, passTarget) : 99;
  const forward = passTarget ? rtForwardAmount(carrier.side, carrier.ry, passTarget.ry) : 0;
  const inFinalThird = rtProgressToGoal(carrier.side, carrier.ry) > 0.62;
  const passBias = rtPassDecisionBias(game, carrier, passTarget, shot) + rtRoleIntent(carrier).pass * 0.24 + passChoice.adaptive.protectBias * 4;
  const style = sideStyle(game, carrier.side);
  const safeBuildStyle = ["Tiki Taka", "Possession", "Vertical Tiki Taka"].includes(style);
  const forcedPass = carrier.role === "GK" || pressureCount >= 2 || (pressureCount >= 1 && passRisk < 25) || (passTarget && inFinalThird && forward > 6 && passRisk < (passChoice.adaptive.urgent ? 34 : 29)) || (safeBuildStyle && passBias > (passChoice.adaptive.urgent ? 3 : 8));
  const shootThreshold = passChoice.adaptive.urgent ? 54 : passChoice.adaptive.protectBias > 0.6 ? 68 : 62;

  if (shot.can && (!passTarget || (shot.chance > shootThreshold && passBias < 11 + passChoice.adaptive.riskBias * 5) || (shot.chance > 54 && passRisk > 31) || (pressureCount === 0 && shot.chance > shootThreshold - 5))) {
    carrier.aiCooldown = 1.05;
    rtShoot(game, carrier);
    return;
  }
  if (passTarget && forcedPass) {
    carrier.aiCooldown = 0.92 + Math.min(0.72, rtDist(carrier, passTarget) / 44);
    rtPass(game, carrier, passTarget, throughIntent && forward > 5 && passRisk < (passChoice.adaptive.urgent ? 35 : 29) && passTarget.role !== "CB");
    return;
  }

  // Ball carry profesional: pilih jalur paling kosong, bukan random ke pojok.
  const dribble = rtBestDribbleTarget(game, carrier);
  carrier.targetX = dribble.x;
  carrier.targetY = dribble.y;
  carrier.aiCooldown = pressureCount ? 0.85 : 1.15;
}
function rtShouldAutoTackle(game, defender, carrier) {
  if (!defender || !carrier || defender.side === carrier.side || defender.role === "GK") return false;
  if ((defender.tackleCooldown || 0) > rtLiveNow(game)) return false;
  const d = rtDist(defender, carrier);
  const role = defender.aiRole || rtPressAssignment(game, defender, carrier);
  const active = role === "press" || role === "cover";
  const facingOwnGoal = rtForwardAmount(defender.side, defender.ry, carrier.ry) < 5.5;
  const carrierProgress = rtProgressToGoal(carrier.side, carrier.ry);
  const dangerZone = carrierProgress > 0.64 || Math.abs(carrier.ry - sideGoalY(carrier.side)) < 23;
  const style = styleProfile(game, defender.side);
  const aggressiveStyle = ["High Press", "Gegenpress", "Physical"].includes(sideStyle(game, defender.side));
  const radius = dangerZone ? 4.15 : aggressiveStyle ? 3.85 : 3.35;
  const skilledDefender = (defender.defend || 60) + (style?.tackle || 0) * 0.55 > (carrier.dribble || 60) - 2;
  return facingOwnGoal && d < radius && (active || (dangerZone && skilledDefender));
}

function tickRealtimeSoccer(game, seconds = REAL_SOCCER_TICK_SECONDS) {
  const next = clone(game);
  if (!next || next.ended || next.goalPause) return next;
  if (next.mode !== "realtimeSoccer") return tickRealtimeClock(next, seconds);
  if (next.rt?.paused) return next;
  const prevClockSeconds = next.clockSeconds || 0;
  next.clockSeconds = clamp(prevClockSeconds + REAL_SOCCER_CLOCK_SECONDS, 0, matchMaxSeconds(next));
  next.rt = { ...(next.rt || {}), tick: (next.rt?.tick || 0) + 1, liveSeconds: ((next.rt?.liveSeconds || 0) + seconds) };
  if (rtCheckHalfTimeKickoff(next, prevClockSeconds)) {
    rtFinishIfNeeded(next);
    return next;
  }
  recoverMinorInjuries(next);

  const ball = next.ball || { x: FIELD_W / 2, y: FIELD_H / 2, vx: 0, vy: 0, free: true, ownerId: null };
  next.ball = ball;
  next.pieces.forEach((p) => { if (p.aiRole && next.rt.tick % 4 === 0) p.aiRole = null; });

  const carrier = getPiece(next, next.ballOwnerId);
  if (carrier && rtAlive(next, carrier)) {
    ball.ownerId = carrier.id;
    ball.free = false;
    const faceX = carrier.faceX ?? 0;
    const faceY = carrier.faceY ?? rtSideDir(carrier.side);
    ball.x = clampFieldX(carrier.rx + faceX * 0.9);
    ball.y = clampFieldY(carrier.ry + faceY * 0.9);
    ball.vx = 0;
    ball.vy = 0;
    rtAutoDecideWithBall(next, carrier);
  } else {
    next.ballOwnerId = null;
    ball.ownerId = null;
    ball.free = true;
  }

  const liveCarrier = getPiece(next, next.ballOwnerId);
  const intendedReceiver = !next.ballOwnerId && ball.intent?.targetId ? getPiece(next, ball.intent.targetId) : null;
  ["home", "away"].forEach((side) => {
    const nearestBall = rtNearestToBall(next, side);
    const team = rtTeam(next, side);
    team.forEach((p) => {
      if (p.knockUntil && p.knockUntil > (next.clockSeconds || 0)) return;
      let rawTarget = { x: p.targetX ?? p.homeX ?? p.rx, y: p.targetY ?? p.homeY ?? p.ry };
      const stick = rtStickFor(next, p.id);
      if (rtIsManuallyControlled(next, p) && stick.mag) {
        rawTarget = rtManualMoveTarget(next, p, stick) || rawTarget;
        p.manualUntil = rtLiveUntil(next, 0.55);
        p.sprintUntil = stick.mag > RT_STICK_SPRINT_ZONE ? rtLiveUntil(next, 0.32) : p.sprintUntil;
      } else if (!next.ballOwnerId) {
        // Loose ball: intended receiver dan pemain terdekat mengejar; pemain lain menjaga second-ball, bukan chaos.
        if (intendedReceiver?.id === p.id) rawTarget = { x: ball.intent?.targetX ?? ball.x, y: ball.intent?.targetY ?? ball.y };
        else if (nearestBall?.id === p.id) rawTarget = { x: ball.x, y: ball.y };
        else {
          const coverX = clampFieldX((p.homeX ?? p.rx) + (ball.x - FIELD_W / 2) * 0.16);
          const coverY = clampFieldY((p.homeY ?? p.ry) + (ball.y - FIELD_H / 2) * 0.10);
          rawTarget = { x: coverX, y: coverY };
        }
      } else if (!p.manualUntil || p.manualUntil < rtLiveNow(next) || p.side !== next.userSide || p.id !== next.rt?.selectedId) {
        rawTarget = rtPitchSlotTarget(next, p, liveCarrier);
      }
      const profile = styleProfile(next, p.side);
      const smartTarget = rtIsManuallyControlled(next, p) ? rawTarget : rtTeamShapeTarget(next, p, rawTarget, liveCarrier);
      const aiStrength = clamp(0.26 + (profile?.offBall || 0) / 128 - rtRoleDiscipline(p) * 0.055 + (difficultyProfile(next).offBall || 0) / 180, 0.18, 0.50);
      const target = rtBlendTarget(p, smartTarget, rtIsManuallyControlled(next, p) ? 0.94 : aiStrength);
      const sprint = Boolean(p.sprintUntil && p.sprintUntil > rtLiveNow(next));
      const shouldPressSprint = liveCarrier?.side !== p.side && (p.aiRole === "press" || p.aiRole === "cover") && rtDist(p, liveCarrier) > 5;
      rtMoveToward(p, target.x, target.y, seconds, sprint || shouldPressSprint, next.ballOwnerId === p.id);
      if (p.role === "GK") rtKeeperRushResolve(next, p);
    });
  });

  rtResolveSpacing(next);
  const movedCarrier = getPiece(next, next.ballOwnerId);
  if (movedCarrier && rtAlive(next, movedCarrier)) {
    next.ball.x = clampFieldX(movedCarrier.rx + (movedCarrier.faceX ?? 0) * 0.9);
    next.ball.y = clampFieldY(movedCarrier.ry + (movedCarrier.faceY ?? rtSideDir(movedCarrier.side)) * 0.9);
    next.rt.lastTouchSide = movedCarrier.side;
    next.rt.lastTouchId = movedCarrier.id;
    const tackler = rtOpponent(next, movedCarrier.side).filter((e) => rtShouldAutoTackle(next, e, movedCarrier)).sort((a, b) => rtDist(a, movedCarrier) - rtDist(b, movedCarrier) || b.defend - a.defend)[0];
    if (tackler) rtTackle(next, tackler, movedCarrier, false);
  } else {
    rtHandleLooseBall(next, seconds);
  }

  {
    const side = getPiece(next, next.ballOwnerId)?.side;
    if (side && next.stats?.[side]) {
      next.stats[side].possessionSeconds = (next.stats[side].possessionSeconds || 0) + Math.max(0, (next.clockSeconds || 0) - prevClockSeconds);
      next.stats[side].possession = Math.round(next.stats[side].possessionSeconds);
    }
  }
  if (next.rt.tick % 22 === 0) {
    next.pieces.forEach((p) => { if (rtAlive(next, p)) p.energy = clamp((p.energy || 80) + 0.08, 0, 100); });
  }
  rtFinishIfNeeded(next);
  return next;
}

function applyRealtimeAction(game, action) {
  const next = clone(game);
  if (action.type === "resumeGoal") { next.goalPause = null; return next; }
  if (next.ended) return next;
  if (action.type === "start") { next.rt = { ...(next.rt || {}), paused: false }; appendLog(next, "▶️", "Match dimulai. Kontrol utama memakai stick kiri."); return next; }
  if (action.type === "pause") { next.rt = { ...(next.rt || {}), paused: true }; appendLog(next, "⏸️", "Match dipause untuk taktik/substitution."); return next; }
  if (action.type === "toggleView") { next.rt = { ...(next.rt || {}), viewMode: action.viewMode || (next.rt?.viewMode === "3d" ? "normal" : "3d") }; return next; }
  if (action.type === "surrender") {
    const loseSide = next.userSide;
    const winSide = otherSide(loseSide);
    next.score = loseSide === "home" ? { home: 0, away: 3 } : { home: 3, away: 0 };
    next.clockSeconds = matchMaxSeconds(next);
    next.ended = true;
    next.winner = winSide;
    appendLog(next, "🏳️", `User surrender. ${winSide === "home" ? next.homeName : next.awayName} menang WO 3-0.`, { type: "surrender", side: loseSide });
    return next;
  }
  if (action.type === "card") return applyCard(next, action.cardKey, next.userSide);
  if (action.type === "switchPlayer") {
    const target = rtSwitchTarget(next, next.userSide, action.currentId || next.rt?.selectedId);
    if (target) {
      next.rt = { ...(next.rt || {}), selectedId: target.id, stick: { x: 0, y: 0, mag: 0, pieceId: target.id } };
      appendLog(next, "🔄", `Switch ke pemain dekat bola: ${target.role} ${firstName(target.name)}.`);
    }
    return next;
  }
  if (action.type === "keeperRush") {
    const keeper = rtKeeperFor(next, next.userSide);
    if (keeper) {
      next.rt = { ...(next.rt || {}), keeperRush: { side: next.userSide, until: rtLiveUntil(next, 3.2) }, selectedId: keeper.id };
      const t = rtKeeperRushTarget(next, keeper);
      if (t) { keeper.targetX = t.x; keeper.targetY = t.y; keeper.sprintUntil = rtLiveUntil(next, 2.4); }
      appendLog(next, "🧤", `${firstName(keeper.name)} diperintah maju untuk intercept/tackle.`);
    }
    return next;
  }
  if (action.type === "sub") {
    const piece = getPiece(next, action.pieceId);
    const bench = next.bench?.[piece?.side] || [];
    const sub = bench.find((p) => String(p.id) === String(action.benchId));
    if (!piece || !sub || piece.red || (next.subCount?.[piece.side] || 0) >= SUBSTITUTION_LIMIT) return next;
    const idx = bench.findIndex((p) => String(p.id) === String(action.benchId));
    bench.splice(idx, 1);
    const old = { id: piece.playerId, name: piece.name, pos: piece.role, trait: piece.trait, overall: piece.overall, pace: piece.pace, shoot: piece.shoot, pass: piece.pass, dribble: piece.dribble, defend: piece.defend, stamina: piece.stamina, fitness: clamp(piece.energy - 8, 20, 100), personality: piece.personality, morale: piece.morale, value: 0 };
    if (!piece.vacant && old.id) bench.push(old);
    Object.assign(piece, { playerId: sub.id, name: sub.name, trait: sub.trait, roleSkills: roleSkillsFor(piece.role), personality: sub.personality, overall: sub.overall, pace: sub.pace, shoot: sub.shoot, pass: sub.pass, dribble: sub.dribble, defend: sub.defend, stamina: sub.stamina, energy: clamp(sub.fitness || 92, 55, 100), morale: clamp(sub.morale || 70, 40, 99), subbedIn: true, vacant: false, mustSub: false, injured: false, minorInjury: false, knockUntil: 0, rx: piece.rx, ry: piece.ry, targetX: piece.rx, targetY: piece.ry });
    next.subCount[piece.side] = (next.subCount[piece.side] || 0) + 1;
    appendLog(next, "🔁", `${firstName(sub.name)} masuk menggantikan ${firstName(old.name)} dalam real-time match.`);
    return next;
  }
  const selected = getPiece(next, action.pieceId) || getPiece(next, next.rt?.selectedId) || rtNearestToBall(next, next.userSide);
  if (!selected || selected.side !== next.userSide || !rtAlive(next, selected) || next.goalPause) return next;
  next.rt = { ...(next.rt || {}), selectedId: selected.id };
  if (action.type === "stick") {
    const stick = rtSanitizeStick(action);
    next.rt.stick = { ...stick, pieceId: selected.id, t: Date.now() };
    if (stick.mag) {
      const target = rtManualMoveTarget(next, selected, stick);
      if (target) { selected.targetX = target.x; selected.targetY = target.y; }
      selected.manualUntil = rtLiveUntil(next, 0.55);
      selected.sprintUntil = stick.mag > RT_STICK_SPRINT_ZONE ? rtLiveUntil(next, 0.38) : selected.sprintUntil;
    } else {
      selected.manualUntil = 0;
      selected.sprintUntil = 0;
      selected.targetX = selected.rx;
      selected.targetY = selected.ry;
    }
    return next;
  }
  if (action.type === "moveTo") {
    selected.targetX = clampFieldX(action.x);
    selected.targetY = clampFieldY(action.y);
    selected.manualUntil = rtLiveUntil(next, 1.2);
    if (!action.silent) appendLog(next, "👟", `${firstName(selected.name)} diarahkan ke ruang ${Math.round(selected.targetX)}:${Math.round(selected.targetY)}.`);
    return next;
  }
  if (action.type === "sprint") {
    selected.sprintUntil = rtLiveUntil(next, 1.2);
    if (!action.silent) appendLog(next, "💨", `${firstName(selected.name)} sprint.`);
    return next;
  }
  if (action.type === "skill") {
    const owner = getPiece(next, next.ballOwnerId);
    if (owner?.side !== next.userSide || owner.id !== selected.id) return next;
    const stick = rtStickDirectionForAction(next, owner);
    const dir = owner.side === "home" ? -1 : 1;
    const enemy = rtNearestEnemy(next, owner.side, owner);
    const pressure = enemy && rtDist(enemy, owner) < 7;
    const chance = clamp(48 + owner.dribble * 0.35 + owner.overall * 0.12 - (pressure ? enemy.defend * 0.18 : 0), 25, 88);
    owner.energy = clamp((owner.energy || 80) - 4, 0, 100);
    if (roll(chance)) {
      owner.targetX = clampFieldX(owner.rx + (stick.mag ? stick.x * 8 : (owner.rx < goalCenterX() ? 4 : -4)));
      owner.targetY = clampFieldY(owner.ry + (stick.mag ? stick.y * 8 : dir * 6));
      owner.manualUntil = rtLiveUntil(next, 2.4);
      owner.sprintUntil = rtLiveUntil(next, 2.2);
      appendLog(next, "✨", `${firstName(owner.name)} sukses skill move dan membuka ruang (${Math.round(chance)}%).`);
    } else {
      appendLog(next, "🧱", `${firstName(owner.name)} gagal skill move, bola masih dalam duel.`);
      if (enemy && rtDist(enemy, owner) < 5) rtTackle(next, enemy, owner, true);
    }
    return next;
  }
  if (action.type === "pass" || action.type === "through") {
    const owner = getPiece(next, next.ballOwnerId);
    if (owner?.side !== next.userSide) return next;
    const stick = rtStickDirectionForAction(next, owner);
    const target = action.targetId ? getPiece(next, action.targetId) : rtPassTarget(next, owner, action.type === "through", stick);
    rtPass(next, owner, target, action.type === "through", stick);
    return next;
  }
  if (action.type === "shoot") {
    const owner = getPiece(next, next.ballOwnerId);
    if (owner?.side !== next.userSide) return next;
    rtShoot(next, owner, rtStickDirectionForAction(next, owner));
    return next;
  }
  if (action.type === "tackle") {
    const carrier = getPiece(next, next.ballOwnerId);
    rtTackle(next, selected, carrier, true);
    return next;
  }
  return next;
}

function nearestEnemy(game, side, cell) {
  return game.pieces.filter((p) => !p.red && !p.vacant && !pieceTemporarilyOut(game, p) && p.side !== side).map((p) => ({ p, d: manhattan(p, cell) })).sort((a, b) => a.d - b.d || b.p.defend - a.p.defend)[0]?.p || null;
}
function nearestFriend(game, side, cell) {
  return game.pieces.filter((p) => !p.red && !p.vacant && !pieceTemporarilyOut(game, p) && p.side === side).map((p) => ({ p, d: manhattan(p, cell) })).sort((a, b) => a.d - b.d || b.p.overall - a.p.overall)[0]?.p || null;
}
function isPenaltyArea(piece) {
  const d = goalDistance(piece);
  return d <= 2 && GOAL_COLS.some((c) => Math.abs(piece.x - c) <= 1);
}
function pieceTemporarilyOut(game, piece) { return Boolean(piece?.knockUntil && (piece.knockUntil || 0) > (game?.clockSeconds || 0)); }
function recoverMinorInjuries(game) {
  (game.pieces || []).forEach((p) => {
    if (p.knockUntil && p.knockUntil <= (game.clockSeconds || 0) && !p.red && !p.vacant) {
      p.knockUntil = 0;
      p.minorInjury = false;
      appendLog(game, "🟢", `${firstName(p.name)} sudah pulih dari cedera ringan dan bisa bergerak normal lagi.`);
    }
  });
}
function makeInjuryEvent(game, piece, type, weeks = 0) {
  return { type: "injury", injuryType: type, side: piece.side, playerId: piece.playerId, player: piece.name, weeks };
}
function possibleInjury(game, piece, reason = "duel") {
  if (!piece || piece.red || piece.vacant) return;
  const guard = trainingBonus(game, "injuryGuard") + (game.facilities?.medical || 1) * 2;
  const risk = clamp((piece.energy < 35 ? 9 : 2) + (reason === "hard" || reason.includes("keras") ? 5 : 0) + (piece.personality === "Injury Prone" ? 5 : 0) + (game.isDerby ? 2 : 0) - guard, 0, 22);
  if (!roll(risk)) return;
  const severeChance = clamp(12 + (reason.includes("keras") ? 18 : 0) + (piece.energy < 25 ? 12 : 0) + (piece.personality === "Injury Prone" ? 10 : 0) - (game.facilities?.medical || 1) * 3, 4, 48);
  if (roll(severeChance)) autoReplaceInjuredPiece(game, piece, reason, true);
  else autoReplaceInjuredPiece(game, piece, reason, false);
}
function autoReplaceInjuredPiece(game, piece, reason = "duel", forceFatal = null) {
  if (!piece || piece.red || piece.vacant) return;
  const oldName = piece.name;
  const oldPlayerId = piece.playerId;
  const fatal = forceFatal === null ? roll(reason.includes("keras") ? 38 : 18) : forceFatal;
  game.stats[piece.side].injuries += 1;
  if (!fatal) {
    const minutes = rng(4, 12);
    piece.minorInjury = true;
    piece.knockUntil = Math.min(MATCH_CLOCK_SECONDS - 1, (game.clockSeconds || 0) + minutes * 60);
    piece.energy = clamp(piece.energy - rng(12, 24), 0, 100);
    piece.morale = clamp((piece.morale || 70) - 2, 25, 99);
    appendLog(game, "🩹", `${firstName(oldName)} cedera ringan setelah ${reason}. Ia menepi sekitar ${minutes} menit game, lalu bisa ikut main lagi.`, makeInjuryEvent(game, piece, "minor", 0));
    return;
  }
  const weeks = Math.max(1, rng(2, 9) - Math.floor((game.facilities?.medical || 1) / 2));
  appendLog(game, "🚑", `${firstName(oldName)} cedera FATAL (${reason}) dan posisinya dikosongkan. User wajib memilih pengganti dari bench.`, makeInjuryEvent(game, piece, "fatal", weeks));
  if (game.ballOwnerId === piece.id) game.ballOwnerId = nearestFriend(game, piece.side, piece)?.id || kickoffPlayer(game.pieces, otherSide(piece.side)) || null;
  Object.assign(piece, {
    playerId: null,
    name: `${piece.role} KOSONG`,
    vacant: true,
    mustSub: true,
    originalPlayerId: oldPlayerId,
    originalPlayerName: oldName,
    fatalInjuryWeeks: weeks,
    overall: 1,
    pace: 1,
    shoot: 1,
    pass: 1,
    dribble: 1,
    defend: 1,
    stamina: 1,
    energy: 0,
    morale: 25,
    yellow: 0,
    injured: true,
  });
}

function benchFitScore(player, role, currentOverall = 60) {
  const compat = COMPATIBLE[role] || [role];
  const exact = player.pos === role ? 100 : 0;
  const compatible = compat.includes(player.pos) ? 52 : 0;
  const sameLine = ((["LB", "CB", "RB", "CDM"].includes(role) && ["LB", "CB", "RB", "CDM"].includes(player.pos))
    || (["CM", "CAM", "LM", "RM"].includes(role) && ["CM", "CAM", "LM", "RM", "CDM"].includes(player.pos))
    || (["ST", "LW", "RW"].includes(role) && ["ST", "LW", "RW", "CAM"].includes(player.pos))) ? 20 : 0;
  const quality = Math.round((player.overall || 50) - Math.max(0, currentOverall - 8));
  const fitness = Math.round((player.fitness || 90) / 8);
  return exact + compatible + sameLine + quality + fitness;
}
function compatibleBenchForPiece(game, piece) {
  if (!piece) return [];
  return (game.bench?.[piece.side] || [])
    .filter((p) => p && (p.injuredWeeks || 0) <= 0 && (p.bannedWeeks || 0) <= 0)
    .slice()
    .sort((a, b) => benchFitScore(b, piece.role, piece.overall) - benchFitScore(a, piece.role, piece.overall) || b.overall - a.overall);
}
function applyManualSub(game, pieceId, benchId) {
  const piece = getPiece(game, pieceId);
  if (!piece || piece.red || game.ended || game.goalPause) return game;
  if (game.turn !== piece.side || (!piece.vacant && game.ap < 1)) return game;
  if ((game.subCount?.[piece.side] || 0) >= SUBSTITUTION_LIMIT) { appendLog(game, "🚫", "Jatah substitution 3 pemain sudah habis."); return game; }
  const bench = game.bench?.[piece.side] || [];
  const idx = bench.findIndex((p) => String(p.id) === String(benchId));
  if (idx < 0) return game;
  const sub = bench.splice(idx, 1)[0];
  const old = { name: piece.name, playerId: piece.playerId, trait: piece.trait, overall: piece.overall, pace: piece.pace, shoot: piece.shoot, pass: piece.pass, dribble: piece.dribble, defend: piece.defend, stamina: piece.stamina, energy: piece.energy, personality: piece.personality, vacant: piece.vacant };
  if (!piece.vacant && old.playerId) bench.push({ id: old.playerId, name: old.name, pos: piece.role, trait: old.trait, overall: old.overall, pace: old.pace, shoot: old.shoot, pass: old.pass, dribble: old.dribble, defend: old.defend, stamina: old.stamina, fitness: clamp(old.energy - 8, 20, 100), personality: old.personality, morale: piece.morale, value: 0 });
  Object.assign(piece, { playerId: sub.id, name: sub.name, trait: sub.trait, roleSkills: roleSkillsFor(piece.role), personality: sub.personality, overall: sub.overall, pace: sub.pace, shoot: sub.shoot, pass: sub.pass, dribble: sub.dribble, defend: sub.defend, stamina: sub.stamina, energy: clamp(sub.fitness || 92, 55, 100), morale: clamp(sub.morale || 70, 40, 99), subbedIn: true, vacant: false, mustSub: false, injured: false, minorInjury: false, knockUntil: 0 });
  game.subCount[piece.side] = (game.subCount[piece.side] || 0) + 1;
  appendLog(game, "🔁", `${firstName(sub.name)} masuk ${old.vacant ? "mengisi posisi kosong" : `menggantikan ${firstName(old.name)}`}. Substitution ${game.subCount[piece.side]}/3.`);
  if (!old.vacant) advanceMatchClock(game, 25);
  return applyAutoShape(game);
}
function setPieceInfo(game, setPiece = game?.setPiece) {
  if (!setPiece) return null;
  const taker = getPiece(game, setPiece.takerId) || (setPiece.type === "goalKick" ? keeperForSide(game, setPiece.side) : nearestFriend(game, setPiece.side, { x: centerX(), y: opponentGoalY(setPiece.side) }));
  const finisher = setPiece.type === "goalKick"
    ? goalKickTarget(game, setPiece.side, taker)
    : game.pieces.filter((p) => !p.red && p.side === setPiece.side).sort((a, b) => (b.shoot + b.overall + (b.role === "ST" ? 12 : 0) + (b.role === "CB" ? 8 : 0)) - (a.shoot + a.overall + (a.role === "ST" ? 12 : 0) + (a.role === "CB" ? 8 : 0)))[0];
  const setBonus = trainingBonus(game, "setPiece") + traitBonus(taker, "setpiece") + effect(game, setPiece.side, "setpiece") * 20;
  if (setPiece.type === "goalKick") {
    const pressure = finisher ? pressureAt(game, setPiece.side, finisher.x, finisher.y) : 0;
    const role = roleSkillBonus(taker, "clearance") + roleSkillBonus(taker, "pass");
    const chance = clamp(62 + (taker?.pass || 55) * 0.24 + (taker?.overall || 60) * 0.08 + role + tacticMod(game, setPiece.side, "pass") - pressure * 8, 48, 94);
    return { taker, finisher, chance: Math.round(chance), label: `Goal kick ${Math.round(chance)}%`, reasons: [reason("GK pass", (taker?.pass || 55) * 0.24), reason("role GK", role), reason("taktik", tacticMod(game, setPiece.side, "pass")), reason("target ditekan", -pressure * 8)] };
  }
  const base = setPiece.type === "corner" ? 18 : setPiece.type === "freeKick" ? 15 : 62;
  const chance = clamp(base + (taker?.pass || 60) * 0.13 + (finisher?.shoot || 60) * 0.10 + setBonus + tacticMod(game, setPiece.side, "shot") - tacticMod(game, otherSide(setPiece.side), "block"), setPiece.type === "penalty" ? 55 : 6, setPiece.type === "penalty" ? 90 : 55);
  return { taker, finisher, chance: Math.round(chance), label: `${setPieceName(setPiece.type)} ${Math.round(chance)}%`, reasons: [reason("taker", (taker?.pass || 60) * 0.13), reason("finisher", (finisher?.shoot || 60) * 0.10), reason("set piece", setBonus), reason("blok lawan", -tacticMod(game, otherSide(setPiece.side), "block"))] };
}
function resolveSetPiece(game) {
  if (!game.setPiece || game.turn !== game.setPiece.side || game.ap < 1) return game;
  const sp = game.setPiece;
  const info = setPieceInfo(game, sp);
  game.setPiece = null;
  if (sp.type === "goalKick") {
    const taker = info.taker || keeperForSide(game, sp.side);
    const target = info.finisher || nearestFriend(game, sp.side, taker || { x: centerX(), y: ownGoalY(sp.side) });
    if (roll(info.chance)) {
      game.ballOwnerId = target?.id || taker?.id || game.ballOwnerId;
      game.stats[sp.side].passes += 1;
      game.stats[sp.side].passOk += 1;
      appendLog(game, "🧤", `Goal kick ${firstName(taker?.name)} ke ${firstName(target?.name)} sukses (${info.chance}%).`);
    } else {
      const enemy = target ? nearestEnemy(game, sp.side, target) : nearestEnemy(game, sp.side, taker || { x: centerX(), y: ownGoalY(sp.side) });
      if (enemy) game.ballOwnerId = enemy.id;
      appendLog(game, "⚠️", `Goal kick ${firstName(taker?.name)} kurang akurat (${info.chance}%). Bola jatuh ke ${firstName(enemy?.name)}.`);
      if (enemy) { game.turn = enemy.side; game.ap = MAX_AP; }
    }
    spendAp(game, sp.side, 1);
    if (!game.ended && getPiece(game, game.ballOwnerId)?.side === sp.side) { game.turn = sp.side; game.ap = Math.max(1, game.ap); }
    return game;
  }
  game.stats[sp.side].shots += 1;
  game.stats[sp.side].xg += clamp(info.chance / 100, 0.05, 0.55);
  if (roll(info.chance)) {
    game.score[sp.side] += 1; game.stats[sp.side].goals += 1; game.stats[sp.side].onTarget += 1;
    appendLog(game, sp.type === "corner" ? "🚩" : "🎯", `${setPieceName(sp.type)} sukses! ${firstName(info.finisher?.name)} mencetak gol (${info.chance}%).`, { type: "goal", side: sp.side, team: info.finisher?.teamName, player: info.finisher?.name });
    resetAfterGoal(game, sp.side);
    finishIfNeeded(game);
    return game;
  }
  const keeper = keeperForSide(game, otherSide(sp.side));
  if (keeper) game.ballOwnerId = keeper.id;
  appendLog(game, sp.type === "corner" ? "🚩" : "🎯", `${setPieceName(sp.type)} gagal dimanfaatkan (${info.chance}%). Bola diamankan lawan.`);
  spendAp(game, sp.side, 1);
  if (!game.ended && keeper) {
    game.setPiece = { type: "goalKick", side: keeper.side, takerId: keeper.id, x: keeper.x, y: keeper.y };
    game.turn = keeper.side;
    game.ap = MAX_AP;
  }
  return game;
}

function lowChanceTackleChaos(game, tackler, target, chance) {
  if (chance > 38 || !roll(3)) return false;
  const side = tackler.side;
  game.stats[side].fouls += 1;
  game.momentum[side] = 0;
  game.momentum[target.side] = clamp(game.momentum[target.side] + 2, 0, 7);
  tackler.energy = clamp(tackler.energy - 9, 0, 100);
  const outcome = rng(1, 3);
  let text = `${firstName(tackler.name)} telat tackle karena peluangnya rendah (${Math.round(chance)}%). Pelanggaran.`;
  if (outcome === 2) text += ` ${firstName(target.name)} cedera.`;
  if (outcome === 3) text += ` Duel kacau: keduanya cedera.`;
  tackler.yellow += 1;
  game.stats[side].yellows += 1;
  appendLog(game, "💥", text + " Kartu kuning.");
  if (outcome === 2 || outcome === 3) autoReplaceInjuredPiece(game, target, "tackle keras");
  if (outcome === 3) autoReplaceInjuredPiece(game, tackler, "benturan saat tackle");
  game.ballOwnerId = target.id;
  spendAp(game, side, 1);
  if (!game.ended) { game.turn = target.side; game.ap = MAX_AP; }
  return true;
}
function applyCard(game, cardKey, side) {
  const card = TACTIC_CARDS.find((c) => c.key === cardKey);
  if (!card || side !== game.userSide) return game;
  if (!game.userCards?.some((c) => c.key === cardKey)) return game;
  const ttl = cardKey === "park" || cardKey === "setpiece" ? 5 : cardKey === "onetwo" || cardKey === "longshot" || cardKey === "chaos" ? 3 : 4;
  game.effects[side] = [...(game.effects[side] || []).filter((e) => e.key !== cardKey), { key: cardKey, ttl }];
  game.userCards = game.userCards.filter((c) => c.key !== cardKey);
  game.usedCards = [...game.usedCards, cardKey];
  appendLog(game, card.icon, `${card.name} aktif selama ${ttl} aksi.`);
  return game;
}
function applyAction(game, action) {
  const next = clone(game);
  if (action.type === "resumeGoal") { next.goalPause = null; return applyAutoShape(next); }
  if (next.ended) return next;
  if (next.goalPause) return next;
  if (action.type === "card") return applyCard(next, action.cardKey, next.userSide);
  if (action.type === "setpiece") return resolveSetPiece(next);
  if (action.type === "sub") return applyManualSub(next, action.pieceId, action.benchId);
  if (action.type === "end") { appendLog(next, "⏭️", `${sideLabel(next.turn)} mengakhiri giliran.`); switchTurn(next); return next; }

  const piece = getPiece(next, action.pieceId);
  if (!piece || piece.red || piece.vacant || pieceTemporarilyOut(next, piece) || piece.side !== next.turn) return next;
  const side = piece.side;
  const chaotic = effect(next, side, "chaos") ? rng(-18, 24) : 0;

  if (action.type === "move") {
    const cell = legalRunCells(next, piece.id).find((c) => c.x === action.x && c.y === action.y);
    if (!cell || next.ap < cell.cost) return next;
    const hadBall = next.ballOwnerId === piece.id;
    const oldDistance = goalDistance(piece);
    const press = pressureAt(next, side, action.x, action.y);
    let chance = 72 + piece.dribble * 0.25 + piece.pace * 0.10 + energyMod(piece) + staminaPenalty(piece, "dribble") + traitBonus(piece, "dribble") + roleSkillBonus(piece, "dribble", { x: action.x, y: action.y }) + next.momentum[side] * 3 + tacticMod(next, side, "risk") * 0.25 + chaotic;
    if (effect(next, side, "wing") && isWide(action.x)) chance += 16;
    if (effect(next, side, "calm")) chance += 7;
    chance -= press * 17 + (hadBall ? trapInfo(next, piece).level * 3 : 0);
    chance = clamp(chance, 12, 97);
    if (hadBall && press >= 1 && !roll(chance)) {
      const enemy = nearestEnemy(next, side, { x: action.x, y: action.y });
      if (enemy) next.ballOwnerId = enemy.id;
      next.momentum[side] = 0;
      next.momentum[otherSide(side)] = clamp(next.momentum[otherSide(side)] + 2, 0, 7);
      piece.energy = clamp(piece.energy - 7, 0, 100);
      appendLog(next, "💥", `${firstName(piece.name)} gagal dribel ke ${boardCellName(action.x, action.y)} (${Math.round(chance)}%). Bola direbut ${firstName(enemy?.name)}.`);
      spendAp(next, side, cell.cost);
      if (!next.ended && enemy) { next.turn = enemy.side; next.ap = MAX_AP; }
      return next;
    }
    piece.x = action.x; piece.y = action.y;
    piece.energy = clamp(piece.energy - (hadBall ? 6 + cell.cost + (tiredLevel(piece) ? 2 : 0) : 3 + (cell.cost > 1 ? 2 : 0)), 0, 100);
    const progress = oldDistance - goalDistance(piece);
    if (progress > 0) next.momentum[side] = clamp(next.momentum[side] + progress, 0, 7);
    appendLog(next, hadBall ? "🌀" : "🏃", hadBall ? `${firstName(piece.name)} dribel ke ${boardCellName(action.x, action.y)} (${Math.round(chance)}%).` : `${firstName(piece.name)} run ke ${boardCellName(action.x, action.y)}.`);
    possibleInjury(next, piece, hadBall ? "dribel" : "sprint");
    spendAp(next, side, cell.cost);
    return next;
  }

  if (action.type === "pass" || action.type === "through") {
    const through = action.type === "through";
    const option = passOptions(next, piece.id, through).find((o) => o.target.id === action.targetId);
    if (!option || next.ap < option.cost) return next;
    next.stats[side].passes += 1;
    const chance = clamp(option.chance + chaotic, 5, 98);
    if ((through && isOffsidePosition(next, piece, option.target)) || (through && option.forwardBonus >= 3 && roll(clamp(7 + pressureAt(next, option.target.side, option.target.x, option.target.y) * 3 - traitBonus(piece, "pass"), 1, 22)))) {
      next.stats[side].offsides += 1;
      const defender = nearestEnemy(next, side, option.target);
      if (defender) next.ballOwnerId = defender.id;
      next.momentum[side] = clamp(next.momentum[side] - 1, 0, 7);
      appendLog(next, "🚩", `Offside! Umpan terobosan ${firstName(piece.name)} ke ${firstName(option.target.name)} terlalu cepat.`, { type: "offside", side });
      spendAp(next, side, option.cost);
      if (!next.ended && defender) { next.turn = defender.side; next.ap = MAX_AP; }
      return next;
    }
    if (roll(chance)) {
      if (option.intercept?.defender && roll(option.intercept.risk)) {
        next.ballOwnerId = option.intercept.defender.id;
        next.momentum[side] = 0;
        next.momentum[otherSide(side)] = clamp(next.momentum[otherSide(side)] + 2, 0, 7);
        appendLog(next, "🛡️", `${firstName(option.intercept.defender.name)} membaca jalur dan meng-intercept ${through ? "through ball" : "umpan"} (${option.intercept.risk}%).`);
        spendAp(next, side, option.cost);
        if (!next.ended) { next.turn = option.intercept.defender.side; next.ap = MAX_AP; }
        return next;
      }
      next.ballOwnerId = option.target.id;
      next.stats[side].passOk += 1;
      next.momentum[side] = clamp(next.momentum[side] + (option.forwardBonus > 0 ? 2 : 1), 0, 7);
      const freeAp = effect(next, side, "onetwo") && !through && option.d <= 3 ? 1 : 0;
      appendLog(next, through ? "🪄" : "🎯", `${firstName(piece.name)} ${through ? "through ball" : "umpan"} ke ${firstName(option.target.name)} (${Math.round(chance)}%).${freeAp ? " One-two: AP dikembalikan." : ""}`);
      spendAp(next, side, Math.max(0, option.cost - freeAp));
    } else {
      const enemy = nearestEnemy(next, side, option.target);
      if (enemy) next.ballOwnerId = enemy.id;
      next.momentum[side] = 0;
      next.momentum[otherSide(side)] = clamp(next.momentum[otherSide(side)] + 2, 0, 7);
      appendLog(next, "🧱", `${through ? "Through ball" : "Umpan"} ${firstName(piece.name)} dipotong ${firstName(enemy?.name)} (${Math.round(chance)}%).`);
      spendAp(next, side, option.cost);
      if (!next.ended && enemy) { next.turn = enemy.side; next.ap = MAX_AP; }
    }
    return next;
  }

  if (action.type === "tackle") {
    const option = tackleOptions(next, piece.id)[0];
    if (!option || option.target.id !== action.targetId || next.ap < 1) return next;
    next.stats[side].tackles += 1;
    const chance = clamp(option.chance + chaotic, 5, 94);
    piece.energy = clamp(piece.energy - 6, 0, 100);
    if (roll(chance)) {
      next.ballOwnerId = piece.id;
      next.stats[side].tackleOk += 1;
      next.momentum[side] = clamp(next.momentum[side] + 2, 0, 7);
      next.momentum[otherSide(side)] = 0;
      appendLog(next, "⚔️", `${firstName(piece.name)} sukses tackle ${firstName(option.target.name)} (${Math.round(chance)}%).`);
      possibleInjury(next, option.target, "duel keras");
      spendAp(next, side, 1);
      return next;
    }
    if (lowChanceTackleChaos(next, piece, option.target, chance)) return next;
    const foulRisk = clamp(18 + (sideStyle(next, side) === "Physical" ? 8 : 0) + (tiredLevel(piece) ? 10 : 0) + (next.isDerby ? 5 : 0), 8, 55);
    if (roll(foulRisk)) {
      next.stats[side].fouls += 1;
      const yellowRisk = clamp(20 + (next.isDerby ? 10 : 0) + (piece.personality === "Hot Temper" ? 12 : 0) + (piece.yellow ? 20 : 0), 8, 78);
      let cardText = "";
      if (roll(yellowRisk)) {
        piece.yellow += 1;
        next.stats[side].yellows += 1;
        piece.playerCard = piece.yellow >= 2 ? "red" : "yellow";
        cardText = piece.yellow >= 2 ? " Kartu kuning kedua, merah!" : " Kartu kuning.";
        if (piece.yellow >= 2) {
          piece.red = true;
          next.stats[side].reds += 1;
          if (next.ballOwnerId === piece.id) next.ballOwnerId = option.target.id;
          appendLog(next, "🟥", `${firstName(piece.name)} mendapat kartu merah dan keluar permanen. Pemain kartu merah tidak bisa digantikan cadangan.`, { type: "red", side, team: piece.teamName, playerId: piece.playerId, player: piece.name });
        }
      }
      if (isPenaltyArea(option.target)) {
        const shooter = option.target;
        const penChance = clamp(62 + shooter.shoot * 0.25 + trainingBonus(next, "setPiece"), 55, 88);
        next.stats[option.target.side].shots += 1; next.stats[option.target.side].xg += 0.76;
        if (roll(penChance)) {
          next.score[option.target.side] += 1; next.stats[option.target.side].goals += 1; next.stats[option.target.side].onTarget += 1;
          appendLog(next, "🚨", `PENALTI! ${firstName(shooter.name)} mencetak gol (${Math.round(penChance)}%).${cardText}`, { type: "goal", side: option.target.side, team: shooter.teamName, player: shooter.name });
          resetAfterGoal(next, option.target.side);
          finishIfNeeded(next);
        } else {
          const keeper = next.pieces.find((p) => p.side === side && p.role === "GK" && !p.red);
          if (keeper) next.ballOwnerId = keeper.id;
          appendLog(next, "🧤", `PENALTI gagal! ${firstName(shooter.name)} ditahan kiper.${cardText}`, { type: "penaltyMiss", side: option.target.side, player: shooter.name });
          spendAp(next, side, 1);
          if (!next.ended && keeper) { next.turn = keeper.side; next.ap = MAX_AP; }
        }
        return next;
      }
      next.setPiece = { type: "freeKick", side: option.target.side, takerId: option.target.id, x: option.target.x, y: option.target.y };
      next.ballOwnerId = option.target.id;
      appendLog(next, "🎯", `Free kick untuk ${option.target.teamName}.${cardText} Klik eksekusi set piece.`);
      spendAp(next, side, 1);
      if (!next.ended) { next.turn = option.target.side; next.ap = Math.max(1, next.ap); }
      return next;
      appendLog(next, "🟨", `${firstName(piece.name)} melanggar ${firstName(option.target.name)}.${cardText}`);
      next.ballOwnerId = option.target.id;
      spendAp(next, side, 1);
      if (!next.ended) { next.turn = option.target.side; next.ap = MAX_AP; }
      return next;
    }
    next.momentum[option.target.side] = clamp(next.momentum[option.target.side] + 1, 0, 7);
    appendLog(next, "😬", `${firstName(piece.name)} gagal tackle. ${firstName(option.target.name)} lolos (${Math.round(chance)}%).`);
    spendAp(next, side, 1);
    return next;
  }

  if (action.type === "shoot") {
    const info = shotInfo(next, piece.id);
    if (!info.can || next.ap < info.cost) return next;
    next.stats[side].shots += 1;
    next.stats[side].xg += info.xg;
    const chance = clamp(info.chance + chaotic, 2, 95);
    piece.energy = clamp(piece.energy - (9 + (tiredLevel(piece) ? 3 : 0)), 0, 100);
    if (roll(chance)) {
      next.score[side] += 1;
      next.stats[side].goals += 1; next.stats[side].onTarget += 1;
      appendLog(next, "🥅", `GOOOL! ${piece.teamName} unggul lewat ${piece.name} (${Math.round(chance)}%).`, { type: "goal", side, team: piece.teamName, player: piece.name });
      resetAfterGoal(next, side);
      finishIfNeeded(next);
      return next;
    }
    const defendingSide = otherSide(side);
    const keeper = keeperForSide(next, defendingSide);
    const accuracy = clamp(18 + piece.shoot * 0.56 + roleSkillBonus(piece, "shot", { goalDistance: goalDistance(piece) }) + energyMod(piece) + staminaPenalty(piece, "shot") - goalDistance(piece) * 6 - pressureAt(next, side, piece.x, piece.y) * 8, 6, 94);
    const onTarget = roll(accuracy);
    if (onTarget) next.stats[side].onTarget += 1;
    if (!info.keeperInGoal) {
      if (!onTarget) {
        appendLog(next, "💨", `${firstName(piece.name)} punya gawang kosong, tapi akurasi shot ${Math.round(accuracy)}% membuat bola melenceng.`);
        if (keeper) {
          next.ballOwnerId = keeper.id;
          next.setPiece = { type: "goalKick", side: defendingSide, takerId: keeper.id, x: keeper.x, y: keeper.y };
        }
      } else {
        const blocker = nearestEnemy(next, side, piece);
        appendLog(next, "🧱", `${firstName(piece.name)} mengarah ke gawang kosong, tapi lini belakang memblok (${Math.round(chance)}%).`);
        if (blocker && roll(52)) next.ballOwnerId = blocker.id;
        else if (keeper) { next.ballOwnerId = keeper.id; next.setPiece = { type: "goalKick", side: defendingSide, takerId: keeper.id, x: keeper.x, y: keeper.y }; }
      }
    } else if (onTarget && roll(50)) {
      next.stats[side].corners += 1;
      appendLog(next, "🧤", `${firstName(piece.name)} menembak, ${firstName(keeper?.name)} menepis jadi corner (${Math.round(chance)}%).`);
      next.ballOwnerId = nearestFriend(next, side, { x: piece.x, y: piece.y })?.id || piece.id;
      next.setPiece = { type: "corner", side, takerId: next.ballOwnerId, x: piece.x, y: piece.y };
    } else if (!onTarget) {
      appendLog(next, "💨", `${firstName(piece.name)} melepas tembakan melebar. Goal kick untuk ${firstName(keeper?.name)} (${Math.round(accuracy)}% akurasi).`);
      if (keeper) {
        next.ballOwnerId = keeper.id;
        next.setPiece = { type: "goalKick", side: defendingSide, takerId: keeper.id, x: keeper.x, y: keeper.y };
      }
    } else {
      appendLog(next, "🧱", `${firstName(piece.name)} menembak, diblok lini belakang (${Math.round(chance)}%).`);
      const blocker = nearestEnemy(next, side, piece);
      if (blocker && roll(40)) next.ballOwnerId = blocker.id;
    }
    next.momentum[side] = clamp(next.momentum[side] - 1, 0, 7);
    next.momentum[otherSide(side)] = clamp(next.momentum[otherSide(side)] + 1, 0, 7);
    spendAp(next, side, info.cost);
    if (next.setPiece && !next.ended) { next.turn = next.setPiece.side; next.ap = MAX_AP; }
    else if (!next.ended && keeper && next.ballOwnerId === keeper.id) { next.turn = keeper.side; next.ap = MAX_AP; }
    return next;
  }

  if (action.type === "skill") {
    if (next.ballOwnerId !== piece.id || next.ap < 2) return next;
    let chance = clamp(50 + piece.dribble * 0.35 + traitBonus(piece, "dribble") + roleSkillBonus(piece, "skill") + energyMod(piece) + staminaPenalty(piece, "skill") + next.momentum[side] * 3 - trapInfo(next, piece).level * 4, tiredLevel(piece) ? 8 : 15, tiredLevel(piece) ? 78 : 91);
    if (piece.trait === "Playmaker") chance += 5;
    if (roll(chance)) {
      next.momentum[side] = clamp(next.momentum[side] + 3, 0, 7);
      next.effects[side] = [...(next.effects[side] || []).filter((e) => e.key !== "skillshot"), { key: "skillshot", ttl: 2 }];
      piece.energy = clamp(piece.energy - (8 + (tiredLevel(piece) ? 4 : 0)), 0, 100);
      appendLog(next, "✨", `${firstName(piece.name)} melakukan skill move. Momentum naik dan membuka tembakan ekstra (${Math.round(chance)}%).`);
    } else {
      const enemy = nearestEnemy(next, side, piece);
      if (enemy) next.ballOwnerId = enemy.id;
      next.momentum[side] = 0;
      appendLog(next, "🙃", `Skill ${firstName(piece.name)} gagal. Bola lepas ke ${firstName(enemy?.name)} (${Math.round(chance)}%).`);
      if (enemy) { next.turn = enemy.side; next.ap = MAX_AP; }
    }
    spendAp(next, side, 2);
    return next;
  }

  return next;
}

function scoreActionNoise(style, difficulty = "Normal") {
  const base = style === "Chaos" ? 28 : style === "Physical" ? 14 : style === "Tiki Taka" ? 7 : 10;
  const chaos = Math.max(base, difficultyProfile(difficulty).noise);
  return rng(-chaos, chaos);
}
function chooseCandidate(candidates, style, difficulty = "Normal") {
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.score - a.score);
  const spread = style === "Chaos" ? 34 : style === "Tiki Taka" ? 18 : 24;
  const pool = candidates.slice(0, style === "Chaos" ? 8 : 5).filter((c) => c.score >= candidates[0].score - spread);
  if (style !== "Chaos" && rng(1, 100) <= difficultyProfile(difficulty).bestPick) return candidates[0].action;
  const weighted = pool.map((c, i) => ({ ...c, weight: Math.max(1, Math.round((pool.length - i) * 1.7 + Math.max(0, c.score - pool[pool.length - 1].score) / 8)) }));
  const total = weighted.reduce((sum, c) => sum + c.weight, 0);
  let rollValue = rng(1, total);
  for (const c of weighted) {
    rollValue -= c.weight;
    if (rollValue <= 0) return c.action;
  }
  return candidates[0].action;
}
function bestAiAction(game) {
  if (game.ended || game.goalPause) return null;
  if (game.setPiece && game.setPiece.side === game.turn) return { type: "setpiece" };
  const style = sideStyle(game, game.turn);
  const difficulty = game.aiDifficulty || "Normal";
  const aiBoost = difficultyProfile(difficulty).aiBonus;
  const offBallBoost = difficultyProfile(difficulty).offBall;
  const mine = game.pieces.filter((p) => !p.red && !p.vacant && !pieceTemporarilyOut(game, p) && p.side === game.turn);
  const carrier = getPiece(game, game.ballOwnerId);
  const candidates = [];
  const add = (action, score, label) => candidates.push({ action, score: score + scoreActionNoise(style, difficulty) + aiBoost, label });

  if (carrier && carrier.side === game.turn) {
    const trap = trapInfo(game, carrier);
    const shot = shotInfo(game, carrier.id);
    if (shot.can) {
      const threshold = style === "Chaos" || game.aiPlan === "Shoot Early" ? 34 : style === "Long Ball" ? 40 : 46;
      const eager = shot.chance >= 62 || (shot.chance >= threshold && ["Shoot Early", "Chaos Gambit"].includes(game.aiPlan));
      if (eager && rng(1, 100) <= (shot.chance >= 62 ? 78 : 42)) return { type: "shoot", pieceId: carrier.id };
      add({ type: "shoot", pieceId: carrier.id }, shot.chance + 42 + (game.aiPlan === "Shoot Early" ? 24 : 0) - (shot.needsSkill ? 18 : 0), "shoot");
    }

    const through = passOptions(game, carrier.id, true).slice(0, 10);
    through.forEach((p) => {
      const offsidePenalty = isOffsidePosition(game, carrier, p.target) ? -50 : 0;
      let score = p.chance + p.forwardBonus * 24 + (p.target.role === "ST" ? 28 : 0) - p.d * 1.5 + offsidePenalty - (trap.trapped ? 18 : 0);
      if (["Counter", "Long Ball", "Wing Play"].includes(style)) score += 22;
      if (["Sudden Through Ball", "Long Switch", "Counter Burst"].includes(game.aiPlan)) score += 30;
      if (goalDistance(p.target) <= 3) score += 22;
      add({ type: "through", pieceId: carrier.id, targetId: p.target.id }, score, "killer pass");
    });

    const passes = passOptions(game, carrier.id, false).slice(0, 10);
    passes.forEach((p) => {
      let score = p.chance + p.forwardBonus * 12 + (p.target.role === "ST" ? 14 : 0) + (trap.trapped && p.d <= 3 ? 34 : 0) + (trap.crowded && p.d <= 4 ? 12 : 0);
      if (["Possession", "Tiki Taka"].includes(style)) score += p.d <= 3 ? 20 : -2;
      if (game.aiPlan === "Tempo Control") score += p.d <= 4 ? 16 : 0;
      if (goalDistance(p.target) < goalDistance(carrier)) score += 12;
      add({ type: "pass", pieceId: carrier.id, targetId: p.target.id }, score, "pass");
    });

    const forwardRuns = legalRunCells(game, carrier.id)
      .map((cell) => ({ cell, progress: goalDistance(carrier) - goalDistance({ ...carrier, ...cell }), pressure: pressureAt(game, carrier.side, cell.x, cell.y), support: supportAt(game, carrier.side, cell.x, cell.y) }))
      .filter((r) => r.progress >= 0 && r.pressure <= (style === "Chaos" ? 3 : 2.2))
      .sort((a, b) => (b.progress * 13 + b.support * 4 - b.pressure * 5 - aiCornerPenalty(b.cell, carrier.side, style)) - (a.progress * 13 + a.support * 4 - a.pressure * 5 - aiCornerPenalty(a.cell, carrier.side, style)));
    if (!trap.trapped && forwardRuns.length && rng(1, 100) <= (style === "Counter" || game.aiPlan === "Risky Dribble" ? 50 : 28)) {
      const top = forwardRuns.slice(0, Math.min(3, forwardRuns.length));
      const chosen = pick(top).cell;
      return { type: "move", pieceId: carrier.id, x: chosen.x, y: chosen.y };
    }
    legalRunCells(game, carrier.id).forEach((cell) => {
      const progress = goalDistance(carrier) - goalDistance({ ...carrier, ...cell });
      const nextPressure = pressureAt(game, carrier.side, cell.x, cell.y);
      const nextSupport = supportAt(game, carrier.side, cell.x, cell.y);
      let score = progress * 34 - Math.abs(cell.x - centerX()) * 2 - nextPressure * 9 + nextSupport * 5 - trap.level * 7 - aiCornerPenalty(cell, carrier.side, style);
      if (goalDistance({ ...carrier, ...cell }) <= 3) score += 34;
      if (shotLaneInfo({ ...carrier, ...cell }).baseRange > 0 && goalDistance({ ...carrier, ...cell }) <= SHOT_STRAIGHT_RANGE) score += 12;
      if (style === "Wing Play" && isWide(cell.x)) score += 22;
      if (["Risky Dribble", "Counter Burst", "Chaos Gambit"].includes(game.aiPlan)) score += 28;
      if (progress < 0) score -= 40;
      add({ type: "move", pieceId: carrier.id, x: cell.x, y: cell.y }, score, "drive forward");
    });
    mine.filter((p) => p.id !== carrier.id && p.role !== "GK").forEach((p) => {
      legalRunCells(game, p.id).forEach((cell) => {
        const progress = goalDistance(p) - goalDistance({ ...p, ...cell });
        const nearCarrier = Math.max(0, 8 - manhattan(cell, carrier));
        const widthBonus = isWide(cell.x) ? tacticMod(game, game.turn, "width") : 0;
        const centralBonus = Math.max(0, 5 - Math.abs(cell.x - centerX()));
        const receiveLane = interceptionInfo(game, carrier, { ...p, ...cell }, false).risk;
        let score = tacticMod(game, game.turn, "offBall") + offBallBoost + progress * 12 + nearCarrier * 4 + centralBonus + widthBonus - pressureAt(game, p.side, cell.x, cell.y) * 5 - receiveLane * 0.5 - aiCornerPenalty(cell, p.side, style);
        if (["ST", "LW", "RW", "CAM"].includes(p.role) && goalDistance({ ...p, ...cell }) <= 5) score += 18;
        if (["LB", "RB", "LM", "RM", "LW", "RW"].includes(p.role) && style === "Wing Play" && isWide(cell.x)) score += 24;
        if (["CDM", "CM"].includes(p.role) && ["Possession", "Tiki Taka"].includes(style)) score += 18;
        add({ type: "move", pieceId: p.id, x: cell.x, y: cell.y }, score, "off-ball support");
      });
    });
    if (game.ap >= 2 && rng(1, 100) <= (trap.trapped ? 45 : style === "Chaos" ? 38 : 16)) add({ type: "skill", pieceId: carrier.id }, 64 + game.momentum[game.turn] * 5 + (trap.trapped ? 26 : 0), "skill");
  } else if (carrier && carrier.side !== game.turn) {
    mine.forEach((p) => {
      const t = tackleOptions(game, p.id)[0];
      if (t) add({ type: "tackle", pieceId: p.id, targetId: t.target.id }, t.chance + 36 + (style === "High Press" ? 20 : 0) + (style === "Physical" ? 14 : 0), "tackle");
      legalRunCells(game, p.id).forEach((cell) => {
        const closeCarrier = 38 - manhattan(cell, carrier) * 6;
        const goalSide = ownGoalDistance(p, cell) <= ownGoalDistance(carrier.side, carrier) ? 10 : 0;
        const protectGoal = Math.max(0, 20 - ownGoalDistance(p, cell) * 2);
        const blockLane = Math.abs(cell.x - carrier.x) <= 1 ? 12 : 0;
        const pressureRisk = pressureAt(game, p.side, cell.x, cell.y) * 2;
        add({ type: "move", pieceId: p.id, x: cell.x, y: cell.y }, closeCarrier + protectGoal + goalSide + blockLane - pressureRisk + (style === "Park Bus" ? 16 : 0), "press/cover");
      });
    });
  } else {
    mine.forEach((p) => legalRunCells(game, p.id).forEach((cell) => {
      const progress = goalDistance(p) - goalDistance({ ...p, ...cell });
      const central = 4 - Math.abs(cell.x - centerX());
      add({ type: "move", pieceId: p.id, x: cell.x, y: cell.y }, progress * 18 + central, "support run");
    }));
  }

  if (!candidates.length) return { type: "end" };
  if (rng(1, 100) <= 1 && game.ap <= 1) return { type: "end" };
  return chooseCandidate(candidates, style, difficulty) || { type: "end" };
}

function simulateOtherMatch(home, away, week, fixture = {}) {
  const hp = teamPower(home);
  const ap = teamPower(away);
  const derby = home.rivalId === away.id || away.rivalId === home.id;
  const important = fixture.competition && fixture.competition !== "league";
  const { homeXg, awayXg } = aiExpectedGoals(hp, ap, home?.style || "Balanced", away?.style || "Balanced", { home, away, derby, important, competition: fixture.competition, stage: fixture.stage });
  const h = poissonGoals(homeXg);
  const a = poissonGoals(awayXg);
  const events = [];
  aiMinuteBuckets(h).forEach((min) => {
    const player = aiPickScorerFromTeam(home);
    events.push({ min, type: "goal", side: "home", team: home.name, player: player?.name || "Pemain", playerId: player?.id, xg: Number(homeXg.toFixed(2)) });
  });
  aiMinuteBuckets(a).forEach((min) => {
    const player = aiPickScorerFromTeam(away);
    events.push({ min, type: "goal", side: "away", team: away.name, player: player?.name || "Pemain", playerId: player?.id, xg: Number(awayXg.toFixed(2)) });
  });
  const cardSides = ["home", "away"];
  cardSides.forEach((side) => {
    const team = side === "home" ? home : away;
    const power = side === "home" ? hp : ap;
    const style = team?.style || "Balanced";
    const trailing = side === "home" ? h < a : a < h;
    if (roll(aiCardChanceForSide(power, style, trailing) * 0.45)) {
      const p = safePick((team.players || []).slice(0, 11).filter((x) => x.role !== "GK"));
      events.push({ min: rng(12, 89), type: roll(style === "High Press" ? 8 : 5) ? "red" : "yellow", side, team: team.name, player: p?.name || "Pemain", playerId: p?.id });
    }
    if (roll(aiInjuryChanceForSide(power, style) * 0.35)) {
      const p = safePick((team.players || []).slice(0, 11).filter((x) => x.role !== "GK"));
      events.push({ min: rng(20, 88), type: "injury", side, team: team.name, player: p?.name || "Pemain", playerId: p?.id });
    }
  });
  events.sort((x, y) => x.min - y.min || String(x.type).localeCompare(String(y.type)));
  return { week, homeId: home.id, awayId: away.id, home: home.name, away: away.name, homeGoals: h, awayGoals: a, events, derby, xg: { home: Number(homeXg.toFixed(2)), away: Number(awayXg.toFixed(2)) }, competition: fixture.competition || "league", leagueKey: fixture.leagueKey || home.leagueKey, cupName: fixture.cupName, stage: fixture.stage, group: fixture.group, matchKey: fixture.key };
}
function resultFromGame(game, week) {
  return { week, homeId: game.homeId, awayId: game.awayId, home: game.homeName, away: game.awayName, homeGoals: game.score.home, awayGoals: game.score.away, events: game.events || [], derby: game.isDerby, stats: game.stats, penalty: game.penalty, extraTime: Boolean(game.extraTimeStarted), competition: game.competition || "league", leagueKey: game.leagueKey, cupName: game.cupName, stage: game.stage, group: game.group, matchKey: game.matchKey };
}
function applyResult(teams, result, userTeamId = MY_TEAM_ID) {
  const isLeague = !result.competition || result.competition === "league";
  return teams.map((team) => {
    if (team.id !== result.homeId && team.id !== result.awayId) return { ...team, players: tickPlayerStatus(team.players) };
    const isHome = team.id === result.homeId;
    const gf = isHome ? result.homeGoals : result.awayGoals;
    const ga = isHome ? result.awayGoals : result.homeGoals;
    const win = gf > ga;
    const draw = gf === ga;
    const playerEvents = (result.events || []).filter((e) => e.side === (isHome ? "home" : "away"));
    const affectedIds = new Map();
    playerEvents.forEach((e) => {
      if (e.playerId) affectedIds.set(e.playerId, e);
    });
    return {
      ...team,
      wins: team.wins + (isLeague && win ? 1 : 0), draws: team.draws + (isLeague && draw ? 1 : 0), losses: team.losses + (isLeague && !win && !draw ? 1 : 0),
      gf: team.gf + (isLeague ? gf : 0), ga: team.ga + (isLeague ? ga : 0), pts: team.pts + (isLeague ? (win ? 3 : draw ? 1 : 0) : 0),
      morale: clamp((team.morale || 70) + (win ? 4 : draw ? 1 : -3) + (result.derby && win ? 3 : 0), 35, 99),
      form: [...(team.form || []).slice(-4), win ? "W" : draw ? "D" : "L"],
      players: tickPlayerStatus(team.players, affectedIds, win),
    };
  });
}
function tickPlayerStatus(players, affected = new Map(), win = false) {
  return players.map((p) => {
    const ev = affected.get(p.id);
    let next = { ...p };
    next.injuredWeeks = Math.max(0, (next.injuredWeeks || 0) - 1);
    next.bannedWeeks = Math.max(0, (next.bannedWeeks || 0) - 1);
    next.fitness = clamp((next.fitness || 100) + 9 - rng(0, 8), 35, 100);
    next.morale = clamp((next.morale || 70) + (win ? 2 : -1), 35, 99);
    if (ev?.type === "injury") next.injuredWeeks = Math.max(next.injuredWeeks, ev.weeks || 1);
    if (ev?.type === "red") next.bannedWeeks = Math.max(next.bannedWeeks, 1);
    if (ev?.type === "goal") {
      next.morale = clamp(next.morale + 4, 35, 99);
      if (next.overall < next.potential && roll(22)) next.overall += 1;
    }
    return next;
  });
}

function endSeasonRollover(teams, season, competitionState = initialCompetitionState(season)) {
  const history = [];
  const news = [];
  const freeAgents = [];
  let nextTeams = teams.map((t) => ({ ...t, trophies: t.trophies || [] }));
  if (competitionState?.numberOne?.championId) {
    nextTeams = nextTeams.map((t) => t.id === competitionState.numberOne.championId && !(t.trophies || []).some((tr) => tr.season === season && tr.name === "Number 1 Championship") ? { ...t, numberOneTitles: (t.numberOneTitles || 0) + 1, trophies: [{ season, name: "Number 1 Championship", mark: "NO.1" }, ...(t.trophies || [])].slice(0, 14) } : t);
  }
  LEAGUE_ORDER.forEach((leagueKey) => {
    const table = sortLeagueTeams(nextTeams, leagueKey);
    const league = leagueInfo(leagueKey);
    const champion = table[0];
    if (champion) {
      history.push({ season, competition: league.name, championId: champion.id, championName: champion.name });
      news.push({ id: `season-${season}-${leagueKey}-champ`, season, week: SEASON_LENGTH_WEEKS, tag: "Juara Liga", icon: "🏆", title: `${champion.name} juara ${league.name}`, body: `Hadiah akhir musim masuk. Promosi/degradasi membuat dunia career tetap hidup.` });
    }
  });
  const promotions = [];
  const relegations = [];
  [["championship", "liga3"], ["liga3", "liga2"], ["liga2", "liga1"]].forEach(([from, to]) => {
    sortLeagueTeams(nextTeams, from).slice(0, 3).forEach((t) => promotions.push({ id: t.id, from, to }));
    sortLeagueTeams(nextTeams, to).slice(-3).forEach((t) => relegations.push({ id: t.id, from: to, to: from }));
  });
  const moveMap = new Map([...promotions, ...relegations].map((m) => [m.id, m.to]));
  nextTeams = nextTeams.map((team) => {
    const table = sortLeagueTeams(nextTeams, team.leagueKey);
    const rank = table.findIndex((t) => t.id === team.id) + 1;
    const league = leagueInfo(team.leagueKey);
    const champ = rank === 1;
    const top5 = rank > 0 && rank <= 5;
    const prize = champ ? league.prize.champion : top5 ? league.prize.top5 : league.prize.stay;
    const newLeague = moveMap.get(team.id) || team.leagueKey;
    let players = (team.players || []).map((p) => {
      let next = { ...p, age: (p.age || 22) + 1, contract: Math.max(0, (p.contract || 1) - 1), injuredWeeks: Math.max(0, (p.injuredWeeks || 0) - 1), bannedWeeks: 0, yellowCards: 0 };
      if (next.age >= 33 && roll(12 + (next.age - 33) * 7)) return null;
      if (next.contract <= 0) {
        if (team.id === MY_TEAM_ID) {
          freeAgents.push(freeAgentFromPlayer({ ...next, contract: 0 }, "Contract Expired"));
          news.push({ id: `contract-expired-${season}-${next.id}`, season, week: SEASON_LENGTH_WEEKS, tag: "Kontrak Habis", icon: "📄", title: `${next.name} meninggalkan klub`, body: `Kontrak habis dan tidak diperpanjang. Pemain pindah ke Transfer sebagai free agent.` });
          return null;
        }
        if (roll(34)) return null;
      }
      if (next.age >= 31) {
        next.overall = clamp(next.overall - rng(0, 2), 40, 98);
        next.pace = clamp((next.pace || 50) - rng(0, 2), 20, 99);
      }
      return recalcPlayerValue(next, team.id);
    }).filter(Boolean);
    const youthCount = team.id === MY_TEAM_ID ? 1 + rng(0, 1) : rng(1, 3);
    for (let i = 0; i < youthCount && players.length < 38; i += 1) {
      const pos = pick(EXTRA_POSITIONS);
      const kid = genPlayer(pos, team.id, leagueInfo(newLeague).level === 1 ? rng(-5, 0) : rng(-9, -2), true);
      players.push(recalcPlayerValue({ ...kid, academy: true, rarePotential: kid.rarePotential && roll(45), sourceClub: `${team.name} Academy` }, team.id));
    }
    while (team.id === MY_TEAM_ID && players.length < 18) {
      const pos = pick(BASE_POSITIONS);
      const kid = genPlayer(pos, team.id, rng(-10, -5), true);
      players.push(recalcPlayerValue({ ...kid, academy: true, sourceClub: `${team.name} Emergency Academy`, contract: 1 }, team.id));
      news.push({ id: `emergency-youth-${season}-${players.length}`, season, week: SEASON_LENGTH_WEEKS, tag: "Youth Intake", icon: "🌱", title: `Akademi menutup kekurangan skuad`, body: `Skuad utama tidak boleh kurang dari 18 pemain, jadi pemain akademi darurat dipromosikan.` });
    }
    const chaos = starChaos({ ...team, players });
    const morale = clamp((team.morale || 70) + (champ ? 8 : top5 ? 4 : rank >= 10 ? -4 : 0) - (chaos.tooMany ? 5 : 0), 25, 99);
    return resetLeagueTable({ ...team, leagueKey: newLeague, leagueName: leagueName(newLeague), leagueLevel: leagueInfo(newLeague).level, budget: clamp(Math.round(((team.budget || INITIAL_CASH) + prize - Math.round(teamWeeklyWage({ ...team, players }) * 0.04)) / 500) * 500, team.id === MY_TEAM_ID ? -999999 : -50000, team.id === MY_TEAM_ID ? 99999999 : maxAiBudgetForLeague(newLeague)), players: players.sort((a, b) => b.overall - a.overall), morale, trophies: champ ? [{ season, name: league.name }, ...(team.trophies || [])].slice(0, 12) : (team.trophies || []), numberOneTitles: team.numberOneTitles || 0 });
  });
  return { teams: nextTeams, history, news, freeAgents };
}
function runQaDebug(teams, market, fixtureCalendar, week, competitionState) {
  const playerIds = teams.flatMap((t) => (t.players || []).map((p) => p.id));
  const dupPlayers = playerIds.length - new Set(playerIds).size;
  const marketIds = (market || []).map((p) => p.id);
  const dupMarket = marketIds.length - new Set(marketIds).size;
  const ownedIds = new Set(playerIds);
  const marketOwned = (market || []).filter((p) => p.ownerTeamId && ownedIds.has(p.id)).length;
  const missingLeague = teams.filter((t) => !t.leagueKey).length;
  const shortSquads = teams.filter((t) => (t.players || []).length < 18).length;
  const overSquads = teams.filter((t) => (t.players || []).length > 34).length;
  const badBudgets = teams.filter((t) => !Number.isFinite(Number(t.budget))).length;
  const legacyInjuryFields = teams.flatMap((t) => t.players || []).filter((p) => Object.prototype.hasOwnProperty.call(p, "injuryWeeks")).length;
  const invalidAvailability = teams.flatMap((t) => t.players || []).filter((p) => Number(p.injuredWeeks || 0) < 0 || Number(p.bannedWeeks || 0) < 0).length;
  const emptyWeeks = (fixtureCalendar || []).filter((w) => !w?.length).length;
  const avgBudget = Math.round(teams.reduce((sum, t) => sum + Number(t.budget || 0), 0) / Math.max(1, teams.length));
  const avgWage = Math.round(teams.reduce((sum, t) => sum + teamWeeklyWage(t), 0) / Math.max(1, teams.length));
  const transferValueSpread = (market || []).length ? `${money(Math.min(...market.map((p) => p.value || 0)))} - ${money(Math.max(...market.map((p) => p.value || 0)))}` : "kosong";
  const no1 = competitionState?.numberOne;
  const problems = dupPlayers + dupMarket + marketOwned + missingLeague + shortSquads + badBudgets + legacyInjuryFields + invalidAvailability;
  return { week, teams: teams.length, players: playerIds.length, dupPlayers, dupMarket, marketOwned, missingLeague, shortSquads, overSquads, badBudgets, legacyInjuryFields, invalidAvailability, emptyWeeks, avgBudget: money(avgBudget), avgWeeklyWage: money(avgWage), transferValueSpread, numberOneStage: no1?.stage || "waiting", status: problems ? "Perlu cek" : "OK" };
}
function runBalanceSimulator(teams, rounds = 500) {
  const sample = [];
  for (let i = 0; i < rounds; i += 1) {
    const home = pick(teams);
    let away = pick(teams);
    if (away.id === home.id) away = pick(teams.filter((t) => t.id !== home.id));
    sample.push(simulateOtherMatch(home, away, i + 1, { competition: "league", leagueKey: home.leagueKey }));
  }
  const goals = sample.reduce((sum, r) => sum + r.homeGoals + r.awayGoals, 0) / Math.max(1, sample.length);
  const draws = sample.filter((r) => r.homeGoals === r.awayGoals).length / Math.max(1, sample.length);
  const homeWins = sample.filter((r) => r.homeGoals > r.awayGoals).length / Math.max(1, sample.length);
  return { rounds, avgGoals: Math.round(goals * 100) / 100, drawRate: Math.round(draws * 100), homeWinRate: Math.round(homeWins * 100), note: goals > 4.2 ? "Skor agak tinggi" : goals < 1.5 ? "Skor agak rendah" : "Balance simulasi aman" };
}

function weeklyAiIncome(team, result) {
  const base = 1800 + Math.round((team.fans || 25000) / 32) + Math.round((team.morale || 70) * 24);
  const wage = Math.round(teamWeeklyWage(team) * 0.018);
  if (!result) return Math.round(base + rng(0, 2600) - wage);
  const isHome = result.homeId === team.id;
  const gf = isHome ? result.homeGoals : result.awayGoals;
  const ga = isHome ? result.awayGoals : result.homeGoals;
  const win = gf > ga;
  const draw = gf === ga;
  const homeGate = isHome ? Math.round((team.fans || 25000) / 12) + gf * 1200 : 0;
  const prize = (win ? 9000 : draw ? 3300 : 1200) * matchIncomeMultiplier(result.competition || "league");
  return Math.round(base + homeGate + prize + rng(0, 3200) - wage);
}
function aiPreferredPositions(team) {
  const style = team?.style || "Possession";
  if (["Possession", "Tiki Taka"].includes(style)) return ["CM", "CAM", "CDM", "RW", "LW"];
  if (style === "Counter") return ["ST", "LW", "RW", "CAM", "RB", "LB"];
  if (style === "High Press") return ["CM", "CDM", "ST", "LW", "RW"];
  if (style === "Long Ball") return ["ST", "CB", "CM", "GK"];
  if (style === "Park Bus") return ["CB", "CDM", "GK", "LB", "RB"];
  if (style === "Wing Play") return ["LW", "RW", "LB", "RB", "ST"];
  if (style === "Physical") return ["CB", "CDM", "ST", "CM"];
  return ["CAM", "LW", "RW", "ST", "CM"];
}
function recalcPlayerValue(player, teamId) {
  const value = calcMarketValue(player, teamId, player.academy);
  return { ...player, value, wage: Math.round(clamp(value * rng(35, 85) / 10000, 500, (player.overall || 60) >= 85 ? 260000 : 65000) / 100) * 100 };
}
function growOneAiPlayer(player, team, week, result) {
  let p = { ...player };
  const news = [];
  const archetype = AI_DEVELOPMENT_ARCHETYPES[team.style] || AI_DEVELOPMENT_ARCHETYPES.Possession;
  const played = result ? true : false;
  const won = result ? ((result.homeId === team.id && result.homeGoals > result.awayGoals) || (result.awayId === team.id && result.awayGoals > result.homeGoals)) : false;
  const young = p.age <= 21;
  const developing = p.age <= 24;
  const potentialGap = Math.max(0, (p.potential || p.overall) - p.overall);
  const formBoost = won ? 7 : played ? 2 : 0;
  const youthBoost = young ? archetype.youth : developing ? Math.floor(archetype.youth / 2) : 0;
  const rareBoost = p.rarePotential ? 12 : 0;
  const moraleBoost = Math.max(0, (p.morale || 70) - 65) / 4;
  const recentGrowthLock = week - (p.lastGrowthWeek || -99) < 4;
  const starLock = p.overall >= 85 && !p.rarePotential;
  const eliteLock = p.overall >= 90;
  const growthCap = young ? 42 : developing ? 22 : 8;
  const growthChance = recentGrowthLock || starLock ? 0 : clamp(4 + potentialGap * 1.35 + youthBoost + rareBoost + moraleBoost + formBoost - (p.overall >= 82 ? 10 : 0) - (eliteLock ? 28 : 0), 0, growthCap);
  if (potentialGap > 0 && roll(growthChance)) {
    const gain = p.rarePotential && young && p.overall < 84 && roll(9) ? 2 : 1;
    p.overall = clamp(p.overall + gain, 45, Math.min(p.potential || 98, p.ultraRare ? 98 : p.rarePotential ? 96 : 88));
    p.lastGrowthWeek = week;
    const focus = archetype.focus;
    p[focus] = clamp((p[focus] || p.overall) + gain + (roll(25) ? 1 : 0), 10, 99);
    if (focus !== "stamina" && roll(32)) p.stamina = clamp((p.stamina || 60) + 1, 25, 99);
    p.morale = clamp((p.morale || 70) + 1 + (won ? 1 : 0), 35, 99);
    if (gain >= 2 || p.rarePotential || p.overall >= 74) news.push({ tag: "AI Growth", icon: "📈", title: `${firstName(p.name)} naik level di ${team.name}`, body: `${p.pos} muda itu berkembang ke OVR ${p.overall}. ${team.name} sedang ${archetype.desc}.` });
  }
  if (p.age >= 32 && roll(8 + (p.age - 32) * 4)) {
    p.overall = clamp(p.overall - 1, 40, 99);
    p.pace = clamp((p.pace || 50) - 1, 20, 99);
    p.fitness = clamp((p.fitness || 100) - rng(1, 6), 35, 100);
    if (roll(12)) news.push({ tag: "Squad Age", icon: "⌛", title: `${team.name} mulai regenerasi`, body: `${firstName(p.name)} menurun tipis karena usia. Klub AI mulai butuh rotasi.` });
  }
  if (young && p.potential >= 86 && !p.rarePotential && p.overall < 82 && roll(1 + (week % 8 === 0 ? 2 : 0))) {
    p.rarePotential = true;
    p.personality = "Wonderkid Mindset";
    news.push({ tag: "Hidden Potential", icon: "🔥", title: `${firstName(p.name)} viral sebagai hidden talent`, body: `${team.name} punya ${p.pos} usia ${p.age} dengan POT ${p.potential}. Nilainya mulai naik di bursa.` });
  }
  return { player: recalcPlayerValue(p, team.id), news };
}
function aiTransferDecision(team, week) {
  const news = [];
  let next = { ...team, players: [...(team.players || [])], budget: team.budget || INITIAL_CASH };
  const average = teamPower(next);
  const preferred = aiPreferredPositions(next);
  const weakPositions = preferred.filter((pos) => {
    const best = next.players.filter((p) => COMPATIBLE[pos]?.includes(p.pos) || p.pos === pos).sort((a, b) => b.overall - a.overall)[0];
    return !best || best.overall < Math.max(68, average - 2);
  });
  const shouldAct = isTransferWindow(week) && (week % 2 === 0 || weakPositions.length >= 2 || (next.form || []).slice(-4).filter((f) => f === "L").length >= 3);
  if (!shouldAct) return { team: next, marketAdds: [], news };
  const marketAdds = [];
  if (next.players.length > 28 && roll(32)) {
    const sellable = next.players.slice().sort((a, b) => a.overall - b.overall || b.age - a.age).find((p) => p.age >= 25 || p.overall < average - 5);
    if (sellable) {
      const fee = Math.round((sellable.value || 12000) * rng(62, 86) / 100 / 500) * 500;
      next.players = next.players.filter((p) => p.id !== sellable.id);
      next.budget += fee;
      marketAdds.push({ ...sellable, sourceClub: next.name, ownerTeamId: next.id, transferListed: true, scouted: false, scoutStatus: "unknown", value: Math.round((sellable.value || fee) * 0.95 / 500) * 500 });
      news.push({ tag: "AI Transfer", icon: "💸", title: `${next.name} melepas ${firstName(sellable.name)}`, body: `${sellable.pos} OVR ${sellable.overall} masuk market. Budget AI ${next.name} naik ${money(fee)}.` });
    }
  }
  const desiredPos = weakPositions[0] || pick(preferred);
  const budget = next.budget || 0;
  const chaos = starChaos(next);
  const wagePressure = teamWeeklyWage(next) > Math.max(9000, (next.budget || 0) * 0.18);
  const buyChance = wagePressure || chaos.tooMany ? 4 : budget > 90000 ? 32 : budget > 42000 ? 17 : 5;
  if (roll(buyChance) && next.players.length < 32) {
    const tier = average < 68 ? rng(-3, 0) : average < 72 ? rng(-2, 1) : rng(-1, 2);
    let recruit = genPlayer(desiredPos, next.id, tier, false);
    const maxAffordable = Math.max(9000, Math.round(budget * rng(55, 88) / 100));
    if (recruit.value > maxAffordable && recruit.overall <= 72) recruit.value = Math.round(maxAffordable / 500) * 500;
    if (recruit.value <= budget && !(recruit.overall >= 85 && leagueInfo(next.leagueKey).level > 2)) {
      next.players.push({ ...recruit, scouted: false, scoutStatus: "unknown" });
      next.budget -= recruit.value;
      news.push({ tag: "AI Transfer", icon: "📝", title: `${next.name} rekrut ${firstName(recruit.name)}`, body: `${recruit.pos} OVR ${recruit.overall} datang untuk ${money(recruit.value)}. Transfer AI kini membuat klub lain ikut berkembang.` });
    }
  } else if (roll(15) && next.players.length < 36) {
    const kid = { ...genPlayer(desiredPos, next.id, rng(-8, -2), true), rarePotential: roll(9), academy: true };
    const fixedKid = recalcPlayerValue({ ...kid, value: Math.min(kid.value, rng(5000, 18000)) }, next.id);
    next.players.push(fixedKid);
    news.push({ tag: "Academy Watch", icon: "🌱", title: `${next.name} promosikan pemain akademi`, body: `${fixedKid.name} (${fixedKid.pos}, ${fixedKid.age} tahun) masuk skuad. Potensi tersembunyi bisa viral nanti.` });
  }
  return { team: next, marketAdds, news };
}
function maybeChangeAiTactic(team, week) {
  const recent = (team.form || []).slice(-5);
  const losses = recent.filter((f) => f === "L").length;
  const wins = recent.filter((f) => f === "W").length;
  if ((losses >= 4 || (losses >= 3 && week % 4 === 0)) && roll(45)) {
    const old = team.style;
    const candidates = AI_STYLE_POOL.filter((s) => s !== old);
    const style = pick(candidates);
    return { team: { ...team, style, transferPolicy: style }, news: [{ tag: "AI Tactics", icon: "📋", title: `${team.name} mengubah gaya main`, body: `Rentetan hasil buruk membuat AI berganti dari ${old} ke ${style}. Lawan akan terasa berbeda.` }] };
  }
  if (wins >= 4 && roll(18)) {
    return { team: { ...team, morale: clamp((team.morale || 70) + 3, 35, 99) }, news: [{ tag: "Form Team", icon: "🚀", title: `${team.name} sedang on fire`, body: `Form bagus membuat moral naik. Power klub AI bisa meningkat dari pekan ke pekan.` }] };
  }
  return { team, news: [] };
}
function simulateAIClubGrowth(teams, week, results = []) {
  const resultByTeam = new Map();
  (results || []).forEach((r) => { resultByTeam.set(r.homeId, r); resultByTeam.set(r.awayId, r); });
  const marketAdds = [];
  const allNews = [];
  const evolved = teams.map((team) => {
    if (team.id === MY_TEAM_ID) return team;
    const result = resultByTeam.get(team.id);
    const income = weeklyAiIncome(team, result) + cupBonusForWeek(week, team, result || {}) + competitionPrizeForResult(result, team.id);
    const chaos = starChaos(team);
    let next = { ...team, budget: clamp(Math.round(((team.budget || INITIAL_CASH) + income) / 500) * 500, -50000, maxAiBudgetForLeague(team.leagueKey)), wagePressure: Math.round(teamWeeklyWage(team)), morale: clamp((team.morale || 70) - (chaos.tooMany ? 2 : 0), 25, 99) };
    if (chaos.tooMany && week % 4 === 0) allNews.push({ id: `${week}-${team.id}-chaos`, week, teamId: team.id, tag: "Star Chaos", icon: "💥", title: `${team.name} mulai berantakan`, body: `Terlalu banyak pemain 85+/90+ membuat ruang ganti panas. Power tak otomatis OP.` });
    const playerNews = [];
    next.players = (next.players || []).map((p) => {
      const grown = growOneAiPlayer(p, next, week, result);
      playerNews.push(...grown.news);
      return grown.player;
    }).sort((a, b) => b.overall - a.overall || b.potential - a.potential);
    const transfer = aiTransferDecision(next, week);
    next = transfer.team;
    marketAdds.push(...transfer.marketAdds);
    const tactic = maybeChangeAiTactic(next, week);
    next = tactic.team;
    const teamNews = [...playerNews, ...transfer.news, ...tactic.news].slice(0, 4);
    if (teamNews.length || week % 5 === 0) {
      next.aiNews = [...teamNews, ...(next.aiNews || [])].slice(0, 8);
      next.growthScore = Math.round((next.growthScore || 0) + teamNews.length + Math.max(0, teamPower(next) - 70) / 8);
    }
    allNews.push(...teamNews.map((n) => ({ id: `${week}-${next.id}-${Math.random().toString(36).slice(2)}`, week, teamId: next.id, ...n })));
    return next;
  });
  return { teams: evolved, marketAdds, news: allNews.slice(0, 18) };
}

function homeIncome(team, result, rank, facilities) {
  const base = Math.round(team.fans * (1.25 + facilities.stadium * 0.18));
  const rankBonus = Math.max(0, 34 - rank) * 1900;
  const goalBonus = result.homeGoals * 16000;
  const winBonus = result.homeGoals > result.awayGoals ? 54000 : result.homeGoals === result.awayGoals ? 17000 : 0;
  const derbyBonus = result.derby ? 65000 : 0;
  const merch = result.homeGoals > result.awayGoals ? facilities.merchandise * 14000 : 0;
  const sponsor = facilities.sponsor * 9500;
  return base + rankBonus + goalBonus + winBonus + derbyBonus + merch + sponsor;
}
function makeObjectives(myTeam, teams) {
  const rival = teams.find((t) => t.id === myTeam.rivalId);
  return [
    { key: "top8", title: "Finish Top 8", desc: "Akhiri musim di posisi 8 besar.", reward: 260000, type: "rank", target: 8, done: false },
    { key: "goals35", title: "Cetak 35 Gol", desc: "Total gol liga minimal 35.", reward: 190000, type: "goals", target: 35, done: false },
    { key: "home5", title: "Menang 5 Laga Home", desc: "Menang kandang 5 kali.", reward: 210000, type: "homeWins", target: 5, done: false },
    { key: "derby", title: `Menang Derby vs ${rival?.name || "Rival"}`, desc: "Kalahkan rival minimal sekali.", reward: 240000, type: "derbyWins", target: 1, done: false },
    { key: "youth", title: "Bangun Masa Depan", desc: "Kembangkan 3 pemain muda/akademi.", reward: 180000, type: "youthDeveloped", target: 3, done: false },
  ];
}
function objectiveProgress(obj, ctx) {
  if (obj.type === "rank") return Math.max(0, obj.target - ctx.rank + 1);
  return ctx.stats[obj.type] || 0;
}
function objectiveComplete(obj, ctx) {
  if (obj.type === "rank") return ctx.rank <= obj.target;
  return (ctx.stats[obj.type] || 0) >= obj.target;
}

function developmentFocusForPlan(plan, pos) {
  if (plan === "finishing" || plan === "shooting") return "shoot";
  if (plan === "passing") return "pass";
  if (plan === "defense") return ["GK", "CB", "LB", "RB", "CDM"].includes(pos) ? "defend" : "stamina";
  if (plan === "pressing") return "stamina";
  if (plan === "youth") return "dribble";
  return ["ST", "LW", "RW"].includes(pos) ? "shoot" : ["CM", "CAM", "CDM"].includes(pos) ? "pass" : ["GK", "CB", "LB", "RB"].includes(pos) ? "defend" : "stamina";
}
function addPlayerXP(player, amount, focus, week, forceLabel = "Latihan") {
  let p = { ...player, xp: Math.min(999, (player.xp || 0) + amount), lastDevWeek: week };
  const news = [];
  if (p.xp >= 100) {
    p.xp -= 100;
    p.level = (p.level || 1) + 1;
    const maxOverall = Math.min(p.potential || 98, p.ultraRare ? 98 : p.rarePotential ? 96 : 88);
    const canOverall = p.overall < maxOverall;
    if (canOverall) p.overall = clamp(p.overall + 1, 45, maxOverall);
    p[focus] = clamp((p[focus] || p.overall) + 1 + (p.age <= 21 && roll(25) ? 1 : 0), 10, 99);
    if (focus !== "stamina" && roll(35)) p.stamina = clamp((p.stamina || 60) + 1, 25, 99);
    p.value = calcMarketValue(p, p.teamId || MY_TEAM_ID, p.academy);
    p.wage = Math.round(clamp(p.value * rng(30, 70) / 10000, 500, p.overall >= 85 ? 240000 : 65000) / 100) * 100;
    news.push({ tag: forceLabel, icon: p.age <= 21 ? "🌱" : "📈", title: `${firstName(p.name)} naik level`, body: `${p.pos} berkembang ke OVR ${p.overall}. Fokus ${focus.toUpperCase()} ikut naik.` });
  }
  return { player: p, news };
}
function processWeeklyDevelopmentForUserTeam(teams, week, trainingPlan, facilities) {
  const allNews = [];
  let youthDeveloped = 0;
  const trainingLv = facilities?.training || 1;
  const academyLv = facilities?.academy || 1;
  const updated = teams.map((team) => {
    if (team.id !== MY_TEAM_ID) return team;
    const players = (team.players || []).map((player) => {
      if (player.lastDevWeek === week) return player;
      const focus = developmentFocusForPlan(trainingPlan, player.pos);
      const youth = player.age <= 21;
      const base = 7 + trainingLv * 5 + (trainingPlan === "balanced" ? 2 : 0);
      const youthBoost = youth ? 6 + academyLv * 5 + (trainingPlan === "youth" ? 10 : 0) : 0;
      const moraleBoost = Math.max(0, (player.morale || 70) - 68) / 5;
      let amount = Math.round(base + youthBoost + moraleBoost + rng(0, trainingLv * 3));
      const academyBreakthrough = youth && player.academy && roll(5 + academyLv * 4);
      if (academyBreakthrough) amount += rng(16, 34) + academyLv * 5;
      const grown = addPlayerXP(player, amount, focus, week, youth ? "Youth Growth" : "Training Ground");
      if (academyBreakthrough) {
        grown.player.lastYouthBreakthroughWeek = week;
        grown.player.morale = clamp((grown.player.morale || 70) + 4, 35, 99);
        grown.news.push({ tag: "Youth Berprestasi", icon: "🌟", title: `${firstName(player.name)} menonjol di akademi`, body: `Akademi Lv ${academyLv} memberi bonus XP besar. Pemain muda bisa lebih cepat naik level dan masuk radar transfer.` });
      }
      if (grown.news.length && youth) youthDeveloped += 1;
      allNews.push(...grown.news);
      return grown.player;
    }).sort((a, b) => b.overall - a.overall || b.potential - a.potential);
    return { ...team, players };
  });
  return { teams: updated, news: allNews.slice(0, 8), youthDeveloped };
}
function processYouthAcademyRefresh(teams, week, season = 1, academyLevel = 1) {
  if (week <= 0 || week % 20 !== 0) return { teams, news: [] };
  const news = [];
  const updated = (teams || []).map((team) => {
    if (team.id !== MY_TEAM_ID) return team;
    const protectedAcademy = [];
    const seniorAndOther = [];
    (team.players || []).forEach((p) => {
      if (!p.academy) { seniorAndOther.push(p); return; }
      const keepBecauseProtected = p.listedForSale || p.listedForLoan || p.pendingOffer || p.pendingSquadAction;
      if (keepBecauseProtected) protectedAcademy.push(p);
    });
    const freshCount = Math.max(6, 6 + Math.min(2, Math.floor((academyLevel || 1) / 2)));
    const fresh = makeAcademyIntake(team, season, academyLevel, freshCount).map((p) => ({
      ...p,
      intakeWeek: week,
      sourceClub: `${team.name} Academy Intake W${week}`,
      listedForSale: false,
      listedForLoan: false,
      pendingOffer: null,
      pendingSquadAction: null,
      xp: 0,
      level: 1,
    }));
    news.push({
      id: `academy-refresh-${season}-${week}`,
      season,
      week,
      tag: "Youth Refresh",
      icon: "🌱",
      title: `Akademi membuka intake fresh pekan ${week}`,
      body: `${fresh.length} pemain akademi baru masuk. Pemain yang sudah senior, sedang ditandai jual, ditandai loan, punya offer, atau menunggu promosi tetap aman dan tidak dihapus.`,
    });
    return { ...team, players: [...seniorAndOther, ...protectedAcademy, ...fresh].sort((a, b) => Number(a.academy) - Number(b.academy) || b.overall - a.overall || b.potential - a.potential) };
  });
  return { teams: updated, news };
}
function processLoanReturns(teams, week) {
  const returningToUser = [];
  const returningToOwners = [];
  const stripped = teams.map((team) => {
    const keep = [];
    (team.players || []).forEach((p) => {
      if (team.id !== MY_TEAM_ID && p.loanOriginId === MY_TEAM_ID && p.loanReturnWeek <= week) {
        returningToUser.push({ ...p, teamId: MY_TEAM_ID, loan: false, loanedOut: false, loanOriginId: null, loanReturnWeek: null, loanClubName: null, listedForLoan: false, pendingOffer: null });
      } else if (team.id === MY_TEAM_ID && p.loan && p.loanReturnWeek && p.loanReturnWeek <= week) {
        returningToOwners.push({ ...p, teamId: p.ownerTeamId || null, loan: false, loanReturnWeek: null, loanClubName: null, pendingOffer: null });
      } else keep.push(p);
    });
    return keep.length === (team.players || []).length ? team : { ...team, players: keep };
  });
  let next = stripped;
  if (returningToUser.length) {
    next = next.map((team) => team.id === MY_TEAM_ID ? { ...team, players: [...team.players, ...returningToUser].sort((a, b) => b.overall - a.overall) } : team);
  }
  if (returningToOwners.length) {
    next = next.map((team) => {
      const owned = returningToOwners.filter((p) => p.ownerTeamId && p.ownerTeamId === team.id).map((p) => ({ ...p, teamId: team.id, ownerTeamId: null, sourceClub: team.name }));
      return owned.length ? { ...team, players: [...team.players, ...owned].sort((a, b) => b.overall - a.overall) } : team;
    });
  }
  const freeAgents = returningToOwners.filter((p) => !p.ownerTeamId).map((p) => makeFreeAgent(p, "Kontrak sementara selesai"));
  const news = [
    ...returningToUser.map((p) => ({ tag: "Loan Return", icon: "🔁", title: `${p.name} kembali dari pinjaman`, body: `${p.pos} sudah kembali ke skuad utama setelah masa loan selesai.` })),
    ...returningToOwners.map((p) => ({ tag: "Loan End", icon: "⏳", title: `${p.name} selesai masa pinjaman`, body: `${p.pos} tidak lagi tersedia di skuad utama setelah kontrak/pinjaman selesai.` })),
  ];
  return { teams: next, news, marketAdds: freeAgents };
}

function processIncomingUserTransfers(teams, pendingTransfers = [], weekToProcess = 1) {
  if (!pendingTransfers?.length) return { teams, remaining: [], completed: [], news: [] };
  const completed = pendingTransfers.filter((t) => (t.dueWeek || 999) <= weekToProcess);
  const remaining = pendingTransfers.filter((t) => (t.dueWeek || 999) > weekToProcess);
  if (!completed.length) return { teams, remaining, completed: [], news: [] };
  const arrivals = completed.map((t) => recalcPlayerValue({
    ...(t.player || {}),
    teamId: MY_TEAM_ID,
    ownerTeamId: t.type === "loan" ? (t.ownerTeamId ?? t.player?.ownerTeamId ?? null) : null,
    sourceClub: t.type === "loan" ? (t.sourceClub || t.player?.sourceClub || "Scout Network") : "Transfer masuk",
    academy: false,
    pendingArrival: null,
    scouted: true,
    scoutStatus: t.player?.rarePotential ? "gem" : "normal",
    loan: t.type === "loan",
    loanWeeks: t.type === "loan" ? t.weeks : undefined,
    loanReturnWeek: t.type === "loan" ? (t.loanReturnWeek || (weekToProcess + (t.weeks || 15) - 1)) : null,
    listedForSale: false,
    listedForLoan: false,
    pendingOffer: null,
    contract: t.type === "loan" ? 1 : Math.max(1, t.player?.contract || 2),
  }, MY_TEAM_ID));
  const arrivalIds = new Set(arrivals.map((p) => p.id));
  const nextTeams = teams.map((team) => team.id === MY_TEAM_ID
    ? { ...team, players: [...(team.players || []).filter((p) => !arrivalIds.has(p.id)), ...arrivals].sort((a, b) => b.overall - a.overall) }
    : team);
  const news = arrivals.map((p) => ({
    id: `arrival-${p.id}-${weekToProcess}`,
    week: weekToProcess,
    tag: p.loan ? "Loan Arrival" : "Transfer Arrival",
    icon: p.loan ? "🤝" : "🛒",
    title: `${p.name} resmi tersedia di skuad`,
    body: `${p.pos} OVR ${p.overall} baru bisa dipakai mulai pekan ${weekToProcess}. Transfer/loan sengaja ditunda 1 pekan agar tidak langsung masuk match yang sama.`,
  }));
  return { teams: nextTeams, remaining, completed: arrivals, news };
}
function processPendingUserSquadActions(teams, week, ctx = {}) {
  const managerCtx = ctx.manager || { boardTrust: 70, fanTrust: 70 };
  const academyLv = ctx.facilities?.academy || 1;
  let cashDelta = 0;
  let marketAdds = [];
  const news = [];
  const cashStart = Number(ctx.cash || 0);
  const updated = teams.map((team) => {
    if (team.id !== MY_TEAM_ID) return team;
    let rosterCount = seniorPlayers(team).length;
    const players = [];
    (team.players || []).forEach((p) => {
      const pending = p.pendingSquadAction;
      if (!pending || (pending.dueWeek || week + 1) > week) { players.push(p); return; }
      if (pending.type === "extend") {
        const offerWage = pending.offerWage || Math.round((p.wage || 500) * 1.25 / 100) * 100;
        const years = pending.years || rng(1, 3);
        const acceptChance = clamp(72 + ((managerCtx.boardTrust || 70) - 60) * 0.35 + ((p.morale || 70) - 60) * 0.18 - ((p.overall || 70) >= 85 ? 18 : 0) - ((p.contract || 0) <= 0 ? 8 : 0), 16, 94);
        if (roll(acceptChance)) {
          players.push({ ...p, pendingSquadAction: null, contract: Math.min(5, Math.max(0, p.contract || 0) + years), wage: offerWage, morale: clamp((p.morale || 70) + 2, 35, 99) });
          news.push({ tag: "Kontrak", icon: "📄", title: `${p.name} menerima perpanjangan`, body: `Kontrak +${years} tahun, gaji baru ${money(offerWage)}/pekan. Diproses setelah 1 pekan.` });
        } else {
          players.push({ ...p, pendingSquadAction: null, morale: clamp((p.morale || 70) - 3, 35, 99) });
          news.push({ tag: "Kontrak", icon: "📄", title: `${p.name} menolak perpanjangan`, body: `Agen menilai offer belum cocok. Coba lagi dengan momentum klub lebih baik.` });
        }
        return;
      }
      if (pending.type === "promoteYouth") {
        const signingFee = pending.signingFee || 35000;
        if (!p.academy) {
          players.push({ ...p, pendingSquadAction: null });
          return;
        }
        if (rosterCount >= 38) {
          players.push({ ...p, pendingSquadAction: null });
          news.push({ tag: "Youth Promotion", icon: "⚠️", title: `Promosi ${p.name} gagal`, body: `Skuad utama sudah penuh. Maksimal 38 pemain senior.` });
        } else if (cashStart + cashDelta >= signingFee) {
          cashDelta -= signingFee;
          rosterCount += 1;
          players.push(recalcPlayerValue({ ...p, academy: false, pendingSquadAction: null, scouted: true, sourceClub: team.name, contract: Math.max(1, p.contract || 1), wage: Math.max(p.wage || 500, Math.round(signingFee * 0.08 / 100) * 100), morale: clamp((p.morale || 70) + 5, 35, 99) }, MY_TEAM_ID));
          news.push({ tag: "Youth Promotion", icon: "🌱", title: `${p.name} resmi naik ke skuad utama`, body: `Promosi diproses setelah 1 pekan. Signing fee ${money(signingFee)}, gaji awal ${money(Math.max(p.wage || 500, Math.round(signingFee * 0.08 / 100) * 100))}/pekan.` });
        } else {
          players.push({ ...p, pendingSquadAction: null });
          news.push({ tag: "Youth Promotion", icon: "⚠️", title: `Promosi ${p.name} gagal`, body: `Kas tidak cukup saat pekan diproses. Butuh ${money(signingFee)}.` });
        }
        return;
      }
      if (pending.type === "checkPotential") {
        const cost = pending.cost || (12000 + academyLv * 2500);
        if (cashStart + cashDelta >= cost) {
          cashDelta -= cost;
          players.push({ ...p, pendingSquadAction: null, scouted: true, scoutStatus: p.rarePotential ? "gem" : "normal" });
          news.push({ tag: "Scout Potensi", icon: p.rarePotential ? "🌟" : "🔎", title: `Potensi ${p.name} selesai dicek`, body: `${p.pos} OVR ${p.overall}, POT ${p.potential}. Biaya ${money(cost)}.` });
        } else {
          players.push({ ...p, pendingSquadAction: null });
          news.push({ tag: "Scout Potensi", icon: "⚠️", title: `Cek potensi ${p.name} gagal`, body: `Kas tidak cukup saat pekan diproses. Butuh ${money(cost)}.` });
        }
        return;
      }
      if (pending.type === "kick") {
        if (rosterCount <= 18) {
          players.push({ ...p, pendingSquadAction: null });
          news.push({ tag: "Skuad", icon: "🚫", title: `${p.name} batal di-kick`, body: `Minimal skuad 18 pemain. Aksi dibatalkan saat pekan diproses.` });
        } else {
          rosterCount -= 1;
          marketAdds.push(freeAgentFromPlayer(p, "Free Agent"));
          news.push({ tag: "Free Agent", icon: "🚪", title: `${p.name} keluar dari skuad`, body: `Kick diproses setelah 1 pekan dan pemain masuk Transfer sebagai free agent.` });
        }
        return;
      }
      players.push({ ...p, pendingSquadAction: null });
    });
    return { ...team, players: players.sort((a, b) => b.overall - a.overall || b.potential - a.potential) };
  });
  return { teams: updated, cashDelta, marketAdds, news };
}

function processUserTransferOffers(teams, week) {
  const buyers = teams.filter((t) => t.id !== MY_TEAM_ID);
  const news = [];
  const updated = teams.map((team) => {
    if (team.id !== MY_TEAM_ID) return team;
    const players = (team.players || []).map((p) => {
      if (p.pendingOffer || (!p.listedForSale && !p.listedForLoan) || p.lastOfferWeek === week) return p;
      const chance = (p.listedForSale ? 36 : 0) + (p.listedForLoan ? 34 : 0) + Math.max(0, 84 - (p.overall || 70)) * 0.28;
      if (!roll(chance)) return { ...p, lastOfferWeek: week };
      const club = buyers[Math.abs((week * 97 + p.id * 13)) % Math.max(1, buyers.length)];
      const type = p.listedForSale && p.listedForLoan ? (roll(55) ? "sale" : "loan") : p.listedForSale ? "sale" : "loan";
      const loanWeeks = [3, 15, 30][(week + p.id) % 3];
      const baseAmount = type === "sale" ? Math.round((p.value || 5000) * rng(64, 112) / 100 / 500) * 500 : Math.round((p.value || 5000) * ({ 3: 0.05, 15: 0.13, 30: 0.22 }[loanWeeks]) / 500) * 500;
      const offer = { id: `${week}-${p.id}-${club.id}`, type, clubId: club.id, clubName: club.name, amount: Math.max(500, baseAmount), weeks: loanWeeks, countered: false };
      news.push({ tag: "Offer Masuk", icon: type === "loan" ? "🤝" : "💰", title: `${club.name} menawar ${firstName(p.name)}`, body: `${type === "loan" ? `Loan ${loanWeeks} pekan` : "Transfer permanen"} senilai ${money(offer.amount)}. Putuskan di menu Skuad.` });
      return { ...p, pendingOffer: offer, lastOfferWeek: week };
    });
    return { ...team, players };
  });
  return { teams: updated, news };
}
function freeAgentFromPlayer(player, sourceClub = "Free Agent") {
  return { ...player, teamId: null, ownerTeamId: null, sourceClub, freeAgent: true, listedForSale: false, listedForLoan: false, pendingOffer: null, scouted: true, userListed: false, value: Math.round((player.value || 5000) * 0.65 / 500) * 500 };
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return <div className="fatal"><h1>Aplikasi gagal render</h1><p>Salin error ini kalau masih terjadi.</p><pre>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre></div>;
    }
    return this.props.children;
  }
}
export default function App() { return <ErrorBoundary><FootballManager /></ErrorBoundary>; }

function FootballManager() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [week, setWeek] = useState(1);
  const [season, setSeason] = useState(1);
  const [fixtureCalendar, setFixtureCalendar] = useState(() => buildLeagueFixtures(INITIAL_TEAMS, 1));
  const [competitionState, setCompetitionState] = useState(() => initialCompetitionState(1));
  const [seasonHistory, setSeasonHistory] = useState([]);
  const [debugReport, setDebugReport] = useState(null);
  const [cash, setCash] = useState(INITIAL_CASH);
  const [formation, setFormation] = useState("4-3-3");
  const [trainingPlan, setTrainingPlan] = useState("balanced");
  const [facilities, setFacilities] = useState({ stadium: 1, training: 1, academy: 1, medical: 1, merchandise: 1, sponsor: 1 });
  const [seasonStats, setSeasonStats] = useState({ homeWins: 0, derbyWins: 0, goals: 0, youthDeveloped: 0 });
  const [claimed, setClaimed] = useState([]);
  const [market, setMarket] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [active, setActive] = useState(null);
  const [preMatch, setPreMatch] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [log, setLog] = useState([]);
  const [notice, setNotice] = useState(null);
  const [aiPaused, setAiPaused] = useState(false);
  const [lineupOverrides, setLineupOverrides] = useState({});
  const [scoutQueue, setScoutQueue] = useState([]);
  const [scoutUsed, setScoutUsed] = useState(0);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [transferActionWeek, setTransferActionWeek] = useState(null);
  const [manager, setManager] = useState({ name: "Coach Arjuna", reputation: 1, boardTrust: 70, fanTrust: 70 });
  const [storyLog, setStoryLog] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [competition, setCompetition] = useState("managerWorld");
  const [tutorialActive, setTutorialActive] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [friendlyActive, setFriendlyActive] = useState(null);
  const [helpMode, setHelpMode] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState("Normal");
  const [selectedClubId, setSelectedClubId] = useState(MY_TEAM_ID);
  const [selectedCoachKey, setSelectedCoachKey] = useState("balanced");
  const [worldNews, setWorldNews] = useState([]);
  const [lanOpen, setLanOpen] = useState(false);

  const sorted = useMemo(() => [...teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf), [teams]);
  const myTeam = teams.find((t) => t.id === MY_TEAM_ID);
  const leagueTables = useMemo(() => groupedLeagueTables(teams), [teams]);
  const myLeagueSorted = useMemo(() => sortLeagueTeams(teams, myTeam?.leagueKey), [teams, myTeam?.leagueKey]);
  const myRank = myLeagueSorted.findIndex((t) => t.id === MY_TEAM_ID) + 1;
  const fixtures = fixtureCalendar[week - 1] || [];
  const weekUserFixtures = useMemo(() => userFixturesForWeek(competitionState, fixtureCalendar, teams, week, season).filter((f) => !fixtureAlreadyPlayed(log, f)), [competitionState, fixtureCalendar, teams, week, season, log]);
  const compFixture = weekUserFixtures.find((m) => (m.competition || "league") !== "league") || null;
  const myFixture = weekUserFixtures[0] || null;
  const objectives = useMemo(() => makeObjectives(myTeam, teams), [myTeam, teams]);
  const objectiveCtx = useMemo(() => ({ rank: myRank, stats: { ...seasonStats, goals: myTeam.gf } }), [myRank, seasonStats, myTeam.gf]);

  useEffect(() => {
    setMarket(makeTransferMarket(INITIAL_TEAMS, facilities.academy || 1));
  }, []);

  const notify = useCallback((text, type = "info") => {
    setNotice({ text, type });
    window.setTimeout(() => setNotice(null), 3200);
  }, []);

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      if (q.get("lanRoom")) setLanOpen(true);
    } catch {}
  }, []);

  const currentSavePayload = useCallback(() => ({
    competition, teams, week, season, fixtureCalendar, competitionState, seasonHistory, cash, formation, trainingPlan, facilities, seasonStats, claimed, market, log, manager, storyLog, worldNews, lineupOverrides, scoutQueue, pendingTransfers, transferActionWeek, helpMode, aiDifficulty, selectedClubId, selectedCoachKey,
  }), [aiDifficulty, cash, claimed, competition, facilities, formation, helpMode, lineupOverrides, log, manager, market, pendingTransfers, scoutQueue, seasonStats, storyLog, transferActionWeek, worldNews, teams, trainingPlan, week, selectedClubId, selectedCoachKey]);

  useEffect(() => {
    if (!gameStarted || !myTeam) return;
    if (academyPlayers(myTeam).length > 0) return;
    setTeams((prev) => ensureUserAcademyInTeams(prev, season, facilities.academy || 1, 6));
    setWorldNews((prev) => [{ id: `academy-auto-${Date.now()}`, week, tag: "Youth Intake", icon: "🌱", title: "Akademi membuka intake baru", body: "Sistem menambahkan pemain akademi otomatis agar menu Youth punya tombol Panggil ke Skuad Utama, Cek Potensi, Loan, dan Jual." }, ...prev].slice(0, 80));
    notify("Akademi kamu belum punya pemain. Sistem menambahkan 6 youth academy agar tombol Panggil ke Skuad Utama muncul.", "success");
  }, [facilities.academy, gameStarted, myTeam, notify, season, week]);

  const applyLoadedData = useCallback((data, source = "save") => {
    if (!data?.teams || !Array.isArray(data.teams)) { notify("File save tidak valid.", "error"); return; }
    setCompetition("managerWorld");
    const loadedFacilities = { ...defaultFacilities(), ...(data.facilities || {}) };
    const loadedSeason = data.season || 1;
    const migratedTeams = ensureUserAcademyInTeams(data.teams, loadedSeason, loadedFacilities.academy || 1, 6);
    const hadNoAcademy = !academyPlayers((data.teams || []).find((t) => t.id === MY_TEAM_ID)).length;
    setTeams(migratedTeams); setWeek(data.week || 1); setSeason(loadedSeason); setFixtureCalendar(data.fixtureCalendar || buildLeagueFixtures(migratedTeams, loadedSeason)); setCompetitionState(data.competitionState || initialCompetitionState(loadedSeason)); setSeasonHistory(data.seasonHistory || []); setCash(Number(data.cash ?? INITIAL_CASH)); setFormation(data.formation || "4-3-3");
    setTrainingPlan(data.trainingPlan || "balanced"); setFacilities(loadedFacilities);
    setSeasonStats({ ...defaultSeasonStats(), ...(data.seasonStats || {}) }); setClaimed(data.claimed || []);
    setMarket(data.market ? cleanMarket(data.market, migratedTeams) : makeTransferMarket(migratedTeams, loadedFacilities.academy || 1)); setLog(data.log || []); setManager(data.manager || { name: "Coach Arjuna", reputation: 1, boardTrust: 70, fanTrust: 70 });
    setStoryLog(data.storyLog || []); setWorldNews(hadNoAcademy ? [{ id: `academy-migration-${Date.now()}`, week: data.week || 1, tag: "Youth Intake", icon: "🌱", title: "Akademi membuka intake baru", body: "Save lama tidak punya pemain akademi. Sistem baru otomatis menambahkan youth academy agar tombol Panggil ke Skuad Utama muncul." }, ...(data.worldNews || [])].slice(0, 80) : (data.worldNews || [])); setLineupOverrides(data.lineupOverrides || {}); setHelpMode(Boolean(data.helpMode)); setAiDifficulty(data.aiDifficulty || "Normal");
    setSelectedClubId(data.selectedClubId || MY_TEAM_ID); setSelectedCoachKey(data.selectedCoachKey || "balanced"); setPendingTransfers(data.pendingTransfers || []); setTransferActionWeek(data.transferActionWeek || null);
    setScoutQueue(data.scoutQueue || []); setScoutUsed(0); setActive(null); setPreMatch(null); setSelectedId(null); setSelectedPlayer(null); setGameStarted(true); setTab("dashboard");
    notify(`${source === "file" ? "Save file" : "Save manual"} berhasil dimuat${data.migratedFrom && data.migratedFrom !== SAVE_VERSION ? ` + dimigrasikan dari v${data.migratedFrom}` : ""}.`, "success");
  }, [notify]);

  const startNewCareer = useCallback(() => {
    const rawTeams = buildClubs();
    const freshTeams = applyUserClubChoice(rawTeams, selectedClubId);
    setCompetition("managerWorld"); setTeams(freshTeams); setWeek(1); setSeason(1); setFixtureCalendar(buildLeagueFixtures(freshTeams, 1)); setCompetitionState(initialCompetitionState(1)); setSeasonHistory([]); setCash(INITIAL_CASH); setFormation("4-3-3"); setTrainingPlan("balanced");
    setFacilities({ stadium: 1, training: 1, academy: 1, medical: 1, merchandise: 1, sponsor: 1 });
    setSeasonStats({ homeWins: 0, derbyWins: 0, goals: 0, youthDeveloped: 0 }); setClaimed([]); setMarket(makeTransferMarket(freshTeams, 1)); setLog([]);
    setManager(managerFromPreset(selectedCoachKey)); setStoryLog([{ id: `welcome-${Date.now()}`, week: 1, title: `Media menyambut ${managerFromPreset(selectedCoachKey).name}`, choices: ["Jawab tenang", "Janji sepak bola menyerang", "Fokus ke perkembangan skuad"] }]); setWorldNews([{ id: `world-${Date.now()}`, week: 1, tag: "World Start", icon: "🌍", title: "Semua klub mulai fair", body: "Rata-rata skuad dibuat sekitar 70. AI club growth akan membuat klub lain latihan, transfer, ubah taktik, dan menemukan hidden talent setiap pekan." }]); setLineupOverrides({});
    setScoutQueue([]); setScoutUsed(0); setPendingTransfers([]); setTransferActionWeek(null); setActive(null); setPreMatch(null); setSelectedId(null); setSelectedPlayer(null); setTab("dashboard"); setGameStarted(true);
    const chosen = freshTeams.find((t) => t.id === MY_TEAM_ID);
    notify(`Career baru: ${chosen?.name || "Klub"}, coach ${managerFromPreset(selectedCoachKey).name}. Mode bantuan ${helpMode ? "aktif" : "mati"}, AI ${aiDifficulty}.`, "success");
  }, [aiDifficulty, competition, helpMode, notify, selectedClubId, selectedCoachKey]);

  const startTutorial = useCallback(() => {
    const demoTeams = buildClubs().slice(0, 2);
    demoTeams[0] = { ...demoTeams[0], id: MY_TEAM_ID, name: "Tutorial FC", style: "Possession", preferredFormation: "4-3-3" };
    demoTeams[1] = { ...demoTeams[1], id: 999, name: "AI Training XI", style: "Park Bus", preferredFormation: "4-4-2" };
    const game = createMatch({ homeTeam: demoTeams[0], awayTeam: demoTeams[1], userSide: "home", userFormation: "4-3-3", trainingPlan: "passing", facilities: { stadium: 1, training: 1, academy: 1, medical: 3, merchandise: 1, sponsor: 1 }, lineupOverrides: {}, aiDifficulty: "Easy", helpMode: true, friendly: true });
    game.tutorial = true;
    game.maxActions = 999;
    game.history = [{ minute: 1, icon: "🎓", text: "Tutorial dimulai. Coba pilih pemain, buka ruang, oper, lalu masuk zona tembak." }];
    setTutorialActive({ week: 0, fixture: null, game });
    setTutorialStep(0);
    setSelectedId(game.ballOwnerId);
    notify("Tutorial interaktif dibuka. Kamu bisa mencoba langsung tanpa membuat career.", "success");
  }, [notify]);

  const doTutorialAction = useCallback((action) => {
    setTutorialActive((prev) => {
      if (!prev?.game) return prev;
      if (prev.game.ended && action.type !== "resumeGoal") return prev;
      if (action.type !== "resumeGoal" && action.type !== "card" && prev.game.turn !== prev.game.userSide) return prev;
      const game = applyAction(prev.game, action);
      if (game.tutorial && !game.ended && !game.goalPause && game.turn !== game.userSide) {
        game.turn = game.userSide;
        game.ap = MAX_AP;
        appendLog(game, "🎓", "Tutorial: giliran dikembalikan ke kamu agar bisa terus mencoba kontrol pemain.");
      }
      return { ...prev, game };
    });
  }, []);

  const startFriendly = useCallback(() => {
    const demoTeams = buildClubs().slice(0, 2);
    demoTeams[0] = { ...demoTeams[0], id: MY_TEAM_ID, name: "Friendly XI", style: myTeam?.style || "Possession", preferredFormation: formation };
    demoTeams[1] = { ...demoTeams[1], id: 998, name: "Sparring Club", style: "Counter", preferredFormation: "4-2-3-1" };
    const game = createMatch({ homeTeam: demoTeams[0], awayTeam: demoTeams[1], userSide: "home", userFormation: formation, trainingPlan, facilities, lineupOverrides: {}, aiDifficulty, helpMode, friendly: true });
    game.maxActions = 46;
    game.history = [{ minute: 1, icon: "🤝", text: `Friendly dimulai. AI ${aiDifficulty}. Hasil tidak memengaruhi career.` }];
    setFriendlyActive({ week: 0, fixture: null, game });
    setSelectedId(game.ballOwnerId);
    notify("Friendly/Quick Match dibuka. Ini latihan bebas tanpa memengaruhi career.", "success");
  }, [aiDifficulty, facilities, formation, helpMode, myTeam?.style, notify]);

  const importSaveFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { applyLoadedData(migrateSave(JSON.parse(String(reader.result || "{}"))), "file"); }
      catch { notify("Gagal membaca file save JSON.", "error"); }
    };
    reader.onerror = () => notify("Gagal membuka file save.", "error");
    reader.readAsText(file);
  }, [applyLoadedData, notify]);

  const advanceIdleWeek = useCallback(() => {
    if (!gameStarted || active) return;
    let compState = ensureNumberOneState(competitionState, teams, week, season);
    const leagueFixtures = fixtureCalendar[week - 1] || [];
    const leagueResults = leagueFixtures.map((m) => simulateOtherMatch(teams.find((t) => t.id === m.homeId), teams.find((t) => t.id === m.awayId), week, m));
    const compResults = simulateCompetitionFixturesForWeek(compState, teams, week, null);
    const allResults = [...leagueResults, ...compResults];
    const teamsAfterResults = allResults.reduce((acc, result) => applyResult(acc, result), teams);
    compState = updateNumberOneState(compState, teamsAfterResults, week, compResults, season);
    const growth = simulateAIClubGrowth(teamsAfterResults, week, allResults);
    let nextTeams = growth.teams;
    const returns = processLoanReturns(nextTeams, week);
    nextTeams = returns.teams;
    const pendingSquad = processPendingUserSquadActions(nextTeams, week + 1, { cash, manager, facilities });
    nextTeams = pendingSquad.teams;
    if (pendingSquad.cashDelta) setCash((c) => c + pendingSquad.cashDelta);
    const dev = processWeeklyDevelopmentForUserTeam(nextTeams, week, trainingPlan, facilities);
    nextTeams = dev.teams;
    const offers = processUserTransferOffers(nextTeams, week);
    nextTeams = offers.teams;
    const academyRefresh = processYouthAcademyRefresh(nextTeams, week, season, facilities.academy || 1);
    nextTeams = academyRefresh.teams;
    const incoming = processIncomingUserTransfers(nextTeams, pendingTransfers, week + 1);
    nextTeams = incoming.teams;
    setPendingTransfers(incoming.remaining);
    if (dev.youthDeveloped) setSeasonStats((ss) => ({ ...ss, youthDeveloped: ss.youthDeveloped + dev.youthDeveloped }));
    let nextWeek = week + 1;
    let extraNews = [broadRandomNews(nextTeams, week, season), ...returns.news, ...incoming.news, ...pendingSquad.news, ...dev.news, ...offers.news, ...academyRefresh.news];
    let nextSeason = season;
    let nextFixtures = fixtureCalendar;
    let seasonRecords = [];
    if (nextWeek > SEASON_LENGTH_WEEKS) {
      const rollover = endSeasonRollover(nextTeams, season, compState);
      nextTeams = rollover.teams;
      nextSeason = season + 1;
      nextWeek = 1;
      nextFixtures = buildLeagueFixtures(nextTeams, nextSeason);
      compState = initialCompetitionState(nextSeason);
      seasonRecords = rollover.history;
      extraNews = [...rollover.news, ...extraNews];
      if (rollover.freeAgents?.length) setMarket((prev) => cleanMarket([...(rollover.freeAgents || []), ...prev], nextTeams));
      setSeasonStats({ homeWins: 0, derbyWins: 0, goals: 0, youthDeveloped: 0 });
    }
    setTeams(nextTeams);
    setCompetitionState(compState);
    setFixtureCalendar(nextFixtures);
    setSeason(nextSeason);
    setWeek(nextWeek);
    setLog((prev) => [...allResults, ...prev].slice(0, 720));
    setWorldNews((prev) => [...growth.news, ...extraNews, ...prev].slice(0, 180));
    setSeasonHistory((prev) => [...seasonRecords, ...prev].slice(0, 90));
    const idleScoutDone = scoutQueue.filter((q) => (q.dueWeek || week + 1) <= week + 1);
    const idleScoutLeft = scoutQueue.filter((q) => (q.dueWeek || week + 1) > week + 1);
    setMarket((prev) => {
      const normalDoneIds = idleScoutDone.filter((q) => !q.player).map((q) => q.id);
      const randomReports = idleScoutDone.filter((q) => q.player).map((q) => ({ ...q.player, scouted: true, scoutStatus: q.player.rarePotential ? "gem" : "normal", scoutDueWeek: null, scoutReportWeek: week + 1, randomScout: true, sourceClub: "Scout Network" }));
      const updated = normalDoneIds.length ? prev.map((p) => normalDoneIds.includes(p.id) ? { ...p, scouted: true, scoutStatus: p.rarePotential ? "gem" : "normal", scoutDueWeek: null } : p) : prev;
      return cleanMarket([...(returns.marketAdds || []), ...(pendingSquad.marketAdds || []), ...(growth.marketAdds || []), ...randomReports, ...updated], nextTeams);
    });
    if (idleScoutDone.length) {
      const reportNames = idleScoutDone.map((q) => q.player?.name || q.name).filter(Boolean).join(", ");
      setWorldNews((prev) => [{ id: `scout-report-${Date.now()}`, week: week + 1, season, tag: "Scout Report", icon: "🔎", title: `Scout menemukan ${idleScoutDone.length} laporan pemain`, body: reportNames ? `${reportNames} sudah masuk menu Transfer. Buka detail report untuk lihat stat, rating, harga, loan/kontrak sementara, beli, atau tolak.` : "Report scout sudah selesai dan bisa dibuka di Transfer." }, ...prev].slice(0, 180));
      notify(`Scout report selesai untuk ${idleScoutDone.length} pemain. Cek Inbox/Transfer.`, "info");
    }
    setScoutQueue(idleScoutLeft);
    setScoutUsed(0);
    notify(nextWeek === 1 ? `Season ${nextSeason} dimulai. Promosi, degradasi, kontrak, aging, youth intake, dan fixture baru sudah diproses.` : `Pekan ${week} dilewati: event, AI growth, berita, dan kompetisi diproses.`, "info");
  }, [active, cash, competitionState, facilities, fixtureCalendar, gameStarted, manager, notify, pendingTransfers, scoutQueue, season, teams, trainingPlan, week]);

  const startMatch = useCallback(() => {
    if (!gameStarted) { setTab("dashboard"); return; }
    if (active) { setTab("match"); return; }
    if (preMatch) { setTab("match"); return; }
    let compState = ensureNumberOneState(competitionState, teams, week, season);
    if (JSON.stringify(compState.numberOne) !== JSON.stringify(competitionState.numberOne)) setCompetitionState(compState);
    const fixture = userFixturesForWeek(compState, fixtureCalendar, teams, week, season).find((f) => !fixtureAlreadyPlayed(log, f));
    if (week > SEASON_LENGTH_WEEKS) { advanceIdleWeek(); return; }
    if (!fixture) { advanceIdleWeek(); return; }
    const homeTeam = teamForFixture(teams, fixture.homeId, season, fixture.stage);
    const awayTeam = teamForFixture(teams, fixture.awayId, season, fixture.stage);
    const userSide = fixture.homeId === MY_TEAM_ID ? "home" : "away";
    setPreMatch({ week, season, fixture, homeTeam, awayTeam, userSide, createdAt: Date.now() });
    setTab("match");
    notify(`Pre-match siap: ${homeTeam.name} vs ${awayTeam.name}. Atur formasi, cek lawan, lalu tekan Mulai Main.`, "success");
  }, [active, preMatch, advanceIdleWeek, competitionState, fixtureCalendar, gameStarted, log, notify, season, teams, week]);

  const beginPreparedMatch = useCallback(() => {
    if (!preMatch) { startMatch(); return; }
    const { fixture, userSide } = preMatch;
    const homeTeam = teamForFixture(teams, fixture.homeId, season, fixture.stage);
    const awayTeam = teamForFixture(teams, fixture.awayId, season, fixture.stage);
    const game = createMatch({ homeTeam, awayTeam, userSide, userFormation: formation, trainingPlan, facilities, lineupOverrides, aiDifficulty, helpMode });
    Object.assign(game, { competition: fixture.competition || "league", leagueKey: fixture.leagueKey, cupName: fixture.cupName, stage: fixture.stage, group: fixture.group, matchKey: fixture.key });
    if (fixture.competition === "numberOne") game.history = [{ minute: 1, icon: "👑", text: `${fixture.cupName} ${fixture.stage}: laga bergengsi NO.1 dimulai dari penyerang.` }, ...(game.history || [])];
    if (fixture.competition && fixture.competition !== "league" && fixture.competition !== "numberOne") game.history = [{ minute: 1, icon: fixture.icon || "🏆", text: `${fixture.cupName} ${fixture.stage}: ${fixture.note || "laga kompetisi bergengsi"}` }, ...(game.history || [])];
    setActive({ week: preMatch.week, fixture, game });
    setPreMatch(null);
    setSelectedId(game.ballOwnerId && getPiece(game, game.ballOwnerId)?.side === userSide ? game.ballOwnerId : null);
    setTab("match");
    notify(`${fixture.cupName || leagueName(fixture.leagueKey) || "Liga"}: ${homeTeam.name} vs ${awayTeam.name}. Kick-off dari penyerang; posisi tetap aman di area sendiri.`, game.isDerby ? "derby" : "success");
  }, [aiDifficulty, facilities, formation, helpMode, lineupOverrides, notify, preMatch, season, startMatch, teams, trainingPlan]);

  const beginPreparedSimulation = useCallback(() => {
    if (!preMatch) { startMatch(); return; }
    const { fixture, userSide } = preMatch;
    const homeTeam = teamForFixture(teams, fixture.homeId, season, fixture.stage);
    const awayTeam = teamForFixture(teams, fixture.awayId, season, fixture.stage);
    const base = createMatch({ homeTeam, awayTeam, userSide, userFormation: formation, trainingPlan, facilities, lineupOverrides, aiDifficulty, helpMode });
    Object.assign(base, { competition: fixture.competition || "league", leagueKey: fixture.leagueKey, cupName: fixture.cupName, stage: fixture.stage, group: fixture.group, matchKey: fixture.key });
    const game = makeQuickSimGame(base);
    setActive({ week: preMatch.week, fixture, game });
    setPreMatch(null);
    setSelectedId(null);
    setTab("match");
    notify(`Quick Sim dimulai: ${homeTeam.name} vs ${awayTeam.name}. Pause kapan saja untuk pergantian pemain.`, "success");
  }, [aiDifficulty, facilities, formation, helpMode, lineupOverrides, notify, preMatch, season, startMatch, teams, trainingPlan]);

  useEffect(() => {
    if (aiPaused || !active?.game || active.game.mode === "realtimeSoccer" || active.game.ended || active.game.goalPause || active.game.turn === active.game.userSide) return undefined;
    const timer = window.setTimeout(() => {
      setActive((prev) => {
        if (!prev?.game || prev.game.mode === "realtimeSoccer" || prev.game.ended || prev.game.turn === prev.game.userSide) return prev;
        const action = bestAiAction(prev.game);
        return action ? { ...prev, game: applyAction(prev.game, action) } : prev;
      });
      setSelectedId(null);
    }, 590 + rng(0, 290));
    return () => window.clearTimeout(timer);
  }, [active, aiPaused]);

  useEffect(() => {
    if (aiPaused || !active?.game || active.game.ended || active.game.goalPause) return undefined;
    const isReal = active.game.mode === "realtimeSoccer";
    const isQuick = active.game.mode === "quickSim";
    const timer = window.setInterval(() => {
      setActive((prev) => {
        if (!prev?.game || prev.game.ended || prev.game.goalPause) return prev;
        const game = prev.game.mode === "realtimeSoccer" ? tickRealtimeSoccer(prev.game, REAL_SOCCER_TICK_SECONDS) : prev.game.mode === "quickSim" ? tickQuickSim(prev.game, QUICK_SIM_TICK_SECONDS) : tickRealtimeClock(prev.game, REALTIME_TICK_SECONDS);
        return { ...prev, game };
      });
    }, isReal ? REAL_SOCCER_FRAME_MS : isQuick ? QUICK_SIM_FRAME_MS : 1000);
    return () => window.clearInterval(timer);
  }, [active?.game?.mode, active?.game?.ended, active?.game?.goalPause, aiPaused]);

  useEffect(() => {
    if (aiPaused || !friendlyActive?.game || friendlyActive.game.mode === "realtimeSoccer" || friendlyActive.game.ended || friendlyActive.game.goalPause || friendlyActive.game.turn === friendlyActive.game.userSide) return undefined;
    const timer = window.setTimeout(() => {
      setFriendlyActive((prev) => {
        if (!prev?.game || prev.game.mode === "realtimeSoccer" || prev.game.ended || prev.game.turn === prev.game.userSide) return prev;
        const action = bestAiAction(prev.game);
        return action ? { ...prev, game: applyAction(prev.game, action) } : prev;
      });
      setSelectedId(null);
    }, 520 + rng(0, 260));
    return () => window.clearTimeout(timer);
  }, [friendlyActive, aiPaused]);

  useEffect(() => {
    if (aiPaused || !friendlyActive?.game || friendlyActive.game.ended || friendlyActive.game.goalPause) return undefined;
    const isReal = friendlyActive.game.mode === "realtimeSoccer";
    const isQuick = friendlyActive.game.mode === "quickSim";
    const timer = window.setInterval(() => {
      setFriendlyActive((prev) => {
        if (!prev?.game || prev.game.ended || prev.game.goalPause) return prev;
        const game = prev.game.mode === "realtimeSoccer" ? tickRealtimeSoccer(prev.game, REAL_SOCCER_TICK_SECONDS) : prev.game.mode === "quickSim" ? tickQuickSim(prev.game, QUICK_SIM_TICK_SECONDS) : tickRealtimeClock(prev.game, REALTIME_TICK_SECONDS);
        return { ...prev, game };
      });
    }, isReal ? REAL_SOCCER_FRAME_MS : isQuick ? QUICK_SIM_FRAME_MS : 1000);
    return () => window.clearInterval(timer);
  }, [friendlyActive?.game?.mode, friendlyActive?.game?.ended, friendlyActive?.game?.goalPause, aiPaused]);

  useEffect(() => {
    if (!active?.game || active.game.ended) return;
    const carrier = getPiece(active.game, active.game.ballOwnerId);
    if (carrier?.side === active.game.userSide) setSelectedId(carrier.id);
  }, [active?.game?.turn, active?.game?.ballOwnerId]);

  const doAction = useCallback((action) => {
    setActive((prev) => {
      if (!prev?.game) return prev;
      if (prev.game.ended && action.type !== "resumeGoal") return prev;
      if (prev.game.mode === "realtimeSoccer") return { ...prev, game: applyRealtimeAction(prev.game, action) };
      if (prev.game.mode === "quickSim") return { ...prev, game: applyQuickSimAction(prev.game, action) };
      if (action.type !== "resumeGoal" && action.type !== "card" && prev.game.turn !== prev.game.userSide) return prev;
      return { ...prev, game: applyAction(prev.game, action) };
    });
  }, []);

  const finishWeek = useCallback(() => {
    if (!active?.game?.ended) { notify("Pertandingan belum selesai.", "warn"); return; }
    const played = resultFromGame(active.game, active.week);
    let compState = ensureNumberOneState(competitionState, teams, active.week, season);

    // Jika dalam 1 pekan ada lebih dari 1 laga user, jangan langsung lompat pekan.
    // Match lain dijadwalkan beda hari, sementara efek mingguan (training, youth, kontrak, loan, offer) baru diproses setelah laga terakhir pekan itu selesai.
    const teamsAfterSinglePlayed = applyResult(teams, played);
    compState = updateNumberOneState(compState, teamsAfterSinglePlayed, active.week, played.competition === "numberOne" ? [played] : [], season);
    const remainingThisWeek = remainingUserFixturesAfter(compState, fixtureCalendar, teamsAfterSinglePlayed, active.week, season, log, played);
    if (remainingThisWeek.length) {
      const userWonSingle = (played.homeId === MY_TEAM_ID && played.homeGoals > played.awayGoals) || (played.awayId === MY_TEAM_ID && played.awayGoals > played.homeGoals);
      const singleCupMark = userWonSingle && trophyMarkForResult(played);
      let singleTeams = teamsAfterSinglePlayed;
      if (singleCupMark) {
        singleTeams = singleTeams.map((t) => t.id === MY_TEAM_ID ? { ...t, reputationBadge: singleCupMark, trophies: [{ season, name: played.cupName || played.competition, mark: singleCupMark }, ...(t.trophies || [])].slice(0, 14), fans: Math.round((t.fans || 0) * (1 + competitionPrestigeImpact(played, true) / 100)) } : t);
      }
      const singleIncome = (played.homeId === MY_TEAM_ID ? Math.round(homeIncome(myTeam, played, myRank, facilities) * matchIncomeMultiplier(played.competition || "league")) : 0) + cupBonusForWeek(active.week, myTeam, played) + competitionPrizeForResult(played, MY_TEAM_ID);
      if (singleIncome) setCash((c) => c + singleIncome);
      setSeasonStats((s) => ({
        ...s,
        homeWins: s.homeWins + (played.homeId === MY_TEAM_ID && played.homeGoals > played.awayGoals ? 1 : 0),
        derbyWins: s.derbyWins + (played.derby && userWonSingle ? 1 : 0),
        goals: s.goals + (played.homeId === MY_TEAM_ID ? played.homeGoals : played.awayGoals),
      }));
      setLog((prev) => [played, ...prev].slice(0, 720));
      const nextFixture = remainingThisWeek[0];
      const homeTeam = teamForFixture(singleTeams, nextFixture.homeId, season, nextFixture.stage);
      const awayTeam = teamForFixture(singleTeams, nextFixture.awayId, season, nextFixture.stage);
      const userSide = nextFixture.homeId === MY_TEAM_ID ? "home" : "away";
      setTeams(singleTeams);
      setCompetitionState(compState);
      setWorldNews((prev) => [{ id: `multi-match-${season}-${active.week}-${played.matchKey || Date.now()}`, week: active.week, season, tag: "Matchday Padat", icon: "📅", title: `${played.cupName || leagueName(played.leagueKey)} selesai, masih ada laga pekan ini`, body: `Pekan ${active.week} punya ${remainingThisWeek.length} laga tersisa. Jadwal dibuat beda hari supaya tidak berdekatan.` }, ...prev].slice(0, 180));
      setPreMatch({ week: active.week, season, fixture: nextFixture, homeTeam, awayTeam, userSide, createdAt: Date.now() });
      setActive(null);
      setSelectedId(null);
      setTab("match");
      notify(`Laga pertama pekan ${active.week} selesai. Masih ada ${remainingThisWeek.length} pertandingan minggu ini, jaraknya beda hari. Atur formasi lagi lalu Mulai Main.`, "success");
      return;
    }

    const leagueFixtures = fixtureCalendar[active.week - 1] || [];
    const leagueOther = leagueFixtures
      .filter((m) => !(m.homeId === MY_TEAM_ID || m.awayId === MY_TEAM_ID))
      .map((m) => simulateOtherMatch(teams.find((t) => t.id === m.homeId), teams.find((t) => t.id === m.awayId), active.week, m));
    const compResults = simulateCompetitionFixturesForWeek(compState, teams, active.week, played.competition === "numberOne" ? played : null);
    const results = [played, ...leagueOther, ...compResults.filter((r) => r.matchKey !== played.matchKey)];
    const teamsAfterResults = results.reduce((acc, result) => applyResult(acc, result), teams);
    compState = updateNumberOneState(compState, teamsAfterResults, active.week, results.filter((r) => r.competition === "numberOne"), season);
    let nextTeams = teamsAfterResults;
    const userWon = (played.homeId === MY_TEAM_ID && played.homeGoals > played.awayGoals) || (played.awayId === MY_TEAM_ID && played.awayGoals > played.homeGoals);
    if (compState.numberOne?.championId) {
      nextTeams = nextTeams.map((t) => t.id === compState.numberOne.championId && !(t.trophies || []).some((tr) => tr.season === season && tr.name === "Number 1 Championship") ? { ...t, numberOneTitles: (t.numberOneTitles || 0) + 1, trophies: [{ season, name: "Number 1 Championship", mark: "NO.1" }, ...(t.trophies || [])].slice(0, 14) } : t);
    }
    const userCupWon = userWon && trophyMarkForResult(played);
    if (userCupWon) {
      nextTeams = nextTeams.map((t) => t.id === MY_TEAM_ID ? { ...t, reputationBadge: userCupWon, trophies: [{ season, name: played.cupName || played.competition, mark: userCupWon }, ...(t.trophies || [])].slice(0, 14), fans: Math.round((t.fans || 0) * (1 + competitionPrestigeImpact(played, true) / 100)) } : t);
    }
    const growth = simulateAIClubGrowth(nextTeams, active.week, results);
    nextTeams = growth.teams;
    const returns = processLoanReturns(nextTeams, active.week);
    nextTeams = returns.teams;
    const pendingSquad = processPendingUserSquadActions(nextTeams, active.week + 1, { cash, manager, facilities });
    nextTeams = pendingSquad.teams;
    if (pendingSquad.cashDelta) setCash((c) => c + pendingSquad.cashDelta);
    const dev = processWeeklyDevelopmentForUserTeam(nextTeams, active.week, trainingPlan, facilities);
    nextTeams = dev.teams;
    const offers = processUserTransferOffers(nextTeams, active.week);
    nextTeams = offers.teams;
    const academyRefresh = processYouthAcademyRefresh(nextTeams, active.week, season, facilities.academy || 1);
    nextTeams = academyRefresh.teams;
    const incoming = processIncomingUserTransfers(nextTeams, pendingTransfers, active.week + 1);
    nextTeams = incoming.teams;
    setPendingTransfers(incoming.remaining);
    setLog((prev) => [...results, ...prev].slice(0, 720));

    const userHomeWin = played.homeId === MY_TEAM_ID && played.homeGoals > played.awayGoals;
    const userDerbyWin = played.derby && userWon;
    const youngGrowth = dev.youthDeveloped + (trainingPlan === "youth" ? (rng(0, 2) + facilities.academy >= 3 ? 1 : 0) : 0);
    setSeasonStats((s) => ({ ...s, homeWins: s.homeWins + (userHomeWin ? 1 : 0), derbyWins: s.derbyWins + (userDerbyWin ? 1 : 0), goals: s.goals + (played.homeId === MY_TEAM_ID ? played.homeGoals : played.awayGoals), youthDeveloped: s.youthDeveloped + youngGrowth }));

    const cupBonus = cupBonusForWeek(active.week, myTeam, played) + competitionPrizeForResult(played, MY_TEAM_ID);
    const baseIncome = played.homeId === MY_TEAM_ID ? Math.round(homeIncome(myTeam, played, myRank, facilities) * matchIncomeMultiplier(played.competition || "league")) : 0;
    const income = baseIncome + cupBonus;
    if (income) setCash((c) => c + income);
    notify(`${played.cupName || leagueName(played.leagueKey) || "Match"} selesai. Value laga: ${money(income)}${played.competition === "numberOne" ? " · NO.1 Championship memberi spotlight besar" : ""}.`, userWon ? "success" : "info");

    setScoutUsed(0);
    const worldExtra = [...returns.news, ...incoming.news, ...pendingSquad.news, ...dev.news, ...offers.news, ...academyRefresh.news];
    if (active.week % 2 === 0 || roll(35)) worldExtra.push(broadRandomNews(nextTeams, active.week, season));
    if (compState.numberOne?.championId && active.week === NUMBER_ONE_WEEKS.final) worldExtra.push({ id: `no1-news-${season}`, week: active.week, season, tag: "NO.1", icon: "👑", title: `${compState.numberOne.championName} memenangkan Number 1 Championship`, body: "Juara masuk berita besar dan mendapat tanda NO.1 di profil klub." });
    if (userCupWon) worldExtra.push({ id: `cup-news-${season}-${active.week}-${userCupWon}`, week: active.week, season, tag: userCupWon, icon: played.competition === "worldCupChampionship" ? "🏆🌍" : "🏆", title: `${myTeam.name} mengangkat ${played.cupName}`, body: `Gelar ${played.cupName} memberi tanda ${userCupWon}, reputasi naik, fans bertambah, dan gengsi klub meningkat.` });
    setWorldNews((prev) => [...growth.news, ...worldExtra, ...prev].slice(0, 180));

    const scoutDone = scoutQueue.filter((q) => (q.dueWeek || active.week + 1) <= active.week + 1);
    const scoutLeft = scoutQueue.filter((q) => (q.dueWeek || active.week + 1) > active.week + 1);
    setMarket((prev) => {
      let updated = prev;
      const normalDoneIds = scoutDone.filter((q) => !q.player).map((q) => q.id);
      const randomReports = scoutDone.filter((q) => q.player).map((q) => ({ ...q.player, scouted: true, scoutStatus: q.player.rarePotential ? "gem" : "normal", scoutDueWeek: null, scoutReportWeek: active.week + 1, randomScout: true, sourceClub: "Scout Network" }));
      if (normalDoneIds.length) {
        updated = updated.map((p) => normalDoneIds.includes(p.id) ? { ...p, scouted: true, scoutStatus: p.rarePotential ? "gem" : "normal", scoutDueWeek: null } : p);
      }
      return cleanMarket([...(returns.marketAdds || []), ...(pendingSquad.marketAdds || []), ...(growth.marketAdds || []), ...randomReports, ...updated], nextTeams).sort((a, b) => b.overall - a.overall || b.value - a.value).slice(0, 180);
    });
    if (scoutDone.length) {
      const reportNames = scoutDone.map((q) => q.player?.name || q.name).filter(Boolean).join(", ");
      setWorldNews((prev) => [{ id: `scout-report-${Date.now()}`, week: active.week + 1, season, tag: "Scout Report", icon: "🔎", title: `Scout menemukan ${scoutDone.length} laporan pemain`, body: reportNames ? `${reportNames} sudah masuk menu Transfer. Buka detail report untuk lihat stat, rating, harga, loan/kontrak sementara, beli, atau tolak.` : "Report scout sudah selesai dan bisa dibuka di Transfer." }, ...prev].slice(0, 180));
      notify(`Scout report selesai untuk ${scoutDone.length} pemain. Cek Inbox/Transfer.`, "info");
    }
    setScoutQueue(scoutLeft);
    if (active.week % 3 === 0 || played.derby || played.competition === "numberOne") setStoryLog((prev) => [randomStoryEvent(active.week, nextTeams, nextTeams.find((t) => t.id === MY_TEAM_ID), manager), ...prev].slice(0, 20));
    const prestigeImpact = competitionPrestigeImpact(played, userWon);
    setManager((m) => ({ ...m, reputation: clamp(m.reputation + (userWon ? 1 : 0) + prestigeImpact, 1, 99), boardTrust: clamp(m.boardTrust + (userWon ? 3 : -2) + Math.floor(prestigeImpact / 2), 0, 100), fanTrust: clamp(m.fanTrust + (userWon ? 4 : -3) + (played.derby && userWon ? 4 : 0) + prestigeImpact, 0, 100) }));

    let nextWeek = active.week + 1;
    let nextSeason = season;
    let nextFixtures = fixtureCalendar;
    let seasonRecords = [];
    if (nextWeek > SEASON_LENGTH_WEEKS) {
      const rollover = endSeasonRollover(nextTeams, season, compState);
      nextTeams = rollover.teams;
      nextSeason = season + 1;
      nextWeek = 1;
      nextFixtures = buildLeagueFixtures(nextTeams, nextSeason);
      compState = initialCompetitionState(nextSeason);
      seasonRecords = rollover.history;
      setSeasonStats({ homeWins: 0, derbyWins: 0, goals: 0, youthDeveloped: 0 });
      if (rollover.freeAgents?.length) setMarket((prev) => cleanMarket([...(rollover.freeAgents || []), ...prev], nextTeams));
      setWorldNews((prev) => [...rollover.news, ...prev].slice(0, 180));
      notify(`Season ${season} selesai. Promosi/degradasi, kontrak, aging, pensiun, youth intake, hadiah, dan fixture season ${nextSeason} aktif.`, "success");
    }
    setTeams(nextTeams);
    setCompetitionState(compState);
    setFixtureCalendar(nextFixtures);
    setSeason(nextSeason);
    setSeasonHistory((prev) => [...seasonRecords, ...prev].slice(0, 90));
    setActive(null);
    setPreMatch(null);
    setSelectedId(null);
    setWeek(nextWeek);
    setTab(nextWeek === 1 ? "career" : "schedule");
  }, [active, cash, competitionState, facilities, fixtureCalendar, log, manager, myRank, myTeam, notify, pendingTransfers, scoutQueue, season, teams, trainingPlan]);

  useEffect(() => {
    // Board vision tidak lagi auto-menyelesaikan objective atau memberi bonus saat awal/selama career.
    // Progress tetap ditampilkan sebagai arah musim, bukan tombol/reward otomatis.
  }, [objectiveCtx]);

  const transferRejectionReason = (player) => {
    const reasons = ["klub tujuan dinilai kurang ambisius", "pemain ingin klub dengan fasilitas lebih baik", "agen meminta proyek jangka panjang", "klub pemilik belum mau melepas", "pemain menunggu tawaran dari klub yang lebih besar"];
    if ((manager.fanTrust || 70) < 45) return "fans trust rendah membuat pemain ragu";
    if ((myRank || 99) > 12 && (player.overall || 70) >= 80) return "posisi liga kurang menarik untuk pemain bintang";
    return pick(reasons);
  };
  const buy = (player) => {
    if (player.userListed || player.ownerTeamId === MY_TEAM_ID) { notify("Itu pemain klub kamu. Gunakan aksi di menu Skuad untuk offer masuk.", "warn"); return; }
    if (!isTransferWindow(week)) { notify(`Bursa tutup. ${transferWindowLabel(week)}. Beli/jual hanya di pekan transfer window.`, "warn"); return; }
    if (transferActionWeek === week) { notify("Transfer masuk dibatasi 1x per pekan. Tunggu pekan berikutnya untuk beli/pinjam lagi.", "warn"); return; }
    const fee = player.ownerTeamId ? Math.round((player.value || 0) * 1.04) : player.value;
    if (cash < fee) { notify(`Kas tidak cukup. Butuh ${money(fee)}.`, "error"); return; }
    if (seniorPlayers(myTeam).length + pendingTransfers.length >= 38) { notify("Skuad senior penuh/menunggu kedatangan. Maksimal 38 pemain senior.", "warn"); return; }
    if (player.ownerTeamId && roll((player.overall || 70) >= 85 ? 52 : 25)) { notify(`${player.name} menolak/tidak dilepas: ${transferRejectionReason(player)}.`, "warn"); return; }
    const arrival = { id: `buy-${player.id}-${week}-${Date.now()}`, type: "buy", dueWeek: week + 1, createdWeek: week, fee, sourceClub: player.sourceClub || "Market", ownerTeamId: player.ownerTeamId || null, player: { ...player, pendingArrival: { type: "buy", dueWeek: week + 1 } } };
    setCash((c) => c - fee);
    setPendingTransfers((prev) => [...prev, arrival]);
    setTransferActionWeek(week);
    setTeams((prev) => prev.map((t) => {
      if (player.ownerTeamId && t.id === player.ownerTeamId) return { ...t, budget: (t.budget || INITIAL_CASH) + fee, players: t.players.filter((p) => p.id !== player.id) };
      return t;
    }));
    setMarket((prev) => prev.filter((p) => p.id !== player.id));
    setWorldNews((prev) => [{ id: `buy-pending-${player.id}-${week}`, week, season, tag: "Transfer Pending", icon: "🕒", title: `${player.name} sudah dibeli, belum bisa dimainkan`, body: `Transfer ${player.pos} OVR ${player.overall} selesai senilai ${money(fee)}, tetapi registrasi skuad baru aktif pekan ${week + 1}.` }, ...prev].slice(0, 180));
    notify(`${player.name} dibeli senilai ${money(fee)}. Ia baru masuk skuad utama pekan ${week + 1}.`, "success");
  };
  const loan = (player, weeksCount = 15) => {
    if (player.userListed || player.ownerTeamId === MY_TEAM_ID) { notify("Pemain itu milik klub kamu. Tunggu offer dari klub lain untuk loan/jual.", "warn"); return; }
    if (!isTransferWindow(week)) { notify(`Bursa tutup. ${transferWindowLabel(week)}. Loan hanya di transfer window.`, "warn"); return; }
    if (transferActionWeek === week) { notify("Transfer masuk dibatasi 1x per pekan. Tunggu pekan berikutnya untuk beli/pinjam lagi.", "warn"); return; }
    const weeksLoan = Number(weeksCount) || 15;
    const factor = weeksLoan <= 3 ? 0.06 : weeksLoan <= 15 ? 0.14 : 0.24;
    const fee = Math.round((player.value || 0) * factor / 500) * 500;
    if (cash < fee) { notify(`Loan fee kurang. Butuh ${money(fee)}.`, "error"); return; }
    if (seniorPlayers(myTeam).length + pendingTransfers.length >= 38) { notify("Skuad senior penuh/menunggu kedatangan. Maksimal 38 pemain senior.", "warn"); return; }
    if (player.ownerTeamId && roll((player.overall || 70) >= 82 ? 44 : 18)) { notify(`${player.name} menolak loan: ${transferRejectionReason(player)}.`, "warn"); return; }
    const arrival = { id: `loan-${player.id}-${week}-${Date.now()}`, type: "loan", dueWeek: week + 1, createdWeek: week, fee, weeks: weeksLoan, loanReturnWeek: week + 1 + weeksLoan, sourceClub: player.sourceClub || "Free Agent", ownerTeamId: player.ownerTeamId || null, player: { ...player, value: Math.round((player.value || 0) * 0.3), pendingArrival: { type: "loan", dueWeek: week + 1 } } };
    setCash((c) => c - fee);
    setPendingTransfers((prev) => [...prev, arrival]);
    setTransferActionWeek(week);
    setTeams((prev) => prev.map((t) => {
      if (player.ownerTeamId && t.id === player.ownerTeamId) return { ...t, players: t.players.filter((p) => p.id !== player.id) };
      return t;
    }));
    setMarket((prev) => prev.filter((p) => p.id !== player.id));
    setWorldNews((prev) => [{ id: `loan-pending-${player.id}-${week}`, week, season, tag: "Loan Pending", icon: "🤝", title: `${player.name} sepakat loan, menunggu registrasi`, body: `Loan ${weeksLoan} pekan disetujui dengan fee ${money(fee)}. Pemain baru bisa dipakai mulai pekan ${week + 1}.` }, ...prev].slice(0, 180));
    notify(`${player.name} setuju loan ${weeksLoan} pekan. Ia baru masuk skuad utama pekan ${week + 1}.`, "success");
  };
  const scout = (player) => {
    if (player.scouted) { notify(`${player.name} sudah punya report.`, "info"); return; }
    if (scoutQueue.length) { notify("Scout masih berjalan. Tunggu report selesai sebelum scout lain.", "warn"); return; }
    if (scoutQueue.some((q) => q.id === player.id)) { notify(`${player.name} sedang di-scout. Tunggu sampai report selesai.`, "warn"); return; }
    if (scoutUsed >= scoutLimit) { notify(`Batas scout fase ini ${scoutLimit}. Tunggu pertandingan berikutnya.`, "warn"); return; }
    const dueWeek = week + rng(1, 7);
    setScoutUsed((n) => n + 1);
    setScoutQueue((q) => [...q, { id: player.id, name: player.name, dueWeek }]);
    setMarket((prev) => prev.map((p) => p.id === player.id ? { ...p, scoutStatus: "pending", scoutDueWeek: dueWeek } : p));
    notify(`Scout dikirim untuk ${player.name}. Hasil maksimal 7 pekan, estimasi pekan ${dueWeek}.`, "info");
  };
  const scoutRandom = () => {
    if (scoutQueue.length) { notify("Scout masih berjalan. Tunggu report selesai sebelum scout baru.", "warn"); return; }
    if (scoutUsed >= scoutLimit) { notify(`Batas scout fase ini ${scoutLimit}. Tunggu pertandingan/pekan berikutnya.`, "warn"); return; }
    const dueWeek = week + rng(1, 7);
    const hidden = { ...genPlayer(pick(EXTRA_POSITIONS), null, rng(-8, 12), true), sourceClub: "Scout Network", ownerTeamId: null, scouted: false, scoutStatus: "hidden", scoutDueWeek: dueWeek, randomScout: true };
    setScoutUsed((n) => Math.min(scoutLimit, n + 1));
    setScoutQueue([{ id: `random-${hidden.id}`, hidden: true, dueWeek, player: hidden }]);
    notify(`Scout random anonim berjalan. Nama dan data pemain baru muncul di Inbox/Transfer paling lambat pekan ${dueWeek}.`, "info");
  };
  const rejectScoutReport = (player) => {
    setMarket((prev) => prev.filter((p) => p.id !== player.id));
    notify(`Report ${player.name} ditolak dan dihapus dari daftar transfer.`, "info");
  };
  const sell = (player) => {
    if (!isTransferWindow(week)) { notify(`Bursa tutup. ${transferWindowLabel(week)}. Tandai jual/loan hanya di transfer window.`, "warn"); return; }
    if (!player.academy && seniorPlayers(myTeam).length <= 18) { notify("Minimal skuad utama 18 pemain senior. Tidak bisa melepas/menjual di bawah itu.", "warn"); return; }
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.map((p) => p.id === player.id ? { ...p, listedForSale: true, pendingOffer: null } : p) } : t));
    setMarket((prev) => cleanMarket([{ ...player, userListed: true, ownerTeamId: MY_TEAM_ID, sourceClub: myTeam.name, listedForSale: true, scouted: true }, ...prev], teams));
    notify(`${player.name} ditandai DIJUAL. Klub lain bisa memberi offer setelah pekan terlewati.`, "success");
  };
  const listLoan = (player) => {
    if (!isTransferWindow(week)) { notify(`Bursa tutup. ${transferWindowLabel(week)}. Tandai loan hanya di transfer window.`, "warn"); return; }
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.map((p) => p.id === player.id ? { ...p, listedForLoan: true, pendingOffer: null } : p) } : t));
    setMarket((prev) => cleanMarket([{ ...player, userListed: true, ownerTeamId: MY_TEAM_ID, sourceClub: myTeam.name, listedForLoan: true, scouted: true }, ...prev], teams));
    notify(`${player.name} ditandai BISA DIPINJAM. Offer akan muncul setelah pekan terlewati.`, "success");
  };
  const setPendingSquadAction = (player, action) => {
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.map((p) => p.id === player.id ? { ...p, pendingSquadAction: action } : p) } : t));
  };
  const kickPlayer = (player) => {
    if (!player.academy && seniorPlayers(myTeam).length <= 18) { notify("Minimal skuad utama 18 pemain senior. Kick dibatalkan agar skuad tidak kurang.", "warn"); return; }
    if (player.pendingSquadAction) { notify("Pemain ini sudah punya aksi skuad yang menunggu pekan berikutnya.", "warn"); return; }
    setPendingSquadAction(player, { type: "kick", dueWeek: week + 1, createdWeek: week });
    notify(`${player.name} dijadwalkan KICK. Aksi benar-benar terjadi setelah 1 pekan terlewati.`, "warn");
  };
  const extendContract = (player) => {
    if (player.pendingSquadAction) { notify("Pemain ini sudah punya aksi skuad yang menunggu pekan berikutnya.", "warn"); return; }
    const currentWage = player.wage || 500;
    const offerWage = Math.round(currentWage * rng(108, 145) / 100 / 100) * 100;
    const years = rng(1, 3);
    setPendingSquadAction(player, { type: "extend", dueWeek: week + 1, createdWeek: week, offerWage, years });
    notify(`Offer kontrak ${player.name} dikirim: +${years} tahun, gaji ${money(offerWage)}/pekan. Jawaban datang setelah 1 pekan.`, "info");
  };
  const checkPotential = (player) => {
    if (player.pendingSquadAction) { notify("Pemain ini sudah punya aksi skuad yang menunggu pekan berikutnya.", "warn"); return; }
    const cost = 12000 + (facilities.academy || 1) * 2500;
    setPendingSquadAction(player, { type: "checkPotential", dueWeek: week + 1, createdWeek: week, cost });
    notify(`Cek potensi ${player.name} dijadwalkan. Hasil keluar setelah 1 pekan dan biaya ${money(cost)} dipotong saat selesai.`, "info");
  };
  const promoteYouth = (player) => {
    if (!player.academy) { notify(`${player.name} sudah berada di skuad utama.`, "info"); return; }
    if (player.pendingSquadAction) { notify("Pemain youth ini sudah punya aksi menunggu pekan berikutnya.", "warn"); return; }
    const cap = player.rarePotential || player.potential >= 84 ? 300000 : 100000;
    const signingFee = Math.round(clamp((player.value || 50000) * (player.rarePotential ? 0.28 : 0.16), 15000, cap) / 500) * 500;
    if (seniorPlayers(myTeam).length >= 38) { notify("Skuad senior penuh. Maksimal 38 pemain senior sebelum promosi youth.", "warn"); return; }
    if (cash < signingFee) { notify(`Kas tidak cukup untuk memanggil ${player.name}. Butuh ${money(signingFee)} saat proses pekan.`, "error"); return; }
    setPendingSquadAction(player, { type: "promoteYouth", dueWeek: week + 1, createdWeek: week, signingFee });
    notify(`${player.name} dijadwalkan PROMOSI. Masuk skuad utama setelah 1 pekan terlewati. Estimasi fee ${money(signingFee)}.`, "success");
  };

  const respondOffer = (player, action) => {
    const offer = player.pendingOffer;
    if (!offer) { notify("Belum ada offer untuk pemain ini.", "warn"); return; }
    if (action === "reject") {
      setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.map((p) => p.id === player.id ? { ...p, pendingOffer: null } : p) } : t));
      notify(`Offer ${offer.clubName} untuk ${player.name} ditolak.`, "info");
      return;
    }
    if (action === "counter") {
      if (offer.countered || roll(38)) {
        setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.map((p) => p.id === player.id ? { ...p, pendingOffer: null } : p) } : t));
        notify(`${offer.clubName} menolak ajukan ulang untuk ${player.name}.`, "warn");
        return;
      }
      const newOffer = { ...offer, amount: Math.round(offer.amount * rng(112, 145) / 100 / 500) * 500, countered: true };
      setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.map((p) => p.id === player.id ? { ...p, pendingOffer: newOffer } : p) } : t));
      notify(`${offer.clubName} menaikkan offer menjadi ${money(newOffer.amount)}.`, "success");
      return;
    }
    if (offer.type === "sale" && !player.academy && seniorPlayers(myTeam).length <= 18) { notify("Tidak bisa menerima sale. Minimal skuad utama 18 pemain senior.", "warn"); return; }
    setCash((c) => c + offer.amount);
    setTeams((prev) => prev.map((t) => {
      if (t.id === MY_TEAM_ID) return { ...t, players: t.players.filter((p) => p.id !== player.id) };
      if (t.id === offer.clubId) {
        const moved = offer.type === "loan" ? { ...player, teamId: t.id, loan: true, loanOriginId: MY_TEAM_ID, loanReturnWeek: week + (offer.weeks || 15), loanClubName: t.name, listedForSale: false, listedForLoan: false, pendingOffer: null } : { ...player, teamId: t.id, ownerTeamId: null, sourceClub: t.name, listedForSale: false, listedForLoan: false, pendingOffer: null, loan: false };
        return { ...t, budget: Math.max(0, (t.budget || INITIAL_CASH) - offer.amount), players: [...t.players, moved].sort((a, b) => b.overall - a.overall) };
      }
      return t;
    }));
    setMarket((prev) => prev.filter((p) => p.id !== player.id));
    setSelectedPlayer(null);
    notify(`${offer.type === "loan" ? "Loan" : "Transfer"} ${player.name} ke ${offer.clubName} diterima. Kas +${money(offer.amount)}.`, "success");
  };

  const scoutLimit = 1;
  const saveNow = () => {
    const ok = saveCareer(currentSavePayload());
    notify(ok ? "Career disimpan manual ke browser." : "Gagal menyimpan career.", ok ? "success" : "error");
  };
  const exportSave = () => {
    const payload = currentSavePayload();
    saveCareer(payload);
    const ok = downloadCareerFile(payload);
    notify(ok ? "Save di-download sebagai file JSON." : "Gagal download save.", ok ? "success" : "error");
  };
  const loadNow = () => {
    const data = loadCareer();
    if (!data?.teams) { notify("Belum ada save manual. Pilih Career Baru atau import file save.", "warn"); return; }
    applyLoadedData(data, "local");
  };
  const resetSave = () => { clearCareer(); notify("Save manual di browser dihapus. File download tetap aman kalau kamu punya.", "warn"); };
  const requestStoryMeeting = () => {
    if (storyLog.some((e) => e.manualMeeting && e.week === week)) {
      setTab("story");
      notify("Meeting media hanya bisa dibuka 1x per pekan. Lanjutkan match/pekan dulu untuk membuka meeting baru.", "warn");
      return;
    }
    const event = { ...randomStoryEvent(week, teams, myTeam, manager), manualMeeting: true, source: "manualMeeting" };
    setStoryLog((prev) => [event, ...prev].slice(0, 28));
    setTab("story");
    notify("Meeting media/story baru dibuka untuk pekan ini. Pilihanmu akan masuk berita dan berdampak ke klub.", "info");
  };

  const answerStory = (eventId, choice) => {
    const event = storyLog.find((e) => e.id === eventId) || {};
    const lower = choice.toLowerCase();
    let fans = lower.includes("ofensif") || lower.includes("rival") || lower.includes("juara") || lower.includes("derby") || lower.includes("fans") ? 5 : lower.includes("tolak") || lower.includes("salahkan") ? -2 : 1;
    let board = lower.includes("tenang") || lower.includes("realistis") || lower.includes("fasilitas") || lower.includes("stadion") || lower.includes("waktu") ? 4 : lower.includes("serang balik") || lower.includes("salahkan") ? -3 : 1;
    let rep = lower.includes("target juara") || lower.includes("panas") || lower.includes("deklarasi") ? 2 : lower.includes("hormati") ? 1 : 0;
    let cashDelta = 0;
    if (event.type === "sponsor") { cashDelta += lower.includes("ambil") ? 45000 : lower.includes("seri") ? 22000 : 0; board += lower.includes("ambil") ? 2 : 0; }
    if (event.type === "board") { board += lower.includes("perubahan") ? 3 : lower.includes("salahkan") ? -6 : 1; }
    if (event.type === "fans") { fans += lower.includes("komunitas") || lower.includes("ofensif") ? 4 : 0; }
    if (event.type === "locker") { fans += lower.includes("bonus") ? 1 : 0; cashDelta -= lower.includes("bonus") ? 12000 : 0; }
    if (event.type === "youth") { rep += lower.includes("promosi") ? 1 : 0; }
    if (lower.includes("bonus") || lower.includes("sponsor") || lower.includes("negosiasi")) cashDelta += 25000;
    const effect = `${fans >= 0 ? "+" : ""}${fans} Fans · ${board >= 0 ? "+" : ""}${board} Board${rep ? ` · +${rep} Rep` : ""}${cashDelta ? ` · ${cashDelta > 0 ? "+" : ""}${money(cashDelta)} kas` : ""}`;
    setStoryLog((prev) => prev.map((e) => e.id === eventId ? { ...e, choice, effect, resolvedWeek: week } : e));
    setManager((m) => ({ ...m, reputation: clamp((m.reputation || 1) + rep, 1, 99), fanTrust: clamp(m.fanTrust + fans, 0, 100), boardTrust: clamp(m.boardTrust + board, 0, 100) }));
    if (cashDelta) setCash((c) => c + cashDelta);
    if (lower.includes("akademi")) setFacilities((f) => ({ ...f, academy: Math.min(5, (f.academy || 1) + (roll(28) ? 1 : 0)) }));
    if (lower.includes("training")) setFacilities((f) => ({ ...f, training: Math.min(5, (f.training || 1) + (roll(28) ? 1 : 0)) }));
    if (event.type === "rivalry" && event.relatedClubId && (lower.includes("rival") || lower.includes("panas") || lower.includes("derby"))) {
      setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, rivalId: event.relatedClubId, rivalryHeat: clamp((t.rivalryHeat || 0) + 18, 0, 100) } : t.id === event.relatedClubId ? { ...t, rivalId: MY_TEAM_ID, rivalryHeat: clamp((t.rivalryHeat || 0) + 18, 0, 100) } : t));
    }
    if (event.type === "agent" && lower.includes("negosiasi")) {
      setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, players: t.players.map((p, i) => i < 3 ? { ...p, morale: clamp((p.morale || 70) + 3, 35, 99) } : p) } : t));
    }
    setWorldNews((prev) => [{ id: `story-${eventId}`, week, season, tag: event.type ? `Story · ${event.type}` : "Story Impact", icon: event.type === "rivalry" ? "🔥" : event.type === "sponsor" ? "🤝" : event.type === "youth" ? "🌱" : "💬", title: `Pilihan story: ${choice}`, body: `${event.title || "Keputusan manager"}. Dampak: ${effect}. ${event.arc || "Pilihan ini memengaruhi berita, trust, finansial, dan reputasi klub."}` }, ...prev].slice(0, 180));
    notify(`Story dipilih: ${effect}.`, fans + board >= 2 ? "success" : "info");
  };

  const upgradeFacility = (key) => {
    const level = facilities[key] || 1;
    if (level >= 3) { notify("Level fasilitas sudah maksimal.", "warn"); return; }
    const cost = Math.round(FACILITY_DEF[key].baseCost * Math.pow(1.65, level - 1));
    if (cash < cost) { notify(`Kas tidak cukup untuk upgrade ${FACILITY_DEF[key].label}. Butuh ${money(cost)}.`, "error"); return; }
    setCash((c) => c - cost);
    setFacilities((f) => ({ ...f, [key]: level + 1 }));
    notify(`${FACILITY_DEF[key].label} naik ke level ${level + 1}.`, "success");
  };

  const setTeamStyle = (style) => {
    setTeams((prev) => prev.map((t) => t.id === MY_TEAM_ID ? { ...t, style } : t));
    notify(`Gaya taktik diubah ke ${style}. Ini langsung mengubah AI teammate, off-ball run, passing, pressing, dan shot saat match.`, "success");
  };

  const tabs = [["dashboard", "Home"], ["inbox", "Inbox"], ["career", "Career"], ["calendar", "Calendar"], ["news", "Berita"], ["competitions", "Kompetisi"], ["training", "Latihan"], ["squad", "Skuad"], ["tactics", "Taktik"], ["schedule", "Jadwal"], ["champions", "Champions"], ["table", "Klasemen"], ["transfer", "Transfer"], ["youth", "Youth"], ["story", "Story"], ["facilities", "Fasilitas"], ["objectives", "Target"], ["clubs", "Klub"], ["aiGrowth", "AI Growth"], ["debug", "QA"]];
  if (lanOpen) {
    return <div className="appShell landingShell">
      {notice && <Notice notice={notice} />}
      <LanMultiplayerScreen onBack={() => setLanOpen(false)} helpMode={helpMode} notify={notify} />
    </div>;
  }
  if (tutorialActive) {
    return <div className="appShell tutorialShell">
      {notice && <Notice notice={notice} />}
      <TutorialMode active={tutorialActive} selectedId={selectedId} setSelectedId={setSelectedId} onAction={doTutorialAction} tutorialStep={tutorialStep} setTutorialStep={setTutorialStep} onExit={() => { setTutorialActive(null); setSelectedId(null); }} helpMode={true} />
    </div>;
  }
  if (friendlyActive) {
    return <div className="appShell tutorialShell">
      {notice && <Notice notice={notice} />}
      <main className="tutorialMain"><section className="tutorialHeader"><div><p className="eyebrow">Quick Match / Friendly</p><h1>Latihan bebas</h1><p>Hasil tidak memengaruhi career. Gunakan untuk mencoba kontrol off-ball, shot zone, dan AI difficulty.</p></div><div className="tutorialControls"><button className="danger" onClick={() => { setFriendlyActive(null); setSelectedId(null); }}>Keluar Friendly</button></div></section><MatchTab active={friendlyActive} selectedId={selectedId} setSelectedId={setSelectedId} onAction={(action) => setFriendlyActive((prev) => prev?.game ? { ...prev, game: prev.game.mode === "realtimeSoccer" ? applyRealtimeAction(prev.game, action) : applyAction(prev.game, action) } : prev)} finishWeek={() => { setFriendlyActive(null); setSelectedId(null); }} startMatch={() => {}} aiPaused={aiPaused} setAiPaused={setAiPaused} helpMode={helpMode} /></main>
    </div>;
  }
  if (!gameStarted) {
    return <div className="appShell landingShell">
      {notice && <Notice notice={notice} />}
      <LandingScreen startNewCareer={startNewCareer} startTutorial={startTutorial} startFriendly={startFriendly} openLan={() => setLanOpen(true)} loadNow={loadNow} importSaveFile={importSaveFile} helpMode={helpMode} setHelpMode={setHelpMode} aiDifficulty={aiDifficulty} setAiDifficulty={setAiDifficulty} selectedClubId={selectedClubId} setSelectedClubId={setSelectedClubId} selectedCoachKey={selectedCoachKey} setSelectedCoachKey={setSelectedCoachKey} />
    </div>;
  }
  return <div className="appShell">
    {notice && <Notice notice={notice} />}
    <header className="topbar">
      <div className="brand"><div className="logo" style={{ background: myTeam.color }}>⚽</div><div><h1>{myTeam.name}</h1><p>Bola Catur Arena V12 · Career + LAN</p></div></div>
      <div className="quickStats"><Stat label="Season" value={`S${season}`} /><Stat label="Pekan" value={`${Math.min(week, SEASON_LENGTH_WEEKS)}/${SEASON_LENGTH_WEEKS}`} /><Stat label="Posisi" value={`#${myRank}`} /><Stat label="Kas" value={money(cash)} /><Stat label="AP" value={active?.game ? active.game.ap : "-"} /></div>
      <button className="primary big" onClick={startMatch}>{active ? "LANJUT MATCH" : preMatch ? "ATUR FORMASI" : "MAIN PEKAN"}</button>
    </header>
    <nav className="tabs">{tabs.map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}</nav>
    <main>
      {tab === "dashboard" && <Dashboard team={myTeam} rank={myRank} week={week} season={season} cash={cash} fixture={myFixture} teams={teams} startMatch={startMatch} active={active} facilities={facilities} trainingPlan={trainingPlan} objectives={objectives} objectiveCtx={objectiveCtx} claimed={claimed} startFriendly={startFriendly} />}
      {tab === "inbox" && <InboxTab items={inboxItems({ myTeam, fixture: myFixture, fixtures: weekUserFixtures, week, cash, scoutQueue, pendingTransfers, storyLog, market, facilities, trainingPlan, active })} startMatch={startMatch} setTab={setTab} /> }
      {tab === "career" && <CareerTab manager={manager} saveNow={saveNow} exportSave={exportSave} loadNow={loadNow} resetSave={resetSave} importSaveFile={importSaveFile} />}
      {tab === "calendar" && <CalendarTab fixtures={fixtureCalendar} teams={teams} week={week} season={season} log={log} myTeam={myTeam} competitionState={competitionState} />}
      {tab === "news" && <NewsTab items={newsItems({ teams, week, market, cash, storyLog, log, myTeam, worldNews })} />}
      {tab === "competitions" && <CompetitionsTab teams={teams} week={week} season={season} competitionState={competitionState} seasonHistory={seasonHistory} />}
      {tab === "training" && <TrainingTab trainingPlan={trainingPlan} setTrainingPlan={setTrainingPlan} facilities={facilities} team={myTeam} week={week} />}
      {tab === "squad" && <SquadTab team={myTeam} selected={selectedPlayer} setSelected={setSelectedPlayer} sell={sell} listLoan={listLoan} kickPlayer={kickPlayer} extendContract={extendContract} checkPotential={checkPotential} respondOffer={respondOffer} />}
      {tab === "tactics" && <TacticsTab team={myTeam} formation={formation} setFormation={setFormation} lineupOverrides={lineupOverrides} setLineupOverrides={setLineupOverrides} setTeamStyle={setTeamStyle} />}
      {tab === "match" && (preMatch && !active ? <PreMatchTab preMatch={preMatch} teams={teams} formation={formation} setFormation={setFormation} lineupOverrides={lineupOverrides} setLineupOverrides={setLineupOverrides} setTeamStyle={setTeamStyle} trainingPlan={trainingPlan} setTrainingPlan={setTrainingPlan} facilities={facilities} beginMatch={beginPreparedMatch} beginSim={beginPreparedSimulation} cancel={() => setPreMatch(null)} /> : <MatchTab active={active} selectedId={selectedId} setSelectedId={setSelectedId} onAction={doAction} finishWeek={finishWeek} startMatch={startMatch} aiPaused={aiPaused} setAiPaused={setAiPaused} helpMode={helpMode} />)}
      {tab === "schedule" && <ScheduleTab fixtures={fixtures} teams={teams} week={week} log={log} competitionState={competitionState} />}
      {tab === "champions" && <ChampionsTab teams={sorted} week={week} log={log} />}
      {tab === "table" && <TableTab teams={teams} />}
      {tab === "transfer" && <TransferTab market={market} cash={cash} week={week} buy={buy} loan={loan} scout={scout} scoutRandom={scoutRandom} scoutQueue={scoutQueue} scoutUsed={scoutUsed} scoutLimit={scoutLimit} transferActionWeek={transferActionWeek} pendingTransfers={pendingTransfers} rejectScoutReport={rejectScoutReport} />}
      {tab === "youth" && <YouthTab team={myTeam} facilities={facilities} week={week} sell={sell} listLoan={listLoan} promoteYouth={promoteYouth} checkPotential={checkPotential} />}
      {tab === "story" && <StoryTab storyLog={storyLog} answerStory={answerStory} requestStoryMeeting={requestStoryMeeting} manager={manager} myTeam={myTeam} week={week} />}
      {tab === "facilities" && <FacilitiesTab facilities={facilities} cash={cash} upgrade={upgradeFacility} />}
      {tab === "objectives" && <ObjectivesTab objectives={objectives} ctx={objectiveCtx} claimed={claimed} startFriendly={startFriendly} />}
      {tab === "clubs" && <ClubsTab teams={teams} />}
      {tab === "aiGrowth" && <AIGrowthTab teams={teams} worldNews={worldNews} week={week} />}
      {tab === "debug" && <DebugTab report={debugReport} runQa={() => setDebugReport(runQaDebug(teams, market, fixtureCalendar, week, competitionState))} runBalance={() => setDebugReport(runBalanceSimulator(teams, 1000))} />}
    </main>
  </div>;
}

function TutorialMode({ active, selectedId, setSelectedId, onAction, tutorialStep, setTutorialStep, onExit, helpMode = true }) {
  const steps = [
    { title: "1. Pilih pemain", body: "Tap/klik pemain tim kamu. Pemain pembawa bola punya ikon ⚽, tapi pemain lain juga bisa dipilih." },
    { title: "2. Buka ruang", body: "Pilih pemain tanpa bola, lalu klik grid hijau atau tombol rekomendasi Buka Ruang." },
    { title: "3. Oper", body: "Klik tombol Oper dari pembawa bola, pilih rekan dengan persentase terbaik, dan perhatikan risiko intersep." },
    { title: "4. Masuk zona shot", body: "Bangun serangan sampai highlight kuning: 4 grid lurus atau 3 grid samping dari gawang." },
    { title: "5. Tembak", body: "Tembakan tetap mengikuti shoot/akurasi. Bahkan gawang kosong bisa melenceng jika akurasinya rendah." },
  ];
  const step = steps[tutorialStep] || steps[0];
  return <main className="tutorialMain"><section className="tutorialHeader"><div><p className="eyebrow">Tutorial Interaktif</p><h1>{step.title}</h1><p>{step.body}</p></div><div className="tutorialControls"><button className="ghost" onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}>Sebelumnya</button><button className="primary" onClick={() => setTutorialStep(Math.min(steps.length - 1, tutorialStep + 1))}>Lanjut Step</button><button className="danger" onClick={onExit}>Keluar Tutorial</button></div></section><MatchTab active={active} selectedId={selectedId} setSelectedId={setSelectedId} onAction={onAction} finishWeek={onExit} startMatch={() => {}} aiPaused={true} setAiPaused={() => {}} helpMode={helpMode} tutorialStep={tutorialStep} /></main>;
}

function LandingScreen({ startNewCareer, startTutorial, startFriendly, openLan, loadNow, importSaveFile, helpMode, setHelpMode, aiDifficulty, setAiDifficulty, selectedClubId, setSelectedClubId, selectedCoachKey, setSelectedCoachKey }) {
  const menus = ["Inbox", "Career", "Calendar", "Berita", "Kompetisi", "Latihan", "Skuad", "Taktik", "Transfer", "Youth", "Champions", "Fasilitas", "Klasemen", "Klub", "AI Growth"];
  return <main className="landingMain">
    <section className="landingHero">
      <div className="landingBall">⚽</div>
      <p className="eyebrow">Bola Catur Arena</p>
      <h1>Strategi bola berbasis giliran yang lebih mudah dibaca.</h1>
      <p>Pilih mode bantuan dan difficulty sebelum mulai. Kalau mode bantuan tidak dicentang, coach hint tidak akan tampil saat match.</p>
      <div className="startOptions">
        <label className={`assistToggle ${helpMode ? "active" : ""}`}><input type="checkbox" checked={helpMode} onChange={(e) => setHelpMode(e.target.checked)} /><span>Mode Bantuan / Coach Hint</span><small>{helpMode ? "Hint aktif saat match." : "Hint mati. UI tetap menampilkan peluang dan kontrol."}</small></label>
        <div className="difficultyPicker"><b>AI Difficulty</b>{Object.values(AI_DIFFICULTIES).map((d) => <button key={d.label} className={aiDifficulty === d.label ? "active" : ""} onClick={() => setAiDifficulty(d.label)}>{d.label}<small>{d.desc}</small></button>)}</div>
      </div>
      <div className="preCareerSetup">
        <div className="setupPanel"><b>Pilih Club Career</b><small>Semua klub dimulai fair: rata-rata skuad inti sekitar 70 dan budget Rp 50.000.</small><div className="clubSelectGrid">{CLUB_DATA.map(([id, name, city, color]) => <button key={id} className={Number(selectedClubId) === id ? "active" : ""} onClick={() => setSelectedClubId(id)} style={{ borderColor: Number(selectedClubId) === id ? color : undefined }}><span style={{ background: color }} /> <b>{name}</b><small>{city}</small></button>)}</div></div>
        <div className="setupPanel"><b>Pilih Coach</b><small>Coach menentukan identitas awal manager dan trust board/fans.</small><div className="coachSelectGrid">{COACH_PRESETS.map((c) => <button key={c.key} className={selectedCoachKey === c.key ? "active" : ""} onClick={() => setSelectedCoachKey(c.key)}><strong>{c.icon}</strong><b>{c.name}</b><small>{c.style} · {c.desc}</small></button>)}</div></div>
      </div>
      <div className="landingActions"><button className="primary big" onClick={startNewCareer}>Career Manager World</button><button className="ghost big" onClick={openLan}>📡 Multiplayer LAN</button><button className="ghost big" onClick={startFriendly}>🤝 Quick Match</button><button className="ghost big" onClick={startTutorial}>🎓 Coba Tutorial</button><button className="ghost big" onClick={loadNow}>Load Browser Save</button><label className="fileButton big">Load File Save<input type="file" accept="application/json,.json" onChange={(e) => importSaveFile(e.target.files?.[0])} /></label></div>
    </section>
    <section className="landingGrid">
      <Card><h3>Mode Career Utama</h3><p className="muted">Sekarang hanya ada satu mode agar tidak membingungkan: <b>Career Manager World</b>. Isinya 4 liga, multi-season, calendar, transfer window, berita/event, kompetisi penuh, promosi/degradasi, AI club growth, dan Number 1 Championship.</p><div className="modeSingle"><span>Career Multi-season</span><span>Manager World Calendar</span><span>Number 1 Championship</span><span>Transfer Window</span></div></Card>
      <Card><h3>Menu Setelah Mulai</h3><p className="muted">Loop career dibuat seperti manager mode: cek inbox, atur skuad/taktik, scout/transfer, main pekan, lalu baca summary.</p><div className="menuPreview">{menus.map((m) => <span key={m}>{m}</span>)}</div></Card>
      <Card><h3>🎓 Tutorial Interaktif</h3><p className="muted">Tutorial tetap memberi arahan step-by-step karena memang mode latihan. Di career, coach hint hanya tampil jika Mode Bantuan dicentang.</p><button className="primary full" onClick={startTutorial}>Mulai Tutorial Playable</button><div className="tutorialSteps"><span>1. Pilih pemain dan baca highlight grid.</span><span>2. Buka ruang dengan pemain tanpa bola.</span><span>3. Oper lewat jalur aman dan hindari intersep.</span><span>4. Masuk zona shot, lalu tembak.</span></div></Card>
      <Card><h3>Aturan Ekonomi</h3><div className="infoGrid"><span>Kas awal</span><b>Rp 50.000</b><span>80+ OVR</span><b>Mahal</b><span>Quick Match</span><b>Tanpa efek career</b><span>Save</span><b>Manual + JSON</b></div></Card>
    </section>
  </main>;
}

function getLanClientId() {
  const key = "bola-catur-lan-client-id";
  try {
    const saved = window.localStorage.getItem(key);
    if (saved) return saved;
    const id = window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
async function lanApi(path, payload = null, method = payload ? "POST" : "GET") {
  const res = await fetch(`/api/lan${path}`, {
    method,
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || "LAN server error");
  return data;
}
function playerSideInRoom(room, clientId) {
  if (room?.players?.home?.clientId === clientId) return "home";
  if (room?.players?.away?.clientId === clientId) return "away";
  return null;
}
function LANClubSelect({ value, otherValue, onChange, disabled = false }) {
  const grouped = LAN_REAL_CLUBS.reduce((acc, club) => {
    const key = club.country.includes("Inggris") ? "Inggris" : club.country.includes("Spanyol") ? "Spanyol" : club.country.includes("Jerman") ? "Jerman" : club.country.includes("Italia") ? "Italia" : club.country.includes("Arab") ? "Arab Saudi" : club.country.includes("Indonesia") ? "Indonesia" : "Paris/Prancis";
    acc[key] = [...(acc[key] || []), club];
    return acc;
  }, {});
  return <div className="lanClubGroups">{Object.entries(grouped).map(([country, clubs]) => <div key={country} className="lanClubGroup"><b>{country}</b><div>{clubs.map((club) => <button key={club.key} disabled={disabled || otherValue === club.key} className={value === club.key ? "active" : ""} onClick={() => onChange(club.key)} type="button"><span style={{ background: club.color }} /> <strong>{club.name}</strong><small>{club.style}{otherValue === club.key ? " · dipakai lawan" : ""}</small></button>)}</div></div>)}</div>;
}
function LanMultiplayerScreen({ onBack, helpMode, notify }) {
  const [clientId] = useState(() => getLanClientId());
  const [name, setName] = useState(() => localStorage.getItem("bola-catur-lan-name") || "Pemain");
  const [codeInput, setCodeInput] = useState(() => new URLSearchParams(window.location.search).get("lanRoom") || "");
  const [roomCode, setRoomCode] = useState(() => new URLSearchParams(window.location.search).get("lanRoom") || "");
  const [room, setRoom] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const side = playerSideInRoom(room, clientId);
  const isHost = room?.hostClientId === clientId;
  const inviteLink = roomCode ? `${window.location.origin}${window.location.pathname}?lanRoom=${roomCode}` : "";
  const homeClub = room?.players?.home?.clubKey || "man-city";
  const awayClub = room?.players?.away?.clubKey || "real-madrid";
  const visibleGame = room?.match?.game && side ? { ...room.match.game, userSide: side, helpMode: false, friendly: true, lan: true } : null;

  const saveName = (v) => { setName(v); try { localStorage.setItem("bola-catur-lan-name", v); } catch {} };
  const loadRoom = useCallback(async (code = roomCode) => {
    if (!code) return;
    try {
      const data = await lanApi(`/rooms/${String(code).trim().toUpperCase()}`);
      setRoom(data.room);
      setRoomCode(data.room.code);
      setError("");
    } catch (e) { setError(e.message); }
  }, [roomCode]);

  useEffect(() => { lanApi("/meta").then((d) => setMeta(d)).catch(() => setMeta(null)); }, []);
  useEffect(() => {
    if (!roomCode) return undefined;
    loadRoom(roomCode);
    const timer = window.setInterval(() => loadRoom(roomCode), visibleGame ? 300 : 1100);
    return () => window.clearInterval(timer);
  }, [roomCode, loadRoom, Boolean(visibleGame)]);
  useEffect(() => {
    if (!roomCode || !isHost || !visibleGame || visibleGame.mode !== "realtimeSoccer" || visibleGame.ended || visibleGame.goalPause || visibleGame.rt?.paused) return undefined;
    const timer = window.setInterval(async () => {
      try {
        const next = tickRealtimeSoccer({ ...visibleGame, userSide: "home" }, 0.34);
        const data = await lanApi(`/rooms/${roomCode}/sync`, { clientId, baseRevision: room?.match?.revision || 0, actionType: "hostTick", game: { ...next, userSide: "home" }, eventText: "Host authoritative tick." });
        setRoom(data.room);
      } catch (e) {
        if (String(e?.message || "").includes("Sinkron") || String(e?.message || "").includes("Room sudah berubah")) loadRoom(roomCode);
      }
    }, 340);
    return () => window.clearInterval(timer);
  }, [roomCode, isHost, visibleGame?.clockSeconds, visibleGame?.rt?.paused, visibleGame?.ended, visibleGame?.goalPause, room?.match?.revision]);
  useEffect(() => {
    if (!visibleGame || visibleGame.ended || visibleGame.goalPause || visibleGame.turn !== side) return;
    const carrier = getPiece(visibleGame, visibleGame.ballOwnerId);
    if (carrier?.side === side) setSelectedId(carrier.id);
  }, [room?.match?.revision, side]);

  const createRoom = async () => {
    setBusy(true); setError("");
    try {
      const data = await lanApi("/rooms", { clientId, name });
      setRoom(data.room); setRoomCode(data.room.code); setCodeInput(data.room.code);
      notify?.(`Room LAN ${data.room.code} dibuat. Bagikan kode/link ke teman.`, "success");
    } catch (e) { setError(e.message); }
    setBusy(false);
  };
  const joinRoom = async () => {
    const code = String(codeInput || roomCode).trim().toUpperCase();
    if (!code) { setError("Kode room masih kosong."); return; }
    setBusy(true); setError("");
    try {
      const data = await lanApi(`/rooms/${code}/join`, { clientId, name });
      setRoom(data.room); setRoomCode(code);
      notify?.(data.side ? "Kamu sudah ada di room." : "Invitation dikirim. Tunggu host accept.", "info");
    } catch (e) { setError(e.message); }
    setBusy(false);
  };
  const acceptInvite = async (inviteClientId) => {
    setBusy(true); setError("");
    try { const data = await lanApi(`/rooms/${roomCode}/accept`, { clientId, inviteClientId }); setRoom(data.room); notify?.("Invitation diterima. Kedua pemain masuk room.", "success"); }
    catch (e) { setError(e.message); }
    setBusy(false);
  };
  const setClub = async (clubKey) => {
    if (!side) return;
    setError("");
    try { const data = await lanApi(`/rooms/${roomCode}/club`, { clientId, clubKey }); setRoom(data.room); }
    catch (e) { setError(e.message); }
  };
  const startLanMatch = async () => {
    if (!isHost || !room?.players?.away) return;
    setBusy(true); setError("");
    try {
      const game = makeLanMatch(homeClub, awayClub, "home", helpMode);
      const data = await lanApi(`/rooms/${roomCode}/start`, { clientId, game });
      setRoom(data.room); setSelectedId(data.room.match?.game?.ballOwnerId || null);
      notify?.("Match LAN dimulai. Giliran akan sinkron lewat room lokal.", "success");
    } catch (e) { setError(e.message); }
    setBusy(false);
  };
  const syncAction = async (action) => {
    if (!visibleGame || !side) return;
    if (visibleGame.mode !== "realtimeSoccer" && visibleGame.turn !== side && action.type !== "resumeGoal") { notify?.("Belum giliran kamu.", "warn"); return; }
    const next = visibleGame.mode === "realtimeSoccer" ? applyRealtimeAction({ ...visibleGame, userSide: side }, action) : applyAction(visibleGame, action);
    try {
      const data = await lanApi(`/rooms/${roomCode}/sync`, { clientId, baseRevision: room?.match?.revision || 0, actionType: action.type, playerSide: side, game: { ...next, userSide: "home" }, eventText: next.lastAction || "Aksi match LAN." });
      setRoom(data.room);
    } catch (e) { setError(e.message); if (e?.message?.includes("Sinkron") || e?.message?.includes("Room sudah berubah")) loadRoom(roomCode); }
  };

  if (visibleGame) {
    return <main className="lanPage"><section className="lanHeader"><div><p className="eyebrow">Multiplayer LAN · Room {roomCode}</p><h1>{room.players?.home?.name} vs {room.players?.away?.name}</h1><p>Player {sideLabel(side)} · {visibleGame.homeName} vs {visibleGame.awayName}. Tidak ada coach; masing-masing pemain kontrol klubnya sendiri.</p></div><button className="ghost" onClick={() => setRoom((r) => ({ ...r, match: null, status: "accepted" }))}>Kembali Lobby</button></section><MatchTab active={{ week: 0, fixture: null, game: visibleGame }} selectedId={selectedId} setSelectedId={setSelectedId} onAction={syncAction} finishWeek={() => notify?.("Match LAN selesai. Kamu bisa keluar atau rematch dari lobby.", "success")} startMatch={() => {}} aiPaused={false} setAiPaused={() => {}} helpMode={false} /></main>;
  }

  return <main className="lanPage">
    <section className="lanHero card">
      <button className="ghost" onClick={onBack}>← Kembali</button>
      <div><p className="eyebrow">Multiplayer Jaringan Lokal</p><h1>Bikin Room / Lawan Kawan LAN</h1><p>Host jalankan <b>npm run lan</b>, lalu teman yang satu WiFi membuka alamat <b>LAN</b>, bukan 127.0.0.1. Host harus accept invitation sebelum teman masuk room.</p></div>
      <div className="lanAddressBox"><b>Alamat server</b><span>Local: {meta?.local || "http://127.0.0.1:8080"}</span>{(meta?.lan || []).length ? meta.lan.map((u) => <span key={u}>LAN: {u}</span>) : <span>LAN: cek terminal setelah npm run lan</span>}<small>Teman buka alamat LAN yang muncul di terminal host.</small></div>
    </section>
    {error ? <div className="alertBox errorBox">{error}</div> : null}
    <section className="lanGrid">
      <Card><h3>1. Nama Pemain</h3><label className="fieldLabel">Nama kamu<input value={name} onChange={(e) => saveName(e.target.value)} placeholder="Nama pemain" /></label><div className="lanActions"><button className="primary" disabled={busy} onClick={createRoom}>Host Buat Room</button><div className="joinBox"><input value={codeInput} onChange={(e) => setCodeInput(e.target.value.toUpperCase())} placeholder="Kode room" maxLength={5} /><button className="ghost" disabled={busy} onClick={joinRoom}>Join</button></div></div></Card>
      <Card><h3>2. Status Room</h3>{room ? <div className="roomStatus"><b>Kode: {room.code}</b><small>Status: {room.status}</small><small>Host: {room.players?.home?.name || "-"}</small><small>Away: {room.players?.away?.name || "menunggu accept"}</small>{inviteLink ? <button className="ghost full" onClick={() => navigator.clipboard?.writeText(inviteLink)}>Copy Invite Link</button> : null}{isHost && room.pending?.length ? <div className="pendingBox"><b>Invitation masuk</b>{room.pending.map((p) => <button key={p.clientId} className="primary full" onClick={() => acceptInvite(p.clientId)}>Accept {p.name}</button>)}</div> : null}{!side && roomCode ? <p className="muted">Invitation sudah dikirim. Tunggu host menekan Accept.</p> : null}</div> : <p className="muted">Belum ada room. Buat room sebagai host atau join kode teman.</p>}</Card>
    </section>
    {room && side ? <section className="lanLobby card"><div className="sectionHead"><h2>3. Pilih Klub</h2><p>Klub dan nama pemain asli khusus mode LAN. Tidak ada coach. Rating tetap diseimbangkan agar duel fair.</p></div><div className="lanPlayers"><div><b>Home · {room.players?.home?.name}</b><LANClubSelect value={homeClub} otherValue={awayClub} onChange={setClub} disabled={side !== "home"} /></div><div><b>Away · {room.players?.away?.name || "Belum accepted"}</b>{room.players?.away ? <LANClubSelect value={awayClub} otherValue={homeClub} onChange={setClub} disabled={side !== "away"} /> : <p className="muted">Tunggu host accept invitation teman.</p>}</div></div><div className="lanStartBar"><span>{isHost ? "Host bisa mulai setelah kedua pemain memilih klub." : "Tunggu host memulai match."}</span><button className="primary big" disabled={!isHost || !room.players?.away || busy} onClick={startLanMatch}>Mulai Match LAN</button></div></section> : null}
    {room?.events?.length ? <section className="card"><h3>Log Room</h3><div className="worldFeed">{room.events.slice(0, 8).map((e) => <div key={e.id}><b>{e.text}</b><small>{new Date(e.at).toLocaleTimeString("id-ID")}</small></div>)}</div></section> : null}
  </main>;
}

function Notice({ notice }) { return <div className={`notice ${notice.type}`}>{notice.text}</div>; }
function Stat({ label, value }) { return <div className="stat"><b>{value}</b><span>{label}</span></div>; }
function Card({ children, className = "", style }) { return <div className={`card ${className}`} style={style}>{children}</div>; }
function Section({ title, sub, children }) { return <section className="section"><div className="sectionHead"><h2>{title}</h2>{sub && <p>{sub}</p>}</div>{children}</section>; }

function Dashboard({ team, rank, week, season, cash, fixture, teams, startMatch, active, facilities, trainingPlan, objectives, objectiveCtx, claimed, startFriendly }) {
  const home = fixture && (teams.find((t) => t.id === fixture.homeId) || { id: fixture.homeId, name: fixture.homeName || "World Invite", style: "World", rivalId: null });
  const away = fixture && (teams.find((t) => t.id === fixture.awayId) || { id: fixture.awayId, name: fixture.awayName || "World Invite", style: "World", rivalId: null });
  const isHome = fixture?.homeId === MY_TEAM_ID;
  const completedCount = objectives.filter((o) => claimed.includes(o.key) || objectiveComplete(o, objectiveCtx)).length;
  return <Section title="Dashboard" sub="Sekarang setiap pekan adalah pertandingan taktik playable dengan AP, skill, kartu taktik, stamina, kartu merah, cedera, ekonomi, dan target season.">
    <div className="dashboardGrid">
      <Card className="heroCard"><h3>{team.name}</h3><p>{team.city} · {leagueName(team.leagueKey)} · Season {season} · Rank #{rank} · Career dimulai dari Liga Championship.</p><div className="heroNumbers"><span><b>{money(cash)}</b><small>Kas awal 50 ribu</small></span><span><b>{team.gf}-{team.ga}</b><small>Gol</small></span><span><b>{team.pts}</b><small>Poin</small></span><span><b>{team.numberOneTitles || 0}</b><small>NO.1</small></span></div><div className="homeActions"><button className="primary" onClick={startMatch}>{active ? "Kembali ke Match" : "Main Pekan Ini"}</button><button className="ghost" onClick={startFriendly}>Quick Match</button></div></Card>
      <Card><h3>Jadwal Pekan {week}</h3>{fixture ? <div className="fixtureBig"><b>{home.name}</b><strong>vs</strong><b>{away.name}</b><small className={isHome ? "good" : "muted"}>{fixture.cupName || leagueName(fixture.leagueKey)} · {fixture.stage || "League"} · {isHome ? "HOME value aktif" : "AWAY"}</small><small>{home.rivalId === away.id ? "🔥 DERBY: emosi, kartu, bonus fanbase lebih tinggi." : `${home.style} vs ${away.style}`}</small></div> : <p className="muted">Tidak ada match user. Tombol Main Pekan akan memproses rest/event week.</p>}</Card>
      <Card><h3>Persiapan</h3><div className="infoGrid"><span>Latihan</span><b>{TRAINING_PLANS[trainingPlan].icon} {TRAINING_PLANS[trainingPlan].label}</b><span>Stadion</span><b>Lv {facilities.stadium}</b><span>Training</span><b>Lv {facilities.training}</b><span>Medical</span><b>Lv {facilities.medical}</b></div></Card>
      <Card><h3>Board Vision</h3><p className="muted">Target hanya arah musim. Tidak ada penyelesaian/reward objective otomatis.</p>{objectives.slice(0, 3).map((o) => <ProgressLine key={o.key} label={o.title} value={objectiveProgress(o, objectiveCtx)} target={o.target} done={false} />)}</Card>
    </div>
  </Section>;
}
function ProgressLine({ label, value, target, done }) { const pct = clamp((value / target) * 100, 0, 100); return <div className="progressLine"><span>{label}</span><b>{done ? "Diklaim" : `${Math.min(value, target)}/${target}`}</b><i><em style={{ width: `${pct}%` }} /></i></div>; }
function TrainingTab({ trainingPlan, setTrainingPlan, facilities, team, week }) {
  const trainingLv = facilities?.training || 1;
  const academyLv = facilities?.academy || 1;
  const seniorCount = team?.players?.filter((p) => !p.academy).length || 0;
  const youthCount = team?.players?.filter((p) => p.academy || p.age <= 20).length || 0;
  const plan = TRAINING_PLANS[trainingPlan] || TRAINING_PLANS.balanced;
  const estimatedXp = 7 + trainingLv * 5 + (plan.morale ? 2 : 0);
  const academyXp = 4 + academyLv * 6;
  return <Section title="Latihan Mingguan" sub="Latihan sekarang benar-benar menaikkan EXP pemain saat 1 pekan terlewati. Hanya satu fokus aktif per pekan.">
    <div className="trainingSummary">
      <Card><h3>Fokus Pekan {week}</h3><p className="bigText">{plan.icon} {plan.label}</p><small>{plan.desc}</small></Card>
      <Card><h3>Training Ground</h3><div className="infoGrid"><span>Level</span><b>{trainingLv}/3</b><span>Estimasi EXP senior</span><b>+{estimatedXp} s/d +{estimatedXp + 16}</b><span>Pemain senior</span><b>{seniorCount}</b></div></Card>
      <Card><h3>Akademi</h3><div className="infoGrid"><span>Level</span><b>{academyLv}/3</b><span>EXP youth mingguan</span><b>+{academyXp} s/d +{academyXp + 26}</b><span>Talenta muda</span><b>{youthCount}</b></div></Card>
    </div>
    <div className="cardsGrid">{Object.entries(TRAINING_PLANS).map(([key, item]) => <button key={key} className={`trainingCard ${trainingPlan === key ? "active" : ""}`} onClick={() => setTrainingPlan(key)}><strong>{item.icon}</strong><b>{item.label}</b><span>{item.desc}</span><small>EXP diproses saat lanjut pekan · boost dipengaruhi Training Ground Lv {trainingLv}</small></button>)}</div>
    <Card className="tipCard"><h3>Catatan penting</h3><p>Jika EXP penuh, stat dan rating bisa naik. Pemain muda mendapat jalur tambahan dari Akademi, sedangkan pemain senior lebih kuat dari Training Ground. Fokus finishing/shooting sekarang masuk ke stat tembak.</p></Card>
  </Section>;
}

function PreMatchTab({ preMatch, teams, formation, setFormation, lineupOverrides, setLineupOverrides, setTeamStyle, trainingPlan, setTrainingPlan, facilities, beginMatch, beginSim, cancel }) {
  const { fixture, userSide } = preMatch;
  const homeTeam = teamForFixture(teams, fixture.homeId, preMatch.season || 1, fixture.stage);
  const awayTeam = teamForFixture(teams, fixture.awayId, preMatch.season || 1, fixture.stage);
  const userTeam = userSide === "home" ? homeTeam : awayTeam;
  const enemyTeam = userSide === "home" ? awayTeam : homeTeam;
  const enemyFormation = enemyTeam.preferredFormation || "4-3-3";
  const userLineup = pickLineup(userTeam, formation, lineupOverrides);
  const enemyLineup = pickLineup(enemyTeam, enemyFormation, {});
  const [selectedSlot, setSelectedSlot] = useState(0);
  const selected = userLineup[selectedSlot];
  const usedIds = new Set(userLineup.map((x) => x.player.id));
  const bench = userTeam.players.filter((p) => !usedIds.has(p.id) && p.injuredWeeks <= 0 && p.bannedWeeks <= 0).sort((a, b) => b.overall - a.overall);
  const changePlayer = (playerId) => setLineupOverrides((old) => ({ ...old, [selectedSlot]: playerId }));
  return <Section title="Pre-Match Formasi" sub="Klik MAIN PEKAN sekarang masuk ke ruang formasi dulu. Cek starting XI lawan, ubah formasi, ganti pemain dengan cadangan, pilih training plan, lalu mulai match.">
    <div className="preMatchHero card"><div><p className="eyebrow">{fixture.cupName || leagueName(fixture.leagueKey) || "Liga"} · {fixture.stage || "Matchday"}</p><h3>{homeTeam.name} vs {awayTeam.name}</h3><p>{userSide === "home" ? "Kamu HOME" : "Kamu AWAY"} · Lawan gaya {enemyTeam.style} · Kick-off/restart dimulai dari penyerang, tetapi seluruh starting XI tetap di area sendiri sebelum garis tengah.</p></div><div className="preMatchActions"><button className="ghost" onClick={cancel}>Batal</button><button className="ghost big simStart" onClick={beginSim}>📺 Main Simulate</button><button className="primary big" onClick={beginMatch}>Mulai Main</button></div></div>
    <div className="preMatchGrid">
      <Card><h3>Tim Kamu · {formation}</h3><div className="formationButtons compact">{Object.keys(FORMATIONS).map((f) => <button key={f} className={formation === f ? "active" : ""} onClick={() => { setFormation(f); setSelectedSlot(0); }}>{f}</button>)}</div><MiniPitch formation={formation} lineup={userLineup} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} /></Card>
      <Card><h3>Starting XI Kamu</h3><div className="lineupList editable">{userLineup.map(({ player, slot, manual }, idx) => <button key={`${slot.pos}-${player.id}-${idx}`} className={idx === selectedSlot ? "active" : ""} onClick={() => setSelectedSlot(idx)}><b>{slot.pos}</b><span>{player.name}</span><small>{manual ? "Manual" : player.trait}</small><strong>{player.overall}</strong></button>)}</div></Card>
      <Card><h3>Cadangan untuk {selected?.slot.pos}</h3><p className="muted">Pilih pengganti sebelum match dimulai. Cedera/sanksi tidak tampil.</p><div className="benchList">{bench.slice(0, 18).map((p) => <button key={p.id} onClick={() => changePlayer(p.id)}><b>{p.pos}</b><span>{p.name}</span><small>{traitText(p.trait)} · {roleSkillText(p.pos)}</small><strong>{p.overall}</strong></button>)}</div></Card>
      <Card><h3>Lawan · {enemyFormation}</h3><MiniPitch formation={enemyFormation} lineup={enemyLineup} /><div className="lineupList compactList">{enemyLineup.map(({ player, slot }, idx) => <div key={`${slot.pos}-${player.id}-${idx}`}><b>{slot.pos}</b><span>{player.name}</span><small>{player.trait}</small><strong>{player.overall}</strong></div>)}</div></Card>
      <Card><h3>Gaya Main</h3><p className="muted">Style mengubah off-ball, press, passing, shot, dan risiko AI teammate.</p><div className="formationButtons styleButtons">{Object.keys(STYLE_PROFILES).map((style) => <button key={style} className={userTeam.style === style ? "active" : ""} onClick={() => setTeamStyle(style)}>{style}<small>{STYLE_PROFILES[style].tempo}</small></button>)}</div></Card>
      <Card><h3>Latihan Pekan Ini</h3><div className="formationButtons styleButtons">{Object.entries(TRAINING_PLANS).map(([key, plan]) => <button key={key} className={trainingPlan === key ? "active" : ""} onClick={() => setTrainingPlan(key)}>{plan.icon} {plan.label}<small>{plan.desc}</small></button>)}</div><div className="infoGrid"><span>Training Ground</span><b>Lv {facilities.training}</b><span>Medical</span><b>Lv {facilities.medical}</b><span>Academy</span><b>Lv {facilities.academy}</b></div></Card>
    </div>
  </Section>;
}


function RealtimeSoccerMatch({ active, selectedId, setSelectedId, onAction, finishWeek, aiPaused, setAiPaused, helpMode = false }) {
  const game = active.game;
  const selected = getPiece(game, selectedId || game.rt?.selectedId) || rtNearestToBall(game, game.userSide);
  const carrier = getPiece(game, game.ballOwnerId);
  const userCarrier = carrier?.side === game.userSide ? carrier : null;
  const canControl = !game.ended && !game.goalPause && !game.rt?.paused;
  const passTargets = userCarrier ? rtTeam(game, game.userSide).filter((p) => p.id !== userCarrier.id && p.role !== "GK").map((p) => ({ p, d: rtDist(userCarrier, p), forward: (p.ry - userCarrier.ry) * (userCarrier.side === "home" ? -1 : 1) })).sort((a, b) => (b.forward - a.forward) || (a.d - b.d)).slice(0, 5) : [];
  const [subOpen, setSubOpen] = useState(false);
  const viewMode = game.rt?.viewMode || "normal";
  const switchTarget = rtSwitchTarget(game, game.userSide, selected?.id || game.rt?.selectedId);
  const handleSwitch = () => { if (switchTarget) setSelectedId(switchTarget.id); onAction({ type: "switchPlayer", currentId: selected?.id || game.rt?.selectedId }); };
  const handleKeeperRush = () => { const k = rtKeeperFor(game, game.userSide); if (k) setSelectedId(k.id); onAction({ type: "keeperRush" }); };
  const keeperRushActive = rtKeeperRushActive(game, game.userSide);
  return <Section title="Real-Time Football v14 Pro AI Fast Match" sub="Bola out/in aktif, kick-off aman di area sendiri, 1 menit game ≈ 1 detik real-time, stamina memengaruhi gerak, dan substitution dibatasi 3 pemain.">
    <div className={`realMatchLayout proMobile ${viewMode === "3d" ? "view3d" : "view2d"}`}>
      <Card className="realPitchCard">
        <div className="realTopHud">
          <div><b>{game.homeName}</b><small>{game.homeFormation} · {game.homeStyle}</small></div>
          <strong><small>{formatClock(game)} {game.extraTimeStarted ? "· ET" : ""}</small>{game.score.home} - {game.score.away}</strong>
          <div><b>{game.awayName}</b><small>{game.awayFormation} · {game.awayStyle}</small></div>
        </div>
        <div className="landscapeHint">Putar ke landscape untuk kontrol match paling nyaman</div>{game.rt?.ballState && (game.rt.ballState.until || 0) > rtLiveNow(game) && <div className={`ballStateChip ${game.rt.ballState.type}`}>{game.rt.ballState.label}<small>{game.rt.ballState.restart || "live"}</small></div>}
        <RealFloatingInfo game={game} selected={selected} carrier={carrier} keeperRushActive={keeperRushActive} />
        <RealtimeStaminaDock game={game} selected={selected} />
        {game.goalPause && <GoalOverlay game={game} onResume={() => onAction({ type: "resumeGoal" })} />}
        <RealtimePitch game={game} selectedId={selectedId || game.rt?.selectedId} setSelectedId={setSelectedId} onAction={onAction} canControl={canControl} viewMode={viewMode} />
        {!game.ended && <div className="mobileGamepad">
          <VirtualStick game={game} selected={selected} canControl={canControl} onAction={onAction} />
          <div className="mobileActionCluster v12Cluster">
            <button className="switchBtn" disabled={!canControl || !switchTarget} onClick={handleSwitch}>🔄<span>Switch</span></button>
            <button className="keeperBtn" disabled={!canControl} onClick={handleKeeperRush}>🧤<span>Kiper</span></button>
            <button className="skillBtn" disabled={!canControl || !userCarrier} onClick={() => onAction({ type: "skill", pieceId: userCarrier?.id })}>✨<span>Skill</span></button>
            <button disabled={!canControl || !userCarrier} onClick={() => onAction({ type: "through", pieceId: userCarrier?.id })}>🪄<span>Through</span></button>
            <button className="shootButton" disabled={!canControl || !userCarrier} onClick={() => onAction({ type: "shoot", pieceId: userCarrier?.id })}>🥅<span>Shoot</span></button>
            <button disabled={!canControl || !userCarrier} onClick={() => onAction({ type: "pass", pieceId: userCarrier?.id })}>🎯<span>Pass</span></button>
            <button disabled={!canControl || !selected || carrier?.side === game.userSide} onClick={() => onAction({ type: "tackle", pieceId: selected?.id })}>⚔️<span>Tackle</span></button>
          </div>
        </div>}
      </Card>

      <Card className="realControlsPanel proControlPanel">
        <div className="realSelectedCard">
          <b>{selected ? `${selected.role} ${selected.name}` : "Pilih pemain"}</b>
          <small>{selected ? `${selected.trait || "-"} · OVR ${selected.overall} · Energy ${Math.round(selected.energy || 80)}%` : "Tap pemain di lapangan atau tombol switch."}</small>
          <span>{carrier ? `Bola: ${carrier.role} ${firstName(carrier.name)} (${sideLabel(carrier.side)})` : "Bola liar"}</span>
        </div>
        <div className="realManagerBar">
          {game.rt?.paused ? <button className="primary" onClick={() => onAction({ type: "start" })}>▶️ START</button> : <button className="ghost" onClick={() => onAction({ type: "pause" })}>⏸️ PAUSE</button>}
          <button className="ghost" onClick={() => setSubOpen(true)}>🔁 Ganti {game.subCount?.[game.userSide] || 0}/3</button><button className="dangerBtn" disabled={game.ended} onClick={() => onAction({ type: "surrender" })}>🏳️ Surrender</button>
          <button className="ghost" disabled={!canControl || !switchTarget} onClick={handleSwitch}>🔄 Switch</button>
          <button className={viewMode === "normal" ? "active" : ""} onClick={() => onAction({ type: "toggleView", viewMode: "normal" })}>2D</button>
          <button className={viewMode === "3d" ? "active" : ""} onClick={() => onAction({ type: "toggleView", viewMode: "3d" })}>3D</button>
        </div>
        {game.rt?.paused && <div className="realHelpBox startHint"><b>Match belum jalan</b><span>Tekan START. Pakai stick kiri untuk gerak pemain terpilih. AI v14 menjaga gaya main, role, compactness, pressing, keeper rush, switch dekat bola, out/in, dan stamina.</span></div>}
        <div className="realActionGrid console">
          <button disabled={!canControl || !selected} onClick={() => onAction({ type: "sprint", pieceId: selected?.id })}>💨 Sprint<small>Boost pendek</small></button>
          <button disabled={!canControl || !switchTarget} onClick={handleSwitch}>🔄 Switch<small>{switchTarget ? `${switchTarget.role} ${firstName(switchTarget.name)}` : "dekat bola"}</small></button>
          <button className={keeperRushActive ? "keeperActive" : ""} disabled={!canControl} onClick={handleKeeperRush}>🧤 Kiper Maju<small>{keeperRushActive ? "rush aktif" : "intercept"}</small></button>
          <button disabled={!canControl || !userCarrier} onClick={() => onAction({ type: "skill", pieceId: userCarrier?.id })}>✨ Skill<small>Dribble move</small></button>
          <button disabled={!canControl || !userCarrier} onClick={() => onAction({ type: "pass", pieceId: userCarrier?.id })}>🎯 Pass<small>target aman</small></button>
          <button disabled={!canControl || !userCarrier} onClick={() => onAction({ type: "through", pieceId: userCarrier?.id })}>🪄 Through<small>umpan ruang</small></button>
          <button className="shootButton" disabled={!canControl || !userCarrier} onClick={() => onAction({ type: "shoot", pieceId: userCarrier?.id })}>🥅 Shoot<small>arah gawang</small></button>
          <button disabled={!canControl || !selected || carrier?.side === game.userSide} onClick={() => onAction({ type: "tackle", pieceId: selected?.id })}>⚔️ Tackle<small>rebut bola</small></button>
        </div>
        <RealQuickSwitch game={game} selectedId={selectedId || game.rt?.selectedId} setSelectedId={setSelectedId} />
        {passTargets.length > 0 && <div className="realPassTargets"><b>Target oper cepat</b>{passTargets.map(({ p, d, forward }) => <button key={p.id} disabled={!canControl || !userCarrier} onClick={() => onAction({ type: forward > 7 ? "through" : "pass", pieceId: userCarrier?.id, targetId: p.id })}><span>{p.role} {firstName(p.name)}</span><small>{Math.round(d)}m · {forward > 7 ? "lari ke ruang" : "aman"}</small></button>)}</div>}
        <h3>Kartu Taktik</h3><div className="tacticHand compactCards">{game.userCards?.map((c) => <button key={c.uid} disabled={!canControl} onClick={() => onAction({ type: "card", cardKey: c.key })}><b>{c.icon} {c.name}</b><small>{c.desc}</small></button>)}</div>
      </Card>

      <Card className="realScorePanel"><StatsBox game={game} />{game.ended && <MatchSummary game={game} finishWeek={finishWeek} />}<div className="history compactHistory">{game.history.slice(0, 7).map((h, i) => <div key={`${h.minute}-${i}`}><small>{h.minute}'</small><span>{h.icon}</span><p>{h.text}</p></div>)}</div></Card>
      {subOpen && <RealSubModal game={game} selected={selected} setSelectedId={setSelectedId} onAction={onAction} onClose={() => setSubOpen(false)} />}
    </div>
  </Section>;
}

function RealFloatingInfo({ game, selected, carrier, keeperRushActive }) {
  const low = rtTeam(game, game.userSide).filter((p) => rtAlive(game, p)).sort((a, b) => (a.energy || 80) - (b.energy || 80))[0];
  return <div className="realFloatingInfo">
    <span><b>{selected ? `${selected.role} ${firstName(selected.name)}` : "Pilih"}</b><small>OVR {selected?.overall || "-"} · STA {Math.round(selected?.energy || 0)}%</small></span>
    <span><b>{carrier ? `${carrier.role} ${firstName(carrier.name)}` : "Bola liar"}</b><small>{carrier ? sideLabel(carrier.side) : "loose ball"}</small></span>
    <span><b>Sub {game.subCount?.[game.userSide] || 0}/3</b><small>{keeperRushActive ? "Kiper maju aktif" : low ? `Stamina rendah: ${firstName(low.name)}` : "Shape normal"}</small></span>
  </div>;
}
function RealtimeStaminaDock({ game, selected }) {
  const mine = rtTeam(game, game.userSide).filter((p) => rtAlive(game, p));
  const low = mine.slice().sort((a, b) => (a.energy || 80) - (b.energy || 80)).slice(0, 4);
  const avg = Math.round(mine.reduce((sum, p) => sum + (p.energy || 80), 0) / Math.max(1, mine.length));
  const rows = selected && selected.side === game.userSide ? [selected, ...low.filter((p) => p.id !== selected.id).slice(0, 3)] : low;
  return <div className="realtimeStaminaDock">
    <div className="teamStamina"><b>Stamina Tim</b><i><em style={{ width: `${clamp(avg, 0, 100)}%` }} /></i><small>{avg}%</small></div>
    {rows.map((p) => <div key={p.id} className={`staminaChip ${selected?.id === p.id ? "active" : ""}`}><span>{p.role} {firstName(p.name)}</span><i><em style={{ width: `${clamp(p.energy || 0, 0, 100)}%` }} /></i><b>{Math.round(p.energy || 0)}%</b></div>)}
  </div>;
}
function StaminaMiniList({ game, side }) {
  const players = rtTeam(game, side).slice().sort((a, b) => (a.role === "GK" ? -1 : b.role === "GK" ? 1 : (a.energy || 80) - (b.energy || 80))).slice(0, 11);
  return <div className="simStaminaList">{players.map((p) => <div key={p.id} className="simStaminaRow"><span>{p.role} {firstName(p.name)}</span><b>{Math.round(p.energy || 0)}%</b><i><em style={{ width: `${clamp(p.energy || 0, 0, 100)}%` }} /></i></div>)}</div>;
}
function simTeamStats(game, side) {
  const stats = game.stats?.[side] || emptyStats();
  const other = game.stats?.[otherSide(side)] || emptyStats();
  const posTotal = (stats.possessionSeconds || stats.possession || 0) + (other.possessionSeconds || other.possession || 0);
  const possession = posTotal ? Math.round(((stats.possessionSeconds || stats.possession || 0) / posTotal) * 100) : 50;
  const chances = Math.max(0, Math.round((stats.xg || 0) * 1.8 + (stats.shots || 0) * 0.45));
  const passPct = stats.passes ? Math.round(((stats.passOk || 0) / stats.passes) * 100) : 84;
  return { possession, shots: stats.shots || 0, onTarget: stats.onTarget || 0, chances, xg: Math.round((stats.xg || 0) * 100) / 100, saves: stats.saves || 0, fouls: stats.fouls || 0, passPct };
}
function simGameplan(game, side) {
  const style = sideStyle(game, side);
  const map = {
    Possession: { build: "Short Build-Up", defend: "Balanced Press", tempo: "Patient", width: "Normal" },
    Counter: { build: "Counter", defend: "Mid Block", tempo: "Fast Break", width: "Wide" },
    "High Press": { build: "Vertical Press", defend: "High Line", tempo: "Aggressive", width: "Narrow" },
    "Park Bus": { build: "Safe Clearance", defend: "Low Block", tempo: "Slow", width: "Compact" },
    "All Out Attack": { build: "Direct Attack", defend: "Risky Press", tempo: "Very Fast", width: "Wide" },
    Balanced: { build: "Balanced", defend: "Balanced", tempo: "Normal", width: "Normal" },
  };
  return map[style] || map.Balanced;
}
function simPlayerRating(game, p) {
  const evs = (game.events || []).filter((e) => String(e.playerId || "") === String(p.playerId || "") || e.player === p.name);
  const goals = evs.filter((e) => e.type === "goal").length;
  const reds = evs.filter((e) => e.type === "red").length + (p.red ? 1 : 0);
  const yellows = p.yellow || evs.filter((e) => e.type === "yellow").length;
  const fitness = clamp(p.energy || 80, 0, 100);
  const roleBoost = ["ST", "CAM", "LW", "RW"].includes(p.role) ? goals * 1.15 : goals * 0.85;
  return clamp(Math.round((6 + (p.overall - 70) * 0.025 + (fitness - 70) * 0.012 + roleBoost - yellows * 0.18 - reds * 1.8) * 10) / 10, 4, 10);
}
function simShirtNo(p) { return p.shirtNumber || ((Number(p.playerId || p.id?.split("-").pop() || p.startingIndex || 0) % 98) + 1); }
function ManagerSimTeamPanel({ game, side, view }) {
  const teamName = side === "home" ? game.homeName : game.awayName;
  const formation = side === "home" ? game.homeFormation : game.awayFormation;
  const rows = rtTeam(game, side).filter((p) => !p.red || view !== "fitness").slice().sort((a, b) => (a.startingIndex ?? 99) - (b.startingIndex ?? 99));
  const stats = simTeamStats(game, side);
  const plan = simGameplan(game, side);
  const avgFit = Math.round(rows.reduce((sum, p) => sum + (p.energy || 80), 0) / Math.max(1, rows.length));
  return <aside className={`managerTeamPanel ${side}`}>
    <div className="managerPanelHead"><span>{side === "home" ? "●" : "●"}</span><b>{teamName}</b><small>{formation} · {sideStyle(game, side)}</small></div>
    {view === "stats" ? <div className="managerStatStack"><div><b>{stats.possession}%</b><span>Possession</span></div><div><b>{stats.shots}</b><span>Shots</span></div><div><b>{stats.chances}</b><span>Chances</span></div><div><b>{stats.xg}</b><span>xG</span></div><div><b>{stats.passPct}%</b><span>Pass</span></div></div> : view === "gameplan" ? <div className="managerPlanStack"><div><span>Formation</span><b>{formation}</b></div><div><span>Build-Up Style</span><b>{plan.build}</b></div><div><span>Defensive Approach</span><b>{plan.defend}</b></div><div><span>Tempo</span><b>{plan.tempo}</b></div><div><span>Width</span><b>{plan.width}</b></div><div><span>Avg Fitness</span><b>{avgFit}%</b></div></div> : <div className="managerPlayersList">
      <div className="managerListLabel"><b>Starting 11</b><small>{view === "ratings" ? "Rating" : "Fitness"}</small></div>
      {rows.map((p) => {
        const value = view === "ratings" ? simPlayerRating(game, p) : Math.round(p.energy || 0);
        const pct = view === "ratings" ? clamp(value * 10, 0, 100) : clamp(value, 0, 100);
        return <div key={p.id} className={`managerPlayerRow ${p.red ? "sentOff" : ""} ${value < (view === "ratings" ? 6 : 55) ? "low" : ""}`}><span>{simShirtNo(p)}</span><b>{firstName(p.name)}</b><small>{p.role}</small><strong>{view === "ratings" ? value.toFixed(1) : `${value}%`}</strong><i><em style={{ width: `${pct}%` }} /></i></div>;
      })}
    </div>}
  </aside>;
}
function ManagerSimPitch({ game }) {
  const latest = (game.events || []).slice(-1)[0];
  const latestPiece = latest?.playerId ? (game.pieces || []).find((p) => String(p.playerId) === String(latest.playerId)) : null;
  const ball = latestPiece || getPiece(game, game.ballOwnerId) || null;
  const bx = ball ? clamp(ball.rx ?? gridToFieldX(ball.x), 3, FIELD_W - 3) : FIELD_W / 2;
  const by = ball ? clamp(ball.ry ?? gridToFieldY(ball.y), 3, FIELD_H - 3) : FIELD_H / 2;
  const pieces = (game.pieces || []).filter((p) => rtAlive(game, p)).slice().sort((a, b) => (a.ry || 0) - (b.ry || 0));
  return <div className="managerSimPitch"><div className="mspHalf" /><div className="mspCircle" /><div className="mspBox top" /><div className="mspBox bottom" /><div className="mspGoal top" /><div className="mspGoal bottom" />
    {pieces.map((p) => {
      const left = `${(clamp(p.rx ?? gridToFieldX(p.x), 0, FIELD_W) / FIELD_W) * 100}%`;
      const top = `${(clamp(p.ry ?? gridToFieldY(p.y), 0, FIELD_H) / FIELD_H) * 100}%`;
      return <span key={p.id} className={`mspDot ${p.side} ${latestPiece?.id === p.id ? "hot" : ""}`} style={{ left, top }} title={`${p.role} ${p.name}`}><b>{simShirtNo(p)}</b></span>;
    })}
    <span className="mspBall" style={{ left: `${(bx / FIELD_W) * 100}%`, top: `${(by / FIELD_H) * 100}%` }}>⚽</span>
  </div>;
}
function ManagerMomentumBar({ game }) {
  const home = simTeamStats(game, "home");
  const away = simTeamStats(game, "away");
  const homeMomentum = clamp(50 + (home.shots - away.shots) * 3 + (home.xg - away.xg) * 8 + (home.possession - away.possession) * 0.2, 20, 80);
  return <div className="managerMomentum"><span>{game.homeName}</span><i><em style={{ width: `${homeMomentum}%` }} /></i><span>{game.awayName}</span></div>;
}
function ManagerSimTabs({ value, setValue }) {
  const tabs = [{ key: "fitness", label: "Fitness" }, { key: "ratings", label: "Ratings" }, { key: "stats", label: "Stats" }, { key: "gameplan", label: "Gameplan" }];
  return <div className="managerSimTabs">{tabs.map((t) => <button key={t.key} className={value === t.key ? "active" : ""} onClick={() => setValue(t.key)}>{t.label}</button>)}</div>;
}
function QuickSimMatch({ active, selectedId, setSelectedId, onAction, finishWeek }) {
  const game = active.game;
  const [subOpen, setSubOpen] = useState(false);
  const [view, setView] = useState("fitness");
  const selected = getPiece(game, selectedId) || rtTeam(game, game.userSide).find((p) => p.role !== "GK") || rtTeam(game, game.userSide)[0];
  const due = (game.sim?.timeline || []).filter((ev) => ev.min >= minuteOf(game)).slice(0, 5);
  const important = isImportantEliminationGame(game);
  const home = simTeamStats(game, "home");
  const away = simTeamStats(game, "away");
  return <Section title="Manager Simulation Match" sub="Tampilan simulasi diperbarui seperti layar manajer: scoreboard broadcast, daftar Starting XI, pitch taktik, Fitness/Ratings/Stats/Gameplan, timeline, dan kontrol pause-substitusi.">
    <div className="managerSimStage">
      <div className="managerBroadcastHud card">
        <div className="managerHudTeam"><b>{game.homeName}</b><small>{game.homeFormation} · {game.homeStyle}</small></div>
        <div className="managerHudScore"><span>{formatClock(game)} {game.extraTimeStarted ? "· ET" : important ? "· Big Match" : ""}</span><strong>{game.score.home} : {game.score.away}</strong>{game.penalty && <em>Pens {game.penalty.home}-{game.penalty.away}</em>}</div>
        <div className="managerHudTeam right"><b>{game.awayName}</b><small>{game.awayFormation} · {game.awayStyle}</small></div>
      </div>
      <div className="managerSimShell">
        <ManagerSimTeamPanel game={game} side="home" view={view} />
        <Card className="managerSimCenter">
          <div className="managerMiniStats"><div><b>{home.possession}</b><span>Possession %</span><b>{away.possession}</b></div><div><b>{home.shots}</b><span>Shots</span><b>{away.shots}</b></div><div><b>{home.chances}</b><span>Chances</span><b>{away.chances}</b></div></div>
          <ManagerSimPitch game={game} />
          <ManagerMomentumBar game={game} />
          <ManagerSimTabs value={view} setValue={setView} />
          <div className="managerControlDock">
            {game.ended ? <button className="primary" onClick={finishWeek}>Selesai & Lanjut Pekan</button> : game.sim?.paused ? <button className="primary" onClick={() => onAction({ type: "start" })}>▶️ Lanjut Sim</button> : <button className="ghost" onClick={() => onAction({ type: "pause" })}>⏸️ Pause</button>}
            <button className="ghost" disabled={game.ended} onClick={() => setSubOpen(true)}>🔁 Ganti Pemain {game.subCount?.[game.userSide] || 0}/3</button>
            <button className="ghost" disabled={game.ended} onClick={() => setView("gameplan")}>📋 Tactical View</button>
            <button className="dangerBtn" disabled={game.ended} onClick={() => onAction({ type: "surrender" })}>🏳️ Surrender 0:3</button>
          </div>
        </Card>
        <ManagerSimTeamPanel game={game} side="away" view={view} />
      </div>
      <div className="managerSimLower">
        <Card className="quickSimFeed managerFeed"><h3>Cuplikan Live</h3><div className="simTimeline">{game.history.slice(0, 12).map((h, i) => <div key={`${h.minute}-${i}`} className={i === 0 ? "hot" : ""}><small>{h.minute}'</small><b>{h.icon}</b><p>{h.text}</p></div>)}</div></Card>
        <Card><h3>Progress Aksi Berikutnya</h3>{due.length ? <div className="nextSimMoments">{due.map((ev) => <p key={ev.id}><b>{ev.min}'</b> {ev.type === "goal" ? "Potensi gol" : ev.type === "injury" ? "Risiko cedera" : ev.type === "sub" ? "Rencana pergantian" : ev.type === "yellow" || ev.type === "red" ? "Duel keras/kartu" : "Serangan/shot"} · {sideLabel(ev.side)}</p>)}</div> : <p className="muted">Menunggu aksi berikutnya...</p>}<div className="infoGrid"><span>Pergantian Home</span><b>{game.subCount?.home || 0}/3</b><span>Pergantian Away</span><b>{game.subCount?.away || 0}/3</b><span>Mode</span><b>{game.sim?.paused ? "Paused" : game.ended ? "Full Time" : "Live AI"}</b></div></Card>
        <Card><h3>Stamina Tim Kamu</h3><StaminaMiniList game={game} side={game.userSide} /></Card>
      </div>
    </div>
    {subOpen && <RealSubModal game={game} selected={selected} setSelectedId={setSelectedId} onAction={onAction} onClose={() => setSubOpen(false)} />}
  </Section>;
}
function VirtualStick({ game, selected, canControl, onAction }) {
  const [vec, setVec] = useState({ x: 0, y: 0, mag: 0 });
  const activeRef = React.useRef(false);
  const boxRef = React.useRef(null);
  const lastSendRef = React.useRef(0);
  const selectedIdRef = React.useRef(selected?.id);
  selectedIdRef.current = selected?.id;
  const sendStick = (v, force = false) => {
    if (!selectedIdRef.current || !canControl) return;
    const now = performance.now();
    if (!force && now - lastSendRef.current < 22) return;
    lastSendRef.current = now;
    onAction({ type: "stick", pieceId: selectedIdRef.current, x: v.x, y: v.y, mag: v.mag });
  };
  const calc = (e) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0, mag: 0 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const max = rect.width * 0.40;
    const d = Math.hypot(dx, dy);
    const raw = clamp(d / max, 0, 1);
    const dead = 0.055;
    const m = raw < dead ? 0 : clamp((raw - dead) / (1 - dead), 0, 1);
    return { x: d ? (dx / d) * m : 0, y: d ? (dy / d) * m : 0, mag: m };
  };
  useEffect(() => {
    if (!canControl || !selected?.id) return undefined;
    const id = setInterval(() => {
      if (!activeRef.current) return;
      sendStick(vec, true);
    }, 33);
    return () => clearInterval(id);
  }, [canControl, selected?.id, vec.x, vec.y, vec.mag]);
  const release = () => {
    activeRef.current = false;
    const zero = { x: 0, y: 0, mag: 0 };
    setVec(zero);
    sendStick(zero, true);
  };
  return <div className={`virtualStick proStick ${!canControl ? "disabled" : ""} ${vec.mag > RT_STICK_SPRINT_ZONE ? "sprint" : ""}`} ref={boxRef}
    onPointerDown={(e) => { activeRef.current = true; e.currentTarget.setPointerCapture?.(e.pointerId); const v = calc(e); setVec(v); sendStick(v, true); }}
    onPointerMove={(e) => { if (activeRef.current) { const v = calc(e); setVec(v); sendStick(v); } }}
    onPointerUp={release}
    onPointerCancel={release}
    onLostPointerCapture={release}>
      <i style={{ transform: `translate(calc(-50% + ${vec.x * 38}px), calc(-50% + ${vec.y * 38}px))` }} />
      <b>{vec.mag > RT_STICK_SPRINT_ZONE ? "SPRINT" : "STICK"}</b><small>{selected ? firstName(selected.name) : "Pilih"}</small>
    </div>;
}
function RealQuickSwitch({ game, selectedId, setSelectedId }) {
  const mine = rtSwitchCandidates(game, game.userSide).concat(rtTeam(game, game.userSide).filter((p) => p.role === "GK"));
  return <div className="realQuickSwitch"><b>Switch pemain dekat bola</b><div>{mine.map((p) => <button key={p.id} className={`${selectedId === p.id ? "active" : ""} ${game.ballOwnerId === p.id ? "carrier" : ""} ${p.role === "GK" ? "keeperChip" : ""}`} onClick={() => setSelectedId(p.id)}>{game.ballOwnerId === p.id ? "⚽" : p.role === "GK" ? "🧤" : "•"} {p.role} {firstName(p.name)}</button>)}</div></div>;
}
function RealSubModal({ game, selected, setSelectedId, onAction, onClose }) {
  const [outId, setOutId] = useState(selected?.side === game.userSide ? selected.id : rtTeam(game, game.userSide)[0]?.id);
  const [query, setQuery] = useState("");
  const outPiece = getPiece(game, outId);
  const q = query.trim().toLowerCase();
  const onField = rtTeam(game, game.userSide).filter((p) => p.role !== "GK" || (game.bench?.[game.userSide] || []).some((b) => b.pos === "GK"));
  const bench = (game.bench?.[game.userSide] || []).filter((p) => p && (p.injuredWeeks || 0) <= 0 && (p.bannedWeeks || 0) <= 0 && (!q || `${p.name} ${p.pos} ${p.trait || ""}`.toLowerCase().includes(q))).sort((a, b) => (outPiece ? benchFitScore(b, outPiece.role, outPiece.overall) - benchFitScore(a, outPiece.role, outPiece.overall) : b.overall - a.overall));
  const subLimit = (game.subCount?.[game.userSide] || 0) >= SUBSTITUTION_LIMIT;
  return <div className="modalOverlay realSubOverlay" onClick={onClose}><Card className="realSubModal" onClick={(e) => e.stopPropagation()}><div className="modalHeader"><div><h2>🔁 Ganti Pemain</h2><p>Pilih pemain keluar, cari cadangan, lalu masukkan. Bisa dilakukan saat pause.</p></div><button onClick={onClose}>✕</button></div>
    <div className="realSubGrid"><div><b>Pemain Lapangan</b><div className="subScroll fieldList">{onField.map((p) => <button key={p.id} className={outId === p.id ? "active" : ""} onClick={() => { setOutId(p.id); setSelectedId(p.id); }}><span>{p.role} {firstName(p.name)}</span><small>OVR {p.overall} · Energy {Math.round(p.energy || 80)}%</small></button>)}</div></div>
    <div><b>Cadangan</b><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama / posisi..." /><div className="subScroll benchListPro">{bench.map((p) => { const fit = outPiece ? benchFitScore(p, outPiece.role, outPiece.overall) : 0; const exact = outPiece && p.pos === outPiece.role; return <button key={p.id} disabled={subLimit || !outPiece} onClick={() => { onAction({ type: "sub", pieceId: outPiece.id, benchId: p.id }); onClose(); }}><span>{p.pos} {firstName(p.name)} <em>{exact ? "posisi asli" : fit > 0 ? "cocok" : "darurat"}</em></span><small>OVR {p.overall} · Fit {p.fitness || 90}% · skor cocok {fit}</small></button>; })}</div></div></div>
    {subLimit && <p className="dangerText">Batas pergantian 3 pemain sudah habis.</p>}
  </Card></div>;
}
function RealtimePitch({ game, selectedId, setSelectedId, onAction, canControl, viewMode = "normal" }) {
  const ball = game.ball || { x: FIELD_W / 2, y: FIELD_H / 2 };
  const pieces = (game.pieces || []).filter((p) => rtAlive(game, p));
  const sorted = pieces.slice().sort((a, b) => a.ry - b.ry);
  return <div className={`realPitch ${viewMode === "3d" ? "is3d" : "is2d"}`}>
    <div className="realHalfLine" /><div className="realCenterCircle" /><div className="realBox top" /><div className="realBox bottom" /><div className="realGoal top" /><div className="realGoal bottom" />
    {sorted.map((p) => {
      const left = `${clamp(p.rx ?? gridToFieldX(p.x), 0, FIELD_W)}%`;
      const top = `${(clamp(p.ry ?? gridToFieldY(p.y), 0, FIELD_H) / FIELD_H) * 100}%`;
      return <button key={p.id} className={`realPlayer ${p.side} ${p.side === game.userSide ? "mine" : ""} ${selectedId === p.id ? "selected" : ""} ${game.ballOwnerId === p.id ? "hasBall" : ""} ${p.vacant ? "vacant" : ""} ${viewMode === "3d" ? "stickman" : ""}`} style={{ left, top }} onClick={(e) => { e.stopPropagation(); if (p.side === game.userSide) setSelectedId(p.id); }}>
        {viewMode === "3d" ? <><i className="head" /><i className="body" /><i className="leg l1" /><i className="leg l2" /></> : <><b>{p.role}</b><small>{Math.round(p.overall)}</small></>}<span>{firstName(p.name)}</span><div className="rtEnergyBar"><i style={{ width: `${clamp(p.energy || 0, 0, 100)}%` }} /></div>{game.ballOwnerId === p.id && <em>⚽</em>}
      </button>;
    })}
    <span className={`realBall ${game.ballOwnerId ? "owned" : "free"}`} style={{ left: `${clamp(ball.x, 0, FIELD_W)}%`, top: `${clamp(ball.y, 0, FIELD_H) / FIELD_H * 100}%` }}>⚽</span>
  </div>;
}

function MatchTab({ active, selectedId, setSelectedId, onAction, finishWeek, startMatch, aiPaused, setAiPaused, helpMode = false, tutorialStep = null }) {
  if (!active) return <Section title="Match" sub="Belum ada pertandingan aktif."><Card className="empty"><h3>Belum mulai</h3><p>Klik MAIN PEKAN untuk membuka pertandingan playable.</p><button className="primary" onClick={startMatch}>Main Pekan</button></Card></Section>;
  const game = active.game;
  if (game.mode === "realtimeSoccer") return <RealtimeSoccerMatch active={active} selectedId={selectedId} setSelectedId={setSelectedId} onAction={onAction} finishWeek={finishWeek} aiPaused={aiPaused} setAiPaused={setAiPaused} helpMode={helpMode} />;
  if (game.mode === "quickSim") return <QuickSimMatch active={active} selectedId={selectedId} setSelectedId={setSelectedId} onAction={onAction} finishWeek={finishWeek} />;
  const humanTurn = game.turn === game.userSide && !game.ended && !game.goalPause;
  const selected = getPiece(game, selectedId);
  const carrier = getPiece(game, game.ballOwnerId);
  const runCells = selected ? legalRunCells(game, selected.id) : [];
  const passes = selected ? passOptions(game, selected.id, false) : [];
  const throughs = selected ? passOptions(game, selected.id, true) : [];
  const tackles = selected ? tackleOptions(game, selected.id) : [];
  const shot = selected ? shotInfo(game, selected.id) : { can: false, chance: 0 };
  const selectedTrap = selected ? trapInfo(game, selected) : null;
  const setPiece = game.setPiece ? setPieceInfo(game, game.setPiece) : null;
  const offBallRuns = selected && selected.id !== game.ballOwnerId ? legalRunCells(game, selected.id).slice().sort((a, b) => (goalDistance({ ...selected, x: a.x, y: a.y }) - goalDistance({ ...selected, x: b.x, y: b.y })) || a.cost - b.cost).slice(0, 4) : [];
  const switchOptions = openPlayRunSuggestions(game, game.userSide, 8);
  return <Section title="Live Match" sub={game.isDerby ? "🔥 Derby mode aktif: kartu, emosi, bonus pemasukan home lebih tinggi." : "Gameplay dibuat seperti catur bola: pilih pemain, baca peluang, pakai AP, lalu eksekusi."}>
    <div className="matchGridV5">
      <Card className="matchInfoDock">
        <div className="turnBox compact"><b>{game.ended ? "FULL TIME" : `${sideLabel(game.turn)} TURN`}</b><span>AP {game.ap}/{MAX_AP} · Jam {formatClock(game)} · Menit {minuteOf(game)}'</span>{helpMode ? <small>{game.turn !== game.userSide ? `AI plan: ${game.aiPlan}. Mereka akan mencari aksi paling efektif sesuai style.` : getCoachHint(game)}</small> : <small>Mode bantuan mati</small>}</div>
        <div className="carrierBox">Bola: <b>{carrier?.name}</b><small>{carrier?.teamName}</small></div>
        <div className="momentum"><span>Home <b>{game.momentum.home}</b></span><span>Away <b>{game.momentum.away}</b></span></div>
        <ActiveEffects game={game} />
        {!game.lan && <button className="ghost full" onClick={() => setAiPaused(!aiPaused)}>{aiPaused ? "Lanjutkan AI" : "Pause AI"}</button>}
      </Card>

      <Card className="boardCard boardFocus">
        <Scoreboard game={game} />
        <MatchFx fx={game.actionFx} />
        {game.goalPause && <GoalOverlay game={game} onResume={() => onAction({ type: "resumeGoal" })} />}
        <Board game={game} selectedId={selectedId} setSelectedId={setSelectedId} runCells={runCells} passes={passes} throughs={throughs} tackles={tackles} onAction={onAction} humanTurn={humanTurn} helpMode={helpMode} />
        {game.ended && <button className="primary full" onClick={finishWeek}>Simpan Hasil & Lanjut Pekan</button>}
      </Card>

      <Card className="actionDock">
        <h3>Aksi Utama</h3>
        <PlayerSwitchPanel game={game} selectedId={selectedId} setSelectedId={setSelectedId} humanTurn={humanTurn} switchOptions={switchOptions} onAction={onAction} />
        {setPiece && <SetPiecePanel game={game} info={setPiece} humanTurn={humanTurn} onAction={onAction} />}
        {selected ? <div className="selectedBox"><b>{selected.role} · {selected.name}</b><small>{selected.trait} · Energy {selected.energy}% · {selected.teamName}</small><div className="roleSkillLine" title={roleSkillDesc(selected)}>{roleSkillText(selected)}</div>
          {game.ballOwnerId === selected.id && selectedTrap?.label && <small className="trapHint">⚠️ {selectedTrap.label}. Cari support, skill, atau umpan pendek.</small>}
          {game.ballOwnerId === selected.id && <small className={`shotHint ${shot.can ? "ok" : "locked"}`}>{shot.can ? `${shot.label} · ${shot.chance}% · ${shotZoneText(shot)}` : `${shot.label}. Normal: 4 grid lurus / 3 grid samping.`}</small>}
          {game.ballOwnerId === selected.id && shot?.reasons?.length > 0 && <ChanceBreakdown title="Alasan Shot" reasons={shot.reasons} />}
          {tackles[0]?.reasons?.length > 0 && <ChanceBreakdown title="Alasan Tackle" reasons={tackles[0].reasons} />}
          <div className="actionButtons pro"><button className="shootButton" disabled={!shot.can || !humanTurn} title={shot.label} onClick={() => onAction({ type: "shoot", pieceId: selected.id })}>🥅 TEMBAK {shot.can ? `${shot.chance}%` : "-"}<small>{shot.can ? `${shot.label} · ${shot.cost}AP` : "Zona 4/3 atau skill"}</small></button><button disabled={!humanTurn || game.ballOwnerId !== selected.id || game.ap < 2} onClick={() => onAction({ type: "skill", pieceId: selected.id })}>✨ Skill<small>Buka shot +2 · 2AP</small></button>{tackles[0] && <button disabled={!humanTurn} onClick={() => onAction({ type: "tackle", pieceId: selected.id, targetId: tackles[0].target.id })}>⚔️ Tackle {tackles[0].chance}%<small>1AP</small></button>}<button disabled={!humanTurn} onClick={() => onAction({ type: "end" })}>⏭️ End<small>Turn</small></button></div>
          {game.ballOwnerId !== selected.id && <RunList title="Buka Ruang" piece={selected} cells={offBallRuns} onAction={onAction} humanTurn={humanTurn} />}
          {game.ballOwnerId === selected.id && <PassList title="Oper / Umpan Terbaik" options={passes} type="pass" piece={selected} onAction={onAction} humanTurn={humanTurn} />}
          {game.ballOwnerId === selected.id && <PassList title="Through Ball" options={throughs} type="through" piece={selected} onAction={onAction} humanTurn={humanTurn} />}
          <SubstitutionBox game={game} piece={selected} humanTurn={humanTurn} onAction={onAction} />
        </div> : <p className="muted">Pilih pemain kamu di papan. Opsi aksi akan muncul di sini.</p>}
        <h3>Kartu Taktik</h3><div className="tacticHand compactCards">{game.userCards?.map((c) => <button key={c.uid} disabled={!humanTurn} onClick={() => onAction({ type: "card", cardKey: c.key })}><b>{c.icon} {c.name}</b><small>{c.desc}</small></button>)}</div>
      </Card>

      <Card className="matchBottomDock"><StatsBox game={game} />{game.ended ? <MatchSummary game={game} finishWeek={finishWeek} /> : (helpMode || game.tutorial ? <TutorialMini /> : <div className="objectiveMini off"><b>Mode bantuan mati</b><span>Coach Hint tidak ditampilkan karena tidak dicentang sebelum mulai.</span></div>)}<div className="history compactHistory">{game.history.slice(0, 6).map((h, i) => <div key={`${h.minute}-${i}`}><small>{h.minute}'</small><span>{h.icon}</span><p>{h.text}</p></div>)}</div></Card>
    </div>
  </Section>;
}

function TutorialMini() { return <div className="tutorialMini"><b>🎓 Tutorial 3 menit</b><span>1. Pilih pemain. 2. Baca zona: hijau run, biru pass, kuning shot. 3. Bangun serangan sampai zona 4/3 grid. 4. Kalau terkepung, peluang oper turun besar. 5. GK hanya boleh maju 4 grid dari gawang dan semua gerakannya 2 AP.</span></div>; }
function ActiveEffects({ game }) { const all = ["home", "away"].flatMap((side) => (game.effects[side] || []).map((e) => ({ ...e, side }))); return <div className="effects">{all.length === 0 ? <small className="muted">Belum ada efek taktik aktif.</small> : all.map((e) => <span key={`${e.side}-${e.key}`}>{sideLabel(e.side)}: {EFFECT_LABELS[e.key] || e.key} ({e.ttl})</span>)}</div>; }

function ChanceBreakdown({ title, reasons }) {
  const rows = (reasons || []).filter((r) => r.value).slice(0, 8);
  if (!rows.length) return null;
  return <div className="chanceBreakdown"><b>{title}</b>{rows.map((r, i) => <span key={`${r.label}-${i}`} className={r.value >= 0 ? "plus" : "minus"}>{r.value > 0 ? "+" : ""}{r.value} {r.label}</span>)}</div>;
}
function SetPiecePanel({ game, info, humanTurn, onAction }) {
  if (!info) return null;
  return <div className="setPiecePanel"><b>🎲 Set Piece</b><span>{info.label} · Taker: {firstName(info.taker?.name)} · Target: {firstName(info.finisher?.name)}</span><ChanceBreakdown title="Alasan" reasons={info.reasons} /><button className="primary" disabled={!humanTurn || game.turn !== game.setPiece?.side} onClick={() => onAction({ type: "setpiece" })}>Eksekusi Set Piece</button></div>;
}
function PlayerSwitchPanel({ game, selectedId, setSelectedId, humanTurn, switchOptions, onAction }) {
  const carrier = getPiece(game, game.ballOwnerId);
  if (!humanTurn) return <div className="switchPanel"><b>Ganti pemain / Oper</b><small>Tunggu giliran kamu. Saat giliranmu, kamu bisa pilih pembawa bola atau gerakkan pemain tanpa bola.</small></div>;
  const mine = game.pieces.filter((p) => !p.red && p.side === game.userSide).sort((a, b) => (a.id === game.ballOwnerId ? -1 : b.id === game.ballOwnerId ? 1 : goalDistance(a) - goalDistance(b)));
  return <div className="switchPanel"><b>Ganti pemain / Oper</b><small>Pilih ⚽ untuk oper/tembak, atau pilih pemain lain untuk buka ruang dulu seperti AI.</small>
    <div className="switchChips">{mine.slice(0, 11).map((p) => <button key={p.id} className={`${selectedId === p.id ? "active" : ""} ${p.id === game.ballOwnerId ? "carrier" : ""}`} onClick={() => setSelectedId(p.id)}>{p.id === game.ballOwnerId ? "⚽ " : "🏃 "}{p.role} {firstName(p.name)}</button>)}</div>
    {carrier?.side === game.userSide && selectedId !== carrier.id && <button className="primary smallFull" onClick={() => setSelectedId(carrier.id)}>Oper dari {firstName(carrier.name)}</button>}
    {switchOptions?.length > 0 && <div className="supportSuggestions"><b>Rekomendasi buka ruang</b>{switchOptions.slice(0, 3).map((o) => <button key={`${o.piece.id}-${o.cell.x}-${o.cell.y}`} disabled={!humanTurn || game.ap < o.cell.cost} onClick={() => onAction({ type: "move", pieceId: o.piece.id, x: o.cell.x, y: o.cell.y })}>🏃 {o.piece.role} {firstName(o.piece.name)} ke {boardCellName(o.cell.x, o.cell.y)} <small>{o.cell.cost}AP</small></button>)}</div>}
  </div>;
}
function RunList({ title, piece, cells, onAction, humanTurn }) {
  if (!cells?.length) return null;
  return <div className="passList runList"><b>{title}</b>{cells.map((c) => <button key={`${piece.id}-${c.x}-${c.y}`} disabled={!humanTurn} onClick={() => onAction({ type: "move", pieceId: piece.id, x: c.x, y: c.y })}><span>Run ke {boardCellName(c.x, c.y)}</span><small>{c.cost}AP · pressure {Math.round(c.pressure || 0)}</small></button>)}</div>;
}
function SubstitutionBox({ game, piece, humanTurn, onAction }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("fit");
  if (!piece || piece.side !== game.userSide || game.ended || game.goalPause) return null;
  const allBench = (game.bench?.[piece.side] || []).filter((p) => p && (p.injuredWeeks || 0) <= 0 && (p.bannedWeeks || 0) <= 0);
  const fitOptions = compatibleBenchForPiece(game, piece);
  const q = query.trim().toLowerCase();
  const source = mode === "all" ? allBench.slice().sort((a, b) => b.overall - a.overall) : fitOptions;
  const options = source.filter((p) => !q || `${p.name} ${p.pos} ${p.trait || ""}`.toLowerCase().includes(q));
  if (!allBench.length) return <div className="subBox"><b>🔁 Substitution</b><small>Tidak ada pemain cadangan yang bisa masuk.</small></div>;
  const subLimit = (game.subCount?.[piece.side] || 0) >= SUBSTITUTION_LIMIT;
  return <div className="subBox subBoxPro"><b>🔁 Substitution {game.subCount?.[piece.side] || 0}/3</b><small>Cari semua pemain skuad yang tidak sedang di lapangan, scroll daftar, dan pilih yang posisinya paling cocok untuk {piece.role}. Pergantian tidak memakai AP, kecuali pemain normal keluar tetap memakan sedikit waktu.</small>
    <div className="subTools"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama / posisi..." /><div><button className={mode === "fit" ? "active" : ""} onClick={() => setMode("fit")}>Cocok Posisi</button><button className={mode === "all" ? "active" : ""} onClick={() => setMode("all")}>Semua Skuad</button></div></div>
    <div className="subScroll">{options.map((p) => { const fit = benchFitScore(p, piece.role, piece.overall); const exact = p.pos === piece.role; return <button key={p.id} disabled={!humanTurn || subLimit} onClick={() => onAction({ type: "sub", pieceId: piece.id, benchId: p.id })}><b>{p.pos} {firstName(p.name)}</b><span>{exact ? "✅ posisi asli" : (COMPATIBLE[piece.role] || []).includes(p.pos) ? "↔️ kompatibel" : "⚠️ darurat"}</span><small>OVR {p.overall} · Fit {p.fitness || 90}% · Skor cocok {fit}</small></button>; })}</div>
  </div>;
}
function MatchFx({ fx }) {
  if (!fx) return null;
  const short = String(fx.text || "").slice(0, 90);
  return <div key={`${fx.stamp}-${fx.text}`} className={`matchFx fx-${String(fx.type || "play").replace(/[^a-zA-Z0-9_-]/g, "")}`}><strong>{fx.icon}</strong><span>{short}</span></div>;
}

function MatchObjectiveMini({ game }) {
  const carrier = getPiece(game, game.ballOwnerId);
  const attacking = carrier?.side === game.userSide;
  return <div className="objectiveMini"><b>{attacking ? "Tujuan giliran" : "Saat bertahan"}</b><span>{attacking ? "Buka ruang → oper aman → masuk shot zone → tembak." : "Tutup jalur oper, press pembawa bola, lindungi area gawang."}</span></div>;
}
function MatchSummary({ game, finishWeek }) {
  const mvp = matchMvp(game);
  const moments = keyMomentText(game);
  const homePass = game.stats.home.passes ? Math.round((game.stats.home.passOk / game.stats.home.passes) * 100) : 0;
  const awayPass = game.stats.away.passes ? Math.round((game.stats.away.passOk / game.stats.away.passes) * 100) : 0;
  const posTotal = (game.stats.home.possessionSeconds || game.stats.home.possession || 0) + (game.stats.away.possessionSeconds || game.stats.away.possession || 0);
  const homePos = posTotal ? Math.round(((game.stats.home.possessionSeconds || game.stats.home.possession || 0) / posTotal) * 100) : 50;
  const awayPos = 100 - homePos;
  return <div className="matchSummary"><b>🏁 Match Summary</b><h3>{game.homeName} {game.score.home} - {game.score.away} {game.awayName}</h3><p>MVP: {mvp?.role} {firstName(mvp?.name)} · OVR {mvp?.overall}</p><div className="summaryStats"><span>xG {Math.round(game.stats.home.xg * 100) / 100} - {Math.round(game.stats.away.xg * 100) / 100}</span><span>Poss {homePos}% - {awayPos}%</span><span>Pass {homePass}% - {awayPass}%</span><span>Shots {game.stats.home.shots} - {game.stats.away.shots}</span><span>Saves {game.stats.home.saves || 0} - {game.stats.away.saves || 0}</span></div><div className="summaryMoments">{moments.map((h, i) => <small key={`${h.minute}-${i}`}>{h.minute}' {h.icon} {h.text}</small>)}</div><button className="primary full" onClick={finishWeek}>{game.friendly ? "Keluar Friendly" : "Selesaikan Pekan"}</button></div>;
}
function InboxTab({ items, startMatch, setTab }) {
  return <Section title="Inbox Manager" sub="Inbox sekarang menjadi pusat keputusan cepat: match, youth, kontrak, offer, scout, meeting story, latihan, dan kalender."><div className="inboxGrid">{items.map((it, i) => <Card key={`${it.title}-${i}`} className={`inboxCard ${it.actionTab ? "clickable" : ""}`}><strong>{it.icon}</strong><h3>{it.title}</h3><p>{it.body}</p>{it.actionTab && <button className="ghost full" onClick={() => setTab(it.actionTab)}>{it.actionLabel || "Buka"}</button>}</Card>)}<Card className="inboxCard action"><strong>⚽</strong><h3>Match Week</h3><p>Setelah membaca inbox, lanjut ke pre-match dan atur formasi sebelum mulai.</p><button className="primary full" onClick={startMatch}>Main Pekan</button></Card></div></Section>;
}

function PassList({ title, options, type, piece, onAction, humanTurn }) { if (!options.length) return null; return <div className="passList"><b>{title}</b>{options.slice(0, 4).map((o) => <button key={`${type}-${o.target.id}`} disabled={!humanTurn} onClick={() => onAction({ type, pieceId: piece.id, targetId: o.target.id })}><span>{o.target.role} {firstName(o.target.name)}</span><small>{o.chance}% · {o.cost}AP{o.trap?.label ? ` · ${o.trap.trapped ? "terkepung" : "ditekan"}` : ""}{o.intercept?.risk ? ` · ${o.intercept.label}` : ""}<em>{reasonsToText(o.reasons)}</em></small></button>)}</div>; }
function getCoachHint(game) {
  const carrier = getPiece(game, game.ballOwnerId);
  if (!carrier) return "Cari pemain bebas dan rebut bola.";
  if (game.turn !== game.userSide) return `AI plan terlihat: ${game.aiPlan}. Tutup jalur progresif dan paksa mereka melebar.`;
  if (carrier.side === game.userSide) {
    const shot = shotInfo(game, carrier.id); if (shot.can && shot.chance >= 45) return `Tembak sekarang: ${shot.chance}% (${shot.label}).`;
    const through = passOptions(game, carrier.id, true)[0]; if (through && through.forwardBonus > 1 && through.chance > 44) return `Through ball ke ${firstName(through.target.name)} menarik: ${through.chance}%.`;
    const pass = passOptions(game, carrier.id, false)[0]; if (pass) return `Umpan aman ke ${firstName(pass.target.name)}: ${pass.chance}%.`;
    return "Dribel ke ruang kosong, atau pakai kartu taktik untuk membuka blok.";
  }
  const tackler = game.pieces.filter((p) => p.side === game.userSide && !p.red).map((p) => ({ p, t: tackleOptions(game, p.id)[0], d: manhattan(p, carrier) })).sort((a, b) => (b.t?.chance || 0) - (a.t?.chance || 0) || a.d - b.d)[0];
  if (tackler?.t) return `Tackle dengan ${firstName(tackler.p.name)}: ${tackler.t.chance}%.`;
  return `Tutup jalur ${firstName(carrier.name)}. Pilih pemain dekat lalu run mendekat.`;
}
function Scoreboard({ game }) { return <div className="scoreboard"><div><b>{game.homeName}</b><span>Home · {game.homeFormation} · {game.homeStyle}</span></div><strong><small>{formatClock(game)} {game.extraTimeStarted ? "· ET" : ""}</small>{game.score.home} - {game.score.away}</strong><div><b>{game.awayName}</b><span>Away · {game.awayFormation} · {game.awayStyle}</span></div></div>; }
function Board({ game, selectedId, setSelectedId, runCells, passes, throughs, tackles, onAction, humanTurn, helpMode = false }) {
  const runKey = new Map(runCells.map((c) => [`${c.x}-${c.y}`, c]));
  const passIds = new Map(passes.map((p) => [p.target.id, p]));
  const throughIds = new Map(throughs.map((p) => [p.target.id, p]));
  const tackleIds = new Map(tackles.map((t) => [t.target.id, t]));
  const shotZones = shotZoneCellsFor(game, selectedId);
  const markers = tacticalMarkers(game, selectedId, passes, throughs, runCells);
  const cells = [];
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLS; x += 1) {
      const piece = pieceAt(game, x, y);
      const run = runKey.get(`${x}-${y}`);
      const isGoal = (y === 0 || y === BOARD_ROWS - 1) && GOAL_COLS.includes(x);
      const pass = piece ? passIds.get(piece.id) : null;
      const through = piece ? throughIds.get(piece.id) : null;
      const tackle = piece ? tackleIds.get(piece.id) : null;
      const shotZone = shotZones.get(`${x}-${y}`);
      const marker = markers.get(`${x}-${y}`);
      const selected = piece?.id === selectedId;
      const stackedCount = game.pieces.filter((p) => !p.red && p.x === x && p.y === y).length;
      const canSelect = humanTurn && piece?.side === game.userSide;
      const onClick = () => {
        if (!humanTurn) return;
        if (run && selectedId) { onAction({ type: "move", pieceId: selectedId, x, y }); return; }
        if (through && selectedId) { onAction({ type: "through", pieceId: selectedId, targetId: piece.id }); return; }
        if (pass && selectedId) { onAction({ type: "pass", pieceId: selectedId, targetId: piece.id }); return; }
        if (tackle && selectedId) { onAction({ type: "tackle", pieceId: selectedId, targetId: piece.id }); return; }
        if (canSelect) setSelectedId(piece.id);
      };
      cells.push(<button key={`${x}-${y}`} className={`cell ${isGoal ? "goal" : ""} ${run ? "run" : ""} ${shotZone?.kind || ""} ${marker?.kind || ""} ${selected && shotZone ? "currentShot" : ""}` } onClick={onClick}><span className="coord">{boardCellName(x, y)}</span>{piece && <span className={`piece ${piece.side} ${selected ? "selected" : ""} ${pass ? "pass" : ""} ${through ? "through" : ""} ${tackle ? "tackle" : ""} ${piece.red ? "sentOff" : ""} ${piece.vacant ? "vacant" : ""} ${pieceTemporarilyOut(game, piece) ? "minorOut" : ""}`} title={`${piece.name} · ${piece.role} · ${piece.trait} · ${roleSkillText(piece)}`}><span className="kitGlow" /><b>{piece.role}</b><small>{piece.overall}</small><span className="pieceName">{firstName(piece.name)}</span><span className="roleSkillBadge">{ROLE_SKILL_ICONS[roleSkillsFor(piece.role)[0]] || "•"}</span>{piece.id === game.ballOwnerId && <i>⚽</i>}{piece.vacant && <u>🚑</u>}{pieceTemporarilyOut(game, piece) && <u>🩹</u>}{piece.yellow > 0 && <u>🟨</u>}{stackedCount > 1 && <u className="stacked">+{stackedCount - 1}</u>}{pass && <em className="chanceChip">{pass.chance}%</em>}{through && <em className="chanceChip throughChip">{through.chance}%</em>}{tackle && <em className="chanceChip tackleChip">{tackle.chance}%</em>}</span>}{!piece && marker?.kind === "openSpace" && <span className="spaceMark">◎</span>}{!piece && marker?.kind === "passLane" && <span className="laneMark">━</span>}{!piece && marker?.kind === "dangerLane" && <span className="dangerMark">!</span>}{!piece && run && <span className="runDot">{run.kind === "keeper" ? "🧤" : run.kind === "dribble" ? "🌀" : "🏃"}<small>{run.cost}AP</small></span>}{!piece && !run && shotZone && <span className="shotZoneMark">🥅</span>}</button>);
    }
  }
  return <div className="board" style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`, gridTemplateRows: `repeat(${BOARD_ROWS}, minmax(28px, 1fr))`, aspectRatio: `${BOARD_COLS}/${BOARD_ROWS}` }}>{cells}</div>;
}
function StatsBox({ game }) {
  const homeSec = game.stats.home.possessionSeconds || game.stats.home.possession || 0;
  const awaySec = game.stats.away.possessionSeconds || game.stats.away.possession || 0;
  const total = homeSec + awaySec;
  const homePos = total ? Math.round((homeSec / total) * 100) : 50;
  const awayPos = 100 - homePos;
  return <div className="statsBox"><div><b>{game.stats.home.shots}</b><span>Shots</span><b>{game.stats.away.shots}</b></div><div><b>{game.stats.home.onTarget}</b><span>On Target</span><b>{game.stats.away.onTarget}</b></div><div><b>{Math.round(game.stats.home.xg * 100) / 100}</b><span>xG</span><b>{Math.round(game.stats.away.xg * 100) / 100}</b></div><div><b>{homePos}%</b><span>Possession</span><b>{awayPos}%</b></div><div><b>{game.stats.home.saves || 0}</b><span>Saves</span><b>{game.stats.away.saves || 0}</b></div><div><b>{game.stats.home.fouls}</b><span>Fouls</span><b>{game.stats.away.fouls}</b></div><div><b>{game.stats.home.corners}</b><span>Corners</span><b>{game.stats.away.corners}</b></div></div>;
}

function SquadTab({ team, selected, setSelected, sell, listLoan, kickPlayer, extendContract, checkPotential, respondOffer }) {
  const [search, setSearch] = useState("");
  const order = { GK: 0, LB: 1, CB: 2, RB: 3, CDM: 4, CM: 5, CAM: 6, LM: 7, RM: 8, LW: 9, RW: 10, ST: 11 };
  const players = seniorPlayers(team).slice().sort((a, b) => (order[a.pos] ?? 99) - (order[b.pos] ?? 99) || b.overall - a.overall);
  const q = search.trim().toLowerCase();
  const filteredPlayers = players.filter((p) => !q || `${p.name} ${p.pos} ${p.trait || ""} ${p.personality || ""}`.toLowerCase().includes(q));
  const selectedLive = selected ? players.find((p) => p.id === selected.id) || null : null;
  const offer = selectedLive?.pendingOffer;
  return <Section title="Skuad" sub={`${players.length} pemain senior. Pemain akademi baru masuk sini setelah Panggil ke Skuad Utama selesai diproses 1 pekan.`}>
    <div className="squadTools"><span>Minimal skuad utama 18 pemain senior</span><span>Wage total: {money(teamWeeklyWage(team))}/pekan</span><span>Offer aktif: {players.filter((p) => p.pendingOffer).length}</span></div>
    <div className="subTools squadSearch"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pemain / posisi / trait..." /></div>
    <div className="playerGrid">{filteredPlayers.map((p) => <PlayerCard key={p.id} player={p} active={selectedLive?.id === p.id} onClick={() => setSelected(selectedLive?.id === p.id ? null : p)} />)}</div>
    {selectedLive && <Card className="detail"><div><h3>{selectedLive.name}</h3><p>{POS_LABELS[selectedLive.pos]} · {selectedLive.age} tahun · {traitText(selectedLive.trait)} · kontrak {selectedLive.contract ?? 0} tahun</p><p className="roleSkillLine">{roleSkillText(selectedLive.pos)}</p><p className="muted">{roleSkillDesc(selectedLive.pos)}</p><div className="skillBars big"><span>PAC <b>{selectedLive.pace}</b></span><span>SHO <b>{selectedLive.shoot}</b></span><span>PAS <b>{selectedLive.pass}</b></span><span>DRI <b>{selectedLive.dribble}</b></span><span>DEF <b>{selectedLive.defend}</b></span></div><p className="muted">Fitness {selectedLive.fitness}% · Morale {selectedLive.morale} · Potential {selectedLive.scouted ? selectedLive.potential : "??"} · XP {selectedLive.xp || 0}/100 · Level {selectedLive.level || 1}</p><div className="scoutBadge">Status: {selectedLive.listedForSale ? "💰 Dijual" : "-"} {selectedLive.listedForLoan ? "🤝 Bisa dipinjam" : ""} {selectedLive.loan ? ` · Loan sampai pekan ${selectedLive.loanReturnWeek || "?"}` : ""}</div>{selectedLive.pendingSquadAction && <div className="offerBox"><b>⏳ Aksi skuad menunggu pekan berikutnya</b><span>{selectedLive.pendingSquadAction.type} · selesai pekan {selectedLive.pendingSquadAction.dueWeek}</span></div>}{offer && <div className="offerBox"><b>{offer.clubName} memberi offer</b><span>{offer.type === "loan" ? `Loan ${offer.weeks} pekan` : "Transfer permanen"} · {money(offer.amount)}</span><div className="transferActions"><button className="primary" onClick={() => respondOffer(selectedLive, "accept")}>Terima</button><button className="ghost" onClick={() => respondOffer(selectedLive, "counter")}>Ajukan ulang</button><button className="danger" onClick={() => respondOffer(selectedLive, "reject")}>Tolak</button></div></div>}</div><div><p className="bigMoney">{money(selectedLive.value)}</p><div className="infoGrid"><span>Gaji</span><b>{money(selectedLive.wage || 0)}/pekan</b><span>Kontrak</span><b>{selectedLive.contract ?? 0} tahun</b><span>OVR/POT</span><b>{selectedLive.overall}/{selectedLive.scouted ? selectedLive.potential : "??"}</b></div><div className="transferActions vertical"><button onClick={() => extendContract(selectedLive)}>Perpanjang Kontrak</button><button className="ghost" onClick={() => checkPotential(selectedLive)}>Cek Potensi</button><button className="ghost" onClick={() => listLoan(selectedLive)}>Tandai Loan</button><button className="danger" onClick={() => sell(selectedLive)}>Tandai Jual</button><button className="danger" onClick={() => kickPlayer(selectedLive)}>Kick → Free Agent</button></div></div></Card>}
  </Section>;
}
function traitText(key) { const t = TRAITS.find((x) => x.key === key); return t ? `${t.icon} ${t.key}` : key; }
function PlayerCard({ player, active, onClick }) { return <button className={`playerCard ${active ? "active" : ""} ${player.injuredWeeks > 0 || player.bannedWeeks > 0 ? "unavailable" : ""} ${player.pendingOffer ? "hasOffer" : ""}`} onClick={onClick}><span>{player.pos}</span><b>{player.name}</b><small>{player.age} thn · {player.scouted ? `POT ${player.potential}` : "POT ??"} · {player.personality || "Professional"} · {player.loan ? "Loan" : money(player.value)}</small><strong>{player.overall}</strong><div><i>PAC {player.pace}</i><i>SHO {player.shoot}</i><i>PAS {player.pass}</i><i>DEF {player.defend}</i></div><small>{traitText(player.trait)} {player.injuredWeeks ? `· 🏥 ${player.injuredWeeks}w` : ""}{player.bannedWeeks ? `· 🟥 ${player.bannedWeeks}w` : ""}{player.pendingOffer ? " · 📩 Offer" : ""}</small><small className="roleMini">Gaji {money(player.wage || 0)} · XP {player.xp || 0}/100 {player.listedForSale ? " · Dijual" : ""}{player.listedForLoan ? " · Loan list" : ""}</small></button>; }
function TacticsTab({ team, formation, setFormation, lineupOverrides, setLineupOverrides, setTeamStyle }) {
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [benchSearch, setBenchSearch] = useState("");
  const lineup = pickLineup(team, formation, lineupOverrides);
  const selected = lineup[selectedSlot];
  const selectedRole = selected?.slot?.pos || "CM";
  const currentPlayerId = selected?.player?.id;
  const usedIds = new Set(lineup.map((x) => x.player.id));
  const q = benchSearch.trim().toLowerCase();
  const candidates = seniorPlayers(team)
    .filter((p) => p.id !== currentPlayerId && (p.injuredWeeks || 0) <= 0 && (p.bannedWeeks || 0) <= 0)
    .filter((p) => !q || `${p.name} ${p.pos} ${p.trait || ""}`.toLowerCase().includes(q))
    .sort((a, b) => benchFitScore(b, selectedRole, selected?.player?.overall || 60) - benchFitScore(a, selectedRole, selected?.player?.overall || 60) || b.overall - a.overall);
  const changePlayer = (playerId) => setLineupOverrides((old) => {
    const next = { ...old, [selectedSlot]: playerId };
    Object.keys(next).forEach((slotKey) => {
      if (Number(slotKey) !== Number(selectedSlot) && String(next[slotKey]) === String(playerId)) delete next[slotKey];
    });
    return next;
  });
  const clearManual = () => setLineupOverrides({});
  return <Section title="Taktik & Formasi" sub="Formasi, starting XI, dan gaya taktik langsung memengaruhi AI teammate, off-ball movement, pressing, passing, dan shot saat MAIN PEKAN.">
    <Card className="styleCoachCard"><h3>Gaya Main Aktif: {team.style}</h3><p className="muted">Pilih style agar menu taktik benar-benar berpengaruh ke match. Possession lebih aman, Counter lebih progresif, High Press lebih agresif, Park Bus lebih kuat bertahan.</p><div className="formationButtons styleButtons">{Object.keys(STYLE_PROFILES).map((style) => <button key={style} className={team.style === style ? "active" : ""} onClick={() => setTeamStyle(style)}>{style}<small>{STYLE_PROFILES[style].tempo}</small></button>)}</div></Card>
    <div className="formationButtons">{Object.keys(FORMATIONS).map((f) => <button key={f} className={formation === f ? "active" : ""} onClick={() => { setFormation(f); setSelectedSlot(0); }}>{f}</button>)}</div>
    <div className="tacticsGrid pro">
      <Card><MiniPitch formation={formation} lineup={lineup} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} /></Card>
      <Card><div className="cardTop"><h3>Starting XI</h3><button className="ghost" onClick={clearManual}>Auto XI</button></div><div className="lineupList editable">{lineup.map(({ player, slot, manual }, idx) => <button key={`${slot.pos}-${player.id}-${idx}`} className={idx === selectedSlot ? "active" : ""} onClick={() => setSelectedSlot(idx)}><b>{slot.pos}</b><span>{player.name}</span><small>{manual ? "Manual" : player.trait}</small><strong>{player.overall}</strong></button>)}</div></Card>
      <Card><h3>Ganti pemain untuk {selectedRole}</h3><p className="muted">Daftar ini sekarang menampilkan semua pemain senior yang tersedia, termasuk pemain yang sedang ada di Starting XI untuk swap. Pemain cedera/sanksi tidak tampil.</p><div className="subTools tacticsSearch"><input value={benchSearch} onChange={(e) => setBenchSearch(e.target.value)} placeholder="Cari nama / posisi..." /></div><div className="benchList">{candidates.map((p) => <button key={p.id} onClick={() => changePlayer(p.id)}><b>{p.pos}</b><span>{p.name}</span><small>{usedIds.has(p.id) ? "Starting XI · akan ditukar" : "Cadangan"} · {traitText(p.trait)} · skor cocok {benchFitScore(p, selectedRole, selected?.player?.overall || 60)}</small><strong>{p.overall}</strong></button>)}</div></Card>
    </div>
  </Section>;
}
function MiniPitch({ formation, lineup, selectedSlot = -1, setSelectedSlot = () => {} }) { const slots = lineForFormation(formation); return <div className="miniPitch">{slots.map((slot, i) => <button key={`${slot.pos}-${i}`} className={selectedSlot === i ? "active" : ""} onClick={() => setSelectedSlot(i)} style={{ left: `${(slot.x / (BOARD_COLS - 1)) * 100}%`, top: `${(slot.y / (BOARD_ROWS - 1)) * 100}%` }}><b>{lineup[i]?.player.overall || "?"}</b><span>{slot.pos}</span><small>{lineup[i]?.player.name.split(" ")[0]}</small></button>)}</div>; }
function CalendarTab({ fixtures, teams, week, season, log, myTeam, competitionState }) {
  const rows = [];
  const startWeek = Math.max(1, week - 4);
  const endWeek = Math.min(SEASON_LENGTH_WEEKS, week + 14);
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  for (let w = startWeek; w <= endWeek; w += 1) {
    const mineList = userFixturesForWeek(competitionState, fixtures, teams, w, season);
    const baseDate = dateForWeek(w);
    if (mineList.length) {
      mineList.forEach((mine) => {
        const home = teams.find((t) => t.id === mine.homeId) || { id: mine.homeId, name: mine.homeName || "World Invite" };
        const away = teams.find((t) => t.id === mine.awayId) || { id: mine.awayId, name: mine.awayName || "World Invite" };
        const offset = fixtureDayOffset(mine);
        const eventDate = dateForWeek(w, offset);
        rows.push({ key: `main-${w}-${fixtureUniqueKey(mine)}`, week: w, dateObj: eventDate, date: formatDateId(eventDate), competition: mine.cupName || leagueName(mine.leagueKey), icon: mine.icon || (mine.competition === "numberOne" ? "👑" : "⚽"), home, away, status: log.find((m) => m.week === w && ((m.matchKey && m.matchKey === fixtureUniqueKey(mine)) || (m.homeId === mine.homeId && m.awayId === mine.awayId && (m.competition || "league") === (mine.competition || "league")))) });
      });
    } else rows.push({ key: `rest-${w}`, week: w, dateObj: baseDate, date: formatDateId(baseDate), competition: "Rest/Event", icon: "🗓️", note: "Tidak ada laga user; AI growth, berita, scout, youth, kontrak, loan, atau event random tetap berjalan." });
    competitionEventsForWeek(w, teams).slice(1).forEach((e, idx) => rows.push({ key: e.key, week: w, dateObj: dateForWeek(w, (idx % 5) + 1), date: e.date, competition: e.competition, icon: e.icon, note: e.note, home: myTeam, away: null }));
    if (NUMBER_ONE_WEEKS.groups.includes(w) || w === NUMBER_ONE_WEEKS.semi || w === NUMBER_ONE_WEEKS.final) rows.push({ key: `no1-info-${w}`, week: w, dateObj: dateForWeek(w, 2), date: formatDateId(dateForWeek(w, 2)), competition: "Number 1 Championship", icon: "👑", note: w === NUMBER_ONE_WEEKS.final ? "Final dan trophy NO.1" : w === NUMBER_ONE_WEEKS.semi ? "Semi Final" : "Group stage top 1-5 tiap liga" });
  }
  const monthDate = dateForWeek(week);
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);
  const days = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const monthLabel = monthDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const currentDateKey = dateKey(dateForWeek(week));
  const wccActive = worldCupSeasonActive(season);
  return <Section title="Kalender Season" sub="Tampilan kalender dibuat seperti kalender asli: bulan, hari, tanggal, agenda match, cup, transfer window, dan event penting. Jika 1 pekan ada 2+ laga, tanggalnya dipisah agar tidak berdekatan.">
    <div className="calendarLayout realCalendarLayout">
      <Card className="realCalendarCard">
        <div className="calendarMonthHead"><div><h3>{monthLabel}</h3><small>Season {season} · Pekan aktif {week} · {transferWindowLabel(week)}</small></div><b>{wccActive ? "🏆🌍 WCC aktif" : "WCC tidak aktif"}</b></div>
        <div className="realCalendarGrid">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => <div key={d} className="calendarDow">{d}</div>)}
          {days.map((d) => {
            const key = dateKey(d);
            const dayEvents = rows.filter((r) => dateKey(r.dateObj) === key).slice(0, 3);
            return <div key={key} className={`calendarDay ${d.getMonth() !== monthDate.getMonth() ? "mutedDay" : ""} ${key === currentDateKey ? "today" : ""}`}>
              <b>{d.getDate()}</b>
              {dayEvents.map((e) => <span key={e.key} title={e.home && e.away ? `${e.home.name} vs ${e.away.name}` : e.note}>{e.icon} {e.competition}</span>)}
            </div>;
          })}
        </div>
      </Card>
      <Card><h3>Agenda Tim Kamu</h3><div className="calendarList">{rows.map((r) => <div key={r.key} className={`calendarRow ${r.week === week ? "active" : ""}`}><strong>{r.icon}</strong><span><b>{r.date}</b><small>Pekan {r.week} · {r.competition}</small></span><em>{r.home && r.away ? `${r.home.name} vs ${r.away.name}` : r.note}</em>{r.status && <i>{r.status.homeGoals}-{r.status.awayGoals}</i>}</div>)}</div></Card>
      <Card><h3>Siklus Season</h3><div className="competitionStack"><div><b>🛒 Transfer Window</b><span>{transferWindowLabel(week)}</span><small>Beli/jual hanya saat window.</small></div><div><b>👑 Number 1 Championship</b><span>Pekan 50-58</span><small>Top 1-5 setiap liga, group stage, semi, final, trophy NO.1.</small></div><div><b>🏆🌍 World Cup Championship</b><span>{wccActive ? "Season ini aktif" : "Aktif lagi setiap 3 season"}</span><small>Rank 1-3 tiap liga + 15 klub undangan dunia.</small></div>{LEAGUES.map((l) => <div key={l.key}><b>🏟️ {LEAGUE_CHAMPIONSHIP_NAMES[l.key]}</b><span>{l.name}</span><small>{LEAGUE_CHAMPIONSHIP_IMPACT[l.key]}</small></div>)}</div></Card>
    </div>
  </Section>;
}

function NewsTab({ items }) {
  const [category, setCategory] = useState("ALL");
  const categories = ["ALL", "Club", "Transfer", "Youth", "World", "Competition", "Story"];
  const getCat = (n) => /transfer|agent|free/i.test(n.tag) ? "Transfer" : /youth|u20|u17|akademi|viral/i.test(n.tag) ? "Youth" : /world|wcc|global|asia|africa|north|nations|olympic/i.test(n.tag) ? "World" : /cup|champ|league|juara|NO\.1/i.test(n.tag) ? "Competition" : /story|media|fans|board|sponsor|locker/i.test(n.tag) ? "Story" : "Club";
  const filtered = category === "ALL" ? items : items.filter((n) => getCat(n) === category);
  return <Section title="Media Center & Berita" sub="Berita kini punya kategori penting: club pulse, transfer, youth, world, competition, story impact, injury, rivalitas, dan board drama.">
    <div className="newsFilters">{categories.map((c) => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <div className="newsGrid">{filtered.map((n, idx) => <Card key={`${n.tag}-${idx}`} className="newsCard"><div className="newsTag"><span>{n.icon}</span><b>{n.tag}</b></div><h3>{n.title}</h3><p>{n.body}</p><small className="muted">Kategori: {getCat(n)} · Baca karena bisa memengaruhi transfer, trust, gengsi, dan jadwal.</small></Card>)}</div>
  </Section>;
}
function CompetitionsTab({ teams, week, season, competitionState, seasonHistory }) {
  const no1 = ensureNumberOneState(competitionState, teams, week, season).numberOne;
  const participants = (no1.participants || []).map((id) => teams.find((t) => t.id === id)).filter(Boolean);
  const worldCupQualified = LEAGUE_ORDER.flatMap((key) => sortLeagueTeams(teams, key).slice(0, 3));
  const worldInvites = WORLD_EXTERNAL_CLUBS.map((name, i) => ({ id: `world-${i}`, name, power: 84 + (i % 6) + (i < 3 ? 4 : 0) }));
  return <Section title="Competition Hub" sub="Kompetisi dibuat lebih mirip career sepakbola: per liga ada championship sendiri, ada kompetisi lintas liga, trophy, badge, gengsi, uang, dan efek reputasi klub.">
    <div className="competitionHub">
      {LEAGUES.map((l) => <Card key={l.key}><h3>🏟️ {LEAGUE_CHAMPIONSHIP_NAMES[l.key]}</h3><p>{l.desc}</p><div className="infoGrid"><span>Liga</span><b>{l.name}</b><span>Level</span><b>{l.level}</b><span>Promosi</span><b>{l.promo || "-"}</b><span>Degradasi</span><b>{l.relegation || "-"}</b><span>Hadiah juara</span><b>{money(l.prize.champion)}</b><span>Impact</span><b>{LEAGUE_CHAMPIONSHIP_IMPACT[l.key]}</b></div></Card>)}
      <Card><h3>👑 Number 1 Championship</h3><p>Mulai pekan 50. Peserta: klub rank 1-5 dari setiap liga. Format: group stage, semi final, final, trophy NO.1.</p><div className="infoGrid"><span>Status</span><b>{no1.stage}</b><span>Peserta</span><b>{participants.length || "Top 20"}</b><span>Final</span><b>Pekan 58</b><span>Hadiah Juara</span><b>{money(600000)}</b><span>Badge</span><b>👑 NO.1</b><span>Efek</span><b>Fans, sponsor, trust, market pull naik</b></div></Card>
      {SPECIAL_CUP_CONFIGS.map((c) => <Card key={c.competition}><h3>{c.icon} {c.cupName}</h3><p>{c.note}</p><div className="infoGrid"><span>Pekan</span><b>{c.weeks.join(", ")}</b><span>Syarat</span><b>Rank 1-{c.minRank}</b><span>Hadiah</span><b>{money(c.prize)}</b><span>Gengsi</span><b>+{c.prestige}</b><span>Tanda klub</span><b>{c.cupName.split(" ").map((w) => w[0]).join("")}</b></div></Card>)}
      <Card><h3>{WORLD_CUP_CHAMPIONSHIP.icon} {WORLD_CUP_CHAMPIONSHIP.cupName}</h3><p>{WORLD_CUP_CHAMPIONSHIP.note} Season 1 aktif, lalu setiap 3 season. Peserta rank 1-3 tiap liga + 15 klub random dunia. Pemenang mendapat label WCC dan efek paling besar ke klub.</p><div className="infoGrid"><span>Status season ini</span><b>{worldCupSeasonActive(season) ? "Aktif" : "Tidak"}</b><span>Pekan</span><b>{WORLD_CUP_CHAMPIONSHIP.weeks.join(", ")}</b><span>Hadiah final</span><b>{money(WORLD_CUP_CHAMPIONSHIP.prize)}</b><span>Badge</span><b>🏆🌍 WCC</b><span>Impact</span><b>Sponsor global, gengsi, fan trust, daya tarik bintang</b></div></Card>
      <Card><h3>🛒 Transfer Window</h3><p>Bursa tidak selalu terbuka. Ini mencegah market penuh/aneh dan membuat pekan transfer lebih ditunggu.</p><div className="infoGrid"><span>Sekarang</span><b>{transferWindowLabel(week)}</b><span>Awal</span><b>1-6</b><span>Mid</span><b>24-30</b><span>Akhir</span><b>55-58</b></div></Card>
    </div>
    <Card><h3>Peserta Number 1</h3>{participants.length ? <div className="miniTable">{participants.map((t, i) => <span key={t.id}><b>#{i + 1} {t.name}</b><small>{leagueName(t.leagueKey)} · PTS {t.pts} · Power {Math.round(teamPower(t))}</small></span>)}</div> : <p className="muted">Peserta akan di-draw otomatis saat memasuki pekan 50 berdasarkan klasemen.</p>}</Card>
    <Card><h3>Preview World Cup Championship</h3><p className="muted">Klub rank 1-3 setiap liga otomatis layak. Di luar itu ada 15 undangan dunia dengan rating/pemain random kuat.</p><div className="miniTable">{worldCupQualified.map((t, i) => <span key={t.id}><b>Q{i + 1}. {t.name}</b><small>{leagueName(t.leagueKey)} · rank top 3 · Power {Math.round(teamPower(t))}</small></span>)}{worldInvites.slice(0, 15).map((t) => <span key={t.id}><b>🌍 {t.name}</b><small>World Invite · estimasi power {t.power}</small></span>)}</div></Card>
    <Card><h3>Histori Juara</h3>{seasonHistory?.length ? <div className="miniTable">{seasonHistory.slice(0, 16).map((h, i) => <span key={`${h.season}-${h.competition}-${i}`}><b>S{h.season} · {h.competition}</b><small>{h.championName}</small></span>)}</div> : <p className="muted">Belum ada season selesai.</p>}</Card>
  </Section>;
}
function ScheduleTab({ fixtures, teams, week, log, competitionState }) {
  const comp = numberOneFixturesForWeek(competitionState, week);
  return <Section title="Jadwal & Hasil" sub={`Pekan ${week} dari ${SEASON_LENGTH_WEEKS}. Liga berjalan per divisi; kompetisi besar punya fixture sendiri.`}><Card><h3>Pekan ini</h3><div className="fixtureList">{[...fixtures, ...comp].map((f) => { const h = teams.find((t) => t.id === f.homeId); const a = teams.find((t) => t.id === f.awayId); if (!h || !a) return null; const mine = f.homeId === MY_TEAM_ID || f.awayId === MY_TEAM_ID; const derby = h.rivalId === a.id; return <div key={`${f.key || "lg"}-${f.homeId}-${f.awayId}`} className={mine ? "mine" : derby ? "derby" : ""}><b>{h.name}</b><span>vs</span><b>{a.name}</b>{mine && <small>{f.cupName || leagueName(f.leagueKey)} · {f.stage || "League"}</small>}{derby && <small>🔥 Derby</small>}</div>; })}</div></Card><Card><h3>Hasil terakhir</h3>{log.length === 0 ? <p className="muted">Belum ada hasil.</p> : <div className="resultList">{log.map((m, i) => <ResultRow key={`${m.week}-${m.homeId}-${m.awayId}-${i}`} m={m} />)}</div>}</Card></Section>;
}
function ResultRow({ m }) { const mine = m.homeId === MY_TEAM_ID || m.awayId === MY_TEAM_ID; return <div className={`resultRow ${mine ? "mine" : ""}`}><small>Pekan {m.week}{m.derby ? " · Derby" : ""}{m.cupName ? ` · ${m.cupName} ${m.stage || ""}` : m.leagueKey ? ` · ${leagueName(m.leagueKey)}` : ""}</small><b>{m.home}</b><strong>{m.homeGoals} - {m.awayGoals}</strong><b>{m.away}</b>{m.events?.length > 0 && <p>{m.events.filter((e) => e.type === "goal").map((e) => `⚽ ${e.min}' ${e.player}`).join(" · ")}</p>}</div>; }
function TableTab({ teams }) {
  const tables = groupedLeagueTables(teams);
  return <Section title="Klasemen" sub="4 liga aktif: Liga Championship → Liga 3 → Liga 2 → Liga 1. Promosi/degradasi diproses akhir musim.">{tables.map((league) => <Card key={league.key} className="tableWrap"><h3>{league.name}</h3><div className="table"><div className="thead"><span>#</span><span>Tim</span><span>P</span><span>M</span><span>S</span><span>K</span><span>GD</span><span>PTS</span></div>{league.teams.map((t, i) => { const p = t.wins + t.draws + t.losses; const gd = t.gf - t.ga; const zone = i < 3 && league.promo ? "promo" : i >= league.teams.length - 3 && league.relegation ? "relegate" : ""; return <div className={`tr ${t.id === MY_TEAM_ID ? "mine" : ""} ${zone}`} key={t.id}><span>{i + 1}</span><span><b>{t.name} {t.numberOneTitles ? "👑" : ""}</b><small>{t.style} · Power {Math.round(teamPower(t))} · {(t.form || []).join(" ")}</small></span><span>{p}</span><span>{t.wins}</span><span>{t.draws}</span><span>{t.losses}</span><span>{gd > 0 ? `+${gd}` : gd}</span><strong>{t.pts}</strong></div>; })}</div></Card>)}</Section>;
}
function TransferTab({ market, cash, week, buy, loan, scout, scoutRandom, scoutQueue, scoutUsed, scoutLimit, transferActionWeek, pendingTransfers = [], rejectScoutReport }) {
  const [filter, setFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [loanWeeks, setLoanWeeks] = useState(15);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const windowOpen = isTransferWindow(week);
  const incomingLocked = transferActionWeek === week;
  const selectedReport = market.find((p) => String(p.id) === String(selectedReportId));
  const sourceOk = (p) => sourceFilter === "all"
    || (sourceFilter === "free" && (!p.ownerTeamId || p.freeAgent || p.sourceClub === "Free Agent" || p.sourceClub === "Scout Network"))
    || (sourceFilter === "club" && p.ownerTeamId && p.ownerTeamId !== MY_TEAM_ID)
    || (sourceFilter === "mine" && (p.userListed || p.ownerTeamId === MY_TEAM_ID));
  const filtered = (filter === "ALL" ? market : market.filter((p) => p.pos === filter))
    .filter(sourceOk)
    .filter((p) => (p.overall || 0) >= Number(minRating || 0))
    .sort((a, b) => sortBy === "priceHigh" ? (b.value || 0) - (a.value || 0) : sortBy === "priceLow" ? (a.value || 0) - (b.value || 0) : (b.overall || 0) - (a.overall || 0) || (b.value || 0) - (a.value || 0))
    .slice(0, 120);
  const loanFactor = Number(loanWeeks) <= 3 ? 0.06 : Number(loanWeeks) <= 15 ? 0.14 : 0.24;
  return <Section title="Transfer, Loan & Scout" sub={`Kas: ${money(cash)}. ${transferWindowLabel(week)}. Beli/loan masuk hanya 1x per pekan dan pemain baru tersedia pekan berikutnya.`}>
    <div className="scoutQueue">
      {scoutQueue.length ? scoutQueue.map((q) => <span key={q.id}>🔎 {q.hidden ? "Target anonim" : q.name}: target pekan {q.dueWeek}</span>) : <span>Belum ada scout berjalan.</span>}
      {pendingTransfers.length ? pendingTransfers.map((t) => <span key={t.id}>🕒 {t.type === "loan" ? "Loan" : "Beli"} {t.player?.name}: masuk pekan {t.dueWeek}</span>) : null}
      <button className="ghost" disabled={scoutQueue.length > 0 || scoutUsed >= scoutLimit} onClick={scoutRandom}>Scout pemain random</button>
    </div>
    {incomingLocked && <Card className="warningCard"><h3>⛔ Batas transfer pekan ini sudah dipakai</h3><p>Beli/loan pemain hanya boleh 1x per pekan selama transfer window. Pemain yang sudah deal tetap menunggu registrasi dan baru masuk skuad pekan berikutnya.</p></Card>}
    {selectedReport && <Card className="transferReportDetail"><div><h3>🔎 Detail Report Scout</h3><p><b>{selectedReport.name}</b> · {selectedReport.pos} · {selectedReport.age} tahun · {selectedReport.sourceClub || "Scout Network"}</p><div className="infoGrid"><span>OVR</span><b>{selectedReport.overall}</b><span>POT</span><b>{selectedReport.scouted ? selectedReport.potential : "??"}</b><span>Harga</span><b>{money(selectedReport.value || 0)}</b><span>Gaji estimasi</span><b>{money(selectedReport.wage || Math.round((selectedReport.value || 5000) * 0.025 / 100) * 100)}/pekan</b></div><div className="skillBars big"><span>PAC <b>{selectedReport.pace}</b></span><span>SHO <b>{selectedReport.shoot}</b></span><span>PAS <b>{selectedReport.pass}</b></span><span>DRI <b>{selectedReport.dribble}</b></span><span>DEF <b>{selectedReport.defend}</b></span></div><p className="muted">Mental {selectedReport.personality || "Professional"} · Trait {traitText(selectedReport.trait)} · {selectedReport.rarePotential ? "Rare potential" : "Report normal"}. Klik Loan untuk kontrak sementara, Buy untuk permanen, atau Tolak untuk hapus report.</p></div><div className="transferActions vertical"><button disabled={!windowOpen || incomingLocked || cash < Math.round((selectedReport.value || 0) * loanFactor / 500) * 500} onClick={() => loan(selectedReport, loanWeeks)}>Kontrak sementara / Loan {loanWeeks}w</button><button className="primary" disabled={!windowOpen || incomingLocked || cash < (selectedReport.value || 0)} onClick={() => buy(selectedReport)}>Buy {money(selectedReport.value || 0)}</button><button className="danger" onClick={() => { rejectScoutReport?.(selectedReport); setSelectedReportId(null); }}>Tolak Report</button></div></Card>}
    <div className="transferFilters"><label>Sumber <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}><option value="all">Semua</option><option value="free">Free Agent / Scout</option><option value="club">Pemain dari klub</option><option value="mine">Pemain saya dijual/loan</option></select></label><label>Min Rating <input type="number" min="0" max="98" value={minRating} onChange={(e) => setMinRating(e.target.value)} /></label><label>Sorting <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="rating">Rating tinggi</option><option value="priceHigh">Harga tinggi</option><option value="priceLow">Harga rendah</option></select></label><label>Durasi Loan <select value={loanWeeks} onChange={(e) => setLoanWeeks(Number(e.target.value))}><option value={3}>3 pekan</option><option value={15}>15 pekan</option><option value={30}>30 pekan</option></select></label></div>
    <div className="formationButtons">{["ALL", ...EXTRA_POSITIONS].filter((v, i, a) => a.indexOf(v) === i).map((p) => <button key={p} className={filter === p ? "active" : ""} onClick={() => setFilter(p)}>{p}</button>)}</div>
    <div className="playerGrid">{filtered.map((p) => {
      const loanFee = Math.round((p.value || 0) * loanFactor / 500) * 500;
      const own = p.userListed || p.ownerTeamId === MY_TEAM_ID;
      const clubPlayer = p.ownerTeamId && p.ownerTeamId !== MY_TEAM_ID;
      const reportReady = p.randomScout || p.scoutReportWeek;
      return <div key={p.id} className={`transferCard ${p.scoutStatus === "pending" ? "pending" : ""} ${p.scoutStatus === "gem" ? "gem" : ""} ${own ? "ownListed" : ""}`}>
        <PlayerCard player={p} active={selectedReportId === p.id} onClick={() => reportReady ? setSelectedReportId(p.id) : null} />
        <div className="scoutBadge">{own ? "Pemain klub kamu masuk daftar market" : clubPlayer ? `Pemain klub: ${p.sourceClub}` : p.sourceClub || "Free Agent"} · {p.scoutStatus === "pending" ? `🔎 Scout pekan ${p.scoutDueWeek || "?"}` : p.scouted ? (p.rarePotential ? "🌟 Rare potential" : "📋 Scout normal") : "POT ??"}{reportReady ? " · Klik kartu untuk detail" : ""}</div>
        {own && <div className="offerBox"><b>📌 Status pemain kamu</b><span>{p.listedForSale ? "Dijual" : ""} {p.listedForLoan ? " · Bisa dipinjam" : ""}</span><small>Offer masuk akan diputuskan di menu Skuad: terima, tolak, atau ajukan ulang.</small></div>}
        {reportReady && <div className="offerBox"><b>🔎 Report scout sudah jadi</b><small>Detail lengkap tersedia. Bisa kontrak sementara/loan, beli permanen, atau tolak report.</small></div>}
        <div className="transferActions"><button className="ghost" disabled={own || p.scouted || p.scoutStatus === "pending" || scoutQueue.length > 0 || scoutUsed >= scoutLimit} onClick={() => scout(p)}>Lihat Potensi</button><button disabled={own || !windowOpen || incomingLocked || cash < loanFee} onClick={() => loan(p, loanWeeks)}>Loan {loanWeeks}w · {money(loanFee)}</button><button disabled={own || !windowOpen || incomingLocked || cash < p.value} onClick={() => buy(p)}>Buy {money(p.value)}</button></div>
      </div>;
    })}</div>
  </Section>;
}
function CareerTab({ manager, saveNow, exportSave, loadNow, resetSave, importSaveFile }) {
  return <Section title="Career Mode" sub="Save tidak otomatis. Kalau tidak pernah Save Manual atau import file, refresh tanpa save akan mulai fresh dari kas Rp 50.000.">
    <div className="cardsGrid">
      <Card><h3>Manager</h3><div className="infoGrid"><span>Nama</span><b>{manager.name}</b><span>Reputasi</span><b>Lv {manager.reputation}</b><span>Board Trust</span><b>{manager.boardTrust}%</b><span>Fans Trust</span><b>{manager.fanTrust}%</b></div></Card>
      <Card><h3>Save Game</h3><p className="muted">Save Manual menyimpan ke browser. Download Save membuat file JSON yang bisa kamu simpan dan load lagi di device lain.</p><div className="saveButtons"><button className="primary" onClick={saveNow}>Save ke Browser</button><button className="primary" onClick={exportSave}>Download Save JSON</button><button className="ghost" onClick={loadNow}>Load Browser Save</button><label className="fileButton">Load File Save<input type="file" accept="application/json,.json" onChange={(e) => importSaveFile(e.target.files?.[0])} /></label><button className="danger" onClick={resetSave}>Hapus Save Browser</button></div></Card>
      <Card><h3>Kontrak Manager</h3><p>Board akan menilai hasil, gaya main, target season, dan derby. Jika trust rendah, tekanan naik.</p><ProgressLine label="Board" value={manager.boardTrust} target={100} /><ProgressLine label="Fans" value={manager.fanTrust} target={100} /></Card>
    </div>
  </Section>;
}
function YouthTab({ team, facilities, week = 1, sell, listLoan, promoteYouth, checkPotential }) {
  const academyLevel = facilities?.academy || 1;
  const academyList = academyPlayers(team).sort((a, b) => (b.potential - b.overall) - (a.potential - a.overall) || b.overall - a.overall);
  const seniorYoung = seniorPlayers(team).filter((p) => p.age <= 21).sort((a, b) => (b.potential - b.overall) - (a.potential - a.overall) || b.overall - a.overall);
  const youths = [...academyList, ...seniorYoung].slice(0, 36);
  const breakthroughChance = Math.min(35, 8 + academyLevel * 5);
  const nextRefresh = Math.min(SEASON_LENGTH_WEEKS, Math.ceil(Math.max(1, week) / 20) * 20);
  const topYouth = academyList[0] || seniorYoung[0];
  return <Section title="Youth Academy & Growth" sub={`Akademi Lv ${academyLevel}. Tombol promosi hanya muncul untuk pemain berstatus Akademi. Setelah klik, promosi diproses saat Lanjut Pekan.`}>
    <div className="youthSummary">
      <Card><h3>🌱 Akademi Aktif</h3><div className="infoGrid"><span>Level Akademi</span><b>{academyLevel}/3</b><span>Pemain akademi</span><b>{academyList.length}</b><span>Pemain muda senior</span><b>{seniorYoung.length}</b><span>Chance breakthrough</span><b>±{breakthroughChance}%/pekan</b><span>EXP dasar</span><b>+{academyLevel * 6}/pekan</b><span>Refresh</span><b>Pekan 20/40/60</b></div></Card>
      <Card><h3>Promosi ke Skuad Utama</h3><p>Pilih pemain dengan label <b>Akademi</b>, klik <b>Panggil ke Skuad Utama</b>, lalu tekan <b>Lanjut Pekan</b>. Pemain baru masuk senior setelah 1 pekan, dengan gaji dan kontrak otomatis.</p></Card>
      <Card><h3>Laporan Pelatih</h3><p>{topYouth ? `${topYouth.name} paling menarik saat ini: ${topYouth.pos} OVR ${topYouth.overall}, ${topYouth.scouted ? `POT ${topYouth.potential}` : "POT belum dibuka"}. Mental: ${topYouth.personality}.` : "Belum ada pemain youth."}</p></Card>
      <Card><h3>Refresh Akademi 20 Pekan</h3><p>Setiap pekan 20, 40, dan 60 daftar akademi diganti fresh. Pemain yang sudah masuk skuad utama, sedang menunggu promosi, ditandai jual, ditandai loan, atau punya offer tetap aman dan tidak dihapus.</p><div className="infoGrid"><span>Refresh berikutnya</span><b>Pekan {nextRefresh}</b><span>Dilindungi</span><b>Senior / Listed / Pending</b></div></Card>
    </div>
    {!academyList.length && <Card className="warningCard"><h3>⚠️ Akademi kosong</h3><p>Save lama mungkin belum punya data akademi. Sistem akan otomatis menambahkan intake youth saat game aktif. Klik Career Baru atau Load Browser Save kalau belum muncul.</p></Card>}
    <div className="playerGrid">{youths.map((p) => {
      const isAcademy = Boolean(p.academy);
      const pendingPromote = p.pendingSquadAction?.type === "promoteYouth";
      return <div key={p.id} className={`youthCard ${isAcademy ? "academy" : "seniorYouth"}`}>
        <PlayerCard player={p} active={false} onClick={() => {}} />
        <div className="youthStatusLine"><b>{isAcademy ? "🌱 Akademi" : "✅ Sudah Skuad Utama"}</b><span>{isAcademy ? "Belum bisa masuk match sampai dipromosikan" : "Ini pemain muda senior, jadi tombol promosi tidak diperlukan"}</span></div>
        <div className="youthReport"><b>{p.rarePotential ? "🔥 Hidden Gem" : p.potential - p.overall >= 10 ? "🌟 Prospek bagus" : "📋 Prospek normal"}</b><span>Growth gap {Math.max(0, (p.potential || p.overall) - p.overall)} · Mental {p.personality || "Professional"} · Fasilitas Academy Lv {academyLevel}</span></div>
        {p.pendingSquadAction && <div className="offerBox"><b>⏳ Menunggu pekan berikutnya</b><span>{p.pendingSquadAction.type} · selesai pekan {p.pendingSquadAction.dueWeek}</span></div>}
        <div className="youthActions">
          {isAcademy ? <button className="primary" disabled={Boolean(p.pendingSquadAction)} onClick={() => promoteYouth(p)}>{pendingPromote ? "Menunggu Promosi" : "Panggil ke Skuad Utama"}</button> : <button className="ghost" disabled>Sudah di Skuad Utama</button>}
          <button className="ghost" disabled={Boolean(p.pendingSquadAction)} onClick={() => checkPotential(p)}>Cek Potensi</button>
          <button className="ghost" disabled={Boolean(p.pendingSquadAction)} onClick={() => listLoan(p)}>Tandai Loan</button>
          <button className="danger" disabled={Boolean(p.pendingSquadAction)} onClick={() => sell(p)}>Tandai Jual</button>
        </div>
        <small className="muted">XP {p.xp || 0}/100 · Level {p.level || 1} · POT {p.scouted ? p.potential : "??"} · {isAcademy ? "Akademi" : "Skuad utama"}</small>
      </div>;
    })}</div>
  </Section>;
}

function StoryTab({ storyLog, answerStory, requestStoryMeeting, manager, myTeam, week }) {
  const open = storyLog.filter((e) => !e.choice).length;
  const resolved = storyLog.filter((e) => e.choice).length;
  const meetingUsed = storyLog.some((e) => e.manualMeeting && e.week === week);
  return <Section title="Story Event & Media Room" sub="Story kini menjadi pusat keputusan manager: media, rivalitas, sponsor, agen, fans ultras, board ultimatum, locker room, youth, dan fasilitas.">
    <div className="storyDashboard">
      <Card><h3>🎙️ Meeting Media</h3><p>Meeting manual hanya bisa 1x per pekan. Efek pilihan masuk berita dan bisa memengaruhi trust, kas, rivalitas, fasilitas, dan morale pemain.</p><button className="primary full" disabled={meetingUsed} onClick={requestStoryMeeting}>{meetingUsed ? "Meeting Pekan Ini Sudah Dipakai" : "Buka Meeting Sekarang"}</button></Card>
      <Card><h3>Trust & Reputasi</h3><div className="infoGrid"><span>Board</span><b>{manager.boardTrust}%</b><span>Fans</span><b>{manager.fanTrust}%</b><span>Reputasi</span><b>Lv {manager.reputation}</b><span>Rival aktif</span><b>{myTeam?.rivalId ? "Ada" : "Belum"}</b></div></Card>
      <Card><h3>Arsip Story</h3><div className="infoGrid"><span>Belum dijawab</span><b>{open}</b><span>Selesai</span><b>{resolved}</b><span>Total</span><b>{storyLog.length}</b></div></Card>
    </div>
    {storyLog.length === 0 ? <Card className="empty"><h3>Belum ada story event</h3><p className="muted">Tekan Meeting Media atau mainkan beberapa pekan untuk memicu media, fans, sponsor, agen, board, atau drama skuad.</p></Card> : <div className="storyGrid">{storyLog.map((e) => <Card key={e.id} className={`storyCard ${e.choice ? "resolved" : "open"}`}><div className="newsTag"><span>{e.type === "rivalry" ? "🔥" : e.type === "sponsor" ? "🤝" : e.type === "youth" ? "🌱" : e.type === "board" ? "🏛️" : e.type === "agent" ? "🧾" : "💬"}</span><b>{e.type || "story"}</b></div><h3>{e.title}</h3><p className="muted">Pekan {e.week}{e.relatedClubName ? ` · ${e.relatedClubName}` : ""}{e.choice ? ` · Pilihan: ${e.choice}` : ""}</p>{e.stakes && <p>{e.stakes}</p>}{e.arc && <div className="storyArc">{e.arc}</div>}{e.choice ? <b>Efek: {e.effect}</b> : <div className="choiceList">{e.choices.map((c) => <button key={c} onClick={() => answerStory(e.id, c)}>{c}</button>)}</div>}</Card>)}</div>}
  </Section>;
}
function GoalOverlay({ game, onResume }) {
  const pause = game.goalPause;
  if (!pause) return null;
  return <div className="goalOverlay"><div><strong>GOOOAL!</strong><h3>{game.homeName} {pause.score.home} - {pause.score.away} {game.awayName}</h3><p>{pause.text}</p><small>Restart: bola untuk tim yang kebobolan ({sideLabel(pause.restartSide)}). Klik lanjut saat siap.</small><button className="primary" onClick={onResume}>Lanjut Kick Off</button></div></div>;
}

function FacilitiesTab({ facilities, cash, upgrade }) {
  const impact = {
    stadium: (lv) => `Pemasukan HOME naik, gengsi stadion +${lv * 6}%, fan trust lebih mudah tumbuh.`,
    training: (lv) => `EXP latihan senior +${lv * 5} dasar/pekan dan peluang rating naik lebih besar.`,
    academy: (lv) => `Youth EXP +${lv * 6} dasar/pekan, peluang breakthrough ±${Math.min(35, 8 + lv * 5)}%.`,
    medical: (lv) => `Durasi cedera lebih pendek, risiko cedera fatal turun, recovery stamina +${lv * 4}%.`,
    merchandise: (lv) => `Pendapatan brand/jersey naik, efek trophy terasa lebih besar +${lv * 5}%.`,
    sponsor: (lv) => `Offer sponsor dan bonus kompetisi lebih menarik, reputasi klub +${lv * 4}%.`,
  };
  return <Section title="Fasilitas & Ekonomi" sub={`Kas: ${money(cash)}. Fasilitas sekarang punya dampak langsung ke latihan, youth, medical, sponsor, dan perkembangan klub.`}>
    <div className="cardsGrid">{Object.entries(FACILITY_DEF).map(([key, def]) => {
      const level = facilities[key];
      const cost = Math.round(def.baseCost * Math.pow(1.65, level - 1));
      return <Card key={key}><h3>{def.icon} {def.label}</h3><p>{def.desc}</p><div className="facilityLevel">Level {level}/3</div><div className="facilityImpact">{impact[key]?.(level) || "Meningkatkan kualitas klub."}</div><button disabled={level >= 3 || cash < cost} onClick={() => upgrade(key)}>{level >= 3 ? "Maks" : `Upgrade ${money(cost)}`}</button></Card>;
    })}</div>
  </Section>;
}

function ChampionsTab({ teams, week, log }) {
  const qualified = teams.slice(0, 16);
  const cupResults = log.filter((m) => CUP_WEEKS.has(m.week)).slice(0, 24);
  return <Section title="Champions Cup" sub="Kompetisi tengah musim: 16 besar dari klasemen sementara mendapat laga bonus pada pekan cup. Hadiah tidak cukup untuk langsung membeli pemain bintang, tapi membantu ekonomi.">
    <div className="cardsGrid"><Card><h3>Zona Champions</h3><p className="muted">Pekan sekarang: {week}. Top 16 sementara lolos ke bracket virtual.</p><div className="miniTable">{qualified.map((t, i) => <span key={t.id}><b>#{i + 1} {t.name}</b><small>{t.pts} pts · Power {Math.round(teamPower(t))}</small></span>)}</div></Card><Card><h3>Riwayat Cup</h3>{cupResults.length ? cupResults.map((m) => <ResultRow key={`cup-${m.week}-${m.homeId}-${m.awayId}`} m={m} />) : <p className="muted">Belum ada pekan Champions/Cup dimainkan.</p>}</Card><Card><h3>Hadiah</h3><div className="infoGrid"><span>Menang cup week</span><b>{money(110000)}</b><span>Kalah/seri</span><b>{money(25000)}</b><span>Market 80+</span><b>Mahal</b><span>Kas awal</span><b>{money(INITIAL_CASH)}</b></div></Card></div>
  </Section>;
}

function ObjectivesTab({ objectives, ctx, claimed }) { return <Section title="Board Vision" sub="Target hanya panduan seperti manager mode. Tidak ada reward objective otomatis."><div className="cardsGrid">{objectives.map((o) => { const val = objectiveProgress(o, ctx); const done = claimed.includes(o.key) || objectiveComplete(o, ctx); return <Card key={o.key} className={done ? "done" : ""}><h3>{done ? "✅" : "🎯"} {o.title}</h3><p>{o.desc}</p><ProgressLine label="Progress" value={val} target={o.target} done={claimed.includes(o.key)} /><b>Reward otomatis dimatikan</b></Card>; })}</div></Section>; }
function ClubsTab({ teams }) { return <Section title="Klub" sub="Semua klub punya liga, style AI, budget, wage pressure, trophy, growth score, dan berita. Klub terlalu bertabur 85+/90+ bisa chaos."><div className="clubGrid">{teams.map((t) => { const chaos = starChaos(t); return <Card key={t.id} style={{ borderTop: `4px solid ${t.color}` }}><h3>{t.name} {t.numberOneTitles ? "👑 NO.1" : ""}</h3><p className="muted">{t.city} · {leagueName(t.leagueKey)}</p><div className="infoGrid"><span>Power</span><b>{Math.round(teamPower(t))}</b><span>Fans</span><b>{t.fans.toLocaleString("id-ID")}</b><span>Pemain</span><b>{t.players.length}</b><span>Budget</span><b>{money(t.budget || INITIAL_CASH)}</b><span>Wage</span><b>{money(teamWeeklyWage(t))}</b><span>Stars 85+/90+</span><b>{chaos.stars85}/{chaos.stars90}</b><span>AI Style</span><b>{t.style}</b><span>Growth</span><b>{Math.round(t.growthScore || 0)}</b></div>{chaos.tooMany && <p className="clubNewsMini">💥 <b>Star Chaos</b> · ruang ganti bisa berantakan karena terlalu banyak bintang.</p>}{(t.trophies || []).slice(0, 2).map((tr, i) => <p key={`tr-${i}`} className="clubNewsMini">🏆 <b>{tr.name}</b> · S{tr.season} {tr.mark || ""}</p>)}{(t.aiNews || []).slice(0, 2).map((n, i) => <p key={i} className="clubNewsMini">{n.icon} <b>{n.tag}</b> · {n.title}</p>)}</Card>; })}</div></Section>; }
function AIGrowthTab({ teams, worldNews, week }) {
  const aiTeams = teams.filter((t) => t.id !== MY_TEAM_ID).slice().sort((a, b) => (b.growthScore || 0) - (a.growthScore || 0) || teamPower(b) - teamPower(a)).slice(0, 12);
  const wonderkids = teams.flatMap((t) => (t.players || []).filter((p) => p.age <= 21 && (p.rarePotential || p.potential >= 86)).map((p) => ({ ...p, clubName: t.name, clubColor: t.color }))).sort((a, b) => (b.potential - b.overall) - (a.potential - a.overall)).slice(0, 12);
  return <Section title="AI Club Growth" sub={`Pekan ${week}. Semua klub AI ikut hidup: latihan, income, transfer, akademi, taktik, dan hidden potential.`}>
    <div className="aiGrowthLayout">
      <Card><h3>Klub AI Paling Berkembang</h3><div className="miniTable">{aiTeams.map((t, i) => <span key={t.id}><b>#{i + 1} {t.name}</b><small>{t.style} · Power {Math.round(teamPower(t))} · Growth {Math.round(t.growthScore || 0)} · Budget {money(t.budget || INITIAL_CASH)}</small></span>)}</div></Card>
      <Card><h3>Hidden Potential Watch</h3><div className="miniTable">{wonderkids.map((p) => <span key={p.id}><b>{p.name}</b><small>{p.clubName} · {p.pos} · OVR {p.overall} / POT {p.scouted ? p.potential : "??"} · {p.rarePotential ? "🔥 Viral" : "🌱 Scout"}</small></span>)}</div></Card>
      <Card><h3>World Feed</h3><div className="worldFeed">{(worldNews || []).slice(0, 12).map((n, i) => <div key={n.id || i}><b>{n.icon} {n.title}</b><small>Pekan {n.week} · {n.tag}</small><p>{n.body}</p></div>)}</div></Card>
    </div>
  </Section>;
}


function DebugTab({ report, runQa, runBalance }) {
  return <Section title="QA / Debug Panel" sub="Panel internal untuk cek career, migration, economy, balancing simulator 1000 match, dan seed debug replay.">
    <div className="cardsGrid compactQaGrid"><Card><h3>Cek Data Career</h3><p className="muted">Gunakan setelah transfer/season rollover untuk memastikan market tidak duplicate dan fixture tidak mentok.</p><button className="primary" onClick={runQa}>Run QA</button></Card><Card><h3>Balancing Simulator</h3><p className="muted">Simulasi 500 pertandingan AI untuk melihat rata-rata gol, draw rate, dan home win rate.</p><button className="primary" onClick={runBalance}>Run 1000 Match</button></Card><Card><h3>Hasil</h3>{report ? <><span className="qaBadge">QA {report.status}</span><div className="infoGrid">{Object.entries(report).map(([k, v]) => <React.Fragment key={k}><span>{k}</span><b>{String(v)}</b></React.Fragment>)}</div></> : <p className="muted">Belum dijalankan.</p>}</Card></div>
  </Section>;
}
