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
            <div className='footer_top'>
                <div className="left">
                    <h1 className={oswald.className}>About Us ？</h1>
                    <div className="title">
                        ぱるサ掲示板ってなにするところ？
                    </div>
                    <div className="detail">
                        ここではるサ（パルコープ 応援サーター）の
                        みなさんだけが書き込みできる交流掲示板です。
                    </div>
                </div>
                <div className="right">
                    <Image src="/img/footer.png" width={500} height={500} alt='' />
                </div>
            </div>
            <div className='footer_bottom center'>
                <p><Link href={"#"}>トップページ</Link></p>
                Copyrights ASTEM CO.,LTD.
            </div>
        </div>
    )
}

export default Footer