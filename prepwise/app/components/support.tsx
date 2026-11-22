"use client";
import { useState } from "react";

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 500,
    color: "#334155",
};

export default function HelpSection() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [website, setWebsite] = useState(""); // honeypot, stays empty for real users
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("sending");
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message, website }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setStatus("sent");
            setName("");
            setEmail("");
            setMessage("");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            setStatus("error");
        }
    }

    return (
        <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
            <div className="sp-section">
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <div style={{ marginBottom: 40 }}>
                        <span
                            style={{
                                display: "inline-block",
                                background: "#eff6ff",
                                color: "#1d4ed8",
                                borderRadius: 9999,
                                padding: "5px 12px",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                            }}
                        >
                            Support
                        </span>
                        <h2
                            style={{
                                margin: "14px 0 6px",
                                fontSize: 32,
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                color: "#0f172a",
                            }}
                        >
                            Get in touch
                        </h2>
                        <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                            Found a bug, have feedback, or need help? Send us a message.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: 16,
                            padding: 36,
                            display: "flex",
                            flexDirection: "column",
                            gap: 24,
                        }}
                    >
                        <input
                            type="text"
                            name="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
                        />

                        <div>
                            <label style={labelStyle}>Your name</label>
                            <input
                                className="sp-input"
                                required
                                maxLength={100}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Email address</label>
                            <input
                                className="sp-input"
                                type="email"
                                required
                                maxLength={200}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Message</label>
                            <textarea
                                className="sp-input"
                                required
                                rows={6}
                                maxLength={3000}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="How can we help?"
                                style={{ resize: "none" }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "sending"}
                            style={{
                                background: "#2563eb",
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                padding: "12px 0",
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: status === "sending" ? "default" : "pointer",
                                opacity: status === "sending" ? 0.6 : 1,
                            }}
                        >
                            {status === "sending" ? "Sending..." : "Send message"}
                        </button>

                        {status === "sent" && (
                            <p
                                style={{
                                    margin: 0,
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    background: "#eff6ff",
                                    border: "1px solid #bfdbfe",
                                    color: "#1d4ed8",
                                    fontSize: 14,
                                }}
                            >
                                Thanks! Your message has been sent. We&apos;ll get back to you soon.
                            </p>
                        )}

                        {status === "error" && (
                            <p
                                style={{
                                    margin: 0,
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    background: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    color: "#b91c1c",
                                    fontSize: 14,
                                }}
                            >
                                {error}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}