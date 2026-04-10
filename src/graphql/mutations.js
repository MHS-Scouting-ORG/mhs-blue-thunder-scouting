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
      TeamAttributes {
        name
        Regional
        DeclaredFuelCap
        CyclesPerMatch
        FuelPerCycle
        NumAutos
        Pickable
        Capabilities
        MaxHang
        HangTeamwork
        HangTime
        CanAutoHang
        ShooterType
        Turret
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
          MatchType
          MatchResult
          AutoWin
          TeamImpact
          AutoImpact
          AllianceScore
          OpponentScore
          SubmittedBy
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
            DefenseEffectiveness
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
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
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
        Pickable
        Capabilities
        MaxHang
        HangTeamwork
        HangTime
        CanAutoHang
        ShooterType
        Turret
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
          MatchType
          MatchResult
          AutoWin
          TeamImpact
          AutoImpact
          AllianceScore
          OpponentScore
          SubmittedBy
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
            DefenseEffectiveness
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
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
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
        Pickable
        Capabilities
        MaxHang
        HangTeamwork
        HangTime
        CanAutoHang
        ShooterType
        Turret
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
          MatchType
          MatchResult
          AutoWin
          TeamImpact
          AutoImpact
          AllianceScore
          OpponentScore
          SubmittedBy
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
            DefenseEffectiveness
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
