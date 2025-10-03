"use client"

import { motion } from "motion/react"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Button } from "@/components/Button/Button"
import { Link } from "@/components/Link/Link"
import { PageLoaderFallback } from "@/components/PageLoader/PageLoader"
import { signIn, signUp } from "../actions"

function MagicLinkContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const type = searchParams.get("type") // "signin" or "signup"
  const firstName = searchParams.get("firstName")
  const lastName = searchParams.get("lastName")
  const [isLoading, setIsLoading] = useState(false)

  const fadeInTransition = {
    ease: [0.12, 0.23, 0.5, 1] as const,
    duration: 0.3,
  }

  const handleResend = async () => {
    if (!email) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("email", email)

      if (type === "signup" && firstName && lastName) {
        formData.append("firstName", firstName)
        formData.append("lastName", lastName)
        await signUp({ error: "" }, formData)
      } else {
        await signIn({ error: "" }, formData)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex max-w-[400px] flex-col gap-9">
      <div className="flex flex-col items-center gap-3.5">
        <motion.h1
          className="font-semibold text-white"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...fadeInTransition, delay: 0.1 }}
        >
          Check your inbox
        </motion.h1>
        <motion.p
          className="text-primary-950 text-center text-base font-medium"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...fadeInTransition, delay: 0.15 }}
        >
          We've sent a login link to {email ? <span className="text-white">{email}</span> : "your email"}. Please make
          sure to check the spam folder too.
        </motion.p>
      </div>
      <div className="text-small flex flex-col items-center gap-6">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...fadeInTransition, delay: 0.2 }}
        >
          <Button size="md" className="w-full" onClick={handleResend} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send again"}
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...fadeInTransition, delay: 0.25 }}
        >
          <Link href="/sign-in" className="text-small text-primary-950 font-medium" variant="secondary">
            Back to log in
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function MagicLinkPage() {
  return (
    <Suspense fallback={<PageLoaderFallback />}>
      <MagicLinkContent />
    </Suspense>
  )
}
