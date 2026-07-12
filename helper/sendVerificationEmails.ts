import { resend } from "../lib/resend";
import { apiResponse } from "@/types/apiResponse";
import VerificationEmail from "../emails/verifyEmail"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<apiResponse> {
    try {
        await resend.emails.send({
            from: 'OpenFeedback <verify@openfeedback.muhammadhamza.me>',
            to: email,
            subject: 'Code verification',
            react: VerificationEmail({ username, verifyCode: verifycode }),
        });
        return { success: true, message: "Verification email send successfully! " }

    } catch (emailError) {
        console.log("Error sending verification email!", emailError);
        return { success: false, message: "unable to send verification email!" }
    }
}