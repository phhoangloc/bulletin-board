'use client'
import React, { useState } from 'react'
import { InputType } from '@/type/propType'
import '../style/style.css'
const Input = ({ dis, type, name, value, onChange, warn }: InputType) => {
    const [focus, setFocus] = useState<boolean>(false)

    return (
        <div className={`input ${focus ? "inputFocus" : ""} ${value ? "inputFocus inputBlur" : ""} ${dis ? "inputDisable" : ""}`}>
            <p>{name}</p>
            <div className="inputBox">
                <input
                    disabled={dis ? dis : false}
                    type={`${type ? type : "text"}`}
                    value={value}
                    onChange={(e) => onChange(e)}
                    onFocus={() => { setFocus(true) }}
                    onBlur={() => setFocus(false)}>
                </input>
            </div>
            {warn ? <p className='warn'>{warn}</p> : null}
        </div>
    )
}

export default Input