import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/servizi
export async function GET() {
    try {
        const data = await db.servizio.findMany({
            orderBy: { servizio: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/servizi
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { servizio, descrizione, istituto, flag_attivo } = body;

        const newItem = await db.servizio.create({
            data: {
                servizio,
                descrizione,
                istituto: istituto ? Number(istituto) : null,
                flag_attivo: Boolean(flag_attivo),
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create servizio" }, { status: 500 });
    }
}
