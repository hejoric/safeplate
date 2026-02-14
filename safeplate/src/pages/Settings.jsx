import { useState, useEffect } from 'react'
import { saveTrustedContact, getSettings, exportData, deleteAllData } from '../utils/api'
import Modal from '../components/Modal'

export default function Settings() {
  const [firstName, setFirstName] = useState('')
  const [trustedEmail, setTrustedEmail] = useState('')
  const [trustedName, setTrustedName] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getSettings()
      if (data) {
        setFirstName(data.first_name || '')
        setTrustedEmail(data.trusted_contact_email || '')
        setTrustedName(data.trusted_contact_name || '')
        setAlertsEnabled(data.alerts_enabled !== false)
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSaveContact = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await saveTrustedContact({
        first_name: firstName,
        email: trustedEmail,
        name: trustedName,
        alertsEnabled,
      })
      setMessage('Settings saved!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const data = await exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `safeplate-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAllData()
      setDeleteModalOpen(false)
      window.location.reload()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-base-content mb-8">Settings</h1>

      <form onSubmit={handleSaveContact} className="space-y-6">
        <div className="card bg-base-100 border border-base-200">
          <div className="card-body">
            <h2 className="card-title">Profile</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">First name (for personalization)</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200">
          <div className="card-body">
            <h2 className="card-title">Trusted Contact</h2>
            <p className="text-sm text-base-content/80 mb-4">
              Add a trusted person (therapist, parent, friend) who can receive private alerts 
              when concerning patterns are detected. We never share your journal content.
            </p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contact name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="e.g. Mom, Dr. Smith"
                value={trustedName}
                onChange={(e) => setTrustedName(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contact email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                placeholder="trusted@example.com"
                value={trustedEmail}
                onChange={(e) => setTrustedEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={alertsEnabled}
                  onChange={(e) => setAlertsEnabled(e.target.checked)}
                />
                <span className="label-text">Enable automated alerts for severe concerns</span>
              </label>
            </div>
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('saved') ? 'alert-success' : 'alert-error'}`}>
            <span>{message}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      <div className="card bg-base-100 border border-base-200 mt-8">
        <div className="card-body">
          <h2 className="card-title">Your Data</h2>
          <div className="flex gap-4">
            <button onClick={handleExport} className="btn btn-outline">
              Export My Data
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="btn btn-outline btn-error"
            >
              Delete All Data
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete All Data?"
      >
        <p className="mb-4">
          This will permanently delete all your journal entries and settings. This cannot be undone.
        </p>
        <button onClick={handleDelete} className="btn btn-error">
          Yes, Delete Everything
        </button>
      </Modal>
    </div>
  )
}
