"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

type Tab = "Generale" | "Tecnologie" | "Procedure";

// Types corresponding to DB
interface AutomazioneFormData {
    codice_automazione: string;
    nome_automazione: string;
    stato: string;
    codice_iniziativa: string;
    rif_po_matricola: string;
    rif_dev_matricola: string;
    uo: string;
    tecnologie: { tipo_tecnologia: string; principale: boolean }[];
    procedure: { id_procedura: string }[];
}

interface AutomazioneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: AutomazioneFormData) => void;
    initialData?: any; // If null -> Create, if obj -> Edit

    // Lookup Data
    stati: any[];
    iniziative: any[];
    utenti: any[];
    uffici: any[];
    allTecnologie: any[];
    allProcedure: any[];
}

export function AutomazioneModal({
    isOpen, onClose, onSave, initialData,
    stati, iniziative, utenti, uffici, allTecnologie, allProcedure
}: AutomazioneModalProps) {

    const [activeTab, setActiveTab] = useState<Tab>("Generale");
    const [formData, setFormData] = useState<AutomazioneFormData>({
        codice_automazione: "",
        nome_automazione: "",
        stato: "",
        codice_iniziativa: "",
        rif_po_matricola: "",
        rif_dev_matricola: "",
        uo: "",
        tecnologie: [],
        procedure: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                codice_automazione: initialData.codice_automazione || "",
                nome_automazione: initialData.nome_automazione || "",
                stato: initialData.stato || "",
                codice_iniziativa: initialData.codice_iniziativa || "",
                rif_po_matricola: initialData.rif_po_matricola || "",
                rif_dev_matricola: initialData.rif_dev_matricola || "",
                uo: initialData.uo || "",
                tecnologie: initialData.automazione_tecnologia?.map((at: any) => ({
                    tipo_tecnologia: at.tipo_tecnologia,
                    principale: at.principale
                })) || [],
                procedure: initialData.procedura_automazione?.map((pa: any) => ({
                    id_procedura: pa.id_procedura
                })) || []
            });
        } else {
            // Reset for create
            setFormData({
                codice_automazione: "",
                nome_automazione: "",
                stato: "",
                codice_iniziativa: "",
                rif_po_matricola: "",
                rif_dev_matricola: "",
                uo: "",
                tecnologie: [],
                procedure: []
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(formData);
    };

    const toggleTecnologia = (tipo: string) => {
        setFormData(prev => {
            const exists = prev.tecnologie.find(t => t.tipo_tecnologia === tipo);
            if (exists) {
                return { ...prev, tecnologie: prev.tecnologie.filter(t => t.tipo_tecnologia !== tipo) };
            } else {
                return { ...prev, tecnologie: [...prev.tecnologie, { tipo_tecnologia: tipo, principale: false }] };
            }
        });
    };

    const setPrincipale = (tipo: string) => {
        setFormData(prev => ({
            ...prev,
            tecnologie: prev.tecnologie.map(t => ({
                ...t,
                principale: t.tipo_tecnologia === tipo // Only one can be principal? Or per user request "può essere selezionato solo per uno degli n record" -> Yes, radio behavior
            }))
        }));
    };

    const toggleProcedura = (id: string) => {
        setFormData(prev => {
            const exists = prev.procedure.find(p => p.id_procedura === id);
            if (exists) {
                return { ...prev, procedure: prev.procedure.filter(p => p.id_procedura !== id) };
            } else {
                return { ...prev, procedure: [...prev.procedure, { id_procedura: id }] };
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {initialData ? `Scheda Automazione: ${initialData.codice_automazione}` : "Nuova Automazione"}
                        </h2>
                        <p className="text-sm text-slate-500">Dati anagrafici, stack tecnologico e procedure GIGAPR collegate.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 flex gap-4">
                    {(["Generale", "Tecnologie", "Procedure"] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 text-sm font-bold transition-all border-b-2 ${activeTab === tab
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === "Generale" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Codice Automazione</label>
                                <input
                                    type="text"
                                    className={`w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none ${initialData ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`}
                                    placeholder="Es. AUT-001"
                                    value={formData.codice_automazione}
                                    onChange={e => setFormData({ ...formData, codice_automazione: e.target.value })}
                                    disabled={!!initialData} // Disable in edit mode
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nome Automazione</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Es. Robot Estrazione Fatture"
                                    value={formData.nome_automazione}
                                    onChange={e => setFormData({ ...formData, nome_automazione: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Stato Attuale</label>
                                <select
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.stato}
                                    onChange={e => setFormData({ ...formData, stato: e.target.value })}
                                >
                                    <option value="">Seleziona Stato...</option>
                                    {stati.map(s => (
                                        <option key={s.stato} value={s.stato}>{s.descrizione || s.stato}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Iniziativa Associata</label>
                                <select
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.codice_iniziativa}
                                    onChange={e => setFormData({ ...formData, codice_iniziativa: e.target.value })}
                                >
                                    <option value="">Seleziona Iniziativa...</option>
                                    {iniziative.map(i => (
                                        <option key={i.codice_iniziativa} value={i.codice_iniziativa}>{i.nome_inziativa || i.codice_iniziativa}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Matricola PO</label>
                                <select
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.rif_po_matricola}
                                    onChange={e => setFormData({ ...formData, rif_po_matricola: e.target.value })}
                                >
                                    <option value="">Seleziona PO...</option>
                                    {utenti.map(u => (
                                        <option key={u.matricola} value={u.matricola}>{u.cognome} {u.nome} ({u.matricola})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Matricola DEV</label>
                                <select
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.rif_dev_matricola}
                                    onChange={e => setFormData({ ...formData, rif_dev_matricola: e.target.value })}
                                >
                                    <option value="">Seleziona DEV...</option>
                                    {utenti.map(u => (
                                        <option key={u.matricola} value={u.matricola}>{u.cognome} {u.nome} ({u.matricola})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Ufficio (UO)</label>
                                <select
                                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.uo}
                                    onChange={e => setFormData({ ...formData, uo: e.target.value })}
                                >
                                    <option value="">Seleziona Ufficio...</option>
                                    {uffici.map(u => (
                                        <option key={u.uo} value={u.uo}>{u.descrizione} ({u.uo})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === "Tecnologie" && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 mb-4">Seleziona le tecnologie utilizzate e indica quella principale.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {allTecnologie.map(tech => {
                                    const isSelected = formData.tecnologie.find(t => t.tipo_tecnologia === tech.tipo_tecnologia);
                                    return (
                                        <div key={tech.tipo_tecnologia} className={`p-4 rounded-lg border ${isSelected ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700'} transition-all`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!isSelected}
                                                        onChange={() => toggleTecnologia(tech.tipo_tecnologia)}
                                                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-sm">{tech.tipo_tecnologia}</p>
                                                        <p className="text-xs text-slate-500">{tech.descrizione}</p>
                                                    </div>
                                                </div>

                                                {isSelected && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-slate-500">Principale?</span>
                                                        <button
                                                            onClick={() => setPrincipale(tech.tipo_tecnologia)}
                                                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isSelected.principale ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}
                                                        >
                                                            {isSelected.principale && <Check size={14} className="text-white" />}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === "Procedure" && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 mb-4">Seleziona le procedure GIGAPR collegate a questa automazione.</p>
                            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                                {allProcedure.map(proc => {
                                    const isSelected = formData.procedure.find(p => p.id_procedura === proc.id_procedura);
                                    return (
                                        <div key={proc.id_procedura}
                                            onClick={() => toggleProcedura(proc.id_procedura)}
                                            className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}
                                        >
                                            <div>
                                                <p className="font-mono text-xs text-slate-400">{proc.id_procedura}</p>
                                                <p className="font-medium text-sm">{proc.descrizione}</p>
                                            </div>
                                            {isSelected && <Check size={20} className="text-indigo-600" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-sm shadow-lg shadow-indigo-200 transition-all"
                    >
                        Salva Modifiche
                    </button>
                </div>

            </div>
        </div>
    );
}
