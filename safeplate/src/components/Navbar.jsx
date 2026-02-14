import { useState } from 'react'
import { Link } from 'react-router-dom'

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
      <div className="navbar bg-base-100 border-b border-base-200">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl gap-2" onClick={closeMenu}>
            SafePlate
          </Link>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <Link to="/resources" className="btn btn-sm btn-outline hidden md:flex">
            Support Resources
          </Link>
          {/* Hamburger button for mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden btn btn-ghost btn-circle"
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
          <ul className="menu gap-2">
            <li>
              <Link to="/" onClick={closeMenu} className="text-base-content">
                Home
              </Link>
            </li>
            <li>
              <Link to="/journal" onClick={closeMenu} className="text-base-content">
                Journal
              </Link>
            </li>
            <li>
              <Link to="/resources" onClick={closeMenu} className="text-base-content">
                Resources
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={closeMenu} className="text-base-content">
                Settings
              </Link>
            </li>
            <li className="divider my-2" />
            <li>
              <Link
                to="/resources"
                onClick={closeMenu}
                className="btn btn-primary btn-sm w-full"
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
