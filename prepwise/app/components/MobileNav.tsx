"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./navItems";

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
            <ul className="grid grid-cols-3">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active =
                        href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                                    active ? "text-blue-600" : "text-slate-500"
                                }`}
                            >
                                <Icon size={20} />
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}