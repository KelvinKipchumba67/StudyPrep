import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, cookieOptions } from "@/lib/auth";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = req.cookies.get(cookieOptions.name || "token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let userId: string;
        try {
            const payload = await verifyToken(token);
            userId = payload.sub as string;
        } catch {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
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