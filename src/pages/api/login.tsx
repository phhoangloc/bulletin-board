import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
import { isStringType } from '@/type/resultType';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const login = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {

    connectMongoDB()

    if (req.method === 'POST') {
        let result: isStringType
        const body = req.body

        const nickname = body.nickname
        const password = body.password

        const usenameiExsited = await userModel.findOne({ 'nickname': nickname })
        if (usenameiExsited == null) {

            result = {
                success: false,
                message: "アカウントは存在しません",
            }

            res.json(result)

        } else {
            if (usenameiExsited.active === false) {

                result = {
                    success: false,
                    message: "アカウントは無効です。",
                }

                res.json(result)

            } else {
                const isPasswordValid = await bcrypt.compare(password, usenameiExsited.password);
                if (isPasswordValid) {

                    const payload = { id: usenameiExsited._id }

                    const token = jwt.sign(payload, 'secretToken', { expiresIn: '24h' });

                    result = {
                        success: true,
                        message: "login success!",
                        result: token,
                    }

                    res.json(result)


                } else {
                    result = {
                        success: false,
                        message: "パスワードが合ってないんです。",
                    }

                    res.json(result)
                }
            }
        }
    } else {
        res.json({
            success: false,
            message: "your request method is not supply"
        })
    }


}


export default login