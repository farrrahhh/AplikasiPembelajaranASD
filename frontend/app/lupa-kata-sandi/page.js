import PasswordResetPage from "@/components/auth/password-reset-page";

export const metadata = {
  title: "Lupa Kata Sandi",
};

export default function ForgotPasswordPage() {
  return <PasswordResetPage mode="request" />;
}
