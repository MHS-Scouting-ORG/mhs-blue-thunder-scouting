import React from "react";

class EndGame extends React.Component {
    constructor(props) {
        super(props)
        this.changeEndGame = this.changeEndGame.bind(this);
        this.makeEndGameMiscElements = this.makeEndGameMiscElements.bind(this);
        this.state = {
            changeEndGameUsed: props.value,
        }
    }

    changeEndGame(event) {
        this.props.changeEndGameUsed(event);
        this.setState({ changeEndGameUsed: event.value })
    }

    makeEndGameMiscElements() {
        return (
            this.props.makeEndGameMiscElements(this.state.changeEndGameUsed)
        )
    }

    render() {
        return (
            <div>
                <label> {"⛓️End Game: "}
                    <select onChange={this.changeEndGame}>
                        <option value={this.props.value}> {this.props.value} </option>
                        <option value='Onstage'>Onstage</option>
                        <option value='Attempted'>Attempted</option>
                        <option value='None'>None</option>
                    </select>
                </label>
            </div>
        )
    }
}

export default EndGame;