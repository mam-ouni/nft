'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_FACTORY_ADDRESS, CONTRACT_FACTORY_ABI } from '@/config/contract';
import AnimatedBackground from "@/components/AnimatedBackground";
import Link from 'next/link';
import { ConnectKitButton } from "connectkit";

export default function Dashboard() {
  const { isConnected } = useAccount();
  const [localClosedPolls, setLocalClosedPolls] = useState([]);

  useEffect(() => {
    const syncClosedPolls = () => {
      const data = JSON.parse(localStorage.getItem('closed_polls') || '[]');
      setLocalClosedPolls(data.map(addr => addr.toLowerCase()));
    };
    

    syncClosedPolls(); 

    const interval = setInterval(syncClosedPolls, 1000); 

    return () => clearInterval(interval);
  }, []);

  const { data: polls, isLoading } = useReadContract({
    address: CONTRACT_FACTORY_ADDRESS,
    abi: CONTRACT_FACTORY_ABI,
    functionName: 'getPolls',
    query: {
      refetchInterval: 5000, 
    }
  });

  return (
    <main className="min-h-screen bg-transparent p-8 relative">
      <AnimatedBackground />

      <nav className="w-full max-w-6xl mx-auto flex justify-between items-center mb-12 bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/20">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter uppercase">
          VOTE <span className="text-fuchsia-500">M2</span> DASHBOARD
        </h1>
        <div className="flex gap-4">
          <Link href="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold transition-all text-sm flex items-center shadow-lg shadow-indigo-100">
            + Nouveau Scrutin
          </Link>
          <ConnectKitButton />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-800">Scrutins Actifs</h2>
          <p className="text-slate-500 font-medium">Sélectionnez un vote pour participer ou consulter les badges NFT.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {polls && polls.length > 0 ? (
              polls.map((poll, index) => {
                
                const isActuallyClosed = poll.isClosed || localClosedPolls.includes(poll.contractAddress.toLowerCase());

                return (
                  <div key={index} className="group relative bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
                    
                    <div className={`absolute top-0 right-0 px-5 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                      isActuallyClosed 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-emerald-400 text-emerald-950'
                    }`}>
                      {isActuallyClosed ? '🔴 Closed' : '🟢 Ouvert'}
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors uppercase truncate">
                      {poll.name}
                    </h3>
                    
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 italic h-10 border-l-2 border-indigo-100 pl-3">
                      {poll.description}
                    </p>

                    <div className="space-y-4 relative z-10">
                      <div className="text-[9px] text-slate-400 font-mono break-all bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-inner">
                        ADR: {poll.contractAddress}
                      </div>

                      <Link 
                        href={`/vote/${poll.contractAddress}`}
                        className={`block w-full text-center py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${
                          isActuallyClosed 
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200" 
                            : "bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200"
                        }`}
                      >
                        {isActuallyClosed ? "🏆 VOIR RÉSULTATS" : "🗳️ PARTICIPER"}
                      </Link>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/15 transition-all duration-700"></div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-200 backdrop-blur-sm">
                <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">Aucun scrutin disponible</p>
                <Link href="/create" className="text-indigo-600 font-black mt-4 inline-block hover:underline">
                  Lancer le premier vote →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-slate-200/50 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Powered by AISSAOUI et BENTEBIBEL • M2 Cyber 2026
        </p>
      </footer>
    </main>
  );
}