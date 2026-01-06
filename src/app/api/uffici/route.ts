import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/uffici
export async function GET() {
    try {
        const data = await db.ufficio.findMany({
            orderBy: { uo: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/uffici
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { uo, servizio, descrizione, flag_attivo } = body;

        const newItem = await db.ufficio.create({
            data: {
                uo,
                servizio,
                descrizione,
                flag_attivo: Boolean(flag_attivo),
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create ufficio" }, { status: 500 });
    }
}
