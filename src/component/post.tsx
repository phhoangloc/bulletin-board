'use client'
import React, { useState, useEffect } from 'react'
import { UserLogin } from '@/redux/reducer/UserReducer'
import store from '@/redux/store'
import moment from 'moment'
import ModalEdit from './modalEdit'
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import TextArea from '@/items/TextArea'
import SendIcon from '@mui/icons-material/Send';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Loading from '@/app/loading'
import NotFound from '@/app/not-found'
import SyncIcon from '@mui/icons-material/Sync';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ItemLoading from './itemLoading'

type Props = {
    slug: string
}

const Post = ({ slug }: Props) => {
    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)
    const [number, setCurrentNumber] = useState<number>(0)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentNumber(store.getState().refresh))
    }

    update()

    const [item, setItem] = useState<any>()
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [postId, setPostId] = useState<String | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingCom, setLoadingCom] = useState<boolean>(false)
    const [sending, setSending] = useState<boolean>(false)
    const getPost = async () => {
        const result = await axios.get(`/api/post?id=${slug}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }
            })
        if (result.data.success) {
            setLoading(false)
            setItem(result.data.data[0])
        }
    }

    useEffect(() => {
        getPost()
    }, [])

    const [comments, setComments] = useState<{ _id: String, postId: String, nicknameId: { _id: String, nickname: String }, content: String, createDate: Date }[]>([])
    const [commentIndex, setCommentIndex] = useState<number>(-1)
    const [commentId, setCommentId] = useState<String>("")
    const [commentEditModal, setcommentEditModal] = useState<boolean>(false)
    const [commentEditcontent, setcommentEditContent] = useState<boolean>(false)
    const [commentContent, setCommentContent] = useState<string>("")
    const [comment, setComment] = useState<string>("")
    const [pageComment, setPageCommnet] = useState<number>(1)
    const [limitComment, setLimitComment] = useState<number>(10)
    const [nextComment, setNextComment] = useState<boolean>(false)
    const [CommentNumber, setCommentNumber] = useState<number>(0)
    const [refresh, setRefresh] = useState<number>(0)
    const [commentFocus, setcommentFocus] = useState<number>(0)
    const countComment = async (id: string) => {
        const result = await axios.get(`/api/auth/comment?postId=${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        setCommentNumber(result.data.data.length)
    }
    const getComment = async (id: String | undefined) => {
        setLoadingCom(true)
        const result = await axios.get(`/api/auth/comment?postId=${id}&limit=${limitComment}&skip=${(pageComment - 1) * limitComment}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        if (result.data.success) {
            setComments(result.data.data)
        }

        const nextResult = await axios.get(`/api/auth/comment?postId=${id}&limit=${limitComment}&skip=${(pageComment) * limitComment}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        if (nextResult.data.data?.length !== 0) {
            setNextComment(true)
        } else {
            setNextComment(false)
        }
        setLoadingCom(false)

    }
    const sendComment = async (slug: string, comment: String) => {
        setSending(true)
        const result = comment && await axios.post("/api/auth/comment", { postId: slug, content: comment },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        getComment(slug)
        setComment("")
        setPageCommnet(1)
        setRefresh(refresh + 1)
        result.data.success && setSending(false)
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
        getComment(slug)
        setRefresh(refresh + 1)
    }

    const deleteComment = async () => {
        const result = await axios.delete(`/api/auth/comment?id=${commentId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        getComment(slug)
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        getComment(slug)
    }, [pageComment])

    useEffect(() => {
        countComment(slug)
    }, [refresh])
    if (slug.length === 24) {
        return (
            loading ? <Loading /> :
                <div className='board'>
                    <div className='item'>
                        <div className="msg" >
                            <div className="author">{item?.nicknameId?.nickname} <span>{moment(item?.createDate).format('YY/MM/DD HH:mm')}</span></div>
                            <div className="content">
                                <div className="content_title content_title_post ">
                                    <p>{item?.title}</p>
                                </div>
                                <div className="content_content" dangerouslySetInnerHTML={{ __html: item ? item.content.replace(/\n/g, '<br>') : "" }}>
                                </div>
                            </div>
                        </div>
                        <div className='tool_slug'>
                            <p>修正{user?.id === item?.nicknameId?._id && <EditOutlinedIcon onClick={() => setModalOpen(true)} />}</p>
                            <p>コメント <CommentOutlinedIcon onClick={() => setcommentFocus(prev => prev + 1)} />
                                {CommentNumber !== 0 && <span className='commentNumber'>{CommentNumber}</span>}
                            </p>
                        </div>
                        <div className={`reply reply-on reply-on-slugpage`}>
                            <div className="reply-input">
                                <TextArea name="コメント。。。" value={comment} onChange={(e) => setComment(e.target.value)} isFocus={commentFocus} />
                                {sending ? <SyncIcon /> : <SendIcon onClick={() => sendComment(slug, comment)} />}
                            </div>

                            <div className="comments">
                                {comments.map((com, index) =>
                                    <div className="replyItem" key={index}>
                                        <div className="author"><span>{moment(com?.createDate).format('YY/MM/DD HH:mm')}</span> <br></br>{com.nicknameId.nickname}</div>
                                        <div className="content">
                                            {commentEditcontent && commentIndex === index ?
                                                <div className="editCommentBox">
                                                    <textarea onChange={(e) => setCommentContent(e.target.value)} value={commentContent} />
                                                    <button onClick={() => { editComment() }}>確認</button>
                                                    <button onClick={() => { setcommentEditContent(false) }}>キャンセル</button>
                                                </div> :
                                                <div className='text'>{com.content}</div>}
                                            {com.nicknameId._id.toString() === user?.id?.toString() ?
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
                                )}
                                {<div className='page-comment'>
                                    {comments.length ?
                                        <div className='page-comment'>
                                            {pageComment === 1 ? null : <span onClick={() => { setPageCommnet(pre => pre - 1); setComments([]) }}>前に<ArrowLeftIcon /></span>}
                                            {nextComment ? <span onClick={() => { setPageCommnet(pre => pre + 1); setComments([]) }}><ArrowRightIcon />つづき</span> : null}
                                        </div> :
                                        loadingCom ? <div className='page-comment'><ItemLoading /></div> : null}
                                </div>}
                            </div>
                        </div>
                        <ModalEdit id={slug} modalOpen={modalOpen} cancel={() => { setPostId(""); setModalOpen(false) }} />
                    </div >
                </div >
        )
    } else {
        return <NotFound />
    }
}

export default Post