"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function uploadAvatarAction(formData: FormData) {
  try {
    const supabase = await createClient()

    // Get the file from the form data
    const file = formData.get("file") as File
    if (!file) {
      return { error: "No file provided" }
    }

    // Get the user from the session
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "User not authenticated" }
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true })

    if (uploadError) {
      return { error: uploadError.message }
    }

    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: fileName }).eq("id", user.id)

    if (updateError) {
      return { error: updateError.message }
    }

    // Revalidate the path to update the UI
    revalidatePath("/account")

    return { filePath: fileName }
  } catch (error) {
    console.error("Error in uploadAvatarAction:", error)
    return { error: "Failed to upload avatar" }
  }
}
