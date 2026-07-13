import { sendVerificationEmail } from "@/helper/sendVerificationEmails";
import dbconnect from "@/lib/dbConnect";
import userModel from "@/models/user";

export async function POST(request: Request) {
    await dbconnect()
    try {
        const { email } = await request.json();
        const existingUserWithEmail = await userModel.findOne({ email, isVerified: true })

        if (!existingUserWithEmail) {
            return Response.json(
                { success: true, message: "If that email is registered, a code has been sent" },
                { status: 200 }
            )
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const resendCode = await sendVerificationEmail(existingUserWithEmail.email, existingUserWithEmail.userName, verifyCode)

        // Only save the code to the DB if the email actually sent successfully
        if (resendCode) {
            existingUserWithEmail.verifyCode = verifyCode
            existingUserWithEmail.checkCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserWithEmail.save()

            return Response.json(
                { success: true, message: "Code sent successfully" },
                { status: 200 }
            )
        } else {
            return Response.json(
                { success: false, message: "Failed to send reset code, please try again" },
                { status: 500 }
            )
        }
    } catch (error) {
        console.log("error sending code", error);

        return Response.json(
            { success: false, message: "Error sending code" },
            { status: 500 }
        );
    }
}