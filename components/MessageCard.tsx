"use client"

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
import { X, MessageSquare } from "lucide-react"
import { Message } from "@/models/user"
import axios, { AxiosError } from "axios"
import { apiResponse } from "@/types/apiResponse"
import { toast } from "sonner"

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const formatRelativeTime = (date: string | Date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const onSubmitHandler = async () => {
    try {
      const response = await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)
      toast.success("Message deleted")
      onMessageDelete(String(message._id))
    } catch (error) {
      console.log("Error deleting message", error)
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Failed to delete message")
    }
  }

  return (
    <div className="group relative flex items-start gap-4 py-6 px-1 border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50/60 rounded-lg">
      {/* Icon bubble */}
      <div className="shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-indigo-50 text-indigo-500">
        <MessageSquare className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-gray-800 leading-relaxed break-words">
          {message.content}
        </p>
        <p className="text-xs text-gray-400 mt-2 font-medium tracking-wide">
          {formatRelativeTime(message.createdAt)}
        </p>
      </div>

      {/* Delete trigger */}
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <button
              className="absolute top-5 right-1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 shrink-0 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
              aria-label="Delete message"
            />
          }
        >
          <X className="h-4 w-4" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This message will be permanently removed from your inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmitHandler}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}