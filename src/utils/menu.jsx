import React from 'react'
import { Link } from 'react-router-dom'
import linkStyles from './menu.module.css'

const TABLE_NOTES_ALLOWED_EMAILS = [
    'toby.naumov@gmail.com',
    'shdwberu@gmail.com',
    'dn1guiwa@gmail.com',
    'jhmaui2@gmail.com',
]

const SCOUTER_MANAGEMENT_ALLOWED_EMAILS = [
    'toby.naumov@gmail.com',
    'shdwberu@gmail.com',
    'dn1guiwa@gmail.com',

]

function Menu({ user }) {
    const email = user?.tokens?.idToken?.payload?.email?.toLowerCase?.() || ''
    const canViewTableAndNotes = TABLE_NOTES_ALLOWED_EMAILS.includes(email)
    const canManageScouters = SCOUTER_MANAGEMENT_ALLOWED_EMAILS.includes(email)

    return (
        <section className="top-nav">
            <input id="menu-toggle" type="checkbox" />
            <label className='menu-button-container' htmlFor="menu-toggle">
                <div className='menu-button'></div>
            </label>
            <ul className="menu">
                <li><Link className={linkStyles.Link} to="/">HOME</Link></li>
                <li><Link className={linkStyles.Link} to="/form">FORM</Link></li>
                {canViewTableAndNotes && <li><Link className={linkStyles.Link} to="/table">TABLE</Link></li>}
                {canViewTableAndNotes && <li><Link className={linkStyles.Link} to="/notes">NOTES</Link></li>}
                {canManageScouters && <li><Link className={linkStyles.Link} to="/scouters">SCOUTERS</Link></li>}
                <li><Link className={linkStyles.Link} to="/my-matches">MY MATCHES</Link></li>

            </ul>
        </section>
    )
}

export default Menu
