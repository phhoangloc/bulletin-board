"use client"
import React, { useEffect, useState } from "react"
import store from "./store"
import { Provider } from "react-redux"
import { setUser } from "./reducer/UserReducer"
import { UserLogin } from "./reducer/UserReducer"
import { setRefresh } from "./reducer/RefreshReducer"
import Loading from "@/app/loading"
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

    return (
        <Provider store={store}>
            {loading ? <Loading /> : children}
        </Provider>
    )
}

export default ProviderExport