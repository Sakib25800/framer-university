"use client"

import SpeechBubble from '../components/SpeechBubble'
import Quote from '@/components/Quote/Quote'
import { saveOnboardingServerAction } from '@/lib/onboarding/actions'
import { motion } from 'motion/react'

export default function Step6({ source, goal, experience }: { source: string; goal: string; experience: string }) {
  return (
    <form action={saveOnboardingServerAction} className="flex flex-col gap-[40px] px-6">
      {/* Heading-like bubble */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <SpeechBubble message="Ready to start learning?" />
      </motion.div>
      
      {/* Testimonial quote */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <Quote>
          <p>
            <strong>Nandi spoon feeds beginners!</strong> I just learned page and navigation responsiveness today.
          </p>
          <p className="mt-4">
            <strong className="text-white">— Mahin Rahman</strong>
          </p>
        </Quote>
      </motion.div>
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="goal" value={goal} />
      <input type="hidden" name="experience" value={experience} />
    </form>
  )
}
