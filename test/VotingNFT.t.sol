pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VotingNFT.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract VotingNFTTest is Test {
    VotingNFT public voting;
    address admin = address(1);
    address voter1 = address(2);
    address voter2 = address(3);
    address hacker = address(4);
    address voter3 = address(5);

    function setUp() public {
        vm.prank(admin);
        voting = new VotingNFT();
    }

    function test_AdminCanWhitelist() public {
        vm.prank(admin);
        voting.addToWhitelist(voter1);
        assertTrue(voting.whitelist(voter1));
    }

    function test_OnlyAdminCanWhitelist() public {
        vm.prank(hacker);
        vm.expectRevert("Seul l'admin peut whitelister");
        voting.addToWhitelist(hacker);
    }

    function test_FullVotingProcessAndWinnerSVG() public {
        // 1. Préparation des votes (Projet B va gagner)
        vm.startPrank(admin);
        voting.addToWhitelist(voter1);
        voting.addToWhitelist(voter2);
        voting.addToWhitelist(voter3);
        vm.stopPrank();

        // 2. Voter
        vm.prank(voter1);
        voting.vote(0);

        vm.prank(voter2);
        voting.vote(1);
        vm.prank(voter3);
        voting.vote(1);

        // 3. Vérifier l'état avant clôture (SVG par défaut)
        string memory uriBefore = voting.tokenURI(1);
        // On vérifie que le mot "GAGNANT" n'est PAS dans l'URI
        assertFalse(_stringContains(uriBefore, "GAGNANT"));

        // 4. Clôture du vote
        vm.prank(admin);
        voting.tallyVotes();

        assertTrue(voting.votingFinished());

        assertEq(voting.winningProposalId(), 1);

        string memory uriAfter = voting.tokenURI(1);

        string memory uriLoser = voting.tokenURI(0);

        assertTrue(keccak256(bytes(uriAfter)) != keccak256(bytes(uriLoser)), "SVG differents");
    }

    function test_CannotVoteAfterTally() public {
        vm.prank(admin);
        voting.addToWhitelist(voter1);

        vm.prank(admin);
        voting.tallyVotes();

        vm.prank(voter1);
        vm.expectRevert("Vote clos");
        voting.vote(0);
    }

    function test_TokenURIInexistent() public {
        vm.expectRevert("Token inexistant");
        voting.tokenURI(999);
    }

    // Helper function pour parser le contenu de l'URI
    function _stringContains(string memory haystack, string memory needle) internal pure returns (bool) {
        return bytes(haystack).length > 0 && bytes(haystack).length >= bytes(needle).length
            && _indexOf(haystack, needle) != type(uint256).max;
    }

    function _indexOf(string memory haystack, string memory needle) internal pure returns (uint256) {
        bytes memory h = bytes(haystack);
        bytes memory n = bytes(needle);
        if (h.length < n.length) return type(uint256).max;
        for (uint256 i = 0; i <= h.length - n.length; i++) {
            bool found = true;
            for (uint256 j = 0; j < n.length; j++) {
                if (h[i + j] != n[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }
        return type(uint256).max;
    }
}
