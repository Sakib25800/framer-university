"use client"

import { useState } from "react"
import { login } from "./actions"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      await login(formData)
    } catch (error) {
      console.error("Login error:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div>
        <h2>Sign in to your account</h2>
        <p>We'll send you a magic link to your email</p>
      </div>

      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email address</label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send magic link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
