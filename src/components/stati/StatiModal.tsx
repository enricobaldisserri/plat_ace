"use client";

import { useState, useEffect } from "react";
import { Card } from "~/components/ui/Card";

type StatiModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void; // Trigger refetch
    initialData?: {
        stato: string;
        descrizione?: string | null;
        ordine?: number | null;
        in_produzione?: boolean | null;
    } | null;
};

export function StatiModal({ isOpen, onClose, onSave, initialData }: StatiModalProps) {
    const [formData, setFormData] = useState({
        stato: "",
        descrizione: "",
        ordine: "",
        in_produzione: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                stato: initialData.stato,
                descrizione: initialData.descrizione ?? "",
                ordine: initialData.ordine?.toString() ?? "",
                in_produzione: initialData.in_produzione ?? false,
            });
        } else {
            // Reset for create
            setFormData({
                stato: "",
                descrizione: "",
                ordine: "",
                in_produzione: false,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = initialData ? `/api/stati/${initialData.stato}` : "/api/stati";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    // stato is in body for POST, and used in URL for PUT. 
                    // For PUT, body description/ordine/in_produzione are used.
                    // For POST, stato is needed.
                }),
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
                    <h2 className="text-xl font-bold">{initialData ? "Modifica Stato" : "Nuovo Stato"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl transition-colors">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/50">
                    {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Codice Stato (Max 12 char)</label>
                        <input
                            type="text"
                            maxLength={12}
                            required
                            disabled={!!initialData} // PK cannot be changed
                            value={formData.stato}
                            onChange={e => setFormData({ ...formData, stato: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Descrizione</label>
                        <input
                            type="text"
                            value={formData.descrizione}
                            onChange={e => setFormData({ ...formData, descrizione: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Ordine</label>
                            <input
                                type="number"
                                value={formData.ordine}
                                onChange={e => setFormData({ ...formData, ordine: e.target.value })}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm"
                            />
                        </div>
                        <div className="space-y-1.5 flex flex-col justify-end pb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.in_produzione}
                                    onChange={e => setFormData({ ...formData, in_produzione: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">In Produzione</span>
                            </label>
                        </div>
                    </div>

                </form>

                <div className="p-6 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
                    <button onClick={onClose} type="button" className="px-5 py-2 text-sm font-bold border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Annulla</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all disabled:opacity-70">
                        {loading ? "Salvataggio..." : "Salva Stato"}
                    </button>
                </div>
            </Card>
        </div>
    );
}
