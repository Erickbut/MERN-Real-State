import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        default: "https://e7.pngegg.com/pngimages/328/599/png-clipart-male-avatar-user-profile-profile-heroes-necktie-thumbnail.png"
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema)

export default User;