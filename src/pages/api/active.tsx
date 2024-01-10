import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"


const Active =
    async (
        req: NextApiRequest,
        res: NextApiResponse
    ) => {
        const query = req.query
        const result: isDataType = { success: false }
        connectMongoDB()
        await userModel
            .findOne(query.email ? { "email": query.email } : {})
            .catch((error: Error) => {
                result.success = false
                res.json(false)
            })
            .then((data: any) => {
                userModel.updateOne({ "email": query.email }, { "active": true })
                    .catch((error: Error) => {
                        result.success = false
                        res.json(false)
                    })
                    .then((data: any) => {
                        res.json("あなたのアカウントは有効になりました！ ")
                    })
            })
    }

export default Active