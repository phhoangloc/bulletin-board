
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
import { postModel } from "@/model/post.model"
const jwt = require('jsonwebtoken')

const Post =
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

        const post = await postModel.findOne({ "_id": query.id })
        const nicknameId = post && post.nicknameId && post.nicknameId._id

        switch (method) {
            case "GET":
                await postModel.find()
                    .find(query.id ? { "_id": query.id } : {})
                    .populate({
                        path: 'nicknameId',
                        select: ' nickname',
                    })
                    .populate({
                        path: 'comments',
                        select: 'content nicknameId',
                        populate: { path: 'nicknameId', select: "nickname" }
                    })
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
                await postModel.create(body)
                    .catch((error: Error) => {
                        result.success = false
                        result.message = error.message
                        res.send(result)
                        throw error.message
                    }).then(async (data: any) => {
                        const user = await userModel.findOne({ "_id": id }, "posts")
                        const posts = user.posts
                        console.log(posts)
                        await userModel.updateOne({ "_id": id }, { posts: [...posts, data._id] })
                        result.success = true
                        result.message = "your post is created"
                        res.json(result)
                    })
                break;
            case "PUT":
                if (nicknameId.toString() === id.toString()) {
                    body.nicknameId = id
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
                }
                break;
            case "DELETE":
                if (nicknameId.toString() === id.toString()) {
                    await postModel.deleteOne({ "_id": query.id })
                        .catch((error: Error) => {
                            result.success = false
                            result.message = error.message
                            res.send(result)
                            throw error.message
                        }).then(async (data: any) => {
                            result.success = true
                            result.message = "your post is delete"
                            res.json(result)
                        })
                }
                break;
            default:
                res.send("your method is not supplied")
        }
    }

export default Post