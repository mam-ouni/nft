'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_FACTORY_ADDRESS, CONTRACT_FACTORY_ABI } from '@/config/contract';
import AnimatedBackground from "@/components/AnimatedBackground";
import { useRouter } from 'next/navigation';


export default function CreatePoll() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [proposals, setProposals] = useState(['', '']); 

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const addProposal = () => setProposals([...proposals, '']);
  
  const updateProposal = (index, value) => {
    const newProposals = [...proposals];
    newProposals[index] = value;
    setProposals(newProposals);
  };

  const handleCreate = () => {
    if (!name || !description || proposals.some(p => p === '')) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    writeContract({
      address: CONTRACT_FACTORY_ADDRESS,
      abi: CONTRACT_FACTORY_ABI,
      functionName: 'createPoll',
      args: [name, "VTB", description, proposals],
    });
  };

  if (isSuccess) {
    setTimeout(() => router.push('/dashboard'), 2000);
  }

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center p-8 relative">
      <AnimatedBackground />
      
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10">
        <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Créer un Scrutin</h1>
        <p className="text-slate-500 mb-8 font-medium">Déployez un nouveau vote sécurisé sur la blockchain.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">Titre du vote</label>
            <input 
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Élection du Bureau 2026"
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">Description</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'enjeu de ce vote..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">Choix possibles</label>
            <div className="space-y-3">
              {proposals.map((prop, index) => (
                <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-4">
                  <span className="flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold w-12 rounded-xl">
                    {index + 1}
                  </span>
                  <input 
                    value={prop} onChange={(e) => updateProposal(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 p-3 rounded-xl bg-white border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={addProposal}
              className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-2 transition-colors"
            >
              <span className="text-xl">+</span> Ajouter une option
            </button>
          </div>

          <button 
            onClick={handleCreate}
            disabled={isPending || isConfirming}
            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending || isConfirming ? "DÉPLOIEMENT EN COURS..." : "LANCER LE SCRUTIN SUR LA BLOCKCHAIN"}
          </button>

          {isSuccess && (
            <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-center font-bold animate-bounce">
              🎉 Scrutin déployé ! Redirection...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}