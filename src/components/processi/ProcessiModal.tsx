"use client";

import { useState, useEffect } from "react";
import { Card } from "~/components/ui/Card";

type ProcessiModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: {
        cod_fase_processo: string;
    } | null;
};

export function ProcessiModal({ isOpen, onClose, onSave, initialData }: ProcessiModalProps) {
    const [formData, setFormData] = useState({
        cod_fase_processo: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Only Create is supported effectively as there are no other fields
        if (initialData) {
            setFormData({
                cod_fase_processo: initialData.cod_fase_processo,
            });
        } else {
            setFormData({
                cod_fase_processo: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // If editing, we can't really do anything since PK is the only field.
            // But we'll follow the pattern. 
            const url = initialData ? `/api/processi/${encodeURIComponent(initialData.cod_fase_processo)}` : "/api/processi";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                // Handle 405 or other errors
                if (method === "PUT") {
                    setError("Modifica non supportata per chiave primaria. Elimina e ricrea.");
                    setLoading(false);
                    return;
                }
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
                    <h2 className="text-xl font-bold">{initialData ? "Dettaglio Processo" : "Nuovo Processo"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl transition-colors">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/50">
                    {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">Codice Fase Processo</label>
                        <input
                            type="text"
                            maxLength={50}
                            required
                            disabled={!!initialData}
                            value={formData.cod_fase_processo}
                            onChange={e => setFormData({ ...formData, cod_fase_processo: e.target.value })}
                            className="w-full p-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm disabled:opacity-50"
                        />
                    </div>

                    {initialData && (
                        <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-xs">
                            Nota: Questa tabella contiene solo la chiave primaria. Per modificare, elimina e crea un nuovo record.
                        </div>
                    )}

                </form>

                <div className="p-6 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
                    <button onClick={onClose} type="button" className="px-5 py-2 text-sm font-bold border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Annulla</button>
                    {!initialData && (
                        <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all disabled:opacity-70">
                            {loading ? "Salvataggio..." : "Salva"}
                        </button>
                    )}
                </div>
            </Card>
        </div>
    );
}
