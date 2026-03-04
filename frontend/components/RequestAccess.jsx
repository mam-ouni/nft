'use client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function RequestAccess() {
  const { address } = useAccount();
  const [formData, setFormData] = useState({ name: '', reason: '', type: 'whitelist' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = { ...formData, address, status: 'pending', id: Date.now() };
    
    const existingRequests = JSON.parse(localStorage.getItem('vote_requests') || '[]');
    localStorage.setItem('vote_requests', JSON.stringify([...existingRequests, request]));
    
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-lg mt-8">
      <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tighter">Demander un accès / ETH</h3>
      {sent ? (
        <div className="text-green-600 font-bold animate-pulse">✉️ Demande envoyée à l'administrateur !</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            placeholder="Votre Nom" 
            className="w-full p-3 rounded-xl bg-white/50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <select 
            className="w-full p-3 rounded-xl bg-white/50 border border-slate-200 text-sm outline-none"
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="whitelist">Accès Whitelist (Droit de vote)</option>
            <option value="faucet">Besoin d'ETH (Fonds de test)</option>
          </select>
          <textarea 
            placeholder="Motif de la demande..." 
            className="w-full p-3 rounded-xl bg-white/50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm h-20"
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            required
          />
          <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all text-xs">
            ENVOYER LA REQUÊTE
          </button>
        </form>
      )}
    </div>
  );
}