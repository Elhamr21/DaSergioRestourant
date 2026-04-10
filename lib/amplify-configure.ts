import { Amplify } from 'aws-amplify'
import outputs from '@/amplify_outputs.json'

Amplify.configure(outputs, {
  ssr: true,
  Auth: {
    identityPoolId: outputs.auth.identity_pool_id,
    allowGuestAccess: true,
  },
})
