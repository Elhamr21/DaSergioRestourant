import type { Metadata } from 'next'
import { AdminAuthLayout } from '@/components/admin-auth-layout'

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthLayout>{children}</AdminAuthLayout>
}
