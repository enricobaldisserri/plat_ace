import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { descrizione, flag_attivo } = body;

        const updatedItem = await db.tecnologiaAutomazioni.update({
            where: { tipo_tecnologia: id },
            data: {
                descrizione,
                flag_attivo,
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update tecnologia" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.tecnologiaAutomazioni.delete({
            where: { tipo_tecnologia: id },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete tecnologia" }, { status: 500 });
    }
}
