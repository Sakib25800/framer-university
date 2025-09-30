import { useState } from 'react'
import SpeechBubble from '../components/SpeechBubble'
import { RadioButton } from '@/components/RadioButton/RadioButton'

export default function Step2() {
  const [selectedOption, setSelectedOption] = useState('')

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
      <SpeechBubble message="Where did you hear about Framer University?" />
      
      {/* Options grid */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <RadioButton
            key={option}
            name="source"
            value={option}
            label={option}
            checked={selectedOption === option}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
        ))}
      </div>
    </div>
  )
}
