"use client";

import Link from "next/link";
import { Settings, FileText, Building2, Users, Code2, Network, UserCog, Share2, ChevronRight } from "lucide-react";
import { Card } from "~/components/ui/Card";

export default function ConfigDashboard() {
    const tables = [
        { name: "Gigapr", sub: "anagrafica applicazioni", id: "GIGAPR", icon: <FileText />, href: "/config/gigapr" },
        { name: "Istituti", sub: "aziende del gruppo", id: "ISTITUTO", icon: <Building2 />, href: "/config/istituti" },
        { name: "Procedure", sub: "elenco procedure operative", id: "PROCEDURA", icon: <FileText />, href: "/config/procedure" },
        { name: "Processi", sub: "mappatura albero dei processi", id: "ALBERO_DEI_PROCESSI", icon: <Share2 />, href: "/config/processi" },
        { name: "Servizi", sub: "elenco dei servizi centrali", id: "SERVIZIO", icon: <Network />, href: "/config/servizi" },
        { name: "Stati", sub: "stati di automazioni e iniziative", id: "AUTOMAZIONE_STATO", icon: <Settings />, href: "/config/stati" },
        { name: "Tecnologie", sub: "tecnologie delle automazioni", id: "TECNOLOGIA_AUTOMAZIONI", icon: <Code2 />, href: "/config/tecnologie" },
        { name: "Uffici", sub: "Unità organizzative", id: "UFFICIO", icon: <Users />, href: "/config/uffici" },
        { name: "Utenti", sub: "gestione matricole, PO e DEV", id: "UTENTE", icon: <UserCog />, href: "/config/utenti" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">Gestione Tabelle di Codice</h2>
                <p className="text-slate-500">Amministrazione granulare delle tabelle di lookup del sistema ACE.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tables.map(table => (
                    <Link key={table.id} href={table.href} className="block group">
                        <Card className="p-5 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer h-full">
                            <div className="flex items-start gap-4 h-full">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                                    {table.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{table.name}</p>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                                    </div>
                                    <p className="text-xs text-slate-500 italic mb-3 truncate">{table.sub}</p>
                                    <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                                        {table.id}
                                    </code>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
