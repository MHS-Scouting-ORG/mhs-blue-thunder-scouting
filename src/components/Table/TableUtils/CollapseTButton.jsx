import React from 'react'
import tableStyling from '../Table.module.css';

class CollapseTButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            clicked: false,
        }
        this.collapseButtonClicked = this.collapseButtonClicked.bind(this)
    }

    collapseButtonClicked(){
        this.props.toggleFunction();
        this.setState({clicked: !this.state.clicked})
    }

    render() {
        return (
            <div className = "collapseTButton">
                {
                    this.props.type === "form" ? <button className={(this.state.clicked ? tableStyling.CollapseFButtonClicked : tableStyling.CollapseFButton)} onClick={() => this.collapseButtonClicked()}> {this.props.label} </button>
                    : <button  className={(this.state.clicked ? tableStyling.CollapseTButtonClicked : tableStyling.CollapseTButton)} onClick={() => this.collapseButtonClicked()}> {this.props.label} </button>


                }
            </div>
        )
    }
}

export default CollapseTButton