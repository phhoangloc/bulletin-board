import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
import { isDataType } from '@/type/resultType'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query
    let result: isDataType = { success: false };
    connectMongoDB()

    await userModel
        .find({}, "nickname email posts stayAtHome stayAtPost")
        .populate("posts", "title")
        .catch((error: Error) => {
            result.success = false
            result.message = error.message
            res.send(result)
            throw error.message
        }).then(async (data: any) => {
            result.success = true
            result.data = data
            res.json(result)
        })
}