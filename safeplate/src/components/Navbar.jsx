import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl gap-2">
          <span className="text-2xl">🍃</span>
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
      <div className="navbar-end">
        <Link to="/resources" className="btn btn-sm btn-primary bg-sage border-sage hover:bg-sage/90">
          Talk to Someone Now
        </Link>
      </div>
    </div>
  )
}
