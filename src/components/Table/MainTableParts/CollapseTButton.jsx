import React from 'react'

class CollapseTButton extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className = "collapseTButton">
                <button onClick={() => this.props.toggleFunction()}> {this.props.label} </button>
            </div>
        )
    }
}

export default CollapseTButton