import { defineFunction } from '@aws-amplify/backend'

export const reservationEmailHandler = defineFunction({
  name: 'reservation-email-handler',
  entry: './handler.ts',
  environment: {
    SES_FROM_EMAIL: 'noreply@da-sergio-restaurant.de',
    SES_ADMIN_EMAILS: 'info@da-sergio-restaurant.de,Bdeda326@gmail.com',
  },
})
