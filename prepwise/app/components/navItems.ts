import { Home, LayoutDashboard, SquareStack } from "lucide-react";

export const DASHBOARD_HREF = "/dashboard";

export const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/flashcards", label: "Flashcards", icon: SquareStack },
];