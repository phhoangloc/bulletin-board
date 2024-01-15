import { useEffect, useState } from 'react'
import React from 'react'
import store from '@/redux/store'
import { UserLogin } from '@/redux/reducer/UserReducer'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import TextArea from '@/items/TextArea';
import axios from 'axios';
import { setRefresh } from '@/redux/reducer/RefreshReducer';
import ModalEdit from './modalEdit';
import moment from 'moment';
import CommentIcon from '@mui/icons-material/Comment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ItemBulletinBoard from './itemBulletinBoard';
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

        store.dispatch(setRefresh())
        setinfor("")
    }

    const [posts, setPosts] = useState<{ _id: string, nicknameId: { _id: string, nickname: string }, content: string, createDate: Date }[]>([])
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [postId, setPostId] = useState<String | undefined>()
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [commentIndex, setCommentIndex] = useState<number>(-1)
    const [commentId, setCommentId] = useState<String>("")
    const [commentEditModal, setcommentEditModal] = useState<boolean>(false)
    const [commentEditcontent, setcommentEditContent] = useState<boolean>(false)
    const [commentContent, setCommentContent] = useState<string>("")
    const [comment, setComment] = useState<string>("")
    const [pageComment, setPageCommnet] = useState<number>(1)
    const [limitComment, setLimitComment] = useState<number>(10)
    const [nextComment, setNextComment] = useState<boolean>(false)

    const getPost = async () => {
        const result = await axios.get(`/api/post?limit=${limit}&sort=true&skip=${(page - 1) * limit}`)
        if (result.data.success) {
            setPosts(result.data.data)
        }
    }

    useEffect(() => {
        getPost()
    }, [number, page])

    const CommentNumber = (id: any) => {
        const [number, setNumber] = useState<any>(0)
        const getCommentNumber = async () => {
            const result = await axios.get('/api/auth/comment?postId=' + id.id,

                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.token,
                    }

                }
            )
            // console.log(result)
            setNumber(result.data.data.length);
        }
        useEffect(() => {
            getCommentNumber()
        }, [])

        return number !== 0 ? <p className='commentNumber'>{number}</p> : null
    }
    return (
        <div className='board'>
            <p className='welcome'>こんにちは、{user?.nickname} </p>
            <p className='logout' onClick={() => { localStorage.clear(); window.location.reload() }}>ログアウト</p>
            <div className="create-news">
                <TextArea name='情報' value={infor} onChange={(e) => setinfor(e.target.value)} />
                <SendIcon onClick={() => createPost(infor)} />
            </div>
            <div className='item'>
                {
                    posts.map((item, index) =>
                        <ItemBulletinBoard post={item} key={index} func={(modalOpen, postId) => { setModalOpen(modalOpen), setPostId(postId) }} />
                    )
                }

                <div className="page">
                    {limit * (page - 1) > 0 && <p onClick={() => { setPage(pre => pre - 1) }}><SkipPreviousIcon /></p>}
                    {page && <p>{page}</p>}
                    {posts.length - limit >= 0 && <p onClick={() => { setPage(pre => pre + 1) }}><SkipNextIcon /></p>}
                </div>

            </div>
            <ModalEdit id={postId} modalOpen={modalOpen} cancel={() => { setPostId(""); setModalOpen(false) }} />
        </div >
    )
}

export default BulletinBoad