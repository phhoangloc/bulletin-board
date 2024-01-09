'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import Input from '@/items/Input'
import Button from '@/items/Button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
type Props = {}

const SignUp = (props: Props) => {
    const toPage = useRouter()
    const [notice, setNotice] = useState<string>("")

    const [nickname, setNickname] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const body = { nickname, password, email }

    const [isError, setIsErrors] = useState<boolean>(true)

    const [Error, setErrors] = useState<{ nickname?: string, password?: string, email?: string }>({})

    useEffect(() => {
        validateForm && validateForm();
    }, [nickname, password, email]);

    const validateForm = async () => {
        let errors: { nickname?: string, password?: string, email?: string } = {}

        if (nickname.length != 0 && 6 > nickname.length) {
            errors.nickname = 'nickname must be at least than 6'
        }
        if (nickname) {
            const isnickname = await fetch("/api/user?nickname=" + nickname)
                .then((res) => res.json())
                .then((data) => data)
            if (isnickname) { errors.nickname = "this nickname is existed" }
        }
        if (!/\S+@\S+\.\S+/.test(email) && email.length != 0) {
            errors.email = 'Email is invalid';
        }
        if (email) {
            const isEmail = await fetch("/api/user?email=" + email)
                .then((res) => res.json())
                .then((data) => data)
            if (isEmail) { errors.email = "this email is existed" }
        }
        if (password.length != 0 && password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        setIsErrors(Object.keys(errors).length || nickname === "" || password === "" || email === "" ? true : false);
        setErrors(errors)
    }

    const SignUp = async () => {
        if (!isError) {
            const result = await axios.post("/api/signup", body)
            setNickname("")
            setEmail("")
            setPassword("")
            setNotice(result.data.message)
        }
    }

    return (
        <main className='center'>
            <h1>アステムの掲示板</h1>
            <p className='notice'>{notice}</p>
            <div className='signup center'>
                <div className="box">
                    <h2>Sign Up</h2>
                    <Input name='nickname' onChange={(e) => setNickname(e.target.value)} value={nickname} warn={Error.nickname} />
                    <Input type='password' name='password' onChange={(e) => setPassword(e.target.value)} value={password} warn={Error.password} />
                    <Input name='email' onChange={(e) => setEmail(e.target.value)} value={email} warn={Error.email} />
                    <Button name='Sign Up' onClick={() => SignUp()} />
                    <p className='link' onClick={() => toPage.push('/login')}>ログイン</p>

                </div>
            </div>

        </main>
    )
}

export default SignUp