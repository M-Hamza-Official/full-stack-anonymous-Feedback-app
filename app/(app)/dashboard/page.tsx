'use client'

import { Message } from '@/models/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import MessageCard from '@/components/MessageCard'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Copy, Loader2, RefreshCw, Inbox, Link2 } from 'lucide-react'

const Page = () => {
  const { data: session } = useSession()
  const [profileUrl, setProfileUrl] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const user = session?.user as User
  const username = user?.userName || ""

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId))
  }

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false
    }
  })

  const { setValue, watch, register } = form
  const acceptMessage = watch("acceptMessages")

  const fetchAcceptedMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<apiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAccepting ?? false)
    } catch (error) {
      console.log("Error Accepting message", error)
      toast.error("Error Accepting messages")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const result = await axios.get<apiResponse>('/api/get-messages')
      setMessages(result.data.messages || [])
      if (refresh) {
        toast.success('Refreshed successfully!')
      }
    } catch (error) {
      console.log("Error fetching message", error)
      toast.error("Error fetching messages")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchAcceptedMessage()
    fetchMessages()
  }, [session, fetchAcceptedMessage, fetchMessages])

  const toggleSwitch = async () => {
    try {
      const response = await axios.post<apiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessage
      })
      setValue('acceptMessages', !acceptMessage)
      toast.success(response.data.message || 'Status updated successfully')
    } catch (error) {
      console.log("Error Accepting message", error)
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Failed to update status")
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`
      setProfileUrl(`${baseUrl}/u/${username}`)
    }
  }, [username])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard!")
  }

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-xl">Please sign in to view your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Manage your anonymous messages and profile link
          </p>
        </div>

        {/* Profile link + toggle card */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50/60 p-7">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-5 w-5 text-indigo-500" />
            <label className="text-base font-semibold text-gray-800">
              Your Unique Link
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="border border-gray-200 rounded-lg px-4 py-3 w-full bg-white text-gray-700 text-base focus:outline-none"
            />
            <Button
              onClick={copyToClipboard}
              size="lg"
              className="shrink-0 gap-2 rounded-lg text-base"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>

          <div className="h-px bg-gray-200 my-7" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-lg">Accept Messages</p>
              <p className="text-base text-gray-500 mt-1">
                {acceptMessage
                  ? "You're currently accepting new messages"
                  : "You're not accepting new messages"}
              </p>
            </div>
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessage}
              onCheckedChange={toggleSwitch}
              disabled={isSwitchLoading}
            />
          </div>
        </div>

        {/* Messages section */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Messages{' '}
              {messages.length > 0 && (
                <span className="text-gray-400 font-normal text-lg">
                  ({messages.length})
                </span>
              )}
            </h2>
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 text-gray-500 text-base"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault()
                fetchMessages(true)
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5" />
              )}
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-lg">
              <Loader2 className="h-7 w-7 animate-spin mr-3" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Inbox className="h-12 w-12 mb-4" />
              <p className="text-lg">No messages yet. Share your link to get feedback!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {messages.map((message) => (
                <MessageCard
                  key={String(message._id)}
                  onMessageDelete={handleDeleteMessage}
                  message={message}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page