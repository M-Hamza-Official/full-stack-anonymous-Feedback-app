import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { User ,} from 'next-auth'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'

const Navbar = () => {
const {data:session}=useSession()
const user:User=session?.user as User

  return (
    <div>
      <nav>
        <div>
          {session?.user ?(<>`Welcome${user.username}`<Button onClick={()=>{Logout}} >Log Out</Button></>):(
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