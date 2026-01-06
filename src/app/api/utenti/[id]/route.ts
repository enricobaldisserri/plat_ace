import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { nome, cognome, email, flag_robot, uo, flag_attivo } = body;

        const updatedItem = await db.utente.update({
            where: { matricola: id },
            data: {
                nome,
                cognome,
                email,
                flag_robot: flag_robot !== undefined ? Boolean(flag_robot) : undefined,
                uo,
                flag_attivo: flag_attivo !== undefined ? Boolean(flag_attivo) : undefined,
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update utente" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.utente.delete({
            where: { matricola: id },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete utente" }, { status: 500 });
    }
}
