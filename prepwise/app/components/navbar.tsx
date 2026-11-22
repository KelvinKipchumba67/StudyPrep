import Link from "next/link";

const links = [
    { href: "/#features", label: "Features" },
    { href: "/#about", label: "About" },
    { href: "/#support", label: "Support" },
];

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                borderBottom: "1px solid #e2e8f0",
            }}
        >
            <div
                className="sp-container"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 72,
                    padding: "0 24px",
                }}
            >
                <Link
                    href="/#home"
                    style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
                >
          <span
              style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0f172a",
              }}
          >
            S
          </span>
                    <span
                        style={{
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: 20,
                            fontWeight: 600,
                            color: "#0f172a",
                        }}
                    >
            StudyPrep
          </span>
                </Link>

                <nav className="sp-nav-links">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            style={{ fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none" }}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <Link
                    href={isLoggedIn ? "/dashboard" : "/auth"}
                    style={{
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: 9999,
                        padding: "9px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                    }}
                >
                    {isLoggedIn ? "Dashboard" : "Get Started"}
                </Link>
            </div>
        </header>
    );
}