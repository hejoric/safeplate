import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <div className="navbar bg-base-100 border-b border-base-200 min-h-[4.5rem] px-2 md:px-4">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-[1.45rem] leading-none gap-2 min-h-11" onClick={closeMenu}>
            SafePlate
          </Link>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1 text-[0.98rem]">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-semibold underline underline-offset-4 min-h-11' : 'min-h-11'}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/journal" className={({ isActive }) => isActive ? 'text-primary font-semibold underline underline-offset-4 min-h-11' : 'min-h-11'}>
                Journal
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'text-primary font-semibold underline underline-offset-4 min-h-11' : 'min-h-11'}>
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <Link to="/resources" className="btn btn-outline hidden md:flex h-11 min-h-11 text-base px-4">
            Support Resources
          </Link>
          {/* Hamburger button for mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden btn btn-ghost btn-circle min-h-11 min-w-11"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-base-content"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-40"
          onClick={closeMenu}
          style={{
            animation: 'fade-in 0.3s ease-out forwards',
          }}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={`fixed top-16 right-0 bottom-0 w-64 bg-base-100 border-l border-base-200 md:hidden z-50 overflow-y-auto transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="p-4">
          <ul className="menu gap-2 text-base">
            <li>
              <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'text-primary font-semibold min-h-11' : 'text-base-content min-h-11'}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/journal" onClick={closeMenu} className={({ isActive }) => isActive ? 'text-primary font-semibold min-h-11' : 'text-base-content min-h-11'}>
                Journal
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" onClick={closeMenu} className={({ isActive }) => isActive ? 'text-primary font-semibold min-h-11' : 'text-base-content min-h-11'}>
                Settings
              </NavLink>
            </li>
            <li className="divider my-2" />
            <li>
              <Link
                to="/resources"
                onClick={closeMenu}
                className="btn btn-primary w-full h-11 min-h-11 text-base"
              >
                Support Resources
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
