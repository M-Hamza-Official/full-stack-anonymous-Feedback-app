import {z} from "zod"

export const messageSchema =({
    content:z.string().min(10,{message:"minimum 10 characters are required"}),

})