"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MoreHorizontal, Settings, Trash2, Edit } from "lucide-react";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { StatiModal } from "./StatiModal";

type AutomazioneStato = {
    stato: string;
    descrizione: string | null;
    ordine: number | null;
    in_produzione: boolean | null;
};

export function StatiManager() {
    const [stati, setStati] = useState<AutomazioneStato[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStato, setEditingStato] = useState<AutomazioneStato | null>(null);

    const fetchStati = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/stati");
            if (res.ok) {
                const data = await res.json();
                setStati(data);
            }
        } catch (error) {
            console.error("Failed to fetch stati", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStati();
    }, []);

    const handleDelete = async (statoId: string) => {
        if (!confirm("Sei sicuro di voler eliminare questo stato?")) return;
        try {
            const res = await fetch(`/api/stati/${statoId}`, { method: "DELETE" });
            if (res.ok) {
                fetchStati();
            } else {
                alert("Errore durante l'eliminazione");
            }
        } catch (error) {
            alert("Errore durante l'eliminazione");
        }
    };

    const openNew = () => {
        setEditingStato(null);
        setModalOpen(true);
    };

    const openEdit = (s: AutomazioneStato) => {
        setEditingStato(s);
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Settings className="text-indigo-600" /> Gestione Stati
                    </h1>
                    <p className="text-slate-500">Configurazione degli stati per le automazioni.</p>
                </div>
                <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2">
                    <Plus size={18} /> Nuovo Stato
                </button>
            </header>

            <Card className="overflow-hidden border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-400 text-xs uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Codice Stato</th>
                                <th className="px-6 py-4">Descrizione</th>
                                <th className="px-6 py-4 text-center">Ordine</th>
                                <th className="px-6 py-4 text-center">In Prod.</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Caricamento...</td></tr>
                            ) : stati.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nessuno stato trovato.</td></tr>
                            ) : (
                                stati.map((s) => (
                                    <tr key={s.stato} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-bold text-sm text-indigo-600">
                                            {s.stato}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {s.descrizione}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block w-6 h-6 rounded bg-slate-100 text-slate-600 text-xs font-bold leading-6">
                                                {s.ordine ?? '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={s.in_produzione ? "success" : "default"}>
                                                {s.in_produzione ? "Sì" : "No"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button onClick={() => openEdit(s)} className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(s.stato)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <StatiModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={fetchStati}
                initialData={editingStato}
            />
        </div>
    );
}
