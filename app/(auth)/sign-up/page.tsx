'use client'
import * as z from "zod"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, Form, useForm } from "react-hook-form"
import { FormProvider } from "react-hook-form"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { signUpValidation } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { apiResponse } from "@/types/apiResponse"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const page = () => {
  const [username, setusername] = useState('')
  const [userNameMessage, setUserNameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setusername, 300)
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      userName: '',
      email: '',
      password: ''
    }
  })
  useEffect(() => {
    const getUserName = async () => {
      if (username) {

        setIsCheckingUsername(true)
        setUserNameMessage('')
        try {
          //check if userName is correct or not wen error occurs
          const response = await axios.get(`/api/auth/check-username-unique?username=${username}`)
          setUserNameMessage(response.data.message)

        } catch (error) {
          const Error = error as AxiosError<apiResponse>
          setUserNameMessage(Error.response?.data.message ?? "error checking username")
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
      console.log(response);

      toast.success("success", {
        description: response.data.message
      })
      //redirect the user to new url
      router.replace(`/verify/${username}`)
      // setIsSubmitting(false)
    } catch (error) {
      console.log("Error signning up user", error);
      const Error = error as AxiosError<apiResponse>
      const SignUPError = Error.response?.data.message
      toast.error("User failed to Sign Up", {
        description: SignUPError,

      })
      
    } finally{
      setIsSubmitting(false)

    }

  }
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
  <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Join Mystery Message
      </h1>
      <p className="text-sm text-gray-500">
        Sign up to start your anonymous adventure
      </p>
    </div>

    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="userName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Username
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your username"
                autoComplete="off"
                className="rounded-lg border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }}
              />
              {isCheckingUsername && (
                <Loader2 className="animate-spin h-4 w-4 text-gray-400 mt-1" />
              )}
              {userNameMessage && (
                <p
                  className={`text-xs mt-1 ${
                    userNameMessage === 'this username is available'
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
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
              <FieldLabel htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Email
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@example.com"
                autoComplete="off"
                className="rounded-lg border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
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
              <FieldLabel htmlFor={field.name} className="text-sm font-medium text-gray-700">
                Password
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Create a password"
                autoComplete="off"
                className="rounded-lg border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            'Sign Up'
          )}
        </Button>
        <div className="text-center text-sm text-gray-500">
  Already have an account?{" "}
  <Link
    href="/sign-in"
    className="font-medium text-gray-900 hover:underline"
  >
    Sign in
  </Link>
</div>
      </form>
    </FormProvider>
  </div>
</div>
    </>
  )
}

export default page