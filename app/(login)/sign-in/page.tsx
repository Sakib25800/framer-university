"use client"

import { Button } from "@/components/Button/Button"
import GoogleButton from "@/components/GoogleButton/GoogleButton"
import Input from "@/components/Input/Input"
import { Link } from "@/components/Link/Link"
import { Logo } from "@/components/Logo/Logo"
import Divider from "../Divider"

export default function SignInPage() {
  return (
    <div className="flex w-full max-w-[400px] flex-col items-center gap-9">
      <Logo className="text-white" size="lg" />
      <h1 className="text-center font-semibold text-white">Log in to University</h1>
      <div className="flex w-full flex-col items-center gap-6">
        <GoogleButton className="h-11 w-full">Log in with Google</GoogleButton>
        <Divider />
        <Input placeholder="Email" />
        <Button className="w-full" size="md">
          Send magic link
        </Button>
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
