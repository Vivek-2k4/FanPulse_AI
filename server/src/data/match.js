const match = {
  id: "india-australia-demo",
  status: "SIMULATED",
  format: "T20",
  battingTeam: "India",
  bowlingTeam: "Australia",
  innings: 2,
  score: 148,
  wickets: 4,
  oversCompleted: 15,
  ballsInCurrentOver: 0,
  target: 200,
};

function getMatchContext() {
  const ballsCompleted =
    match.oversCompleted * 6 + match.ballsInCurrentOver;

  const ballsRemaining = Math.max(0, 120 - ballsCompleted);
  const runsRemaining = Math.max(0, match.target - match.score);

  const requiredRunRate =
    ballsRemaining > 0
      ? (runsRemaining * 6) / ballsRemaining
      : null;

  return {
    ...match,
    ballsCompleted,
    ballsRemaining,
    runsRemaining,
    requiredRunRate:
      requiredRunRate === null
        ? null
        : Number(requiredRunRate.toFixed(2)),
    wicketsRemaining: 10 - match.wickets,
  };
}

module.exports = { match, getMatchContext };