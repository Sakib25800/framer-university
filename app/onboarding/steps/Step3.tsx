import { useState } from 'react'
import SpeechBubble from '../components/SpeechBubble'
import { RadioButton } from '@/components/RadioButton/RadioButton'

export default function Step3() {
  const [selectedGoal, setSelectedGoal] = useState('')

  const goals = [
    'Customizing a template I bought',
    'Building my first website',
    'Leveling up my Framer skills',
    'Launching a website for my business',
    'Making money with Framer',
    'Something else'
  ]

  return (
    <div className="flex flex-col gap-[40px] px-6">
      {/* Speech bubble */}
      <SpeechBubble message="What is your top goal?" />
      
      {/* Goals list */}
      <div className="flex flex-col gap-4">
        {goals.map((goal) => (
          <RadioButton
            key={goal}
            name="goal"
            value={goal}
            label={goal}
            checked={selectedGoal === goal}
            onChange={(e) => setSelectedGoal(e.target.value)}
          />
        ))}
      </div>
    </div>
  )
}
