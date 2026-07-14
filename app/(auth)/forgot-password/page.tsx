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

const ForgotPasswordPage = () => {
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
            const axiosError = error as AxiosError<apiResponse>
            toast.error("Request failed", {
                description: axiosError.response?.data.message ?? "Something went wrong",
            })
        }
    }

    return (
        <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4 py-10 sm:px-6">
            <div className="w-full max-w-md">
                <div className="h-1 w-12 bg-[#1B1B1F] rounded-full mx-auto mb-8" />

                <div className="bg-white border border-[#E5E3DC] rounded-sm shadow-sm px-6 py-8 sm:px-10 sm:py-10">
                    <div className="text-center space-y-2 mb-7">
                        <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-tight text-[#1B1B1F]">
                            Reset your password
                        </h1>
                        <p className="font-[family-name:var(--font-body)] text-sm text-[#6B6B72]">
                            We&apos;ll send a code to your email if it&apos;s registered
                        </p>
                    </div>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5 flex flex-col items-center w-full"
                    >
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="w-full">
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52] text-center w-full"
                                    >
                                        Enter your associated email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="you@example.com"
                                        autoComplete="off"
                                        className="rounded-sm border-[#E5E3DC] focus:border-[#1B1B1F] focus:ring-1 focus:ring-[#1B1B1F] transition-colors"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-sm bg-[#1B1B1F] hover:bg-[#14151A] text-[#F7F5F0] font-medium py-2.5 transition-colors disabled:opacity-60"
                        >
                            {isSubmitting ? "Sending..." : "Send reset code"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage