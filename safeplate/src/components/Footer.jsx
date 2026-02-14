import { CRISIS_RESOURCES } from '../utils/constants'

export default function Footer() {
  return (
    <footer className="footer footer-center p-6 bg-base-200 text-base-content">
      <div className="max-w-2xl">
        <p className="text-sm text-base-content/80 mb-2">
          <strong>Disclaimer:</strong> SafePlate is not a substitute for professional medical care. 
          If you are in crisis, please contact emergency services or a crisis hotline.
        </p>
        <p className="text-sm font-medium">
          Crisis support: <a href={CRISIS_RESOURCES.neda.tel} className="link link-primary">{CRISIS_RESOURCES.neda.phone}</a> • 
          Text <a href={CRISIS_RESOURCES.crisisText.sms} className="link link-primary">NEDA to 741741</a> • 
          <a href={CRISIS_RESOURCES.suicideLifeline.tel} className="link link-primary"> 988</a>
        </p>
      </div>
    </footer>
  )
}
