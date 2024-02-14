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
import Tool from './tool';
import Input from '@/items/Input';
import ItemLoading from './itemLoading';

const BulletinBoad = () => {

    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)
    const [number, setCurrentNumber] = useState<number>(0)

    const [title, setTitle] = useState<string>("")
    const [infor, setinfor] = useState<string>("")

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentNumber(store.getState().refresh))
    }

    update()

    const [sending, setSending] = useState<boolean>(false)

    const createPost = async (title: string, infor: string) => {
        if (title && infor) {
            setSending(true)
            const result = await axios.post("api/auth/post", { title, content: infor },
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
        else {
            alert("インプットボックスに全部入力してください。")
        }
    }

    const [posts, setPosts] = useState<{ _id: string, nicknameId: { _id: string, nickname: string }, title: string, content: string, createDate: Date }[]>([])
    const [isNextPage, setIsNextPage] = useState<Boolean>(true)
    const [search, setSearch] = useState<string>("")
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [postId, setPostId] = useState<String | undefined>()
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const getPost = async (limit: number, page: number, search: string) => {
        setLoading(true)
        const result = await axios.get(`/api/post?search=${search}&limit=${limit}&sort=true&skip=${(page - 1) * limit}`)
        if (result.data.success) {
            setPosts(result.data.data)
        }

        const resultNext = await axios.get(`/api/post?search=${search}&limit=${limit}&sort=true&skip=${(page) * limit}`)

        if (result.data.success) {
            if (resultNext.data.data.length === 0) {
                setIsNextPage(false)
            } else {
                setIsNextPage(true)
            }

        }
        setLoading(false)

    }

    useEffect(() => {
        getPost(limit, page, search)
    }, [number, page, search])

    return (
        <div className='board'>
            <div className="create-news">
                <Input name='タイトル' value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextAreaV2 name='内容' value={infor} onInput={(data) => setinfor(data)} />
                {sending ? <LoopIcon /> : <SendIcon onClick={() => createPost(title, infor)} sx={infor ? { opacity: 1 } : { opacity: 0.1 }} />}
            </div>
            <div className='item'>
                <Tool func={(e) => setSearch(e)} />
                {posts.map((item, index) => <ItemBulletinBoard post={item} key={index} func={(modalOpen, postId) => { setModalOpen(modalOpen), setPostId(postId) }} />)}
                {loading ? <ItemLoading /> :
                    <div className="page">
                        <p>{page === 1 ? null : <ArrowLeftIcon onClick={() => { setPage(prev => prev - 1); setPosts([]) }} />}</p>
                        <p>{page}</p>
                        <p>{isNextPage ? <ArrowRightIcon onClick={() => { setPage(prev => prev + 1); setPosts([]) }} /> : null}</p>
                    </div>}

            </div>
            <ModalEdit id={postId} modalOpen={modalOpen} cancel={() => { setPostId(""); setModalOpen(false) }} />
        </div >
    )
}

export default BulletinBoad