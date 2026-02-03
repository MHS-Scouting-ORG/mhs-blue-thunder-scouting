/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onCreateTeam(filter: $filter) {
      id
      name
      description
      Comment
      photo
      fuelCapacity
      hangTime
      cyclesPerMatch
      fuelPerCycle
      bump
      trench
      numAutos
      maxHangHeight
      canDoubleHang
      canTripleHang
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onUpdateTeam(filter: $filter) {
      id
      name
      description
      Comment
      photo
      fuelCapacity
      hangTime
      cyclesPerMatch
      fuelPerCycle
      bump
      trench
      numAutos
      maxHangHeight
      canDoubleHang
      canTripleHang
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam($filter: ModelSubscriptionTeamFilterInput) {
    onDeleteTeam(filter: $filter) {
      id
      name
      description
      Comment
      photo
      fuelCapacity
      hangTime
      cyclesPerMatch
      fuelPerCycle
      bump
      trench
      numAutos
      maxHangHeight
      canDoubleHang
      canTripleHang
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const onCreateTeamMatch = /* GraphQL */ `
  subscription OnCreateTeamMatch($filter: ModelSubscriptionTeamMatchFilterInput) {
    onCreateTeamMatch(filter: $filter) {
      id
      Team
      Regional
      MatchType
      MatchNumber
      MatchKey
      Alliance
      TotalPoints
      Autonomous {
        AmountScored {
          CoralL1
          CoralL1Missed
          CoralL2
          CoralL2Missed
          CoralL3
          CoralL3Missed
          CoralL4
          CoralL4Missed
          Processor
          ProcessorMissed
          Net
          NetMissed
          Cycles
        }
        PointsScored {
          Points
          AlgaePoints
          CoralPoints
          EndgamePoints
        }
        StartingPosition
        Left
        Hang
      }
      Teleop {
        AmountScored {
          CoralL1
          CoralL1Missed
          CoralL2
          CoralL2Missed
          CoralL3
          CoralL3Missed
          CoralL4
          CoralL4Missed
          Processor
          ProcessorMissed
          Net
          NetMissed
          Cycles
        }
        PointsScored {
          Points
          AlgaePoints
          CoralPoints
          EndgamePoints
        }
        Endgame {
          EndGameResult
        }
        HumPlrScoring {
          Made
          Missed
        }
      }
      RobotInfo {
        RobotSpeed
        ShootingSpeed
        FuelCapacity
        BallsShot
        ShootingCycles
        WhatBrokeDesc
        Comments
      }
      Penalties {
        Fouls
        Tech
        PenaltiesCommitted {
          YellowCard
          RedCard
          Disabled
          DQ
          Broken
          NoShow
        }
        FoulDesc
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const onUpdateTeamMatch = /* GraphQL */ `
  subscription OnUpdateTeamMatch($filter: ModelSubscriptionTeamMatchFilterInput) {
    onUpdateTeamMatch(filter: $filter) {
      id
      Team
      Regional
      MatchType
      MatchNumber
      MatchKey
      Alliance
      TotalPoints
      Autonomous {
        AmountScored {
          CoralL1
          CoralL1Missed
          CoralL2
          CoralL2Missed
          CoralL3
          CoralL3Missed
          CoralL4
          CoralL4Missed
          Processor
          ProcessorMissed
          Net
          NetMissed
          Cycles
        }
        PointsScored {
          Points
          AlgaePoints
          CoralPoints
          EndgamePoints
        }
        StartingPosition
        Left
        Hang
      }
      Teleop {
        AmountScored {
          CoralL1
          CoralL1Missed
          CoralL2
          CoralL2Missed
          CoralL3
          CoralL3Missed
          CoralL4
          CoralL4Missed
          Processor
          ProcessorMissed
          Net
          NetMissed
          Cycles
        }
        PointsScored {
          Points
          AlgaePoints
          CoralPoints
          EndgamePoints
        }
        Endgame {
          EndGameResult
        }
        HumPlrScoring {
          Made
          Missed
        }
      }
      RobotInfo {
        RobotSpeed
        ShootingSpeed
        FuelCapacity
        BallsShot
        ShootingCycles
        WhatBrokeDesc
        Comments
      }
      Penalties {
        Fouls
        Tech
        PenaltiesCommitted {
          YellowCard
          RedCard
          Disabled
          DQ
          Broken
          NoShow
        }
        FoulDesc
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const onDeleteTeamMatch = /* GraphQL */ `
  subscription OnDeleteTeamMatch($filter: ModelSubscriptionTeamMatchFilterInput) {
    onDeleteTeamMatch(filter: $filter) {
      id
      Team
      Regional
      MatchType
      MatchNumber
      MatchKey
      Alliance
      TotalPoints
      createdAt
      updatedAt
      __typename
    }
  }
`;
