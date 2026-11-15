import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, cookieOptions } from "@/lib/auth";

async function getUserId(req: NextRequest): Promise<string | null> {
    const token = req.cookies.get(cookieOptions.name || "token")?.value;
    if (!token) return null;
    try {
        const payload = await verifyToken(token);
        return (payload.sub as string) || null;
    } catch {
        return null;
    }
}
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const result = await prisma.flashcardDeck.deleteMany({ where: { id, userId } });
        if (result.count === 0) {
            return NextResponse.json({ error: "Deck not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete deck" }, { status: 500 });
    }
}
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { removeIndex } = await req.json();

        if (!Number.isInteger(removeIndex) || removeIndex < 0) {
            return NextResponse.json({ error: "Invalid card" }, { status: 400 });
        }

        const deck = await prisma.flashcardDeck.findFirst({ where: { id, userId } });
        if (!deck) {
            return NextResponse.json({ error: "Deck not found" }, { status: 404 });
        }

        const cards = Array.isArray(deck.cards) ? (deck.cards as any[]) : [];
        if (removeIndex >= cards.length) {
            return NextResponse.json({ error: "Card not found" }, { status: 404 });
        }

        const remaining = cards.filter((_, i) => i !== removeIndex);
        if (remaining.length === 0) {
            await prisma.flashcardDeck.deleteMany({ where: { id, userId } });
            return NextResponse.json({ deckDeleted: true });
        }

        await prisma.flashcardDeck.update({
            where: { id },
            data: { cards: remaining },
        });

        return NextResponse.json({ cards: remaining });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
    }
}