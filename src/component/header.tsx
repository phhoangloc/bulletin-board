import Image from 'next/image'
import React from 'react'

const Header = () => {
    return (
        <div className='header'>
            <Image src={"/img/header_logo.gif"} width={200} height={40} alt='headerlogo' />
        </div>
    )
}

export default Header