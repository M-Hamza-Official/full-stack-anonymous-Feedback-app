import { userNameValidation } from "@/schemas/signUpSchema";
import z from "zod";
import dbconnect from "@/lib/dbConnect";
import userModel from "@/models/user";

const userNameQuerySchema = z.object({
    userName: userNameValidation
})
export async function GET(request: Request) {
    await dbconnect()
    try {
    const { searchParams } = new URL(request.url)
    const queryparam = {
        userName: searchParams.get("username")
    }
    const result = userNameQuerySchema.safeParse(queryparam)
    console.log(result);//todo:remove
    if (!result.success) {
        const resultErrors = result.error?.format().userName?._errors || [];
        return Response.json({
            success: false,
            message: resultErrors?.length > 0 ? resultErrors?.join(',') : "invalid query parameter"

        }, {
            status: 400
        })
    }
    const {userName}=result.data
   const existingUsernameuser= await userModel.findOne({
        userName,isVerified:true 
    })
    if(existingUsernameuser){
         return Response.json({
            success: false,
            message:"this username is already taken"

        }, {
            status: 400
        })
    }
 return Response.json({
            success: true,
            message:"this username is available"

        }, {
            status: 200
        })

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {
            status: 500
        })
    }

}