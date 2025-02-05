import React from 'react'
import { Link } from 'react-router-dom'
import linkStyles from './menu.module.css'
function Menu() {
    return (
        <section className="top-nav">
            <input id="menu-toggle" type="checkbox" />
            <label className='menu-button-container' htmlFor="menu-toggle">
                <div className='menu-button'></div>
            </label>
            <ul className="menu">
                <li className={linkStyles.LogoContainer}>2443 SCOUTING</li>
                <li><Link className={linkStyles.Link} to="/table">oldTABLE</Link></li>
                <li><Link className={linkStyles.Link} to="/form">oldFORM</Link></li>
                <li><Link className={linkStyles.Link} to="/formprac">protFORM</Link></li>
                <li><Link className={linkStyles.Link} to="/tableprot">protTABLE</Link></li>
            </ul>
        </section>
    )
}

export default Menu