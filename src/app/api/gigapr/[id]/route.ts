import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { uff_appl_responsabile, utente_responsabile } = body;

        const updatedItem = await db.gigapr.update({
            where: { codice_applicazione: id },
            data: {
                uff_appl_responsabile,
                utente_responsabile,
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update gigapr" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.gigapr.delete({
            where: { codice_applicazione: id },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete gigapr" }, { status: 500 });
    }
}
