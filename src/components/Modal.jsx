import React from 'react';
import Form from '../form/Form';

class Modal extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const formProps = { regional : this.props.regional }
        if(this.props.data)
            formProps.matchData =  this.props.data[0]
        return (
            <div className="modal" style={{ display: this.props.onOff ? "block" : "none" }}>
                {(() => { 
                    if(this.props.onOff)
                        return <Form {...formProps}></Form> 
                })()}
                <button onClick={() => this.props.offFunction()}> FINISH EDIT </button>
            </div>
        )
    }
}

export default Modal;