const { match } = require("./src/data/match");
const { simulateOver } = require("./src/services/scenarioEngine");

console.log("CURRENT MATCH");
console.log(`${match.battingTeam}: ${match.score}/${match.wickets}`);
console.log(`Overs: ${match.oversCompleted}.0`);
console.log(`Target: ${match.target}`);

console.log("\nSCENARIO 1: India scores 15 runs");

const scenario1 = simulateOver(match, 15, 0);
console.log(scenario1);

console.log("\nSCENARIO 2: India scores 8 runs and loses a wicket");

const scenario2 = simulateOver(match, 8, 1);
console.log(scenario2);

console.log("\nSCENARIO 3: India scores 20 runs");

const scenario3 = simulateOver(match, 20, 0);
console.log(scenario3);