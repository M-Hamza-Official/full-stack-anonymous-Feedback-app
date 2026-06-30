import { userNameValidation } from "@/schemas/signUpSchema";
import z from "zod";
import dbconnect from "@/lib/dbConnect";
import userModel from "@/models/user";

export async function GET(request: Request) {
    await dbconnect()
    try {
        const { code, username } = await request.json()
        const decodedUser = decodeURIComponent(username)
        const user = await userModel.findOne({
            username: decodedUser
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 500
            })
        }
        const isCodeValid = user.isVerified === code
        const isverifyCodeNotExpired = new Date(user.checkCodeExpiry) > new Date()
        if (isCodeValid && isverifyCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                status: true,
                message: "user verified successfully! "
            }, {
                status: 200
            })
        } else if (!isverifyCodeNotExpired) {
            return Response.json({
                status: false,
                message: "Expiry code has expired.sign up again to get the code. "
            }, {
                status: 400
            })
        } else {
            return Response.json({
                status: false,
                message: "Your verify code is not correct"
            }, {
                status: 400
            })
        }


    } catch (error) {
        console.error("Error getting verify code", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {
            status: 500
        })
    }
}