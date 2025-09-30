import SpeechBubble from '../components/SpeechBubble'
import Quote from '@/components/Quote/Quote'
import { completeOnboardingServerAction } from '@/lib/onboarding/actions'

export default function Step6() {
  return (
    <form action={completeOnboardingServerAction} className="flex flex-col gap-[40px] px-6">
      {/* Speech bubble */}
      <SpeechBubble message="Ready to start learning?" />
      
      {/* Testimonial quote */}
      <Quote>
        <p>
          <strong>Nandi spoon feeds beginners!</strong> I just learned page and navigation responsiveness today.
        </p>
        <p className="mt-4">
          <strong className="text-white">— Mahin Rahman</strong>
        </p>
      </Quote>
    </form>
  )
}
