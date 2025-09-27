import Image from "next/image"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen bg-black">
      <section className="flex flex-1 items-center justify-center px-6">{children}</section>
      <section className="tablet:flex-1 tablet:flex hidden p-6">
        <div className="relative h-full w-full">
          <Image src="/auth-art.jpg" alt="Login Image" fill={true} />
        </div>
      </section>
    </main>
  )
}
