import type { DynamoDBStreamEvent } from 'aws-lambda'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({})
const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@da-sergio-restaurant.de'
const RESERVATION_COPY_EMAILS = uniqueEmails(
  (process.env.RESERVATION_COPY_EMAIL || 'herolind01110000@gmail.com').split(',')
)
const ADMIN_EMAILS = uniqueEmails(
  (process.env.SES_ADMIN_EMAILS || 'info@da-sergio-restaurant.de').split(',')
).filter(email =>
  !RESERVATION_COPY_EMAILS.some(copyEmail => copyEmail.toLowerCase() === email.toLowerCase())
)

function uniqueEmails(emails: string[]): string[] {
  const seen = new Set<string>()
  return emails
    .map(email => email.trim())
    .filter(email => email.length > 0)
    .filter(email => {
      const normalized = email.toLowerCase()
      if (seen.has(normalized)) return false
      seen.add(normalized)
      return true
    })
}

function sanitize(s?: string | null): string {
  return (s ?? '').replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

function isEmailLike(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function sendEmail(to: string[], subject: string, body: string, replyTo?: string[]) {
  if (!to.length) return

  try {
    await ses.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: to },
      ReplyToAddresses: replyTo,
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: body } },
      },
    }))
  } catch (err) {
    console.error('Email send failed:', JSON.stringify({ to, subject, error: String(err) }))
  }
}

async function sendClientEmail(to: string, subject: string, body: string) {
  await sendEmail([to], subject, body)

  if (RESERVATION_COPY_EMAILS.length) {
    await sendEmail(RESERVATION_COPY_EMAILS, subject, body)
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
      await sendEmail(ADMIN_EMAILS, 'Neue Reservierungsanfrage',
        `<h2>Neue Reservierung</h2>
        <p><b>${name}</b> — ${date} um ${time}, ${guests} Personen</p>
        <p>E-Mail: ${sanitize(email)}</p>
        ${phone ? `<p>Telefon: ${phone}</p>` : ''}
        ${message ? `<p>Nachricht: ${sanitize(message)}</p>` : ''}`,
        isEmailLike(email) ? [email] : undefined)

      await sendClientEmail(email, 'Ihre Reservierungsanfrage bei Da Sergio',
        `<h2>Vielen Dank, ${name}!</h2>
        <p>Wir haben Ihre Anfrage erhalten:</p>
        <p>${date} um ${time} für ${guests} Personen</p>
        <p>Wir melden uns in Kürze.</p>`)
    }

    if (record.eventName === 'MODIFY' && newStatus !== oldStatus) {
      if (newStatus === 'CONFIRMED') {
        await sendClientEmail(email, 'Reservierung bestätigt – Da Sergio',
          `<h2>Reservierung bestätigt!</h2>
          <p>Liebe/r ${name},</p>
          <p>Ihre Reservierung am ${date} um ${time} für ${guests} Personen ist bestätigt.</p>
          <p>Wir freuen uns auf Sie!</p>`)
      } else if (newStatus === 'REJECTED') {
        await sendClientEmail(email, 'Reservierung abgelehnt – Da Sergio',
          `<h2>Reservierung abgelehnt</h2>
          <p>Liebe/r ${name},</p>
          <p>Leider können wir Ihre Anfrage am ${date} um ${time} nicht bestätigen.</p>
          <p>Bitte kontaktieren Sie uns telefonisch für Alternativen.</p>`)
      }
    }
  }
}
