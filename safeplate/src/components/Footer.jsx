import { CRISIS_RESOURCES } from '../utils/constants'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-200/80 text-base-content border-t border-base-300">
      <div className="max-w-2xl">
        <p className="text-[0.9rem] md:text-[0.95rem] leading-[1.5] text-base-content/75 mb-1.5">
          SafePlate is not a substitute for professional care. If you need help now, use
          {' '}
          <Link to="/resources" className="link link-primary">Support Resources</Link>.
        </p>
        <p className="text-[0.9rem] leading-[1.5] text-base-content/70">
          Crisis support:
          {' '}
          <a href={CRISIS_RESOURCES.neda.tel} className="link link-primary">{CRISIS_RESOURCES.neda.phone}</a>
          {' '}•{' '}
          <a href={CRISIS_RESOURCES.crisisText.sms} className="link link-primary">Text NEDA to 741741</a>
          {' '}•{' '}
          <a href={CRISIS_RESOURCES.suicideLifeline.tel} className="link link-primary">988</a>
        </p>
      </div>
    </footer>
  )
}
