// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const AutoStratOpts = {
  "WENT_MID": "WentMid",
  "SCORED": "Scored",
  "CROSSED_MID": "CrossedMid",
  "NONE": "None"
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

const StratOpts = {
  "HOARDING": "Hoarding",
  "DEFENSE": "Defense",
  "OFFENSIVE": "Offensive",
  "SUPPORT": "Support",
  "NONE": "None"
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

const { Team, AutonomousType, PenaltyOpts, TeleType, PenaltyType, RobotInfoType, TeamMatchesType, TeamAttributesType } = initSchema(schema);

export {
  Team,
  AutoStratOpts,
  AutoHangOpts,
  HangOpts,
  SpeedOpts,
  StratOpts,
  HangTeamworkOpts,
  CapabilitiesOpts,
  AutonomousType,
  PenaltyOpts,
  TeleType,
  PenaltyType,
  RobotInfoType,
  TeamMatchesType,
  TeamAttributesType
};