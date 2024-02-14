import Button from '@/items/Button'
import TextArea from '@/items/TextArea'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { UserLogin } from '@/redux/reducer/UserReducer'
import store from '@/redux/store'
import { setRefresh } from '@/redux/reducer/RefreshReducer'
import DeleteIcon from '@mui/icons-material/Delete';
import TextAreaV2 from '@/items/TextAreaVer2'
import Input from '@/items/Input'
type Props = {
    id?: String,
    modalOpen: Boolean
    cancel(): void
}

const ModalEdit = ({ modalOpen, id, cancel }: Props) => {

    const [infor, setinfor] = useState<string>("")
    const [title, setTitle] = useState<string>("")

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
            setTitle(result.data.data.title)
        }
    }
    const updatePostbyId = async (id: String) => {
        const result = await axios.put(`/api/auth/post?id=${id}`,
            { title, content: infor },
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
            window.location.reload()
            cancel()
        }
    }

    useEffect(() => {
        id && getPostbyId(id)
    }, [id])

    return (
        <div className={`modalEdit center ${modalOpen ? "modalOpen" : ""} `}>
            <div className="box">
                <h2>編集</h2>
                <Input name='タイトル' value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextAreaV2 name='内容' value={infor} onInput={(data) => setinfor(data)} id={id} />
                <div className="tool">
                    <DeleteIcon onClick={() => { id && deletePostbyId(id) }} />
                    <Button name='cancel' onClick={() => { cancel(), setTitle("") }} />
                    <Button name="save" onClick={() => { id && updatePostbyId(id) }} />
                </div>
            </div>
        </div>
    )
}

export default ModalEdit