import React from 'react'
import { Link } from 'react-router-dom'
function Menu() {
    return (
        <section className="top-nav">
            <input id="menu-toggle" type="checkbox" />
            <label className='menu-button-container' htmlFor="menu-toggle">
                <div className='menu-button'></div>
            </label>
            <ul className="menu">
                <li><Link to="/table">TABLE</Link></li>
                <li><Link to="/form">FORM</Link></li>
            </ul>
        </section>
    )
}

export default Menu