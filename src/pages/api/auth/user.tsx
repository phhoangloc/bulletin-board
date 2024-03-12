import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
import { isDataType } from '@/type/resultType'
const jwt = require('jsonwebtoken')
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query
    const method = req.method
    const body = req.body
    let result: isDataType = { success: false };
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const id = token && await jwt.verify(token, 'secretToken').id
    connectMongoDB()
    switch (method) {
        case "GET":
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
            break;
        case "PUT":
            const end = new Date()
            const user = await userModel.findOne({ "_id": id }, "stayAtHome stayAtPost")
            const stayAtHome = user?.stayAtHome
            stayAtHome && await userModel.updateOne({ "_id": id }, { stayAtHome: [...stayAtHome, { start: body.start, end: end }] })
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
}