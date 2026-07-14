'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  console.log(user?.userName);

  return (

  <nav className='flex items-center justify-between w-full px-6 py-4 border-b'>
  <a href='#' className="text-xl font-bold text-black"> <span className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          open<span className="text-[#4A4A52]">Feedback</span>
        </span></a>
  {session?.user ? (
    <div className="flex items-center gap-6">
      <p className="text-base text-gray-600">
        Welcome, <span className="font-semibold text-xl text-black">{user?.userName ?? user.email}</span>
      </p>
      <Button className={`text-xl py-2`} onClick={() => {
        signOut()
        toast.info("User signed out")
      }}>
        Log Out
      </Button>
    </div>
  ) : (<div className='flex items-center gap-3'>
    <Link href={'/sign-in'}>
      <Button className={`text-xl tracking-tight font-family:mono`}  variant={`ghost`}  >Sign In</Button>
    </Link>
  
   <Link
            href="/sign-up"
            className="bg-[#1B1B1F] text-[#F7F5F0] px-4 py-2 rounded-sm text-md hover:bg-[#14151A] transition-colors"
          >
            Get your link
          </Link>
  </div>
    
  )}

  
</nav>
  )
}



export default Navbar