import Image from 'next/image'
import React from 'react'

type Props = {}

const Header = (props: Props) => {
    return (
        <div className='header'>
            <Image src={"/img/header_logo.gif"} width={50} height={40} alt='headerlogo' />
        </div>
    )
}

export default Header