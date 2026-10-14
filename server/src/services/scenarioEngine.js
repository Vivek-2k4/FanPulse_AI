function simulateOver(match, runsScored, wicketsLost = 0) {
  // Validate the inputs
  if (!Number.isInteger(runsScored) || runsScored < 0) {
    throw new Error("Runs must be a non-negative integer.");
  }

  if (!Number.isInteger(wicketsLost) || wicketsLost < 0) {
    throw new Error("Wickets lost must be a non-negative integer.");
  }

  // Calculate the current match state
  const ballsCompleted =
    match.oversCompleted * 6 + match.ballsInCurrentOver;

  const ballsRemaining = 120 - ballsCompleted;

  // Check whether the innings can continue
  if (ballsRemaining < 6) {
    throw new Error("Not enough balls remain for a full over.");
  }

  if (match.score >= match.target) {
    throw new Error("The target has already been reached.");
  }

  if (match.wickets >= 10) {
    throw new Error("The innings has already ended.");
  }

  if (wicketsLost > 10 - match.wickets) {
    throw new Error("Invalid number of wickets lost.");
  }

  // Calculate the hypothetical outcome
  const newScore = match.score + runsScored;
  const newWickets = match.wickets + wicketsLost;

  const newBallsCompleted = ballsCompleted + 6;
  const newBallsRemaining = 120 - newBallsCompleted;

  const newRunsRemaining = Math.max(
    0,
    match.target - newScore
  );

  const inningsEnded =
    newScore >= match.target ||
    newWickets >= 10 ||
    newBallsRemaining === 0;

  const requiredRunRate =
    !inningsEnded && newBallsRemaining > 0
      ? (newRunsRemaining * 6) / newBallsRemaining
      : null;

  return {
    score: newScore,
    wickets: newWickets,
    oversCompleted: Math.floor(newBallsCompleted / 6),
    ballsInCurrentOver: newBallsCompleted % 6,
    runsRemaining: newRunsRemaining,
    ballsRemaining: newBallsRemaining,

    requiredRunRate:
      requiredRunRate === null
        ? null
        : Number(requiredRunRate.toFixed(2)),

    inningsEnded,

    result:
      newScore >= match.target
        ? "Target reached"
        : newWickets >= 10
          ? "All out"
          : newBallsRemaining === 0
            ? "Overs completed"
            : "Match continues",
  };
}

module.exports = { simulateOver };