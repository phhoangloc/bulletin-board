
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
import { postModel } from "@/model/post.model"
import { commentModel } from "@/model/comment"
import { transporter } from "../signup"
const jwt = require('jsonwebtoken')

const Like =
    async (
        req: NextApiRequest,
        res: NextApiResponse
    ) => {

        let result: isDataType = { success: false };
        let method = req.method
        let body = req.body
        let query = req.query

        connectMongoDB()

        const authorization = req.headers['authorization']
        const token = authorization && authorization.split(" ")[1]
        const id = await jwt.verify(token, 'secretToken').id

        const comment = await commentModel.findOne({ "_id": query.id })
        const nicknameId = comment && comment.nicknameId && comment.nicknameId._id


        switch (method) {
            case "POST":
                await postModel.updateOne({ "_id": query.id }, body)
                    .catch((error: Error) => {
                        result.success = false
                        result.message = error.message
                        res.send(result)
                        throw error.message
                    }).then(async (data: any) => {
                        result.success = true
                        result.message = "your post is update"
                        res.json(result)
                    })
                break;
            default:
                res.send("your method is not supplied")
        }
    }

export default Like