import { NextResponse } from "next/server";
import { db } from "~/server/db";

// Note: AlberoDeiProcessi has only PK, no updatable fields usually, but assuming we might rename ID or add fields later.
// For now, PUT is only valid if we migrate ID, which Prisma doesn't support easily in update.
// We will just return 400 for PUT or implement if strictly needed.
// However, to keep pattern consistent, we'll allow update if there were other fields.
// Since there are NO other fields, PUT is effectively a no-op or error. 
// We will implement DELETE only for full correctness, and maybe a dummy PUT.

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // URL decoding might be needed for slash-containing IDs
        const decodedId = decodeURIComponent(id);

        await db.alberoDeiProcessi.delete({
            where: { cod_fase_processo: decodedId },
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete processo" }, { status: 500 });
    }
}
