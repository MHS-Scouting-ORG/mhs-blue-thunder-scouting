/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
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
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
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
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
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
