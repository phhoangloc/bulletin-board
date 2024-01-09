import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query

    connectMongoDB()

    await userModel
        .find(query.nickname ? { "nickname": query.nickname } : {})
        .find(query.email ? { "email": query.email } : {})
        .catch((error: Error) => {
            res.json(false)
            throw error.message
        })
        .then((data: any) => {
            data[0] ? res.json(true) : res.json(false)
        })
}