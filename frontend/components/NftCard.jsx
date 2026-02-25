'use client'

import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract';
import { useState, useEffect } from 'react';

export default function NftCard() {
  const { address } = useAccount();
  const [nftMetadata, setNftMetadata] = useState(null);

  // Pour simplifier, on cherche le Token ID 0 ou 1 
  // (Dans une vraie app, on ferait une boucle ou on lirait le dernier nextTokenId)
  const { data: tokenUri } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'tokenURI',
    args: [0], // On teste avec le premier token pour l'instant
    query: { enabled: !!address }
  });

  useEffect(() => {
    if (tokenUri) {

      const base64Data = tokenUri.split(',')[1];
      const decodedJson = JSON.parse(atob(base64Data));
      setNftMetadata(decodedJson);
    }
  }, [tokenUri]);

  if (!nftMetadata) return null;

  return (
    <div className="mt-10 p-6 bg-white rounded-3xl shadow-2xl border-2 border-indigo-100 max-w-sm mx-auto overflow-hidden transition-all hover:scale-105">
      <h3 className="text-xl font-bold text-center mb-4 text-slate-800">Votre Badge de Vote</h3>
      <div className="rounded-xl overflow-hidden shadow-inner bg-slate-50">
        {/* L'image est déjà au format data:image/svg+xml;base64 dans le JSON */}
        <img src={nftMetadata.image} alt="NFT Vote" className="w-full h-auto" />
      </div>
      <div className="mt-4 text-center">
        <p className="font-mono text-sm text-indigo-600 font-bold">{nftMetadata.name}</p>
        <p className="text-gray-500 text-xs mt-1">{nftMetadata.description}</p>
      </div>
    </div>
  );
}