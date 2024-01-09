const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    nicknameId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    content: {
        type: String,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
})

export const postModel = mongoose.models.post || mongoose.model('post', postSchema)