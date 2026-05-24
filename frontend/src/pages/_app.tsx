import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/navbar'
import React, { useEffect } from 'react'
import { User } from '../model/user'
import * as NotesApi from './api/fetch'
import { SpinnerBallIcon } from '@phosphor-icons/react'
import { useRouter } from 'next/router'

const PROTECTED_ROUTES = ['/notes', '/shared', '/favorites', '/settings']
const GUEST_ONLY_ROUTES = ['/login', '/register']
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loggedInUser, setLoggedInUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState<Boolean>(true)

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        setIsLoading(true);
        const user = await NotesApi.getLoginUser()
        setLoggedInUser(user)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    }
    fetchLoggedInUser()
  }, [])

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (!loggedInUser && PROTECTED_ROUTES.includes(router.pathname)) {
      router.push('/unauthorized')
    }
    if (loggedInUser && GUEST_ONLY_ROUTES.includes(router.pathname)) {
      router.push('/')
    }
  }, [loggedInUser, router.pathname, isLoading])

  if (isLoading) {
    return <div><SpinnerBallIcon /></div>
  }
  return (
    <div>
      <Navbar loggedInUser={loggedInUser} onLogout={() => setLoggedInUser(null)} />
      <Component {...pageProps} loggedInUser={loggedInUser} />
    </div>
  )
}
