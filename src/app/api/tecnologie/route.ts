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

        if (!tipo_tecnologia) {
            return NextResponse.json({ error: "Tipo Tecnologia is required" }, { status: 400 });
        }

        const newItem = await db.tecnologiaAutomazioni.create({
            data: {
                tipo_tecnologia,
                descrizione,
                flag_attivo: flag_attivo // Should be passed as "S" or "N" from frontend
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Tecnologia already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create tecnologia" }, { status: 500 });
    }
}
