const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userNumberSchema = new Schema({
    userNumber: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
})

export const userNumberModel = mongoose.models.usernumber || mongoose.model('usernumber', userNumberSchema)