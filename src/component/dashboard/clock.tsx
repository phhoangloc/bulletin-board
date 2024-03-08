import React, { useState } from 'react'

type Props = {}

const Clock = (props: Props) => {
    const [day, setDay] = useState<number>(0)
    const [month, setMonth] = useState<number>(0)
    const [hours, setHours] = useState<String>("")
    const [minutes, setMinutes] = useState<String>("")
    const [seconds, setSeconds] = useState<String>("")

    function updateClock() {
        const now = new Date();
        setDay(now.getDate())
        setMonth(now.getMonth())
        setHours(now.getHours().toString().padStart(2, "0"))
        setMinutes(now.getMinutes().toString().padStart(2, "0"))
        setSeconds(now.getSeconds().toString().padStart(2, "0"))
    }

    setInterval(() => {
        updateClock()
    }, 1000)
    return (
        <div className='clock'>
            <div className='date'>{month + 1}月{day}日</div>
            <h2>{hours}:{minutes}:{seconds}</h2>
        </div>
    )
}

export default Clock