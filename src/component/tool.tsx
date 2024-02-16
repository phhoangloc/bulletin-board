import React, { useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
type Props = {
    func: (e: string) => void
}

const Tool = ({ func }: Props) => {
    const inputRef = useRef<any>("")
    const [toolOn, setToolOn] = useState<boolean>(false)


    return (
        <div className={`tool_search ${toolOn ? "toolOn" : ""}`}>
            <input ref={inputRef} onChange={(e) => func(e.target.value)} placeholder='検索' />
            {toolOn ?
                <CloseIcon onClick={() => { setToolOn(false); func(""); inputRef.current.value = "" }} />
                : <SearchIcon onClick={() => {
                    setToolOn(true);
                    setTimeout(() => {
                        inputRef.current.focus()
                    }, 500)
                }}
                />}
        </div>
    )
}

export default Tool