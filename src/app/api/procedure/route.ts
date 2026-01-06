import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/procedure
export async function GET() {
    try {
        const data = await db.procedura.findMany({
            orderBy: { id_procedura: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/procedure
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id_procedura, descrizione } = body;

        const newItem = await db.procedura.create({
            data: {
                id_procedura,
                descrizione,
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create procedura" }, { status: 500 });
    }
}
