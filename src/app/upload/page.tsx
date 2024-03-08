"use client"
import ButtonUpload from '@/items/ButtonUpload'
import React, { useEffect, useState } from 'react'
import Papa from "papaparse";
import Button from '@/items/Button';
import axios from 'axios';

const Upload = () => {

    const [lists, setLists] = useState<any>([])

    const handleFileChangeParent = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        if (file) {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                encoding: 'UTF-8',
                complete: (result) => {
                    setLists(result.data)
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                },
            });
        }
    };
    const save = async (lists: any) => {
        lists.map(async (item: any, index: any) => {
            const number = await axios.get(`/api/user_number?userNumber=` + item.userNumber)
            if (number.data.length) {
                axios.put("/api/user_number?id=" + number.data[0]._id, item)
            }
            else {
                axios.post("/api/user_number", item)
            }

            console.log("update success")
        })

        const users = await axios.get("/api/user_number")
        if (users.data.length > lists.length) {
            const lmap = lists.map((item: any) => item.userNumber)
            users.data.map(async (user: any) => {
                if (!lmap.includes(user.userNumber)) {
                    await axios.delete("/api/user_number?userNumber=" + user.userNumber)
                }
            })
        }
    }
    const getList = async () => {
        const result = await axios.get(`/api/user_number`)
        if (result.data.length) {
            setLists(result.data)
        } else {
            setLists([])
        }
    }
    useEffect(() => {
        getList()
    }, [])

    return (
        <div className='upload'>
            <h1>Upload</h1><ButtonUpload onChange={(e) => handleFileChangeParent(e)} />
            <Button name='save' onClick={() => save(lists)} />
            <table>
                <thead>
                    <tr><td>メンバー番号</td><td>名前</td></tr>
                </thead>
                <tbody>
                    {
                        lists.map((item: any, index: any) =>
                            <tr key={index}>
                                <td>{item.userNumber}</td>
                                <td>{item.name}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Upload