import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MoodSlider from '../components/MoodSlider'
import EnergySlider from '../components/EnergySlider'
import JournalEntryCard from '../components/JournalEntryCard'
import AlertBanner from '../components/AlertBanner'
import Modal from '../components/Modal'
import { analyzeJournal, saveJournalEntry, getJournalEntries, getJournalPatterns } from '../utils/api'
import { CRISIS_KEYWORDS, CRISIS_RESOURCES } from '../utils/constants'

export default function Journal() {
  const navigate = useNavigate()
  const [meal, setMeal] = useState('')
  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [riskData, setRiskData] = useState(null)
  const [patternAlert, setPatternAlert] = useState(null)
  const [crisisModalOpen, setCrisisModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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

  const checkCrisisKeywords = (text) => {
    const lower = text.toLowerCase()
    return CRISIS_KEYWORDS.some(kw => lower.includes(kw))
  }

  const handleSubmit = async () => {
    const combinedText = `${meal} ${notes}`.trim()
    
    if (checkCrisisKeywords(combinedText)) {
      setCrisisModalOpen(true)
      return
    }

    setLoading(true)
    setRiskData(null)
    setSuccessMessage('')

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
    setSaving(true)
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
      setMood(3)
      setEnergy(3)
      setRiskData(null)
      setSuccessMessage('Entry saved.')
      loadEntries()
      loadPatterns()
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Save failed:', err)
      setSuccessMessage('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleTalkToSomeone = () => {
    navigate('/resources')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-base-content mb-6">How are you feeling today?</h1>

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

      <div className="card bg-base-100 border border-base-200 mb-8">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Meal (optional)</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Optional - describe what you ate or how mealtime went"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
            />
          </div>

          <MoodSlider value={mood} onChange={setMood} />
          <EnergySlider value={energy} onChange={setEnergy} />

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Personal notes</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="How are you doing? Any wins or struggles?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

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
              className="btn btn-outline btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Anyway'}
            </button>
          )}

          {successMessage && (
            <div className="alert alert-success">
              <span>{successMessage}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || (riskData?.riskLevel === 'critical')}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Checking...
              </>
            ) : (
              'Save Entry'
            )}
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Your Journal</h2>
      <div className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-base-content/70">No entries yet. Start by logging how you're feeling.</p>
        ) : (
          entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>

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
    </div>
  )
}
