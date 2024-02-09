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
import LoopIcon from '@mui/icons-material/Loop';
const BulletinBoad = () => {

    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)
    const [number, setCurrentNumber] = useState<number>(0)

    const [infor, setinfor] = useState<string>("")

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentNumber(store.getState().refresh))
    }

    update()

    const [sending, setSending] = useState<boolean>(false)


    const createPost = async (infor: string) => {
        setSending(true)
        const result = await axios.post("api/auth/post", { content: infor },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        if (result.data.success) {
            setSending(false)
            window.location.reload()
            setinfor("")
        }
    }

    const [posts, setPosts] = useState<{ _id: string, nicknameId: { _id: string, nickname: string }, content: string, createDate: Date }[]>([])
    const [isNextPage, setIsNextPage] = useState<Boolean>(true)
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [postId, setPostId] = useState<String | undefined>()
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const getPost = async () => {
        const result = await axios.get(`/api/post?limit=${limit}&sort=true&skip=${(page - 1) * limit}`)
        if (result.data.success) {
            setPosts(result.data.data)
        }

        const resultNext = await axios.get(`/api/post?limit=${limit}&sort=true&skip=${(page) * limit}`)
        if (result.data.success) {
            if (resultNext.data.data.length === 0) {
                console.log(resultNext.data.data.length)
                setIsNextPage(false)
            } else {
                setIsNextPage(true)
            }
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
                {sending ? <LoopIcon /> : <SendIcon onClick={() => createPost(infor)} sx={infor ? { opacity: 1 } : { opacity: 0.1 }} />}
            </div>
            <div className='item'>
                {
                    posts.map((item, index) =>
                        <ItemBulletinBoard post={item} key={index} func={(modalOpen, postId) => { setModalOpen(modalOpen), setPostId(postId) }} />
                    )
                }

                <div className="page">
                    <p>{page === 1 ? null : <ArrowLeftIcon onClick={() => setPage(prev => prev - 1)} />}</p>
                    <p>{page}</p>
                    <p>{isNextPage ? <ArrowRightIcon onClick={() => setPage(prev => prev + 1)} /> : null}</p>
                </div>

            </div>
            <ModalEdit id={postId} modalOpen={modalOpen} cancel={() => { setPostId(""); setModalOpen(false) }} />
        </div >
    )
}

export default BulletinBoad