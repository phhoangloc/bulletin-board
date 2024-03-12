'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { UserLogin } from '@/redux/reducer/UserReducer'
import { useState, useEffect } from 'react'
import store from '@/redux/store'
import { M_PLUS_1 } from 'next/font/google'
import axios from 'axios'
import { useRouter } from 'next/navigation'
const m_plus = M_PLUS_1({
    subsets: ['latin'],
})

const Header = () => {

    const toPage = useRouter()
    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }

    update()

    const handleBeforeUnload = async () => {
        const start = new Date
        const result = await axios.put("/api/auth/user", { start }, {
            headers: {
                'Authorization': localStorage.token,
                'Content-Type': 'application/json'
            },
        })
        if (result.data.success) {
            localStorage.clear()
            window.location.href = "/"
        }
    };



    return (
        <div className='header'>
            <div className="grey"></div>
            <div className="gradiant"></div>
            <div className="header_box">
                <Link href={"/"}><Image src={"/img/header_logo.gif"} width={200} height={40} alt='headerlogo' /></Link>
                <div className={"account " + m_plus.className}>
                    {user?.nickname ?
                        <p className='welcome'>ようこそ、{user?.nickname}さん</p> : null}
                    {user?.nickname ? <p className='logout' onClick={() => { handleBeforeUnload() }}>ログアウト</p> : null}
                </div>
            </div>
        </div>
    )
}

export default Header