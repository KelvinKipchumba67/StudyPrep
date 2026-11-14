import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const TZ = "Africa/Nairobi";
const MAX_DAYS = 30;
function toDateStr(d: Date, tz = TZ) {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d);
}

function daysBetween(fromStr: string, toStr: string) {
    const a = new Date(fromStr + "T00:00:00Z").getTime();
    const b = new Date(toStr + "T00:00:00Z").getTime();
    return Math.round((b - a) / 86_400_000);
}

function addDays(dateStr: string, n: number) {
    const d = new Date(dateStr + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().split("T")[0];
}

export async function POST(req: Request) {
    try {
        const { subject, topics, examDate } = await req.json();

        if (
            typeof subject !== "string" || !subject.trim() ||
            typeof topics !== "string" || !topics.trim() ||
            typeof examDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(examDate)
        ) {
            return Response.json(
                { error: "Subject, topics and a valid exam date are required" },
                { status: 400 }
            );
        }

        const today = toDateStr(new Date());
        const daysUntilExam = daysBetween(today, examDate);

        if (Number.isNaN(daysUntilExam) || daysUntilExam < 0) {
            return Response.json(
                { error: "Exam date must be today or in the future" },
                { status: 400 }
            );
        }
        const totalDays = Math.min(Math.max(daysUntilExam, 1), MAX_DAYS);

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are an expert academic tutor creating a realistic study plan.

Today's date is ${today}. The exam date is ${examDate}, which is ${daysUntilExam} day(s) away.

HARD RULES:
- The "days" array MUST contain EXACTLY ${totalDays} entries, labelled "Day 1" through "Day ${totalDays}". Never more, never fewer.
- Day 1 is ${today}. The last day is the final day before the exam${
                        daysUntilExam === 0
                            ? " (the exam is today, so make this a short, high-yield revision session)"
                            : ""
                    }.
- Prioritise the highest-yield topics when time is short. If there are more topics than days, group or trim them. Do not pad.
- Make the last day light revision and rest, not new material.
- Each day has 2 to 4 concise tasks.

Respond with ONLY a JSON object in this exact shape:
{
  "title": "Catchy Plan Title",
  "days": [
    { "day": "Day 1", "focus": "Main topic", "tasks": ["Task 1", "Task 2"] }
  ]
}`,
                },
                {
                    role: "user",
                    content: `Subject: ${subject.trim()}\nTopics: ${topics.trim()}\nExam date: ${examDate}`,
                },
            ],
        });

        const generatedPlan = JSON.parse(
            completion.choices[0].message.content || "{}"
        );

        if (!Array.isArray(generatedPlan.days)) {
            return Response.json({ error: "Model returned an invalid plan" }, { status: 502 });
        }
        generatedPlan.days = generatedPlan.days
            .slice(0, totalDays)
            .map((d: any, i: number) => ({
                ...d,
                day: `Day ${i + 1}`,
                date: addDays(today, i),
            }));

        return Response.json({ subplan: generatedPlan });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to generate plan" }, { status: 500 });
    }
}