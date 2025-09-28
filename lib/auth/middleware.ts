import { User } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getUser } from "@/lib/db/queries"

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ActionState = {
  error?: string
  success?: string
  fieldErrors?: Record<string, string>
  [key: string]: any
}

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (data: z.infer<S>, formData: FormData) => Promise<T>

export function validatedAction<S extends z.ZodType<any, any>, T>(schema: S, action: ValidatedActionFunction<S, T>) {
  return async (prevState: ActionState, formData: FormData) => {
    const result = schema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
      // Create field-specific errors
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          const fieldName = error.path[0] as string
          fieldErrors[fieldName] = error.message
        }
      })

      // Extract form values to preserve them
      const formValues = Object.fromEntries(formData)

      return {
        ...formValues, // Preserve form values
        fieldErrors,
        // Only show global error if there are no field-specific errors
        error: Object.keys(fieldErrors).length === 0 ? result.error.errors?.[0]?.message : undefined,
      }
    }

    return action(result.data, formData)
  }
}

type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
  user: User
) => Promise<T>

export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const user = await getUser()
    if (!user) {
      redirect("/sign-in")
    }

    const result = schema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
      // Create field-specific errors
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          const fieldName = error.path[0] as string
          fieldErrors[fieldName] = error.message
        }
      })

      // Extract form values to preserve them
      const formValues = Object.fromEntries(formData)

      return {
        ...formValues, // Preserve form values
        fieldErrors,
        // Only show global error if there are no field-specific errors
        error: Object.keys(fieldErrors).length === 0 ? result.error.errors?.[0]?.message : undefined,
      }
    }

    return action(result.data, formData, user)
  }
}
