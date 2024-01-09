'use client'
import React from 'react'
import { dividerColumType } from '@/type/propType'

const Divider_Column = ({ data }: dividerColumType) => {

    //return data

    const reCom =
        Object.keys(data).map((item, index) =>
            <div className="divider_colum" key={index}>
                <p ><span>{item}</span><br></br>{Object.values(data)[index]}</p>
            </div>
        )



    return reCom
}

export default Divider_Column