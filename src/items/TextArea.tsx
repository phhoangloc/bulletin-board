import React, { useState } from 'react'
import { InputType } from '@/type/propType'

const TextArea = ({ dis, type, name, value, onChange, warn }: InputType) => {
    const [focus, setFocus] = useState<boolean>(false)
    return (
        <div className={`input ${focus ? "inputFocus" : ""} ${value ? "inputFocus inputBlur" : ""} ${dis ? "inputDisable" : ""}`}>
            <p>{name}</p>
            <div className="inputBox" onClick={() => { setFocus(true) }}>
                <textarea
                    disabled={dis ? dis : false}
                    value={value}
                    onChange={(e) => onChange(e)}
                    onFocus={() => { setFocus(true) }}
                    onBlur={() => setFocus(false)}>
                </textarea>
            </div>
            {warn ? <p className='warn'>{warn}</p> : null}
        </div>
    )
}

export default TextArea