/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
      id
      description
      Comment
      TeamAttributes {
        name
        Regional
        DeclaredFuelCap
        CyclesPerMatch
        FuelPerCycle
        NumAutos
        Capabilities
        MaxHang
        HangTeamwork
        HangTime
        CanAutoHang
        Photo
        Notes
        __typename
      }
      Regionals {
        RegionalId
        TeamMatches {
          name
          description
          Team
          MatchId
          MatchResult
          TeamImpact
          Autonomous {
            AutoStrat
            AutoHang
            __typename
          }
          Teleop {
            TravelMid
            Endgame
            __typename
          }
          ActiveStrat
          InactiveStrat
          RobotInfo {
            RobotSpeed
            ShooterSpeed
            DriverSkill
            FuelCapacity
            BallsShot
            ShootingCycles
            WhatBrokeDesc
            Comments
            __typename
          }
          Penalties {
            PenaltiesCommitted {
              Disabled
              DQ
              Broken
              NoShow
              StuckOnBump
              StuckOnBalls
              __typename
            }
            FoulDesc
            __typename
          }
          __typename
        }
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
        description
        Comment
        TeamAttributes {
          name
          Regional
          DeclaredFuelCap
          CyclesPerMatch
          FuelPerCycle
          NumAutos
          Capabilities
          MaxHang
          HangTeamwork
          HangTime
          CanAutoHang
          Photo
          Notes
          __typename
        }
        Regionals {
          RegionalId
          TeamMatches {
            name
            description
            Team
            MatchId
            MatchResult
            TeamImpact
            Autonomous {
              AutoStrat
              AutoHang
              __typename
            }
            Teleop {
              TravelMid
              Endgame
              __typename
            }
            ActiveStrat
            InactiveStrat
            RobotInfo {
              RobotSpeed
              ShooterSpeed
              DriverSkill
              FuelCapacity
              BallsShot
              ShootingCycles
              WhatBrokeDesc
              Comments
              __typename
            }
            Penalties {
              PenaltiesCommitted {
                Disabled
                DQ
                Broken
                NoShow
                StuckOnBump
                StuckOnBalls
                __typename
              }
              FoulDesc
              __typename
            }
            __typename
          }
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncTeams = /* GraphQL */ `
  query SyncTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTeams(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        description
        Comment
        TeamAttributes {
          name
          Regional
          DeclaredFuelCap
          CyclesPerMatch
          FuelPerCycle
          NumAutos
          Capabilities
          MaxHang
          HangTeamwork
          HangTime
          CanAutoHang
          Photo
          Notes
          __typename
        }
        Regionals {
          RegionalId
          TeamMatches {
            name
            description
            Team
            MatchId
            MatchResult
            TeamImpact
            Autonomous {
              AutoStrat
              AutoHang
              __typename
            }
            Teleop {
              TravelMid
              Endgame
              __typename
            }
            ActiveStrat
            InactiveStrat
            RobotInfo {
              RobotSpeed
              ShooterSpeed
              DriverSkill
              FuelCapacity
              BallsShot
              ShootingCycles
              WhatBrokeDesc
              Comments
              __typename
            }
            Penalties {
              PenaltiesCommitted {
                Disabled
                DQ
                Broken
                NoShow
                StuckOnBump
                StuckOnBalls
                __typename
              }
              FoulDesc
              __typename
            }
            __typename
          }
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
