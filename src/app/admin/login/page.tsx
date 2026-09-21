import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "로그인",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
