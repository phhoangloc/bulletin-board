'use client'
import React from 'react'
import { dividerType } from '@/type/propType'
import { useRouter } from 'next/navigation'

const Divider = ({ data, func }: dividerType) => {

    //useRouter
    const router = useRouter()

    //return data
    const iconReturn =

        data.map((item, i) =>
            <div className="divider" key={i} onClick={() => { func && func(i); router.push('/' + item.url) }}>
                {item.name}
            </div>
        )

    return iconReturn
}

export default Divider