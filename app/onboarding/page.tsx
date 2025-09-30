import { submitOnboardingResponse } from "@/lib/db/queries"
import OnboardingForm from "./Form"

export default function OnboardingPage() {
  return <OnboardingForm submitAction={submitOnboardingResponse} />
}
