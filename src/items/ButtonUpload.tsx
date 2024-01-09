import React, { useRef } from 'react'
import { ButtonUploadType } from '@/type/propType';
import UploadIcon from '@mui/icons-material/Upload';

const ButtonUpload = ({ onChange, multiple }: ButtonUploadType) => {
    const btnUp = useRef<any>()
    return (
        <div className='buttonUpload'>
            <input ref={btnUp} type="file" onChange={onChange} multiple={multiple ? true : false} style={{ display: "none" }} />
            <UploadIcon onClick={() => btnUp.current.click()} />
        </div>
    )
}

export default ButtonUpload