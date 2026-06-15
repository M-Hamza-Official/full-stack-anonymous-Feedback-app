import { z } from "zod";
export const verifySchema = ({
    code: z.string().length(6,{message:"code should be in 6 character"})
})