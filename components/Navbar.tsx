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

  return (
    <div>
      <nav>
        <div>
          {session?.user ? (<>{`Welcome ${user.username || user.email}`} <Button onClick={() => {
            signOut()
            toast("User signed out")
          }

          } >Log Out</Button></>) : 
          (
            <Link href={'/sign-in'} >
              <Button>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}



export default Navbar