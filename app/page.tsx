import { Metadata } from "next"
import Image from "next/image"
import { Button } from "@/components/Button/Button"

export const metadata: Metadata = {
  title: "Framer University",
}

export default function Web() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#0E0E0E] px-6 text-white">
      <Image src="/TV.png" alt="Retro TV with color bars" width={298} height={315} priority quality={100} />
      <div className="mt-[40px] flex flex-col items-center text-center">
        <h1 className="font-semibold">
          You&apos;re gonna want <br /> to see this.
        </h1>
        <p className="text-primary-950 mt-[12px] text-base font-medium">And you&apos;re probably not prepared…</p>
        <Button size="sm" className="mt-6" variant="primary" href="https://framer.university/waitlist">
          Join waitlist
        </Button>
      </div>
    </div>
  )
}
