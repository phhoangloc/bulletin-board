import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <div className='header'>
            <Link href={"/"}><Image src={"/img/header_logo.gif"} width={200} height={40} alt='headerlogo' /></Link>
        </div>
    )
}

export default Header