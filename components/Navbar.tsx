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
  <a href='#' className="text-xl font-bold text-black">Brave Feedback</a>
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
  ) : (
    <Link href={'/sign-in'}>
      <Button>Sign In</Button>
    </Link>
  )}
</nav>
  )
}



export default Navbar