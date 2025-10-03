import { signIn } from "../actions"
import { LoginForm } from "../LoginForm"

export default function SignInPage() {
  return <LoginForm mode="sign-in" action={signIn} />
}
