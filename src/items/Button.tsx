import React from 'react'
import { ButtonType } from '@/type/propType'

const Button = ({ name, onClick }: ButtonType) => {
    return (
        <div className='button'>
            <button onClick={() => onClick()}>{name}</button>
        </div>
    )
}

export default Button