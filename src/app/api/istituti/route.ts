import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/istituti
export async function GET() {
    try {
        const data = await db.istituto.findMany({
            orderBy: { istituto: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/istituti
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { istituto, nome, flag_attivo } = body;

        const newItem = await db.istituto.create({
            data: {
                istituto: Number(istituto),
                nome,
                flag_attivo: Boolean(flag_attivo),
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create istituto" }, { status: 500 });
    }
}
