'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const Navbar = () => {
  const { data: session, status } = useSession()
  const user = session?.user as User | undefined

  return (
    <nav className="flex items-center justify-between w-full px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E5E3DC] flex-wrap gap-3">
      <Link href="/" className="text-black shrink-0">
        <span className="font-[family-name:var(--font-display)] text-lg sm:text-2xl tracking-tight">
          open<span className="text-[#4A4A52]">Feedback</span>
        </span>
      </Link>

      {status === 'loading' ? (
        <div className="h-8 w-24 bg-[#14151A]/10 rounded-sm animate-pulse" />
      ) : user ? (
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-end">
          <p className="hidden sm:block text-sm text-[#6B6B72] truncate max-w-[10rem]">
            Welcome,{' '}
            <span className="font-semibold text-base text-[#1B1B1F]">
              {user?.userName ?? user.email}
            </span>
          </p>
          <Button
            className="text-sm sm:text-base py-2 rounded-sm bg-[#1B1B1F] hover:bg-[#14151A] text-[#F7F5F0]"
            onClick={() => {
              signOut()
              toast.info('User signed out')
            }}
          >
            Log Out
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/sign-in">
            <Button
              className="text-sm sm:text-base tracking-tight font-[family-name:var(--font-mono)]"
              variant="ghost"
            >
              Sign In
            </Button>
          </Link>
          <Link
            href="/sign-up"
            className="bg-[#1B1B1F] text-[#F7F5F0] px-3 sm:px-4 py-2 rounded-sm text-sm sm:text-base hover:bg-[#14151A] transition-colors"
          >
            Get your link
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar