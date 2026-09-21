import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { AdminSidebar } from "./admin-sidebar";

// proxy.ts에서 이미 /admin 경로를 보호하지만, 서버 컴포넌트에서도 한 번 더
// 세션을 검증합니다 (요구사항: 서버 사이드에서 관리자 세션 쿠키 검증).
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar adminId={session.adminId} />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
