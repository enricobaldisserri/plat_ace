"use client";

import { useState, useEffect } from "react";
import { Card } from "~/components/ui/Card";

type TecnologiaModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: {
        tipo_tecnologia: string;
        descrizione?: string | null;
        flag_attivo?: string | null;
    } | null;
};

export function TecnologiaModal({ isOpen, onClose, onSave, initialData }: TecnologiaModalProps) {
    const [formData, setFormData] = useState({
        tipo_tecnologia: "",
        descrizione: "",
        flag_attivo: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                tipo_tecnologia: initialData.tipo_tecnologia,
                descrizione: initialData.descrizione ?? "",
                flag_attivo: initialData.flag_attivo ?? "",
            });
        } else {
            setFormData({
                tipo_tecnologia: "",
                descrizione: "",
                flag_attivo: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = initialData ? `/api/tecnologie/${initialData.tipo_tecnologia}` : "/api/tecnologie";
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
                    <h2 className="text-xl font-bold">{initialData ? "Modifica Tecnologia" : "Nuova Tecnologia"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl transition-colors">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/50">
                    {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Tipo Tecnologia</label>
                        <input
                            type="text"
                            maxLength={20}
                            required
                            disabled={!!initialData}
                            value={formData.tipo_tecnologia}
                            onChange={e => setFormData({ ...formData, tipo_tecnologia: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Descrizione</label>
                        <input
                            type="text"
                            maxLength={128}
                            value={formData.descrizione}
                            onChange={e => setFormData({ ...formData, descrizione: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Status (Flag Attivo)</label>
                        <input
                            type="text"
                            maxLength={10}
                            value={formData.flag_attivo}
                            onChange={e => setFormData({ ...formData, flag_attivo: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                            placeholder="e.g. S, N, true, false"
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
