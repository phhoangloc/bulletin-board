import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Oswald } from 'next/font/google'

const oswald = Oswald({
    subsets: ['latin'],
    weight: ["300", "400", "500", "700"]
})
const Footer = () => {
    return (
        <div className="footer">
            <div className='footer_bottom center'>
                <p><Link href={"#"}>トップページ</Link></p>
                Copyrights ASTEM CO.,LTD.
            </div>
        </div>
    )
}

export default Footer