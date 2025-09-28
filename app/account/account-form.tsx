"use client"

import { User } from "@supabase/supabase-js"
import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Avatar from "./avatar"

export default function AccountForm({ user }: { user: User }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`first_name, last_name, avatar_url`)
        .eq("id", user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFirstName(data.first_name || "")
        setLastName(data.last_name || "")
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      alert("Error loading user data!")
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    firstName,
    lastName,
    avatar_url,
  }: {
    firstName: string
    lastName: string
    avatar_url?: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        first_name: firstName,
        last_name: lastName,
        avatar_url,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      alert("Profile updated!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating the data!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Your Profile</h2>

      <div>
        <Avatar
          uid={user.id}
          url={avatarUrl}
          size={150}
          onUploadAction={(url) => {
            setAvatarUrl(url)
            updateProfile({ firstName, lastName, avatar_url: url })
          }}
        />
      </div>

      <div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={user?.email} disabled />
        </div>

        <div>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div>
          <button
            onClick={() => updateProfile({ firstName, lastName, avatar_url: avatarUrl })}
            disabled={loading || !firstName.trim() || !lastName.trim()}
          >
            {loading ? "Loading..." : "Update Profile"}
          </button>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button type="submit">Sign out</button>
          </form>
        </div>
      </div>
    </div>
  )
}
