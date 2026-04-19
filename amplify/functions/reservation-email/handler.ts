import type { DynamoDBStreamEvent } from 'aws-lambda'
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({})
const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@da-sergio-restaurant.de'
const FROM_NAME = process.env.SES_FROM_NAME || 'Da Sergio Restaurant'
const ADMIN_EMAILS = parseEmailList(process.env.SES_ADMIN_EMAILS || 'info@da-sergio-restaurant.de')
const COPY_EMAILS = parseEmailList(process.env.RESERVATION_COPY_EMAIL || '')
const ADMIN_RECIPIENTS = uniqueEmails([...ADMIN_EMAILS, ...COPY_EMAILS])
const CLIENT_REPLY_TO_EMAIL = ADMIN_EMAILS[0] || FROM_EMAIL

type ReservationDetails = {
  reference: string
  id?: string
  status?: string
  name: string
  email: string
  phone?: string
  date: string
  time: string
  guests: string
  message?: string
  createdAt?: string
  updatedAt?: string
}

function parseEmailList(value: string): string[] {
  return value
    .split(/[,\s;]+/)
    .map(email => email.trim())
    .filter(Boolean)
}

function uniqueEmails(emails: string[]): string[] {
  const seen = new Set<string>()
  const unique: string[] = []

  for (const email of emails) {
    const key = emailKey(email)
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(email)
  }

  return unique
}

function emailKey(email: string): string {
  return email.trim().toLowerCase()
}

function cleanHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

function formatAddress(email: string, name?: string): string {
  const cleanEmail = cleanHeaderValue(email)
  const cleanName = name ? cleanHeaderValue(name) : ''

  if (!cleanName) return cleanEmail

  return `"${cleanName.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}" <${cleanEmail}>`
}

function stableMessageKey(...parts: string[]): string {
  const key = parts
    .filter(Boolean)
    .join('-')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  return key.slice(0, 180) || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function sanitize(s?: string | null): string {
  return (s ?? '').replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

function isEmailLike(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function adminRecipientsFor(clientEmail?: string): string[] {
  const clientKey = clientEmail ? emailKey(clientEmail) : ''

  return ADMIN_RECIPIENTS.filter(email => isEmailLike(email) && emailKey(email) !== clientKey)
}

function getReservationReference(id?: string): string {
  if (!id) return `REF-${Date.now()}`
  return `REF-${id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase()}`
}

function statusLabel(status?: string): string {
  if (status === 'CONFIRMED') return 'Bestätigt'
  if (status === 'REJECTED') return 'Abgelehnt'
  return 'Ausstehend'
}

function reservationDetailsHtml(details: ReservationDetails): string {
  return `<ul style="padding-left: 18px; margin: 16px 0;">
    <li><b>Referenz:</b> ${sanitize(details.reference)}</li>
    <li><b>Name:</b> ${sanitize(details.name)}</li>
    <li><b>E-Mail:</b> ${sanitize(details.email)}</li>
    ${details.phone ? `<li><b>Telefon:</b> ${sanitize(details.phone)}</li>` : ''}
    <li><b>Datum:</b> ${sanitize(details.date)}</li>
    <li><b>Uhrzeit:</b> ${sanitize(details.time)}</li>
    <li><b>Personen:</b> ${sanitize(details.guests)}</li>
    ${details.message ? `<li><b>Nachricht:</b> ${sanitize(details.message)}</li>` : ''}
  </ul>`
}

function reservationDetailsTableHtml(details: ReservationDetails): string {
  const rows = [
    ['Referenz', details.reference],
    ['Reservierungs-ID', details.id || '-'],
    ['Status', statusLabel(details.status)],
    ['Name', details.name],
    ['E-Mail', details.email],
    ['Telefon', details.phone || '-'],
    ['Datum', details.date],
    ['Uhrzeit', details.time],
    ['Personen', details.guests],
    ['Nachricht', details.message || '-'],
    ['Erstellt', details.createdAt || '-'],
    ['Aktualisiert', details.updatedAt || '-'],
  ]

  const body = rows.map(([label, value], index) => {
    const background = index % 2 === 0 ? ' style="background: #f5f5f5;"' : ''

    return `<tr${background}>
      <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">${sanitize(label)}</td>
      <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top;">${sanitize(value)}</td>
    </tr>`
  }).join('')

  return `<table style="border-collapse: collapse; width: 100%; max-width: 620px; margin: 16px 0;">${body}</table>`
}

function buildRawEmail(options: {
  fromEmail: string
  fromName: string
  to: string[]
  subject: string
  htmlBody: string
  replyTo?: string
  messageKey: string
}): string {
  const boundary = `----=_Part_${Date.now()}`
  const messageKey = stableMessageKey(options.messageKey)
  const headers = [
    `From: ${formatAddress(options.fromEmail, options.fromName)}`,
    `To: ${options.to.map(email => formatAddress(email)).join(', ')}`,
    `Subject: =?UTF-8?B?${Buffer.from(cleanHeaderValue(options.subject)).toString('base64')}?=`,
    `MIME-Version: 1.0`,
    `X-Entity-Ref-ID: ${messageKey}`,
    `Message-ID: <${messageKey}@da-sergio-restaurant.de>`,
    `Auto-Submitted: auto-generated`,
    options.replyTo ? `Reply-To: ${formatAddress(options.replyTo)}` : '',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean).join('\r\n')

  return `${headers}\r\n\r\n--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${Buffer.from(options.htmlBody).toString('base64')}\r\n--${boundary}--`
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function emailErrorMessage(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`
  return String(err)
}

function isRetryableEmailError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false

  const error = err as { $retryable?: unknown; name?: string; message?: string }
  const text = `${error.name ?? ''} ${error.message ?? ''}`.toLowerCase()

  return Boolean(error.$retryable)
    || text.includes('throttl')
    || text.includes('maximum sending rate')
    || text.includes('timeout')
    || text.includes('temporarily')
}

async function sendSingleEmail(to: string | string[], subject: string, body: string, replyTo?: string, messageKey?: string): Promise<boolean> {
  const recipients = uniqueEmails(Array.isArray(to) ? to : [to]).filter(isEmailLike)
  if (!recipients.length) {
    console.error('No valid email recipients for subject:', subject)
    return false
  }

  const maxAttempts = 3
  const stableKey = stableMessageKey(messageKey || subject, recipients.join('-'))

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const rawEmail = buildRawEmail({
        fromEmail: FROM_EMAIL,
        fromName: FROM_NAME,
        to: recipients,
        subject,
        htmlBody: body,
        replyTo,
        messageKey: stableKey,
      })

      await ses.send(new SendRawEmailCommand({
        Destinations: recipients,
        RawMessage: { Data: Buffer.from(rawEmail) },
      }))
      console.info('Email sent successfully:', JSON.stringify({ to: recipients, subject, attempt, messageKey: stableKey }))
      return true
    } catch (err) {
      const retryable = isRetryableEmailError(err)
      console.error('Email send failed:', JSON.stringify({
        to: recipients,
        subject,
        attempt,
        retryable,
        error: emailErrorMessage(err),
      }))

      if (!retryable || attempt === maxAttempts) return false
      await wait(attempt * 1000)
    }
  }

  return false
}

async function sendToClient(clientEmail: string, subject: string, body: string, messageKey: string): Promise<void> {
  const sent = await sendSingleEmail(clientEmail, subject, body, CLIENT_REPLY_TO_EMAIL, messageKey)
  if (sent) {
    console.info('Client email sent to:', clientEmail)
  } else {
    console.error('Failed to send client email to:', clientEmail)
  }
}

async function sendToAdmin(subject: string, body: string, replyTo: string | undefined, messageKey: string, clientEmail?: string): Promise<void> {
  const recipients = adminRecipientsFor(clientEmail)

  if (!recipients.length) {
    console.info('No admin recipients after excluding the client email for subject:', subject)
    return
  }

  const sent = await sendSingleEmail(recipients, subject, body, replyTo, messageKey)
  if (sent) {
    console.info('Admin email sent to:', recipients.join(', '))
  } else {
    console.error('Failed to send admin email to:', recipients.join(', '))
  }
}

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    const newImg = record.dynamodb?.NewImage
    const oldImg = record.dynamodb?.OldImage
    if (!newImg) continue

    const reservationId = newImg.id?.S
    const email = newImg.email?.S?.trim()
    if (!email) continue

    const reservationReference = getReservationReference(reservationId)
    const details: ReservationDetails = {
      reference: reservationReference,
      id: reservationId,
      status: newImg.status?.S,
      name: newImg.name?.S ?? '',
      email,
      phone: newImg.phone?.S ?? '',
      date: newImg.date?.S ?? '',
      time: newImg.time?.S ?? '',
      guests: newImg.guests?.N ?? '',
      message: newImg.message?.S ?? '',
      createdAt: newImg.createdAt?.S,
      updatedAt: newImg.updatedAt?.S,
    }

    const reservationDetails = reservationDetailsHtml(details)
    const adminDetails = reservationDetailsTableHtml(details)
    const clientReplyTo = isEmailLike(email) ? email : undefined

    if (record.eventName === 'INSERT') {
      const adminSubject = `[${reservationReference}] Neue Reservierung: ${details.name} - ${details.date} ${details.time} (${details.guests} Pers.)`
      const adminBody = `<h2>Neue Reservierungsanfrage</h2>
        <p>Alle Angaben aus der Anfrage:</p>
        ${adminDetails}`

      await sendToAdmin(adminSubject, adminBody, clientReplyTo, stableMessageKey(reservationReference, 'admin-new-reservation'), email)

      const clientBody = `<h2>Vielen Dank, ${sanitize(details.name)}!</h2>
        <p>Wir haben Ihre Anfrage erhalten:</p>
        ${reservationDetails}
        <p>Wir melden uns in Kürze.</p>`

      await sendToClient(email, `[${reservationReference}] Ihre Reservierungsanfrage bei Da Sergio`, clientBody, stableMessageKey(reservationReference, 'client-request-received'))
    }

    if (record.eventName === 'MODIFY' && newImg.status?.S !== oldImg?.status?.S) {
      if (newImg.status?.S === 'CONFIRMED') {
        const confirmationSubject = `[${reservationReference}] Reservierung bestätigt - ${details.date} ${details.time}`
        const adminBody = `<h2>Reservierung bestätigt</h2>
          <p>Alle Angaben zur bestätigten Reservierung:</p>
          ${adminDetails}`
        const clientBody = `<h2>Reservierung bestätigt!</h2>
          <p>Liebe/r ${sanitize(details.name)},</p>
          <p>Ihre Reservierung ist bestätigt.</p>
          ${reservationDetails}
          <p>Wir freuen uns auf Sie!</p>`

        await sendToAdmin(`[${reservationReference}] Reservierung bestätigt: ${details.name}`, adminBody, clientReplyTo, stableMessageKey(reservationReference, 'admin-confirmed'), email)
        await sendToClient(email, confirmationSubject, clientBody, stableMessageKey(reservationReference, 'client-confirmed'))
      } else if (newImg.status?.S === 'REJECTED') {
        const rejectionSubject = `[${reservationReference}] Reservierung abgelehnt - ${details.date} ${details.time}`
        const adminBody = `<h2>Reservierung abgelehnt</h2>
          <p>Alle Angaben zur abgelehnten Reservierung:</p>
          ${adminDetails}`
        const clientBody = `<h2>Reservierung abgelehnt</h2>
          <p>Liebe/r ${sanitize(details.name)},</p>
          <p>Leider können wir Ihre Anfrage am ${sanitize(details.date)} um ${sanitize(details.time)} nicht bestätigen.</p>
          <p>Bitte kontaktieren Sie uns telefonisch für Alternativen.</p>`

        await sendToAdmin(`[${reservationReference}] Reservierung abgelehnt: ${details.name}`, adminBody, clientReplyTo, stableMessageKey(reservationReference, 'admin-rejected'), email)
        await sendToClient(email, rejectionSubject, clientBody, stableMessageKey(reservationReference, 'client-rejected'))
      }
    }
  }
}
