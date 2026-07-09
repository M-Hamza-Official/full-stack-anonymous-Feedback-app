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
const page = () => {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const { username } = session?.user as User
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId))
  }
  const { register, watch, setValue } = useForm()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const acceptMessage = watch("acceptMessage")
  const fetchAcceptedMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<apiResponse>('/api/accept-messages')
      setValue('acceptMessage', response.data.isAccepting)
    } catch (error) {
      console.log("Error Accepting message", error);
      const Error = error as AxiosError<apiResponse>
      // const SignUPError = Error.response?.data.message
      toast.error("Error Accepting messages")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refreash: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const result = await axios.get<apiResponse>('/api/get-messages')
      setMessages(result.data.messages || [])
      if (refreash) {
        toast.success('Refreash successfully!')
      }
    } catch (error) {
      console.log("Error fetching message", error);
      const Error = error as AxiosError<apiResponse>
      // const SignUPError = Error.response?.data.message
      toast.error("Error fetching mesages")
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])
  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptedMessage()
    fetchMessages()
  }, [session, fetchAcceptedMessage, fetchMessages])

  const toggleSwitch = async () => {
    try {
      const response = await axios.post<apiResponse>('/api/accept-message', {
        acceptMessage: !acceptMessage

      })
      setValue('acceptMessage', !acceptMessage)
      toast.success('', {
        description: response.data.message
      })
    } catch (error) {
      console.log("Error Accepting message", error);
      const Error = error as AxiosError<apiResponse>
      const acceptError = Error.response?.data.message
      toast.error("", {
        description: acceptError
      })
    }
  }
//ToDo:do some research on this feature
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`
  const copyToClipboard =()=>{
    navigator.clipboard.writeText(profileUrl)
  }
  //main rendring part
  if (!session || !session.user) {

    <div>Please Sign In</div>
  } else {

    return (
      <div>page</div>
    )
  }
}

export default page