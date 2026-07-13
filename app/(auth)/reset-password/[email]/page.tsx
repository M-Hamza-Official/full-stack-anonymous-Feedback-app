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

const Page = () => {
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
            console.log("reset-password error", error)
            const Error = error as AxiosError<apiResponse>
            const resetError = Error.response?.data.message
            toast.error("Reset failed", {
                description: resetError,
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
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter your email"
                            autoComplete="off"
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
                        <FieldLabel htmlFor={field.name}>Reset code</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="6-digit code"
                            autoComplete="off"
                            maxLength={6}
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
                        <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            type="password"
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter new password"
                            autoComplete="new-password"
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
                        <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            type="password"
                            aria-invalid={fieldState.invalid}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Resetting..." : "Reset password"}
            </Button>
        </form>
    )
}

export default Page