'use client';

import Link from 'next/link';
import AnimatedBackground from "@/components/AnimatedBackground";
import { ConnectKitButton } from "connectkit";
import { useAccount } from 'wagmi';

export default function WelcomePage() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-4xl text-center z-10 space-y-8">
        <div className="space-y-4">
          <span className="px-4 py-1.5 my-5 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-sm border border-indigo-200">
            Gouvernance On-Chain 2.0
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
            VOTE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-cyan-400 animate-gradient">NFT</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            La plateforme de scrutin décentralisée où chaque vote devient un badge de collection unique et infalsifiable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {isConnected ? (
            <Link href="/dashboard" className="group relative px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-indigo-600 transition-all hover:-translate-y-1">
              ACCÉDER AU DASHBOARD
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => (
                <button onClick={show} className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105">
                  CONNECTER MON WALLET
                </button>
              )}
            </ConnectKitButton.Custom>
          )}
          
          <Link href="/create" className="px-10 py-5 bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200 rounded-[2rem] font-black text-lg hover:bg-white transition-all">
            CRÉER UN SCRUTIN
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-sm">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">Sécurité Totale</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Vos votes sont enregistrés sur la blockchain et protégés par cryptographie.</p>
          </div>
          
          <div className="p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-sm">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">Badge NFT</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Chaque participant reçoit un NFT dynamique qui évolue selon le résultat du vote.</p>
          </div>

          <div className="p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-sm">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">Transparent</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Les résultats sont publics, vérifiables et auditables par n'importe qui, à tout moment.</p>
          </div>
        </div>
      </div>

      <footer className=" absolute bottom-3  w-full text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] opacity-50">
          Powered by AISSAOUI et BENTEBIBEL • M2 Cyber 2026
        </p>
      </footer>
    </main>
  );
}