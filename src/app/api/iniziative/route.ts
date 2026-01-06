import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/iniziative
export async function GET() {
    try {
        const data = await db.iniziativa.findMany({
            orderBy: { codice_iniziativa: "asc" },
            include: {
                automazione_stato: true,
                gigapr_iniziativa_codice_applicazioneTogigapr: true,
                gigapr_iniziativa_rif_gigaprTogigapr: true,
            }
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/iniziative
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { codice_iniziativa, nome_inziativa, stato, codice_applicazione, rif_gigapr, matrice_rischio, flag_attivo } = body;

        if (!codice_iniziativa) {
            return NextResponse.json({ error: "Codice Iniziativa is required" }, { status: 400 });
        }

        const newItem = await db.iniziativa.create({
            data: {
                codice_iniziativa,
                nome_inziativa,
                stato,
                codice_applicazione,
                rif_gigapr,
                matrice_rischio,
                flag_attivo: flag_attivo !== undefined ? Boolean(flag_attivo) : true,
                data_creazione: new Date(),
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Iniziativa already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create iniziativa: " + error.message }, { status: 500 });
    }
}
