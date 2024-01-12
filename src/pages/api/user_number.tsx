import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userNumberModel } from '@/model/userNumber.model'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    connectMongoDB()

    const method = req.method
    const body = req.body
    const query = req.query
    switch (method) {
        case "GET":
            await userNumberModel.find()
                .find(query.userNumber ? { "userNumber": query.userNumber } : {}).
                sort({ "userNumber": 1 })
                .catch((error: Error) => {
                    res.json(false)
                    throw error.message
                })
                .then((data: any) => {
                    res.json(data)
                })
            break;
        case "POST":
            await userNumberModel.create(body)
                .catch((error: Error) => {
                    res.json(false)
                    throw error.message
                })
                .then((data: any) => {
                    res.json(data)
                })
            break;
        case "PUT":
            await userNumberModel.updateOne({ "_id": query.id }, body)
                .catch((error: Error) => {
                    res.json(false)
                    throw error.message
                })
                .then((data: any) => {
                    res.json(data)
                })
            break;
        case "DELETE":
            await userNumberModel.deleteOne({ "userNumber": query.userNumber })
                .catch((error: Error) => {
                    res.json(false)
                    throw error.message
                })
                .then((data: any) => {
                    res.json(data)
                })
            break;
        default:
            res.send("your method is not supplied")
    }

}