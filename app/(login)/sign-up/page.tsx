"use client"

import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/Button/Button"
import GoogleButton from "@/components/GoogleButton/GoogleButton"
import Input from "@/components/Input/Input"
import { Link } from "@/components/Link/Link"
import { Logo } from "@/components/Logo/Logo"
import { ActionState } from "@/lib/auth/middleware"
import { signUp } from "../actions"
import Divider from "../Divider"

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
      <GoogleButton className="h-11 w-full" />
      <Divider />
      <form className="flex flex-col gap-3" action={formAction}>
        <Input placeholder="Email" />
        <div className="flex">
          <Input
            placeholder="First name"
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            defaultValue={state.first_name}
            maxLength={50}
            className="w-full rounded-r-none border-r border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(255,255,255,0.1)] focus:relative focus:z-10"
            required
          />
          <Input
            placeholder="Second name"
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            defaultValue={state.last_name}
            maxLength={50}
            className="w-full rounded-l-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_4px_0_rgba(255,255,255,0.1)] focus:relative focus:z-10"
            required
          />
        </div>
        {state?.error && <p className="text-small text-error font-medium">{state.error}</p>}
        <Button className="w-full" size="md">
          {pending ? "Sending..." : "Create account"}
        </Button>
      </form>
      <div className="text-small flex gap-1 font-medium">
        <p className="text-primary-900">Already have an account?</p>
        <Link href="/sign-in" className="text-primary-950" variant="secondary">
          Log in
        </Link>
      </div>
    </div>
  )
}
