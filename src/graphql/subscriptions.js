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
