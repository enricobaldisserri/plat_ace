import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/utenti
export async function GET() {
    try {
        const data = await db.utente.findMany({
            where: { flag_attivo: true },
            orderBy: { cognome: "asc" },
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

        // Basic validation
        if (!matricola) {
            return NextResponse.json({ error: "Matricola is required" }, { status: 400 });
        }

        const newItem = await db.utente.create({
            data: {
                matricola,
                nome,
                cognome,
                email,
                flag_robot: flag_robot !== undefined ? Boolean(flag_robot) : false,
                uo,
                flag_attivo: flag_attivo !== undefined ? Boolean(flag_attivo) : true,
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Utente already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create utente" }, { status: 500 });
    }
}
