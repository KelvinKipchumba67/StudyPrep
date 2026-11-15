import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken, cookieOptions } from "@/lib/auth";
import FlashcardsView from "@/app/components/FlashcardsView";
import AppShell from "@/app/components/AppShell";

export default async function FlashcardsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieOptions.name || "token")?.value;
    if (!token) redirect("/auth");

    let userId: string;
    try {
        const payload = await verifyToken(token);
        userId = payload.sub as string;
    } catch {
        redirect("/auth");
    }

    const decks = await prisma.flashcardDeck.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    const initialDecks = decks.map((d) => ({
        id: d.id,
        title: d.title,
        subject: d.subject,
        cards: d.cards as { front: string; back: string }[],
        createdAt: d.createdAt.toISOString(),
    }));

    return <FlashcardsView initialDecks={initialDecks} />;
}