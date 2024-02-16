'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { UserLogin } from '@/redux/reducer/UserReducer'
import { useState, useEffect } from 'react'
import store from '@/redux/store'
import { M_PLUS_1 } from 'next/font/google'

const m_plus = M_PLUS_1({
    subsets: ['latin'],
})

const Header = () => {
    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }

    update()

    return (
        <div className='header'>
            <div className="grey"></div>
            <div className="gradiant"></div>
            <div className="header_box">
                <Link href={"/"}><Image src={"/img/header_logo.gif"} width={200} height={40} alt='headerlogo' /></Link>
                <div className={"account " + m_plus.className}>
                    {user?.nickname ?
                        <p className='welcome'>ようこそ、{user?.nickname}さん</p> : null}
                    <p className='logout' onClick={() => { localStorage.clear(); window.location.reload() }}>ログアウト</p>
                </div>
            </div>
        </div>
    )
}

export default Header