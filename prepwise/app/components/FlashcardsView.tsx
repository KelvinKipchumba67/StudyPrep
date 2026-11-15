"use client";
import { useEffect, useState } from "react";
import { SquareStack, LayoutGrid, Sparkles, ChevronDown, Search, Trash2 } from "lucide-react";
import MobileNav from "@/app/components/MobileNav";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import AppShell from "@/app/components/AppShell";
import { useRouter } from "next/navigation";

type Card = { front: string; back: string };
export type Deck = {
    id: string;
    title: string;
    subject: string;
    cards: Card[];
    createdAt: string;
};

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 focus:bg-white";

function FlipCard({
                      card,
                      index,
                      onDelete,
                  }: {
    card: Card;
    index: number;
    onDelete: () => void;
}) {
    const [flipped, setFlipped] = useState(false);
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-blue-300">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/70 px-5 py-3">
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    Card {index + 1}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                        {flipped ? "Answer" : "Question"}
                    </span>
                    <button
                        type="button"
                        onClick={onDelete}
                        aria-label="Delete card"
                        style={{ padding: 4 }}
                        className="rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <button
                type="button"
                onClick={() => setFlipped((f) => !f)}
                className="min-h-[96px] p-5 text-left"
            >
                <p
                    className={`break-words text-sm ${
                        flipped ? "text-slate-600" : "font-semibold text-slate-900"
                    }`}
                >
                    {flipped ? card.back : card.front}
                </p>
                <span className="mt-3 block text-xs text-slate-400">Tap to flip</span>
            </button>
        </div>
    );
}

function DeckSection({
                         deck,
                         cards,
                         defaultOpen,
                         searching,
                         onDelete,
                         onDeleteCard,
                     }: {
    deck: Deck;
    cards: { card: Card; index: number }[];
    defaultOpen: boolean;
    searching: boolean;
    onDelete: () => void;
    onDeleteCard: (index: number) => void;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const isOpen = open || searching;

    return (
        <div className="min-w-0 space-y-4">
            <div
                className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white"
                style={{ paddingRight: 20 }}
            >
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="flex min-w-0 flex-1 items-center justify-between gap-3 px-5 py-4 text-left"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <SquareStack size={18} />
                        </div>
                        <h3 className="truncate text-lg font-bold text-slate-900">{deck.title}</h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {cards.length} {cards.length === 1 ? "card" : "cards"}
                        </span>
                        <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>
                </button>

                <button
                    type="button"
                    onClick={onDelete}
                    aria-label="Delete deck"
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {isOpen && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {cards.map(({ card, index }) => (
                        <FlipCard
                            key={index}
                            card={card}
                            index={index}
                            onDelete={() => onDeleteCard(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function FlashcardForm({ onCreated }: { onCreated: (deck: Deck) => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const fd = new FormData(e.currentTarget);
        try {
            const res = await fetch("/api/flashcards", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: fd.get("subject"),
                    notes: fd.get("notes"),
                    count: Number(fd.get("count")),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            onCreated(data.deck);
        } catch (err: any) {
            setError(err.message || "Failed to generate flashcards.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3.5">
                <Sparkles size={16} className="text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-900">New Flashcard Deck</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                    <input
                        name="subject"
                        required
                        placeholder="e.g., Data Structures"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Topics or notes
                    </label>
                    <textarea
                        name="notes"
                        rows={4}
                        required
                        placeholder="Paste your notes, or list topics: Trees, Graphs, Big-O..."
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Number of cards
                    </label>
                    <input
                        type="number"
                        name="count"
                        min={5}
                        max={30}
                        defaultValue={10}
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
                >
                    {loading ? "Generating..." : "Generate Flashcards"}
                </button>

                {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                )}
            </form>
        </div>
    );
}

export default function FlashcardsView({ initialDecks }: { initialDecks: Deck[] }) {
    const [decks, setDecks] = useState<Deck[]>(initialDecks);
    const [today, setToday] = useState("");
    const [query, setQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);
    const [deleting, setDeleting] = useState(false);

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

    useEffect(() => {
        setToday(
            new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            })
        );
    }, []);
    const subjects: string[] = [];
    decks.forEach((d) => {
        const s = d.subject.trim();
        if (s && !subjects.some((x) => x.toLowerCase() === s.toLowerCase())) subjects.push(s);
    });

    const subjectCount = subjects.length;

    const confirmDeleteDeck = async () => {
        if (!deckToDelete) return;
        setDeleting(true);

        try {
            const res = await fetch(`/api/flashcards/${deckToDelete.id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error();

            const remaining = decks.filter((d) => d.id !== deckToDelete.id);
            setDecks(remaining);
            setDeckToDelete(null);
            if (
                selectedSubject !== "All" &&
                !remaining.some((d) => d.subject.trim().toLowerCase() === selectedSubject.toLowerCase())
            ) {
                setSelectedSubject("All");
            }
        } catch {
            alert("Couldn't delete the deck. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCard = async (deckId: string, index: number) => {
        try {
            const res = await fetch(`/api/flashcards/${deckId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ removeIndex: index }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (data.deckDeleted) {
                setDecks((prev) => prev.filter((d) => d.id !== deckId));
            } else {
                setDecks((prev) =>
                    prev.map((d) => (d.id === deckId ? { ...d, cards: data.cards } : d))
                );
            }
        } catch {
            alert("Couldn't delete the card. Please try again.");
        }
    };

    const q = query.trim().toLowerCase();
    const visibleDecks = decks
        .filter(
            (d) =>
                selectedSubject === "All" ||
                d.subject.trim().toLowerCase() === selectedSubject.toLowerCase()
        )
        .map((d) => {
            const deckMatches = `${d.title} ${d.subject}`.toLowerCase().includes(q);
            const cards = d.cards
                .map((card, index) => ({ card, index }))
                .filter(
                    ({ card }) =>
                        deckMatches || `${card.front} ${card.back}`.toLowerCase().includes(q)
                );
            return { deck: d, cards };
        })
        .filter((x) => x.cards.length > 0);

    return (
        <AppShell
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
        >
            <div className="min-h-screen bg-[#F8F9FA] p-8" style={{ paddingBottom: 100 }}>
                {/* Search */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                        <Search size={15} className="text-slate-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search your flashcards"
                            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mobile-logout rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        style={{ flexShrink: 0 }}
                    >
                        Log out
                    </button>
                </div>

                {/* Header */}
                <header>
                    <p className="min-h-[20px] text-sm text-slate-500">{today}</p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Flashcards</h1>
                    <p className="mt-1 text-slate-600">
                        Paste your notes and let Prep turn them into flashcards.
                    </p>
                </header>

                {/* Stats pill */}
                <div className="mt-6 inline-flex items-center gap-5 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                        <SquareStack size={15} className="text-slate-500" />
                        <b className="text-slate-900">{decks.length}</b> Decks generated
                    </span>
                    <span className="flex items-center gap-2">
                        <LayoutGrid size={15} className="text-slate-500" />
                        <b className="text-slate-900">{subjectCount}</b> Subjects
                    </span>
                </div>

                {/* Two columns */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <FlashcardForm onCreated={(deck) => setDecks((prev) => [deck, ...prev])} />
                    </div>

                    <div className="min-w-0 space-y-5 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900">
                                {selectedSubject === "All" ? "All Decks" : selectedSubject}
                            </h2>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {visibleDecks.length} {visibleDecks.length === 1 ? "deck" : "decks"}
                            </span>
                        </div>

                        {decks.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-center">
                                <h3 className="text-lg font-semibold text-slate-900">No decks yet</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Generate your first flashcard deck to see it here.
                                </p>
                            </div>
                        ) : visibleDecks.length === 0 ? (
                            <p className="py-10 text-center text-sm text-slate-500">
                                No decks match your search.
                            </p>
                        ) : (
                            visibleDecks.map(({ deck, cards }, i) => (
                                <DeckSection
                                    key={deck.id}
                                    deck={deck}
                                    cards={cards}
                                    defaultOpen={i === 0}
                                    searching={q !== ""}
                                    onDelete={() => setDeckToDelete(deck)}
                                    onDeleteCard={(index) => handleDeleteCard(deck.id, index)}
                                />
                            ))
                        )}
                    </div>
                </div>

                <ConfirmDialog
                    open={!!deckToDelete}
                    title="Delete flashcard deck"
                    description={`This will permanently delete "${deckToDelete?.title ?? ""}" and all its cards.`}
                    confirmWord="delete"
                    warning="This cannot be undone."
                    loading={deleting}
                    onCancel={() => setDeckToDelete(null)}
                    onConfirm={confirmDeleteDeck}
                />

                <MobileNav />
            </div>
        </AppShell>
    );
}