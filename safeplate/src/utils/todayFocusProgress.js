const STORAGE_KEY = 'safeplate.todayFocusProgress.v1'
const TRACKED_STEPS = ['meal', 'checkin']

const getLocalDateKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getEmptyProgress = (dateKey) => ({
  date: dateKey,
  steps: {
    meal: false,
    checkin: false,
  },
})

const readStoredProgress = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) {
      return null
    }

    const parsed = JSON.parse(rawValue)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    return parsed
  } catch (error) {
    return null
  }
}

const writeProgress = (progress) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export const getTodayFocusProgress = () => {
  const dateKey = getLocalDateKey()
  const stored = readStoredProgress()

  if (!stored || stored.date !== dateKey) {
    return getEmptyProgress(dateKey)
  }

  return {
    date: dateKey,
    steps: {
      meal: Boolean(stored.steps?.meal),
      checkin: Boolean(stored.steps?.checkin),
    },
  }
}

export const markTodayFocusStep = (stepName) => {
  if (!TRACKED_STEPS.includes(stepName)) {
    return getTodayFocusProgress()
  }

  const currentProgress = getTodayFocusProgress()
  if (currentProgress.steps[stepName]) {
    return currentProgress
  }

  const nextProgress = {
    ...currentProgress,
    steps: {
      ...currentProgress.steps,
      [stepName]: true,
    },
  }

  writeProgress(nextProgress)
  return nextProgress
}
