import { NextResponse } from "next/server";
import { db } from "~/server/db";

// PUT /api/iniziative/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { nome_inziativa, stato, codice_applicazione, rif_gigapr, matrice_rischio, flag_attivo, data_creazione } = body;

        const updatedItem = await db.iniziativa.update({
            where: { codice_iniziativa: id },
            data: {
                nome_inziativa,
                stato,
                codice_applicazione,
                rif_gigapr,
                matrice_rischio,
                flag_attivo: flag_attivo !== undefined ? Boolean(flag_attivo) : undefined,
                // data_creazione is usually stable, but if editable:
                data_creazione: data_creazione ? new Date(data_creazione) : undefined,
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update iniziativa" }, { status: 500 });
    }
}

// DELETE /api/iniziative/[id]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.iniziativa.delete({
            where: { codice_iniziativa: id },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete iniziativa" }, { status: 500 });
    }
}
