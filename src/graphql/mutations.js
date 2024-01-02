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
      Autonomous {
        AutonomousPlacement
        Scored {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Attempted {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        LeftCommunity
        ChargeStation
        __typename
      }
      Teleop {
        Scored {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Attempted {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Accuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        ChargeStation
        EndGame
        EndGameTally {
          Start
          End
          __typename
        }
        ScoringTotal {
          Total
          GridPoints
          GridScoringByPlacement {
            High
            Mid
            Low
            __typename
          }
          Cones
          Cubes
          __typename
        }
        DriveStrength
        DriveSpeed
        ConesAccuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        CubesAccuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        SmartPlacement
        __typename
      }
      Comments
      Penalties {
        Fouls
        Tech
        Penalties
        __typename
      }
      Priorities
      RankingPts
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
      Autonomous {
        AutonomousPlacement
        Scored {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Attempted {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        LeftCommunity
        ChargeStation
        __typename
      }
      Teleop {
        Scored {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Attempted {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Accuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        ChargeStation
        EndGame
        EndGameTally {
          Start
          End
          __typename
        }
        ScoringTotal {
          Total
          GridPoints
          GridScoringByPlacement {
            High
            Mid
            Low
            __typename
          }
          Cones
          Cubes
          __typename
        }
        DriveStrength
        DriveSpeed
        ConesAccuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        CubesAccuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        SmartPlacement
        __typename
      }
      Comments
      Penalties {
        Fouls
        Tech
        Penalties
        __typename
      }
      Priorities
      RankingPts
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
      Autonomous {
        AutonomousPlacement
        Scored {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Attempted {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        LeftCommunity
        ChargeStation
        __typename
      }
      Teleop {
        Scored {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Attempted {
          Cones {
            Upper
            Mid
            Lower
            __typename
          }
          Cubes {
            Upper
            Mid
            Lower
            __typename
          }
          __typename
        }
        Accuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        ChargeStation
        EndGame
        EndGameTally {
          Start
          End
          __typename
        }
        ScoringTotal {
          Total
          GridPoints
          GridScoringByPlacement {
            High
            Mid
            Low
            __typename
          }
          Cones
          Cubes
          __typename
        }
        DriveStrength
        DriveSpeed
        ConesAccuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        CubesAccuracy {
          High
          Mid
          Low
          Overall
          __typename
        }
        SmartPlacement
        __typename
      }
      Comments
      Penalties {
        Fouls
        Tech
        Penalties
        __typename
      }
      Priorities
      RankingPts
      createdAt
      updatedAt
      __typename
    }
  }
`;
