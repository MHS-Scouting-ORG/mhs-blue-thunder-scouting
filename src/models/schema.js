export const schema = {
    "models": {
        "Team": {
            "name": "Team",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Comment": {
                    "name": "Comment",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "TeamAttributes": {
                    "name": "TeamAttributes",
                    "isArray": false,
                    "type": {
                        "nonModel": "TeamAttributesType"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "Regionals": {
                    "name": "Regionals",
                    "isArray": true,
                    "type": {
                        "nonModel": "RegionalType"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Teams",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "fields": [
                            "id"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "provider": "iam",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "AutoStratOpts": {
            "name": "AutoStratOpts",
            "values": [
                "WentMid",
                "Scored",
                "CrossedMid",
                "None"
            ]
        },
        "AutoHangOpts": {
            "name": "AutoHangOpts",
            "values": [
                "Level1",
                "None"
            ]
        },
        "HangOpts": {
            "name": "HangOpts",
            "values": [
                "Level3",
                "Level2",
                "Level1",
                "None"
            ]
        },
        "SpeedOpts": {
            "name": "SpeedOpts",
            "values": [
                "None",
                "Slow",
                "Average",
                "Fast"
            ]
        },
        "StratOpts": {
            "name": "StratOpts",
            "values": [
                "Hoarding",
                "Defense",
                "Offensive",
                "Support",
                "None"
            ]
        },
        "HangTeamworkOpts": {
            "name": "HangTeamworkOpts",
            "values": [
                "DoubleHang",
                "TripleHang",
                "None"
            ]
        },
        "CapabilitiesOpts": {
            "name": "CapabilitiesOpts",
            "values": [
                "Bump",
                "Trench",
                "None"
            ]
        }
    },
    "nonModels": {
        "AutonomousType": {
            "name": "AutonomousType",
            "fields": {
                "AutoStrat": {
                    "name": "AutoStrat",
                    "isArray": false,
                    "type": {
                        "enum": "AutoStratOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "TravelMid": {
                    "name": "TravelMid",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "AutoHang": {
                    "name": "AutoHang",
                    "isArray": false,
                    "type": {
                        "enum": "AutoHangOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "PenaltyOpts": {
            "name": "PenaltyOpts",
            "fields": {
                "YellowCard": {
                    "name": "YellowCard",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "RedCard": {
                    "name": "RedCard",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "Disabled": {
                    "name": "Disabled",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "DQ": {
                    "name": "DQ",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "Broken": {
                    "name": "Broken",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "NoShow": {
                    "name": "NoShow",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "TeleType": {
            "name": "TeleType",
            "fields": {
                "TravelMid": {
                    "name": "TravelMid",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "Endgame": {
                    "name": "Endgame",
                    "isArray": false,
                    "type": {
                        "enum": "HangOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "PenaltyType": {
            "name": "PenaltyType",
            "fields": {
                "Fouls": {
                    "name": "Fouls",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "Tech": {
                    "name": "Tech",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "PenaltiesCommitted": {
                    "name": "PenaltiesCommitted",
                    "isArray": false,
                    "type": {
                        "nonModel": "PenaltyOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "FoulDesc": {
                    "name": "FoulDesc",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "RobotInfoType": {
            "name": "RobotInfoType",
            "fields": {
                "RobotSpeed": {
                    "name": "RobotSpeed",
                    "isArray": false,
                    "type": {
                        "enum": "SpeedOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "ShooterSpeed": {
                    "name": "ShooterSpeed",
                    "isArray": false,
                    "type": {
                        "enum": "SpeedOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "FuelCapacity": {
                    "name": "FuelCapacity",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "BallsShot": {
                    "name": "BallsShot",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "ShootingCycles": {
                    "name": "ShootingCycles",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "WhatBrokeDesc": {
                    "name": "WhatBrokeDesc",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Comments": {
                    "name": "Comments",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "TeamMatchesType": {
            "name": "TeamMatchesType",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Team": {
                    "name": "Team",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "MatchId": {
                    "name": "MatchId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Autonomous": {
                    "name": "Autonomous",
                    "isArray": false,
                    "type": {
                        "nonModel": "AutonomousType"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "Teleop": {
                    "name": "Teleop",
                    "isArray": false,
                    "type": {
                        "nonModel": "TeleType"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "ActiveStrat": {
                    "name": "ActiveStrat",
                    "isArray": true,
                    "type": {
                        "enum": "StratOpts"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "InactiveStrat": {
                    "name": "InactiveStrat",
                    "isArray": true,
                    "type": {
                        "enum": "StratOpts"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "RobotInfo": {
                    "name": "RobotInfo",
                    "isArray": false,
                    "type": {
                        "nonModel": "RobotInfoType"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "Penalties": {
                    "name": "Penalties",
                    "isArray": false,
                    "type": {
                        "nonModel": "PenaltyType"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "TeamAttributesType": {
            "name": "TeamAttributesType",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Regional": {
                    "name": "Regional",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "DeclaredFuelCap": {
                    "name": "DeclaredFuelCap",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "CyclesPerMatch": {
                    "name": "CyclesPerMatch",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "FuelPerCycle": {
                    "name": "FuelPerCycle",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "NumAutos": {
                    "name": "NumAutos",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "Capabilities": {
                    "name": "Capabilities",
                    "isArray": false,
                    "type": {
                        "enum": "CapabilitiesOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "MaxHang": {
                    "name": "MaxHang",
                    "isArray": false,
                    "type": {
                        "enum": "HangOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "HangTeamwork": {
                    "name": "HangTeamwork",
                    "isArray": false,
                    "type": {
                        "enum": "HangTeamworkOpts"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "HangTime": {
                    "name": "HangTime",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "Photo": {
                    "name": "Photo",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "Notes": {
                    "name": "Notes",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "RegionalType": {
            "name": "RegionalType",
            "fields": {
                "RegionalId": {
                    "name": "RegionalId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "TeamMatches": {
                    "name": "TeamMatches",
                    "isArray": true,
                    "type": {
                        "nonModel": "TeamMatchesType"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                }
            }
        }
    },
    "codegenVersion": "3.4.4",
    "version": "0977a4d055a0baf2ca29b047324f2bca"
};