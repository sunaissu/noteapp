import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/navbar'
import React, { useEffect } from 'react'
import { User } from '../model/user'
import * as NotesApi from './api/fetch'

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser, setLoggedInUser] = React.useState<User | null>(null)

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoginUser()
        setLoggedInUser(user)
        console.log(user)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLoggedInUser()
  }, [])
  return (
    <div>
      <Navbar loggedInUser={loggedInUser} onLogout={() => setLoggedInUser(null)} />
      <Component {...pageProps} loggedInUser={loggedInUser} />
    </div>
  )
}
