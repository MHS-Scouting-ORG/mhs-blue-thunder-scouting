/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onCreateTeam(filter: $filter) {
      id
      description
      Comment
      TeamMatches {
        name
        description
        Team
        Regional
        Autonomous {
          AutoStrat
          TravelMid
          AutoHang
          __typename
        }
        Teleop {
          TeleStrat
          TravelMid
          Endgame
          __typename
        }
        ActiveStrat
        InactiveStrat
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
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onUpdateTeam(filter: $filter) {
      id
      description
      Comment
      TeamMatches {
        name
        description
        Team
        Regional
        Autonomous {
          AutoStrat
          TravelMid
          AutoHang
          __typename
        }
        Teleop {
          TeleStrat
          TravelMid
          Endgame
          __typename
        }
        ActiveStrat
        InactiveStrat
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
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam($filter: ModelSubscriptionTeamFilterInput) {
    onDeleteTeam(filter: $filter) {
      id
      description
      Comment
      TeamMatches {
        name
        description
        Team
        Regional
        Autonomous {
          AutoStrat
          TravelMid
          AutoHang
          __typename
        }
        Teleop {
          TeleStrat
          TravelMid
          Endgame
          __typename
        }
        ActiveStrat
        InactiveStrat
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
