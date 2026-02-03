/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
      id
      name
      description
      Comment
      photo
      fuelCapacity
      hangTime
      cyclesPerMatch
      fuelPerCycle
      bump
      trench
      numAutos
      maxHangHeight
      canDoubleHang
      canTripleHang
      matches {
        items {
          id
          Team
          Regional
          MatchType
          MatchNumber
          MatchKey
          Alliance
          TotalPoints
          Autonomous {
            AmountScored {
              CoralL1
              CoralL1Missed
              CoralL2
              CoralL2Missed
              CoralL3
              CoralL3Missed
              CoralL4
              CoralL4Missed
              Processor
              ProcessorMissed
              Net
              NetMissed
              Cycles
            }
            PointsScored {
              Points
              AlgaePoints
              CoralPoints
              EndgamePoints
            }
            StartingPosition
            Left
            Hang
          }
          Teleop {
            AmountScored {
              CoralL1
              CoralL1Missed
              CoralL2
              CoralL2Missed
              CoralL3
              CoralL3Missed
              CoralL4
              CoralL4Missed
              Processor
              ProcessorMissed
              Net
              NetMissed
              Cycles
            }
            PointsScored {
              Points
              AlgaePoints
              CoralPoints
              EndgamePoints
            }
            Endgame {
              EndGameResult
            }
            HumPlrScoring {
              Made
              Missed
            }
          }
          RobotInfo {
            RobotSpeed
            ShootingSpeed
            FuelCapacity
            BallsShot
            ShootingCycles
            WhatBrokeDesc
            Comments
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
            }
            FoulDesc
          }
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
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
        photo
        fuelCapacity
        hangTime
        cyclesPerMatch
        fuelPerCycle
        bump
        trench
        numAutos
        maxHangHeight
        canDoubleHang
        canTripleHang
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
  query GetTeamMatch($id: ID!, $Team: ID!, $Regional: String!) {
    getTeamMatch(id: $id, Team: $Team, Regional: $Regional) {
      id
      Team
      Regional
      MatchType
      MatchNumber
      MatchKey
      Alliance
      TotalPoints
      Autonomous {
        AmountScored {
          CoralL1
          CoralL1Missed
          CoralL2
          CoralL2Missed
          CoralL3
          CoralL3Missed
          CoralL4
          CoralL4Missed
          Processor
          ProcessorMissed
          Net
          NetMissed
          Cycles
        }
        PointsScored {
          Points
          AlgaePoints
          CoralPoints
          EndgamePoints
        }
        StartingPosition
        Left
        Hang
      }
      Teleop {
        AmountScored {
          CoralL1
          CoralL1Missed
          CoralL2
          CoralL2Missed
          CoralL3
          CoralL3Missed
          CoralL4
          CoralL4Missed
          Processor
          ProcessorMissed
          Net
          NetMissed
          Cycles
        }
        PointsScored {
          Points
          AlgaePoints
          CoralPoints
          EndgamePoints
        }
        Endgame {
          EndGameResult
        }
        HumPlrScoring {
          Made
          Missed
        }
      }
      RobotInfo {
        RobotSpeed
        ShootingSpeed
        FuelCapacity
        BallsShot
        ShootingCycles
        WhatBrokeDesc
        Comments
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
        }
        FoulDesc
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const teamMatchesByRegional = /* GraphQL */ `
  query TeamMatchesByRegional(
    $Regional: String!
    $MatchType: ModelStringKeyConditionInput
    $MatchNumber: ModelIntKeyConditionInput
    $Team: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTeamMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamMatchesByRegional(
      Regional: $Regional
      MatchType: $MatchType
      MatchNumber: $MatchNumber
      Team: $Team
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Team
        Regional
        MatchType
        MatchNumber
        MatchKey
        Alliance
        TotalPoints
        Autonomous {
          AmountScored {
            CoralL1
            CoralL1Missed
            CoralL2
            CoralL2Missed
            CoralL3
            CoralL3Missed
            CoralL4
            CoralL4Missed
            Processor
            ProcessorMissed
            Net
            NetMissed
            Cycles
          }
          PointsScored {
            Points
            AlgaePoints
            CoralPoints
            EndgamePoints
          }
          StartingPosition
          Left
          Hang
        }
        Teleop {
          AmountScored {
            CoralL1
            CoralL1Missed
            CoralL2
            CoralL2Missed
            CoralL3
            CoralL3Missed
            CoralL4
            CoralL4Missed
            Processor
            ProcessorMissed
            Net
            NetMissed
            Cycles
          }
          PointsScored {
            Points
            AlgaePoints
            CoralPoints
            EndgamePoints
          }
          Endgame {
            EndGameResult
          }
          HumPlrScoring {
            Made
            Missed
          }
        }
        RobotInfo {
          RobotSpeed
          ShootingSpeed
          FuelCapacity
          BallsShot
          ShootingCycles
          WhatBrokeDesc
          Comments
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
          }
          FoulDesc
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
