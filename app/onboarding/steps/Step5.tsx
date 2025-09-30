"use client"

import { useState } from 'react'
import SpeechBubble from '../components/SpeechBubble'
import { RadioButton } from '@/components/RadioButton/RadioButton'
import Lvl0Icon from '@/components/icons/lvl-0.svg'
import Lvl1Icon from '@/components/icons/lvl-1.svg'
import Lvl2Icon from '@/components/icons/lvl-2.svg'
import Lvl3Icon from '@/components/icons/lvl-3.svg'
import Lvl4Icon from '@/components/icons/lvl-4.svg'
import { motion } from 'motion/react'

export default function Step5({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [selectedLevel, setSelectedLevel] = useState(value)

  const levels = [
    { value: '0', label: 'Never used Framer',   subtext: "Haven't tried it yet",               icon: Lvl0Icon },
    { value: '1', label: 'Just started',        subtext: "I've played around with the basics", icon: Lvl1Icon },
    { value: '2', label: 'Built a few things',  subtext: 'Comfortable with basic features',     icon: Lvl2Icon },
    { value: '3', label: 'Regular user',        subtext: 'Familiar with most features',         icon: Lvl3Icon },
    { value: '4', label: 'Advanced user',       subtext: 'Expert with advanced features',       icon: Lvl4Icon },
  ]

  return (
    <div className="flex flex-col gap-[40px] px-6">
      {/* Heading + bubble */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <SpeechBubble message="What's your experience with Framer?" />
      </motion.div>

      {/* Experience levels list */}
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.12, 0.23, 0.5, 1] }}
      >
        {levels.map(({ value, label, subtext, icon }) => (
          <RadioButton
            key={value}
            name="experience_ux"
            value={value}
            label={label}
            subtext={subtext}
            icon={icon}
            checked={selectedLevel === value}
            onChange={(e) => {
              setSelectedLevel(e.target.value)
              onChange(e.target.value)
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
