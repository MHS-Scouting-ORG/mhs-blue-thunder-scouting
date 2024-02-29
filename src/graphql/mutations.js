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
