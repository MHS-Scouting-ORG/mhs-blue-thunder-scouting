import React, { useEffect, useRef, useState } from "react"
import { apiGetMatchesForRegional, apiGetStatboticsTeamEventPrediction, apiGetRegional, apiGetTeam, apiListTeams, apiCreateTeamEntry, apiGetRegionalTeams, toNotesTeamId } from '../api/index';
import { normalizeTeamId, isSameTeam } from '../utils/teamId';
import { getTopTeamSuggestions } from "../utils/teamSearch";

import tableStyling from "../components/Table/Table.module.css";

// styling

import { submitState } from './FormUtils' //from formUtils submits to builder

const sectionHelp = {
  matchInfo: "Pick the exact team and match first. For Practice, type a team number/name; for scheduled matches, select alliance and team from the match list.",
  autonomous: "Mark only actions fully completed in auto. Fuel = balls shot into the active hub; use Autonomous Win and Auto Impact to rate auto-only influence.",
  activeStrategy: "Record primary teleop role while your hub is active: scoring Fuel, defending, or hoarding. Use Mid Trips and Shooting Cycles as count metrics, and Balls Shot for total Fuel scored.",
  inactiveStrategy: "Track what this robot did while their hub was inactive. Mark all tactics that actually mattered this match.",
  results: "Capture final match outcome, endgame hang, scores, and overall impact. Use penalty toggles only when they clearly occurred.",
  robotInfo: "Rate robot quality vs event average: drive speed, shooter speed, driver skill, and defense effectiveness. Add Fuel Capacity and comments for anything notable or unusual."
};

const OUR_TEAM_NUMBER = '2443';

const InfoIcon = ({ text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "#e0e0e0",
      color: "#333",
      fontWeight: 700,
      cursor: "pointer",
      marginLeft: "8px",
      fontSize: "14px",
      userSelect: "none",
      border: "none",
      padding: 0
    }}
    aria-label={text}
  >
    ?
  </button>
);

 function Form() {
  /* Regional Key */
  // regional key is populated asynchronously by apiUpdateRegional in App.jsx.
  // maintain it in state so that when it becomes defined the component rerenders.
  const [regional, setRegional] = useState(apiGetRegional());

  // keep polling until the regional key arrives; stops once set
  useEffect(() => {
    if (regional) return;
    const id = setInterval(() => {
      const reg = apiGetRegional();
      if (reg) {
        setRegional(reg);
        clearInterval(id);
      }
    }, 500);
    return () => clearInterval(id);
  }, [regional]);

  /* MATCH STATES*/
  const [matchData, setMatchData] = useState([]) //used to pick blue alliance info
  const [apiTeamListData, setApiTeamListData] = useState([]) //team list data in our database
  const [isTeamListLoaded, setIsTeamListLoaded] = useState(false)
  const [matchType, setMatchType] = useState(''); //match type
  // const [elmNum, setElmNum] = useState(''); //elimination
  const [matchNumber, setMatchNumber] = useState(''); //match number
  const [teamNumber, setTeamNumber] = useState(''); //team num
  const [color, setColor] = useState(undefined); // alliance color
  const [red, setRed] = useState([]); //red teams for a given match
  const [blue, setBlue] = useState([]); //blue teams for a given match
  const [matchKey, setMatchKey] = useState(''); //match key
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const [suggestedAutoTeamNumber, setSuggestedAutoTeamNumber] = useState('');
  const [suggestedAutoColor, setSuggestedAutoColor] = useState(undefined);
  const [simpleTeams, setSimpleTeams] = useState([]);
  const [regionalMatches, setRegionalMatches] = useState([]);
  const [regionalTeamSet, setRegionalTeamSet] = useState(new Set());
  const [teamSearchInput, setTeamSearchInput] = useState('');
  const [teamSuggestions, setTeamSuggestions] = useState([]);

  /* AUTO SPECIFIC */
  const [autoActions, setAutoActions] = useState([]);
  const [autoHang, setAutoHang] = useState('None');
  const [autoWin, setAutoWin] = useState('');
  const [autoImpact, setAutoImpact] = useState('');

  /* ENDGAME */
  const [hangType, setHangType] = useState('');

  /* RESULTS FLAGS */
  const [disable, setDisable] = useState(false);
  const [dq, setDQ] = useState(false);
  const [botBroke, setBotBroke] = useState(false);
  const [noShow, setNoShow] = useState(false);
  const [stuckOnBump, setStuckOnBump] = useState(false);
  const [stuckOnBalls, setStuckOnBalls] = useState(false);
  const [robotBrokenComments, setRobotBrokenComments] = useState("");

  /* ROBOT INFO */
  const [robotSpeed, setRobotSpeed] = useState('');
  const [driverSkill, setDriverSkill] = useState('');
  const [defenseEffectiveness, setDefenseEffectiveness] = useState('');
  const [fuelCapacity, setFuelCapacity] = useState('');
  const [shootingSpeed, setShootingSpeed] = useState('');
  const [robotInsight, setRobotInsight] = useState("");
  const [estimatedBallsShot, setEstimatedBallsShot] = useState(0);

  /* ACTIVE/INACTIVE STRATEGIES */
  const [activeStrategy, setActiveStrategy] = useState([]);
  const [inactiveStrategy, setInactiveStrategy] = useState([]);
  const [timesTravelledMid, setTimesTravelledMid] = useState(0);
  const [shootingCycles, setShootingCycles] = useState(0);

  /* RESULTS */
  const [matchResult, setMatchResult] = useState('');
  const [allianceScore, setAllianceScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [teamImpact, setTeamImpact] = useState('');

  /* Submit */
  const [confirm, setConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLockedUntil, setSubmitLockedUntil] = useState(0);
  const [submitCooldownSeconds, setSubmitCooldownSeconds] = useState(0);

  /* Info popup */
  const [infoModal, setInfoModal] = useState("");

  const fieldRefs = useRef({});
  const ballsHoldTimerRef = useRef(null);
  const lastAutoSelectionSignature = useRef('');
  const lastManualSuggestionSignature = useRef('');
  const statboticsPredictionCache = useRef(new Map());

  useEffect(() => {
    if (!regional) {
      setRegionalMatches([]);
      return;
    }

    let isActive = true;

    apiGetMatchesForRegional(regional)
      .then((data) => {
        if (!isActive) return;
        setRegionalMatches(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!isActive) return;
        setRegionalMatches([]);
      });

    return () => {
      isActive = false;
    };
  }, [regional]);

  useEffect(() => {
    const normalizedMatchNumber = String(matchNumber || '').trim();
    if (!matchType || !normalizedMatchNumber) {
      setMatchKey('');
      setRed([]);
      setBlue([]);
      setMatchData([]);
      lastAutoSelectionSignature.current = '';
      lastManualSuggestionSignature.current = '';
      setSuggestedAutoTeamNumber('');
      setSuggestedAutoColor(undefined);
      return;
    }

    if (matchType === "p") {
      const practiceKey = `${regional || ""}_pm${normalizedMatchNumber}`;
      setMatchKey(practiceKey);
      setRed([]);
      setBlue([]);
      setMatchData([]);
      return;
    }

    if (!regional) {
      return;
    }

    const baMatchType = matchType === "qa" || matchType === "qm" ? "q" : matchType;
    let nextMatchKey = `${regional}_${baMatchType}m${normalizedMatchNumber}`;

    if (baMatchType === "sf") {
      nextMatchKey = `${regional}_${baMatchType}${normalizedMatchNumber}m1`;
    }
    if (baMatchType === "f") {
      nextMatchKey = `${regional}_${baMatchType}1m${normalizedMatchNumber}`;
    }

    setMatchKey(nextMatchKey);

    const match = regionalMatches.find((entry) => entry?.key === nextMatchKey);
    if (match) {
      setMatchData(match);
      setRed(Array.isArray(match?.alliances?.red?.team_keys) ? match.alliances.red.team_keys : []);
      setBlue(Array.isArray(match?.alliances?.blue?.team_keys) ? match.alliances.blue.team_keys : []);
    } else {
      setRed([]);
      setBlue([]);
      setMatchData([]);
    }
  }, [matchType, matchNumber, regional, regionalMatches])

  useEffect(() => {
    if (!regional) {
      setSimpleTeams([]);
      setRegionalTeamSet(new Set());
      return;
    }

    apiGetRegionalTeams(regional)
      .then((data) => {
        const teamsData = Array.isArray(data) ? data : [];
        setSimpleTeams(teamsData);
        setRegionalTeamSet(new Set(teamsData.map((t) => String(t?.team_number || t?.TeamNumber || '').trim()).filter(Boolean)));
      })
      .catch(() => {
        setSimpleTeams([]);
        setRegionalTeamSet(new Set());
      });
  }, [regional]);

  useEffect(() => {
    const term = String(teamSearchInput || '').trim();
    if (!term || matchType !== 'p') {
      setTeamSuggestions([]);
      return;
    }

    const suggestions = getTopTeamSuggestions({
      term,
      dbTeams: [],
      simpleTeams,
      resolveDbTeamNumber: () => '',
      limit: 3,
    });

    setTeamSuggestions(suggestions);
  }, [teamSearchInput, simpleTeams, matchType]);

  useEffect(() => {
    loadTeamList()
  }, [])

  /* Stop Non Numbers From Going Into Number States */
  const stopNonNum = (e) => {
    const banned = ['e', 'E', '-', '+']
    if (banned.includes(e.key)) {
      e.preventDefault();
    }
  }

  /* resets form based on successful submission */
  const resetStates = () => {
    setMatchData([])
    setMatchNumber('')
    setTeamNumber('')
    setTeamSearchInput('')
    setTeamSuggestions([])
    setColor(undefined)
    setRed([])
    setBlue([])
    setMatchKey('')
    setAutoActions([])
    setAutoHang('None')
    setAutoWin('')
    setAutoImpact('')
    setHangType('')
    setActiveStrategy([])
    setInactiveStrategy([])
    setTimesTravelledMid(0)
    setShootingCycles(0)
    setMatchResult('')
    setAllianceScore('')
    setOpponentScore('')
    setTeamImpact('')
    setDisable(false)
    setDQ(false)
    setBotBroke(false)
    setNoShow(false)
    setStuckOnBump(false)
    setStuckOnBalls(false)
    setRobotBrokenComments('')
    setRobotSpeed('')
    setDriverSkill('')
    setDefenseEffectiveness('')
    setFuelCapacity('')
    setShootingSpeed('')
    setRobotInsight('')
    setEstimatedBallsShot(0)
    setConfirm(false)
    setIsSubmitting(false)
    setSubmitLockedUntil(0)
    setSubmitCooldownSeconds(0)

  }

  const resetEntireForm = () => {
    setMatchType('')
    resetStates()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const normalizeNumberField = (value) => {
    const parsed = Number.parseInt(String(value), 10)
    return Number.isNaN(parsed) ? null : parsed
  }

  const toNumber = (value, fallback = 0) => {
    const num = Number(value)
    return Number.isFinite(num) ? num : fallback
  }

  const parseMatchOrder = (matchId) => {
    const id = String(matchId || '').toLowerCase()
    const qualMatchNumber = id.match(/qm(\d+)/i)
    if (qualMatchNumber?.[1]) return toNumber(qualMatchNumber[1], 0)

    const matchNumber = id.match(/m(\d+)$/i) || id.match(/_(\d+)$/)
    if (matchNumber?.[1]) return toNumber(matchNumber[1], 0)

    return 0
  }

  const normalizeMatchId = (matchId) => String(matchId || '').trim()

  const isQualificationMatchEntry = (entry) => {
    const matchType = String(entry?.MatchType || '').trim().toLowerCase()
    if (matchType === 'q' || matchType === 'qm') return true
    const matchId = normalizeMatchId(entry?.MatchId || entry?.id)
    return /(?:^|_)qm\d+/i.test(matchId)
  }

  const getSubmittedQualificationMatchNumbers = (teamEntry) => {
    return getRegionalTeamMatches(teamEntry)
      .filter((entry) => isQualificationMatchEntry(entry))
      .map((entry) => {
        const explicitMatchNumber = toNumber(entry?.match_number, NaN)
        if (Number.isFinite(explicitMatchNumber) && explicitMatchNumber > 0) return explicitMatchNumber
        return parseMatchOrder(entry?.MatchId || entry?.id)
      })
      .filter((value) => Number.isFinite(value) && value > 0)
  }

  const getRegionalTeamMatches = (teamEntry) => {
    const regionals = Array.isArray(teamEntry?.Regionals) ? teamEntry.Regionals : [];
    const currentRegional = regionals.find((entry) => entry?.RegionalId === regional);
    return Array.isArray(currentRegional?.TeamMatches) ? currentRegional.TeamMatches : [];
  }

  const getAllianceTeamNumbers = (match, allianceColor) => {
    const keys = Array.isArray(match?.alliances?.[allianceColor]?.team_keys)
      ? match.alliances[allianceColor].team_keys
      : [];
    return keys.map(normalizeTeamId).filter(Boolean);
  }

  const loadTeamList = async () => {
    setIsTeamListLoaded(false);
    try {
      const data = await apiListTeams();
      const teamList = data?.data?.listTeams?.items || [];
      setApiTeamListData(teamList);
      setIsTeamListLoaded(true);
      return teamList;
    } catch (_) {
      setApiTeamListData([]);
      setIsTeamListLoaded(true);
      return [];
    }
  }

  const getAutoScoutRecommendation = async () => {
    const currentMatchNumber = toNumber(matchData?.match_number, parseMatchOrder(matchKey));
    const matchTeams = [
      ...getAllianceTeamNumbers(matchData, 'red'),
      ...getAllianceTeamNumbers(matchData, 'blue')
    ]
      .map(normalizeTeamId)
      .filter(Boolean);

    if (matchTeams.length === 0) return null;

    const futureOurMatches = regionalMatches
      .filter((entry) => entry?.comp_level === 'qm')
      .filter((entry) => toNumber(entry?.match_number, 0) > currentMatchNumber)
      .filter((entry) => {
        const redTeams = getAllianceTeamNumbers(entry, 'red');
        const blueTeams = getAllianceTeamNumbers(entry, 'blue');
        return [...redTeams, ...blueTeams].includes(OUR_TEAM_NUMBER);
      })
      .sort((a, b) => toNumber(a?.match_number, 0) - toNumber(b?.match_number, 0));

    const opponentDueMatches = new Map();
    futureOurMatches.forEach((entry) => {
      const redTeams = getAllianceTeamNumbers(entry, 'red');
      const blueTeams = getAllianceTeamNumbers(entry, 'blue');
      const ourAlliance = redTeams.includes(OUR_TEAM_NUMBER) ? redTeams : blueTeams;
      const opponentAlliance = ourAlliance === redTeams ? blueTeams : redTeams;
      const dueMatchNumber = toNumber(entry?.match_number, 0);

      opponentAlliance.forEach((teamNum) => {
        if (!teamNum || teamNum === OUR_TEAM_NUMBER || opponentDueMatches.has(teamNum)) return;
        opponentDueMatches.set(teamNum, dueMatchNumber);
      });
    });

    const teamsToLoad = Array.from(new Set([
      ...matchTeams,
      ...opponentDueMatches.keys(),
    ]));

    const cachedEntriesById = new Map(
      (Array.isArray(apiTeamListData) ? apiTeamListData : [])
        .map((entry) => [String(entry?.id || '').trim(), entry])
        .filter(([id]) => Boolean(id))
    );

    const baseTeamsByNumber = new Map(
      teamsToLoad.map((teamNum) => [teamNum, cachedEntriesById.get(teamNum) || null])
    );

    const notesTeamsByNumber = new Map(
      matchTeams.map((teamNum) => [teamNum, cachedEntriesById.get(toNotesTeamId(teamNum)) || null])
    );

    const uncoveredOpponents = new Map();
    opponentDueMatches.forEach((dueMatchNumber, teamNum) => {
      const priorMatchNumbers = getSubmittedQualificationMatchNumbers(baseTeamsByNumber.get(teamNum));

      const hasCoverageBeforeDueMatch = priorMatchNumbers.some((value) => value < dueMatchNumber);
      if (!hasCoverageBeforeDueMatch) {
        uncoveredOpponents.set(teamNum, dueMatchNumber);
      }
    });

    const teamSummaries = await Promise.all(matchTeams.map(async (teamNum) => {
      if (teamNum === OUR_TEAM_NUMBER) {
        return null;
      }

      const notesEntry = notesTeamsByNumber.get(teamNum);
      const attrs = notesEntry?.TeamAttributes || {};
      const isPickable = attrs.Pickable !== false;

      const scoutedMatchNumbers = getSubmittedQualificationMatchNumbers(baseTeamsByNumber.get(teamNum));
      const hasAnyScoutData = scoutedMatchNumbers.length > 0;
      const lastScoutedMatch = hasAnyScoutData ? Math.max(...scoutedMatchNumbers) : 0;

      const cacheKey = `${regional}::${teamNum}`;
      let predictionScore = 0;
      if (statboticsPredictionCache.current.has(cacheKey)) {
        predictionScore = statboticsPredictionCache.current.get(cacheKey);
      } else {
        try {
          const prediction = await apiGetStatboticsTeamEventPrediction(teamNum, regional);
          predictionScore = toNumber(prediction?.statboticsScore, 0);
          statboticsPredictionCache.current.set(cacheKey, predictionScore);
        } catch (_) {
          predictionScore = 0;
        }
      }

      return {
        teamNum,
        predictionScore,
        hasAnyScoutData,
        lastScoutedMatch,
        isPickable,
        targetDueMatchNumber: uncoveredOpponents.get(teamNum) || null,
      };
    }));

    const eligibleSummaries = teamSummaries.filter(Boolean);
    if (eligibleSummaries.length === 0) return null;

    const pickableTeams = eligibleSummaries.filter((summary) => summary.isPickable);
    const candidates = pickableTeams.length > 0 ? pickableTeams : eligibleSummaries;

    const priorityCandidates = candidates
      .filter((summary) => summary.targetDueMatchNumber !== null)
      .filter((summary) => currentMatchNumber < summary.targetDueMatchNumber);

    let selectionPool = priorityCandidates;
    if (selectionPool.length === 0) {
      const unscouted = candidates.filter((summary) => !summary.hasAnyScoutData);
      selectionPool = unscouted.length > 0 ? unscouted : candidates;
    }

    if (selectionPool.length === 0) return null;

    selectionPool.sort((a, b) => {
      const aDueMatch = a.targetDueMatchNumber ?? Number.POSITIVE_INFINITY;
      const bDueMatch = b.targetDueMatchNumber ?? Number.POSITIVE_INFINITY;
      if (aDueMatch !== bDueMatch) {
        return aDueMatch - bDueMatch;
      }
      if (a.predictionScore !== b.predictionScore) {
        return a.predictionScore - b.predictionScore;
      }
      return a.lastScoutedMatch - b.lastScoutedMatch;
    });

    const selected = selectionPool[0];
    if (!selected?.teamNum) return null;

    return {
      teamNum: selected.teamNum,
      color: getAllianceTeamNumbers(matchData, 'red').includes(selected.teamNum) ? false : true,
    };
  }

  useEffect(() => {
    if (matchType !== 'qa' || !matchKey || !regional || !matchData || !isTeamListLoaded) return;
    const selectionSignature = matchKey;
    if (lastAutoSelectionSignature.current === selectionSignature) return;
    let isActive = true;

    const pickAutoTeam = async () => {
      setIsAutoSelecting(true);
      try {
        const currentMatchNumber = toNumber(matchData?.match_number, parseMatchOrder(matchKey));
        const matchTeams = [
          ...getAllianceTeamNumbers(matchData, 'red'),
          ...getAllianceTeamNumbers(matchData, 'blue')
        ]
          .map(normalizeTeamId)
          .filter(Boolean);

        if (matchTeams.length === 0) return;

        const futureOurMatches = regionalMatches
          .filter((entry) => entry?.comp_level === 'qm')
          .filter((entry) => toNumber(entry?.match_number, 0) > currentMatchNumber)
          .filter((entry) => {
            const redTeams = getAllianceTeamNumbers(entry, 'red');
            const blueTeams = getAllianceTeamNumbers(entry, 'blue');
            return [...redTeams, ...blueTeams].includes(OUR_TEAM_NUMBER);
          })
          .sort((a, b) => toNumber(a?.match_number, 0) - toNumber(b?.match_number, 0));

        const opponentDueMatches = new Map();
        futureOurMatches.forEach((entry) => {
          const redTeams = getAllianceTeamNumbers(entry, 'red');
          const blueTeams = getAllianceTeamNumbers(entry, 'blue');
          const ourAlliance = redTeams.includes(OUR_TEAM_NUMBER) ? redTeams : blueTeams;
          const opponentAlliance = ourAlliance === redTeams ? blueTeams : redTeams;
          const dueMatchNumber = toNumber(entry?.match_number, 0);

          opponentAlliance.forEach((teamNum) => {
            if (!teamNum || teamNum === OUR_TEAM_NUMBER || opponentDueMatches.has(teamNum)) return;
            opponentDueMatches.set(teamNum, dueMatchNumber);
          });
        });

        const teamsToLoad = Array.from(new Set([
          ...matchTeams,
          ...opponentDueMatches.keys(),
        ]));

        const cachedEntriesById = new Map(
          (Array.isArray(apiTeamListData) ? apiTeamListData : [])
            .map((entry) => [String(entry?.id || '').trim(), entry])
            .filter(([id]) => Boolean(id))
        );

        const baseTeamsByNumber = new Map(
          teamsToLoad.map((teamNum) => [teamNum, cachedEntriesById.get(teamNum) || null])
        );

        const notesTeamsByNumber = new Map(
          matchTeams.map((teamNum) => [teamNum, cachedEntriesById.get(toNotesTeamId(teamNum)) || null])
        );

        const uncoveredOpponents = new Map();
        opponentDueMatches.forEach((dueMatchNumber, teamNum) => {
          const priorMatchNumbers = getSubmittedQualificationMatchNumbers(baseTeamsByNumber.get(teamNum));

          const hasCoverageBeforeDueMatch = priorMatchNumbers.some((value) => value < dueMatchNumber);
          if (!hasCoverageBeforeDueMatch) {
            uncoveredOpponents.set(teamNum, dueMatchNumber);
          }
        });

        const teamSummaries = await Promise.all(matchTeams.map(async (teamNum) => {
          if (teamNum === OUR_TEAM_NUMBER) {
            return null;
          }

          let isPickable = true;
          const notesEntry = notesTeamsByNumber.get(teamNum);
          const attrs = notesEntry?.TeamAttributes || {};
          isPickable = attrs.Pickable !== false;

          const scoutedMatchNumbers = getSubmittedQualificationMatchNumbers(baseTeamsByNumber.get(teamNum));
          const hasAnyScoutData = scoutedMatchNumbers.length > 0;
          const lastScoutedMatch = hasAnyScoutData ? Math.max(...scoutedMatchNumbers) : 0;

          const cacheKey = `${regional}::${teamNum}`;
          let predictionScore = 0;
          if (statboticsPredictionCache.current.has(cacheKey)) {
            predictionScore = statboticsPredictionCache.current.get(cacheKey);
          } else {
            try {
              const prediction = await apiGetStatboticsTeamEventPrediction(teamNum, regional);
              predictionScore = toNumber(prediction?.statboticsScore, 0);
              statboticsPredictionCache.current.set(cacheKey, predictionScore);
            } catch (_) {
              predictionScore = 0;
            }
          }

          return {
            teamNum,
            predictionScore,
            hasAnyScoutData,
            lastScoutedMatch,
            isPickable,
            targetDueMatchNumber: uncoveredOpponents.get(teamNum) || null,
          };
        }));

        const eligibleSummaries = teamSummaries.filter(Boolean);
        if (eligibleSummaries.length === 0) return;

        const pickableTeams = eligibleSummaries.filter((summary) => summary.isPickable);
        const candidates = pickableTeams.length > 0 ? pickableTeams : eligibleSummaries;

        const priorityCandidates = candidates
          .filter((summary) => summary.targetDueMatchNumber !== null)
          .filter((summary) => currentMatchNumber < summary.targetDueMatchNumber);

        let selectionPool = priorityCandidates;
        if (selectionPool.length === 0) {
          const unscouted = candidates.filter((summary) => !summary.hasAnyScoutData);
          selectionPool = unscouted.length > 0 ? unscouted : candidates;
        }

        if (selectionPool.length === 0) return;

        selectionPool.sort((a, b) => {
          const aDueMatch = a.targetDueMatchNumber ?? Number.POSITIVE_INFINITY;
          const bDueMatch = b.targetDueMatchNumber ?? Number.POSITIVE_INFINITY;
          if (aDueMatch !== bDueMatch) {
            return aDueMatch - bDueMatch;
          }
          if (a.predictionScore !== b.predictionScore) {
            return a.predictionScore - b.predictionScore;
          }
          return a.lastScoutedMatch - b.lastScoutedMatch;
        });

        const selected = selectionPool[0];
        if (!selected || !selected.teamNum) return;

        const selectedColor = (Array.isArray(red) ? red.map(normalizeTeamId) : []).includes(selected.teamNum) ? false : true;

        if (isActive) {
          setColor(selectedColor);
          setTeamNumber(selected.teamNum);
          await ensureTeamExists(selected.teamNum);
        }

        lastAutoSelectionSignature.current = selectionSignature;
      } catch (err) {
        console.warn('Auto team selection failed', err);
      } finally {
        if (isActive) setIsAutoSelecting(false);
      }
    };

    pickAutoTeam();
    return () => { isActive = false; };
  }, [matchType, matchKey, regional, matchData, regionalMatches, apiTeamListData, isTeamListLoaded]);

  useEffect(() => {
    if (matchType !== 'qm' || !matchKey || !regional || !matchData || !isTeamListLoaded) return;
    const selectionSignature = matchKey;
    if (lastManualSuggestionSignature.current === selectionSignature) return;
    let isActive = true;

    const loadManualSuggestion = async () => {
      try {
        const selected = await getAutoScoutRecommendation();
        if (!isActive) return;

        setSuggestedAutoTeamNumber(selected?.teamNum || '');
        setSuggestedAutoColor(selected?.color);
        lastManualSuggestionSignature.current = selectionSignature;
      } catch (err) {
        console.warn('Manual recommendation load failed', err);
        if (!isActive) return;
        setSuggestedAutoTeamNumber('');
        setSuggestedAutoColor(undefined);
      }
    };

    loadManualSuggestion();
    return () => { isActive = false; };
  }, [matchType, matchKey, regional, matchData, regionalMatches, apiTeamListData, isTeamListLoaded]);

  const isSubmitLocked = isSubmitting || Date.now() < submitLockedUntil

  useEffect(() => {
    const tick = () => {
      const remainingMs = submitLockedUntil - Date.now()
      setSubmitCooldownSeconds(remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0)
    }

    tick()
    if (submitLockedUntil <= Date.now()) return

    const intervalId = setInterval(tick, 200)
    return () => clearInterval(intervalId)
  }, [submitLockedUntil])

  const setFieldRef = (fieldName) => (element) => {
    fieldRefs.current[fieldName] = element
  }

  const scrollToField = (fieldName) => {
    const element = fieldRefs.current[fieldName]
    if (!element) return
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (typeof element.focus === 'function') {
      element.focus({ preventScroll: true })
    }
  }

  const validateRequiredFields = () => {
    const missingFields = []

    if (!matchType) missingFields.push('matchType')
    if (normalizeNumberField(matchNumber) === null) missingFields.push('matchNumber')
    if (!teamNumber) missingFields.push('teamNumber')
    if (!autoHang) missingFields.push('autoHang')
    if (!hangType) missingFields.push('hangType')
    if (!teamImpact) missingFields.push('teamImpact')
    if (!robotSpeed) missingFields.push('robotSpeed')
    if (!driverSkill) missingFields.push('driverSkill')
    if (!defenseEffectiveness) missingFields.push('defenseEffectiveness')
    if (!shootingSpeed) missingFields.push('shootingSpeed')
    if (normalizeNumberField(fuelCapacity) === null) missingFields.push('fuelCapacity')
    if (normalizeNumberField(shootingCycles) === null) missingFields.push('shootingCycles')

    if (missingFields.length > 0) {
      scrollToField(missingFields[0])
      return false
    }

    return true
  }

  const adjustBallsShot = (direction, tick = 0) => {
    const step = tick > 10 ? 30 : tick > 4 ? 20 : 10
    setEstimatedBallsShot((previous) => {
      const safePrevious = Number.isFinite(previous) ? previous : 0
      return Math.max(0, safePrevious + (direction * step))
    })
  }

  const stopAdjustBallsShot = () => {
    if (ballsHoldTimerRef.current) {
      clearTimeout(ballsHoldTimerRef.current)
      ballsHoldTimerRef.current = null
    }
  }

  const startAdjustBallsShot = (direction) => {
    stopAdjustBallsShot()
    adjustBallsShot(direction, 0)

    let tick = 0
    const loop = () => {
      tick += 1
      adjustBallsShot(direction, tick)
      const delay = tick < 5 ? 220 : tick < 12 ? 130 : 80
      ballsHoldTimerRef.current = setTimeout(loop, delay)
    }

    ballsHoldTimerRef.current = setTimeout(loop, 300)
  }

  useEffect(() => {
    return () => stopAdjustBallsShot()
  }, [])

  const getRegionalNickname = (teamNum) => {
    const team = simpleTeams.find((t) => String(t?.team_number || t?.TeamNumber || '').trim() === String(teamNum || '').trim())
    return String(team?.nickname || '').trim()
  }

  const ensureTeamExists = async (normalizedTeamNumber) => {
    if (!normalizedTeamNumber) return

    try {
      const checkData = await apiGetTeam(normalizedTeamNumber)

      if (checkData === null) {
        await apiCreateTeamEntry(normalizedTeamNumber, regional)
      }
    } catch (err) {
      console.error("error fetching/creating team", err)
    }
  }

  const selectPracticeTeam = async (term) => {
    const rawTerm = String(term || '').trim()
    if (!rawTerm) {
      setTeamNumber('')
      setTeamSearchInput('')
      setTeamSuggestions([])
      return
    }

    const suggestions = getTopTeamSuggestions({
      term: rawTerm,
      dbTeams: [],
      simpleTeams,
      resolveDbTeamNumber: () => '',
      limit: 3,
    })

    const fromNumber = /^\d+$/.test(rawTerm) ? rawTerm : ''
    const teamNum = normalizeTeamId(fromNumber || suggestions[0]?.teamNumber || '')
    if (!teamNum) {
      setTeamSuggestions(suggestions)
      return
    }

    if (!regionalTeamSet.has(teamNum)) {
      alert(`Team ${teamNum} is not at this regional.`)
      setTeamSuggestions(suggestions)
      return
    }

    setTeamNumber(teamNum)
    setTeamSearchInput(getRegionalNickname(teamNum) ? `${teamNum} - ${getRegionalNickname(teamNum)}` : teamNum)
    setTeamSuggestions([])
    await ensureTeamExists(teamNum)
  }

  /* toggle functions for display of form sections */

  const toggleActiveStrategy = (strategy) => {
    // allow multiple active strategies; FormUtils.join will convert to string
    if (activeStrategy.includes(strategy)) {
      setActiveStrategy(activeStrategy.filter(s => s !== strategy))
    } else {
      setActiveStrategy([...activeStrategy, strategy])
    }
  }

  const toggleInactiveStrategy = (strategy) => {
    // multiple inactive strategies allowed as well
    if (inactiveStrategy.includes(strategy)) {
      setInactiveStrategy(inactiveStrategy.filter(s => s !== strategy))
    } else {
      setInactiveStrategy([...inactiveStrategy, strategy])
    }
  }

  const toggleAutoAction = (action) => {
    if (autoActions.includes(action)) {
      setAutoActions(autoActions.filter(a => a !== action))
    } else {
      setAutoActions([...autoActions, action])
    }
  }

  const teamEntriesById = new Map(
    (Array.isArray(apiTeamListData) ? apiTeamListData : [])
      .map((entry) => [String(entry?.id || '').trim(), entry])
      .filter(([id]) => Boolean(id))
  )

  const hasScoutedMatchForTeam = (teamId) => {
    const normalizedTeam = normalizeTeamId(teamId)
    if (!normalizedTeam) return false
    return getRegionalTeamMatches(teamEntriesById.get(normalizedTeam)).length > 0
  }

  const formatScheduledTeamOptionLabel = (teamId) => {
    const normalizedTeam = normalizeTeamId(teamId)
    if (!normalizedTeam) return ''
    return hasScoutedMatchForTeam(normalizedTeam) ? normalizedTeam : `${normalizedTeam} *`
  }

  const highlightedManualTeamNumber = matchType === 'qm' && color === suggestedAutoColor
    ? suggestedAutoTeamNumber
    : ''

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", position: "relative" }}>

      {infoModal ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setInfoModal("")}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "420px",
              width: "calc(100% - 40px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontWeight: 700 }}>Info</div>
              <button
                type="button"
                onClick={() => setInfoModal("")}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                  lineHeight: 1
                }}
                aria-label="Close info"
              >
                ×
              </button>
            </div>
            <p style={{ margin: 0, lineHeight: "1.5" }}>{infoModal}</p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={resetEntireForm}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          border: "2px solid #ddd",
          background: "white",
          borderRadius: "8px",
          padding: "10px 14px",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Reset Form
      </button>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img 
          src="./images/BLUETHUNDERLOGO_BLUE.png" 
          alt="2443 Blue Thunder Logo"
          style={{ maxWidth: "100px", height: "auto", marginBottom: "10px" }}
        />
        <h1 style={{ margin: "0", color: "#333", fontSize: "1.8em" }}>FORM</h1>
      </div>

      {/* Match Info */}
      <div style={{ position: "relative", backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginTop: "20px", marginBottom: "20px" }}>
        {isAutoSelecting ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}>
            <div style={{ textAlign: 'center', color: '#333' }}>
              <div className={tableStyling.Loader} style={{ marginBottom: '12px' }}></div>
              <div style={{ fontWeight: 700 }}>Selecting best team...</div>
            </div>
          </div>
        ) : null}
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
          Match Info
          <InfoIcon
            text={sectionHelp.matchInfo}
            onClick={() => setInfoModal(sectionHelp.matchInfo)}
          />
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "150px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Match Type</label>
              <select 
                ref={setFieldRef('matchType')}
                style={{
                  height: "50px",
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer"
                }} 
                value={matchType} 
                onInput={(e) => {setMatchType(e.target.value); resetStates() }}
              >
                <option value="">Select Type</option>
                <option value='qm'>Quals Manual</option>
                <option value='qa'>Quals Auto</option>
                <option value='sf'>Semifinal</option>
                <option value='f'>Final</option>
                <option value='p'>Practice</option>
              </select>
            </div>

            <div style={{ flex: "1", minWidth: "150px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Match Number</label>
              <input 
                ref={setFieldRef('matchNumber')}
                style={{
                  height: "50px",
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                  opacity: !matchType ? 0.5 : 1,
                  cursor: !matchType ? "not-allowed" : "text",
                }}
                placeholder="Enter match #" 
                type="number" 
                min="1"
                disabled={!matchType}
                value={matchNumber} 
                onKeyDown={stopNonNum}
                onChange={(e) => {
                  setMatchNumber(e.target.value)}
                }
                onWheel={(e) => e.target.blur()} 
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "15px", backgroundColor: "white", borderRadius: "8px", border: "2px solid #ddd", opacity: !matchNumber ? 0.5 : 1 }}>
            <label style={{ fontWeight: "600", marginBottom: "5px" }}>Alliance Color</label>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  style={{ cursor: !matchNumber || isAutoSelecting ? "not-allowed" : "pointer", width: "20px", height: "20px" }}
                  disabled={!matchNumber || isAutoSelecting}
                  onChange={() => setColor(false)} 
                  type="radio" 
                  id="redAllianceChosen" 
                  name="alliance"
                  checked={color === false}
                />
                <label htmlFor="redAllianceChosen" style={{ cursor: !matchNumber || isAutoSelecting ? "not-allowed" : "pointer", margin: "0" }}>Red</label>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  style={{ cursor: !matchNumber || isAutoSelecting ? "not-allowed" : "pointer", width: "20px", height: "20px" }}
                  disabled={!matchNumber || isAutoSelecting}
                  onChange={() => setColor(true)} 
                  type="radio" 
                  id="blueAllianceChosen" 
                  name="alliance"
                  checked={color === true}
                />
                <label htmlFor="blueAllianceChosen" style={{ cursor: !matchNumber || isAutoSelecting ? "not-allowed" : "pointer", margin: "0" }}>Blue</label>
              </div>

              {color ? (
                <img src="./images/white-blueGrad.png" style={{ width: "50px", height: "auto" }} />
              ) : (
                <img src="./images/white-redGrad.png" style={{ width: "50px", height: "auto" }} />
              )}
            </div>
          </div>

          {matchType === 'p' ? (
            <div style={{ opacity: matchNumber ? 1 : 0.5, cursor: !matchNumber ? "not-allowed" : "text" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Team Number / Name</label>
              <input
                ref={setFieldRef('teamNumber')}
                style={{
                  height: "50px",
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                  cursor: !matchNumber ? "not-allowed" : "text"
                }}
                disabled={!matchNumber}
                placeholder="Type team number or team name"
                value={teamSearchInput}
                onChange={(e) => {
                  setTeamSearchInput(e.target.value)
                  setTeamNumber('')
                }}
                onBlur={() => {
                  if (!teamSearchInput.trim()) return
                  selectPracticeTeam(teamSearchInput)
                }}
              />
              {teamSuggestions.length > 0 ? (
                <div style={{ marginTop: "8px", display: "grid", gap: "6px" }}>
                  {teamSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.teamNumber}
                      type="button"
                      style={{
                        textAlign: "left",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        background: "white",
                        padding: "8px",
                        cursor: "pointer"
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectPracticeTeam(suggestion.teamNumber)}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div style={{ opacity: matchNumber && color !== undefined ? 1 : 0.5 }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Robot Number</label>
              {matchNumber && color !== undefined ? (
                <select 
                  ref={setFieldRef('teamNumber')}
                  style={{
                    height: "50px",
                    width: "100%",
                    padding: "8px",
                    fontSize: "16px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    cursor: isAutoSelecting ? "not-allowed" : "pointer"
                  }} 
                  disabled={isAutoSelecting}
                  value={teamNumber}
                  onChange={async (e) => {
                    const normalized = normalizeTeamId(e.target.value);
                    setTeamNumber(normalized);
                    await ensureTeamExists(normalized)
                  }}
                >
                  <option value="">Select robot number</option>
                  {color === false ?
                    red.map((team) => {
                      const normalizedTeam = normalizeTeamId(team)
                      const isSuggested = highlightedManualTeamNumber === normalizedTeam
                      return (
                        <option
                          value={normalizedTeam}
                          key={team}
                          style={isSuggested ? { backgroundColor: '#fff4bf' } : undefined}
                        >
                          {formatScheduledTeamOptionLabel(normalizedTeam)}
                        </option>
                      )
                    }) :
                    blue.map((team) => {
                      const normalizedTeam = normalizeTeamId(team)
                      const isSuggested = highlightedManualTeamNumber === normalizedTeam
                      return (
                        <option
                          value={normalizedTeam}
                          key={team}
                          style={isSuggested ? { backgroundColor: '#fff4bf' } : undefined}
                        >
                          {formatScheduledTeamOptionLabel(normalizedTeam)}
                        </option>
                      )
                    })
                  }
                </select>
              ) : (
                <div style={{
                  padding: "16px",
                  border: "2px dashed #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                  color: "#666"
                }}>
                  Enter a match number and select an alliance first to choose a robot.
                </div>
              )}
              {highlightedManualTeamNumber ? (
                <div style={{
                  marginTop: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  borderRadius: "999px",
                  backgroundColor: "#fff4bf",
                  color: "#5c4b00",
                  fontSize: "14px",
                  fontWeight: 600
                }}>
                  Auto would scout team {highlightedManualTeamNumber}
                </div>
              ) : null}
              {matchNumber && color !== undefined ? (
                <div style={{ marginTop: "8px", color: "#666", fontSize: "13px" }}>
                  * = no matches scouted yet
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* AUTONOMOUS */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Autonomous
          <InfoIcon
            text={sectionHelp.autonomous}
            onClick={() => setInfoModal(sectionHelp.autonomous)}
          />
        </h2>

        <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
            {["Moved", "Scored", "Crossed Bump/Trench"].map((action) => (
              <button
                key={action}
                onClick={() => toggleAutoAction(action)}
                className={`${tableStyling.ToggleButton} ${autoActions.includes(action) ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
              >
                {action}
              </button>
            ))}
          </div>

          <div ref={setFieldRef('autoHang')} style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => setAutoHang(autoHang === 'Level1' ? 'None' : 'Level1')}
              className={`${tableStyling.ToggleButton} ${autoHang === 'Level1' ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              Auto Hang
            </button>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Autonomous Win</label>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setAutoWin("Win")}
                className={`${tableStyling.ToggleButton} ${autoWin === "Win" ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                style={{ flex: 1, maxWidth: "180px" }}
              >
                Win
              </button>
              <button
                type="button"
                onClick={() => setAutoWin("Tie")}
                className={`${tableStyling.ToggleButton} ${autoWin === "Tie" ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                style={{ flex: 1, maxWidth: "180px" }}
              >
                Tie
              </button>
              <button
                type="button"
                onClick={() => setAutoWin("Lose")}
                className={`${tableStyling.ToggleButton} ${autoWin === "Lose" ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
                style={{ flex: 1, maxWidth: "180px" }}
              >
                Lose
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Auto Impact</label>
            <select
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              value={autoImpact}
              onChange={(e) => setAutoImpact(e.target.value)}
              onWheel={(e) => e.target.blur()}
            >
              <option value="">Select Auto Impact</option>
              <option value="Nothing">Nothing</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVE */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Active Strategy
          <InfoIcon
            text={sectionHelp.activeStrategy}
            onClick={() => setInfoModal(sectionHelp.activeStrategy)}
          />
        </h2>
        
        <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
          {["Hoarding", "Defending", "Scoring"].map((strategy) => (
            <button
              key={strategy}
              onClick={() => toggleActiveStrategy(strategy)}
              className={`${tableStyling.ToggleButton} ${activeStrategy.includes(strategy) ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              {strategy}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Times Travelled to Mid</label>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center"}}>
            <button 
              onClick={() => setTimesTravelledMid(Math.max(0, timesTravelledMid - 1))}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              −
            </button>
            <input 
              type="number" 
              value={timesTravelledMid} 
              onChange={(e) => setTimesTravelledMid(Math.max(0, parseInt(e.target.value) || 0))}
              onWheel={(e) => e.target.blur()} 
              style={{
                fontSize: "24px",
                fontWeight: "600",
                minWidth: "70px",
                textAlign: "center",
                height: "50px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "0 10px"
              }}
            />
            <button 
              onClick={() => setTimesTravelledMid(timesTravelledMid + 1)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Shooting Cycles</label>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center"}}>
            <button 
              onClick={() => setShootingCycles(Math.max(0, shootingCycles - 1))}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              −
            </button>
            <input 
              ref={setFieldRef('shootingCycles')}
              type="number" 
              value={shootingCycles} 
              onChange={(e) => setShootingCycles(Math.max(0, parseInt(e.target.value) || 0))}
              onWheel={(e) => e.target.blur()} 
              style={{
                fontSize: "24px",
                fontWeight: "600",
                minWidth: "70px",
                textAlign: "center",
                height: "50px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "0 10px"
              }}
            />
            <button 
              onClick={() => setShootingCycles(shootingCycles + 1)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Balls Shot</label>
          <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center"}}>
            <button
              type="button"
              onMouseDown={() => startAdjustBallsShot(-1)}
              onMouseUp={stopAdjustBallsShot}
              onMouseLeave={stopAdjustBallsShot}
              onTouchStart={() => startAdjustBallsShot(-1)}
              onTouchEnd={stopAdjustBallsShot}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              −
            </button>
            <input
              type="number"
              min="0"
              value={estimatedBallsShot}
              onKeyDown={stopNonNum}
              onChange={(e) => {
                const rawValue = e.target.value
                if (rawValue === '') {
                  setEstimatedBallsShot(0)
                  return
                }
                const parsedValue = Number.parseInt(rawValue, 10)
                setEstimatedBallsShot(Number.isNaN(parsedValue) ? 0 : Math.max(0, parsedValue))
              }}
              onWheel={(e) => e.target.blur()}
              style={{
                fontSize: "24px",
                fontWeight: "600",
                minWidth: "100px",
                textAlign: "center",
                height: "50px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "0 10px"
              }}
            />
            <button
              type="button"
              onMouseDown={() => startAdjustBallsShot(1)}
              onMouseUp={stopAdjustBallsShot}
              onMouseLeave={stopAdjustBallsShot}
              onTouchStart={() => startAdjustBallsShot(1)}
              onTouchEnd={stopAdjustBallsShot}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
                minWidth: "50px"
              }}
            >
              +
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: "6px", color: "#666", fontSize: "14px" }}>
            Tap changes by 10. Hold to ramp up speed.
          </div>
        </div>
      </div>

      {/* INACTIVE */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Inactive Strategy
          <InfoIcon
            text={sectionHelp.inactiveStrategy}
            onClick={() => setInfoModal(sectionHelp.inactiveStrategy)}
          />
        </h2>
        
        <div style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", flexWrap: "wrap"}}>
          {["Hoarding", "Defending Mid", "Blocking"].map((strategy) => (
            <button
              key={strategy}
              onClick={() => toggleInactiveStrategy(strategy)}
              className={`${tableStyling.ToggleButton} ${inactiveStrategy.includes(strategy) ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              {strategy}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Results
          <InfoIcon
            text={sectionHelp.results}
            onClick={() => setInfoModal(sectionHelp.results)}
          />
        </h2>
        
        <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Endgame Hang</label>
            <select 
              ref={setFieldRef('hangType')}
              style={{
                height: "50px", 
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              value={hangType} 
              onChange={(e) => setHangType(e.target.value)}
              onWheel={(e) => e.target.blur()} 
            >
              <option value=''>Select Level</option>
              <option value="None">None</option>
              <option value='Level1'>Level 1</option>
              <option value='Level2'>Level 2</option>
              <option value='Level3'>Level 3</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Team Impact</label>
            <select
              ref={setFieldRef('teamImpact')}
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              value={teamImpact}
              onChange={(e) => setTeamImpact(e.target.value)}
              onWheel={(e) => e.target.blur()}
            >
              <option value="">Select Team Impact</option>
              <option value="Nothing">Nothing</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: "6px", justifyContent: "center", flexWrap: "wrap", paddingTop: "6px" }}>
            <button 
              onClick={() => setDisable(!disable)} 
              className={`${tableStyling.ToggleButton} ${disable ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
              style={{ '--toggle-on-bg': '#ff914d', '--toggle-on-fg': 'black' }}
            >
              Disable
            </button>
            <button 
              onClick={() => setDQ(!dq)} 
              className={`${tableStyling.ToggleButton} ${dq ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
              style={{ '--toggle-on-bg': 'black', '--toggle-on-fg': 'white' }}
            >
              DQ
            </button>
            <button 
              onClick={() => setBotBroke(!botBroke)} 
              className={`${tableStyling.ToggleButton} ${botBroke ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              Broke
            </button>
            <button 
              onClick={() => setNoShow(!noShow)} 
              className={`${tableStyling.ToggleButton} ${noShow ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              No Show
            </button>
            <button 
              onClick={() => setStuckOnBump(!stuckOnBump)} 
              className={`${tableStyling.ToggleButton} ${stuckOnBump ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              Stuck on Bump
            </button>
            <button 
              onClick={() => setStuckOnBalls(!stuckOnBalls)} 
              className={`${tableStyling.ToggleButton} ${stuckOnBalls ? tableStyling.ToggleButtonOn : tableStyling.ToggleButtonOff}`}
            >
              Stuck on Balls
            </button>
          </div>

          {botBroke && (
            <input 
              placeholder="broken comments" 
              type="text" 
              value={robotBrokenComments} 
              onChange={(e) => setRobotBrokenComments(e.target.value)}
              onWheel={(e) => e.target.blur()} 
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px"
              }}
            />
          )}
        </div>
      </div>

      {/* ROBOT INFO */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
          Robot Info
          <InfoIcon
            text={sectionHelp.robotInfo}
            onClick={() => setInfoModal(sectionHelp.robotInfo)}
          />
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Robot Speed</label>
            <select 
              ref={setFieldRef('robotSpeed')}
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              value={robotSpeed} 
              onChange={(e) => setRobotSpeed(e.target.value)}
              onWheel={(e) => e.target.blur()} 
            >
              <option value="">Select Robot Speed</option>
              <option value="Very Slow">Very Slow</option>
              <option value="Slow">Slow</option>
              <option value="Average">Average</option>
              <option value="Fast">Fast</option>
              <option value="Very Fast">Very Fast</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Driver Skill</label>
            <select 
              ref={setFieldRef('driverSkill')}
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              value={driverSkill} 
              onChange={(e) => setDriverSkill(e.target.value)}
              onWheel={(e) => e.target.blur()} 
            >
              <option value="">Select Driver Skill</option>
              <option value="Very Poor">Very Poor</option>
              <option value="Poor">Poor</option>
              <option value="Average">Average</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Defense Effectiveness</label>
            <select
              ref={setFieldRef('defenseEffectiveness')}
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              value={defenseEffectiveness}
              onChange={(e) => setDefenseEffectiveness(e.target.value)}
              onWheel={(e) => e.target.blur()}
            >
              <option value="">Select Defense Effectiveness</option>
              <option value="VeryPoor">Very Poor</option>
              <option value="Poor">Poor</option>
              <option value="Average">Average</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Shooter Speed</label>
            <select 
              ref={setFieldRef('shootingSpeed')}
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer"
              }} 
              value={shootingSpeed} 
              onChange={(e) => setShootingSpeed(e.target.value)}
              onWheel={(e) => e.target.blur()} 
            >
              <option value="">Select Shooting Speed</option>
              <option value="Very Slow">Very Slow</option>
              <option value="Slow">Slow</option>
              <option value="Average">Average</option>
              <option value="Fast">Fast</option>
              <option value="Very Fast">Very Fast</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Fuel Capacity</label>
            <input 
              ref={setFieldRef('fuelCapacity')}
              style={{
                height: "50px",
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px"
              }} 
              type="number" 
              min="0"
              placeholder="Enter Estimated Fuel Capacity (e.g., 100)"
              value={fuelCapacity} 
              onKeyDown={stopNonNum}
              onChange={(e) => setFuelCapacity(parseInt(e.target.value) || '')}
              onWheel={(e) => e.target.blur()} 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Comments</label>
            <input 
              style={{
                padding: "12px",
                fontSize: "16px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                width: "100%",
                boxSizing: "border-box"
              }} 
              type="text" 
              placeholder="Add any observations..." 
              value={robotInsight} 
              onChange={(e) => setRobotInsight(e.target.value)}
              onWheel={(e) => e.target.blur()} 
            />
          </div>
        </div>
      </div>

      {/* Submit Check */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "30px" }}>
        <button onClick={() => {setConfirm(!confirm)}} style={{
          padding: "15px 30px",
          backgroundColor: confirm ? "red" : "white",
          color: confirm ? "white" : "black",
          border: "2px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600"
        }}>
          {
          confirm ? 
          /* Not Yet */
          <div><img src="./images/BLUETHUNDERLOGO_WHITE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Not yet</div></div> 
          /* Submit */
          : <div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>Submit</div></div>
          }
        </button>

        {/* Submit & Send */}
        {confirm ? <button style={{
          padding: "15px 30px",
          backgroundColor: isSubmitLocked ? "#f2f2f2" : "white",
          border: "2px solid #ddd",
          borderRadius: "8px",
          cursor: isSubmitLocked ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "600",
          opacity: isSubmitLocked ? 0.8 : 1
        }}
          disabled={isSubmitLocked}
          onClick={() => {
          if (isSubmitLocked) return
          if (!validateRequiredFields()) {
            alert("Form is incomplete. Please fill the highlighted section first.")
            return
          }

          setIsSubmitting(true)
          setSubmitLockedUntil(Date.now() + 5000)

          submitState( //passes all data (states) of the form into the build in formutils
            regional,
            teamNumber,
            matchKey,
            apiTeamListData,
            matchType,
            matchNumber,
            color,
            autoActions,
            autoHang,
            autoWin,
            autoImpact,
            hangType,
            activeStrategy,
            inactiveStrategy,
            timesTravelledMid,
            0,
            shootingCycles,
            teamImpact,
            matchResult,
            allianceScore,
            opponentScore,
            disable,
            dq,
            botBroke,
            noShow,
            stuckOnBump,
            stuckOnBalls,
            robotSpeed,
            driverSkill,
            defenseEffectiveness,
            fuelCapacity,
            shootingSpeed,
            estimatedBallsShot,
            robotInsight,
            robotBrokenComments
        )
        .then(async _ => {
          if(_ === false){ //checks if the form utils return true or false which based on if the user filled all required
            await loadTeamList()
            resetStates()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        })
          .catch(err => {
            let details = ''
            if (err instanceof Error) {
              details = `${err.message}${err.stack ? `\n${err.stack}` : ''}`
            } else if (err?.errors?.length) {
              const messages = err.errors.map(e => e?.message || JSON.stringify(e))
              details = `${messages.join('\n')}\n\nRaw errors:\n${JSON.stringify(err.errors, null, 2)}`
            } else {
              details = JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
            }
            console.error('Form submit failed', err)
            alert(`Form submit failed:\n${details}`)
          })
          .finally(() => {
            setIsSubmitting(false)
          })
          }
        }/* Double checks and confirms for submission, in case of accidental press */
        ><div><img src="./images/BLUETHUNDERLOGO_BLUE.png" style={{width:"60px", height: "auto"}}></img><div style={{fontSize: "16px"}}>{isSubmitLocked ? `Wait ${submitCooldownSeconds}s` : "Confirm"}</div></div></button> : null}
      </div>
      <div>
        {/* <button onClick={async () => {await apiCreateTeamEntry(teamNumber); await apiListTeams()}}>test and bypass</button> */}
      </div>
    </div>
  )
}

export default Form;