// V20 Full QA + Deterministic Fairness Harness
// Target sehat untuk arcade football manager:
// - Home win rate 38-48%
// - Away win rate 26-36%
// - Draw rate 20-31%
// - Average goals 2.25-3.2
// - Upset rate 8-28%

export function makeSeededRng(seedInput = 'bola-catur-arena-v20') {
  let h = 2166136261;
  const text = String(seedInput);
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0 || 1;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function poisson(lambda, rng = Math.random) {
  const safe = Math.max(0.05, Math.min(4.2, Number(lambda) || 1.1));
  const limit = Math.exp(-safe);
  let k = 0;
  let prod = 1;
  do { k += 1; prod *= rng(); } while (prod > limit && k < 9);
  return Math.max(0, k - 1);
}

export function expectedGoals(homePower, awayPower, opts = {}) {
  const diff = Math.max(-32, Math.min(32, homePower - awayPower));
  const homeAdv = opts.derby || opts.important ? 0.08 : 0.16;
  const tight = opts.important ? -0.08 : 0;
  const homeXg = Math.max(0.25, Math.min(3.3, 1.18 + homeAdv + diff * 0.033 + tight));
  const awayXg = Math.max(0.2, Math.min(3.1, 1.05 - diff * 0.031 + tight));
  return { homeXg, awayXg };
}

export function runFairnessBatch({ matches = 1000, homePower = 72, awayPower = 72, rng = Math.random, important = false, derby = false } = {}) {
  const out = { matches, homeWins: 0, awayWins: 0, draws: 0, goals: 0, upsets: 0, samples: [] };
  for (let i = 0; i < matches; i += 1) {
    const hp = homePower + Math.round((rng() - 0.5) * 18);
    const ap = awayPower + Math.round((rng() - 0.5) * 18);
    const { homeXg, awayXg } = expectedGoals(hp, ap, { important, derby });
    const h = poisson(homeXg, rng);
    const a = poisson(awayXg, rng);
    if (h > a) out.homeWins += 1;
    else if (a > h) out.awayWins += 1;
    else out.draws += 1;
    if ((hp - ap >= 7 && a > h) || (ap - hp >= 7 && h > a)) out.upsets += 1;
    out.goals += h + a;
    if (out.samples.length < 12) out.samples.push({ hp, ap, homeXg: +homeXg.toFixed(2), awayXg: +awayXg.toFixed(2), score: `${h}-${a}` });
  }
  const pct = (n) => +(n / Math.max(1, matches) * 100).toFixed(1);
  return {
    ...out,
    homeWinRate: pct(out.homeWins),
    awayWinRate: pct(out.awayWins),
    drawRate: pct(out.draws),
    upsetRate: pct(out.upsets),
    avgGoals: +(out.goals / Math.max(1, matches)).toFixed(2),
  };
}

export function runEconomyStressTest({ seasons = 10, clubs = 48, rng = Math.random } = {}) {
  const budgets = Array.from({ length: clubs }, (_, i) => 60000 + i * 3500 + Math.round(rng() * 85000));
  for (let season = 0; season < seasons; season += 1) {
    for (let week = 0; week < 60; week += 1) {
      for (let i = 0; i < budgets.length; i += 1) {
        const fanBase = 22000 + i * 520;
        const wagePressure = 1800 + Math.round((budgets[i] / 950000) * 4200);
        const matchIncome = 2800 + Math.round(fanBase / 38) + Math.round(rng() * 5200);
        const facilitySpend = rng() < 0.018 ? 25000 + Math.round(rng() * 90000) : 0;
        const transferSpend = rng() < 0.025 ? 12000 + Math.round(rng() * 75000) : 0;
        const prize = week === 59 ? Math.round((clubs - i) / clubs * 110000) : 0;
        budgets[i] += matchIncome + prize - wagePressure - facilitySpend - transferSpend;
        budgets[i] = Math.max(-120000, Math.min(2500000, budgets[i]));
      }
    }
    budgets.sort((a, b) => b - a);
  }
  const avgBudget = Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length);
  return {
    seasons,
    clubs,
    avgBudget,
    minBudget: Math.min(...budgets),
    maxBudget: Math.max(...budgets),
    negativeClubs: budgets.filter((b) => b < 0).length,
    richClubs: budgets.filter((b) => b > 1250000).length,
  };
}

export function runTransferMarketStressTest({ players = 500, rng = Math.random } = {}) {
  const ids = new Set();
  const values = [];
  let duplicates = 0;
  for (let i = 0; i < players; i += 1) {
    const id = 100000 + i;
    if (ids.has(id)) duplicates += 1;
    ids.add(id);
    const age = 17 + Math.floor(rng() * 19);
    const overall = 48 + Math.floor(rng() * 44);
    const potential = Math.min(99, overall + Math.floor(rng() * 20));
    const youngPremium = age <= 21 ? 1.35 : age >= 31 ? 0.68 : 1;
    const value = Math.round(Math.max(800, (overall ** 2.18) * (0.9 + rng() * 0.55) * youngPremium * (1 + (potential - overall) * 0.025)));
    values.push(value);
  }
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  return {
    players,
    duplicateIds: duplicates,
    minValue,
    maxValue,
    avgValue: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    valueSpreadRatio: +(maxValue / Math.max(1, minValue)).toFixed(2),
  };
}

export function runInjuryCardRateTest({ matches = 1000, rng = Math.random } = {}) {
  let yellows = 0;
  let reds = 0;
  let injuries = 0;
  for (let i = 0; i < matches; i += 1) {
    const styleRisk = rng() < 0.24 ? 1.25 : rng() < 0.16 ? 0.86 : 1;
    yellows += poisson(2.15 * styleRisk, rng);
    reds += rng() < 0.16 * styleRisk ? 1 : 0;
    injuries += rng() < 0.19 * styleRisk ? 1 : 0;
  }
  return {
    matches,
    yellowRate: +(yellows / matches).toFixed(2),
    redRate: +(reds / matches).toFixed(2),
    injuryRate: +(injuries / matches).toFixed(2),
  };
}

export function runSaveMigrationSmokeTest() {
  const legacy = { id: 1, players: [{ id: 7, name: 'Legacy Striker', injuryWeeks: 3, fitness: 88, morale: 66 }] };
  const migratedPlayer = {
    ...legacy.players[0],
    injuredWeeks: Math.max(0, Number(legacy.players[0].injuredWeeks ?? legacy.players[0].injuryWeeks ?? 0)),
  };
  delete migratedPlayer.injuryWeeks;
  return {
    injuredWeeksMapped: migratedPlayer.injuredWeeks,
    hasLegacyInjuryWeeks: Object.prototype.hasOwnProperty.call(migratedPlayer, 'injuryWeeks'),
    playerName: migratedPlayer.name,
  };
}
