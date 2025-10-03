import { request } from "@playwright/test"

export const getLoginLink = async (username: string): Promise<string> => {
  const requestContext = await request.newContext()
  const response = await requestContext.get(`${process.env.SUPABASE_MAILPIT_URL}/api/v1/search?query=to:${username}`)
  const data = await response.json()
  const messages = data.messages || []

  const sortedMessages = [...messages].sort((a, b) => (a.Created < b.Created ? 1 : a.Created > b.Created ? -1 : 0))

  const latestMessageId = sortedMessages[0]?.ID
  if (latestMessageId) {
    const message = await requestContext
      .get(`${process.env.SUPABASE_MAILPIT_URL}/api/v1/message/${latestMessageId}`)
      .then((res) => res.json())

    // Extract the magic link URL from the email body
    const url = message.Text.match(/https?:\/\/[^\s]+/)[0]
    return url
  }

  return ""
}

// Retrieve the latest magic link token from the mailbox
export const waitForNewLink = async (oldLink: string, email: string) => {
  let triesLeft = 5
  return new Promise<Awaited<ReturnType<typeof getLoginLink>>>((resolve, reject) => {
    const interval = setInterval(async () => {
      const link = await getLoginLink(email)
      if (link && link !== oldLink) {
        resolve(link)
        clearInterval(interval)
      } else if (triesLeft <= 1) {
        reject(new Error(`Timeout waiting for magic link email for ${email}`))
        clearInterval(interval)
      }
      triesLeft--
    }, 100)
  })
}
