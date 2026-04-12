import { defineFunction } from '@aws-amplify/backend'

export const reservationEmailHandler = defineFunction({
  name: 'reservation-email-handler',
  entry: './handler.ts',
  environment: {
    SES_FROM_EMAIL: 'noreply@da-sergio-restaurant.de',
    SES_ADMIN_EMAILS: 'info@da-sergio-restaurant.de',
    RESERVATION_COPY_EMAIL: 'bdeda326@gmail.com',
  },
})
