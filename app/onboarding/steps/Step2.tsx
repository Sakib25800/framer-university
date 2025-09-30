"use client"

import { useState } from 'react'
import SpeechBubble from '../components/SpeechBubble'
import { RadioButton } from '@/components/RadioButton/RadioButton'
import { motion } from 'motion/react'

export default function Step2({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [selectedOption, setSelectedOption] = useState(value)

  const options = [
    'X (Twitter)',
    'YouTube',
    'Google Search',
    'Facebook/Instagram',
    'TikTok',
    'Friends/Family',
    'News/article/blog',
    'Other'
  ]

  return (
    <div className="flex flex-col gap-[40px] px-6">
      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <SpeechBubble message="Where did you hear about Framer University?" />
      </motion.div>
      
      {/* Options grid */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.12, 0.23, 0.5, 1] }}
      >
        {options.map((option) => (
          <RadioButton
            key={option}
            name="source_ux"
            value={option}
            label={option}
            checked={selectedOption === option}
            onChange={(e) => {
              setSelectedOption(e.target.value)
              onChange(e.target.value)
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
