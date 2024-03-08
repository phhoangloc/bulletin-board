'use client'
import { useEffect, useState } from 'react'
import BulletinBoad from '@/component/bulletinBoad'
import Login from '@/component/login'
import store from '@/redux/store'
import { UserLogin } from '@/redux/reducer/UserReducer'
import Header from '@/component/header'
import Footer from '@/component/footer'
import Image from 'next/image'
export default function Home() {

  const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)
  const [number, setCurrentNumber] = useState<number>(0)

  const update = () => {
    store.subscribe(() => setCurrentUser(store.getState().user))
    store.subscribe(() => setCurrentNumber(store.getState().refresh))
  }

  update()

  const reCom = user && user.success ?
    <BulletinBoad /> :
    <Login />
  return (
    <main className='center'>
      <Header />
      {reCom}
      {/* <Footer /> */}
    </main>
  )
}
