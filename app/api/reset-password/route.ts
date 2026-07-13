import dbconnect from "@/lib/dbConnect";
import userModel from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbconnect()
    try {
        const { email, code, newPassword } = await request.json();

        const existingUserWithEmail = await userModel.findOne({ email, isVerified: true })

        if (!existingUserWithEmail) {
            return Response.json(
                { success: false, message: "Invalid or expired code" },
                { status: 400 }
            )
        }

        // Check the code matches
        if (existingUserWithEmail.verifyCode !== code) {
            return Response.json(
                { success: false, message: "Invalid or expired code" },
                { status: 400 }
            )
        }

        // Check the code hasn't expired
        const isCodeExpired = new Date(existingUserWithEmail.checkCodeExpiry) < new Date()
        if (isCodeExpired) {
            return Response.json(
                { success: false, message: "Invalid or expired code" },
                { status: 400 }
            )
        }

        // Both checks passed — safe to update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        existingUserWithEmail.password = hashedPassword

        // Clear the code so it can't be reused
        existingUserWithEmail.checkCodeExpiry = new Date(0) // far in the past, so it's always "expired" if somehow reused

        await existingUserWithEmail.save()

        return Response.json(
            { success: true, message: "Password reset successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.log("error resetting password", error);

        return Response.json(
            { success: false, message: "Error resetting password" },
            { status: 500 }
        );
    }
}