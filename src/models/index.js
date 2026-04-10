// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const AutoStratOpts = {
  "MOVED_IN_AUTO": "MovedInAuto",
  "SCORED_IN_GOAL": "ScoredInGoal",
  "NOTHING": "Nothing"
};

const AutoHangOpts = {
  "LEVEL1": "Level1",
  "NONE": "None"
};

const HangOpts = {
  "LEVEL3": "Level3",
  "LEVEL2": "Level2",
  "LEVEL1": "Level1",
  "NONE": "None"
};

const SpeedOpts = {
  "NONE": "None",
  "SLOW": "Slow",
  "AVERAGE": "Average",
  "FAST": "Fast"
};

const DriverSkillOpts = {
  "POOR": "Poor",
  "AVERAGE": "Average",
  "GOOD": "Good",
  "EXCELLENT": "Excellent"
};

const DefenseEffectivenessOpts = {
  "VERY_POOR": "VeryPoor",
  "POOR": "Poor",
  "AVERAGE": "Average",
  "GOOD": "Good",
  "EXCELLENT": "Excellent"
};

const StratOpts = {
  "HOARDING": "Hoarding",
  "DEFENSE": "Defense",
  "AGGRESSIVE": "Aggressive",
  "SUPPORT": "Support",
  "SHOOTING": "Shooting",
  "NONE": "None"
};

const MatchResultOpts = {
  "WIN": "Win",
  "LOSE": "Lose",
  "TIE": "Tie"
};

const TeamImpactOpts = {
  "HIGH": "High",
  "MEDIUM": "Medium",
  "LOW": "Low"
};

const MatchTypeOpts = {
  "Q": "q",
  "SF": "sf",
  "F": "f",
  "P": "p"
};

const HangTeamworkOpts = {
  "DOUBLE_HANG": "DoubleHang",
  "TRIPLE_HANG": "TripleHang",
  "NONE": "None"
};

const CapabilitiesOpts = {
  "BUMP": "Bump",
  "TRENCH": "Trench",
  "NONE": "None"
};

const ShooterTypeOpts = {
  "TURRET": "Turret",
  "STATIC": "Static"
};

const { Team, AutonomousType, PenaltyOpts, TeleType, PenaltyType, RobotInfoType, TeamMatchesType, TeamAttributesType, RegionalType } = initSchema(schema);

export {
  Team,
  AutoStratOpts,
  AutoHangOpts,
  HangOpts,
  SpeedOpts,
  DriverSkillOpts,
  DefenseEffectivenessOpts,
  StratOpts,
  MatchResultOpts,
  TeamImpactOpts,
  MatchTypeOpts,
  HangTeamworkOpts,
  CapabilitiesOpts,
  ShooterTypeOpts,
  AutonomousType,
  PenaltyOpts,
  TeleType,
  PenaltyType,
  RobotInfoType,
  TeamMatchesType,
  TeamAttributesType,
  RegionalType
};