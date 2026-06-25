'use client'
//need to wrap session provider in layout.tsx
import { SessionProvider } from "next-auth/react"
export default function AuthProvider({children}:{children:React.ReactNode}) {

 

  return <SessionProvider>{children}</SessionProvider>
}