import { ModelInit, MutableModel, __modelMeta__, OptionallyManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum AutoStratOpts {
  WENT_MID = "WentMid",
  SCORED = "Scored",
  CROSSED_MID = "CrossedMid",
  NONE = "None"
}

export enum AutoHangOpts {
  LEVEL1 = "Level1",
  NONE = "None"
}

export enum HangOpts {
  LEVEL3 = "Level3",
  LEVEL2 = "Level2",
  LEVEL1 = "Level1",
  NONE = "None"
}

export enum SpeedOpts {
  NONE = "None",
  SLOW = "Slow",
  AVERAGE = "Average",
  FAST = "Fast"
}

export enum StratOpts {
  HOARDING = "Hoarding",
  DEFENSE = "Defense",
  OFFENSIVE = "Offensive",
  SUPPORT = "Support",
  NONE = "None"
}

export enum HangTeamworkOpts {
  DOUBLE_HANG = "DoubleHang",
  TRIPLE_HANG = "TripleHang",
  NONE = "None"
}

export enum CapabilitiesOpts {
  BUMP = "Bump",
  TRENCH = "Trench",
  NONE = "None"
}

type EagerAutonomousType = {
  readonly AutoStrat?: AutoStratOpts | keyof typeof AutoStratOpts | null;
  readonly TravelMid?: number | null;
  readonly AutoHang?: AutoHangOpts | keyof typeof AutoHangOpts | null;
}

type LazyAutonomousType = {
  readonly AutoStrat?: AutoStratOpts | keyof typeof AutoStratOpts | null;
  readonly TravelMid?: number | null;
  readonly AutoHang?: AutoHangOpts | keyof typeof AutoHangOpts | null;
}

export declare type AutonomousType = LazyLoading extends LazyLoadingDisabled ? EagerAutonomousType : LazyAutonomousType

export declare const AutonomousType: (new (init: ModelInit<AutonomousType>) => AutonomousType)

type EagerPenaltyOpts = {
  readonly YellowCard?: boolean | null;
  readonly RedCard?: boolean | null;
  readonly Disabled?: boolean | null;
  readonly DQ?: boolean | null;
  readonly Broken?: boolean | null;
  readonly NoShow?: boolean | null;
}

type LazyPenaltyOpts = {
  readonly YellowCard?: boolean | null;
  readonly RedCard?: boolean | null;
  readonly Disabled?: boolean | null;
  readonly DQ?: boolean | null;
  readonly Broken?: boolean | null;
  readonly NoShow?: boolean | null;
}

export declare type PenaltyOpts = LazyLoading extends LazyLoadingDisabled ? EagerPenaltyOpts : LazyPenaltyOpts

export declare const PenaltyOpts: (new (init: ModelInit<PenaltyOpts>) => PenaltyOpts)

type EagerTeleType = {
  readonly TravelMid?: number | null;
  readonly Endgame?: HangOpts | keyof typeof HangOpts | null;
}

type LazyTeleType = {
  readonly TravelMid?: number | null;
  readonly Endgame?: HangOpts | keyof typeof HangOpts | null;
}

export declare type TeleType = LazyLoading extends LazyLoadingDisabled ? EagerTeleType : LazyTeleType

export declare const TeleType: (new (init: ModelInit<TeleType>) => TeleType)

type EagerPenaltyType = {
  readonly Fouls?: number | null;
  readonly Tech?: number | null;
  readonly PenaltiesCommitted?: PenaltyOpts | null;
  readonly FoulDesc?: string | null;
}

type LazyPenaltyType = {
  readonly Fouls?: number | null;
  readonly Tech?: number | null;
  readonly PenaltiesCommitted?: PenaltyOpts | null;
  readonly FoulDesc?: string | null;
}

export declare type PenaltyType = LazyLoading extends LazyLoadingDisabled ? EagerPenaltyType : LazyPenaltyType

export declare const PenaltyType: (new (init: ModelInit<PenaltyType>) => PenaltyType)

type EagerRobotInfoType = {
  readonly RobotSpeed?: SpeedOpts | keyof typeof SpeedOpts | null;
  readonly ShooterSpeed?: SpeedOpts | keyof typeof SpeedOpts | null;
  readonly FuelCapacity?: number | null;
  readonly BallsShot?: number | null;
  readonly ShootingCycles?: number | null;
  readonly WhatBrokeDesc?: string | null;
  readonly Comments?: string | null;
}

type LazyRobotInfoType = {
  readonly RobotSpeed?: SpeedOpts | keyof typeof SpeedOpts | null;
  readonly ShooterSpeed?: SpeedOpts | keyof typeof SpeedOpts | null;
  readonly FuelCapacity?: number | null;
  readonly BallsShot?: number | null;
  readonly ShootingCycles?: number | null;
  readonly WhatBrokeDesc?: string | null;
  readonly Comments?: string | null;
}

export declare type RobotInfoType = LazyLoading extends LazyLoadingDisabled ? EagerRobotInfoType : LazyRobotInfoType

export declare const RobotInfoType: (new (init: ModelInit<RobotInfoType>) => RobotInfoType)

type EagerTeamMatchesType = {
  readonly name?: string | null;
  readonly description?: string | null;
  readonly Team: string;
  readonly MatchId?: string | null;
  readonly Autonomous: AutonomousType;
  readonly Teleop: TeleType;
  readonly ActiveStrat?: StratOpts | keyof typeof StratOpts | null;
  readonly InactiveStrat?: StratOpts | keyof typeof StratOpts | null;
  readonly RobotInfo?: RobotInfoType | null;
  readonly Penalties?: PenaltyType | null;
}

type LazyTeamMatchesType = {
  readonly name?: string | null;
  readonly description?: string | null;
  readonly Team: string;
  readonly MatchId?: string | null;
  readonly Autonomous: AutonomousType;
  readonly Teleop: TeleType;
  readonly ActiveStrat?: StratOpts | keyof typeof StratOpts | null;
  readonly InactiveStrat?: StratOpts | keyof typeof StratOpts | null;
  readonly RobotInfo?: RobotInfoType | null;
  readonly Penalties?: PenaltyType | null;
}

export declare type TeamMatchesType = LazyLoading extends LazyLoadingDisabled ? EagerTeamMatchesType : LazyTeamMatchesType

export declare const TeamMatchesType: (new (init: ModelInit<TeamMatchesType>) => TeamMatchesType)

type EagerTeamAttributesType = {
  readonly name?: string | null;
  readonly Regional: string;
  readonly DeclaredFuelCap?: number | null;
  readonly CyclesPerMatch?: number | null;
  readonly Capabilities?: CapabilitiesOpts | keyof typeof CapabilitiesOpts | null;
  readonly MaxHang?: HangOpts | keyof typeof HangOpts | null;
  readonly HangTeamwork?: HangTeamworkOpts | keyof typeof HangTeamworkOpts | null;
  readonly HangTime?: number | null;
  readonly Photo?: string | null;
  readonly Notes?: string | null;
}

type LazyTeamAttributesType = {
  readonly name?: string | null;
  readonly Regional: string;
  readonly DeclaredFuelCap?: number | null;
  readonly CyclesPerMatch?: number | null;
  readonly Capabilities?: CapabilitiesOpts | keyof typeof CapabilitiesOpts | null;
  readonly MaxHang?: HangOpts | keyof typeof HangOpts | null;
  readonly HangTeamwork?: HangTeamworkOpts | keyof typeof HangTeamworkOpts | null;
  readonly HangTime?: number | null;
  readonly Photo?: string | null;
  readonly Notes?: string | null;
}

export declare type TeamAttributesType = LazyLoading extends LazyLoadingDisabled ? EagerTeamAttributesType : LazyTeamAttributesType

export declare const TeamAttributesType: (new (init: ModelInit<TeamAttributesType>) => TeamAttributesType)

type EagerRegionalType = {
  readonly RegionalId?: string | null;
  readonly TeamMatches?: (TeamMatchesType | null)[] | null;
}

type LazyRegionalType = {
  readonly RegionalId?: string | null;
  readonly TeamMatches?: (TeamMatchesType | null)[] | null;
}

export declare type RegionalType = LazyLoading extends LazyLoadingDisabled ? EagerRegionalType : LazyRegionalType

export declare const RegionalType: (new (init: ModelInit<RegionalType>) => RegionalType)

type EagerTeam = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<Team, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly description?: string | null;
  readonly Comment?: string | null;
  readonly TeamAttributes: TeamAttributesType;
  readonly Regionals?: (RegionalType | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTeam = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<Team, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly description?: string | null;
  readonly Comment?: string | null;
  readonly TeamAttributes: TeamAttributesType;
  readonly Regionals?: (RegionalType | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Team = LazyLoading extends LazyLoadingDisabled ? EagerTeam : LazyTeam

export declare const Team: (new (init: ModelInit<Team>) => Team) & {
  copyOf(source: Team, mutator: (draft: MutableModel<Team>) => MutableModel<Team> | void): Team;
}