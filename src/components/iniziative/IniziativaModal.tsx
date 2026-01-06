"use client";

import { useState, useEffect } from "react";
import { Card } from "~/components/ui/Card";

type IniziativaModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: {
        codice_iniziativa: string;
        nome_inziativa?: string | null;
        stato?: string | null;
        data_creazione?: Date | string | null;
        codice_applicazione?: string | null;
        rif_gigapr?: string | null;
        matrice_rischio?: string | null;
        flag_attivo?: boolean | null;
    } | null;
};

export function IniziativaModal({ isOpen, onClose, onSave, initialData }: IniziativaModalProps) {
    const [formData, setFormData] = useState({
        codice_iniziativa: "",
        nome_inziativa: "",
        stato: "",
        data_creazione: "",
        codice_applicazione: "",
        rif_gigapr: "",
        matrice_rischio: "",
        flag_attivo: true,
    });
    const [stati, setStati] = useState<any[]>([]);
    const [gigaprList, setGigaprList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            // Fetch lookups
            fetch("/api/automazioni/stati").then(res => res.json()).then(setStati).catch(console.error);
            fetch("/api/gigapr").then(res => res.json()).then(setGigaprList).catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                codice_iniziativa: initialData.codice_iniziativa,
                nome_inziativa: initialData.nome_inziativa ?? "",
                stato: initialData.stato ?? "",
                data_creazione: initialData.data_creazione ? (new Date(initialData.data_creazione).toISOString().split('T')[0] ?? "") : "",
                codice_applicazione: initialData.codice_applicazione ?? "",
                rif_gigapr: initialData.rif_gigapr ?? "",
                matrice_rischio: initialData.matrice_rischio ?? "",
                flag_attivo: initialData.flag_attivo ?? true,
            });
        } else {
            setFormData({
                codice_iniziativa: "",
                nome_inziativa: "",
                stato: "",
                data_creazione: new Date().toISOString().split('T')[0] ?? "",
                codice_applicazione: "",
                rif_gigapr: "",
                matrice_rischio: "",
                flag_attivo: true,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = initialData ? `/api/iniziative/${initialData.codice_iniziativa}` : "/api/iniziative";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to save");
            }

            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl h-[90vh]">
                <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                    <h2 className="text-xl font-bold">{initialData ? "Modifica Iniziativa" : "Nuova Iniziativa"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl transition-colors">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/50">
                    {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Codice Iniziativa</label>
                            <input
                                type="text"
                                maxLength={10}
                                required
                                disabled={!!initialData}
                                value={formData.codice_iniziativa}
                                onChange={e => setFormData({ ...formData, codice_iniziativa: e.target.value })}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Data Creazione</label>
                            <input
                                type="date"
                                value={formData.data_creazione}
                                onChange={e => setFormData({ ...formData, data_creazione: e.target.value })}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Nome Iniziativa</label>
                        <input
                            type="text"
                            maxLength={128}
                            value={formData.nome_inziativa}
                            onChange={e => setFormData({ ...formData, nome_inziativa: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Stato</label>
                            <select
                                value={formData.stato}
                                onChange={e => setFormData({ ...formData, stato: e.target.value })}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                            >
                                <option value="">Seleziona Stato</option>
                                {stati.map((s: any) => (
                                    <option key={s.stato} value={s.stato}>{s.descrizione || s.stato}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Matrice Rischio</label>
                            <select
                                value={formData.matrice_rischio}
                                onChange={e => setFormData({ ...formData, matrice_rischio: e.target.value })}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                            >
                                <option value="">Seleziona Rischio</option>
                                <option value="ALTO">ALTO</option>
                                <option value="MEDIO">MEDIO</option>
                                <option value="MEDIO-ALTO">MEDIO-ALTO</option>
                                <option value="BASSO">BASSO</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Codice Applicazione</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={formData.codice_applicazione}
                                onChange={e => setFormData({ ...formData, codice_applicazione: e.target.value })}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Rif Gigapr</label>
                            <select
                                value={formData.rif_gigapr}
                                onChange={e => setFormData({ ...formData, rif_gigapr: e.target.value })}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                            >
                                <option value="">Seleziona Gigapr</option>
                                {gigaprList.map((g: any) => (
                                    <option key={g.codice_applicazione} value={g.codice_applicazione}>
                                        {g.codice_applicazione} - {g.uff_appl_responsabile}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.flag_attivo}
                                onChange={e => setFormData({ ...formData, flag_attivo: e.target.checked })}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Attivo</span>
                        </label>
                    </div>
                </form>

                <div className="p-6 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} type="button" className="px-5 py-2 text-sm font-bold border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Annulla</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all disabled:opacity-70">
                        {loading ? "Salvataggio..." : "Salva"}
                    </button>
                </div>
            </Card>
        </div>
    );
}
