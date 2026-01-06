import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { descrizione } = body;

        const updatedItem = await db.procedura.update({
            where: { id_procedura: id },
            data: {
                descrizione,
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update procedura" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.procedura.delete({
            where: { id_procedura: id },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete procedura" }, { status: 500 });
    }
}
