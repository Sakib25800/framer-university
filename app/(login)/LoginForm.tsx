"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useActionState } from "react"
import { Button } from "@/components/Button/Button"
import GoogleButton from "@/components/GoogleButton/GoogleButton"
import Input from "@/components/Input/Input"
import { Link } from "@/components/Link/Link"
import { Logo } from "@/components/Logo/Logo"
import { PageLoaderFallback } from "@/components/PageLoader/PageLoader"
import { ActionState } from "@/lib/auth/middleware"
import { cn } from "@/lib/utils"
import Divider from "./components/Divider"
import ErrorMessage from "./components/ErrorMessage"

type LoginFormProps = {
  mode: "sign-in" | "sign-up"
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}

function LoginFormContent({ mode, action }: LoginFormProps) {
  const searchParams = useSearchParams()
  const urlError = searchParams?.get("error") ?? ""
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {
    error: urlError
  })

  const isSignUp = mode === "sign-up"

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center gap-9">
      <Logo className="text-white" size="lg" />

      {isSignUp ? (
        <div className="flex flex-col items-center gap-3.5">
          <h1 className="text-center font-semibold text-white">
            Create a free <br />
            University account
          </h1>
          <p className="text-primary-950 max-w-[364px] text-center text-base font-medium">
            Create your free account to learn from Framer University courses. No credit card required.
          </p>
        </div>
      ) : (
        <h1 className="text-center font-semibold text-white">Log in to University</h1>
      )}

      <form className="flex w-full flex-col items-center gap-6" action={formAction}>
        <GoogleButton className="h-11 w-full">{isSignUp ? "Continue with Google" : "Log in with Google"}</GoogleButton>
        <Divider />

        <div className="flex w-full flex-col gap-3">
          <Input
            placeholder="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.email}
            maxLength={50}
            variant={state.fieldErrors?.email ? "error" : "default"}
            errorText={state.fieldErrors?.email}
            required
          />

          {isSignUp && (
            <div className="flex">
              <Input
                placeholder="First name"
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                defaultValue={state.firstName}
                maxLength={50}
                variant={state.fieldErrors?.firstName ? "error" : "default"}
                errorText={state.fieldErrors?.firstName}
                className={cn(
                  "w-full rounded-r-none border-r border-white/5 focus:relative focus:z-10",
                  !state.fieldErrors?.firstName &&
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(255,255,255,0.1)]"
                )}
                required
              />
              <Input
                placeholder="Last name"
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                defaultValue={state.lastName}
                maxLength={50}
                variant={state.fieldErrors?.lastName ? "error" : "default"}
                errorText={state.fieldErrors?.lastName}
                className={cn(
                  "w-full rounded-l-none focus:relative focus:z-10",
                  !state.fieldErrors?.lastName &&
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(255,255,255,0.1)]"
                )}
                required
              />
            </div>
          )}
        </div>

        {state.error && !state.fieldErrors && <ErrorMessage classname="w-full">{state.error}</ErrorMessage>}

        <Button className="w-full" size="md" type="submit">
          {pending ? "Sending..." : isSignUp ? "Create account" : "Sign in"}
        </Button>

        <div className="text-small flex gap-1 font-medium">
          <p className="text-primary-900">{isSignUp ? "Already have an account?" : "Don't have an account?"}</p>
          <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="text-primary-950" variant="secondary">
            {isSignUp ? "Log in" : "Sign up"}
          </Link>
        </div>
      </form>
    </div>
  )
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Suspense fallback={<PageLoaderFallback />}>
      <LoginFormContent {...props} />
    </Suspense>
  )
}
