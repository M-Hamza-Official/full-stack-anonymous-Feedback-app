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
import { Button } from '@/components/ui/button'
import { Copy, Loader2, RefreshCw, Inbox, Link2 } from 'lucide-react'

const DashboardPage = () => {
  const { data: session, status } = useSession()
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

  const { control, setValue, watch } = form
  const acceptMessage = watch("acceptMessages")

  const fetchAcceptedMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<apiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAccepting ?? false)
    } catch (error) {
      toast.error("Error fetching your message settings")
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

  const toggleSwitch = async (checked: boolean) => {
    try {
      const response = await axios.post<apiResponse>('/api/accept-messages', {
        acceptMessages: checked
      })
      setValue('acceptMessages', checked)
      toast.success(response.data.message || 'Status updated successfully')
    } catch (error) {
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#4A4A52]" />
      </div>
    )
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center min-h-[60vh] px-4">
        <p className="font-[family-name:var(--font-body)] text-[#6B6B72] text-lg sm:text-xl text-center">
          Please sign in to view your dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="p-4 sm:p-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-semibold tracking-tight text-[#1B1B1F]">
            Dashboard
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#6B6B72] mt-2 text-base sm:text-lg">
            Manage your anonymous messages and profile link
          </p>
        </div>

        {/* Profile link + toggle card */}
        <div className="mb-6 sm:mb-8 rounded-sm border border-[#E5E3DC] bg-white p-4 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-5 w-5 text-[#1B1B1F] shrink-0" />
            <label className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]">
              Your Unique Link
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="border border-[#E5E3DC] rounded-sm px-4 py-3 w-full bg-[#F7F5F0] text-[#1B1B1F] text-sm sm:text-base focus:outline-none"
            />
            <Button
              onClick={copyToClipboard}
              size="lg"
              className="shrink-0 gap-2 rounded-sm text-base w-full sm:w-auto bg-[#1B1B1F] hover:bg-[#14151A] text-[#F7F5F0]"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>

          <div className="h-px bg-[#E5E3DC] my-5 sm:my-7" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--font-body)] font-semibold text-[#1B1B1F] text-base sm:text-lg">
                Accept Messages
              </p>
              <p className="font-[family-name:var(--font-body)] text-sm sm:text-base text-[#6B6B72] mt-1">
                {acceptMessage
                  ? "You're currently accepting new messages"
                  : "You're not accepting new messages"}
              </p>
            </div>
            <Controller
              name="acceptMessages"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    toggleSwitch(checked)
                  }}
                  disabled={isSwitchLoading}
                  className="shrink-0 data-[state=checked]:bg-[#1B1B1F]"
                />
              )}
            />
          </div>
        </div>

        {/* Messages section */}
        <div className="rounded-sm border border-[#E5E3DC] bg-white p-4 sm:p-7">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-2xl font-semibold text-[#1B1B1F]">
              Messages{' '}
              {messages.length > 0 && (
                <span className="font-[family-name:var(--font-mono)] text-[#9B9B9F] font-normal text-base sm:text-lg">
                  ({messages.length})
                </span>
              )}
            </h2>
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 text-[#6B6B72] hover:text-[#1B1B1F] text-sm sm:text-base shrink-0"
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
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-[#9B9B9F] font-[family-name:var(--font-body)] text-base sm:text-lg">
              <Loader2 className="h-7 w-7 animate-spin mr-3" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#9B9B9F] px-4 text-center">
              <Inbox className="h-12 w-12 mb-4" />
              <p className="font-[family-name:var(--font-body)] text-base sm:text-lg">
                No messages yet. Share your link to get feedback!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 items-start sm:grid-cols-2">
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

export default DashboardPage