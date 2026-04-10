import { defineFunction } from '@aws-amplify/backend'

export const reservationEmailHandler = defineFunction({
  name: 'reservation-email-handler',
  entry: './handler.ts',
  environment: {
    SES_FROM_EMAIL: 'noreply@dasergio-restaurant.de',
    SES_ADMIN_EMAIL: 'info@dasergio-restaurant.de',
  },
})
