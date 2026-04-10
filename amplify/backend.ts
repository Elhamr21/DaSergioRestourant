import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { reservationEmailHandler } from './functions/reservation-email/resource'
import { EventSourceMapping, StartingPosition } from 'aws-cdk-lib/aws-lambda'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

const backend = defineBackend({ auth, data, reservationEmailHandler })

const reservationTable = backend.data.resources.tables['Reservation']
const fn = backend.reservationEmailHandler.resources.lambda

new EventSourceMapping(backend.stack, 'ReservationStreamMapping', {
  target: fn,
  eventSourceArn: reservationTable.tableStreamArn!,
  startingPosition: StartingPosition.LATEST,
  batchSize: 10,
})

reservationTable.grantStreamRead(fn)

fn.addToRolePolicy(new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'],
}))
