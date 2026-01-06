import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { nome, flag_attivo } = body;

        const updatedItem = await db.istituto.update({
            where: { istituto: Number(id) },
            data: {
                nome,
                flag_attivo: flag_attivo !== undefined ? Boolean(flag_attivo) : undefined,
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update istituto" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.istituto.delete({
            where: { istituto: Number(id) },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete istituto" }, { status: 500 });
    }
}
