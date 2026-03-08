'use client'

import { useParams } from "next/navigation";
import { ConnectKitButton } from "connectkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ABI } from "@/config/contract";
import { useEffect, useState } from "react";
import NftCard from "@/components/NftCard";
import AdminPanel from "@/components/AdminPanel";
import AnimatedBackground from "@/components/AnimatedBackground";
import RequestAccess from "@/components/RequestAccess";


export default function DynamicVotePage() {
  const params = useParams();
  const contractAddress = params.address; 

  const { isConnected, address } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: proposals, isLoading: loadingProposals } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'getProposals',
  });

  const { data: adminAddress } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'admin',
  });

  const handleVote = (id) => {
    writeContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: 'vote',
      args: [BigInt(id)],
    });
  };

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center p-8">
      <AnimatedBackground />
      
      <nav className="w-full max-w-5xl flex justify-between items-center mb-12 bg-white/90 backdrop-blur-lg p-4 rounded-2xl shadow-sm z-50">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">VOTE <span className="text-fuchsia-500 text-sm">DYNAMIC</span></h1>
        <ConnectKitButton />
      </nav>
      
      {isConnected ? (
        <div className="w-full max-w-4xl space-y-8 z-10">
          
          <AdminPanel adminAddress={adminAddress} contractAddress={contractAddress} />

          <section className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Participez au scrutin</h2>
            <p className="text-slate-500 mb-8 font-mono text-xs truncate">Contrat: {contractAddress}</p>
            
            {loadingProposals ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proposals?.map((proposal, id) => (
                  <button
                    key={id}
                    onClick={() => handleVote(id)}
                    disabled={isPending || isConfirming}
                    className="group relative p-8 border-2 border-slate-100 rounded-3xl overflow-hidden bg-white hover:border-indigo-500 transition-all duration-500 disabled:opacity-50 shadow-sm hover:shadow-xl text-left"
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0 ${
                      id % 2 === 0 
                        ? "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" 
                        : "bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-emerald-500/10"
                    }`} />
                    
                    <div className="relative z-10">
                      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm text-3xl">
                        {id % 2 === 0 ? "🚀" : "💡"}
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase">
                        {proposal.name}
                      </h3>
                      
                      <p className="text-slate-400 text-xs mt-1 font-bold italic uppercase">
                        Votes actuels: {proposal.voteCount.toString()}
                      </p>

                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-400 tracking-tighter">OPTION #{id}</span>
                        <span className="text-indigo-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                          Confirmer le choix →
                        </span>
                      </div>
                    </div>
                    
                    {(isPending || isConfirming) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl z-20 text-center px-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 mb-2"></div>
                        <span className="text-xs font-bold text-indigo-600 animate-pulse">Signature en cours...</span>
                      </div>
                    )}
                  </button>
                ))}
                </div>
            )}

            {hash && (
              <div className="mt-6 p-4 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-mono break-all border border-indigo-100">
                TX HASH: {hash}
              </div>
            )}
            
            {isConfirmed && (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl font-bold border border-green-100 animate-bounce text-center">
                ✅ Votre vote a été scellé on-chain !
              </div>
            )}
          </section>

          <NftCard contractAddress={contractAddress} />

          <RequestAccess />

          <footer className="text-center pt-8 border-t border-slate-200/50">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Connecté avec : {address}</p>
          </footer>
        </div>
      ) : (
        <div className="text-center py-20 bg-white/80 backdrop-blur-xl px-10 rounded-[3rem] shadow-2xl border border-white">
          <div className="text-6xl mb-6 animate-bounce">🗳️</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tighter">Accès au scrutin</h2>
          <p className="text-slate-500 mb-8 max-w-md font-medium text-sm">Le vote est protégé par la blockchain. Connectez votre wallet pour charger les propositions.</p>
          <ConnectKitButton />
        </div>
      )}
    </main>
  );
}