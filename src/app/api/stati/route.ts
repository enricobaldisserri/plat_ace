import { NextResponse } from "next/server";
import { db } from "~/server/db";

// GET /api/stati
export async function GET() {
  try {
    const stati = await db.automazioneStato.findMany({
      orderBy: { ordine: "asc" },
    });
    return NextResponse.json(stati);
  } catch (error) {
    console.error("Error fetching stati:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/stati
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { stato, descrizione, ordine, in_produzione } = body;

    // Validation
    if (!stato || typeof stato !== 'string') {
        return NextResponse.json({ error: "Stato is required and must be a string" }, { status: 400 });
    }

    const newStato = await db.automazioneStato.create({
      data: {
        stato,
        descrizione: typeof descrizione === 'string' ? descrizione : null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ordine: typeof ordine === 'number' ? ordine : (ordine ? parseInt(ordine) : null),
        in_produzione: typeof in_produzione === 'boolean' ? in_produzione : null,
      },
    });
    return NextResponse.json(newStato, { status: 201 });
  } catch (error) {
    console.error("Error creating stato:", error);
    return NextResponse.json({ error: "Failed to create stato" }, { status: 500 });
  }
}
