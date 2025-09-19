import { Metadata } from "next"
import { Button } from "components/Button/Button"

export const metadata: Metadata = {
  title: "Framer University",
}

export default function Web() {
  return (
    <div>
      <p>Home</p>
      <Button href="test.com">Button</Button>
    </div>
  )
}
