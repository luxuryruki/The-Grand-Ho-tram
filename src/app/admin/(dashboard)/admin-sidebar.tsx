"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BedDouble,
  CalendarRange,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSULT_ENABLED } from "@/lib/features";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "이벤트 관리", icon: CalendarRange },
  { href: "/admin/hotel-types", label: "호텔 타입", icon: BedDouble },
  { href: "/admin/reservations", label: "예약 요청", icon: Users },
  ...(CONSULT_ENABLED
    ? [{ href: "/admin/consultations", label: "AI 상담 로그", icon: MessageSquare }]
    : []),
];

export function AdminSidebar({ adminId }: { adminId: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex shrink-0 flex-col justify-between border-b border-border bg-bg-elevated px-5 py-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div>
        <div className="mb-8 px-2">
          <p className="text-sm font-semibold tracking-[0.18em] text-fg">
            THE GRAND
          </p>
          <p className="mt-0.5 text-xs text-fg-subtle">관리자 대시보드</p>
        </div>
        <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-fg"
                    : "text-fg-muted hover:bg-bg-elevated-2 hover:text-fg"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 flex items-center justify-between gap-2 border-t border-border px-2 pt-4 md:mt-0">
        <span className="truncate text-xs text-fg-subtle">{adminId}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-fg-muted transition-colors hover:bg-bg-elevated-2 hover:text-fg"
        >
          <LogOut size={14} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
