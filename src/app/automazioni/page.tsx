"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { AutomazioneModal } from "~/components/automazioni/AutomazioneModal";

// --- Types --- (Should be shared but defining here for speed)
interface Automazione {
    codice_automazione: string;
    nome_automazione: string;
    stato: string;
    automazione_stato?: { descrizione: string; color?: string }; // Approximate
    ufficio?: { descrizione: string };
    utente_automazione_rif_po_matricolaToutente?: { nome: string; cognome: string; matricola: string };
    automazione_tecnologia: { tipo_tecnologia: string; principale: boolean }[];
    // ... other fields
}

export default function AutomazioniPage() {
    const [automazioni, setAutomazioni] = useState<Automazione[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Automazione | null>(null);

    // Lookups state
    const [lookups, setLookups] = useState({
        stati: [],
        iniziative: [],
        utenti: [],
        uffici: [],
        tecnologie: [],
        procedure: []
    });

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/automazioni");
            const data = await res.json();
            setAutomazioni(data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLookups = async () => {
        const [resStati, resIniz, resUtenti, resUff, resTec, resProc] = await Promise.all([
            fetch("/api/automazioni/stati"),
            fetch("/api/iniziative"),
            fetch("/api/utenti"),
            fetch("/api/uffici"),
            fetch("/api/tecnologie"),
            fetch("/api/procedure")
        ]);

        setLookups({
            stati: await resStati.json(),
            iniziative: await resIniz.json(),
            utenti: await resUtenti.json(),
            uffici: await resUff.json(),
            tecnologie: await resTec.json(),
            procedure: await resProc.json(),
        });
    };

    useEffect(() => {
        fetchData();
        fetchLookups();
    }, []);

    // Handlers
    const handleSave = async (formData: any) => {
        try {
            const url = editingItem
                ? `/api/automazioni/${editingItem.codice_automazione}`
                : "/api/automazioni";

            const method = editingItem ? "PUT" : "POST";

            // If PUT, params id is needed, handled by URL
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingItem(null);
                fetchData(); // Refresh list
            } else if (res.status === 409) {
                const err = await res.json();
                alert(err.error || "Codice già esistente");
            } else {
                alert("Errore durante il salvataggio");
            }
        } catch (error) {
            console.error(error);
            alert("Errore di rete");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Sei sicuro di voler eliminare questa automazione?")) return;
        try {
            const res = await fetch(`/api/automazioni/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
            } else {
                alert("Errore durante l'eliminazione");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Derived state
    const filteredAutomazioni = automazioni.filter(a =>
        a.nome_automazione?.toLowerCase().includes(search.toLowerCase()) ||
        a.codice_automazione?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">Automazioni</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cerca record..."
                                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-200 transition-all font-semibold"
                        >
                            <Plus size={20} />
                            <span>Nuova</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Automazione</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stato</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tecnologia</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">PO (Matricola)</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ufficio</th>
                                <th className="p-4 text-end text-xs font-bold text-slate-400 uppercase tracking-wider">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Caricamento...</td></tr>
                            ) : filteredAutomazioni.map(auto => (
                                <tr key={auto.codice_automazione} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{auto.nome_automazione}</p>
                                        <p className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 inline-block px-1.5 py-0.5 rounded font-mono mt-1">
                                            {auto.codice_automazione}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${auto.stato === 'Running' ? 'bg-emerald-100 text-emerald-700' :
                                                auto.stato === 'Sviluppo' ? 'bg-amber-100 text-amber-700' :
                                                    auto.stato === 'Test' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                                            }
                                        `}>
                                            {auto.stato}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {auto.automazione_tecnologia?.map(at => (
                                                <span key={at.tipo_tecnologia} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold border border-indigo-100">
                                                    {at.tipo_tecnologia}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {auto.utente_automazione_rif_po_matricolaToutente ? (
                                            <div className="font-medium text-slate-700 dark:text-slate-300">
                                                {auto.utente_automazione_rif_po_matricolaToutente.matricola}
                                            </div>
                                        ) : <span className="text-slate-400">-</span>}
                                    </td>
                                    <td className="p-4">
                                        {auto.ufficio ? (
                                            <div className="text-sm text-slate-600">{auto.ufficio.descrizione}</div>
                                        ) : <span className="text-slate-400">-</span>}
                                    </td>
                                    <td className="p-4 text-end">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingItem(auto); setIsModalOpen(true); }}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(auto.codice_automazione)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AutomazioneModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingItem}
                stati={lookups.stati}
                iniziative={lookups.iniziative}
                utenti={lookups.utenti}
                uffici={lookups.uffici}
                allTecnologie={lookups.tecnologie}
                allProcedure={lookups.procedure}
            />
        </div>
    );
}
