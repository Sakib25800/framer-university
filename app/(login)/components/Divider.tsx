export default function Divider() {
  return (
    <div className="flex w-full items-center justify-center gap-2.5">
      <div className="bg-primary-300 h-px flex-1" />
      <div className="text-primary-950 text-base font-medium">or</div>
      <div className="bg-primary-300 h-px flex-1" />
    </div>
  )
}
