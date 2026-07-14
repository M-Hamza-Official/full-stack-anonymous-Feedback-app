'use client'
import * as z from "zod"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, FormProvider } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Field, FieldError, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
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
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <div className="h-1 w-12 bg-[#1B1B1F] rounded-full mx-auto mb-8" />

        <div className="bg-white border border-[#E5E3DC] rounded-sm shadow-sm px-6 py-8 sm:px-10 sm:py-10 space-y-7">
          <div className="text-center space-y-2">
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-tight text-[#1B1B1F]">
              Welcome back to <span className="text-[#4A4A52]">OpenFeedback</span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#6B6B72]">
              Sign in to check what people are really saying
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
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#4A4A52]">
                      Username/Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your username/email"
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
                      placeholder="Password"
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
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Sign In'}
              </Button>

              <div className="text-center text-sm font-[family-name:var(--font-body)] text-[#6B6B72]">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="font-medium text-[#1B1B1F] hover:underline">
                  Sign Up
                </Link>
              </div>

              <div className="text-center text-sm">
                <Link href="/forgot-password" className="font-medium text-[#B0463C] hover:underline">
                  Forgot Password
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default SignInPage