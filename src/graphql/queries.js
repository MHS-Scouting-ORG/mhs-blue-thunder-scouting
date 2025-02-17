/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
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
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $id: ID
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTeams(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        description
        Comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTeamMatch = /* GraphQL */ `
  query GetTeamMatch($id: ID!, $Regional: String!, $Team: ID!) {
    getTeamMatch(id: $id, Regional: $Regional, Team: $Team) {
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
export const listTeamMatches = /* GraphQL */ `
  query ListTeamMatches(
    $id: ID
    $regionalTeam: ModelTeamMatchPrimaryCompositeKeyConditionInput
    $filter: ModelTeamMatchFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTeamMatches(
      id: $id
      regionalTeam: $regionalTeam
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const teamMatchesByTeam = /* GraphQL */ `
  query TeamMatchesByTeam(
    $Team: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamMatchesByTeam(
      Team: $Team
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const teamMatchesByRegional = /* GraphQL */ `
  query TeamMatchesByRegional(
    $Regional: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamMatchesByRegional(
      Regional: $Regional
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
