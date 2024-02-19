import Button from '@/items/Button'
import Input from '@/items/Input'
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import store from '@/redux/store'
import { setRefresh } from '@/redux/reducer/RefreshReducer'

const Login = () => {
    const [notice, setNotice] = useState<string>("")
    const [nickname, setNickname] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const body = { nickname, password }

    const toPage = useRouter()
    const login = async () => {
        const result = await axios.post("/api/login", body)
        if (result.data.success) {
            const token = result.data.result
            localStorage.token = "token " + token
            toPage.refresh()
            setNickname("")
            setPassword("")
            store.dispatch(setRefresh())
        } else {
            setNotice(result.data.message)
        }
    }
    return (
        <div className='login center'>
            <div className="box">
                <h2>ログイン</h2>
                <div className="element">
                    <p>ニックネーム</p>
                    <input onChange={(e) => setNickname(e.target.value)} value={nickname}></input>
                </div>
                <div className="element">
                    <p>パスワード</p>
                    <input type='password' onChange={(e) => setPassword(e.target.value)} value={password}></input>
                </div>
                {/* <Input name='nickname' onChange={(e) => setNickname(e.target.value)} value={nickname} />
                <Input type='password' name='password' onChange={(e) => setPassword(e.target.value)} value={password} /> */}
                <p className='notice'>{notice}</p>
                <div className="narbar">
                    <Button name='ログイン' onClick={() => login()} />
                    <p className='link' onClick={() => toPage.push('/signup')}>登録</p>
                </div>
            </div>
        </div>
    )
}

export default Login