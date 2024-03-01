import React from 'react'

type Props = {}

const Loading = (props: Props) => {
    return (
        <div className='center' style={{ "height": "100vh" }}>
            <p>このウェブサイトは読み込み中です</p>
            <p>お待ちください。</p>
        </div>
    )
}

export default Loading