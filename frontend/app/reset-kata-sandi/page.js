import { Suspense } from "react";

import PasswordResetPage from "@/components/auth/password-reset-page";

export const metadata = {
  title: "Reset Kata Sandi",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <PasswordResetPage mode="reset" />
    </Suspense>
  );
}
