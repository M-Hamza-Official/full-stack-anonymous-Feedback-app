import {z} from "zod"

export const messageSchema =z.object({
    content:z.string().min(10,{message:"minimum 10 characters are required"}),

})