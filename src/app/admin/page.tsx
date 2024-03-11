'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Clock from '@/component/dashboard/clock'
import ItemLoading from '@/component/itemLoading'
import moment from 'moment'

type Props = {}

const Admin = (props: Props) => {

    const [user, setUser] = useState<any>([])
    const [post, setPost] = useState<any>([])
    const [loading1, setLoading1] = useState<boolean>(true)
    const [loading2, setLoading2] = useState<boolean>(true)
    const getUser = async () => {
        const result = await axios.get("/api/auth/user",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        if (result.data.success) {
            setLoading1(false)
            setUser(result.data.data)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    const getPost = async () => {
        const result = await axios.get("/api/auth/post",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token,
                }

            })
        if (result.data.success) {
            setLoading2(false)
            setPost(result.data.data)
        }
    }

    useEffect(() => {
        getPost()
    }, [])


    const DatesComponent = ({ data }: any) => {
        const dateArr = data.stayAtHome?.map((m: any, index: number) => moment(m.start).format('YYYY/MM/DD'))
        const dates = dateArr?.filter((f: any, index: number) => index === dateArr.indexOf(f))
        return (
            dates?.map((date: any, index: number) => <p key={index}>{date}</p>)
        )
    }

    const TimesComponent = ({ data }: any) => {
        const dateArr = data.stayAtHome?.map((m: any, index: number) => moment(m.start).format('YYYY/MM/DD'))
        const dates = dateArr?.filter((f: any, index: number) => index === dateArr.indexOf(f))

        const durationArr = data.stayAtHome?.map((m: any) => {
            const date = moment(m.start).format('YYYY/MM/DD')
            const duration = moment(m.end).diff(moment(m.start))
            return { date, duration }
        })
        const durations = dates.map((m: any) => {
            const result = durationArr.filter((f: any) => f.date === m)
            const sum = result?.reduce((total: any, item: any) => total + item.duration, 0);
            return sum
        })
        return (
            // <p>hello</p>
            durations.map((d: any, index: number) =>
                <p key={index}>{d ?
                    Math.floor((d / 3600000) % 60).toString().padStart(2, "0") + ":" +
                    Math.floor((d / 60000) % 60).toString().padStart(2, "0") + ":" +
                    Math.floor((d / 1000) % 60).toString().padStart(2, "0")
                    : "00:00:00"}</p>
            )
        )
    }
    return (
        <div className="admin_main_right grid_box">
            <div className='card xs12 sm6 '>
                <Clock />
            </div>
            <div className='card xs12'>
                <div className="title">メンバー</div>
                <div className='userItem'>
                    <div className='col1'>ニックネーム</div><div className='col2'>イメール</div><div className='count'>ポスト</div>
                </div>
                {loading1 ? <ItemLoading /> :
                    user?.sort((a: any, b: any) => b.posts.length - a.posts.length)
                        .slice(0, 5)
                        .map((item: any, index: number) =>
                            <div className='userItem' key={index}>
                                <div className='col1'>{item.nickname}</div>
                                <div className='col2'>{item.email}</div>
                                <div className='count'>{item.posts.length}</div>
                            </div>)}
            </div>
            <div className='card xs12'>
                <div className="title">滞在時間</div>
                <div className='userItem'>
                    <div className='col1'>ニックネーム</div><div className='col1'><p>日付</p></div><div className='col1'><p>時間/日</p></div>
                </div>
                {loading1 ? <ItemLoading /> :
                    user?.map((item: any, index: number) =>
                        <div className='userItem' key={index}>
                            <div className='col1'>{item.nickname}</div>
                            <div className='col1'>
                                <DatesComponent data={item} />
                            </div>
                            <div className='col1'>
                                <TimesComponent data={item} />
                            </div>
                        </div>)}
            </div>
            <div className='card xs12'>
                <div className="title">投稿</div>
                <div className='userItem'>
                    <div className='col3'>タイト</div>
                    <div ></div>
                    <div className='count'>コメント</div>
                </div>
                {loading2 ? <ItemLoading /> :
                    post?.sort((a: any, b: any) => b.comments.length - a.comments.length)
                        .slice(0, 5).map((item: any, index: number) =>
                            <div className='userItem' key={index}>
                                <div className='col3'>{item?.title ? item?.title : "タイトなし"}</div>
                                <div ></div>
                                <div className='count'>{item.comments.length}</div>
                            </div>)}
            </div>
        </div>

    )
}

export default Admin