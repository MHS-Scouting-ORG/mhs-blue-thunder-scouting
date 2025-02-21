import React, { useEffect, useState } from 'react'

function NotesModal(props) { 
    const visible = props.visible
    const offFunction = props.closeModal
    const notes = props.notes
    const teamNum = props.teamNum
    const teamName = props.teamName
    
    return (
        <div className="modal" style={{ display: visible ? "block" : "none" }}>
            <div style={{fontSize: "40px", backgroundColor: "white", padding: "20px"}}>
                <h1>{teamNum}</h1>
                <h2>{teamName}</h2>
            </div>
            <div style={{fontSize: "30px", backgroundColor: "white", padding: "20px"}}>
                <p>{notes}</p>
            </div>
            <button 
            style={{
                border: "none",
                fontSize: "50px",
                padding: "30px",
                borderRadius: "6px",
                margin: "7px",
                background:" #77B6E2",
                fontWeight: "bold",
            }} 
            onClick={() => offFunction()}> Close</button>
        </div>
    )
}

export default NotesModal;