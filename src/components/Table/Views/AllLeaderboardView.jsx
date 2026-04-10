import React, { useEffect, useMemo, useState } from 'react';
import { rankTeamsForAllianceSelection } from '../TableUtils/AllianceRankingAlgorithm';
import tableStyles from '../Table.module.css';
import { apiGetSimpleTeamsForRegional } from '../../../api';
import { getTopTeamSuggestions } from '../../../utils/teamSearch';

const toNumber = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const safeLower = (value) => String(value || '').toLowerCase()

const MATCH_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 8, 10]
const CONFIDENCE_OPTIONS = [0, 20, 40, 50, 60, 70, 80, 90]
const ALLIANCE_SCORE_OPTIONS = [-999, 0, 10, 20, 30, 40, 50, 60, 70]
const AUTO_OPTIONS = [0, 2, 4, 6, 8, 10, 12]
const ENDGAME_OPTIONS = [0, 5, 10, 15, 20, 25, 30]
const BROKEN_OPTIONS = [100, 80, 60, 50, 40, 30, 20, 10, 0]

const getDefaultSortDirection = (key) => (
  key === 'TeamNumberValue' || key === 'TeamName' ? 'asc' : 'desc'
)

const TABLE_HEADERS = [
  { label: 'Rank', sortKey: null },
  { label: 'Team', sortKey: 'TeamNumberValue' },
  { label: 'Name', sortKey: 'TeamName' },
  { label: 'Baseline', sortKey: 'baselineScore' },
  { label: 'Alliance Score', sortKey: 'allianceScore' },
  { label: 'EPA', sortKey: 'statboticsEPA' },
  { label: 'Auto EPA', sortKey: 'statboticsAutoEPA' },
  { label: 'Skill', sortKey: 'skillRating' },
  { label: 'Confidence', sortKey: 'confidence' },
  { label: 'Matches', sortKey: 'Matches' },
  { label: 'Avg Pts', sortKey: 'AvgPoints' },
  { label: 'Auto', sortKey: 'AvgAutoPts' },
  { label: 'Endgame', sortKey: 'AvgEndgamePts' },
  { label: 'Broken %', sortKey: 'brokenRate' },
]

function AllLeaderboardView({ tableData, regional }) {
  const [simpleTeams, setSimpleTeams] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState('baselineScore')
  const [sortDir, setSortDir] = useState('desc')
  const [minMatches, setMinMatches] = useState(0)
  const [minConfidence, setMinConfidence] = useState(0)
  const [minAllianceScore, setMinAllianceScore] = useState(-999)
  const [minAutoPts, setMinAutoPts] = useState(0)
  const [minEndgamePts, setMinEndgamePts] = useState(0)
  const [maxBrokenRate, setMaxBrokenRate] = useState(100)
  const [robotSpeed, setRobotSpeed] = useState('any')
  const [showFilters, setShowFilters] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  // New filters
  const [canHang, setCanHang] = useState(false)
  const [canTrench, setCanTrench] = useState(false)
  const [hasAutos, setHasAutos] = useState(false)

  const handleHeaderSort = (headerSortKey) => {
    if (!headerSortKey) return

    if (sortKey === headerSortKey) {
      setSortDir((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(headerSortKey)
    setSortDir(getDefaultSortDirection(headerSortKey))
  }

  useEffect(() => {
    if (!regional) {
      setSimpleTeams([])
      return
    }

    apiGetSimpleTeamsForRegional(regional)
      .then(data => setSimpleTeams(data || []))
      .catch(err => {
        console.log('failed to load simple teams', err)
        setSimpleTeams([])
      })
  }, [regional])

  useEffect(() => {
    if (!showFilters) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowFilters(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showFilters])

  useEffect(() => {
    const term = String(searchTerm || '').trim()
    if (!term) {
      setSearchSuggestions([])
      return
    }

    const suggestions = getTopTeamSuggestions({
      term,
      dbTeams: [],
      simpleTeams,
      resolveDbTeamNumber: () => '',
      limit: 3,
    })

    setSearchSuggestions(suggestions)
  }, [searchTerm, simpleTeams])

  const nameMap = useMemo(() => {
    const map = new Map()
    ;(simpleTeams || []).forEach(team => {
      const teamNumber = String(team?.team_number || team?.TeamNumber || '')
      if (!teamNumber) return
      map.set(teamNumber, String(team?.nickname || '').trim())
    })
    return map
  }, [simpleTeams])

  const rankedRows = useMemo(() => {
    const ranked = rankTeamsForAllianceSelection(Array.isArray(tableData) ? tableData : [])

    return ranked.map(team => {
      const teamNumber = String(team?.TeamNumber ?? '').trim()
      const matches = toNumber(team?.Matches, 0)
      const brokenCount = Array.isArray(team?.BrokenRobot)
        ? team.BrokenRobot.length
        : toNumber(team?.BrokenRobot, 0)
      const brokenRate = matches > 0 ? (brokenCount / matches) * 100 : 0
      const statboticsEPA = toNumber(team?.StatboticsEPA ?? team?.StatboticsScore, 0)
      const statboticsAutoEPA = toNumber(team?.StatboticsAutoEPA, 0)
      const baselineScore = toNumber(team?.allianceScore, 0) * 0.65 + statboticsEPA * 0.35

      const speedText = safeLower(team?.RobotSpeed)
      const speedBucket = speedText.includes('fast')
        ? 'fast'
        : speedText.includes('average')
          ? 'average'
          : speedText.includes('slow')
            ? 'slow'
            : 'unknown'

      return {
        ...team,
        TeamNumber: teamNumber,
        TeamNumberValue: toNumber(teamNumber, 0),
        TeamName: nameMap.get(teamNumber) || '',
        allianceScore: toNumber(team?.allianceScore, 0),
        baselineScore,
        statboticsScore: statboticsEPA,
        statboticsEPA,
        statboticsAutoEPA,
        skillRating: toNumber(team?.skillRating, 0),
        confidence: toNumber(team?.confidence, 0),
        matchesRated: matches,
        Matches: matches,
        AvgPoints: toNumber(team?.AvgPoints, 0),
        AvgAutoPts: toNumber(team?.AvgAutoPts, 0),
        AvgEndgamePts: toNumber(team?.AvgEndgamePts, 0),
        brokenRate,
        speedBucket,
        canHang: Boolean(team?.canHang),
        canTrench: Boolean(team?.canTrench),
        hasAutos: Boolean(team?.hasAutos),
        StatboticsPredictedWins: toNumber(team?.StatboticsPredictedWins, 0),
        StatboticsPredictedLosses: toNumber(team?.StatboticsPredictedLosses, 0),
        StatboticsWinRate: toNumber(team?.StatboticsWinRate, 0)
      }
    })
  }, [tableData, nameMap])
  const filteredAndSorted = useMemo(() => {
    const search = safeLower(searchTerm)

    const filtered = rankedRows.filter(team => {
      const confidencePct = team.confidence * 100
      if (team.Matches < minMatches) return false
      if (confidencePct < minConfidence) return false
      if (team.allianceScore < minAllianceScore) return false
      if (team.AvgAutoPts < minAutoPts) return false
      if (team.AvgEndgamePts < minEndgamePts) return false
      if (team.brokenRate > maxBrokenRate) return false
      if (robotSpeed !== 'any' && team.speedBucket !== robotSpeed) return false
      // New filters
      if (canHang && !team.canHang) return false
      if (canTrench && !team.canTrench) return false
      if (hasAutos && !team.hasAutos) return false

      if (!search) return true

      const teamNum = safeLower(team.TeamNumber)
      const teamName = safeLower(team.TeamName)
      return teamNum.includes(search) || teamName.includes(search)
    })

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a?.[sortKey]
      const bVal = b?.[sortKey]

      if (typeof aVal === 'string' || typeof bVal === 'string') {
        const cmp = String(aVal || '').localeCompare(String(bVal || ''))
        return sortDir === 'asc' ? cmp : -cmp
      }

      const cmp = toNumber(aVal, 0) - toNumber(bVal, 0)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return sorted
  }, [rankedRows, searchTerm, sortKey, sortDir, minMatches, minConfidence, minAllianceScore, minAutoPts, minEndgamePts, maxBrokenRate, robotSpeed, canHang, canTrench, hasAutos])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (minMatches !== 0) count += 1
    if (minConfidence !== 0) count += 1
    if (minAllianceScore !== -999) count += 1
    if (minAutoPts !== 0) count += 1
    if (minEndgamePts !== 0) count += 1
    if (maxBrokenRate !== 100) count += 1
    if (robotSpeed !== 'any') count += 1
    if (canHang) count += 1
    if (canTrench) count += 1
    if (hasAutos) count += 1
    return count
  }, [minMatches, minConfidence, minAllianceScore, minAutoPts, minEndgamePts, maxBrokenRate, robotSpeed, canHang, canTrench, hasAutos])

  const resetFilters = () => {
    setSearchTerm('')
    setSortKey('baselineScore')
    setSortDir('desc')
    setMinMatches(0)
    setMinConfidence(0)
    setMinAllianceScore(-999)
    setMinAutoPts(0)
    setMinEndgamePts(0)
    setMaxBrokenRate(100)
    setRobotSpeed('any')
    setCanHang(false)
    setCanTrench(false)
    setHasAutos(false)
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>All Teams Leaderboard</h2>

      <div className={tableStyles.Card}>
        <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Filters & Sorting</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Search team # or name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ height: '40px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', width: '100%' }}
          />

          <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={{ height: '40px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', width: '100%' }}>
            <option value="baselineScore">Sort: Baseline Score</option>
            <option value="statboticsEPA">Sort: Statbotics EPA</option>
            <option value="statboticsAutoEPA">Sort: Statbotics Auto EPA</option>
            <option value="allianceScore">Sort: Alliance Score</option>
            <option value="skillRating">Sort: Skill Rating</option>
            <option value="confidence">Sort: Confidence</option>
            <option value="Matches">Sort: Matches</option>
            <option value="AvgPoints">Sort: Avg Points</option>
            <option value="AvgAutoPts">Sort: Avg Auto Pts</option>
            <option value="AvgEndgamePts">Sort: Avg Endgame Pts</option>
            <option value="brokenRate">Sort: Broken %</option>
            <option value="TeamNumberValue">Sort: Team Number</option>
          </select>

          <select value={sortDir} onChange={e => setSortDir(e.target.value)} style={{ height: '40px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', width: '100%' }}>
            <option value="desc">Order: Desc</option>
            <option value="asc">Order: Asc</option>
          </select>

          <button
            onClick={() => setShowFilters(true)}
            className={tableStyles.PrimaryButton}
            style={{ height: '40px', position: 'relative', boxSizing: 'border-box', width: '100%' }}
          >
            Filters
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
        </div>

        {searchSuggestions.length > 0 ? (
          <div style={{ marginBottom: '10px', maxWidth: '520px' }}>
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}
            >
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.teamNumber}
                  type="button"
                  onClick={() => {
                    setSearchTerm(suggestion.teamNumber)
                    setSearchSuggestions([])
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    backgroundColor: 'white',
                    border: 'none',
                    borderTop: index === 0 ? 'none' : '1px solid #eee',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ color: '#666', fontSize: '14px' }}>
          Showing {filteredAndSorted.length} teams • Speed: {robotSpeed === 'any' ? 'Any' : robotSpeed[0].toUpperCase() + robotSpeed.slice(1)}
        </div>
      </div>

      {showFilters && (
        <div
          onClick={() => setShowFilters(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '760px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #ddd',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>Filters</h3>
              <button
                onClick={resetFilters}
                className={tableStyles.PrimaryButton}
                style={{ fontSize: '12px', padding: '4px 8px', lineHeight: 1.2 }}
              >
                Reset
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span>Speed</span>
                <select value={robotSpeed} onChange={e => setRobotSpeed(e.target.value)} style={{ height: '38px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <option value="any">Any</option>
                  <option value="fast">Fast</option>
                  <option value="average">Average</option>
                  <option value="slow">Slow</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span>Min Matches</span>
                <select value={minMatches} onChange={e => setMinMatches(toNumber(e.target.value, 0))} style={{ height: '38px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  {MATCH_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span>Min Confidence %</span>
                <select value={minConfidence} onChange={e => setMinConfidence(toNumber(e.target.value, 0))} style={{ height: '38px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  {CONFIDENCE_OPTIONS.map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span>Min Alliance Score</span>
                <select value={minAllianceScore} onChange={e => setMinAllianceScore(toNumber(e.target.value, -999))} style={{ height: '38px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  {ALLIANCE_SCORE_OPTIONS.map(v => <option key={v} value={v}>{v === -999 ? 'Any' : v}</option>)}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span>Min Avg Auto Pts</span>
                <select value={minAutoPts} onChange={e => setMinAutoPts(toNumber(e.target.value, 0))} style={{ height: '38px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  {AUTO_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span>Min Avg Endgame Pts</span>
                <select value={minEndgamePts} onChange={e => setMinEndgamePts(toNumber(e.target.value, 0))} style={{ height: '38px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  {ENDGAME_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span>Max Broken %</span>
                <select value={maxBrokenRate} onChange={e => setMaxBrokenRate(toNumber(e.target.value, 100))} style={{ height: '38px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  {BROKEN_OPTIONS.map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
              </label>
              <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setCanHang(prev => !prev)}
                  className={`${tableStyles.ToggleButton} ${canHang ? tableStyles.ToggleButtonOn : tableStyles.ToggleButtonOff}`}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Can Hang
                </button>
                <button
                  type="button"
                  onClick={() => setCanTrench(prev => !prev)}
                  className={`${tableStyles.ToggleButton} ${canTrench ? tableStyles.ToggleButtonOn : tableStyles.ToggleButtonOff}`}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Can Trench
                </button>
                <button
                  type="button"
                  onClick={() => setHasAutos(prev => !prev)}
                  className={`${tableStyles.ToggleButton} ${hasAutos ? tableStyles.ToggleButtonOn : tableStyles.ToggleButtonOff}`}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Has Autos
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button onClick={() => setShowFilters(false)} className={tableStyles.PrimaryButton}>Done</button>
            </div>
          </div>
        </div>
      )}

      <div className={tableStyles.Card}>
        {filteredAndSorted.length === 0 ? (
          <p>No teams match current filters.</p>
        ) : (
          <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '70vh' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  {TABLE_HEADERS.map((header) => {
                    const isSortable = Boolean(header.sortKey)
                    const isActiveSort = isSortable && sortKey === header.sortKey
                    const directionLabel = isActiveSort ? ` (${sortDir})` : ''

                    return (
                      <th key={header.label} style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                        {isSortable ? (
                          <button
                            type="button"
                            onClick={() => handleHeaderSort(header.sortKey)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontWeight: isActiveSort ? 700 : 600,
                              color: isActiveSort ? '#0d6efd' : '#111',
                              width: '100%',
                              textAlign: 'center',
                              padding: 0,
                            }}
                          >
                            {header.label}{directionLabel}
                          </button>
                        ) : (
                          header.label
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((team, idx) => (
                  <tr key={team.TeamNumber} style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#f8f9fa' }}>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 700 }}>{team.TeamNumber}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{team.TeamName || '-'}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.baselineScore.toFixed(2)}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.allianceScore.toFixed(2)}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.statboticsEPA.toFixed(2)}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.statboticsAutoEPA.toFixed(2)}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.skillRating.toFixed(2)}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{(team.confidence * 100).toFixed(1)}%</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.Matches}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.AvgPoints.toFixed(2)}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.AvgAutoPts.toFixed(2)}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.AvgEndgamePts.toFixed(2)}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>{team.brokenRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllLeaderboardView;
