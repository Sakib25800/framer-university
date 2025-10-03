import { signUp } from "../actions"
import { LoginForm } from "../LoginForm"

export default function SignUpPage() {
  return <LoginForm mode="sign-up" action={signUp} />
}
