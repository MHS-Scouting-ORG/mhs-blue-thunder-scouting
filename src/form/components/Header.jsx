import React from "react";

function Headers(props) {
    return (
        <div>
            <p style={{
                fontSize: '20px'
            }}>{"Ranking Points: " + props.display}</p>
        </div>
    )
}

export default Headers;