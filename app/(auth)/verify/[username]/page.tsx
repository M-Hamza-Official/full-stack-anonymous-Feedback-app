'use client'

import * as z from "zod"
import { verifySchema } from "@/schemas/verifySchema"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { apiResponse } from "@/types/apiResponse"
import { Button } from "@/app/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/app/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { MailCheck } from "lucide-react"
const Page = () => {
    const params = useParams<{ username: string }>()
    const router = useRouter()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }

    })
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })
            toast.success("success", {
                description: "User code verified!",

            })
            router.replace('/sign-in')
        } catch (error) {
            console.log("Error verifying user code", error);
            const Error = error as AxiosError<apiResponse>
            const SignUPError = Error.response?.data.message
            toast.error("Incorrect Code", {
                description: SignUPError,

            })
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900">
                        <MailCheck className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Verify your account
                    </h1>
                    <p className="text-sm text-slate-500">
                        We sent a 6-digit code to the email for{" "}
                        <span className="font-medium text-slate-800">
                            {params.username}
                        </span>
                        . Enter it below to continue.
                    </p>
                </div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col items-center gap-6"
                >
                    <Field data-invalid={!!form.formState.errors.code}>
                        <FieldLabel htmlFor="code" className="sr-only">
                            Verification code
                        </FieldLabel>

                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <InputOTP
                                    maxLength={6}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />

                        {form.formState.errors.code && (
                            <FieldError className="text-center">
                                {form.formState.errors.code.message}
                            </FieldError>
                        )}
                    </Field>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Verifying..." : "Verify"}
                    </Button>

                    <button
                        type="button"
                        onClick={() => toast.info("A new code has been requested.")}
                        className="text-sm text-slate-500 underline-offset-4 hover:underline"
                    >
                        Resend code
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Page