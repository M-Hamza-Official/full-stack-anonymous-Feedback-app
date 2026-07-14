"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema"
import { apiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const ResetPasswordPage = () => {
    const router = useRouter()
    const params = useParams()
    const emailFromUrl = decodeURIComponent(params.email as string)

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailFromUrl,
            code: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const { isSubmitting } = form.formState

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        try {
            await axios.post<apiResponse>('/api/reset-password', {
                email: data.email,
                code: data.code,
                newPassword: data.newPassword,
            })
            toast.success("Password reset", {
                description: "You can now sign in with your new password.",
            })
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast.error("Reset failed", {
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
                            Set a new password
                        </h1>
                        <p className="font-[family-name:var(--font-body)] text-sm text-[#6B6B72]">
                            Enter the code we sent to {emailFromUrl}
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]"
                                    >
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        readOnly
                                        aria-invalid={fieldState.invalid}
                                        className="rounded-sm border-[#E5E3DC] bg-[#F7F5F0] text-[#6B6B72] cursor-not-allowed"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]"
                                    >
                                        Reset code
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="6-digit code"
                                        autoComplete="off"
                                        maxLength={6}
                                        className="rounded-sm border-[#E5E3DC] focus:border-[#1B1B1F] focus:ring-1 focus:ring-[#1B1B1F] transition-colors tracking-[0.3em] text-center"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="newPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]"
                                    >
                                        New password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
                                        className="rounded-sm border-[#E5E3DC] focus:border-[#1B1B1F] focus:ring-1 focus:ring-[#1B1B1F] transition-colors"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={field.name}
                                        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]"
                                    >
                                        Confirm password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Confirm new password"
                                        autoComplete="new-password"
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
                            {isSubmitting ? "Resetting..." : "Reset password"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage