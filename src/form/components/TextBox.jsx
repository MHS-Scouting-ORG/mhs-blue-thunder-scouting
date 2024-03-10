import React from "react";

function TextBox(props) {
    function commentState(event) {
        props.changeState(event.target.value)
    }

    return props.displayOn ?
        (
            <div>
                <p>{props.title}</p>
                <p>{props.description}</p>
                <textarea onChange={commentState} row="4" cols='50' value={props.value} />
            </div>
        ) : (
            <div></div>
        )

}

export default TextBox;