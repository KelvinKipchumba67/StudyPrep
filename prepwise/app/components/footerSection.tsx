import Link from "next/link";

const columns = [
    {
        title: "Product",
        links: [
            { href: "/#home", label: "Home" },
            { href: "/#features", label: "Features" },
            { href: "/#about", label: "About" },
        ],
    },
    {
        title: "Support",
        links: [
            { href: "/#support", label: "Contact us" },
            { href: "/auth", label: "Sign in" },
        ],
    },
    {
        title: "Legal",
        links: [
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
        ],
    },
];

export default function Footer() {
    return (
        <footer style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
            <div className="sp-container" style={{ padding: "72px 24px 32px" }}>
                <div className="sp-footer-grid">
                    {/* Brand */}
                    <div className="sp-footer-brand">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
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
                        </div>
                        <p style={{ margin: 0, maxWidth: 280, fontSize: 14, lineHeight: 1.7, color: "#64748b" }}>
                            AI-powered study plans and flashcards, built around your exam date.
                        </p>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4
                                style={{
                                    margin: "0 0 18px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#0f172a",
                                }}
                            >
                                {col.title}
                            </h4>
                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                {col.links.map((l) => (
                                    <li key={l.href} style={{ marginBottom: 12 }}>
                                        <Link href={l.href} className="sp-footer-link">
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        marginTop: 56,
                        paddingTop: 24,
                        borderTop: "1px solid #e2e8f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                    }}
                >
                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                        © {new Date().getFullYear()} StudyPrep. All rights reserved.
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Plan smarter. Revise faster.</p>
                </div>
            </div>
        </footer>
    );
}