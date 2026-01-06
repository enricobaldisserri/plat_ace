import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { descrizione, istituto, flag_attivo } = body;

        const updatedItem = await db.servizio.update({
            where: { servizio: id },
            data: {
                descrizione,
                istituto: istituto ? Number(istituto) : undefined,
                flag_attivo: flag_attivo !== undefined ? Boolean(flag_attivo) : undefined,
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update servizio" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.servizio.delete({
            where: { servizio: id },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete servizio" }, { status: 500 });
    }
}
