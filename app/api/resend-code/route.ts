import { sendVerificationEmail } from "@/helper/sendVerificationEmails";
import dbconnect from "@/lib/dbConnect";
import userModel from "@/models/user";


export async function POST(request: Request) {
    await dbconnect()
    try {

        const { username } = await request.json();
        const existingUser = await userModel.findOne({ userName: username })
        if (!existingUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }
        if (existingUser.isVerified) {
            return Response.json(
                { success: false, message: "User already verified" },
                { status: 401 }
            )
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const resendCode = await sendVerificationEmail(existingUser.email, existingUser.userName, verifyCode)
        existingUser.verifyCode = verifyCode
        existingUser.checkCodeExpiry = new Date(Date.now() + 3600000) // or however you calculate expiry elsewhere
        await existingUser.save()
        if (resendCode) {
            return Response.json(
                { success: true, message: "Code sent successfully" },
                { status: 200 }
            )
        }
    } catch (error) {
        console.log("error adding message", error);

        return Response.json(
            { success: false, message: "Error sending code" },
            { status: 500 }
        );
    }

}