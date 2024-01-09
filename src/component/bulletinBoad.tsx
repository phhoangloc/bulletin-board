import { useEffect, useState } from 'react'
import React from 'react'
import store from '@/redux/store'
import { UserLogin } from '@/redux/reducer/UserReducer'
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import Icon from '@/items/Icon';
import TextArea from '@/items/TextArea';
import axios from 'axios';
import { setRefresh } from '@/redux/reducer/RefreshReducer';
import ModalEdit from './modalEdit';
import moment from 'moment';
import CommentIcon from '@mui/icons-material/Comment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
    const [limitComment, setLimitComment] = useState<number>(2)
    const getPost = async () => {
        const result = await axios.get(`/api/post?limit=${limit}&sort=true&skip=${(page - 1) * limit}`)
        if (result.data.success) {
            setPosts(result.data.data)
        }
    }

    useEffect(() => {
        getPost()
    }, [number, page])

    const [comments, setComments] = useState<{ _id: String, postId: String, nicknameId: { _id: String, nickname: String }, content: String, createDate: Date }[]>([])

    const getComment = async (id: String | undefined) => {
        const result = await axios.get(`api/auth/comment?postId=${id}&limit=${limitComment}&skip=${(pageComment - 1) * limitComment}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })

        if (result.data.success) {
            setComments(result.data.data)
        }
    }

    const sendComment = async (comment: String) => {
        const result = comment && await axios.post("api/auth/comment", { postId: postId, content: comment },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        getComment(postId)
        setComment("")
        setPageCommnet(1)

    }

    const editComment = async () => {
        const result = await axios.put(`api/auth/comment?id=${commentId}`,
            { content: commentContent },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        setCommentContent("")
        setcommentEditContent(false)
        getComment(postId)
    }

    const deleteComment = async () => {
        const result = await axios.delete(`api/auth/comment?id=${commentId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        getComment(postId)
    }

    useEffect(() => {
        postId && getComment(postId)
    }, [pageComment])

    return (
        <div className='board'>
            <p className='welcome'>こんにちは、{user && user.nickname} </p>
            <p className='logout' onClick={() => { localStorage.clear(); window.location.reload() }}>ログアウト</p>
            <div className="create-news">
                <TextArea name='情報' value={infor} onChange={(e) => setinfor(e.target.value)} />
                <SendIcon onClick={() => createPost(infor)} />
            </div>
            <div className='item'>
                {
                    posts.map((item, index) =>
                        <div key={index}>
                            <div className="msg" >
                                <div className="author">{item.nicknameId.nickname} <span>{moment(item.createDate).format('YY/MM/DD HH:mm')}</span></div>
                                <div className="content" dangerouslySetInnerHTML={{ __html: item ? item.content.replace(/\n/g, '<br>') : "" }}>
                                </div>
                                <div className='tool'>
                                    {user && user.id === item.nicknameId._id &&
                                        <EditIcon onClick={() => { setPostId(item._id); setModalOpen(true) }} />
                                    }
                                    <CommentIcon onClick={() => { setPostId(item._id), setComments([]) }} />
                                </div>
                            </div>
                            <div className={`reply ${postId === item._id ? "reply-on" : ""}`}>
                                <p className='text-comment' onClick={() => { getComment(postId), setPageCommnet(1) }}>コメントをもっと読みます。</p>
                                {postId && comments.length ?
                                    comments.map((com, index) =>
                                        <div className="replyItem" key={index}>
                                            <div className="author">{com.nicknameId.nickname}</div>
                                            <div className="content">
                                                {commentEditcontent && commentIndex === index ?
                                                    <div className="editCommentBox">
                                                        <textarea onChange={(e) => setCommentContent(e.target.value)} value={commentContent} />
                                                        <button onClick={() => { editComment() }}>確認</button>
                                                        <button onClick={() => { setcommentEditContent(false) }}>キャンセル</button>
                                                    </div> :
                                                    <p className='text'>{com.content}</p>}
                                                {com.nicknameId._id.toString() === user?.id?.toString() ? <MoreHorizIcon onClick={() => { setcommentEditModal(!commentEditModal); setCommentIndex(index); setCommentId(com._id.toString()) }} /> : null}
                                                {com.nicknameId._id.toString() === user?.id?.toString() ?
                                                    <div className={`commentEditModal ${commentEditModal && commentIndex === index ? "commentEditModalBlock" : ""}`} onMouseLeave={() => setcommentEditModal(false)}>
                                                        <p className='item' onClick={() => { setcommentEditContent(true), setcommentEditModal(false), setCommentContent(com.content.toString()) }}>編集</p>
                                                        <p className='item' onClick={() => deleteComment()}>削除</p>
                                                    </div> :
                                                    null}
                                            </div>
                                        </div>
                                    ) : null}
                                {comments.length ? <p className='page-comment'><span onClick={() => setPageCommnet(pre => pre + 1)}>つづき</span></p> : null}

                                {/* <ModalComment id={postId} /> */}
                                <div className="reply-input">
                                    <TextArea name="コメント。。。" value={comment} onChange={(e) => setComment(e.target.value)} />
                                    <SendIcon onClick={() => sendComment(comment)} />
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="page">
                    {limit * (page - 1) > 0 && <p onClick={() => { setPage(pre => pre - 1) }}>prev</p>}
                    {page && <p>{page}</p>}
                    {posts.length - limit >= 0 && <p onClick={() => { setPage(pre => pre + 1) }}>next</p>}
                </div>

            </div>
            <ModalEdit id={postId} modalOpen={modalOpen} cancel={() => { setPostId(""); setModalOpen(false) }} />
        </div>
    )
}

export default BulletinBoad