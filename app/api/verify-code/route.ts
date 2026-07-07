import { userNameValidation } from "@/schemas/signUpSchema";
import z from "zod";
import dbconnect from "@/lib/dbConnect";
import userModel from "@/models/user";

export async function POST(request: Request) {
    await dbconnect()
    try {
        const { code, username } = await request.json()
        const decodedUser = decodeURIComponent(username)
        console.log("Searching for userName:", JSON.stringify(decodedUser))

        const user = await userModel.findOne({
            userName:decodedUser
        })
        const allUsers = await userModel.find({}, "userName email")
console.log("All users in DB:", JSON.stringify(allUsers))
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 500
            })
        }
        const isCodeValid = user.verifyCode === code
      console.log("Code from frontend:", code);
console.log("Code from database:", user.verifyCode);
console.log("Type of frontend code:", typeof code);
console.log("Type of database code:", typeof user.verifyCode);
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