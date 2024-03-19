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
import moment from 'moment'
import CloseIcon from '@mui/icons-material/Close';
import ItemLoading from './itemLoading'
import SendIcon from '@mui/icons-material/Send';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SyncIcon from '@mui/icons-material/Sync';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
type Props = {
    id?: String,
    modalOpen: Boolean
    cancel(): void
}

const ModalView = ({ modalOpen, id, cancel }: Props) => {

    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }

    update()


    const [post, setPost] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const [sending, setSending] = useState<boolean>(false)
    const [like, setLike] = useState<boolean>(false)
    const [likes, setLikes] = useState<string[]>([])
    const [commentIndex, setCommentIndex] = useState<number>(-1)
    const [commentId, setCommentId] = useState<String>("")
    const [commentEditModal, setcommentEditModal] = useState<boolean>(false)
    const [commentEditcontent, setcommentEditContent] = useState<boolean>(false)
    const [commentContent, setCommentContent] = useState<string>("")


    const [pageComment, setPageComment] = useState<number>(1)
    const [limitComment, setLimitComment] = useState<number>(10)
    const [refresh, setRefresh] = useState<number>(0)
    const [refreshLike, setRefreshLike] = useState<number>(0)

    const getPostbyId = async (id: String) => {
        const result = await axios.get(`/api/auth/post?id=${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })

        if (result.data.success) {
            setLoading(false)
            setPost(result.data.data[0])
            setLikes(result.data.data[0].likes)
        }
    }

    useEffect(() => {
        id && getPostbyId(id)
    }, [id, refresh, pageComment])


    const [comment, setComment] = useState<string>("")
    const sendComment = async (comment: String) => {
        setSending(true)
        const result = comment && await axios.post("/api/auth/comment", { postId: id, content: comment },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })

        if (result.data.success) {
            setSending(false)
            setComment("")
            setPageComment(1)
            setRefresh(refresh + 1)
        }
    }

    const editComment = async () => {
        const result = await axios.put(`/api/auth/comment?id=${commentId}`,
            { content: commentContent },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        setCommentContent("")
        setcommentEditContent(false)
        setRefresh(refresh + 1)
    }

    const deleteComment = async () => {
        await axios.delete(`/api/auth/comment?id=${commentId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        setRefresh(refresh + 1)
    }

    const likeAPost = async (id: string) => {
        const result = await axios.post(`/api/auth/like?id=${id}`,
            { likes },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
    }

    useEffect(() => {
        refreshLike && likeAPost(post?._id)
    }, [refreshLike])

    return (
        <div className={`modalView center ${modalOpen ? "modalOpen" : ""} `}>
            <div className="box modalView_box grid_box">
                <CloseIcon onClick={() => { cancel && cancel(); setLoading(true); setPost([]) }} />
                <div className="view_content">
                    {loading ? <ItemLoading /> : <div className="author"> {post?.nicknameId?.nickname} <span>{moment(post?.createDate).format('YY/MM/DD HH:mm')}</span></div>}
                    <div className="content">
                        {loading ? <ItemLoading /> : <>
                            <div className="content_title">
                                <p>{post?.title}</p>
                            </div>
                            <div className="content_content" dangerouslySetInnerHTML={{ __html: post ? post.content.replace(/\n/g, '<br>') : "" }}>
                            </div></>}
                    </div>
                </div>

                <div className="view_comment">
                    <div className='view_comment_header'>
                        <p className='like_count'>{user?.id && likes.includes(user?.id) ?
                            < FavoriteIcon onClick={() => { setLike(false), setLikes((p) => p.filter((item: string) => item != user?.id)), setRefreshLike(refreshLike + 1) }} /> :
                            <FavoriteBorderOutlinedIcon onClick={() => { setLike(true), setLikes((p) => user?.id ? [...p, user?.id] : [...p]), setRefreshLike(refreshLike + 1) }} />}いい（{likes.length}）</p>
                        <p className='comment_count'>コメント（{post?.comments?.length}）</p>
                    </div>
                    <div className="reply-input">
                        <TextArea name="コメント..." value={comment} onChange={(e) => setComment(e.target.value)} />
                        {sending ? <SyncIcon /> : <SendIcon onClick={() => sendComment(comment)} />}
                    </div>
                    <div className="comments">
                        {
                            id && post?.comments?.length ?
                                post?.comments?.slice((pageComment - 1) * limitComment, limitComment + (limitComment * (pageComment - 1))).map((com: any, index: number) =>
                                    <div className="replyItem" key={index}>
                                        <div className="author"><span>{moment(com.createDate).format('YY/MM/DD HH:mm')}</span><br></br>{com.nicknameId?.nickname}  </div>
                                        <div className="content">
                                            {commentEditcontent && commentIndex === index ?
                                                <div className="editCommentBox">
                                                    <textarea onChange={(e) => setCommentContent(e.target.value)} value={commentContent} />
                                                    <button onClick={() => { editComment() }}>確認</button>
                                                    <button onClick={() => { setcommentEditContent(false) }}>キャンセル</button>
                                                </div> :
                                                <p className='text'>{com.content}</p>
                                            }
                                            {com.nicknameId._id.toString() === user?.id?.toString() && commentEditcontent === false ?
                                                <MoreHorizIcon onClick={() => { setcommentEditModal(!commentEditModal); setCommentIndex(index); setCommentId(com._id.toString()) }} /> :
                                                null}
                                            {com.nicknameId._id.toString() === user?.id?.toString() ?
                                                <div className={`commentEditModal ${commentEditModal && commentIndex === index ? "commentEditModalBlock" : ""}`} onMouseLeave={() => setcommentEditModal(false)}>
                                                    <p className='item' onClick={() => { setcommentEditContent(true), setcommentEditModal(false), setCommentContent(com.content.toString()) }}>編集</p>
                                                    <p className='item' onClick={() => deleteComment()}>削除</p>
                                                </div> :
                                                null}
                                        </div>
                                    </div>
                                ) :
                                null
                        }
                        {
                            id && post?.comments?.length ?
                                <div className='page-comment'>
                                    {pageComment === 1 ? null : <p onClick={() => { setPageComment(pre => pre - 1) }}><ArrowLeftIcon /></p>}
                                    <p>{pageComment}</p>
                                    {post?.comments?.[(pageComment * limitComment) + 1] ? <p onClick={() => { setPageComment(pre => pre + 1); }}><ArrowRightIcon /></p> : null}
                                </div> :
                                loading ? <div className='page-comment'><ItemLoading /></div> : null
                        }
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ModalView