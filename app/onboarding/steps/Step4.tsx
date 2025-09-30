import SpeechBubble from '../components/SpeechBubble'
import Quote from '@/components/Quote/Quote'

export default function Step4() {
  return (
    <div className="flex flex-col gap-[40px] px-6">
      {/* Speech bubble */}
      <SpeechBubble message="Turning your skills into income is the best!!" />
      
      {/* Quote */}
      <Quote>
        <p>
          Hundreds of creators mastered <strong>template development</strong> and <strong>freelancing</strong> through Framer University courses.
        </p>
        <p>
          Be ready to join the community of designers who turned their Framer expertise into passive income streams.
        </p>
      </Quote>
    </div>
  )
}
