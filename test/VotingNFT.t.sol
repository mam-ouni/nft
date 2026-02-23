pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VotingNFT.sol";

contract VotingNFTTest is Test {
    VotingNFT public voting;
    address admin = address(1);
    address voter1 = address(2);
    address hacker = address(3);

    function setUp() public {
        // On déploie le contrat en tant qu'admin
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

    function test_VoteAndMint() public {
        // 1. Whitelist
        vm.prank(admin);
        voting.addToWhitelist(voter1);

        // 2. Vote
        vm.prank(voter1);
        voting.vote(0);

        // 3. Vérifications
        assertTrue(voting.hasVoted(voter1));
        assertEq(voting.balanceOf(voter1), 1); 
    }

    function test_CannotVoteTwice() public {
        vm.prank(admin);
        voting.addToWhitelist(voter1);

        vm.startPrank(voter1);
        voting.vote(0);
        vm.expectRevert("Deja vote");
        voting.vote(0);
        vm.stopPrank();
    }
}