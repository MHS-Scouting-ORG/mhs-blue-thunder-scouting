/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onCreateTeam(filter: $filter) {
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
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onUpdateTeam(filter: $filter) {
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
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam($filter: ModelSubscriptionTeamFilterInput) {
    onDeleteTeam(filter: $filter) {
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
export const onCreateTeamMatch = /* GraphQL */ `
  subscription OnCreateTeamMatch(
    $filter: ModelSubscriptionTeamMatchFilterInput
  ) {
    onCreateTeamMatch(filter: $filter) {
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
export const onUpdateTeamMatch = /* GraphQL */ `
  subscription OnUpdateTeamMatch(
    $filter: ModelSubscriptionTeamMatchFilterInput
  ) {
    onUpdateTeamMatch(filter: $filter) {
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
export const onDeleteTeamMatch = /* GraphQL */ `
  subscription OnDeleteTeamMatch(
    $filter: ModelSubscriptionTeamMatchFilterInput
  ) {
    onDeleteTeamMatch(filter: $filter) {
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
