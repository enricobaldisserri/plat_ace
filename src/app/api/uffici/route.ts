import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/uffici
export async function GET() {
    try {
        const data = await db.ufficio.findMany({
            where: { flag_attivo: true },
            orderBy: { descrizione: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
