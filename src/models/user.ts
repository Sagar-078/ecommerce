import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    supercoins: {
        type: Number,
        default: 0
    }
})

export default mongoose.models.User || mongoose.model("User", userSchema);