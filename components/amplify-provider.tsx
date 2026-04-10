'use client'

import '@/lib/amplify-configure'

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
