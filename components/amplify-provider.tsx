'use client'

import { Amplify } from 'aws-amplify'
import outputs from '@/amplify_outputs.json'

const authConfig = {
  Cognito: {
    userPoolId: outputs.auth.user_pool_id,
    userPoolClientId: outputs.auth.user_pool_client_id,
    identityPoolId: outputs.auth.identity_pool_id,
    allowGuestAccess: true,
  },
}

const apiConfig = {
  GraphQL: {
    endpoint: outputs.data.url,
    region: outputs.data.aws_region,
    defaultAuthMode: 'iam' as const,
    modelIntrospection: outputs.data.model_introspection as any,
  },
}

Amplify.configure({
  Auth: authConfig,
  API: apiConfig,
})

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
