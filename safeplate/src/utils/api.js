import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

export const analyzeJournal = async (data) => {
  const res = await api.post('/journal/analyze', data)
  return res.data
}

export const saveJournalEntry = async (data) => {
  const res = await api.post('/journal/save', data)
  return res.data
}

export const getJournalEntries = async (limit = 50, offset = 0) => {
  const res = await api.get(`/journal/entries?limit=${limit}&offset=${offset}`)
  return res.data
}

export const getJournalPatterns = async () => {
  const res = await api.get('/journal/patterns')
  return res.data
}

export const saveTrustedContact = async (data) => {
  const res = await api.post('/settings/trusted-contact', data)
  return res.data
}

export const getSettings = async () => {
  const res = await api.get('/settings')
  return res.data
}

export const sendAlert = async () => {
  const res = await api.post('/alerts/send')
  return res.data
}

export const exportData = async () => {
  const res = await api.get('/data/export')
  return res.data
}

export const deleteAllData = async () => {
  const res = await api.delete('/data/delete')
  return res.data
}
