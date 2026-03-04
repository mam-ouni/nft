'use client'

import { useReadContract, useAccount } from 'wagmi';
import {  CONTRACT_ABI } from '@/config/contract';
import { useState, useEffect } from 'react';

export default function NftCard({ contractAddress }) {
  const { address, isConnected } = useAccount();
  const [nftMetadata, setNftMetadata] = useState(null);

  const { data: userChoice } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'getVoterTokenId',
    args: [address],
    query: { enabled: !!address, refetchInterval: 2000 }
  });

  const { data: tokenUri } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'tokenURI',
    args: [userChoice], 
    query: { enabled: userChoice !== undefined, refetchInterval: 2000 }
  });

  useEffect(() => {
    if (tokenUri) {
      try {
        const base64Data = tokenUri.split(',')[1];
        const decodedJson = JSON.parse(atob(base64Data));
        setNftMetadata(decodedJson);
      } catch (e) { setNftMetadata(null); }
    } else { setNftMetadata(null); }
  }, [tokenUri]);

  if (!isConnected) return null;

  return (
    <div className="mt-10 p-1 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400 rounded-[2.5rem] shadow-2xl max-w-sm mx-auto transition-all hover:scale-105">
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2.3rem] overflow-hidden">
        <h3 className="text-xl font-black text-center mb-5 text-slate-800 tracking-tight">VOTRE BADGE NFT</h3>
        
        {nftMetadata ? (
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-900 border border-white/20">
                <img src={nftMetadata.image} alt="NFT Vote" className="w-full h-auto transform transition duration-500 group-hover:scale-110" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <span className="inline-block px-4 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
                ID: #{userChoice?.toString()} • MINTÉ
              </span>
              <p className="font-mono text-lg text-slate-800 font-black">{nftMetadata.name}</p>
              <p className="text-slate-500 text-xs italic px-4">{nftMetadata.description}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-12 space-y-4">
            <div className="relative">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300 animate-[spin_10s_linear_infinite]"></div>
              <span className="absolute inset-0 flex items-center justify-center text-4xl">🗳️</span>
            </div>
            <div className="text-center">
              <p className="text-slate-800 font-bold">Aucun badge trouvé</p>
              <p className="text-slate-400 text-[11px] mt-1 max-w-[180px]">Votez pour générer votre preuve de participation on-chain.</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full w-1/2 animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}