import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MoodSlider from '../components/MoodSlider'
import EnergySlider from '../components/EnergySlider'
import AlertBanner from '../components/AlertBanner'
import Modal from '../components/Modal'
import { analyzeJournal, saveJournalEntry, getJournalEntries, getJournalPatterns } from '../utils/api'
import { CRISIS_KEYWORDS, CRISIS_RESOURCES } from '../utils/constants'

const DEFAULT_MOOD = 3
const DEFAULT_ENERGY = 3
const MOOD_ICONS = ['', '😞', '😟', '😐', '🙂', '😊']
const ENERGY_ICONS = ['', '🪫', '🔋', '🔋', '🔋', '⚡']

export default function Journal() {
  const navigate = useNavigate()
  const mealFieldRef = useRef(null)
  const [meal, setMeal] = useState('')
  const [mood, setMood] = useState(DEFAULT_MOOD)
  const [energy, setEnergy] = useState(DEFAULT_ENERGY)
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [riskData, setRiskData] = useState(null)
  const [patternAlert, setPatternAlert] = useState(null)
  const [crisisModalOpen, setCrisisModalOpen] = useState(false)
  const [saveToastOpen, setSaveToastOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [showAllEntries, setShowAllEntries] = useState(false)

  const loadEntries = async () => {
    try {
      const data = await getJournalEntries()
      setEntries(data.entries || [])
    } catch (err) {
      console.error('Failed to load entries:', err)
    }
  }

  const loadPatterns = async () => {
    try {
      const data = await getJournalPatterns()
      if (data.shouldAlert && data.concerningPatterns?.length > 0) {
        setPatternAlert(data)
      }
    } catch (err) {
      console.error('Failed to load patterns:', err)
    }
  }

  useEffect(() => {
    loadEntries()
    loadPatterns()
  }, [])

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  const isBusy = loading || saving

  const hasChanges = useMemo(() => {
    return meal.trim().length > 0 || notes.trim().length > 0 || mood !== DEFAULT_MOOD || energy !== DEFAULT_ENERGY
  }, [meal, notes, mood, energy])

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [entries])

  const recentEntries = useMemo(() => {
    if (showAllEntries) {
      return sortedEntries
    }
    return sortedEntries.slice(0, 3)
  }, [sortedEntries, showAllEntries])

  const thisWeekStats = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(now.getDate() - now.getDay())

    const weekEntries = sortedEntries.filter((entry) => {
      if (!entry.created_at) {
        return false
      }
      const createdAt = new Date(entry.created_at)
      return !Number.isNaN(createdAt.getTime()) && createdAt >= weekStart
    })

    const totalMood = weekEntries.reduce((sum, entry) => sum + (entry.mood_rating || 0), 0)
    const totalEnergy = weekEntries.reduce((sum, entry) => sum + (entry.energy_level || 0), 0)

    return {
      count: weekEntries.length,
      avgMood: weekEntries.length ? (totalMood / weekEntries.length).toFixed(1) : '—',
      avgEnergy: weekEntries.length ? (totalEnergy / weekEntries.length).toFixed(1) : '—',
    }
  }, [entries])

  const formatEntryDateTime = (dateString) => {
    if (!dateString) {
      return 'Unknown date'
    }

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return 'Unknown date'
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const checkCrisisKeywords = (text) => {
    const lower = text.toLowerCase()
    return CRISIS_KEYWORDS.some(kw => lower.includes(kw))
  }

  const handleSubmit = async () => {
    const combinedText = `${meal} ${notes}`.trim()

    if (!hasChanges || isBusy) {
      return
    }

    if (checkCrisisKeywords(combinedText)) {
      setCrisisModalOpen(true)
      return
    }

    setLoading(true)
    setRiskData(null)
    setErrorMessage('')

    try {
      const result = await analyzeJournal({ meal, mood, energy, notes })
      setRiskData(result)

      if (result.riskLevel === 'critical') {
        setLoading(false)
        return
      }

      if (result.riskLevel === 'safe') {
        await handleSave(result)
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      setRiskData({
        riskLevel: 'safe',
        explanation: 'Unable to review this entry right now. It can still be saved.',
      })
      await handleSave({ riskLevel: 'safe', detectedFlags: [], explanation: '' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (riskDataToUse = riskData) => {
    if (isBusy) {
      return
    }

    setSaving(true)
    setErrorMessage('')

    try {
      await saveJournalEntry({
        meal,
        mood,
        energy,
        notes,
        riskData: riskDataToUse || riskData,
      })

      setMeal('')
      setNotes('')
      setMood(DEFAULT_MOOD)
      setEnergy(DEFAULT_ENERGY)
      setRiskData(null)

      await Promise.all([loadEntries(), loadPatterns()])

      setSaveToastOpen(true)
      setTimeout(() => setSaveToastOpen(false), 2200)
    } catch (err) {
      console.error('Save failed:', err)
      setErrorMessage('Could not save. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleTalkToSomeone = () => {
    navigate('/resources')
  }

  const focusMealField = () => {
    mealFieldRef.current?.focus()
    mealFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="max-w-[var(--sp-journal-max-width)] mx-auto px-4 md:px-6 pt-8 pb-16">
      <div className="mb-6 md:mb-7 rounded-[var(--sp-journal-card-radius)] bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 p-[1.375rem] md:p-[1.65rem]">
        <h1 className="text-[3rem] md:text-[3.45rem] leading-[1.12] font-bold text-base-content">Journal</h1>
        <p className="text-[1.25rem] md:text-[1.375rem] leading-[1.5] text-base-content/85 mt-3">Take one calm minute to check in with yourself today.</p>
      </div>

      {patternAlert && (
        <div className="alert alert-info mb-6">
          <div>
            <h3 className="font-bold">We've noticed some concerning patterns</h3>
            <p className="text-sm">You're not alone. {patternAlert.concerningPatterns?.join(' ')}</p>
            <button
              onClick={() => navigate('/resources')}
              className="btn btn-sm btn-primary mt-2"
            >
              View Resources
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        <section className="card min-w-0 rounded-[var(--sp-journal-card-radius)] bg-base-100 border border-primary/25 shadow-sm">
          <div className="card-body p-[var(--sp-journal-card-padding)] gap-6">
            <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-5">
              <div>
                <h2 className="text-[1.5rem] leading-[1.25] font-bold text-base-content">Today&apos;s check in</h2>
                <p className="text-[1.05rem] leading-[1.45] text-base-content/75 mt-1">About 1 minute</p>
              </div>
              <span className="badge badge-outline text-[1.05rem] font-semibold text-base-content px-3.5 py-3 min-h-[2.5rem]">{todayLabel}</span>
            </div>

            <fieldset disabled={isBusy} className="space-y-6 md:space-y-[1.25rem]">
              <div className="form-control">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <label htmlFor="meal" className="label-text text-[1.15rem] md:text-[1.2rem] font-semibold text-base-content">Meal</label>
                  <span className="text-[0.99rem] text-base-content/80">Optional</span>
                </div>
                <textarea
                  id="meal"
                  ref={mealFieldRef}
                  className="textarea textarea-bordered rounded-[var(--sp-journal-card-radius)] min-h-[6.875rem] w-full text-[var(--sp-journal-control-text)] leading-[1.5] py-[var(--sp-journal-control-pad-y)] px-[var(--sp-journal-control-pad-x)] border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Example. Had oatmeal. Felt steady after"
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                />
                <p className="text-[0.99rem] text-base-content/80 mt-2">Optional. Write what you ate or how it felt.</p>
                {meal.length > 0 && (
                  <p className="text-[0.99rem] text-base-content/75 mt-1">{meal.length} characters</p>
                )}
              </div>

              <MoodSlider value={mood} onChange={setMood} disabled={isBusy} />
              <EnergySlider value={energy} onChange={setEnergy} disabled={isBusy} />

              <div className="form-control">
                <label htmlFor="notes" className="label pb-2">
                  <span className="label-text text-[1.15rem] md:text-[1.2rem] font-semibold text-base-content">Personal notes</span>
                </label>
                <textarea
                  id="notes"
                  className="textarea textarea-bordered rounded-[var(--sp-journal-card-radius)] min-h-[8.25rem] w-full text-[var(--sp-journal-control-text)] leading-[1.5] py-[var(--sp-journal-control-pad-y)] px-[var(--sp-journal-control-pad-x)] border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Example. Felt anxious in the morning, better after a walk"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                {notes.length > 0 && (
                  <p className="text-[0.99rem] text-base-content/75 mt-1">{notes.length} characters</p>
                )}
              </div>
            </fieldset>

            {riskData && riskData.riskLevel !== 'safe' && (
              <AlertBanner
                type={riskData.riskLevel}
                message={riskData.explanation}
                supportMessage={riskData.supportMessage}
                onTalkToSomeone={handleTalkToSomeone}
              />
            )}

            {riskData?.riskLevel === 'concerning' && (
              <button
                onClick={() => handleSave()}
                className="btn btn-outline btn-primary btn-lg w-full"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Anyway'}
              </button>
            )}

            <button
              onClick={handleSubmit}
              className="btn btn-primary w-full h-[3.75rem] md:h-[3.85rem] text-[1.15rem] md:text-[1.2rem] font-semibold px-7 hover:brightness-105 active:translate-y-[1px] disabled:opacity-60"
              disabled={isBusy || (riskData?.riskLevel === 'critical') || !hasChanges}
            >
              {isBusy ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving…
                </>
              ) : (
                'Save Entry'
              )}
            </button>

            {errorMessage && (
              <p className="text-[1.05rem] text-error mt-2">{errorMessage}</p>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 card min-w-0 rounded-[var(--sp-journal-card-radius)] bg-base-100 border border-primary/25 shadow-sm">
          <div className="card-body p-[var(--sp-journal-card-padding)] gap-5">
            <div className="flex items-center justify-between border-b border-base-300 pb-5">
              <h2 className="text-[1.5rem] leading-[1.25] font-bold text-base-content">Your Journal</h2>
              <span className="badge badge-outline text-[0.99rem] font-medium px-3.5 py-3 min-h-[2.5rem]">This week {thisWeekStats.count}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-[0.99rem] text-base-content/80 border-b border-base-300 pb-5">
              <div>
                <p className="font-semibold text-[1.32rem] leading-[1.2] text-base-content">{thisWeekStats.count}</p>
                <p>Entries</p>
              </div>
              <div>
                <p className="font-semibold text-[1.32rem] leading-[1.2] text-base-content">{thisWeekStats.avgMood}</p>
                <p>Mood avg</p>
              </div>
              <div>
                <p className="font-semibold text-[1.32rem] leading-[1.2] text-base-content">{thisWeekStats.avgEnergy}</p>
                <p>Energy avg</p>
              </div>
            </div>

            {entries.length === 0 ? (
              <div className="rounded-[var(--sp-journal-card-radius)] border-2 border-dashed border-primary/35 bg-base-200 p-[1.65rem] text-center">
                <div className="text-4xl mb-3" aria-hidden="true">🌾</div>
                <p className="text-[1.2rem] font-semibold text-base-content mb-1">No entries yet</p>
                <p className="text-[1.05rem] text-base-content/85 mb-2">
                  Your entries will appear here so you can notice patterns over time.
                </p>
                <p className="text-[1.05rem] text-base-content/85">Save an entry to see patterns here.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {recentEntries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="w-full text-left rounded-[var(--sp-journal-card-radius)] border border-base-300 bg-base-200 p-[1.1rem] hover:bg-base-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.94rem] font-medium text-base-content/80">{formatEntryDateTime(entry.created_at)}</span>
                        <div className="flex items-center gap-2 text-[1.2rem]">
                          <span aria-hidden="true">{MOOD_ICONS[entry.mood_rating] || '😐'}</span>
                          <span aria-hidden="true">{ENERGY_ICONS[entry.energy_level] || '🔋'}</span>
                        </div>
                      </div>
                      <p className="text-[1.05rem] text-base-content mt-2 line-clamp-1">
                        {entry.personal_notes || entry.meal_description || 'No notes for this entry.'}
                      </p>
                    </button>
                  ))}
                </div>
                {sortedEntries.length > 3 && (
                  <button
                    onClick={() => setShowAllEntries((current) => !current)}
                    className="link link-primary text-[1.05rem] mt-2 self-start"
                  >
                    {showAllEntries ? 'Show fewer entries' : 'View all entries'}
                  </button>
                )}
              </>
            )}
          </div>
        </aside>
      </div>

      {saveToastOpen && (
        <div className="toast toast-end toast-bottom z-[70]">
          <div className="alert alert-success shadow-lg">
            <span>Saved</span>
          </div>
        </div>
      )}

      <Modal
        isOpen={crisisModalOpen}
        onClose={() => setCrisisModalOpen(false)}
        title="We're concerned. Please talk to someone now."
      >
        <div className="space-y-4">
          <p>Your safety matters. These resources are available 24/7:</p>
          <div className="flex flex-col gap-2">
            <a href={CRISIS_RESOURCES.neda.tel} className="btn btn-primary">
              NEDA: {CRISIS_RESOURCES.neda.phone}
            </a>
            <a href={CRISIS_RESOURCES.crisisText.sms} className="btn btn-outline">
              Text NEDA to 741741
            </a>
            <a href={CRISIS_RESOURCES.suicideLifeline.tel} className="btn btn-outline">
              988 Suicide & Crisis Lifeline
            </a>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title="Entry details"
      >
        {selectedEntry && (
          <div className="space-y-3">
            <p className="text-sm text-base-content/75">{formatEntryDateTime(selectedEntry.created_at)}</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-ghost">
                {MOOD_ICONS[selectedEntry.mood_rating] || '😐'} Mood {selectedEntry.mood_rating}/5
              </span>
              <span className="badge badge-ghost">
                {ENERGY_ICONS[selectedEntry.energy_level] || '🔋'} Energy {selectedEntry.energy_level}/5
              </span>
            </div>
            {selectedEntry.meal_description && (
              <div>
                <p className="text-sm font-semibold">Meal</p>
                <p className="text-sm text-base-content/85">{selectedEntry.meal_description}</p>
              </div>
            )}
            {selectedEntry.personal_notes && (
              <div>
                <p className="text-sm font-semibold">Notes</p>
                <p className="text-sm text-base-content/85">{selectedEntry.personal_notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
