'use client'
import { useEffect, useState } from 'react'
import BulletinBoad from '@/component/bulletinBoad'
import Login from '@/component/login'
import store from '@/redux/store'
import { UserLogin } from '@/redux/reducer/UserReducer'
import Header from '@/component/header'
import Post from '@/component/post'

type Props = {
  params: { slug: string }
}
export default function Home({ params }: Props) {

  const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)
  const [number, setCurrentNumber] = useState<number>(0)

  const update = () => {
    store.subscribe(() => setCurrentUser(store.getState().user))
    store.subscribe(() => setCurrentNumber(store.getState().refresh))
  }

  update()

  const reCom = user && user.success ?
    <Post slug={params.slug} /> :
    <Login />
  return (
    <main className='center'>
      <Header />
      {reCom}
    </main>
  )
}
