"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, SquareStack, LogOut, Plus } from "lucide-react";

const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/flashcards", label: "Flashcards", icon: SquareStack },
];

const DOT_COLORS = ["#f472b6", "#34d399", "#a78bfa", "#fbbf24", "#38bdf8", "#fb7185"];

export default function AppShell({
                                     children,
                                     subjects = [],
                                     selectedSubject = "All",
                                     onSelectSubject,
                                 }: {
    children: React.ReactNode;
    subjects?: string[];
    selectedSubject?: string;
    onSelectSubject?: (subject: string) => void;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth?action=logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    return (
        <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#fff" }}>
            <aside
                className="app-sidebar"
                style={{
                    width: 240,
                    flexShrink: 0,
                    flexDirection: "column",
                    padding: 20,
                    background: "#fff",
                    borderRight: "1px solid #e2e8f0",
                }}
            >
                <Link href="/" className="mb-8 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-sm font-bold text-slate-900">
                        S
                    </div>
                    <span className="font-serif text-xl font-semibold text-slate-900">StudyPrep</span>
                </Link>

                <nav className="space-y-1">
                    {items.map(({ href, label, icon: Icon }) => {
                        const active =
                            href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {onSelectSubject && (
                    <>
                        <div style={{ margin: "20px 0", borderTop: "1px solid #e2e8f0" }} />

                        <div className="mb-2 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <span>Subjects</span>
                            <Plus size={14} />
                        </div>

                        <div className="space-y-1">
                            {subjects.length === 0 && (
                                <p className="px-3 text-xs text-slate-400">No subjects yet</p>
                            )}
                            {subjects.map((subject, i) => {
                                const selected = selectedSubject.toLowerCase() === subject.toLowerCase();
                                return (
                                    <button
                                        key={subject}
                                        onClick={() => onSelectSubject(selected ? "All" : subject)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                            selected
                                                ? "bg-slate-100 font-medium text-slate-900"
                                                : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                    <span
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            flexShrink: 0,
                            background: DOT_COLORS[i % DOT_COLORS.length],
                        }}
                    />
                                        <span className="truncate">{subject}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100"
                >
                    <LogOut size={16} />
                    Log out
                </button>
            </aside>

            <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        </div>
    );
}