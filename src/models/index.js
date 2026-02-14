// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const AutoStratOpts = {
  "WENT_MID": "WentMid",
  "SCORED": "Scored",
  "CROSSED_MID": "CrossedMid"
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

const TeleStratOpts = {
  "BASIC": "Basic"
};

const SpeedOpts = {
  "NONE": "None",
  "SLOW": "Slow",
  "AVERAGE": "Average",
  "FAST": "Fast"
};

const ActiveStratOpts = {
  "HOARDING": "Hoarding",
  "DEFENSE": "Defense",
  "OFFENSIVE": "Offensive",
  "SUPPORT": "Support"
};

const InactiveStratOpts = {
  "HOARDING": "Hoarding",
  "DEFENSE": "Defense",
  "OFFENSIVE": "Offensive",
  "SUPPORT": "Support"
};

const HangTeamworkOpts = {
  "DOUBLE_HANG": "DoubleHang",
  "TRIPLE_HANG": "TripleHang"
};

const CapabilitiesOpts = {
  "BUMP": "Bump",
  "TRENCH": "Trench"
};

const { Team, AutonomousType, PenaltyOpts, TeleType, PenaltyType, RobotInfoType, TeamMatchesType, TeamAttributesType } = initSchema(schema);

export {
  Team,
  AutoStratOpts,
  AutoHangOpts,
  HangOpts,
  TeleStratOpts,
  SpeedOpts,
  ActiveStratOpts,
  InactiveStratOpts,
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