import mongoose from "mongoose"

const connectMongoDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URL}`)
        .catch((error: Error) => {
            throw error.message
        })
        .then(() => {
            // console.log("connect mongodb success! ")
        })

}
export default connectMongoDB;