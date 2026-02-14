const MOOD_EMOJIS = ['', '😞', '😟', '😐', '🙂', '😊']

export default function JournalEntryCard({ entry }) {
  const date = new Date(entry.created_at)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const riskIndicator = entry.risk_level === 'critical' ? (
    <span className="badge badge-error badge-sm">●</span>
  ) : entry.risk_level === 'concerning' ? (
    <span className="badge badge-warning badge-sm">●</span>
  ) : null

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <span className="text-sm text-base-content/70">{formattedDate}</span>
          {riskIndicator}
        </div>
        {entry.meal_description && (
          <p className="text-base mt-2">{entry.meal_description}</p>
        )}
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className="badge badge-ghost">
            {MOOD_EMOJIS[entry.mood_rating]} Mood: {entry.mood_rating}/5
          </span>
          <span className="badge badge-ghost">
            🔋 Energy: {entry.energy_level}/5
          </span>
        </div>
        {entry.personal_notes && (
          <p className="text-sm mt-2 text-base-content/80">{entry.personal_notes}</p>
        )}
      </div>
    </div>
  )
}
