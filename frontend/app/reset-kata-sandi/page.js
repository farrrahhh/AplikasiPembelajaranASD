import PasswordResetPage from "@/components/auth/password-reset-page";

export const metadata = {
  title: "Reset Kata Sandi",
};

export default function ResetPasswordPage() {
  return <PasswordResetPage mode="reset" />;
}
