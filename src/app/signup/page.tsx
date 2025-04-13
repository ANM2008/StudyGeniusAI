import { Metadata } from "next"
import { SignUpForm } from "@/components/signup-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}