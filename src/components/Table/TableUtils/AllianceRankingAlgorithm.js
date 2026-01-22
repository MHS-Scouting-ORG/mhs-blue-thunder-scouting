/**
 * Alliance Selection Ranking Algorithm
 * Ranks teams based on various performance metrics
 */

export function calculateTeamScore(teamData) {
  if (!teamData) return 0;

  // Weights for different metrics (adjustable)
  const weights = {
    avgPoints: 0.3,
    avgAutoPts: 0.2,
    avgEndgamePts: 0.2,
    avgCycles: 0.15,
    opr: 0.1,
    reliability: 0.05
  };

  // Calculate reliability score (inverse of issues)
  const totalMatches = teamData.Matches || 1;
  const issues = (teamData.BrokenRobot || 0) + (teamData.Disabled || 0) + (teamData.DQ || 0);
  const reliability = Math.max(0, 1 - (issues / totalMatches));

  // Normalize OPR (assuming OPR ranges from 0-50, adjust if needed)
  const normalizedOpr = (teamData.OPR || 0) / 50;

  const score =
    (teamData.AvgPoints || 0) * weights.avgPoints +
    (teamData.AvgAutoPts || 0) * weights.avgAutoPts +
    (teamData.AvgEndgamePts || 0) * weights.avgEndgamePts +
    (teamData.AvgCycles || 0) * weights.avgCycles +
    normalizedOpr * weights.opr +
    reliability * weights.reliability;

  return score;
}

export function rankTeamsForAllianceSelection(teamsData) {
  if (!teamsData || !Array.isArray(teamsData)) return [];

  return teamsData
    .map(team => ({
      ...team,
      allianceScore: calculateTeamScore(team)
    }))
    .sort((a, b) => b.allianceScore - a.allianceScore);
}