import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }

})
export interface User extends Document {
    userName: string,
    email: string,
    password: string,
    verifyCode: string,
    isVerified: boolean,
    checkCodeExpiry: Date,
    isAccepting: boolean,
    messages: Message[]


}
const userSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "email should be valid"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verify code is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    checkCodeExpiry: {
        type: Date,
        required: [true, "checking verify code is required"]
    },
    isAccepting: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema],

})

const userModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema))

export default userModel