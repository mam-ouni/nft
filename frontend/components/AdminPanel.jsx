'use client';

import { useState , useEffect } from 'react';
import { useAccount, useWriteContract, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import {  CONTRACT_ABI } from '../config/contract';
import { useWaitForTransactionReceipt } from 'wagmi';


export default function AdminPanel({ contractAddress, adminAddress }) {
  const { address } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const [voterAddress, setVoterAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const { writeContract, data: tallyHash } = useWriteContract();

  const { isSuccess: isTallyConfirmed } = useWaitForTransactionReceipt({
  hash: tallyHash,
  });

  const isAdmin = address?.toLowerCase() === adminAddress?.toLowerCase();

    const [requests, setRequests] = useState([]);

    useEffect(() => {
    const loadRequests = () => {
        const data = JSON.parse(localStorage.getItem('vote_requests') || '[]');
        setRequests(data.filter(r => r.status === 'pending'));
    };
    loadRequests();
    window.addEventListener('storage', loadRequests);
    return () => window.removeEventListener('storage', loadRequests);
    }, []);

    const approveRequest = (req) => {
        if (req.type === 'whitelist') {
            setVoterAddress(req.address);
        } else {
            setRecipientAddress(req.address);
            setAmount("0.1"); 
        }
        const all = JSON.parse(localStorage.getItem('vote_requests') || '[]');
        const updated = all.map(r => r.id === req.id ? {...r, status: 'approved'} : r);
        localStorage.setItem('vote_requests', JSON.stringify(updated));
        setRequests(updated.filter(r => r.status === 'pending'));
    };

    useEffect(() => {
  if (isTallyConfirmed && contractAddress) {
    const closedPolls = JSON.parse(localStorage.getItem('closed_polls') || '[]');
    if (!closedPolls.includes(contractAddress)) {
      localStorage.setItem('closed_polls', JSON.stringify([...closedPolls, contractAddress]));
      console.log("État local mis à jour : Scrutin Clos");
    }
  }
}, [isTallyConfirmed, contractAddress]);

  if (!isAdmin) return null;




  return (
    <section className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      
      <div className="relative bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/50 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">ADMIN CONSOLE</h2>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Authorized Personnel Only</p>
            </div>
          </div>
        <button 
        onClick={() => { 
            if(confirm("🚨 CLÔTURE DÉFINITIVE ?")) {
            writeContract({ 
                address: contractAddress, 
                abi: CONTRACT_ABI, 
                functionName: 'tallyVotes' 
            }); 
            }
        }}
        disabled={!!tallyHash && !isTallyConfirmed}
        className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-rose-200 active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
        {!!tallyHash && !isTallyConfirmed ? (
            <>
            <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
            CLÔTURE...
            </>
        ) : (
            "CLÔTURER"
        )}
        </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/50">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Whitelist Management</label>
            <div className="flex gap-2">
              <input 
                placeholder="0x..." 
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
                className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs font-mono"
              />
              <button onClick={() => writeContract({ address: contractAddress, abi: CONTRACT_ABI, functionName: 'addToWhitelist', args: [voterAddress] })}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/50">
            <label className="block text-[10px] font-black text-amber-700/50 uppercase mb-3 tracking-widest">Anvil Gas Faucet</label>
            <div className="space-y-2">
              <input 
                placeholder="Recipient Address" 
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full p-3 bg-white border border-amber-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono"
              />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="ETH" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-20 p-3 bg-white border border-amber-100 rounded-xl outline-none text-xs"
                />
                <button onClick={() => sendTransaction({ to: recipientAddress, value: parseEther(amount || "0") })}
                  className="flex-1 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all text-xs shadow-md">
                  Envoyer Gas
                </button>
              </div>
            </div>
          </div>
        </div>
<div className="mt-8 pt-8 border-t border-slate-100">
  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Demandes en attente ({requests.length})</h3>
  <div className="space-y-3">
    {requests.map((req) => (
      <div key={req.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">{req.name}</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${req.type === 'faucet' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {req.type}
            </span>
          </div>
          <p className="text-xs text-slate-500 italic mt-1">"{req.reason}"</p>
          <p className="text-[9px] font-mono text-slate-400 mt-1">{req.address}</p>
        </div>
        <button 
          onClick={() => approveRequest(req)}
          className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-md shadow-emerald-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    ))}
    {requests.length === 0 && <p className="text-xs text-slate-400 italic">Aucune demande pour le moment.</p>}
  </div>
</div>
      </div>
    </section>
  );
}