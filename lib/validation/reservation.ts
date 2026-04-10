import { z } from 'zod'

export const TIME_SLOTS = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
] as const

const todayStr = () => new Date().toISOString().split('T')[0]

export const reservationSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z.string().optional().default(''),
  date: z.string().refine((d) => d >= todayStr(), 'Datum muss heute oder in der Zukunft liegen'),
  time: z.enum(TIME_SLOTS, { errorMap: () => ({ message: 'Bitte wählen Sie eine gültige Uhrzeit' }) }),
  guests: z.coerce.number().int().min(1, 'Mindestens 1 Person'),
  message: z.string().optional().default(''),
})

export type ReservationInput = z.infer<typeof reservationSchema>
