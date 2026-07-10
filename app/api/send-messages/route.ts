import dbconnect from "@/lib/dbConnect";
import userModel from "@/models/user";
import { Message } from "@/models/user";

export async function POST(request: Request) {
    await dbconnect()
    try {
        const { username, content } = await request.json()
        const user = await userModel.findOne({ userName:username })
        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        if (!user.isAccepting) {
            return Response.json(
                { success: false, message: "User is not accepting messages!" },
                { status: 403 }
            );
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            { success: true, message: "Message sent successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.log("error adding message", error);

        return Response.json(
            { success: false, message: "Internal server Error" },
            { status: 500 }
        );
    }

}