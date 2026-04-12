import type { DynamoDBStreamEvent } from 'aws-lambda'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({})
const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@da-sergio-restaurant.de'
const COPY_EMAIL = process.env.RESERVATION_COPY_EMAIL || 'bdeda326@gmail.com'
const ADMIN_EMAIL = process.env.SES_ADMIN_EMAILS || 'info@da-sergio-restaurant.de'

function sanitize(s?: string | null): string {
  return (s ?? '').replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

function isEmailLike(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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

async function sendSingleEmail(to: string, subject: string, body: string, replyTo?: string): Promise<boolean> {
  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM_EMAIL,
        Destination: { ToAddresses: [to] },
        ReplyToAddresses: replyTo ? [replyTo] : undefined,
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: body } },
        },
      }))
      console.info('Email sent successfully:', JSON.stringify({ to, subject, attempt }))
      return true
    } catch (err) {
      const retryable = isRetryableEmailError(err)
      console.error('Email send failed:', JSON.stringify({
        to,
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

// Send email to client
async function sendToClient(clientEmail: string, subject: string, body: string): Promise<void> {
  const sent = await sendSingleEmail(clientEmail, subject, body)
  if (sent) {
    console.info('Client email sent to:', clientEmail)
  } else {
    console.error('Failed to send client email to:', clientEmail)
  }
}

// Send copy email to bdeda326@gmail.com
async function sendCopyEmail(subject: string, body: string, replyTo?: string): Promise<void> {
  const sent = await sendSingleEmail(COPY_EMAIL, subject, body, replyTo)
  if (sent) {
    console.info('Copy email sent to:', COPY_EMAIL)
  } else {
    console.error('Failed to send copy email to:', COPY_EMAIL)
  }
}

// Send admin notification email
async function sendToAdmin(subject: string, body: string, replyTo?: string): Promise<void> {
  const sent = await sendSingleEmail(ADMIN_EMAIL, subject, body, replyTo)
  if (sent) {
    console.info('Admin email sent to:', ADMIN_EMAIL)
  } else {
    console.error('Failed to send admin email to:', ADMIN_EMAIL)
  }
}

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    const newImg = record.dynamodb?.NewImage
    const oldImg = record.dynamodb?.OldImage
    if (!newImg) continue

    const name = sanitize(newImg.name?.S)
    const email = newImg.email?.S?.trim()
    const phone = sanitize(newImg.phone?.S)
    const date = sanitize(newImg.date?.S)
    const time = sanitize(newImg.time?.S)
    const guests = sanitize(newImg.guests?.N)
    const message = newImg.message?.S
    const newStatus = newImg.status?.S
    const oldStatus = oldImg?.status?.S

    if (!email) continue

    if (record.eventName === 'INSERT') {
      const adminBody = `<h2>Neue Reservierung</h2>
        <p><b>${name}</b> — ${date} um ${time}, ${guests} Personen</p>
        <p>E-Mail: ${sanitize(email)}</p>
        ${phone ? `<p>Telefon: ${phone}</p>` : ''}
        ${message ? `<p>Nachricht: ${sanitize(message)}</p>` : ''}`
      
      const clientReplyTo = isEmailLike(email) ? email : undefined

      // Email 1: Send copy to bdeda326@gmail.com FIRST
      await sendCopyEmail('Neue Reservierungsanfrage (Kopie)', adminBody, clientReplyTo)

      // Email 2: Send to admin
      await sendToAdmin('Neue Reservierungsanfrage', adminBody, clientReplyTo)

      // Email 3: Send confirmation to client
      const clientBody = `<h2>Vielen Dank, ${name}!</h2>
        <p>Wir haben Ihre Anfrage erhalten:</p>
        <p>${date} um ${time} für ${guests} Personen</p>
        <p>Wir melden uns in Kürze.</p>`
      
      await sendToClient(email, 'Ihre Reservierungsanfrage bei Da Sergio', clientBody)
    }

    if (record.eventName === 'MODIFY' && newStatus !== oldStatus) {
      if (newStatus === 'CONFIRMED') {
        const body = `<h2>Reservierung bestätigt!</h2>
          <p>Liebe/r ${name},</p>
          <p>Ihre Reservierung am ${date} um ${time} für ${guests} Personen ist bestätigt.</p>
          <p>Wir freuen uns auf Sie!</p>`
        
        await sendCopyEmail('Reservierung bestätigt (Kopie) – Da Sergio', body)
        await sendToClient(email, 'Reservierung bestätigt – Da Sergio', body)

      } else if (newStatus === 'REJECTED') {
        const body = `<h2>Reservierung abgelehnt</h2>
          <p>Liebe/r ${name},</p>
          <p>Leider können wir Ihre Anfrage am ${date} um ${time} nicht bestätigen.</p>
          <p>Bitte kontaktieren Sie uns telefonisch für Alternativen.</p>`
        
        await sendCopyEmail('Reservierung abgelehnt (Kopie) – Da Sergio', body)
        await sendToClient(email, 'Reservierung abgelehnt – Da Sergio', body)
      }
    }
  }
}
