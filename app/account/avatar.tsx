"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { uploadAvatarAction } from "./avatar-actions"

interface AvatarProps {
  uid: string
  url: string | null
  size: number
  onUploadAction: (url: string) => void
}

export default function Avatar({ url, size, onUploadAction }: AvatarProps) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from("avatars").download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.error("Error downloading image: ", error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]

      // Create FormData to send to the server action
      const formData = new FormData()
      formData.append("file", file as Blob)

      // Call the server action
      const result = await uploadAvatarAction(formData)

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.filePath) {
        onUploadAction(result.filePath)
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
      alert("Error uploading avatar!")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div>{avatarUrl ? <Image src={avatarUrl} alt="Avatar" width={size} height={size} /> : <div>No image</div>}</div>
      <div>
        <label htmlFor="single">{uploading ? "Uploading..." : "Upload Image"}</label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
