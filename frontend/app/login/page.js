import { Suspense } from "react";

import AuthPage from "@/components/auth/auth-page";

export const metadata = {
  title: "Masuk",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthPage mode="login" />
    </Suspense>
  );
}
