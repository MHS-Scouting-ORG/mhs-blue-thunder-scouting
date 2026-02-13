/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
      id
      description
      Comment
      TeamMatches {
        name
        description
        Team
        Regional
        MatchId
        Autonomous {
          AutoStrat
          TravelMid
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
          FuelCapacity
          BallsShot
          ShootingCycles
          WhatBrokeDesc
          Comments
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
        __typename
      }
      TeamAttributes {
        name
        Regional
        DeclaredFuelCap
        CyclesPerMatch
        Capabilities
        MaxHang
        HangTeamwork
        HangTime
        Photo
        Notes
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
        description
        Comment
        TeamMatches {
          name
          description
          Team
          Regional
          MatchId
          Autonomous {
            AutoStrat
            TravelMid
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
            FuelCapacity
            BallsShot
            ShootingCycles
            WhatBrokeDesc
            Comments
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
          __typename
        }
        TeamAttributes {
          name
          Regional
          DeclaredFuelCap
          CyclesPerMatch
          Capabilities
          MaxHang
          HangTeamwork
          HangTime
          Photo
          Notes
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
