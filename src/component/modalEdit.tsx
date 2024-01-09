import Button from '@/items/Button'
import TextArea from '@/items/TextArea'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { UserLogin } from '@/redux/reducer/UserReducer'
import store from '@/redux/store'
import { setRefresh } from '@/redux/reducer/RefreshReducer'
import DeleteIcon from '@mui/icons-material/Delete';
type Props = {
    id?: String,
    modalOpen: Boolean
    cancel(): void
}

const ModalEdit = ({ modalOpen, id, cancel }: Props) => {

    const [infor, setinfor] = useState<string>("")

    const [user, setCurrentUser] = useState<UserLogin | undefined>(undefined)
    const [number, setCurrentNumber] = useState<number>(0)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentNumber(store.getState().refresh))
    }

    const getPostbyId = async (id: String) => {
        const result = await axios.get(`/api/auth/post?id=${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        if (result.data.success) {
            setinfor(result.data.data.content)
        }
    }
    const updatePostbyId = async (id: String) => {
        const result = await axios.put(`/api/auth/post?id=${id}`,
            { content: infor },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        if (result.data.success) {
            store.dispatch(setRefresh())
            cancel()
        }
    }
    const deletePostbyId = async (id: String) => {
        const result = await axios.delete(`/api/auth/post?id=${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        if (result.data.success) {
            store.dispatch(setRefresh())
            cancel()
        }
    }

    useEffect(() => {
        id && getPostbyId(id)
    }, [id])
    return (
        <div className={`modalEdit center ${modalOpen ? "modalOpen" : ""}`}>
            <div className="box">
                <h2>Edit</h2>
                <TextArea name='情報' value={infor} onChange={(e) => setinfor(e.target.value)} />
                <div className="tool">
                    <DeleteIcon onClick={() => { id && deletePostbyId(id) }} />
                    <Button name='cancel' onClick={() => cancel()} />
                    <Button name="save" onClick={() => { id && updatePostbyId(id) }} />
                </div>
            </div>
        </div>
    )
}

export default ModalEdit