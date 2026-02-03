/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
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

export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
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

export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
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

export const createTeamMatch = /* GraphQL */ `
  mutation CreateTeamMatch(
    $input: CreateTeamMatchInput!
    $condition: ModelTeamMatchConditionInput
  ) {
    createTeamMatch(input: $input, condition: $condition) {
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

export const updateTeamMatch = /* GraphQL */ `
  mutation UpdateTeamMatch(
    $input: UpdateTeamMatchInput!
    $condition: ModelTeamMatchConditionInput
  ) {
    updateTeamMatch(input: $input, condition: $condition) {
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

export const deleteTeamMatch = /* GraphQL */ `
  mutation DeleteTeamMatch(
    $input: DeleteTeamMatchInput!
    $condition: ModelTeamMatchConditionInput
  ) {
    deleteTeamMatch(input: $input, condition: $condition) {
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
