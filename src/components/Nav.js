import React, { useContext } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Nav() {
  const { signout } = useAuth()
  const location = usePathname()  
  const isDashboard = location.startsWith('/dashboard')
  const router = useRouter()

  const handleLogout = async () => {
    await signout()
    router.push('/sign-in')
  }

  return (
    <header className="text-gray-600 body-font shadow w-full h-16 flex items-center">
      <div className="w-full flex justify-between items-center px-4">
        <div>
          <a className="flex title-font font-medium items-center text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl"> TreeLynk </span>
          </a>
        </div>

    { isDashboard ?(
       <div className='flex gap-7 justify-end items-center '>
        <Link href="/dashboard" className=''> Dashboard </Link>
       <button 
       className='btn btn-error btn-outline btn-sm text-white'
       onClick={handleLogout}
       >Logout
         <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
           <path d="M5 12h14M12 5l7 7-7 7"></path>
         </svg>
       </button>
     </div>
    ) :(
      <div className='flex items-center gap-3'>
      <nav className=" md:ml-auto flex-wrap flex items-center text-base justify-center">
        <Link href = "/" className="mr-5 hover:text-gray-900"> Home </Link>
      </nav>
      <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <Link href = "/sign-up" className="mr-5 hover:text-gray-900">Sign Up</Link>
      </nav>
      <Link href='/sign-in' className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base md:mt-0">Sign In
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </Link>
    </div>
    )}
      </div>
    </header>
  )
}