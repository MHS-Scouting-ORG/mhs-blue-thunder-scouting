import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import linkStyles from './menu.module.css'
import { isTableNotesAllowed } from './tableNotesPermissions'

function Menu({ user }) {
    const canViewTableAndNotes = isTableNotesAllowed(user)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!menuRef.current) return
            if (!menuRef.current.contains(event.target)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [])

    const closeMenu = () => setIsMenuOpen(false)

    return (
        <section className="top-nav" ref={menuRef}>
            <input
                id="menu-toggle"
                type="checkbox"
                checked={isMenuOpen}
                onChange={(event) => setIsMenuOpen(event.target.checked)}
            />
            <label className='menu-button-container' htmlFor="menu-toggle">
                <div className='menu-button'></div>
            </label>
            <ul className="menu">
                <li><Link className={linkStyles.Link} to="/" onClick={closeMenu}>HOME</Link></li>
                <li><Link className={linkStyles.Link} to="/form" onClick={closeMenu}>FORM</Link></li>
                {canViewTableAndNotes && <li><Link className={linkStyles.Link} to="/table" onClick={closeMenu}>TABLE</Link></li>}
                {canViewTableAndNotes && <li><Link className={linkStyles.Link} to="/notes" onClick={closeMenu}>NOTES</Link></li>}

            </ul>
        </section>
    )
}

export default Menu