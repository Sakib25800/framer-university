import { useRef, useState } from 'react'
import { saveOnboardingServerAction } from '@/lib/onboarding/actions'
import SpeechBubble from '../components/SpeechBubble'
import { RadioButton } from '@/components/RadioButton/RadioButton'

export default function Step2() {
  const [selectedOption, setSelectedOption] = useState('')
  const formRef = useRef<HTMLFormElement | null>(null)

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
    <form ref={formRef} action={saveOnboardingServerAction} className="flex flex-col gap-[40px] px-6">
      {/* Speech bubble */}
      <SpeechBubble message="Where did you hear about Framer University?" />
      
      {/* Options grid */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <RadioButton
            key={option}
            name="source_ux"
            value={option}
            label={option}
            checked={selectedOption === option}
            onChange={(e) => {
              setSelectedOption(e.target.value)
              // Save immediately
              setTimeout(() => formRef.current?.requestSubmit(), 0)
            }}
          />
        ))}
      </div>
      <input type="hidden" name="source" value={selectedOption} />
    </form>
  )
}
