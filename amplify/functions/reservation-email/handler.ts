import type { DynamoDBStreamEvent } from 'aws-lambda'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({})
const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@dasergio-restaurant.de'
const ADMIN_EMAIL = process.env.SES_ADMIN_EMAIL || 'info@dasergio-restaurant.de'

function sanitize(s?: string | null): string {
  return (s ?? '').replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

async function sendEmail(to: string, subject: string, body: string) {
  try {
    await ses.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: body } },
      },
    }))
  } catch (err) {
    console.error('Email send failed:', JSON.stringify({ to, subject, error: String(err) }))
  }
}

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    const newImg = record.dynamodb?.NewImage
    const oldImg = record.dynamodb?.OldImage
    if (!newImg) continue

    const name = sanitize(newImg.name?.S)
    const email = newImg.email?.S
    const date = newImg.date?.S
    const time = newImg.time?.S
    const guests = newImg.guests?.N
    const newStatus = newImg.status?.S
    const oldStatus = oldImg?.status?.S

    if (!email) continue

    if (record.eventName === 'INSERT') {
      await sendEmail(ADMIN_EMAIL, 'Neue Reservierungsanfrage',
        `<h2>Neue Reservierung</h2><p><b>${name}</b> — ${date} um ${time}, ${guests} Personen</p><p>E-Mail: ${sanitize(email)}</p>`)
      await sendEmail(email, 'Ihre Reservierungsanfrage bei Da Sergio',
        `<h2>Vielen Dank, ${name}!</h2><p>Wir haben Ihre Anfrage erhalten:</p><p>${date} um ${time} für ${guests} Personen</p><p>Wir melden uns in Kürze.</p>`)
    }

    if (record.eventName === 'MODIFY' && newStatus !== oldStatus) {
      if (newStatus === 'CONFIRMED') {
        await sendEmail(email, 'Reservierung bestätigt – Da Sergio',
          `<h2>Reservierung bestätigt!</h2><p>Liebe/r ${name},</p><p>Ihre Reservierung am ${date} um ${time} für ${guests} Personen ist bestätigt.</p><p>Wir freuen uns auf Sie!</p>`)
      } else if (newStatus === 'REJECTED') {
        await sendEmail(email, 'Reservierung abgelehnt – Da Sergio',
          `<h2>Reservierung abgelehnt</h2><p>Liebe/r ${name},</p><p>Leider können wir Ihre Anfrage am ${date} um ${time} nicht bestätigen.</p><p>Bitte kontaktieren Sie uns telefonisch für Alternativen.</p>`)
      }
    }
  }
}
