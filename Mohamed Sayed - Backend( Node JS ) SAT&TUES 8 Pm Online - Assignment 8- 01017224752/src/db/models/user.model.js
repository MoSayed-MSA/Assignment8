import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        max: 60,
        min: 18
    }
},
    {

    })

const userModel = mongoose.models.User || mongoose.model('User', userSchema)

export default userModel