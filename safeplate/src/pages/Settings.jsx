import { useState, useEffect, useMemo } from 'react'
import { saveTrustedContact, getSettings, exportData, deleteAllData } from '../utils/api'
import Modal from '../components/Modal'

function SettingsLayout({ children }) {
  return (
    <div className="max-w-[var(--sp-settings-max-width)] mx-auto px-4 md:px-6 pt-8 pb-16">
      {children}
    </div>
  )
}

function SettingsCard({ title, children, className = '' }) {
  return (
    <section className={`card min-w-0 rounded-[var(--sp-settings-card-radius)] bg-base-100 border border-primary/25 shadow-sm ${className}`}>
      <div className="card-body p-[var(--sp-settings-card-padding)] gap-5">
        <h2 className="text-[1.35rem] md:text-[1.4rem] leading-[1.25] font-bold text-base-content">{title}</h2>
        {children}
      </div>
    </section>
  )
}

function FieldGroup({ id, label, helperText, errorText, children }) {
  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="block text-[1rem] md:text-[1.06rem] font-medium text-base-content">
        {label}
      </label>
      {children}
      <p className={`text-[0.92rem] leading-[1.5] ${errorText ? 'text-error' : 'text-base-content/80'}`}>
        {errorText || helperText}
      </p>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <div className="space-y-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="w-full rounded-[14px] border border-base-300 bg-base-200 px-4 py-3 flex items-center justify-between gap-4 text-left transition-colors hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55"
      >
        <span className="text-[1rem] md:text-[1.05rem] font-medium text-base-content">Automated alerts for severe concerns</span>
        <span
          aria-hidden="true"
          className={`relative inline-flex h-11 w-20 shrink-0 items-center rounded-full border transition-colors ${checked ? 'bg-primary border-primary/70' : 'bg-base-300 border-base-300'}`}
        >
          <span
            className={`absolute h-9 w-9 rounded-full bg-base-100 border border-base-300 shadow-sm transition-transform ${checked ? 'translate-x-10' : 'translate-x-1'}`}
          />
        </span>
      </button>
      <p className="text-[0.92rem] leading-[1.5] text-base-content/80">
        When enabled, SafePlate can notify your trusted contact if serious patterns are detected.
      </p>
    </div>
  )
}

function DangerModal({
  isOpen,
  onClose,
  confirmText,
  setConfirmText,
  onConfirm,
  loading,
}) {
  const canDelete = confirmText.trim().toUpperCase() === 'DELETE' && !loading

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete all data?"
    >
      <div className="space-y-4">
        <p className="text-[1rem] text-base-content/90 leading-[1.5]">
          This permanently deletes your journal entries and settings from your account.
        </p>
        <div className="space-y-2">
          <label htmlFor="delete-confirm" className="block text-[0.98rem] font-medium text-base-content">
            Type DELETE to confirm
          </label>
          <input
            id="delete-confirm"
            type="text"
            className="sp-settings-input"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder="DELETE"
          />
        </div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canDelete}
          className="btn btn-error w-full h-12 md:h-14 text-[1rem] md:text-[1.05rem] font-semibold"
        >
          {loading ? 'Deleting…' : 'Delete Everything'}
        </button>
      </div>
    </Modal>
  )
}

export default function Settings() {
  const [firstName, setFirstName] = useState('')
  const [trustedEmail, setTrustedEmail] = useState('')
  const [trustedName, setTrustedName] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [initialSettings, setInitialSettings] = useState({
    firstName: '',
    trustedEmail: '',
    trustedName: '',
    alertsEnabled: true,
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [toast, setToast] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getSettings()
      if (data) {
        const nextSettings = {
          firstName: data.first_name || '',
          trustedEmail: data.trusted_contact_email || '',
          trustedName: data.trusted_contact_name || '',
          alertsEnabled: data.alerts_enabled !== false,
        }
        setFirstName(nextSettings.firstName)
        setTrustedEmail(nextSettings.trustedEmail)
        setTrustedName(nextSettings.trustedName)
        setAlertsEnabled(nextSettings.alertsEnabled)
        setInitialSettings(nextSettings)
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSaveContact = async (e) => {
    e.preventDefault()
    setLoading(true)
    setToast({ type: '', message: '' })
    try {
      await saveTrustedContact({
        first_name: firstName,
        email: trustedEmail,
        name: trustedName,
        alertsEnabled,
      })
      setInitialSettings({ firstName, trustedEmail, trustedName, alertsEnabled })
      setToast({ type: 'success', message: 'Saved' })
      setTimeout(() => setToast({ type: '', message: '' }), 2500)
    } catch (err) {
      setToast({ type: 'error', message: 'Could not save' })
      setTimeout(() => setToast({ type: '', message: '' }), 2800)
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
      setDeleting(true)
      await deleteAllData()
      setDeleteConfirmText('')
      setDeleteModalOpen(false)
      window.location.reload()
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(false)
    }
  }

  const handleReset = () => {
    setFirstName(initialSettings.firstName)
    setTrustedEmail(initialSettings.trustedEmail)
    setTrustedName(initialSettings.trustedName)
    setAlertsEnabled(initialSettings.alertsEnabled)
  }

  const hasChanges = useMemo(() => {
    return (
      firstName !== initialSettings.firstName ||
      trustedEmail !== initialSettings.trustedEmail ||
      trustedName !== initialSettings.trustedName ||
      alertsEnabled !== initialSettings.alertsEnabled
    )
  }, [firstName, trustedEmail, trustedName, alertsEnabled, initialSettings])

  const trustedEmailError = useMemo(() => {
    if (!trustedEmail.trim()) {
      return ''
    }
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trustedEmail)
    return validEmail ? '' : 'Enter a valid email address.'
  }, [trustedEmail])

  return (
    <SettingsLayout>
      <div className="mb-6 md:mb-7 rounded-[var(--sp-settings-card-radius)] bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 p-[1.35rem] md:p-[1.65rem]">
        <h1 className="text-[2.8rem] md:text-[3.2rem] leading-[1.12] font-bold text-base-content">Settings</h1>
        <p className="text-[1.15rem] md:text-[1.25rem] leading-[1.5] text-base-content/85 mt-3">
          Manage your profile, trusted contact, and data controls in one calm, private space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        <form onSubmit={handleSaveContact} className="space-y-5 min-w-0">
          <SettingsCard title="Profile">
            <FieldGroup
              id="first-name"
              label="First name"
              helperText="Used for personalization in your journal experience."
            >
              <input
                id="first-name"
                type="text"
                className="sp-settings-input"
                placeholder="Your first name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </FieldGroup>
          </SettingsCard>

          <SettingsCard title="Trusted Contact">
            <p className="text-[0.95rem] md:text-[1rem] leading-[1.55] text-base-content/85">
              Add a trusted person who can receive private alerts when serious patterns are detected.<br />
              We never share your journal content.
            </p>

            <div className="space-y-5">
              <FieldGroup
                id="trusted-name"
                label="Contact name"
                helperText="Example: Mom, Dr. Smith, or a close friend"
              >
                <input
                  id="trusted-name"
                  type="text"
                  className="sp-settings-input"
                  placeholder="Contact name"
                  value={trustedName}
                  onChange={(event) => setTrustedName(event.target.value)}
                />
              </FieldGroup>

              <FieldGroup
                id="trusted-email"
                label="Contact email"
                helperText="We only use this email for trusted safety alerts."
                errorText={trustedEmailError}
              >
                <input
                  id="trusted-email"
                  type="email"
                  className={`sp-settings-input ${trustedEmailError ? 'border-error/65 focus:ring-error/40 focus:border-error/75' : ''}`}
                  placeholder="trusted@example.com"
                  value={trustedEmail}
                  onChange={(event) => setTrustedEmail(event.target.value)}
                />
              </FieldGroup>

              <Toggle checked={alertsEnabled} onChange={setAlertsEnabled} />
            </div>
          </SettingsCard>

          <SettingsCard title="Save Changes">
            <div className="space-y-3">
              <button
                type="submit"
                className="btn btn-primary w-full h-14 md:h-[3.6rem] text-[1.06rem] md:text-[1.12rem] font-semibold"
                disabled={loading || !hasChanges || !!trustedEmailError}
              >
                {loading ? 'Saving…' : 'Save Settings'}
              </button>
              <button
                type="button"
                className="btn btn-outline w-full h-12 md:h-[3.2rem] text-[1rem]"
                onClick={handleReset}
                disabled={!hasChanges || loading}
              >
                Reset changes
              </button>
            </div>
          </SettingsCard>
        </form>

        <div className="space-y-5 min-w-0">
          <SettingsCard title="Your Data" className="lg:sticky lg:top-24">
            <p className="text-[0.95rem] md:text-[1rem] text-base-content/85 leading-[1.55]">
              Export includes your journal entries and current settings.
            </p>
            <button
              type="button"
              onClick={handleExport}
              className="btn btn-outline w-full h-12 md:h-14 text-[1rem] md:text-[1.06rem] focus-visible:ring-2 focus-visible:ring-primary/55"
            >
              Export My Data
            </button>

            <div className="border-t border-base-300 pt-4 space-y-3">
              <p className="text-[0.95rem] md:text-[1rem] text-base-content/85 leading-[1.55]">
                Delete permanently removes all journal entries and settings from your account.
              </p>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="btn btn-outline btn-error w-full h-12 md:h-14 text-[1rem] md:text-[1.06rem] focus-visible:ring-2 focus-visible:ring-error/45"
              >
                Delete All Data
              </button>
            </div>
          </SettingsCard>
        </div>
      </div>

      {toast.message && (
        <div className="toast toast-end toast-bottom z-[70]">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <DangerModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false)
            setDeleteConfirmText('')
          }
        }}
        confirmText={deleteConfirmText}
        setConfirmText={setDeleteConfirmText}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </SettingsLayout>
  )
}
