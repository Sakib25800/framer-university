"use client"

import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/Button/Button"
import GoogleButton from "@/components/GoogleButton/GoogleButton"
import Input from "@/components/Input/Input"
import { Link } from "@/components/Link/Link"
import { Logo } from "@/components/Logo/Logo"
import { ActionState } from "@/lib/auth/middleware"
import { cn } from "@/lib/utils"
import { signUp } from "../actions"
import Divider from "../components/Divider"
import ErrorMessage from "../components/ErrorMessage"

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signUp, {
    error: urlError || "",
  })

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center gap-9">
      <Logo className="text-white" size="lg" />
      <div className="flex flex-col items-center gap-3.5">
        <h1 className="text-center font-semibold text-white">
          Create a free <br />
          University account
        </h1>
        <p className="text-primary-950 max-w-[364px] text-center text-base font-medium">
          Create your free account to learn from Framer University courses. No credit card required.
        </p>
      </div>
      <form className="flex flex-col items-center gap-6" action={formAction}>
        <GoogleButton className="h-11 w-full" />
        <Divider />
        <div className="flex flex-col gap-3">
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
        </div>
        {state.error && !state.fieldErrors && <ErrorMessage>{state.error}</ErrorMessage>}
        <Button className="w-full" size="md" type="submit">
          {pending ? "Sending..." : "Create account"}
        </Button>
        <div className="text-small flex gap-1 font-medium">
          <p className="text-primary-900">Already have an account?</p>
          <Link href="/sign-in" className="text-primary-950" variant="secondary">
            Log in
          </Link>
        </div>
      </form>
    </div>
  )
}
