"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, AlertCircle } from "lucide-react";
import { IniziativaModal } from "./IniziativaModal";

export function IniziativaManager() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/iniziative");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Failed to fetch iniziative", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Sei sicuro di voler eliminare questa iniziativa?")) return;

        try {
            const res = await fetch(`/api/iniziative/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
            } else {
                alert("Errore durante l'eliminazione");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const filteredData = data.filter(item =>
        item.nome_inziativa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codice_iniziativa?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                        Iniziative
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Gestisci le iniziative aziendali.</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                >
                    <Plus size={18} />
                    <span>Nuova Iniziativa</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cerca per nome o codice..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Codice</th>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Stato</th>
                                <th className="px-6 py-4">Data Creazione</th>
                                <th className="px-6 py-4">Rischio</th>
                                <th className="px-6 py-4">Cod. App</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-500">Caricamento...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-500">Nessun record trovato.</td></tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.codice_iniziativa} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs">{item.codice_iniziativa}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{item.nome_inziativa || "-"}</td>
                                        <td className="px-6 py-4">
                                            {item.automazione_stato?.descrizione ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {item.automazione_stato.descrizione}
                                                </span>
                                            ) : <span className="text-slate-400">-</span>}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {item.data_creazione ? new Date(item.data_creazione).toLocaleDateString("it-IT") : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.matrice_rischio ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${item.matrice_rischio.includes('ALTO') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                        item.matrice_rischio === 'MEDIO' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                    {item.matrice_rischio}
                                                </span>
                                            ) : "-"}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.codice_applicazione || "-"}</td>
                                        <td className="px-6 py-4">
                                            {item.flag_attivo ? (
                                                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>Attivo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-slate-400 text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></span>Inattivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                                                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                    title="Modifica"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.codice_iniziativa)}
                                                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    title="Elimina"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <IniziativaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchData}
                initialData={editingItem}
            />
        </div>
    );
}
