"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/Button/Button"
import { Link } from "@/components/Link/Link"

export default function MagicLinkPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="flex max-w-[400px] flex-col gap-9">
      <div className="flex flex-col items-center gap-3.5">
        <h1 className="font-semibold text-white">Check your inbox</h1>
        <p className="text-primary-950 text-center text-base font-medium">
          We've sent a login link to {email ? <span className="text-white">{email}</span> : "your email"}. Please make
          sure to check the spam folder too.
        </p>
      </div>
      <div className="text-small flex w-full flex-col items-center gap-6">
        <Button size="md" className="w-full">
          Send again
        </Button>
        <Link href="/sign-in" className="text-small text-primary-950 font-medium" variant="secondary">
          Back to log in
        </Link>
      </div>
    </div>
  )
}
