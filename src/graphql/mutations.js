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
      name
      description
      Team
      Regional
      TotalPoints
      Autonomous {
        StartingPosition
        AmountScored {
          CoralL1
          CoralL2
          CoralL3
          CoralL4
          Processor
          Net
          __typename
        }
        PointsScored {
          Points
          CoralPoints
          AlgaePoints
          __typename
        }
        Left
        __typename
      }
      Teleop {
        AmountScored {
          CoralL1
          CoralL2
          CoralL3
          CoralL4
          Processor
          Net
          Cycles
          CoralL1Missed
          CoralL2Missed
          CoralL3Missed
          CoralL4Missed
          ProcessorMissed
          NetMissed
          __typename
        }
        PointsScored {
          Points
          EndgamePoints
          CoralPoints
          AlgaePoints
          __typename
        }
        Endgame {
          EndGameResult
          __typename
        }
        HumPlrScoring {
          Made
          Missed
          __typename
        }
        __typename
      }
      RobotInfo {
        RobotSpeed
        WhatBrokeDesc
        Comments
        __typename
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
          __typename
        }
        FoulDesc
        __typename
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
      name
      description
      Team
      Regional
      TotalPoints
      Autonomous {
        StartingPosition
        AmountScored {
          CoralL1
          CoralL2
          CoralL3
          CoralL4
          Processor
          Net
          __typename
        }
        PointsScored {
          Points
          CoralPoints
          AlgaePoints
          __typename
        }
        Left
        __typename
      }
      Teleop {
        AmountScored {
          CoralL1
          CoralL2
          CoralL3
          CoralL4
          Processor
          Net
          Cycles
          CoralL1Missed
          CoralL2Missed
          CoralL3Missed
          CoralL4Missed
          ProcessorMissed
          NetMissed
          __typename
        }
        PointsScored {
          Points
          EndgamePoints
          CoralPoints
          AlgaePoints
          __typename
        }
        Endgame {
          EndGameResult
          __typename
        }
        HumPlrScoring {
          Made
          Missed
          __typename
        }
        __typename
      }
      RobotInfo {
        RobotSpeed
        WhatBrokeDesc
        Comments
        __typename
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
          __typename
        }
        FoulDesc
        __typename
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
      name
      description
      Team
      Regional
      TotalPoints
      Autonomous {
        StartingPosition
        AmountScored {
          CoralL1
          CoralL2
          CoralL3
          CoralL4
          Processor
          Net
          __typename
        }
        PointsScored {
          Points
          CoralPoints
          AlgaePoints
          __typename
        }
        Left
        __typename
      }
      Teleop {
        AmountScored {
          CoralL1
          CoralL2
          CoralL3
          CoralL4
          Processor
          Net
          Cycles
          CoralL1Missed
          CoralL2Missed
          CoralL3Missed
          CoralL4Missed
          ProcessorMissed
          NetMissed
          __typename
        }
        PointsScored {
          Points
          EndgamePoints
          CoralPoints
          AlgaePoints
          __typename
        }
        Endgame {
          EndGameResult
          __typename
        }
        HumPlrScoring {
          Made
          Missed
          __typename
        }
        __typename
      }
      RobotInfo {
        RobotSpeed
        WhatBrokeDesc
        Comments
        __typename
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
          __typename
        }
        FoulDesc
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
