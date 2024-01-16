import React, { useRef } from 'react'
import { ButtonUploadType } from '@/type/propType';
import UploadIcon from '@mui/icons-material/Upload';

const ButtonUpload = ({ icon, onChange, multiple }: ButtonUploadType) => {
    const btnUp = useRef<any>()
    return (
        <div className='buttonUpload'>
            <input ref={btnUp} type="file" onChange={onChange} multiple={multiple ? true : false} style={{ display: "none" }} />
            <div onClick={() => btnUp.current.click()}>
                {icon ? icon : <UploadIcon />}
            </div>
        </div>
    )
}

export default ButtonUpload