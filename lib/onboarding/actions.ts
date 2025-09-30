"use server"

import { getUser, upsertOnboardingResponses } from "@/lib/db/queries"
import type { TablesInsert } from "@/types/supabase"

export async function saveOnboardingServerAction(formData: FormData): Promise<void> {
    const user = await getUser()
    if (!user) throw new Error("Unauthorized")

    // Accept any subset; ignore empty values
    const source = (formData.get("source") || "").toString() || undefined
    const goal = (formData.get("goal") || "").toString() || undefined
    const experience = (formData.get("experience") || "").toString() || undefined

    const payload: Partial<TablesInsert<'onboarding_responses'>> = { source, goal, experience }
    const hasUpdates = Object.values(payload).some((v) => typeof v !== "undefined" && v !== "")
    if (!hasUpdates) return

    await upsertOnboardingResponses(user.id, payload)
}


