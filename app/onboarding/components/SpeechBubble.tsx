import Image from "next/image"
import BubbleCornerIcon from "@/components/icons/bubble-corner.svg"

interface SpeechBubbleProps {
  message: string
  avatarSrc?: string
  avatarAlt?: string
}

export default function SpeechBubble({ message, avatarSrc = "/nandi.jpg", avatarAlt = "Avatar" }: SpeechBubbleProps) {
  return (
    <div className="flex items-end justify-center gap-[14px]">
      {/* Avatar */}
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={avatarSrc} alt={avatarAlt} width={40} height={40} className="h-full w-full object-cover" />
      </div>

      {/* Message bubble */}
      <div className="bg-primary-300 relative max-w-[280px] rounded-[20px] px-4 py-3">
        <p className="body-medium text-white">{message}</p>
        {/* Bubble corner icon */}
        <BubbleCornerIcon className="text-primary-300 absolute bottom-[6px] left-[-5.5px] h-4 w-4" />
      </div>
    </div>
  )
}
