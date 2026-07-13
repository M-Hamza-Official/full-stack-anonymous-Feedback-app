"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { forgotPasswordSchema } from "@/schemas/forgotSchema"
import { apiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const Page = () => {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const { isSubmitting } = form.formState

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        try {
            await axios.post<apiResponse>('/api/forgot-password', {
                email: data.email
            })
            toast.info("Code sent", {
                description: "If that email is registered, a code has been sent.",
            })
            router.replace(`/reset-password/${data.email}`)
        } catch (error) {
            console.log("forgot-password error", error)
            const Error = error as AxiosError<apiResponse>
            const forgotError = Error.response?.data.message
            toast.error("Request failed", {
                description: forgotError,
            })
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} className="text-sm font-medium text-gray-700">
                            Enter your associated email
                        </FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter your email"
                            autoComplete="off"
                            className="rounded-lg border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Sending..." : "Send reset code"}
            </Button>
        </form>
    )
}

export default Page