import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import { verifyToken, cookieOptions } from "@/lib/auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get(cookieOptions.name || "token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let userId: string;
        try {
            const payload = await verifyToken(token);
            userId = payload.sub as string;
        } catch {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { subject, notes, count } = await req.json();

        if (typeof subject !== "string" || !subject.trim()) {
            return NextResponse.json({ error: "Subject is required" }, { status: 400 });
        }
        if (typeof notes !== "string" || !notes.trim()) {
            return NextResponse.json({ error: "Topics or notes are required" }, { status: 400 });
        }

        const cardCount = Math.min(Math.max(Number(count) || 10, 5), 30);
        const source = notes.trim().slice(0, 8000);
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You create high-quality study flashcards.

RULES:
- Produce EXACTLY ${cardCount} flashcards.
- Each card tests ONE idea. The front is a clear question or prompt; the back is a short, accurate answer (1-3 sentences).
- Base the cards on the material the user provides. Do not invent facts that contradict it.
- Mix recall, definitions, "why/how" questions, and small examples. No duplicates.

Respond with ONLY a JSON object in this exact shape:
{
  "title": "Short deck title",
  "cards": [ { "front": "Question", "back": "Answer" } ]
}`,
                },
                {
                    role: "user",
                    content: `Subject: ${subject.trim()}\n\nMaterial:\n${source}`,
                },
            ],
        });

        const parsed = JSON.parse(completion.choices[0].message.content || "{}");

        const cards = (Array.isArray(parsed.cards) ? parsed.cards : [])
            .filter((c: any) => typeof c?.front === "string" && typeof c?.back === "string")
            .slice(0, cardCount);

        if (cards.length === 0) {
            return NextResponse.json({ error: "Model returned no valid cards" }, { status: 502 });
        }
        const deck = await prisma.flashcardDeck.create({
            data: {
                userId,
                subject: subject.trim(),
                title: typeof parsed.title === "string" && parsed.title ? parsed.title : `${subject.trim()} flashcards`,
                cards,
            },
        });

        return NextResponse.json({ deck });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }
}