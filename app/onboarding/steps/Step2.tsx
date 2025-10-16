"use client"

import { motion } from "motion/react"
import { RadioButton } from "@/components/RadioButton/RadioButton"
import SpeechBubble from "../components/SpeechBubble"

export default function Step2({ value, onChangeAction }: { value: string; onChangeAction: (value: string) => void }) {
  const goals = [
    "Customizing a template I bought",
    "Building my first website",
    "Leveling up my Framer skills",
    "Launching a website for my business",
    "Making money with Framer",
    "Something else"
  ]

  return (
    <div className="flex flex-col gap-[40px] px-6">
      <motion.h2
        className="sr-only"
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
      >
        What is your top goal?
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <SpeechBubble message="What is your top goal?" />
      </motion.div>
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.12, 0.23, 0.5, 1] }}
      >
        {goals.map((goal) => (
          <RadioButton
            key={goal}
            name="goal"
            value={goal}
            label={goal}
            checked={value == goal}
            onChange={(e) => onChangeAction(e.target.value)}
          />
        ))}
      </motion.div>
    </div>
  )
}
