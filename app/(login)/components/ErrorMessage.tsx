import { cn } from "@/lib/utils"

export default function ErrorMessage({ children, classname }: { children: React.ReactNode; classname?: string }) {
  return (
    <div className={cn("rounded-md bg-[#FF4545]/20 p-2 first-letter:uppercase", classname)}>
      <p className="text-small text-error font-medium">{children}</p>
    </div>
  )
}
