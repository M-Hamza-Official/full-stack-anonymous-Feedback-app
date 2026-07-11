'use client'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
// import dbconnect from '@/lib/dbConnect'
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import z from 'zod'
import { useParams, useSearchParams } from "next/navigation";
import { toast } from 'sonner'
import SuggestMessages from '../../../components/SuggestMessage'

const page = () => {
    const params = useParams<{ username: string }>()
const username=params.username

    const form = useForm({
        resolver: zodResolver(messageSchema)
    })
const {setValue}=form
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        // await dbconnect()
        try {
            const response = await axios.post<apiResponse>('/api/send-messages', {
                username:username,
                content:data.content
            })
            toast.success('Message sent successfully!')
            form.reset()
             return Response.json({
                status: true,
                message: "Message sent successfully! ",
                
            }, {
                status: 200
            })
        } catch (error) {
console.log("Error sending message", error)
      const axiosError = error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message || "Failed to send message")
        }
    }


    return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
  <div className="flex justify-center px-4 py-10">
    <div className="w-full max-w-2xl rounded-2xl border bg-background shadow-lg p-6 md:p-8 space-y-6">

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {username}
        </h2>

        <p className="text-sm text-muted-foreground">
          Send an anonymous message. Your identity will remain private.
        </p>
      </div>

      <Field>
        <FieldLabel
          htmlFor="content"
          className="text-base font-medium"
        >
          Your Message
        </FieldLabel>

        <FieldDescription className="mb-3">
          Write something thoughtful or ask a question.
        </FieldDescription>

        <Textarea
          id="content"
          placeholder="Type your anonymous message here..."
          className="min-h-[140px] resize-none"
          {...form.register("content")}
        />

        {form.formState.errors.content && (
          <p className="mt-2 text-sm text-red-500">
            {form.formState.errors.content.message}
          </p>
        )}
      </Field>

      <Button
        type="submit"
        className="w-full md:w-auto"
      >
        Send Message
      </Button>

    </div>
          <SuggestMessages onSelectQuestion={(q) => setValue('content', q)} />

  </div>
</form>
    )
}

export default page