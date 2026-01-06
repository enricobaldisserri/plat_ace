"use client";

import { useEffect, useState } from "react";
import { Plus, UserCog, Trash2, Edit } from "lucide-react";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { UtenteModal } from "./UtenteModal";

type Utente = {
    matricola: string;
    nome: string | null;
    cognome: string | null;
    email: string | null;
    flag_robot: boolean | null;
    uo: string | null;
    flag_attivo: boolean | null;
};

export function UtenteManager() {
    const [data, setData] = useState<Utente[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Utente | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/utenti");
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
            await fetch(`/api/utenti/${id}`, { method: "DELETE" });
            fetchData();
        } catch (e) { alert("Errore"); }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <UserCog className="text-indigo-600" /> Gestione Utenti
                    </h1>
                    <p className="text-slate-500">Gestione anagrafica utenti e robot.</p>
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
                                <th className="px-6 py-4">Matricola</th>
                                <th className="px-6 py-4">Nome Cognome</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">UO</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Stato</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Caricamento...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Nessun record trovato.</td></tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.matricola} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-bold text-sm text-indigo-600">{item.matricola}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{item.nome} {item.cognome}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{item.email}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{item.uo}</td>
                                        <td className="px-6 py-4">
                                            {item.flag_robot ? <Badge variant="warning">Robot</Badge> : <Badge variant="default">Utente</Badge>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={item.flag_attivo ? "success" : "warning"}>{item.flag_attivo ? "Attivo" : "Non Attivo"}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button onClick={() => { setEditingItem(item); setModalOpen(true); }} className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(item.matricola)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <UtenteModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={fetchData}
                initialData={editingItem}
            />
        </div>
    );
}
