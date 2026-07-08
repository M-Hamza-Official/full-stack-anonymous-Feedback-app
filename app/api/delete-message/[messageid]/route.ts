import userModel from "@/models/user";
import dbconnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid
    await dbconnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }


    try {
        const updatedResult = await userModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )
        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                { success: false, message: "Message not found or already deleted" },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, message: "Message Deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);

        return Response.json(
            { success: false, message: "Error deleting messages!" },
            { status: 500 }
        );
    }

}