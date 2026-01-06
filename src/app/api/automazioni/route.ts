import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/automazioni
export async function GET() {
    try {
        const data = await db.automazione.findMany({
            include: {
                automazione_stato: true,
                ufficio: true,
                utente_automazione_rif_po_matricolaToutente: true, // PO
                utente_automazione_rif_dev_matricolaToutente: true, // DEV
                automazione_tecnologia: {
                    include: {
                        tecnologia_automazioni: true,
                    }
                },
                procedura_automazione: {
                    include: {
                        procedura: true
                    }
                }
            },
            orderBy: { codice_automazione: "asc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching automazioni:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/automazioni
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            nome_automazione,
            stato,
            codice_iniziativa,
            rif_po_matricola,
            rif_dev_matricola,
            uo,
            tecnologie, // Array of { tipo_tecnologia, principale }
            procedure   // Array of { id_procedura }
        } = body;

        // Auto-generate codice_automazione (AUT-XXX)
        // 1. Find last code
        const lastAuto = await db.automazione.findFirst({
            orderBy: { codice_automazione: 'desc' },
            select: { codice_automazione: true }
        });

        let newCode = 'AUT-001';
        if (lastAuto?.codice_automazione) {
            const numericPart = parseInt(lastAuto.codice_automazione.replace('AUT-', ''));
            if (!isNaN(numericPart)) {
                newCode = `AUT-${String(numericPart + 1).padStart(3, '0')}`;
            }
        }

        // Transaction to create automation and relations
        const newItem = await db.$transaction(async (tx) => {
            // 1. Create Automazione
            const auto = await tx.automazione.create({
                data: {
                    codice_automazione: newCode,
                    nome_automazione,
                    stato,
                    codice_iniziativa,
                    rif_po_matricola,
                    rif_dev_matricola,
                    uo,
                    data_creazione: new Date(),
                    flag_attivo: true
                }
            });

            // 2. Add Technologies
            if (tecnologie && Array.isArray(tecnologie)) {
                for (const tech of tecnologie) {
                    await tx.automazione_tecnologia.create({
                        data: {
                            codice_automazione: newCode,
                            tipo_tecnologia: tech.tipo_tecnologia,
                            principale: tech.principale || false
                        }
                    });
                }
            }

            // 3. Add Procedures
            if (procedure && Array.isArray(procedure)) {
                for (const proc of procedure) {
                    await tx.procedura_automazione.create({
                        data: {
                            codice_automazione: newCode,
                            id_procedura: proc.id_procedura
                        }
                    });
                }
            }

            return auto;
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error("Error creating automazione:", error);
        return NextResponse.json({ error: "Failed to create automazione" }, { status: 500 });
    }
}
