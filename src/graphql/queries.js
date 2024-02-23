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
export const getTeamInfo = /* GraphQL */ `
  query GetTeamInfo($id: ID!, $Regional: String!, $Team: ID!) {
    getTeamInfo(id: $id, Regional: $Regional, Team: $Team) {
      id
      name
      description
      Team
      Regional
      Autonomous {
        StartingPosition
        AmountScored {
          Amp
          Speaker
          __typename
        }
        PointsScored {
          Points
          SpeakerPoints
          AmpPoints
          __typename
        }
        Left
        __typename
      }
      Teleop {
        AmountScored {
          Amp
          Speaker
          AmplifiedSpeaker
          Cycles
          __typename
        }
        PointsScored {
          Points
          EndgamePoints
          SpeakerPoints
          AmpPoints
          __typename
        }
        Endgame {
          MatchResult
          StageResult
          Harmony
          Ensemble
          __typename
        }
        HumPlrScoring {
          Made
          Missed
          __typename
        }
        __typename
      }
      Comments
      RobotInfo {
        FasterThanUs
        PassesUnderStage
        HangsFaster
        CountersDefense
        LineupSpeed
        IntakeRating
        WhatBrokeDesc
        __typename
      }
      Penalties {
        Fouls
        Tech
        Penalties
        FoulDesc
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTeamInfos = /* GraphQL */ `
  query ListTeamInfos(
    $id: ID
    $regionalTeam: ModelTeamInfoPrimaryCompositeKeyConditionInput
    $filter: ModelTeamInfoFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTeamInfos(
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
        Autonomous {
          StartingPosition
          AmountScored {
            Amp
            Speaker
            __typename
          }
          PointsScored {
            Points
            SpeakerPoints
            AmpPoints
            __typename
          }
          Left
          __typename
        }
        Teleop {
          AmountScored {
            Amp
            Speaker
            AmplifiedSpeaker
            Cycles
            __typename
          }
          PointsScored {
            Points
            EndgamePoints
            SpeakerPoints
            AmpPoints
            __typename
          }
          Endgame {
            MatchResult
            StageResult
            Harmony
            Ensemble
            __typename
          }
          HumPlrScoring {
            Made
            Missed
            __typename
          }
          __typename
        }
        Comments
        RobotInfo {
          FasterThanUs
          PassesUnderStage
          HangsFaster
          CountersDefense
          LineupSpeed
          IntakeRating
          WhatBrokeDesc
          __typename
        }
        Penalties {
          Fouls
          Tech
          Penalties
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
export const teamInfosByTeam = /* GraphQL */ `
  query TeamInfosByTeam(
    $Team: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamInfosByTeam(
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
        Autonomous {
          StartingPosition
          AmountScored {
            Amp
            Speaker
            __typename
          }
          PointsScored {
            Points
            SpeakerPoints
            AmpPoints
            __typename
          }
          Left
          __typename
        }
        Teleop {
          AmountScored {
            Amp
            Speaker
            AmplifiedSpeaker
            Cycles
            __typename
          }
          PointsScored {
            Points
            EndgamePoints
            SpeakerPoints
            AmpPoints
            __typename
          }
          Endgame {
            MatchResult
            StageResult
            Harmony
            Ensemble
            __typename
          }
          HumPlrScoring {
            Made
            Missed
            __typename
          }
          __typename
        }
        Comments
        RobotInfo {
          FasterThanUs
          PassesUnderStage
          HangsFaster
          CountersDefense
          LineupSpeed
          IntakeRating
          WhatBrokeDesc
          __typename
        }
        Penalties {
          Fouls
          Tech
          Penalties
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
export const teamInfosByRegional = /* GraphQL */ `
  query TeamInfosByRegional(
    $Regional: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamInfosByRegional(
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
        Autonomous {
          StartingPosition
          AmountScored {
            Amp
            Speaker
            __typename
          }
          PointsScored {
            Points
            SpeakerPoints
            AmpPoints
            __typename
          }
          Left
          __typename
        }
        Teleop {
          AmountScored {
            Amp
            Speaker
            AmplifiedSpeaker
            Cycles
            __typename
          }
          PointsScored {
            Points
            EndgamePoints
            SpeakerPoints
            AmpPoints
            __typename
          }
          Endgame {
            MatchResult
            StageResult
            Harmony
            Ensemble
            __typename
          }
          HumPlrScoring {
            Made
            Missed
            __typename
          }
          __typename
        }
        Comments
        RobotInfo {
          FasterThanUs
          PassesUnderStage
          HangsFaster
          CountersDefense
          LineupSpeed
          IntakeRating
          WhatBrokeDesc
          __typename
        }
        Penalties {
          Fouls
          Tech
          Penalties
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
