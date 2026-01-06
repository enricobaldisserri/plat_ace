import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { servizio, descrizione, flag_attivo } = body;

        const updatedItem = await db.ufficio.update({
            where: { uo: id },
            data: {
                servizio,
                descrizione,
                flag_attivo: flag_attivo !== undefined ? Boolean(flag_attivo) : undefined,
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update ufficio" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.ufficio.delete({
            where: { uo: id },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete ufficio" }, { status: 500 });
    }
}
