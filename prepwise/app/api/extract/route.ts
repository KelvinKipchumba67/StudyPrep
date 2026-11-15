import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { verifyToken, cookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get(cookieOptions.name || "token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        try {
            await verifyToken(token);
        } catch {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        const form = await req.formData();
        const file = form.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }
        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: "File is too large (max 4 MB)" }, { status: 413 });
        }

        const name = file.name.toLowerCase();
        const buffer = await file.arrayBuffer();
        let text = "";

        if (name.endsWith(".pdf")) {
            const pdf = await getDocumentProxy(new Uint8Array(buffer));
            const result = await extractText(pdf, { mergePages: true });
            text = result.text;
        } else if (name.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
            text = result.value;
        } else if (name.endsWith(".txt") || name.endsWith(".md")) {
            text = Buffer.from(buffer).toString("utf-8");
        } else {
            return NextResponse.json(
                { error: "Unsupported file type. Use PDF, DOCX, TXT or MD." },
                { status: 415 }
            );
        }

        text = text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

        if (!text) {
            return NextResponse.json(
                { error: "No readable text found. Scanned PDFs and images aren't supported." },
                { status: 422 }
            );
        }

        return NextResponse.json({ text, fileName: file.name });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to read the file" }, { status: 500 });
    }
}