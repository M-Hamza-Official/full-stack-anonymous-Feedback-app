import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import userModel from "@/models/user";
import dbconnect from "@/lib/dbConnect";
import { email } from "zod";
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbconnect()
                try {
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { userName: credentials.identifier },

                        ]
                    })
                    if(!user){
                        throw new Error("Invalid credentials!")
                    }
                    const isPasswordMatched= await bcrypt.compare(credentials.password,user.password)
                    if(isPasswordMatched){
                        return user
                    }else{
                        throw new Error("Invalid credentials!")

                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }

        })
        
    ],
    callbacks:{
        async jwt({ token, user }) {
            if(user){
                token._id=user._id?.toString()
                token._isVerified=user.isVerified
            }
          return token
        },
         async session({ session, token }) {
      return session
    },
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
        
    }
