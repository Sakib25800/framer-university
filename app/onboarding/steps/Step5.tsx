import { useState } from 'react'
import SpeechBubble from '../components/SpeechBubble'
import { RadioButton } from '@/components/RadioButton/RadioButton'
import Lvl0Icon from '@/components/icons/lvl-0.svg'
import Lvl1Icon from '@/components/icons/lvl-1.svg'
import Lvl2Icon from '@/components/icons/lvl-2.svg'
import Lvl3Icon from '@/components/icons/lvl-3.svg'
import Lvl4Icon from '@/components/icons/lvl-4.svg'

export default function Step5() {
  const [selectedLevel, setSelectedLevel] = useState('')

  const levels = [
    { value: 'never',        label: 'Never used Framer',   subtext: "Haven't tried it yet",                  icon: Lvl0Icon },
    { value: 'just-started', label: 'Just started',        subtext: "I've played around with the basics",    icon: Lvl1Icon },
    { value: 'few-things',   label: 'Built a few things',  subtext: 'Comfortable with basic features',        icon: Lvl2Icon },
    { value: 'regular',      label: 'Regular user',        subtext: 'Familiar with most features',            icon: Lvl3Icon },
    { value: 'advanced',     label: 'Advanced user',       subtext: 'Expert with advanced features',          icon: Lvl4Icon },
  ]

  return (
    <div className="flex flex-col gap-[40px] px-6">
      {/* Speech bubble */}
      <SpeechBubble message="What's your experience with Framer?" />

      {/* Experience levels list */}
      <div className="flex flex-col gap-4">
        {levels.map(({ value, label, subtext, icon }) => (
          <RadioButton
            key={value}
            name="experience"
            value={value}
            label={label}
            subtext={subtext}
            icon={icon}
            checked={selectedLevel === value}
            onChange={(e) => setSelectedLevel(e.target.value)}
          />
        ))}
      </div>
    </div>
  )
}
