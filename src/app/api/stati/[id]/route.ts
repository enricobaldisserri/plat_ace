import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { descrizione, ordine, in_produzione } = body;

        const updatedStato = await db.automazioneStato.update({
            where: { stato: id },
            data: {
                descrizione: typeof descrizione === 'string' ? descrizione : undefined,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                ordine: typeof ordine === 'number' ? ordine : (ordine ? parseInt(ordine) : undefined),
                in_produzione: typeof in_produzione === 'boolean' ? in_produzione : undefined,
            },
        });
        return NextResponse.json(updatedStato);
    } catch (error) {
        console.error("Error updating stato:", error);
        return NextResponse.json({ error: "Failed to update stato" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.automazioneStato.delete({
            where: { stato: id },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting stato:", error);
        return NextResponse.json({ error: "Failed to delete stato" }, { status: 500 });
    }
}
