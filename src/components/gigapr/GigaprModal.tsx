"use client";

import { useState, useEffect } from "react";
import { Card } from "~/components/ui/Card";

type GigaprModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: {
        codice_applicazione: string;
        uff_appl_responsabile?: string | null;
        utente_responsabile?: string | null;
    } | null;
};

export function GigaprModal({ isOpen, onClose, onSave, initialData }: GigaprModalProps) {
    const [formData, setFormData] = useState({
        codice_applicazione: "",
        uff_appl_responsabile: "",
        utente_responsabile: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                codice_applicazione: initialData.codice_applicazione,
                uff_appl_responsabile: initialData.uff_appl_responsabile ?? "",
                utente_responsabile: initialData.utente_responsabile ?? "",
            });
        } else {
            setFormData({
                codice_applicazione: "",
                uff_appl_responsabile: "",
                utente_responsabile: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = initialData ? `/api/gigapr/${initialData.codice_applicazione}` : "/api/gigapr";
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
            <Card className="w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <h2 className="text-xl font-bold">{initialData ? "Modifica GIGAPR" : "Nuovo GIGAPR"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl transition-colors">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/50">
                    {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Codice Applicazione (Max 6)</label>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            disabled={!!initialData}
                            value={formData.codice_applicazione}
                            onChange={e => setFormData({ ...formData, codice_applicazione: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Uff. Responsabile</label>
                        <input
                            type="text"
                            maxLength={10}
                            value={formData.uff_appl_responsabile}
                            onChange={e => setFormData({ ...formData, uff_appl_responsabile: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Utente Responsabile</label>
                        <input
                            type="text"
                            maxLength={10}
                            value={formData.utente_responsabile}
                            onChange={e => setFormData({ ...formData, utente_responsabile: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                        />
                    </div>
                </form>

                <div className="p-6 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
                    <button onClick={onClose} type="button" className="px-5 py-2 text-sm font-bold border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Annulla</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all disabled:opacity-70">
                        {loading ? "Salvataggio..." : "Salva"}
                    </button>
                </div>
            </Card>
        </div>
    );
}
