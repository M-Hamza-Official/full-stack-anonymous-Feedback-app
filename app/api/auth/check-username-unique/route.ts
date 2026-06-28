import { userNameValidation } from "@/schemas/signUpSchema";
import z from "zod";
import dbconnect from "@/lib/dbConnect";

const userNameQuerySchema=z.object({
    username:userNameValidation
})