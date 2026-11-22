import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO = process.env.CONTACT_TO_EMAIL || "devkelvin95@gmail.com";

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
    try {
        const { name, email, message, website } = await req.json();
        
        if (website) return NextResponse.json({ success: true });

        if (typeof name !== "string" || !name.trim() || name.length > 100) {
            return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
        }
        if (
            typeof email !== "string" ||
            email.length > 200 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
        }
        if (typeof message !== "string" || message.trim().length < 5 || message.length > 3000) {
            return NextResponse.json(
                { error: "Message must be between 5 and 3000 characters." },
                { status: 400 }
            );
        }

        const cleanName = name.trim().replace(/[\r\n]+/g, " ");
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = message.trim();
        let saved = false;
        try {
            const since = new Date(Date.now() - 60 * 60 * 1000);
            const recent = await prisma.contactMessage.count({
                where: { email: cleanEmail, createdAt: { gte: since } },
            });
            if (recent >= 5) {
                return NextResponse.json(
                    { error: "Too many messages. Please try again later." },
                    { status: 429 }
                );
            }

            await prisma.contactMessage.create({
                data: { name: cleanName, email: cleanEmail, message: cleanMessage },
            });
            saved = true;
        } catch (err) {
            console.error("Saving contact message failed:", err);
        }

        let emailed = false;
        if (resend) {
            try {
                const { error } = await resend.emails.send({
                    from: "StudyPrep Support <onboarding@resend.dev>",
                    to: TO,
                    replyTo: cleanEmail,
                    subject: `New message from ${cleanName}`,
                    html: `
            <h2>New Support Message</h2>
            <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap">${escapeHtml(cleanMessage)}</p>
          `,
                });
                if (error) console.error("Resend error:", error);
                else emailed = true;
            } catch (err) {
                console.error("Email notification failed:", err);
            }
        }

        if (!saved && !emailed) {
            return NextResponse.json({ error: "Failed to send your message." }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to send your message." }, { status: 500 });
    }
}