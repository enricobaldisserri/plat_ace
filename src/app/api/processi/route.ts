import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/processi
export async function GET() {
    try {
        const data = await db.alberoDeiProcessi.findMany({
            orderBy: { cod_fase_processo: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/processi
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cod_fase_processo } = body;

        const newItem = await db.alberoDeiProcessi.create({
            data: {
                cod_fase_processo,
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create processo" }, { status: 500 });
    }
}
