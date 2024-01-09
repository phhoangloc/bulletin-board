
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
import { postModel } from "@/model/post.model"
import { commentModel } from "@/model/comment"
const jwt = require('jsonwebtoken')

const Cooment =
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
            case "GET":
                await commentModel.find()
                    .find(query.id ? { "_id": query.id } : {})
                    .find(query.postId ? { "postId": query.postId } : {})
                    .populate("nicknameId", "nickname")
                    .sort({ "createDate": -1 })
                    .skip(query.skip)
                    .limit(query.limit ? query.limit : {})
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
            case "POST":
                body.nicknameId = id
                await commentModel.create(body)
                    .catch((error: Error) => {
                        result.success = false
                        result.message = error.message
                        res.send(result)
                        throw error.message
                    }).then(async (data: any) => {
                        result.success = true
                        result.message = "your comment is created"
                        res.json(result)
                    })
                break;
            case "PUT":
                // console.log(query.id)
                if (nicknameId.toString() === id.toString()) {
                    body.nicknameId = id
                    await commentModel.updateOne({ "_id": query.id }, body)
                        .catch((error: Error) => {
                            result.success = false
                            result.message = error.message
                            res.send(result)
                            throw error.message
                        }).then(async (data: any) => {
                            result.success = true
                            result.message = "your comment is update"
                            res.json(result)
                        })
                }
                break;
            case "DELETE":

                if (nicknameId.toString() === id.toString()) {
                    await commentModel.deleteOne({ "_id": query.id })
                        .catch((error: Error) => {
                            result.success = false
                            result.message = error.message
                            res.send(result)
                            throw error.message
                        }).then(async (data: any) => {
                            result.success = true
                            result.message = "your comment is delete"
                            res.json(result)
                        })
                }
                break;
            default:
                res.send("your method is not supplied")
        }
    }

export default Cooment