import NextAuth from "next-auth";
import { authOptions } from "./options"; // Adjust this import path to where your options file is located

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };