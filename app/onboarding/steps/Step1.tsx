"use client"

import { motion } from "motion/react"
import { RadioButton } from "@/components/RadioButton/RadioButton"
import SpeechBubble from "../components/SpeechBubble"

export default function Step1({ value, onChangeAction }: { value: string; onChangeAction: (value: string) => void }) {
  const options = [
    "X (Twitter)",
    "YouTube",
    "Google Search",
    "Facebook/Instagram",
    "TikTok",
    "Friends/Family",
    "News/article/blog",
    "Other"
  ]

  return (
    <div className="flex w-full flex-1 flex-col gap-10">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <SpeechBubble message="Where did you hear about Framer University?" />
      </motion.div>
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.12, 0.23, 0.5, 1] }}
      >
        {options.map((option) => (
          <RadioButton
            key={option}
            name="source"
            value={option}
            label={option}
            checked={value === option}
            onChange={(e) => onChangeAction(e.target.value)}
          />
        ))}
      </motion.div>
    </div>
  )
}
