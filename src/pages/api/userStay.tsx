import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query
    const method = req.method
    const body = req.body

    connectMongoDB()
    switch (method) {
        case "GET":
            await userModel
                .findOne({ "_id": query.id }, query.stayAtHome ? "nickname stayAtHome" : {})
                .catch((error: Error) => {
                    res.json(false)
                    throw error.message
                })
                .then((data: any) => {
                    res.json(data)
                })
        case "PUT":
            await userModel.updateOne({ "_id": query.id }, body)
                .catch((error: Error) => {
                    res.json(false)
                    throw error.message
                })
                .then((data: any) => {
                    res.json(data)
                })
    }
}