"use client"

import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/Button/Button"
import GoogleButton from "@/components/GoogleButton/GoogleButton"
import Input from "@/components/Input/Input"
import { Link } from "@/components/Link/Link"
import { Logo } from "@/components/Logo/Logo"
import { ActionState } from "@/lib/auth/middleware"
import { signIn } from "../actions"
import Divider from "../components/Divider"
import ErrorMessage from "../components/ErrorMessage"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")

  const [state, formAction, pending] = useActionState<ActionState, FormData>(signIn, {
    error: urlError || "",
  })

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center gap-9">
      <Logo className="text-white" size="lg" />
      <h1 className="text-center font-semibold text-white">Log in to University</h1>
      <div className="flex w-full flex-col items-center gap-6">
        <GoogleButton className="h-11 w-full">Log in with Google</GoogleButton>
        <Divider />
        <form action={formAction} className="flex w-full flex-col gap-6">
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
          {state.error && !state.fieldErrors && <ErrorMessage>{state.error}</ErrorMessage>}
          <Button className="w-full" size="md" type="submit">
            {pending ? "Sending..." : "Sign in"}
          </Button>
        </form>
        <div className="text-small flex gap-1 font-medium">
          <p className="text-primary-900">Don't have an account?</p>
          <Link href="/sign-up" className="text-primary-950" variant="secondary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
