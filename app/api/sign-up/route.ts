import dbconnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmails";
import { success } from "zod";
import userModel from "@/models/user";

export async function POST(request: Request) {
    try {
        // await dbconnect()
        const { username, email, password } = await request.json();
        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString()
        const verifiedUserByUsername = await userModel.findOne({
           userName: username,
            isVerified: true
        })
        //checking if user is trying to get already taken username 
        if (verifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "username is already taken !"
            }, {
                status: 400
            });

        }
        const verifiedUserByEmail = await userModel.findOne({ email })
        if (verifiedUserByEmail) {

        if(verifiedUserByEmail.isVerified){
           return Response.json({
                success:false,
                message:"User with same email already exist!"
           },{
            status:400
           })
        }else{
             const hashedPassword = await bcrypt.hash(password, 10);
             verifiedUserByEmail.password=hashedPassword
            verifiedUserByEmail.verifyCode = verifyCode
            verifiedUserByEmail.checkCodeExpiry = new Date(Date.now()+360000)
           await verifiedUserByEmail.save()
        }


        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const checkCodeExpiry = new Date();
            checkCodeExpiry.setHours(checkCodeExpiry.getHours() + 1)
            const newUser = new userModel({
                userName: username,
                email,
                password: hashedPassword,
                verifyCode,
                isVerified: false,
                checkCodeExpiry,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save()
        }
        //send verification email
        const emailResponse = await sendVerificationEmail(
            username,
            email,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                  success:false,
                message:emailResponse.message
            },{
                status:500
            })
        }
return  Response.json({
                  success:true,
                message:"User registered successfully. verify your email"
            },{
                status:201
            })

    } catch (error) {
        console.log("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })

    }

}