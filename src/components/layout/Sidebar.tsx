"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Rocket, Cpu, Settings } from 'lucide-react';
import { AceLogo } from "../ui/AceLogo";

function NavItem({ icon, label, href, active }: { icon: React.ReactNode; label: string; href: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                }`}
        >
            <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>{icon}</span>
            <span>{label}</span>
            {/* active indicator if needed */}
        </Link>
    );
}

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-72 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="p-6">
                <div className="flex items-center gap-3 font-bold text-3xl text-indigo-600 tracking-tighter">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                        <AceLogo size={28} />
                    </div>
                    <span>ACE</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-4 custom-scrollbar">
                <NavItem
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    href="/"
                    active={pathname === '/'}
                />
                <NavItem
                    icon={<Rocket size={20} />}
                    label="Iniziative"
                    href="/iniziative"
                    active={pathname?.startsWith('/iniziative')}
                />
                <NavItem
                    icon={<Cpu size={20} />}
                    label="Automazioni"
                    href="/automazioni"
                    active={pathname?.startsWith('/automazioni')}
                />
                <div className="pt-6 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">Configurazione</div>
                <NavItem
                    icon={<Settings size={20} />}
                    label="Gestione Tabelle"
                    href="/config"
                    active={pathname === '/config'}
                />

                {/* Sub-items for Config, visible if we are in config section */}
                {pathname?.startsWith('/config') && (
                    <div className="ml-9 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 pl-3 my-1">
                        <Link href="/config/stati" className={`block text-sm font-medium transition-colors ${pathname === '/config/stati' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Stati</Link>
                        <Link href="/config/gigapr" className={`block text-sm font-medium transition-colors ${pathname === '/config/gigapr' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>GIGAPR</Link>
                        <Link href="/config/istituti" className={`block text-sm font-medium transition-colors ${pathname === '/config/istituti' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Istituti</Link>
                        <Link href="/config/uffici" className={`block text-sm font-medium transition-colors ${pathname === '/config/uffici' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Uffici</Link>
                        <Link href="/config/tecnologie" className={`block text-sm font-medium transition-colors ${pathname === '/config/tecnologie' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Tecnologie</Link>
                        <Link href="/config/procedure" className={`block text-sm font-medium transition-colors ${pathname === '/config/procedure' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Procedure</Link>
                        <Link href="/config/servizi" className={`block text-sm font-medium transition-colors ${pathname === '/config/servizi' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Servizi</Link>
                        <Link href="/config/utenti" className={`block text-sm font-medium transition-colors ${pathname === '/config/utenti' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Utenti</Link>
                        <Link href="/config/processi" className={`block text-sm font-medium transition-colors ${pathname === '/config/processi' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Processi</Link>
                    </div>
                )}
            </nav>

            <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">MR</div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-semibold">Mario Rossi</p>
                        <p className="truncate text-xs text-slate-500">Administrator</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
