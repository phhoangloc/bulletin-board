const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    nickname: {
        type: String,
        unique: true,
        required: [true, 'username cant be null'],
        minlength: [5, 'username minimum length 5 characters'],
        maxlength: [20, 'username maximum length 20 characters']
    },
    password: {
        type: String,
        required: [true, 'password cant be null']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v: string) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    active: {
        type: Boolean,
        default: false
    },
})

export const userModel = mongoose.models.user || mongoose.model('user', userSchema)