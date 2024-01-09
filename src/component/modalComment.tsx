
import TextArea from '@/items/TextArea'
import React, { useState } from 'react'
import store from '@/redux/store'
import { UserLogin } from '@/redux/reducer/UserReducer'
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { setRefresh } from '@/redux/reducer/RefreshReducer';
type Props = {
    id: String | undefined
}

const ModalComment = ({ id }: Props) => {

    const [reply, setReply] = useState<string>("")

    const sendComment = async (reply: String) => {
        const result = reply && await axios.post("api/auth/comment", { postId: id, content: reply },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        store.dispatch(setRefresh())
        setReply("")

    }

    return (
        <div className="reply-input">
            <TextArea name="コメント。。。" value={reply} onChange={(e) => setReply(e.target.value)} />
            <SendIcon onClick={() => sendComment(reply)} />
        </div>
    )
}

export default ModalComment