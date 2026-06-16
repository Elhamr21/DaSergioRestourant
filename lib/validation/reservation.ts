import { z } from 'zod'

import { openingHours } from '@/lib/data'

const DEFAULT_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
  '00:00', '00:30', '01:00',
]

const OPENING_HOURS_PATTERN = /(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/
const SLOT_INTERVAL_MINUTES = 30

function dateToLocalIso(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours * 60) + minutes
}

function toTimeString(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function buildTimeSlots() {
  const slots = new Set<string>()

  for (const { hours } of openingHours) {
    const match = hours.match(OPENING_HOURS_PATTERN)
    if (!match) {
      continue
    }

    const [, opensAt, closesAt] = match
    let startMinutes = toMinutes(opensAt)
    let endMinutes = toMinutes(closesAt)

    // Handle past-midnight closing (e.g. 09:00 - 01:00)
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60
    }

    for (
      let currentMinutes = startMinutes;
      currentMinutes <= endMinutes;
      currentMinutes += SLOT_INTERVAL_MINUTES
    ) {
      slots.add(toTimeString(currentMinutes % (24 * 60)))
    }
  }

  if (slots.size === 0) return DEFAULT_TIME_SLOTS

  // Sort with past-midnight times at the end
  const sorted = [...slots].sort((a, b) => {
    const aMin = toMinutes(a)
    const bMin = toMinutes(b)
    const opensMin = toMinutes([...slots][0] || '09:00')
    const aAdj = aMin < opensMin ? aMin + 24 * 60 : aMin
    const bAdj = bMin < opensMin ? bMin + 24 * 60 : bMin
    return aAdj - bAdj
  })
  return sorted
}

export const TIME_SLOTS = buildTimeSlots()

const todayStr = () => dateToLocalIso(new Date())

function roundUpToNextSlot(totalMinutes: number) {
  return Math.ceil(totalMinutes / SLOT_INTERVAL_MINUTES) * SLOT_INTERVAL_MINUTES
}

export function getAvailableTimeSlots(date: string, now = new Date()) {
  if (date !== dateToLocalIso(now)) {
    return TIME_SLOTS
  }

  const currentMinutes = (now.getHours() * 60) + now.getMinutes()
  const nextAvailableMinutes = roundUpToNextSlot(currentMinutes)

  return TIME_SLOTS.filter((time) => toMinutes(time) >= nextAvailableMinutes)
}

export const reservationSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z.string().trim().min(4, 'Bitte geben Sie eine Telefonnummer ein'),
  date: z.string().refine((d) => d >= todayStr(), 'Datum muss heute oder in der Zukunft liegen'),
  time: z.string().refine((time) => TIME_SLOTS.includes(time), 'Bitte wählen Sie eine gültige Uhrzeit'),
  guests: z.coerce.number().int().min(1, 'Mindestens 1 Person'),
  message: z.string().optional().default(''),
}).superRefine((reservation, context) => {
  if (!getAvailableTimeSlots(reservation.date).includes(reservation.time)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['time'],
      message: reservation.date === todayStr()
        ? 'Bitte wählen Sie eine Uhrzeit innerhalb der aktuellen Oeffnungszeiten'
        : 'Bitte wählen Sie eine gültige Uhrzeit',
    })
  }
})

export type ReservationInput = z.infer<typeof reservationSchema>
