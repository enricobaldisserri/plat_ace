import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/gigapr
export async function GET() {
    try {
        const data = await db.gigapr.findMany({
            orderBy: { codice_applicazione: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching gigapr:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/gigapr
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { codice_applicazione, uff_appl_responsabile, utente_responsabile } = body;

        const newItem = await db.gigapr.create({
            data: {
                codice_applicazione,
                uff_appl_responsabile,
                utente_responsabile,
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error("Error creating gigapr:", error);
        return NextResponse.json({ error: "Failed to create gigapr" }, { status: 500 });
    }
}
