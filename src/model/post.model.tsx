const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    nicknameId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    ],
    createDate: {
        type: Date,
        default: Date.now,
    },
})

export const postModel = mongoose.models.post || mongoose.model('post', postSchema)