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

type SendEmailOptions = {
  replyTo?: string[]
  bcc?: string[]
}

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

function emailsExcluding(emails: string[], excludedEmails: string[]): string[] {
  const excluded = new Set(uniqueEmails(excludedEmails).map(email => email.toLowerCase()))
  return uniqueEmails(emails).filter(email => !excluded.has(email.toLowerCase()))
}

function copyEmailsFor(existingRecipients: string[] = []): string[] {
  return emailsExcluding(RESERVATION_COPY_EMAILS, existingRecipients)
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

async function sendEmail(to: string[], subject: string, body: string, options: SendEmailOptions = {}): Promise<boolean> {
  const toAddresses = uniqueEmails(to)
  const bccAddresses = emailsExcluding(options.bcc ?? [], toAddresses)

  if (!toAddresses.length && !bccAddresses.length) return true

  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM_EMAIL,
        Destination: {
          ToAddresses: toAddresses.length ? toAddresses : undefined,
          BccAddresses: bccAddresses.length ? bccAddresses : undefined,
        },
        ReplyToAddresses: options.replyTo,
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: body } },
        },
      }))
      console.info('Email send accepted:', JSON.stringify({ to: toAddresses, bcc: bccAddresses, subject, attempt }))
      return true
    } catch (err) {
      const retryable = isRetryableEmailError(err)
      console.error('Email send failed:', JSON.stringify({
        to: toAddresses,
        bcc: bccAddresses,
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

async function sendEmailWithCopy(to: string[], subject: string, body: string, options: SendEmailOptions = {}) {
  const copyEmails = copyEmailsFor([...(to ?? []), ...(options.bcc ?? [])])
  const bcc = uniqueEmails([...(options.bcc ?? []), ...copyEmails])
  const sentWithCopy = await sendEmail(to, subject, body, { ...options, bcc })

  if (sentWithCopy) return

  console.warn('Email with reservation copy failed; retrying recipients separately:', JSON.stringify({ to, copyEmails, subject }))
  const fallbackOptions = { ...options, bcc: undefined }
  await sendEmail(to, subject, body, fallbackOptions)

  for (const copyEmail of copyEmails) {
    await sendEmail([copyEmail], subject, body, fallbackOptions)
  }
}

async function sendClientEmail(to: string, subject: string, body: string) {
  await sendEmailWithCopy([to], subject, body)
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
      await sendEmailWithCopy(ADMIN_EMAILS, 'Neue Reservierungsanfrage',
        `<h2>Neue Reservierung</h2>
        <p><b>${name}</b> — ${date} um ${time}, ${guests} Personen</p>
        <p>E-Mail: ${sanitize(email)}</p>
        ${phone ? `<p>Telefon: ${phone}</p>` : ''}
        ${message ? `<p>Nachricht: ${sanitize(message)}</p>` : ''}`,
        { replyTo: isEmailLike(email) ? [email] : undefined })

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
