import Image from 'next/image'
import BubbleCornerIcon from '@/components/icons/bubble-corner.svg'

interface SpeechBubbleProps {
  message: string
  avatarSrc?: string
  avatarAlt?: string
}

export default function SpeechBubble({ 
  message, 
  avatarSrc = "/nandi.jpg", 
  avatarAlt = "Avatar" 
}: SpeechBubbleProps) {
  return (
    <div className="flex items-end gap-[14px] justify-center">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image 
          src={avatarSrc} 
          alt={avatarAlt} 
          width={40} 
          height={40}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Message bubble */}
      <div className="relative bg-primary-300 rounded-[20px] px-4 py-3 max-w-[280px]">
        <p className="text-white body-medium">
          {message}
        </p>
        {/* Bubble corner icon */}
        <BubbleCornerIcon className="absolute bottom-[6px] left-[-5.5px] w-4 h-4 text-primary-300" />
      </div>
    </div>
  )
}
