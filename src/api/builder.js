const initAutoAmountScored = _ => {
  return {
    Amp: 0,
    Speaker: 0,
  }

}

const initAutoPointsScored = _ => {
  return {
    Points: 0,
    SpeakerPoints: 0,
    AmpPoints: 0,
  }
}

const initTeleAmountScored = _ => {
  return {
    Amp: 0,
    Speaker: 0,
    AmplifiedSpeaker: 0,
    Cycles: 0,
  }
}

const initTelePointsScored = _ => {
  return {
    Points: 0,
    EndgamePoints: 0,
    SpeakerPoints: 0,
    AmpPoints: 0,
  }
}


const generateRandomScoring = function (cap) {
  if (!cap) {
    cap = {
      Cones: {
        Upper: 10,
        Mid: 10,
        Lower: 10
      },
      Cubes: {
        Upper: 10,
        Mid: 10,
        Lower: 10
      }
    }
  }
  return {
    Cones: {
      Upper: Math.min(Math.floor(Math.random() * 10), cap.Cones.Upper),
      Mid: Math.min(Math.floor(Math.random() * 10), cap.Cones.Mid),
      Lower: Math.min(Math.floor(Math.random() * 10), cap.Cones.Lower)
    },

    Cubes: {
      Upper: Math.min(Math.floor(Math.random() * 10), cap.Cubes.Upper),
      Mid: Math.min(Math.floor(Math.random() * 10), cap.Cubes.Mid),
      Lower: Math.min(Math.floor(Math.random() * 10), cap.Cubes.Lower)
    }


  }

}
const PenaltyOpts = {
  YELLOW_CARD: "YellowCard",
  RED_CARD: "RedCard",
  DISABLED: "Disabled",
  DQ: "DQ",
  BROKEN_BOT: "BrokenBot",
  NO_SHOW: "NoShow",
  NONE: "None"
}

const StageOpts = {
  ONSTAGE: "Onstage",
  ATTEMPTED: "Attempted",
  PARKED: "Parked",
  NONE: "None"
}

const StagePositionOpts = {
  NONE: "None",
  LEFT: "Left",
  RIGHT: "Right",
  CENTER: "Center",
}

const LineupSpeedOpts = {
  NONE: "None",
  SLOW: "Slow",
  AVERAGE: "Average",
  FAST: "Fast"
}

const IntakeRatingOpts = {
  NONE: "None",
  BAD: "Bad",
  AVERAGE: "Average",
  GOOD: "Good",
}

const MatchResultOpts = {
  WIN: "Win",
  TIE: "Tie",
  LOSS: "Loss",
}

const selectPropsFromEnum = function (enumVals) {
  const vals = []
  for (let i in enumVals) {
    if (Object.hasOwn(enumVals, i)) {
      if (Math.random() > 0.75) {
        vals.push(enumVals[i])
      }
    }
  }
  return vals
}

const selectRandomProps = function (enumVals) {
  const theValues = Object.values(enumVals)
  const val = Math.floor(Math.random() * theValues.length)
  return theValues[val]
}

const zeroAccuracy = function () {
  return {
    High: 0,
    Mid: 0,
    Low: 0,
    Overall: 0
  }


}

const buildMatchEntry = (regionalId, teamId, matchId) => {
  if (regionalId === undefined)
    throw new Error("RegionalId Not provided")
  if (teamId === undefined)
    throw new Error("TeamId Not provided")
  if (matchId === undefined)
    throw new Error("MatchId Not provided")

  console.log("building da entry")

  return {
    id: matchId,
    name: "",
    description: "",
    Team: teamId,
    Regional: regionalId,
    TotalPoints: 0,
    Autonomous: {
      StartingPosition: 0,
      AmountScored: initAutoAmountScored(),
      PointsScored: initAutoPointsScored(),
      Left: false,
    },
    Teleop: {
      AmountScored: initTeleAmountScored(),
      PointsScored: initTelePointsScored(),
      Endgame: {
        MatchResult: MatchResultOpts.WIN,
        StageResult: StageOpts.NONE,
        StagePosition: StagePositionOpts.NONE,
        TrapScored: false,
        Melody: false,
        Ensemble: false
      },
      HumPlrScoring: {
        Made: 0,
        Missed: 0
      }
    },
    Comments: "",
    RobotInfo: {
      BetterAmp: false,
      BetterSpeaker: false,
      BetterTrap: false,
      FasterThanUs: false,
      PassesUnderStage: false,
      HangsFaster: false,
      CountersDefense: false,
      CanDefend: false,
      LineupSpeed: LineupSpeedOpts.NONE,
      IntakeRating: IntakeRatingOpts.NONE,
      WhatBrokeDesc: "",
    },
    Penalties: {
      Fouls: 0,
      Tech: 0,
      PenaltiesCommitted: {
        YellowCard: false,
        RedCard: false,
        Disabled: false,
        DQ: false,
        Broken: false,
        NoShow: false,
      },
      FoulDesc: ""
    },
  }

}

const generateRandomEntry = function (regionId, teamId, matchId) {
  const matchEntry = buildMatchEntry(regionId, teamId, matchId)
  matchEntry.Penalties = {
    Fouls: Math.floor(Math.random() * 4),
    Tech: Math.floor(Math.random() * 4),
    Penalties: selectPropsFromEnum(PenaltyOpts)

  }
  matchEntry.RankingPts = selectPropsFromEnum(RankingPtsOpts)
  const Attempted = generateRandomScoring()
  const Scored = generateRandomScoring(Attempted)
  matchEntry.Autonomous = {
    AutonomousPlacement: Math.floor(Math.random() * 6),
    ChargeStation: selectRandomProps(ChargeStationType),
    LeftCommunity: Math.random() > 0.5,
    Scored,
    Attempted,

  }
  matchEntry.Teleop = {
    Scored,
    Attempted,
    ChargeStation: selectRandomProps(ChargeStationType),
    EndGame: selectRandomProps(ChargeStationType),
    DriveSpeed: Math.random() * 10,
    CubesAccuracy: zeroAccuracy(),
    ConesAccuracy: zeroAccuracy(),
    EndGameTally: {
      Start: 0,
      End: 0
    },


    ScoringTotal: {
      Total: 0,
      GridPoints: 0,
      GridScoringByPlacement: {
        High: 0,
        Mid: 0,
        Low: 0
      },
      Cones: 0,
      Cubes: 0,
    },

  }
  return matchEntry
}


/*
 * exported methods
 * buildMatchEntry - returns an object initialized with match entries
 */
export { StageOpts, StagePosOpts, PenaltyOpts, LineupSpeedOpts, IntakeRatingOpts, MatchResultOpts, generateRandomEntry, buildMatchEntry as default }