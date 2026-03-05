import { normalizeTeamId } from './teamId';

const ASSIGNMENTS_STORAGE_KEY = 'bt_scouting_assignments_v1';
const PREFILL_STORAGE_KEY = 'bt_scouting_prefill_v1';
const DEFAULT_EXCLUDED_TEAM = '2443';

const toArray = (value) => (Array.isArray(value) ? value : []);

const sortAssignments = (assignments) => {
  return [...toArray(assignments)].sort((a, b) => {
    const byMatch = Number(a?.matchNumber || 0) - Number(b?.matchNumber || 0);
    if (byMatch !== 0) return byMatch;
    if (a?.allianceColor === b?.allianceColor) {
      return Number(a?.teamNumber || 0) - Number(b?.teamNumber || 0);
    }
    return a?.allianceColor === 'red' ? -1 : 1;
  });
};

const normalizeScouter = (scouter) => {
  const email = String(scouter?.email || '').trim().toLowerCase();
  if (!email) return null;

  return {
    id: String(scouter?.id || email),
    name: String(scouter?.name || email).trim(),
    email,
  };
};

const normalizeExcludedTeams = (teams) => {
  const set = new Set([DEFAULT_EXCLUDED_TEAM]);

  toArray(teams).forEach((team) => {
    const normalized = normalizeTeamId(team);
    if (normalized) set.add(normalized);
  });

  return Array.from(set);
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (_) {
    return null;
  }
};

const buildMatchSlots = (match) => {
  const redTeams = toArray(match?.alliances?.red?.team_keys)
    .map((teamKey) => normalizeTeamId(teamKey))
    .filter(Boolean);
  const blueTeams = toArray(match?.alliances?.blue?.team_keys)
    .map((teamKey) => normalizeTeamId(teamKey))
    .filter(Boolean);

  const slots = [];

  redTeams.forEach((teamNumber) => {
    slots.push({
      matchKey: match?.key,
      matchNumber: Number(match?.match_number || 0),
      teamNumber,
      allianceColor: 'red',
    });
  });

  blueTeams.forEach((teamNumber) => {
    slots.push({
      matchKey: match?.key,
      matchNumber: Number(match?.match_number || 0),
      teamNumber,
      allianceColor: 'blue',
    });
  });

  return slots;
};

const generateAssignments = ({ matches, scouters, excludedTeams }) => {
  const normalizedScouters = toArray(scouters).map(normalizeScouter).filter(Boolean);
  if (normalizedScouters.length === 0) return [];

  const excludedSet = new Set(normalizeExcludedTeams(excludedTeams));

  const qualificationMatches = toArray(matches)
    .filter((match) => match?.comp_level === 'qm')
    .sort((a, b) => Number(a?.match_number || 0) - Number(b?.match_number || 0));

  const assignments = [];
  let assignmentIndex = 0;

  qualificationMatches.forEach((match) => {
    const slots = buildMatchSlots(match).filter((slot) => !excludedSet.has(slot.teamNumber));

    slots.forEach((slot) => {
      const scouter = normalizedScouters[assignmentIndex % normalizedScouters.length];
      assignmentIndex += 1;

      assignments.push({
        ...slot,
        scouterId: scouter.id,
        scouterEmail: scouter.email,
        scouterName: scouter.name,
      });
    });
  });

  return sortAssignments(assignments);
};

const getDefaultAssignmentState = () => ({
  version: 1,
  scouters: [],
  excludedTeams: [DEFAULT_EXCLUDED_TEAM],
  currentMatchNumber: 1,
  assignments: [],
  updatedAt: null,
});

const loadAssignmentsState = () => {
  if (typeof window === 'undefined') return getDefaultAssignmentState();

  const raw = window.localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
  if (!raw) return getDefaultAssignmentState();

  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== 'object') return getDefaultAssignmentState();

  const scouters = toArray(parsed.scouters).map(normalizeScouter).filter(Boolean);
  const excludedTeams = normalizeExcludedTeams(parsed.excludedTeams);
  const currentMatchNumber = Number(parsed.currentMatchNumber || 1) || 1;

  return {
    ...getDefaultAssignmentState(),
    ...parsed,
    scouters,
    excludedTeams,
    currentMatchNumber,
    assignments: sortAssignments(parsed.assignments || []),
  };
};

const saveAssignmentsState = (state) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    ASSIGNMENTS_STORAGE_KEY,
    JSON.stringify({ ...state, updatedAt: Date.now() })
  );
};

const savePrefillAssignment = (assignment) => {
  if (typeof window === 'undefined' || !assignment) return;
  window.localStorage.setItem(PREFILL_STORAGE_KEY, JSON.stringify(assignment));
};

const popPrefillAssignment = () => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(PREFILL_STORAGE_KEY);
  if (!raw) return null;

  window.localStorage.removeItem(PREFILL_STORAGE_KEY);
  const parsed = safeParse(raw);
  return parsed && typeof parsed === 'object' ? parsed : null;
};

const extractQualificationMatchNumber = (matchId) => {
  const value = String(matchId || '').trim();
  if (!value) return null;

  const match = value.match(/_qm(\d+)$/i);
  if (!match) return null;

  return Number(match[1] || 0) || null;
};

const buildCompletionCounts = (teamItems, regionalId) => {
  const counts = {};

  toArray(teamItems).forEach((team) => {
    const regionals = toArray(team?.Regionals);

    regionals.forEach((regional) => {
      if (regional?.RegionalId !== regionalId) return;

      const teamMatches = toArray(regional?.TeamMatches);
      teamMatches.forEach((match) => {
        const matchNumber = extractQualificationMatchNumber(match?.MatchId);
        if (!matchNumber) return;

        counts[matchNumber] = (counts[matchNumber] || 0) + 1;
      });
    });
  });

  return counts;
};

const isAssignmentComplete = (assignment, completionCounts) => {
  const matchNumber = Number(assignment?.matchNumber || 0);
  if (!matchNumber) return false;

  return Number(completionCounts?.[matchNumber] || 0) >= 2;
};

const getAssignmentsForEmail = (state, email) => {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return [];

  return sortAssignments(
    toArray(state?.assignments).filter(
      (assignment) => String(assignment?.scouterEmail || '').toLowerCase() === normalized
    )
  );
};

const getNextAssignment = ({ state, email, completionCounts, fromMatchNumber }) => {
  const assignments = getAssignmentsForEmail(state, email);
  if (assignments.length === 0) return null;

  const startAt = Number(fromMatchNumber || state?.currentMatchNumber || 1) || 1;

  const remaining = assignments.filter((assignment) => {
    if (Number(assignment?.matchNumber || 0) < startAt) return false;
    return !isAssignmentComplete(assignment, completionCounts);
  });

  if (remaining.length > 0) return remaining[0];

  const fallback = assignments.find((assignment) => !isAssignmentComplete(assignment, completionCounts));
  return fallback || null;
};

const upsertScouter = (state, scouter) => {
  const normalized = normalizeScouter(scouter);
  if (!normalized) return state;

  const existing = toArray(state.scouters);
  const index = existing.findIndex((item) => item.email === normalized.email);
  const next = [...existing];

  if (index >= 0) {
    next[index] = { ...next[index], ...normalized };
  } else {
    next.push(normalized);
  }

  return {
    ...state,
    scouters: next,
  };
};

const removeScouterById = (state, scouterId) => {
  return {
    ...state,
    scouters: toArray(state.scouters).filter((scouter) => scouter.id !== scouterId),
  };
};

export {
  ASSIGNMENTS_STORAGE_KEY,
  DEFAULT_EXCLUDED_TEAM,
  loadAssignmentsState,
  saveAssignmentsState,
  savePrefillAssignment,
  popPrefillAssignment,
  generateAssignments,
  buildCompletionCounts,
  isAssignmentComplete,
  getAssignmentsForEmail,
  getNextAssignment,
  upsertScouter,
  removeScouterById,
  normalizeExcludedTeams,
};
