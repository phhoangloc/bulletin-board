"use client"
import React, { useEffect, useState } from "react"
import store from "./store"
import { Provider } from "react-redux"
import { setUser } from "./reducer/UserReducer"
import { UserLogin } from "./reducer/UserReducer"
import { setRefresh } from "./reducer/RefreshReducer"
import Loading from "@/app/loading"
import io, { Socket } from 'socket.io-client';
import axios from "axios"

type Props = {
    children: React.ReactNode
}

const ProviderExport = ({ children }: Props) => {

    const [user, setCurrentUser] = useState<UserLogin | undefined>(undefined)
    const [number, setCurrentNumber] = useState<number>(0)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentNumber(store.getState().refresh))
    }

    update()

    const [loading, setLoading] = useState<boolean>(true)
    // const [start, setStart] = useState<Date>()

    const checkLogin = async (token: any) => {
        setLoading(true)
        await fetch('/api/auth', {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then((result) => {
                if (result.success && result.data) {
                    const id = result.data._id
                    const nickname = result.data.nickname
                    store.dispatch(setUser({ success: true, id, nickname }))
                } else {
                    store.dispatch(setUser(undefined))
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        checkLogin(localStorage.token)
    }, [number])

    const handleBeforeUnload = async (start: any) => {
        await axios.put("/api/auth/user", { start }, {
            headers: {
                'Authorization': localStorage.token,
                'Content-Type': 'application/json'
            },
        })
    };
    useEffect(() => {
        const start = new Date()
        window.onbeforeunload = () => user?.id && handleBeforeUnload(start)
    }, [user?.id]);


    return (
        <Provider store={store}>
            {loading ? <Loading /> : children}
        </Provider>
    )
}

export default ProviderExport