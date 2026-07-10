'use client'

import { Message } from '@/models/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import MessageCard from '@/components/MessageCard'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

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

  const { setValue, watch, register, control } = form
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
    setIsSwitchLoading(false)
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
      setIsSwitchLoading(false)
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

  // Authentication guards must return JSX structure directly
  if (!session || !session.user) {
    return <div className="p-6 text-center">Please Sign In</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Clipboard URL section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Copy Your Unique Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="border p-2 rounded w-full bg-gray-50"
          />
          <button onClick={copyToClipboard} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
            Copy
          </button>
        </div>
        <Switch className={`mt-3`}
          {...register('acceptMessages')}
          checked={acceptMessage}
          onCheckedChange={toggleSwitch}
          disabled={isSwitchLoading}
        />
              <Separator />

        {/* Message list visualization fallback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages to display.</p>
          ) : (
            messages.map((message) => (
              <MessageCard
                key={String(message._id)}
                onMessageDelete={handleDeleteMessage}
                message={message}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Page