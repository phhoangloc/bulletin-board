'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { UserLogin } from '@/redux/reducer/UserReducer'
import { useState, useEffect } from 'react'
import store from '@/redux/store'
import PersonIcon from '@mui/icons-material/Person';
const Header = () => {
    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)
    const [number, setCurrentNumber] = useState<number>(0)

    const [infor, setinfor] = useState<string>("")

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentNumber(store.getState().refresh))
    }

    update()

    return (
        <div className='header'>
            <div className="header_box">
                <Link href={"/"}><Image src={"/img/header_logo.gif"} width={200} height={40} alt='headerlogo' /></Link>
                <div className="account">
                    {user?.nickname ?
                        <p className='welcome'>ようこそ、{user?.nickname}さん</p> : null}
                    <p className='logout' onClick={() => { localStorage.clear(); window.location.reload() }}>ログアウト</p>
                </div>
            </div>
        </div>
    )
}

export default Header