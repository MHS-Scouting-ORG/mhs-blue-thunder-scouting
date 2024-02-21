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
export const onCreateTeamInfo = /* GraphQL */ `
  subscription OnCreateTeamInfo($filter: ModelSubscriptionTeamInfoFilterInput) {
    onCreateTeamInfo(filter: $filter) {
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
        StageResult
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
      RankingPts
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTeamInfo = /* GraphQL */ `
  subscription OnUpdateTeamInfo($filter: ModelSubscriptionTeamInfoFilterInput) {
    onUpdateTeamInfo(filter: $filter) {
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
        StageResult
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
      RankingPts
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTeamInfo = /* GraphQL */ `
  subscription OnDeleteTeamInfo($filter: ModelSubscriptionTeamInfoFilterInput) {
    onDeleteTeamInfo(filter: $filter) {
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
        StageResult
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
      RankingPts
      createdAt
      updatedAt
      __typename
    }
  }
`;
