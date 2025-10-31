"use client"

import { motion } from "motion/react"
import Quote from "@/components/Quote/Quote"
import SpeechBubble from "../components/SpeechBubble"

export default function Step5() {
  return (
    <div className="flex flex-col gap-10">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <SpeechBubble message="Ready to start learning?" />
      </motion.div>
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
    </div>
  )
}
