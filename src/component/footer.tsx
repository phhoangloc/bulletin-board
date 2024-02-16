import React from 'react'
import Link from 'next/link'
type Props = {}

const Footer = (props: Props) => {
    return (
        <div className='footer center'>
            <p><Link href={"#"}>トップページ</Link></p>
            Copyrights ASTEM CO.,LTD.
        </div>
    )
}

export default Footer