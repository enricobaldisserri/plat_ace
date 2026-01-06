import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/tecnologie
export async function GET() {
    try {
        const data = await db.tecnologiaAutomazioni.findMany({
            orderBy: { tipo_tecnologia: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/tecnologie
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tipo_tecnologia, descrizione, flag_attivo } = body;

        const newItem = await db.tecnologiaAutomazioni.create({
            data: {
                tipo_tecnologia,
                descrizione,
                flag_attivo, // String(10) in DB as per SQL, likely 'true'/'false' or 'S'/'N' or just string
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create tecnologia" }, { status: 500 });
    }
}
