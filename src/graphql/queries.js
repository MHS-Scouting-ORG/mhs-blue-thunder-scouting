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
      nextToken
      __typename
    }
  }
`;
