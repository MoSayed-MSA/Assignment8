import mongoose, { mongo } from "mongoose";

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function (val) {
                if (!val) {
                    return true
                }
                return val !== val.toUpperCase()
            },
            message: 'Title cannot be entirely in UPPERCASE'
        }
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true,
    }
}, { timestamps: true })


const noteModel = mongoose.models.Note || mongoose.model('Note', noteSchema)

export default noteModel