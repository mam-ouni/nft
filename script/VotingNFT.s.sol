pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/VotingNFT.sol";

contract VotingNFTScript is Script {
    function run() external {
        // Récupère la clé privée de test par défaut d'Anvil ou de ton .env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Début de la transaction de déploiement
        vm.startBroadcast(deployerPrivateKey);

        VotingNFT voting = new VotingNFT();

        vm.stopBroadcast();
    }
}
