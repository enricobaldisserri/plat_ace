"use client";

import { useEffect, useState } from "react";
import { Plus, Settings, Trash2, Edit, FileText } from "lucide-react";
import { Card } from "~/components/ui/Card";
import { GigaprModal } from "./GigaprModal";

type Gigapr = {
    codice_applicazione: string;
    uff_appl_responsabile: string | null;
    utente_responsabile: string | null;
};

export function GigaprManager() {
    const [data, setData] = useState<Gigapr[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Gigapr | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/gigapr");
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
            await fetch(`/api/gigapr/${id}`, { method: "DELETE" });
            fetchData();
        } catch (e) { alert("Errore"); }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <FileText className="text-indigo-600" /> Gestione GIGAPR
                    </h1>
                    <p className="text-slate-500">Anagrafica applicazioni GIGAPR.</p>
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
                                <th className="px-6 py-4">Codice App</th>
                                <th className="px-6 py-4">Uff. Resp.</th>
                                <th className="px-6 py-4">Utente Resp.</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Caricamento...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nessun record trovato.</td></tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.codice_applicazione} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-bold text-sm text-indigo-600">{item.codice_applicazione}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{item.uff_appl_responsabile}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{item.utente_responsabile}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button onClick={() => { setEditingItem(item); setModalOpen(true); }} className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(item.codice_applicazione)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <GigaprModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={fetchData}
                initialData={editingItem}
            />
        </div>
    );
}
