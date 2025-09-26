"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const error = searchParams.get("error")
    setErrorMessage(error || "An unexpected error occurred")
  }, [searchParams])

  return (
    <div>
      <div>
        <h2>Error</h2>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3>Error Message</h3>
                  <div>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link href="/login">Return to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
