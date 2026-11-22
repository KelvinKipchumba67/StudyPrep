import {
    Sparkles,
    CalendarClock,
    SquareStack,
    Upload,
    Bookmark,
    MousePointerClick,
    BookOpen,
} from "lucide-react";

const features = [
    {
        icon: Sparkles,
        title: "Personalized Study Plans",
        text: "Generate custom schedules tailored to your subject and topic list.",
    },
    {
        icon: CalendarClock,
        title: "Exam-Focused Planning",
        text: "Plans are built backward from your exam date, so they fit the days you actually have.",
    },
    {
        icon: SquareStack,
        title: "Smart Flashcards",
        text: "Turn your topics and notes into flashcard decks you can flip through and revise.",
    },
    {
        icon: Upload,
        title: "Upload Your Notes",
        text: "Drop in a PDF, Word or text file and generate flashcards straight from it.",
    },
    {
        icon: Bookmark,
        title: "Saved Plans & Subjects",
        text: "Every plan and deck is saved and organised by subject, so you can come back anytime.",
    },
    {
        icon: MousePointerClick,
        title: "Simple Experience",
        text: "A lightweight, easy-to-use interface built for quick planning.",
    },
];

const steps = [
    "Enter your subject",
    "Add the topics you want to study",
    "Set your exam date",
    "StudyPrep generates a day-by-day plan that fits the time you have",
    "Save your plan and revisit it anytime",
    "Open Flashcards, paste notes or upload a file, and generate a deck",
];

const sample = [
    {
        day: "Day 1",
        focus: "Core Concepts",
        tasks: [
            "Review OSI & TCP/IP stack, mapping protocols",
            "Master IP addressing & subnetting",
            "Simulate routing with OSPF/BGP scenarios",
        ],
    },
    {
        day: "Day 2",
        focus: "Rapid Revision & Rest",
        tasks: [
            "Flashcards on key protocols and security basics",
            "Do a timed practice quiz covering all topics",
            "Short relaxation session, avoid new material",
        ],
    },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
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
      {children}
    </span>
    );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
    return (
        <div style={{ marginBottom: 40 }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
                style={{
                    margin: "14px 0 0",
                    fontSize: 32,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#0f172a",
                }}
            >
                {title}
            </h2>
        </div>
    );
}

function PlanPreview() {
    return (
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    padding: "16px 20px",
                    marginBottom: 16,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <span
              style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
              }}
          >
            <BookOpen size={18} />
          </span>
                    <strong style={{ fontSize: 17, color: "#0f172a" }}>
                        Network Blitz: 2-Day Crash Course
                    </strong>
                </div>
                <span
                    style={{
                        background: "#f1f5f9",
                        color: "#475569",
                        borderRadius: 9999,
                        padding: "4px 12px",
                        fontSize: 12,
                        fontWeight: 500,
                        flexShrink: 0,
                    }}
                >
          2 days
        </span>
            </div>

            <div className="sp-grid-2">
                {sample.map((d) => (
                    <div
                        key={d.day}
                        style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: 16,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "#f8fafc",
                                borderBottom: "1px solid #e2e8f0",
                                padding: "12px 20px",
                            }}
                        >
              <span
                  style={{
                      background: "#dbeafe",
                      color: "#1d4ed8",
                      borderRadius: 9999,
                      padding: "2px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                  }}
              >
                {d.day}
              </span>
                            <span style={{ fontSize: 12, color: "#64748b" }}>{d.tasks.length} tasks</span>
                        </div>
                        <div style={{ padding: 20 }}>
                            <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                                {d.focus}
                            </p>
                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                {d.tasks.map((t) => (
                                    <li
                                        key={t}
                                        style={{
                                            display: "flex",
                                            gap: 10,
                                            alignItems: "flex-start",
                                            fontSize: 14,
                                            color: "#475569",
                                            marginBottom: 10,
                                        }}
                                    >
                    <span
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: "2px solid #cbd5e1",
                            flexShrink: 0,
                            marginTop: 2,
                        }}
                    />
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function FeatureSection() {
    return (
        <div>
            {/* What you get */}
            <div style={{ background: "#fff" }}>
                <div className="sp-section">
                    <div className="sp-container">
                        <SectionHeading eyebrow="Features" title="What you get" />
                        <div className="sp-grid-3">
                            {features.map(({ icon: Icon, title, text }) => (
                                <div
                                    key={title}
                                    style={{
                                        background: "#fff",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: 16,
                                        padding: 24,
                                    }}
                                >
                  <span
                      style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "#eff6ff",
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 16,
                      }}
                  >
                    <Icon size={20} />
                  </span>
                                    <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                                        {title}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#475569" }}>{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product preview */}
            <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
                <div className="sp-section">
                    <div className="sp-container">
                        <SectionHeading eyebrow="Preview" title="See a plan in action" />
                        <PlanPreview />
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div style={{ background: "#fff" }}>
                <div className="sp-section">
                    <div className="sp-container">
                        <SectionHeading eyebrow="Steps" title="How it works" />
                        <div className="sp-grid-3">
                            {steps.map((text, i) => (
                                <div key={text} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span
                      style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#2563eb",
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                      }}
                  >
                    {i + 1}
                  </span>
                                    <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.6, color: "#334155" }}>
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}