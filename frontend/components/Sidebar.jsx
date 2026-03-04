'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectKitButton } from "connectkit";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Tableau de Bord', path: '/dashboard', icon: '📊' },
    { name: 'Créer un Scrutin', path: '/create', icon: '➕' },
  ];

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-64 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 z-50 flex flex-col p-8 transition-all">
      <div className="mb-12 text-center">
        <Link href="/" className="text-3xl font-black text-indigo-600 tracking-tighter uppercase">
            <h1 className="text-xl font-black text-indigo-600 tracking-tighter uppercase">
            VOTE <span className="text-fuchsia-500">M2</span>
            </h1>
        </Link>
        <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">BLOCKCHAIN OS</p>
      </div>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${
              pathname === item.path
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
        <ConnectKitButton.Custom>
          {({ isConnected, show, truncatedAddress, ensName }) => (
            <button
              onClick={show}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold hover:bg-slate-800 transition-colors truncate"
            >
              {isConnected ? (ensName ?? truncatedAddress) : "CONNEXION"}
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>
    </aside>
  );
}