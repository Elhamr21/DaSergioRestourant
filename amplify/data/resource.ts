import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  ReservationStatus: a.enum(['PENDING', 'CONFIRMED', 'REJECTED']),

  Reservation: a.model({
    name: a.string().required(),
    email: a.string().required(),
    phone: a.string(),
    date: a.string().required(),
    time: a.string().required(),
    guests: a.integer().required(),
    message: a.string(),
    status: a.ref('ReservationStatus').required(),
  }).authorization((allow) => [
    allow.guest().to(['create']),
    allow.group('Admin').to(['create', 'read', 'update', 'delete']),
  ]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
})
