import { runFairnessBatch, makeSeededRng, runEconomyStressTest, runSaveMigrationSmokeTest, runTransferMarketStressTest, runInjuryCardRateTest } from '../src/game/fairnessTest.js';

const failures = [];
function assertRange(name, value, min, max) {
  const pass = value >= min && value <= max;
  console.log(`${pass ? 'OK' : 'FAIL'} ${name}: ${value} target ${min}-${max}`);
  if (!pass) failures.push(`${name}=${value} not in ${min}-${max}`);
}
function assertPass(name, pass, detail = '') {
  console.log(`${pass ? 'OK' : 'FAIL'} ${name}${detail ? `: ${detail}` : ''}`);
  if (!pass) failures.push(name);
}

const fairness = runFairnessBatch({ matches: 1000, homePower: 72, awayPower: 72, rng: makeSeededRng('v20-fairness-1000') });
console.log('Fairness sample:', fairness);
assertRange('homeWinRate', fairness.homeWinRate, 38, 48);
assertRange('awayWinRate', fairness.awayWinRate, 26, 36);
assertRange('drawRate', fairness.drawRate, 20, 31);
assertRange('avgGoals', fairness.avgGoals, 2.25, 3.2);
assertRange('upsetRate', fairness.upsetRate, 8, 28);

const economy = runEconomyStressTest({ seasons: 10, clubs: 48, rng: makeSeededRng('v20-economy-10-season') });
console.log('Economy sample:', economy);
assertRange('economy.avgBudget', economy.avgBudget, 90000, 900000);
assertRange('economy.negativeClubs', economy.negativeClubs, 0, 18);
assertRange('economy.richClubs', economy.richClubs, 0, 14);

const transfer = runTransferMarketStressTest({ players: 500, rng: makeSeededRng('v20-transfer-stress') });
console.log('Transfer sample:', transfer);
assertPass('transfer.noDuplicateIds', transfer.duplicateIds === 0, `duplicates=${transfer.duplicateIds}`);
assertRange('transfer.valueSpreadRatio', transfer.valueSpreadRatio, 8, 120);

const rates = runInjuryCardRateTest({ matches: 1000, rng: makeSeededRng('v20-injury-card') });
console.log('Card/injury sample:', rates);
assertRange('yellowRate', rates.yellowRate, 1.2, 4.8);
assertRange('redRate', rates.redRate, 0.04, 0.55);
assertRange('injuryRate', rates.injuryRate, 0.05, 0.8);

const migration = runSaveMigrationSmokeTest();
console.log('Migration sample:', migration);
assertPass('migration.injuredWeeksMapped', migration.injuredWeeksMapped === 3, `injuredWeeks=${migration.injuredWeeksMapped}`);
assertPass('migration.noLegacyInjuryWeeks', migration.hasLegacyInjuryWeeks === false);

if (failures.length) {
  console.error(`Full QA failed: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('Full QA checks passed.');
