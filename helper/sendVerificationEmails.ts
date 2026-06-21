import { resend } from "../lib/resend";
import { apiResponse } from "@/types/apiResponse";
import VerificationEmail from "../emails/verifyEmail"
import { email } from "zod";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<apiResponse> {
    try {
           await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Hello world',
      react: VerificationEmail({username,verifyCode:verifycode}),
    });
        return { success: true, message: "Verification email send successfully! " }

    } catch (emailError) {
        console.log("Error sending verification email!");
        return { success: false, message: "unable to send verification email!" }
    }
}