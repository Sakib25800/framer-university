import { useRef, useState } from 'react'
import { saveOnboardingServerAction } from '@/lib/onboarding/actions'
import SpeechBubble from '../components/SpeechBubble'
import { RadioButton } from '@/components/RadioButton/RadioButton'
import Lvl0Icon from '@/components/icons/lvl-0.svg'
import Lvl1Icon from '@/components/icons/lvl-1.svg'
import Lvl2Icon from '@/components/icons/lvl-2.svg'
import Lvl3Icon from '@/components/icons/lvl-3.svg'
import Lvl4Icon from '@/components/icons/lvl-4.svg'

export default function Step5() {
  const [selectedLevel, setSelectedLevel] = useState('')
  const formRef = useRef<HTMLFormElement | null>(null)

  const levels = [
    { value: '0', label: 'Never used Framer',   subtext: "Haven't tried it yet",               icon: Lvl0Icon },
    { value: '1', label: 'Just started',        subtext: "I've played around with the basics", icon: Lvl1Icon },
    { value: '2', label: 'Built a few things',  subtext: 'Comfortable with basic features',     icon: Lvl2Icon },
    { value: '3', label: 'Regular user',        subtext: 'Familiar with most features',         icon: Lvl3Icon },
    { value: '4', label: 'Advanced user',       subtext: 'Expert with advanced features',       icon: Lvl4Icon },
  ]

  return (
    <form ref={formRef} action={saveOnboardingServerAction} className="flex flex-col gap-[40px] px-6">
      {/* Speech bubble */}
      <SpeechBubble message="What's your experience with Framer?" />

      {/* Experience levels list */}
      <div className="flex flex-col gap-4">
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
              setTimeout(() => formRef.current?.requestSubmit(), 0)
            }}
          />
        ))}
      </div>
      <input type="hidden" name="experience" value={selectedLevel} />
    </form>
  )
}
