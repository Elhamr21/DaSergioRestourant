'use client'

import '@/lib/amplify-configure'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import {
  Download, Search, Calendar as CalendarIcon, Table as TableIcon,
  ChevronLeft, ChevronRight, X, Check, Clock, Trash2, RotateCcw, Loader2, AlertCircle,
} from 'lucide-react'

type Reservation = Schema['Reservation']['type']
type Status = 'PENDING' | 'CONFIRMED' | 'REJECTED'

const STATUS_LABELS: Record<Status, string> = { PENDING: 'Ausstehend', CONFIRMED: 'Bestätigt', REJECTED: 'Abgelehnt' }
const STATUS_COLORS: Record<Status, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-green-500/20 text-green-400',
  REJECTED: 'bg-red-500/20 text-red-400',
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>
}

export default function AdminDashboardPage() {
  const [client] = useState(() => generateClient<Schema>())

  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'table' | 'calendar'>('table')
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [calMonth, setCalMonth] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() } })
  const [calDay, setCalDay] = useState<string | null>(null)

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await client.models.Reservation.list({ limit: 1000, authMode: 'userPool' })
      setReservations((data ?? []) as Reservation[])
    } catch (err) {
      console.error('Failed to fetch reservations', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  const filtered = useMemo(() => {
    return reservations.filter(r => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false
      if (dateFrom && r.date < dateFrom) return false
      if (dateTo && r.date > dateTo) return false
      return true
    }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
  }, [reservations, statusFilter, dateFrom, dateTo])

  async function updateStatus(id: string, status: Status, prev: Status) {
    if (status === prev) return
    try {
      await client.models.Reservation.update({ id, status }, { authMode: 'userPool' })
      setReservations(rs => rs.map(r => r.id === id ? { ...r, status } : r))
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
    } catch (err) { console.error('Update failed', err) }
  }

  async function deleteReservation(id: string) {
    if (!confirm('Reservierung wirklich löschen?')) return
    try {
      await client.models.Reservation.delete({ id }, { authMode: 'userPool' })
      setReservations(rs => rs.filter(r => r.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (err) { console.error('Delete failed', err) }
  }

  function exportCSV() {
    const header = 'ID,Name,Email,Phone,Date,Time,Guests,Status,Message,CreatedAt'
    const esc = (s?: string | null) => `"${(s ?? '').replace(/"/g, '""')}"`
    const rows = filtered.map(r =>
      [r.id, esc(r.name), esc(r.email), esc(r.phone), r.date, r.time, r.guests, r.status, esc(r.message), r.createdAt].join(',')
    )
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `reservierungen-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  // Calendar helpers
  const calDays = useMemo(() => {
    const first = new Date(calMonth.year, calMonth.month, 1)
    const startDay = (first.getDay() + 6) % 7 // Monday start
    const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate()
    const days: (number | null)[] = Array(startDay).fill(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [calMonth])

  const reservationsByDate = useMemo(() => {
    const map: Record<string, Reservation[]> = {}
    for (const r of reservations) {
      ;(map[r.date] ??= []).push(r)
    }
    return map
  }, [reservations])

  const calMonthStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}`
  const calDayReservations = calDay ? (reservationsByDate[calDay] ?? []) : []

  const inputCls = 'px-3 py-2 rounded-lg bg-deep-green-dark border border-border focus:border-gold text-foreground text-sm focus:outline-none'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-serif text-3xl font-bold text-foreground">Reservierungen</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-colors ${view === 'table' ? 'bg-gold text-deep-green' : 'text-gray-text hover:text-foreground'}`}>
            <TableIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setView('calendar')}
            className={`p-2 rounded-lg transition-colors ${view === 'calendar' ? 'bg-gold text-deep-green' : 'text-gray-text hover:text-foreground'}`}>
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-dark text-deep-green font-medium rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" />CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className={inputCls}>
          <option value="ALL">Alle Status</option>
          {(['PENDING', 'CONFIRMED', 'REJECTED'] as Status[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={inputCls} placeholder="Von" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={inputCls} placeholder="Bis" />
        {(statusFilter !== 'ALL' || dateFrom || dateTo) && (
          <button onClick={() => { setStatusFilter('ALL'); setDateFrom(''); setDateTo('') }}
            className="text-gray-text hover:text-foreground text-sm flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />Zurücksetzen
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : view === 'table' ? (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-deep-green text-gray-text">
              <tr>
                {['Name', 'E-Mail', 'Datum', 'Uhrzeit', 'Personen', 'Status', 'Aktionen'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-text">Keine Reservierungen gefunden</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="hover:bg-deep-green-dark/50 cursor-pointer transition-colors" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 text-foreground font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-text">{r.email}</td>
                  <td className="px-4 py-3 text-gray-text">{r.date}</td>
                  <td className="px-4 py-3 text-gray-text">{r.time}</td>
                  <td className="px-4 py-3 text-gray-text">{r.guests}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status as Status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button title="Bestätigen" onClick={() => updateStatus(r.id, 'CONFIRMED', r.status as Status)}
                        className="p-1.5 rounded hover:bg-green-500/20 text-green-400 transition-colors"><Check className="w-4 h-4" /></button>
                      <button title="Ablehnen" onClick={() => updateStatus(r.id, 'REJECTED', r.status as Status)}
                        className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                      <button title="Ausstehend" onClick={() => updateStatus(r.id, 'PENDING', r.status as Status)}
                        className="p-1.5 rounded hover:bg-yellow-500/20 text-yellow-400 transition-colors"><Clock className="w-4 h-4" /></button>
                      <button title="Löschen" onClick={() => deleteReservation(r.id)}
                        className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* CALENDAR VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month - 1); return { year: d.getFullYear(), month: d.getMonth() } })}
              className="p-2 text-gray-text hover:text-foreground"><ChevronLeft className="w-5 h-5" /></button>
            <h3 className="text-foreground font-semibold">
              {new Date(calMonth.year, calMonth.month).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month + 1); return { year: d.getFullYear(), month: d.getMonth() } })}
              className="p-2 text-gray-text hover:text-foreground"><ChevronRight className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
              <div key={d} className="text-center text-xs text-gray-text py-2 font-medium">{d}</div>
            ))}
            {calDays.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />
              const dateStr = `${calMonthStr}-${String(day).padStart(2, '0')}`
              const count = reservationsByDate[dateStr]?.length ?? 0
              const isSelected = calDay === dateStr
              return (
                <button key={i} onClick={() => setCalDay(isSelected ? null : dateStr)}
                  className={`relative p-3 rounded-lg text-sm transition-colors ${
                    isSelected ? 'bg-gold text-deep-green font-bold' :
                    count > 0 ? 'bg-gold/10 text-foreground hover:bg-gold/20' :
                    'text-gray-text hover:bg-deep-green-dark'
                  }`}>
                  {day}
                  {count > 0 && (
                    <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${isSelected ? 'bg-deep-green' : 'bg-gold'}`} />
                  )}
                </button>
              )
            })}
          </div>

          {calDay && (
            <div className="mt-4 space-y-2">
              <h4 className="text-foreground font-medium">{calDay} — {calDayReservations.length} Reservierung(en)</h4>
              {calDayReservations.length === 0 ? (
                <p className="text-gray-text text-sm">Keine Reservierungen an diesem Tag</p>
              ) : calDayReservations.map(r => (
                <div key={r.id} onClick={() => setSelected(r)}
                  className="flex items-center justify-between p-3 rounded-lg bg-deep-green-dark border border-border hover:border-gold/50 cursor-pointer transition-colors">
                  <div>
                    <span className="text-foreground font-medium">{r.time}</span>
                    <span className="text-gray-text ml-3">{r.name} — {r.guests} Pers.</span>
                  </div>
                  <StatusBadge status={r.status as Status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="glass rounded-2xl p-6 w-full max-w-lg space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-foreground">Reservierung</h3>
              <button onClick={() => setSelected(null)} className="text-gray-text hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {([
                ['Name', selected.name],
                ['E-Mail', selected.email],
                ['Telefon', selected.phone || '—'],
                ['Datum', selected.date],
                ['Uhrzeit', selected.time],
                ['Personen', String(selected.guests)],
                ['Erstellt', selected.createdAt ? new Date(selected.createdAt).toLocaleString('de-DE') : '—'],
              ] as [string, string][]).map(([label, val]) => (
                <div key={label}>
                  <p className="text-gray-text">{label}</p>
                  <p className="text-foreground font-medium">{val}</p>
                </div>
              ))}
            </div>

            {selected.message && (
              <div className="text-sm">
                <p className="text-gray-text">Nachricht</p>
                <p className="text-foreground">{selected.message}</p>
              </div>
            )}

            <div>
              <p className="text-gray-text text-sm mb-2">Status</p>
              <div className="flex gap-2">
                {(['PENDING', 'CONFIRMED', 'REJECTED'] as Status[]).map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s, selected.status as Status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selected.status === s ? STATUS_COLORS[s] + ' ring-1 ring-current' : 'text-gray-text hover:text-foreground bg-deep-green-dark'
                    }`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => deleteReservation(selected.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors">
              <Trash2 className="w-4 h-4" />Reservierung löschen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
