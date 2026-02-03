const normalizeTeamId = (teamId) => {
  if (teamId === null || teamId === undefined) return "";
  const value = String(teamId).trim();
  if (!value) return "";
  return value.startsWith("frc") ? value.slice(3) : value;
};

const toTeamKey = (teamId) => {
  const normalized = normalizeTeamId(teamId);
  return normalized ? `frc${normalized}` : "";
};

const isSameTeam = (a, b) => {
  return normalizeTeamId(a) === normalizeTeamId(b);
};

export { normalizeTeamId, toTeamKey, isSameTeam };
