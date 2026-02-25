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
  const totalMatches = Math.max(1, Number(teamData.Matches || 0));
  const broken = Array.isArray(teamData.BrokenRobot) ? teamData.BrokenRobot.length : Number(teamData.BrokenRobot || 0)
  const disabled = Array.isArray(teamData.Disabled) ? teamData.Disabled.length : Number(teamData.Disabled || 0)
  const dq = Array.isArray(teamData.DQ) ? teamData.DQ.length : Number(teamData.DQ || 0)
  const issues = broken + disabled + dq;
  const reliability = Math.max(0, 1 - (issues / totalMatches));

  const normalizedOpr = Number(teamData.OPR || 0) / 50;

  const avgPoints = Number(teamData.AvgPoints || 0)
  const avgAutoPts = Number(teamData.AvgAutoPts || 0)
  const avgEndgamePts = Number(teamData.AvgEndgamePts || 0)
  const avgCycles = Number(teamData.AvgCycles || 0)

  const score =
    avgPoints * weights.avgPoints +
    avgAutoPts * weights.avgAutoPts +
    avgEndgamePts * weights.avgEndgamePts +
    avgCycles * weights.avgCycles +
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