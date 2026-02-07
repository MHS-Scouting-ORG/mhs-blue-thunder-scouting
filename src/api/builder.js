/*const initAutoAmountScored = _ => {
  return {
    CoralL1: 0,
    CoralL1Missed: 0,
    CoralL2: 0,
    CoralL2Missed: 0,
    CoralL3: 0,
    CoralL3Missed: 0,
    CoralL4: 0,
    CoralL4Missed: 0,
    Processor: 0,
    ProcessorMissed: 0,
    Net: 0,
    NetMissed: 0,
    Cycles: 0,
  }

}

const initAutoPointsScored = _ => {
  return {
    Points: 0,
    AlgaePoints: 0,
    CoralPoints: 0,
    EndgamePoints: 0,
  }
}

const initTeleAmountScored = _ => {
  return {
    CoralL1: 0,
    CoralL1Missed: 0,
    CoralL2: 0,
    CoralL2Missed: 0,
    CoralL3: 0,
    CoralL3Missed: 0,
    CoralL4: 0,
    CoralL4Missed: 0,
    Processor: 0,
    ProcessorMissed: 0,
    Net: 0,
    NetMissed: 0,
    Cycles: 0,
  }
}

const initTelePointsScored = _ => {
  return {
    Points: 0,
    AlgaePoints: 0,
    CoralPoints: 0,
    EndgamePoints: 0,
  }
} 
 */

const AutoStratOpts = {
  WentMid: "WentMid",
  Scored: "Scored",
  CrossedMid: "CrossedMid",
  NONE: "None"
}

const StratOpts = {
  Hoarding: "Hoarding",
  Defense: "Defense",
  Offensive: "Offensive",
  Support: "Support",
  NONE: "None"
}

/*const initHumanPlayerScoring = _ => {
  return {
    Made: 0,
    Missed: 0,
  }
} */


/*const generateRandomScoring = function (cap) {
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

} */

const PenaltyOpts = {
  YELLOW_CARD: "YellowCard",
  RED_CARD: "RedCard",
  DISABLED: "Disabled",
  DQ: "DQ",
  BROKEN_BOT: "BrokenBot",
  NO_SHOW: "NoShow",
  NONE: "None"
}

const HangOpts = {
  Level3: "Level3",
  Level2: "Level2",
  Level1: "Level1",
  NONE: "None"
}

const SpeedOpts = {
  NONE: "None",
  SLOW: "Slow",
  AVERAGE: "Average",
  FAST: "Fast"
}

const CapabilitiesOpts = {
  Bump: "Bump",
  Trench: "Trench",
  NONE: "None"
}

const HangTeamworkOpts = {
  CanDoubleHang: "CanDoublehang",
  CanTripleHang: "CanTripleHang",
  NONE: "None"
}

/*
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
*/

const buildMatchEntry = (regionalId, teamId, matchId, matchType, matchNumber, alliance) => {
  if (regionalId === undefined)
    throw new Error("RegionalId Not provided")
  if (teamId === undefined)
    throw new Error("TeamId Not provided")
  if (matchId === undefined)
    throw new Error("MatchId Not provided")

  console.log("building da entry")

  return {
    id: matchId,
    Team: teamId,
    Regional: regionalId,
    MatchType: matchType,
    MatchNumber: matchNumber,
    MatchKey: matchId,
    Alliance: alliance,
    TotalPoints: 0,
    Autonomous: {
      //AmountScored: initAutoAmountScored(),
      //PointsScored: initAutoPointsScored(),
      //StartingPosition: 0,
      //Left: false,
      //Hang: '',
      AutoStrat: AutoStratOpts.NONE,
      TravelMid: 0,
      AutoHang: HangOpts.NONE
    },
    Teleop: {
      // AmountScored: initTeleAmountScored(),
      // PointsScored: initTelePointsScored(),
      TravelMid: 0,
      Endgame: HangOpts.NONE,
      //HumPlrScoring: initHumanPlayerScoring(),
    },
    ActiveStrat: StratOpts.NONE,
    InactiveStrat: StratOpts.NONE, 
    /*RobotInfo: {
      RobotSpeed: SpeedOpts.NONE,
      ShootingSpeed: SpeedOpts.NONE,
      FuelCapacity: 0,
      BallsShot: 0,
      ShootingCycles: 0,
      WhatBrokeDesc: "",
      Comments: ""
    },
    */ 
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
        Tipped: false,
      },
      FoulDesc: ""
    },
  }

}
// buildTeamAttribute Entry for initializing team attributes when a new team is added to the database, separate from match entries
const buildTeamAttributeEntry = (teamId) => {
  if (teamId === undefined)
    throw new Error("TeamId Not provided")

  console.log("building team attribute entry")

  return {
    Team: teamId,
    DeclaredFuelCap: 0,
    CyclesPerMatch: 0,
    Capabilities: CapabilitiesOpts.NONE,
    MaxHang: HangOpts.NONE,
    HangTeamwork: HangTeamworkOpts.NONE,
    HangTime: 0.0,
    Photo: "",
    Notes: "",
  }
}



/* const generateRandomEntry = function (regionId, teamId, matchId) {
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
} */ //commented out to prevent accidental use, as it generates random entries that may be hard to delete


/*
 * exported methods
 * buildMatchEntry - returns an object initialized with match entries
 */
export { PenaltyOpts, SpeedOpts, StratOpts, AutoStratOpts, HangOpts, /*generateRandomEntry */ buildMatchEntry as default,}