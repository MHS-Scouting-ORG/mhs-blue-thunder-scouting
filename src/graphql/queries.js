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
          StagePos
          TrapScored
          Melody
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
        BetterAmp
        BetterSpeaker
        BetterTrap
        FasterThanUs
        PassesUnderStage
        HangsFaster
        CountersDefense
        CanDefend
        LineupSpeed
        IntakeRating
        WhatBrokeDesc
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
            StagePos
            TrapScored
            Melody
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
          BetterAmp
          BetterSpeaker
          BetterTrap
          FasterThanUs
          PassesUnderStage
          HangsFaster
          CountersDefense
          CanDefend
          LineupSpeed
          IntakeRating
          WhatBrokeDesc
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
            StagePos
            TrapScored
            Melody
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
          BetterAmp
          BetterSpeaker
          BetterTrap
          FasterThanUs
          PassesUnderStage
          HangsFaster
          CountersDefense
          CanDefend
          LineupSpeed
          IntakeRating
          WhatBrokeDesc
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
            StagePos
            TrapScored
            Melody
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
          BetterAmp
          BetterSpeaker
          BetterTrap
          FasterThanUs
          PassesUnderStage
          HangsFaster
          CountersDefense
          CanDefend
          LineupSpeed
          IntakeRating
          WhatBrokeDesc
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
