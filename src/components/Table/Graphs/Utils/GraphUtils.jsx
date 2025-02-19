const getStat = (team, phase, accessor, apiData) => {
    const teamMatches = apiData.filter(x => x.Team === team)

    const totalPts = teamMatches.map((match) => {
        return match.TotalPoints 
    })

    /* Tele */

    /* Amount Scored */

    const teleCoralL1 = teamMatches.map((match) => {
        return match.Teleop.AmountScored.CoralL1
    })

    const teleCoralL1Missed = teamMatches.map((match) => {
        return match.Teleop.AmountScored.CoralL1Missed
    })

    const teleCoralL2 = teamMatches.map((match) => {
        return match.Teleop.AmountScored.CoralL2
    })

    const teleCoralL2Missed = teamMatches.map((match) => {
        return match.Teleop.AmountScored.CoralL2Missed
    })

    const teleCoralL3 = teamMatches.map((match) => {
        return match.Teleop.AmountScored.CoralL3
    })

    const teleCoralL3Missed = teamMatches.map((match) => {
        return match.Teleop.AmountScored.CoralL3Missed
    })

    const teleCoralL4 = teamMatches.map((match) => {
        return match.Teleop.AmountScored.CoralL4
    })

    const teleCoralL4Missed = teamMatches.map((match) => {
        return match.Teleop.AmountScored.CoralL4Missed
    })

    const teleProcessor = teamMatches.map((match) => {
        return match.Teleop.AmountScored.Processor
    })

    const teleProcessorMissed = teamMatches.map((match) => {
        return match.Teleop.AmountScored.ProcessorMissed
    })

    const teleNet = teamMatches.map((match) => {
        return match.Teleop.AmountScored.Net
    })

    const teleNetMissed = teamMatches.map((match) => {
        return match.Teleop.AmountScored.NetMissed
    })

    const teleCycles = teamMatches.map((match) => {
        return match.Teleop.AmountScored.Cycles
    })

    /* Points */

    const telePoints = teamMatches.map((match) => {
        return match.Teleop.PointsScored.Points
    })

    const teleAlgaePoints = teamMatches.map((match) => {
        return match.Teleop.PointsScored.AlgaePoints
    })

    const teleCoralPoints = teamMatches.map((match) => {
        return match.Teleop.PointsScored.CoralPoints
    })

    const teleEndgamePoints = teamMatches.map((match) => {
        return match.Teleop.PointsScored.EndgamePoints
    })

    /* Human Player */

    const teleHuman = teamMatches.map((match) => {
        return match.Teleop.HumPlrScoring.Made
    })

    const teleHumanMissed = teamMatches.map((match) => {
        return match.Teleop.HumPlrScoring.Missed
    })

    /* Auto */
    /* Amount Scored */

    const autoCoralL1 = teamMatches.map((match) => {
        return match.Autonomous.AmountScored.CoralL1
    })

    const autoCoralL2 = teamMatches.map((match) => {
        return match.Autonomous.AmountScored.CoralL2
    })

    const autoCoralL3 = teamMatches.map((match) => {
        return match.Autonomous.AmountScored.CoralL3
    })

    const autoCoralL4 = teamMatches.map((match) => {
        return match.Autonomous.AmountScored.CoralL4
    })

    const autoProcessor = teamMatches.map((match) => {
        return match.Autonomous.AmountScored.Processor
    })

    const autoNet = teamMatches.map((match) => {
        return match.Autonomous.AmountScored.Net
    })

    /* Points Scored */

    const autoPoints = teamMatches.map((match) => {
        return match.Autonomous.PointsScored.AlgaePoints
    })

    const autoAlgaePoints = teamMatches.map((match) => {
        return match.Autonomous.PointsScored.AlgaePoints
    })

    const autoCoralPoints = teamMatches.map((match) => {
        return match.Autonomous.PointsScored.CoralPoints
    })

    /* AutoStart */

    const autoStart = teamMatches.map((match) => {
        return match.Autonomous.StartingPosition
    })

    /* Penalties */

    const majorFouls = teamMatches.map((match) => {
        return match.Penalties.Tech
    })

    const minorFouls = teamMatches.map((match) => {
        return match.Penalties.Fouls
    })

    return (
        phase === "total" ? 
            totalPts
        :
        phase === "tele" ?
                /* Tele Amount */
            accessor === "CoralL1" ? 
                teleCoralL1
            :
            accessor === "CoralL1Missed" ? 
                teleCoralL1Missed
            :
            accessor === "CoralL2" ? 
                teleCoralL2
            :
            accessor === "CoralL2Missed" ? 
                teleCoralL2Missed
            :
            accessor === "CoralL3" ? 
                teleCoralL3
            :
            accessor === "CoralL3Missed" ? 
                teleCoralL3Missed
            :
            accessor === "CoralL4" ? 
                teleCoralL4
            :
            accessor === "CoralL4Missed" ? 
                teleCoralL4Missed
            :
            accessor === "Processor" ? 
                teleProcessor
            :
            accessor === "ProcessorMissed" ? 
                teleProcessorMissed
            :
            accessor === "Net" ? 
                teleNet
            :
            accessor === "NetMissed" ? 
                teleNetMissed
            :
            accessor === "Cycles" ? 
                teleCycles
            :
                /* Tele Points */
            accessor === "Points" ? 
                telePoints
            :
            accessor === "AlgaePoints" ? 
                teleAlgaePoints
            :
            accessor === "CoralPoints" ? 
                teleCoralPoints
            :
            accessor === "Endgame" ? 
                teleEndgamePoints
            :
                /* Human */
            accessor === "Human" ? 
                teleHuman
            :
            accessor === "HumanMissed" ? 
                teleHumanMissed
            : 
            null//console.log("fail tele")
        :
        phase === "auto" ? 
                /* Auto */
                /* Auto Amount */
            accessor === "CoralL1" ? 
                autoCoralL1
            :
            accessor === "CoralL2" ? 
                autoCoralL2
            :
            accessor === "CoralL3" ? 
                autoCoralL3
            :
            accessor === "CoralL4" ? 
                autoCoralL4
            :
            accessor === "Processor" ? 
                autoProcessor
            :
            accessor === "Net" ? 
                autoNet
            :
            accessor === "Start" ? 
                autoStart
            :
                /* Auto Points */
            accessor === "Points" ? 
                autoPoints
            :
            accessor === "AlgaePoints" ? 
                autoAlgaePoints
            :
            accessor === "CoralPoints" ? 
                autoCoralPoints
            :
            console.log("fail auto")
        :
        phase === "fouls" ? 
            
            accessor === "MajorFouls" ? 
                majorFouls
            :
            accessor === "MinorFouls" ? 
                minorFouls
            :
            console.log("penalty fail")
        :
        null//console.log("fail")
    )
}

const getBubbleStat = (taData, ac) => {
    let tData = taData[0]
    return (
        ac === "AvgPoints" ?
        tData.AvgPoints
        :
        ac === "AvgAutoPts" ?
        tData.AvgAutoPts
        :
        ac === "AvgEndgamePts" ?
        tData.AvgEndgamePts
        :
        ac === "AvgCoralPts" ?
        tData.AvgCoralPts
        :
        ac === "AvgAlgaePts" ?
        tData.AvgAlgaePts
        :
        ac === "AvgCycles" ?
        tData.AvgCycles
        :
        ac === "AvgCoral" ?
        tData.AvgCoral
        :
        ac === "AvgAlgae" ?
        tData.AvgAlgae
        :
        ac === "AvgMissedCoralL1" ?
        tData.AvgMissedCoralL1
        :
        ac === "AvgMissedCoralL12" ?
        tData.AvgMissedCoralL2
        :
        ac === "AvgMissedCoralL3" ?
        tData.AvgMissedCoralL3
        :
        ac === "AvgMissedCoralL4" ?
        tData.AvgMissedCoralL3
        :
        ac === "AvgMissedCoral" ?
        tData.AvgMoisedCoral
        :
        ac === "AvgMissedProcessor" ?
        tData.AvgMissedProcessor
        :
        ac === "AvgMissedNet" ?
        tData.AvgMissedNet
        :
        ac === "AvgMissedAlgae" ?
        tData.AvgMissedAlgae
        :
        ac === "CoralL1Acc" ?
        tData.CoralL1Acc
        :
        ac === "CoralL2Acc" ?
        tData.CoralL2Acc
        :
        ac === "CoralL3Acc" ?
        tData.CoralL3Acc
        :
        ac === "CoralL4Acc" ?
        tData.CoralL4Acc
        :
        ac === "CoralAcc" ?
        tData.CoralAcc
        :
        ac === "ProcessorAcc" ?
        tData.ProcessorAcc
        :
        ac === "NetAcc" ?
        tData.NetAcc
        :
        ac === "Fouls" ?
        tData.Fouls
        :
        ac === "Tech" ?
        tData.Tech
        :
        null//console.log("fail")
    )
}




export {getStat, getBubbleStat}

