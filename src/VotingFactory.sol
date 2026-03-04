pragma solidity ^0.8.20;

import "./VotingNFT.sol";

contract VotingFactory {
    struct PollInfo {
        address contractAddress;
        string name;
        string description;
        address creator;
        bool isClosed;
    }

    PollInfo[] public allPolls;

    event PollCreated(address pollAddress, string name, address creator);

    function createPoll(
        string memory _name,
        string memory _symbol,
        string memory _description,
        string[] memory _proposals
    ) external {
        VotingNFT newPoll = new VotingNFT(
            _name, 
            _symbol, 
            _description, 
            _proposals, 
            msg.sender
        );

        allPolls.push(PollInfo({
            contractAddress: address(newPoll),
            name: _name,
            description: _description,
            creator: msg.sender,
            isClosed: false
        }));

        emit PollCreated(address(newPoll), _name, msg.sender);
    }

    function getPolls() external view returns (PollInfo[] memory) {
        return allPolls;
    }
}