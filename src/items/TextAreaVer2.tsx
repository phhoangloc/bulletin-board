import { LegacyRef, useEffect } from 'react'
import React, { useRef, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ButtonUpload from './ButtonUpload';
import Button from './Button';
import axios from 'axios';

type TextAreaType = {
    id?: String
    name: string,
    value: string,
    onInput: (e: any) => void
}

const TextAreaV2 = ({
    id,
    name,
    value,
    onInput

}: TextAreaType) => {

    const [focus, setFocus] = useState<boolean>(false)
    const inputRef = useRef<any>()
    const [inputModal, setInputModal] = useState<boolean>(false)
    const [link, setLink] = useState<string>("")
    const getFile = async (e: any) => {
        var file = e.target.files[0];
        var reader: any = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            inputRef.current.innerHTML += `<img src=${reader.result} />`
            onInput(inputRef.current.innerHTML)
        }

    }
    const getLink = (link: string) => {
        inputRef.current.innerHTML += `<div><a href=${link} target="_blank">${link}</a></div>`
        setInputModal(false)
        setLink("")
        onInput(inputRef.current.innerHTML)
    }


    useEffect(() => {
        value === "" ? inputRef.current.innerHTML = "" : null
    }, [value])

    useEffect(() => {
        const getPostbyId = async (id: String) => {
            const result = await axios.get(`/api/auth/post?id=${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.token,
                    }

                })
            if (result.data.success) {
                inputRef.current.innerHTML = result.data.data.content
            }
        }
        id && getPostbyId(id)
    }, [id])

    return (
        <div className={`input ${focus ? "inputFocus" : ""} ${inputRef.current && inputRef.current.innerHTML ? "inputFocus inputBlur" : ""} `}>
            <p onClick={() => setFocus(true)}>{name}</p>
            <div className="inputBox" onClick={() => { setFocus(true) }}>
                <div className='textarea'
                    ref={inputRef}
                    contentEditable={true}
                    onInput={(e) => { onInput(e.currentTarget.innerHTML) }}
                    onFocus={() => setFocus(true)}
                    onBlur={() => { setFocus(false) }}
                >
                </div>
            </div>
            <div className='tool_news'>
                <ButtonUpload icon={<AddPhotoAlternateIcon />} onChange={(e) => { setFocus(true); getFile(e) }} />
                <InsertLinkIcon onClick={() => { setInputModal(!inputModal); setFocus(true) }} />
                <div className={`input_modal ${inputModal ? "input_modal_open" : ""}`}>
                    <input className='input_text' value={link} onChange={(e) => setLink(e.target.value)} />
                    <Button name='insert link' onClick={() => link && getLink(link)} />
                </div>
            </div>
        </div>
    )
}

export default TextAreaV2