'use client'

import { ConnectKitButton } from "connectkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { useEffect, useState } from "react";
import NftCard from "@/components/NftCard";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // On attend que la transaction soit confirmée pour rafraîchir l'affichage
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Fonction pour voter
  const handleVote = (id) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'vote',
      args: [id],
    });
  };

  console.log("Adresse du contrat:", CONTRACT_ADDRESS);
  console.log("Fonction vote dans ABI ?", CONTRACT_ABI.some(item => item.name === 'vote'));

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-8">
      {/* Header */}
      <nav className="w-full max-w-5xl flex justify-between items-center mb-12 bg-white p-4 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-black text-indigo-600">VOTE M2 NFT</h1>
        <ConnectKitButton />
      </nav>

      {isConnected ? (
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Section de Vote */}
          <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Participez au scrutin</h2>
            <p className="text-slate-500 mb-8">Choisissez le projet que vous souhaitez soutenir.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1].map((id) => (
                <button
                  key={id}
                  onClick={() => handleVote(id)}
                  disabled={isPending || isConfirming}
                  className="group relative p-6 border-2 border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all disabled:opacity-50"
                >
                  <span className="block text-3xl mb-2">{id === 0 ? "🚀" : "💡"}</span>
                  <span className="block text-xl font-bold text-slate-700">Projet {id === 0 ? 'A' : 'B'}</span>
                  <span className="text-sm text-slate-400 font-mono">ID: {id}</span>
                  
                  {(isPending || isConfirming) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Messages d'état */}
            {hash && (
              <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-mono break-all">
                Transaction envoyée ! Hash : {hash}
              </div>
            )}
            {isConfirmed && (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl font-bold">
                ✅ Vote enregistré avec succès !
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                Erreur : {error.shortMessage || "Action impossible (whitelist ? déjà voté ?)"}
              </div>
            )}
          </section>
                  <NftCard />
          {/* Espace Admin (Simplifié) */}
          <footer className="text-center pt-8 border-t border-slate-200">
            <p className="text-slate-400 text-sm">Connecté avec : {address}</p>
          </footer>
        </div>
      ) : (
        <div className="text-center py-20 bg-white px-10 rounded-3xl shadow-lg border border-slate-100">
          <div className="text-6xl mb-6">🗳️</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Prêt à voter ?</h2>
          <p className="text-slate-500 mb-8 max-w-md">Connectez votre portefeuille pour accéder aux projets et recevoir votre badge NFT dynamique.</p>
          <ConnectKitButton />
        </div>
      )}

    </main>
  );
}