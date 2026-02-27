'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

export default function AdminPanel({ adminAddress }) {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { sendTransaction } = useSendTransaction();

  // States pour la Whitelist
  const [voterAddress, setVoterAddress] = useState('');
  
  // States pour l'envoi d'ETH
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const isAdmin = address?.toLowerCase() === adminAddress?.toLowerCase();

  if (!isAdmin) return null;

  // Action : Ajouter à la Whitelist
  const handleAddWhitelist = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'addToWhitelist',
      args: [voterAddress],
    });
  };


  const handleTallyVotes = () => {
    if(confirm("Êtes-vous sûr de vouloir clôturer le vote ? Cette action est irréversible.")) {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'tallyVotes',
      });
    }
  };


  const handleSendEth = () => {
    sendTransaction({
      to: recipientAddress,
      value: parseEther(amount), 
    });
  };

  return (
    <div style={{ 
      padding: '25px', 
      border: '3px solid #FFD700', 
      marginTop: '30px', 
      borderRadius: '15px', 
      backgroundColor: '#fffdf0',
      color: '#333'
    }}>
      <h2 style={{ marginTop: 0 }}>🛠 Panneau de Contrôle Admin</h2>
      
      {}
      <section style={{ marginBottom: '20px', padding: '15px', borderBottom: '1px solid #eee' }}>
        <h3>📜 Gestion du Scrutin</h3>
        <div style={{ marginBottom: '10px' }}>
          <input 
            placeholder="Adresse à autoriser (0x...)" 
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
            style={{ padding: '8px', width: '320px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button onClick={handleAddWhitelist} style={{ backgroundColor: '#f1c40f', border: 'none', padding: '9px 15px', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
            Whitelister
          </button>
        </div>
        
        <button 
          onClick={handleTallyVotes} 
          style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold', width: '100%' }}
        >
          🔒 CLÔTURER LE VOTE ET DÉSIGNER LE GAGNANT
        </button>
      </section>

      {}
      <section style={{ padding: '15px' }}>
        <h3>💰 Distribution d'ETH (Testnet)</h3>
        <p style={{ fontSize: '12px', color: '#666' }}>Utilisez ceci pour donner du gaz aux testeurs sur Anvil.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            placeholder="Adresse destinataire" 
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            style={{ padding: '8px', flex: 2, borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input 
            placeholder="Montant (ex: 0.5)" 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '8px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button onClick={handleSendEth} style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '9px 15px', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' }}>
            Envoyer ETH
          </button>
        </div>
      </section>
    </div>
  );
}