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
export const createTeamInfo = /* GraphQL */ `
  mutation CreateTeamInfo(
    $input: CreateTeamInfoInput!
    $condition: ModelTeamInfoConditionInput
  ) {
    createTeamInfo(input: $input, condition: $condition) {
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
export const updateTeamInfo = /* GraphQL */ `
  mutation UpdateTeamInfo(
    $input: UpdateTeamInfoInput!
    $condition: ModelTeamInfoConditionInput
  ) {
    updateTeamInfo(input: $input, condition: $condition) {
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
export const deleteTeamInfo = /* GraphQL */ `
  mutation DeleteTeamInfo(
    $input: DeleteTeamInfoInput!
    $condition: ModelTeamInfoConditionInput
  ) {
    deleteTeamInfo(input: $input, condition: $condition) {
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
