import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-zinc-500">Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
