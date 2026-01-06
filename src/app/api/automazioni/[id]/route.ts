import { NextResponse } from "next/server";
import { db } from "~/server/db";

// PUT /api/automazioni/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15
) {
    try {
        const { id } = await params;
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

        const updatedItem = await db.$transaction(async (tx) => {
            // 1. Update Automazione basic fields
            const auto = await tx.automazione.update({
                where: { codice_automazione: id },
                data: {
                    nome_automazione,
                    stato,
                    codice_iniziativa,
                    rif_po_matricola,
                    rif_dev_matricola,
                    uo,
                    // data_modifica if exists? schema doesn't have it.
                }
            });

            // 2. Update Technologies (Delete all + Re-create)
            // Note: This is a simple approach. Optimizations possible.
            await tx.automazione_tecnologia.deleteMany({
                where: { codice_automazione: id }
            });

            if (tecnologie && Array.isArray(tecnologie)) {
                for (const tech of tecnologie) {
                    await tx.automazione_tecnologia.create({
                        data: {
                            codice_automazione: id,
                            tipo_tecnologia: tech.tipo_tecnologia,
                            principale: tech.principale || false
                        }
                    });
                }
            }

            // 3. Update Procedures (Delete all + Re-create)
            await tx.procedura_automazione.deleteMany({
                where: { codice_automazione: id }
            });

            if (procedure && Array.isArray(procedure)) {
                for (const proc of procedure) {
                    await tx.procedura_automazione.create({
                        data: {
                            codice_automazione: id,
                            id_procedura: proc.id_procedura
                        }
                    });
                }
            }

            return auto;
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error("Error updating automazione:", error);
        return NextResponse.json({ error: "Failed to update automazione" }, { status: 500 });
    }
}

// DELETE /api/automazioni/[id]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await db.$transaction(async (tx) => {
            // Delete relations first due to FK constraints (although onDelete: NoAction is set in schema, so we MUST delete manually)
            await tx.automazione_tecnologia.deleteMany({
                where: { codice_automazione: id }
            });
            await tx.procedura_automazione.deleteMany({
                where: { codice_automazione: id }
            });

            // Delete main record
            await tx.automazione.delete({
                where: { codice_automazione: id }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting automazione:", error);
        return NextResponse.json({ error: "Failed to delete automazione" }, { status: 500 });
    }
}
