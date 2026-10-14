const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;

async function generateMatchInsights(match, scenario = null) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  if (!model) {
    throw new Error("GEMINI_MODEL is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const matchData = {
    matchStatus: match.status,
    format: match.format,
    battingTeam: match.battingTeam,
    bowlingTeam: match.bowlingTeam,
    innings: match.innings,
    score: `${match.score}/${match.wickets}`,
    oversCompleted: match.oversCompleted,
    target: match.target,
    runsRemaining: match.runsRemaining,
    ballsRemaining: match.ballsRemaining,
    wicketsRemaining: match.wicketsRemaining,
    requiredRunRate: match.requiredRunRate,
  };

  const prompt = `
You are FanPulse AI, an analytical cricket assistant.

Analyze the following cricket match using only the supplied data.

MATCH DATA:
${JSON.stringify(matchData, null, 2)}

${scenario ? `HYPOTHETICAL SCENARIO:\n${JSON.stringify(scenario, null, 2)}` : ""}

Return a concise analysis with these sections:
1. Match Situation: Explain the current state of the chase.
2. Pressure Analysis: Discuss the required run rate, balls remaining,
   and wickets remaining.
3. Key Takeaway: Give one practical observation about the situation.
4. Next Phase: Explain what the batting team needs to focus on.

Rules:
- Use only the supplied match data.
- Do not invent player names, player statistics, or events.
- Do not claim to know the actual winner or future outcome.
- Clearly distinguish hypothetical scenarios from actual match events.
- If information is missing, acknowledge that limitation.
- Keep the analysis clear, concise, and useful to cricket fans.
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const insights = response.text;

  if (!insights || !insights.trim()) {
    throw new Error("The AI returned an empty response.");
  }

  return {
    model,
    insights: insights.trim(),
    generatedAt: new Date().toISOString(),
    basedOn: matchData,
  };
}

module.exports = { generateMatchInsights };
