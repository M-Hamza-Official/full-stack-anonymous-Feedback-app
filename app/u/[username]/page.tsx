'use client'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Textarea } from "@/components/ui/textarea"
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import z from 'zod'
import { useParams } from "next/navigation"
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import SuggestMessages from '../../../components/SuggestMessage'

const page = () => {
    const params = useParams<{ username: string }>()
    const username = params.username

    const form = useForm({
        resolver: zodResolver(messageSchema)
    })
    const { setValue, watch } = form
    const content = watch('content') || ''

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            await axios.post<apiResponse>('/api/send-messages', {
                username: username,
                content: data.content
            })
            toast.success('Message sent successfully!')
            form.reset()
        } catch (error) {
            console.log("Error sending message", error)
            const axiosError = error as AxiosError<apiResponse>
            toast.error(axiosError.response?.data.message || "Failed to send message")
        }
    }

    return (
        <div className="relative min-h-screen bg-[#10171B] text-[#EDE6DA] overflow-hidden">
            {/* faint fold crease down the page */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="relative mx-auto max-w-xl px-6 py-20 md:py-28">
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#8B92A6]">
                    Anonymous note for
                </p>

                <h1 className="mb-10 text-4xl md:text-5xl font-serif italic tracking-tight text-[#EDE6DA]">
                    {username}
                </h1>

                <div className="group relative">
                    <Textarea
                        id="content"
                        placeholder="Say what you wouldn't say with your name attached..."
                        rows={5}
                        className="min-h-[140px] w-full resize-none border-0 border-b border-white/15 bg-transparent px-0 text-lg leading-relaxed text-[#EDE6DA] placeholder:text-[#8B92A6]/60 shadow-none focus-visible:ring-0 focus-visible:border-white/15"
                        {...form.register("content")}
                    />
                    {/* animated underline on focus */}
                    <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-[#D9A15B] transition-all duration-300 group-focus-within:w-full" />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-[#8B92A6]">
                    <span>
                        {form.formState.errors.content && (
                            <span className="text-red-400">{form.formState.errors.content.message}</span>
                        )}
                    </span>
                    <span>{content.length}/300</span>
                </div>

                <div className="mt-6">
                    <SuggestMessages onSelectQuestion={(q) => setValue('content', q)} />
                </div>

                <div className="mt-12 flex items-center justify-end gap-4">
                    <span className="text-sm text-[#8B92A6]">Your identity stays hidden</span>
                    <button
                        type="submit"
                        aria-label="Send message"
                        className="group flex h-14 w-14 items-center justify-center rounded-full border border-[#D9A15B]/40 bg-[#D9A15B]/10 text-[#D9A15B] transition-all duration-300 hover:rotate-[10deg] hover:bg-[#D9A15B] hover:text-[#10171B]"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default page