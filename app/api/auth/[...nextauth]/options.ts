import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

import userModel from "@/models/user";
import dbconnect from "@/lib/dbConnect";
import { User as MongooseUser } from "@/models/user"
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
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
                    if (!user) {
                        throw new Error("Invalid credentials!")
                    }
                    const isPasswordMatched = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordMatched) {
                        return user
                    } else {
                        throw new Error("Invalid credentials!")

                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }

        })

    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                await dbconnect()
               const existingUser = await userModel.findOne({ email: profile?.email });

if (!existingUser) {
    await userModel.create({
        email: profile?.email,
        userName: profile?.email?.split("@")[0],
        isAccepting: true,
        messages: [],
        verifyCode: "GOOGLE_AUTH",
        checkCodeExpiry: new Date(),
        isVerified: true,
        password: "GOOGLE_OAUTH_NO_PASSWORD",
    });
}
                return Boolean(profile?.email && profile?.email)
            }
            return true // Do different verification for other providers that don't have `email_verified`
        },
       async jwt({ token, user, account }) {
    if (account?.provider === "google" && user?.email) {
        await dbconnect();
        const dbUser = await userModel.findOne({ email: user.email });
        if (dbUser) {
            token._id = dbUser._id?.toString();
            token.isVerified = dbUser.isVerified;
            token.isAcceptingMessages = dbUser.isAccepting;
            token.userName = dbUser.userName;
        }
        return token;
    }
    if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.userName = user.userName;
    }
    return token;
},
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.isVerified = token.isVerified
                session.user.userName = token.userName
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET

}
