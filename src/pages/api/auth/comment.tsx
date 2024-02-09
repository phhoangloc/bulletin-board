
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
import { postModel } from "@/model/post.model"
import { commentModel } from "@/model/comment"
import { transporter } from "../signup"
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
                const userComment = await userModel.findOne({ "_id": id })
                const post = await postModel.findOne({ "_id": body.postId })
                const userPostId = post.nicknameId
                const userPost = await userModel.findOne({ "_id": userPostId })
                const emailPost = userPost.email
                const emailComment = userComment.email
                const nicknameComment = userComment.nickname
                const postContent = post.content
                await commentModel.create(body)
                    .catch((error: Error) => {
                        result.success = false
                        result.message = error.message
                        res.send(result)
                        throw error.message
                    }).then(async (data: any) => {

                        const mainOptions = {
                            from: '掲示板 (astem@gmail.com) <no-reply>',
                            to: emailPost,
                            subject: 'コメントについて',
                            html:
                                `こんばんは！<br>
                                こんにちは。掲示板 の ${nicknameComment} さんはあなたの掲示板にコメントしました。<br>
                                <br>
                                イメールから    ${emailComment}<br>
                                <br>
                                コンテンツ  ${body.content}<br>
                                <br>
                                上記の内容を確認するには、<a href="${process.env.HOMEPAGE_URL + "post/" + body.postId}" target="_blank">${process.env.HOMEPAGE_URL} </a>にアクセスしてください。

                                `
                        };

                        await transporter.sendMail(mainOptions)
                            .catch((error: Error) => {
                                result.success = false
                                result.message = error.message
                                res.send(result)
                                throw error.message
                            }).then(() => {
                                result.success = true
                                result.message = "your comment is created"
                                res.json(result)
                            })
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