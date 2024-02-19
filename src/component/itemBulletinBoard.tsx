import React, { useState, useEffect } from 'react'
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TextArea from '@/items/TextArea';
import { UserLogin } from '@/redux/reducer/UserReducer';
import store from '@/redux/store';
import moment from 'moment';
import axios from 'axios';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useRouter } from 'next/navigation';
import ItemLoading from './itemLoading';
import Loading from '@/app/loading';
type Props = {
    post: { _id: string, nicknameId: { _id: string, nickname: string }, title: string, content: string, createDate: Date },
    func: (postId: String) => void
}

const ItemBulletinBoard = ({ post, func }: Props) => {
    const toPage = useRouter()
    const [user, setCurrentUser] = useState<UserLogin | undefined>(store.getState().user)
    const [number, setCurrentNumber] = useState<number>(0)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentNumber(store.getState().refresh))
    }

    update()

    const [postId, setPostId] = useState<String | undefined>()
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

    const [loading, setLoading] = useState<boolean>(false)

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
        setLoading(true)
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
        if (nextResult.data.data.length !== 0) {
            setNextComment(true)
        } else {
            setNextComment(false)
        }
        setLoading(true)
    }
    const sendComment = async (comment: String) => {
        const result = comment && await axios.post("/api/auth/comment", { postId: postId, content: comment },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        getComment(postId)
        setComment("")
        setPageCommnet(1)
        setRefresh(refresh + 1)
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
        getComment(postId)
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
        getComment(postId)
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        postId && getComment(postId)
    }, [pageComment])

    useEffect(() => {
        countComment(post._id)
    }, [refresh])

    return (
        <div>
            <div className="msg" >
                <div className="author">{post.nicknameId?.nickname} <span>{moment(post.createDate).format('YY/MM/DD HH:mm')}</span></div>
                <div className="content">
                    <div className="content_title">
                        <p>{post?.title}</p>
                        {user && user.id === post.nicknameId?._id &&
                            <EditOutlinedIcon onClick={() => toPage.push(`/post/${post._id}`)} />
                        }
                    </div>
                    <div className="content_content" dangerouslySetInnerHTML={{ __html: post ? post.content.replace(/\n/g, '<br>') : "" }}>
                    </div>
                </div>
                <div className='tool'>
                    {postId ?
                        <CloseIcon onClick={() => { setPostId(undefined) }} /> :
                        <CommentOutlinedIcon onClick={() => { setPostId(post._id), getComment(post._id), setPageCommnet(1) }} />
                    }
                    <p className='commentNumber'>{CommentNumber}</p>
                </div>
            </div>
            <div className={`reply ${postId === post._id ? "reply-on" : ""}`}>
                <div className="reply-input">
                    <TextArea name="コメント。。。" value={comment} onChange={(e) => setComment(e.target.value)} />
                    <SendIcon onClick={() => sendComment(comment)} />
                </div>
                <div className="comments">
                    {
                        postId && comments.length ?
                            comments.map((com, index) =>
                                <div className="replyItem" key={index}>
                                    <div className="author"><span>{moment(com.createDate).format('YY/MM/DD HH:mm')}</span><br></br>{com.nicknameId.nickname}  </div>
                                    <div className="content">
                                        {commentEditcontent && commentIndex === index ?
                                            <div className="editCommentBox">
                                                <textarea onChange={(e) => setCommentContent(e.target.value)} value={commentContent} />
                                                <button onClick={() => { editComment() }}>確認</button>
                                                <button onClick={() => { setcommentEditContent(false) }}>キャンセル</button>
                                            </div> :
                                            <p className='text'>{com.content}</p>}
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
                            ) :
                            null
                    }
                    {
                        postId && comments.length ?
                            <div className='page-comment'>
                                {pageComment === 1 ? null : <span onClick={() => { setPageCommnet(pre => pre - 1); setComments([]) }}>前に<ArrowLeftIcon /></span>}
                                {nextComment ? <span onClick={() => { setPageCommnet(pre => pre + 1); setComments([]) }}><ArrowRightIcon />つづき</span> : null}
                            </div> :
                            loading ? <div className='page-comment'><ItemLoading /></div> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default ItemBulletinBoard