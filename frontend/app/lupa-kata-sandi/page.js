import { Suspense } from "react";

import PasswordResetPage from "@/components/auth/password-reset-page";

export const metadata = {
  title: "Lupa Kata Sandi",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <PasswordResetPage mode="request" />
    </Suspense>
  );
}
