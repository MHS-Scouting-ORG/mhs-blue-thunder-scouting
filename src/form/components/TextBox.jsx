import React from "react";

function TextBox(props){
    return(
        <div>
            <p>{props.title}</p>
            <p style={{fontSize: 13}}>Specifics on defense, charge station, intake system, penalty reasons, etc.</p>
            <textarea onChange={props.commentState} row="4" cols='50'
                style={{
                    width: '60%',
                    wordWarp: 'normal',
                }} value={props.value}
            />
        </div>
    )
}

export default TextBox;