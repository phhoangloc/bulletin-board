import { useEffect, useState } from 'react'
import React from 'react'
import store from '@/redux/store'
import { UserLogin } from '@/redux/reducer/UserReducer'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import ModalEdit from './modalEdit';
import ItemBulletinBoard from './itemBulletinBoard';
import TextAreaV2 from '@/items/TextAreaVer2';
const BulletinBoad = () => {

    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)
    const [number, setCurrentNumber] = useState<number>(0)

    const [infor, setinfor] = useState<string>("")
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentNumber(store.getState().refresh))
    }

    update()

    const createPost = async (infor: string) => {
        const result = await axios.post("api/auth/post", { content: infor },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })

        window.location.reload()
        setinfor("")
    }

    const [posts, setPosts] = useState<{ _id: string, nicknameId: { _id: string, nickname: string }, content: string, createDate: Date }[]>([])
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [postId, setPostId] = useState<String | undefined>()
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const getPost = async () => {
        const result = await axios.get(`/api/post?limit=${limit}&sort=true&skip=${(page - 1) * limit}`)
        if (result.data.success) {
            setPosts(result.data.data)
        }
    }

    useEffect(() => {
        getPost()
    }, [number, page])

    return (
        <div className='board'>
            <p className='welcome'>こんにちは、{user?.nickname} </p>
            <p className='logout' onClick={() => { localStorage.clear(); window.location.reload() }}>ログアウト</p>
            <div className="create-news">
                <TextAreaV2 name='情報を入力してください' value={infor} onInput={(data) => setinfor(data)} />
                <SendIcon onClick={() => createPost(infor)} />
            </div>
            <div className='item'>
                {
                    posts.map((item, index) =>
                        <ItemBulletinBoard post={item} key={index} func={(modalOpen, postId) => { setModalOpen(modalOpen), setPostId(postId) }} />
                    )
                }

                <div className="page">
                    {limit * (page - 1) > 0 && <p onClick={() => { setPage(pre => pre - 1) }}><ArrowLeftIcon /></p>}
                    {page && <p>{page}</p>}
                    {posts.length - limit >= 0 && <p onClick={() => { setPage(pre => pre + 1) }}><ArrowRightIcon /></p>}
                </div>

            </div>
            <ModalEdit id={postId} modalOpen={modalOpen} cancel={() => { setPostId(""); setModalOpen(false) }} />
        </div >
    )
}

export default BulletinBoad