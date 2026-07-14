'use client'
import * as z from "zod"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, FormProvider } from "react-hook-form"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { signUpValidation } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { apiResponse } from "@/types/apiResponse"
import { Field, FieldDescription, FieldError, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [userNameMessage, setUserNameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: { userName: '', email: '', password: '' }
  })

  useEffect(() => {
    const getUserName = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUserNameMessage('')
        try {
          // Check if username is available; API returns a message either way
          const response = await axios.get(`/api/auth/check-username-unique?username=${username}`)
          setUserNameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>
          setUserNameMessage(axiosError.response?.data.message ?? "error checking username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    getUserName()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<apiResponse>('/api/sign-up', data)
      toast.success("Success", { description: response.data.message })
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast.error("Sign up failed", {
        description: axiosError.response?.data.message ?? "Something went wrong",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        {/* Wax-seal style accent bar */}
        <div className="h-1 w-12 bg-[#1B1B1F] rounded-full mx-auto mb-8" />

        <div className="bg-white border border-[#E5E3DC] rounded-sm shadow-sm px-6 py-8 sm:px-10 sm:py-10 space-y-7">
          <div className="text-center space-y-2">
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-tight text-[#1B1B1F]">
              Join <span className="text-[#4A4A52]">OpenFeedback</span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#6B6B72]">
              Sign up to start your anonymous adventure
            </p>
          </div>

          <FormProvider {...form}>
            <Button
              onClick={() => signIn("google")}
              className="mx-auto w-full rounded-sm border-[#E5E3DC] text-[#1B1B1F] hover:bg-[#F7F5F0]"
              variant="outline"
              type="button"
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Login with Google
            </Button>

            <FieldSeparator className="font-[family-name:var(--font-mono)] text-xs text-[#9B9B9F] *:data-[slot=field-separator-content]:bg-white">
              OR CONTINUE WITH
            </FieldSeparator>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <Controller
                name="userName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your username"
                      autoComplete="off"
                      className="rounded-sm border-[#E5E3DC] focus:border-[#1B1B1F] focus:ring-1 focus:ring-[#1B1B1F] transition-colors"
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                    {isCheckingUsername && (
                      <span className="flex items-center gap-2 mt-1">
                        <span className="inline-block h-[0.7em] w-10 bg-[#14151A]/20 rounded-[1px] animate-pulse" />
                      </span>
                    )}
                    {userNameMessage && (
                      <p className={`text-xs mt-1 font-[family-name:var(--font-mono)] ${
                        userNameMessage === 'this username is available'
                          ? 'text-[#3F7A56]'
                          : 'text-[#B0463C]'
                      }`}>
                        {userNameMessage}
                      </p>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                      autoComplete="off"
                      className="rounded-sm border-[#E5E3DC] focus:border-[#1B1B1F] focus:ring-1 focus:ring-[#1B1B1F] transition-colors"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Create a password"
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
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Sign Up'}
              </Button>

              <div className="text-center text-sm font-[family-name:var(--font-body)] text-[#6B6B72]">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-medium text-[#1B1B1F] hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage