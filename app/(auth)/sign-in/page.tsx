'use client'
import * as z from "zod"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, Form, useForm } from "react-hook-form"
import { FormProvider } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"

import { useRouter } from "next/navigation"
import { signUpValidation } from "@/schemas/signUpSchema"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { signInSchema } from "@/schemas/signInSchema"

const page = () => {
  const [issubmitting, setIssubmitting] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {

      identifier: '',
      password: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      toast.error("Incorrect username/email or password")
    } else if (result?.url) {
      router.replace('/dashboard')
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
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="text-sm font-medium text-gray-700">
                      Username/Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your username/Email"
                      autoComplete="off"
                      className="rounded-lg border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                      onChange={(e) => {
                        field.onChange(e)
                      }}
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
                      placeholder="Password"
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
                {issubmitting ? (<>
                  <Loader2 className="animate-spin" />
                </>) : <>Sign In</>}
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