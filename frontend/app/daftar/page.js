import { Suspense } from "react";

import AuthPage from "@/components/auth/auth-page";

export const metadata = {
  title: "Daftar",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthPage mode="register" />
    </Suspense>
  );
}
