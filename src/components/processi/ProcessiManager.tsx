"use client";

import { useEffect, useState } from "react";
import { Plus, Share2, Trash2, Eye } from "lucide-react";
import { Card } from "~/components/ui/Card";
import { ProcessiModal } from "./ProcessiModal";

type Processo = {
    cod_fase_processo: string;
};

export function ProcessiManager() {
    const [data, setData] = useState<Processo[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Processo | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/processi");
            if (res.ok) setData(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Sei sicuro di voler eliminare questo record?")) return;
        try {
            await fetch(`/api/processi/${encodeURIComponent(id)}`, { method: "DELETE" });
            fetchData();
        } catch (e) { alert("Errore"); }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Share2 className="text-indigo-600" /> Albero dei Processi
                    </h1>
                    <p className="text-slate-500">Mappatura fasi dei processi.</p>
                </div>
                <button onClick={() => { setEditingItem(null); setModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2">
                    <Plus size={18} /> Nuovo Record
                </button>
            </header>

            <Card className="overflow-hidden border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-400 text-xs uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Codice Fase Processo</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={2} className="p-8 text-center text-slate-500">Caricamento...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={2} className="p-8 text-center text-slate-500">Nessun record trovato.</td></tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.cod_fase_processo} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-bold text-sm text-indigo-600">{item.cod_fase_processo}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {/* View only for detail since only PK exists */}
                                            <button onClick={() => { setEditingItem(item); setModalOpen(true); }} className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Eye size={16} /></button>
                                            <button onClick={() => handleDelete(item.cod_fase_processo)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <ProcessiModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={fetchData}
                initialData={editingItem}
            />
        </div>
    );
}
