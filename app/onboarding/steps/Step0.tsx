"use client"

import { motion } from "motion/react"
import SpeechBubble from "../components/SpeechBubble"

export default function Step0() {
  return (
    <div className="flex flex-col gap-[30px]">
      <motion.h1
        className="text-center font-semibold text-white"
        initial={{ opacity: 0, scale: 1.05, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.75, 0.07, 0.31, 1] }}
      >
        Welcome to
        <br />
        Framer University!
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 1.05, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.75, 0.07, 0.31, 1] }}
      >
        <SpeechBubble message="Please allow me to ask 3 quick questions before we start learning." />
      </motion.div>
    </div>
  )
}
