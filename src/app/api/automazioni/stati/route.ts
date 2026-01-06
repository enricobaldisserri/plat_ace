import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/automazioni/stati
export async function GET() {
    try {
        const data = await db.automazioneStato.findMany({
            orderBy: { ordine: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/automazioni/stati
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { stato, descrizione, ordine, in_produzione } = body;

        if (!stato) {
            return NextResponse.json({ error: "Stato is required" }, { status: 400 });
        }

        const newItem = await db.automazioneStato.create({
            data: {
                stato,
                descrizione,
                ordine: ordine ? parseInt(ordine) : undefined,
                in_produzione: in_produzione !== undefined ? Boolean(in_produzione) : undefined
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Stato already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create stato" }, { status: 500 });
    }
}
