'use client'
import React, { useState } from 'react'
import { iconType } from '@/type/propType'
import { changeArrayFunctionType } from '@/type/functionType'
import "../style/style.css"
const Icon = ({ data, func }: iconType) => {

    const [i, setI] = useState<number>(0)

    const changeI = ({ data, i }: changeArrayFunctionType) => {
        i < data.length - 1 ? setI(i + 1) : setI(0)
    }

    //return data
    const iconReturn =
        <div className="icon" onClick={() => { changeI({ data, i }), func && func(i) }}>
            {data[i]}
        </div>

    return iconReturn
}

export default Icon