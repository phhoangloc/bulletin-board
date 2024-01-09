const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "post"
    },
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

export const commentModel = mongoose.models.comment || mongoose.model('comment', commentSchema)