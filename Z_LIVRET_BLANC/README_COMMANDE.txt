COMMANDES POUR TESTER LE SMART CONTRACT

Cette section présente les principales commandes utilisées pour compiler, déployer et interagir avec les Smart Contracts dans l’environnement Foundry. Les tests sont réalisés sur une blockchain locale simulée avec Anvil.


1. Lancer la blockchain locale

Nous commençons par lancer une blockchain Ethereum locale avec Anvil afin de tester les transactions sans utiliser un réseau public.

anvil

Si nécessaire, nous pouvons augmenter la limite de taille du code pour permettre le déploiement de contrats plus volumineux.

anvil --code-size-limit 100000


2. Compiler les Smart Contracts

Avant le déploiement, il est nécessaire de compiler le projet Solidity afin de générer les artefacts nécessaires.

forge build

Cette commande vérifie la syntaxe du code et prépare les contrats pour le déploiement.


3. Définir la clé privée de l’administrateur

L’administrateur du système doit signer les transactions de déploiement et de gestion du contrat.

export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80


4. Déployer le Smart Contract

Le contrat peut être déployé automatiquement via un script Foundry.

forge script script/VotingNFT.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

Il est également possible de déployer directement le contrat avec :

forge create src/VotingNFT.sol:VotingNFT \
--rpc-url http://127.0.0.1:8545 \
--private-key $PRIVATE_KEY \
--broadcast


5. Ajouter un utilisateur dans la whitelist

Avant de pouvoir voter, un utilisateur doit être autorisé par l’administrateur du scrutin.

cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "addToWhitelist(address)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
--private-key $PRIVATE_KEY \
--rpc-url http://127.0.0.1:8545


6. Définir la clé privée du votant

Pour simuler un utilisateur participant au vote, nous définissons une seconde clé privée.

export VOTER_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d


7. Envoyer des ETH de test au votant

Afin de payer les frais de transaction, l’utilisateur doit disposer d’ETH.

cast send 0x1B45cD36E41bc1bF2771c0f448F4Db32C3dCb4aa \
--value 10ether \
--rpc-url http://127.0.0.1:8545 \
--private-key $PRIVATE_KEY


8. Envoyer le vote sur la blockchain

Une fois autorisé, le votant peut participer au scrutin.

cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "vote(uint256)" 0 \
--private-key $VOTER_KEY \
--rpc-url http://127.0.0.1:8545


9. Vérifier les métadonnées du NFT

Après le vote, le NFT peut être consulté via la fonction tokenURI.

cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "tokenURI(uint256)" 0 \
--rpc-url http://127.0.0.1:8545

Une version détaillée peut également être obtenue :

cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "tokenURI(uint256)(string)" 0 \
--rpc-url http://127.0.0.1:8545


10. Clôturer le vote et calculer les résultats

Une fois le vote terminé, l’administrateur peut calculer le résultat final.

cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "tallyVotes()" \
--rpc-url http://127.0.0.1:8545 \
--private-key $PRIVATE_KEY
