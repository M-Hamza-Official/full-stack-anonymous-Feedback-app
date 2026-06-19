import { Message } from "@/models/user"

export interface apiResponse{
    success:boolean
    message:string
    isAccepting?:boolean
    messages?:Array<Message>
}
