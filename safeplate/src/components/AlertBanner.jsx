import { CRISIS_RESOURCES } from '../utils/constants'

export default function AlertBanner({ type, message, supportMessage, onTalkToSomeone }) {
  const isCritical = type === 'critical'
  const isConcerning = type === 'concerning'

  return (
    <div className={`alert ${isCritical ? 'alert-error' : 'alert-warning'} mb-4`}>
      <div className="flex-1">
        <h3 className="font-bold">
          {isCritical ? '⚠️ We\'re concerned about your safety' : '💛 Take a moment'}
        </h3>
        <p className="text-sm mt-1">{message}</p>
        {supportMessage && (
          <p className="text-sm mt-2 italic border-l-4 border-base-content/20 pl-3">
            {supportMessage}
          </p>
        )}
        {isCritical && (
          <div className="mt-4 space-y-2">
            <p className="font-medium text-sm">Immediate support:</p>
            <div className="flex flex-wrap gap-2">
              <a href={CRISIS_RESOURCES.neda.tel} className="btn btn-sm btn-outline">
                NEDA: {CRISIS_RESOURCES.neda.phone}
              </a>
              <a href={CRISIS_RESOURCES.crisisText.sms} className="btn btn-sm btn-outline">
                Text NEDA to 741741
              </a>
              <a href={CRISIS_RESOURCES.suicideLifeline.tel} className="btn btn-sm btn-outline">
                988 Lifeline
              </a>
            </div>
          </div>
        )}
        {onTalkToSomeone && (isConcerning || isCritical) && (
          <button
            onClick={onTalkToSomeone}
            className="btn btn-primary btn-sm mt-3"
          >
            Would you like to talk to someone?
          </button>
        )}
      </div>
    </div>
  )
}
