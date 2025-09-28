export default function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-[#FF4545]/20 p-2">
      <p className="text-small text-error font-medium">{children}</p>
    </div>
  )
}
