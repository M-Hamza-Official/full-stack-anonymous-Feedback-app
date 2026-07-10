import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { Message } from "@/models/user"
import axios, { AxiosError } from "axios"
import { apiResponse } from "@/types/apiResponse"
import { toast } from "sonner"
import { title } from "process"
type MessageCardProps={
    message:Message,
    onMessageDelete:(messageId:string)=>void 
}
export default function MessageCard({message,onMessageDelete}:MessageCardProps) {
// const toast = 
    const onSubmitHandler=async()=>{
try {
    const response=await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)
toast.success("message deleted")
console.log(message._id);

onMessageDelete(String(message._id))
} catch (error) {
    console.log("Error Accepting message", error)
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Failed to update status")
}
    }
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{message.content}</CardTitle>
                <CardDescription>
                    {/* Enter your email below to login to your account */}
                </CardDescription>
              <AlertDialog>
                    <AlertDialogTrigger render={<Button variant="outline" />}>
                        <X  className="w-5 h-5" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={()=>onSubmitHandler()}  >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardAction>
                    {/* <Button variant="link">Sign Up</Button> */}
                </CardAction>
            </CardHeader>
            <CardContent>
               
            </CardContent>
            <CardFooter className="flex-col gap-2">
               
               
            </CardFooter>
        </Card>
    )
}
