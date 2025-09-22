import { Metadata } from "next"
import { Logo } from "@/components/Logo/Logo"

export const metadata: Metadata = {
  title: "Framer University",
}

export default function Web() {
  return (
    <div className="h-screen w-screen bg-black">
      <p>Home</p>
      <Logo beta={true} />
      <Logo />
    </div>
  )
}
