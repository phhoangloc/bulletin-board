import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
type Props = {
    func: (e: string) => void
}

const Tool = ({ func }: Props) => {
    const [toolOn, setToolOn] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")

    return (
        <div className={`tool_search ${toolOn ? "toolOn" : ""}`}>
            <SearchIcon onClick={() => setToolOn(!toolOn)} />
            <input onChange={(e) => func(e.target.value)} placeholder='検索' />
        </div>
    )
}

export default Tool