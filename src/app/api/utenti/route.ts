import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/utenti
export async function GET() {
    try {
        const data = await db.utente.findMany({
            orderBy: { matricola: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/utenti
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { matricola, nome, cognome, email, flag_robot, uo, flag_attivo } = body;

        const newItem = await db.utente.create({
            data: {
                matricola,
                nome,
                cognome,
                email,
                flag_robot: Boolean(flag_robot),
                uo,
                flag_attivo: Boolean(flag_attivo),
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create utente" }, { status: 500 });
    }
}
