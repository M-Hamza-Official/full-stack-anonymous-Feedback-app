import {email, z} from 'zod';
export const userNameValidation = z
.string()
.min(3,"UserName must be atleat 3 character long!")
.max(15,"UserName cannot be more than 15 character long!")
.regex(/^[a-zA-Z0-9_]+$/, "UserName can only contain letters, numbers, and underscores!")

export const signUpValidation = ({
userName:userNameValidation,
email:z.string().trim().pipe(z.email({message: "Invalid email address"})),
password: z.string().min(8,{message:"password must be atleast 8 character long!"})
})
