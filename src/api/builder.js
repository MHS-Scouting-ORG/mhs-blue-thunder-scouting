const initScoring = _ => {
  return {
    Cones: {
      Upper: 0,
      Mid: 0,
      Lower: 0
    },
    Cubes: {
      Upper: 0,
      Mid: 0,
      Lower: 0
    }
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
const PenaltyKinds = {
  YELLOW_CARD: "YellowCard",
  RED_CARD: "RedCard",
  DISABLED: "Disabled",
  DQ: "DQ",
  BROKEN_BOT: "BrokenBot",
  NO_SHOW: "NoShow",
  NONE: "None"

}

const ChargeStationType = {
    DOCKED_ENGAGED: "DockedEngaged",
    DOCKED: "Docked",
    ATTEMPTED: "Attempted",
    NONE: "None"
}

const IntakeType = {
  SINGLE_SUBSTATION: "SingleSubStation",
  DOUBLE_STATION: "DoubleStation",
  PORTALS: "Portals",
  SLIDING_SHELVES: "SlidingShelves",
  GROUND: "Ground"
}

const RankingPtsOpts = {
  WIN: "Win",
  TIE: "Tie",
  LOSS: "Loss",
  SUSTAINABILITY_BONUS: "SustainabilityBonus",
  ACTIVATION_BONUS: "ActivationBonus",

}

const PriorityOpts = {
    HIGH: "High",
    MID: "Mid",
    LOW: "Low",
    CONES: "Cones",
    CUBES: "Cubes",
    CHARGESTATION: "ChargeStation",
    DEFENSE: "Defense",
    SINGLE_SUBSTATION: "SingleSubstation",
    DOUBLE_STATION: "DoubleStation",
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

  return {
    id: matchId,
    name: "",
    description: "",
    Team: teamId,
    Regional: regionalId,
    Autonomous: {
      AutonomousPlacement: 0,
      Scored: initScoring(),
      Attempted: initScoring(),
      LeftCommunity: false,
      ChargeStation: ChargeStationType.NONE,
    },
    Teleop: {
      Scored: initScoring(),
      Attempted: initScoring(),
      ChargeStation: ChargeStationType.NONE,
      EndGame: ChargeStationType.NONE,
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
      DriveStrength: "",
      DriveSpeed: 0,
      ConesAccuracy: zeroAccuracy(),
      CubesAccuracy: zeroAccuracy(),
      SmartPlacement: false,

    },
    RankingPts: [],
    Comments: "",
    Penalties: {
      Fouls: 0,
      Tech: 0,
      Penalties: []
    },
    Priorities: [],



  }

}

const generateRandomEntry = function (regionId, teamId, matchId) {
  const matchEntry = buildMatchEntry(regionId, teamId, matchId)
  matchEntry.Penalties = {
    Fouls: Math.floor(Math.random() * 4),
    Tech: Math.floor(Math.random() * 4),
    Penalties: selectPropsFromEnum(PenaltyKinds)

  }
  matchEntry.Priorities = selectPropsFromEnum(PriorityOpts)
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
 * ChargeStationType - enum of valid charge stations types
 * IntakeType - enum of valid intake types
 */
export { ChargeStationType, IntakeType, PenaltyKinds, RankingPtsOpts, PriorityOpts, generateRandomEntry, buildMatchEntry as default }