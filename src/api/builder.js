const AutoStratOpts = {
  WentMid: "WentMid",
  Scored: "Scored",
  CrossedMid: "CrossedMid",
  None: "None"
}

const StratOpts = {
  Hoarding: "Hoarding",
  Defense: "Defense",
  Offensive: "Offensive",
  Support: "Support",
  None: "None"
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
  None: "None"
}

const HangOpts = {
  Level3: "Level3",
  Level2: "Level2",
  Level1: "Level1",
  None: "None"
}

const SpeedOpts = {
  None: "None",
  SLOW: "Slow",
  AVERAGE: "Average",
  FAST: "Fast"
}

const CapabilitiesOpts = {
  Bump: "Bump",
  Trench: "Trench",
  None: "None"
}

const HangTeamworkOpts = {
  DoubleHang: "DoubleHang",
  TripleHang: "TripleHang",
  None: "None"
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

const buildMatchEntry = (teamId, matchKey) => {
  // if (regionalId === undefined)
  //   throw new Error("RegionalId Not provided")
  if (teamId === undefined)
    throw new Error("TeamId Not provided")
  // if (matchId === undefined)
  //   throw new Error("MatchId Not provided")

  console.log("building match entry")

    return {
      Team: teamId,
      MatchId: matchKey,
      Autonomous: {
        AutoStrat: AutoStratOpts.None,
        TravelMid: 0,
        AutoHang: HangOpts.None
      },
      Teleop: {
      TravelMid: 0,
      Endgame: HangOpts.None,
      },
      ActiveStrat: StratOpts.None, //need to add none options for all enums
      InactiveStrat: StratOpts.None, 
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
      RobotInfo: {
        RobotSpeed: SpeedOpts.None,
        ShooterSpeed: SpeedOpts.None,
        FuelCapacity: 0,
        BallsShot: 0,
        ShootingCycles: 0,
        WhatBrokeDesc: "",
        Comments: "",
      },
    Comment: "",
    }
  }

/*
// buildTeamAttribute Entry for initializing team attributes when a new team is added to the database, separate from match entries
const buildTeamAttributeEntry = (teamId) => {
  if (teamId === undefined)
    throw new Error("TeamId Not provided")

  console.log("building team attribute entry")

  return {
    Team: teamId,
    DeclaredFuelCap: 0,
    CyclesPerMatch: 0,
    Capabilities: CapabilitiesOpts.None,
    MaxHang: HangOpts.None,
    HangTeamwork: HangTeamworkOpts.None,
    HangTime: 0.0,
    Photo: "",
    Notes: "",
  }
}
*/

const buildTeamEntry = (teamNumber, data, type) => {
  if (teamNumber === undefined)
    throw new Error("TeamNumber Not provided")

  console.log("building team entry")
  console.log("the data: ", data)

  if(type === "match"){

    const matchEntry = data

    return {
      id: teamNumber,
//======================
      TeamMatches: {
        name: "",
        description: "",
        Team: teamNumber,
        Regional: "",
        MatchId: matchEntry.MatchId,
        Autonomous: {
          AutoStrat: matchEntry.AutoStrat, 
          TravelMid: matchEntry.Autonomous.TravelMid,
          AutoHang: matchEntry.Autonomous.AutoHang,
        },
        Teleop: {
          TravelMid: matchEntry.Teleop.TravelMid,
          Endgame: matchEntry.Teleop.Endgame,
        },
        ActiveStrat: StratOpts.None, 
        InactiveStrat: StratOpts.None, 
        RobotInfo: {
          RobotSpeed: matchEntry.RobotInfo.RobotSpeed,
          ShooterSpeed: matchEntry.RobotInfo.ShooterSpeed,
          FuelCapacity: matchEntry.RobotInfo.FuelCapacity, 
          BallsShot: matchEntry.RobotInfo.BallsShot,
          ShootingCycles: matchEntry.RobotInfo.ShootingCycles,
          WhatBrokeDesc: matchEntry.RobotInfo.WhatBrokeDesc,
          Comments: matchEntry.RobotInfo.Comments,
        },
        Penalties: {
          Fouls: matchEntry.Penalties.Fouls,
          Tech: matchEntry.Penalties.Tech,
          PenaltiesCommitted: {
            YellowCard: matchEntry.Penalties.PenaltiesCommitted.YellowCard,
            RedCard: matchEntry.Penalties.PenaltiesCommitted.RedCard,
            RedCard: matchEntry.Penalties.PenaltiesCommitted.RedCard,
            Disabled: matchEntry.Penalties.PenaltiesCommitted.Disabled,
            DQ: matchEntry.Penalties.PenaltiesCommitted.DQ,
            Broken: matchEntry.Penalties.PenaltiesCommitted.Broken,
            NoShow: matchEntry.Penalties.PenaltiesCommitted.NoShow,
          },
          FoulDesc: matchEntry.Penalties.FoulDesc
        },
      },

      TeamAttributes: {
        name: "",
        Regional: "",
        DeclaredFuelCap: 0,
        CyclesPerMatch: 0,
        Capabilities: CapabilitiesOpts.None, 
        MaxHang: HangOpts.None,
        HangTeamwork: HangTeamworkOpts.None, 
        HangTime: 0.0,
        Photo: "",
        Notes: "",
      }
    }
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
export  {buildMatchEntry, buildTeamEntry}