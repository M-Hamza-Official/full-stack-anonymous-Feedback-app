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
import { X, Lock } from "lucide-react"
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

const isRecent = (date: string | Date) => {
  const diffMs = new Date().getTime() - new Date(date).getTime()
  return diffMs < 1000 * 60 * 60 * 24 // "new" if under 24h old
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const onSubmitHandler = async () => {
    try {
      await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)
      toast.success("Message deleted")
      onMessageDelete(String(message._id))
    } catch (error) {
      console.log("Error deleting message", error)
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Failed to delete message")
    }
  }

  return (
    <div className="group relative rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
      {/* Top row: badge + delete */}
      <div className="flex items-start justify-between mb-4">
        {isRecent(message.createdAt) ? (
          <span className="bg-yellow-400 text-black text-xs font-bold tracking-wide px-2.5 py-1 rounded-md">
            NEW
          </span>
        ) : (
          <span />
        )}

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <button
                className="sm:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 p-1.5 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                aria-label ="Delete message"
              />
            }
          >
            <X className="h-4  w-4" />
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

      {/* Message content */}
      <p className="text-lg sm:text-xl text-gray-900 leading-snug">
        &ldquo;{message.content}&rdquo;
      </p>

      <div className="h-px bg-gray-100 my-5" />

      {/* Footer row */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{formatRelativeTime(message.createdAt)}</span>
        <span className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" />
          Sender not recorded
        </span>
      </div>
    </div>
  )
}