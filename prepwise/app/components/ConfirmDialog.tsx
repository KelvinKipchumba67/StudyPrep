"use client";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

export default function ConfirmDialog({
                                          open,
                                          title,
                                          description,
                                          confirmWord,
                                          warning,
                                          confirmLabel = "Delete",
                                          loading = false,
                                          onCancel,
                                          onConfirm,
                                      }: {
    open: boolean;
    title: string;
    description: string;
    confirmWord: string;
    warning: string;
    confirmLabel?: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    const [typed, setTyped] = useState("");

    useEffect(() => {
        if (open) setTyped("");
    }, [open]);
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onCancel();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, loading, onCancel]);

    if (!open) return null;

    const matches = typed.trim() === confirmWord;
    const canDelete = matches && !loading;

    return (
        <div
            onClick={() => !loading && onCancel()}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
                background: "rgba(15, 23, 42, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: 440,
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div style={{ padding: "20px 24px 16px" }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                        {title}
                    </h3>
                    <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5, color: "#475569" }}>
                        {description}
                    </p>
                </div>

                {/* Confirm input */}
                <div
                    style={{
                        padding: "16px 24px",
                        background: "#f8fafc",
                        borderTop: "1px solid #e2e8f0",
                        borderBottom: "1px solid #e2e8f0",
                    }}
                >
                    <label style={{ display: "block", fontSize: 14, color: "#334155", marginBottom: 8 }}>
                        To confirm, type <b style={{ color: "#0f172a" }}>&ldquo;{confirmWord}&rdquo;</b>
                    </label>
                    <input
                        autoFocus
                        value={typed}
                        onChange={(e) => setTyped(e.target.value)}
                        disabled={loading}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "10px 12px",
                            fontSize: 14,
                            color: "#0f172a",
                            background: "#fff",
                            border: "1px solid #cbd5e1",
                            borderRadius: 8,
                            outline: "none",
                        }}
                    />
                </div>

                {/* Warning */}
                <div style={{ padding: "16px 24px 0" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 12px",
                            fontSize: 14,
                            color: "#b91c1c",
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: 8,
                        }}
                    >
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{warning}</span>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "16px 24px 20px",
                    }}
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            padding: "8px 16px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#334155",
                            background: "#fff",
                            border: "1px solid #cbd5e1",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={!canDelete}
                        style={{
                            padding: "8px 16px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#fff",
                            background: canDelete ? "#dc2626" : "#fca5a5",
                            border: "none",
                            borderRadius: 8,
                            cursor: canDelete ? "pointer" : "not-allowed",
                        }}
                    >
                        {loading ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}