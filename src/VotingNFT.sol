pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VotingNFT is ERC721 {
    using Strings for uint256;

    address public admin;
    uint256 public nextTokenId;
    uint256 public winningProposalId;
    bool public votingFinished;

    struct Proposal {
        string name;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    mapping(address => bool) public whitelist;
    mapping(address => bool) public hasVoted;
    mapping(uint256 => uint256) public userChoice;

    event VoteCast(address indexed voter, uint256 proposalId, uint256 tokenId);

    constructor() ERC721("VoteBadge", "VTB") {
        admin = msg.sender;
        proposals.push(Proposal("Projet A", 0));
        proposals.push(Proposal("Projet B", 0));
    }

    function addToWhitelist(address _voter) external {
        require(msg.sender == admin, "Seul l'admin peut whitelister");
        whitelist[_voter] = true;
    }

    function vote(uint256 _proposalId) external {
        require(whitelist[msg.sender], "Pas autorise");
        require(!hasVoted[msg.sender], "Deja vote");
        require(!votingFinished, "Vote clos");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        hasVoted[msg.sender] = true;
        proposals[_proposalId].voteCount++;
        userChoice[tokenId] = _proposalId;

        _safeMint(msg.sender, tokenId);
        emit VoteCast(msg.sender, _proposalId, tokenId);
    }

    function tallyVotes() external {
        require(msg.sender == admin, "Seul l'admin peut clore");
        votingFinished = true;

        uint256 highestVotes = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > highestVotes) {
                highestVotes = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        // Utilisation de ownerOf pour vérifier l'existence
        try this.ownerOf(_tokenId) returns (address) {}
        catch {
            revert("Token inexistant");
        }

        uint256 choice = userChoice[_tokenId];
        string memory projectName = proposals[choice].name;
        string memory finalSvg;

        if (votingFinished && choice == winningProposalId) {
            finalSvg = _getWinnerSvg(projectName);
        } else {
            finalSvg = _getVotedSvg(projectName);
        }

        string memory json = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name": "Badge #',
                    _tokenId.toString(),
                    '", ',
                    '"description": "Preuve de vote On-Chain", ',
                    '"image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _getVotedSvg(string memory projectName) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 473.931 473.931'>",
                "<circle cx='236.966' cy='236.966' r='236.966' fill='#6f7608'/>",
                "<path fill='#dfdfdf' d='m397.835 204.169-24.509-24.509-.041-36.916c-.565-11.723-5.86-23.135-14.398-31.158-8.4-8.108-20.303-12.771-31.734-12.718h-34.66l-26.129-26.076c-8.688-7.888-20.501-12.217-32.213-11.854-11.671.206-23.382 5.321-31.431 13.444l-24.516 24.512-36.912.037c-11.723.565-23.135 5.86-31.158 14.398-8.108 8.46-12.767 20.157-12.718 31.876v34.518l-26.073 26.129c-7.888 8.688-12.221 20.501-11.858 32.209.21 11.674 5.325 23.386 13.448 31.435l24.509 24.527.041 36.901c.565 11.723 5.86 23.135 14.398 31.161 8.464 8.108 20.161 12.771 31.88 12.718l36.22.011c8.808 7.861 17.71 15.652 26.739 23.491 8.494 6.806 19.349 10.065 29.762 9.369 10.425-.606 20.475-5.104 27.7-12.46a898 898 0 0 1 21.975-21.216c14.327-.745 28.639-1.691 43.139-2.717 10.825-1.194 20.8-6.567 27.674-14.421 6.941-7.802 10.866-18.088 10.776-28.4 0-9.803.183-19.603.505-29.403l31.176-31.244c7.891-8.688 12.221-20.501 11.858-32.213-.215-11.667-5.33-23.379-13.45-31.431'/>",
                "<path fill='#006d8f' d='m381.143 210.328-23.955-23.951v-33.87c0-20.703-16.778-37.485-37.477-37.485h-33.874L261.89 91.074c-14.645-14.642-38.375-14.642-53.013 0l-23.947 23.947h-33.874c-20.703 0-37.485 16.778-37.485 37.485v33.87l-23.955 23.951c-14.63 14.642-14.63 38.368 0 53.01l23.955 23.951v33.874c0 20.696 16.778 37.481 37.485 37.481h33.874l23.947 23.951c14.638 14.634 38.368 14.638 53.013 0l23.947-23.951h33.874c20.696 0 37.477-16.782 37.477-37.481v-33.874l23.955-23.951c14.638-14.641 14.63-38.371 0-53.009'/>",
                "<path fill='#dfdfdf' d='m132.731 208.85 13.953 41.309 13.987-41.601q1.097-3.277 1.643-4.561c.359-.857.965-1.624 1.804-2.309s1.987-1.029 3.442-1.029q1.598 0 2.967.797a5.9 5.9 0 0 1 2.14 2.125c.52.876.775 1.77.775 2.668 0 .614-.079 1.28-.247 1.994a19 19 0 0 1-.629 2.099q-.38 1.032-.76 2.125l-14.915 40.254a138 138 0 0 1-1.601 4.393q-.801 2.083-1.848 3.656a8.3 8.3 0 0 1-2.791 2.586c-1.16.67-2.586 1.01-4.269 1.01s-3.098-.329-4.262-.988a8.1 8.1 0 0 1-2.821-2.608 19 19 0 0 1-1.863-3.674 122 122 0 0 1-1.601-4.37l-14.668-39.917a68 68 0 0 0-.775-2.144c-.269-.7-.49-1.459-.674-2.268-.183-.808-.269-1.497-.269-2.062 0-1.426.569-2.728 1.717-3.906q1.723-1.767 4.333-1.766 3.19.001 4.516 1.949 1.325 1.957 2.716 6.238M206.639 200.659q9.58 0 16.449 3.888c4.584 2.589 8.045 6.275 10.398 11.049 2.354 4.778 3.528 10.383 3.528 16.83q0 7.144-1.931 12.988c-1.295 3.891-3.222 7.266-5.803 10.125-2.574 2.859-5.744 5.044-9.493 6.556-3.757 1.512-8.052 2.268-12.898 2.268-4.823 0-9.134-.775-12.943-2.331-3.817-1.557-6.993-3.749-9.545-6.578s-4.471-6.234-5.774-10.211c-1.31-3.978-1.957-8.281-1.957-12.902 0-4.733.681-9.078 2.039-13.025q2.037-5.923 5.904-10.084c2.578-2.773 5.714-4.898 9.414-6.365 3.703-1.467 7.908-2.208 12.612-2.208m17.739 31.686c0-4.513-.73-8.419-2.185-11.727-1.463-3.304-3.536-5.803-6.241-7.498s-5.811-2.544-9.309-2.544c-2.492 0-4.793.468-6.915 1.411-2.11.935-3.933 2.301-5.459 4.093s-2.731 4.086-3.618 6.87c-.883 2.791-1.325 5.919-1.325 9.396 0 3.506.438 6.668 1.325 9.497s2.125 5.175 3.742 7.038q2.413 2.796 5.545 4.18c2.084.928 4.378 1.388 6.87 1.388q4.794.002 8.808-2.398c2.675-1.594 4.801-4.06 6.387-7.397 1.578-3.333 2.375-7.438 2.375-12.309M282.271 212.004h-13.613v44.751q0 3.867-1.725 5.736c-1.149 1.25-2.63 1.871-4.449 1.871-1.848 0-3.36-.629-4.524-1.893-1.164-1.257-1.74-3.166-1.74-5.714v-44.751h-13.616c-2.133 0-3.712-.471-4.752-1.407q-1.555-1.408-1.557-3.719.001-2.397 1.624-3.783 1.613-1.385 4.685-1.384h39.67q3.232 0 4.808 1.426 1.578 1.43 1.579 3.742c.001 2.312-.535 2.78-1.601 3.719q-1.594 1.404-4.789 1.406M334.495 211.331h-28.108v15.128h25.885c1.901 0 3.326.427 4.262 1.283.943.857 1.411 1.979 1.411 3.383 0 1.399-.46 2.544-1.388 3.42-.92.883-2.354 1.325-4.284 1.325h-25.885v17.523h29.077q2.937 0 4.43 1.366c.995.913 1.489 2.122 1.489 3.637q-.001 2.189-1.489 3.547-1.491 1.368-4.43 1.366H301.55c-2.72 0-4.67-.599-5.86-1.804q-1.785-1.807-1.785-5.841v-46.308c0-1.792.262-3.252.797-4.393a4.97 4.97 0 0 1 2.5-2.477c1.134-.52 2.586-.775 4.348-.775h32.946c1.987 0 3.472.438 4.438 1.325s1.448 2.039 1.448 3.465q0 2.19-1.448 3.51-1.452 1.319-4.439 1.32'/>",
                "<text x='236' y='440' font-size='40' text-anchor='middle' fill='white'>",
                "Vote: ",
                projectName,
                "</text>",
                "</svg>"
            )
        );
    }

    function _getWinnerSvg(string memory projectName) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 473.935 473.935'>",
                "<circle cx='236.967' cy='236.967' r='236.967' fill='#a0bf19'/>",
                "<path d='M396.884 62.095 283.388 250.868l-13.141-9.381 26.193 18.709L421.651 88.542c-7.585-9.426-15.85-18.282-24.767-26.447' fill='#eb4424'/>",
                "<path d='M283.388 250.868 396.884 62.095a238 238 0 0 0-27.229-21.504l-99.404 200.897z' fill='#ef4f31'/>",
                "<path d='m208.975 241.488-13.134 9.381L80.437 59.087c-9.126 8.041-17.657 16.752-25.463 26.095l127.804 175.015z' fill='#eb4424'/>",
                "<path d='m195.841 250.868 13.134-9.381L108.239 38.02a236.6 236.6 0 0 0-27.801 21.066z' fill='#ef4f31'/>",
                "<path d='m320.862 277.854-8.004-8.004v-11.311c0-17.62-14.286-31.906-31.906-31.906h-11.319l-8.004-8.004c-12.46-12.46-32.662-12.46-45.13 0l-8.004 8.004h-11.311c-17.62 0-31.906 14.286-31.906 31.906v11.311l-8.004 8.004c-12.46 12.468-12.46 32.666 0 45.13l8.004 8.004v11.311c0 17.628 14.286 31.914 31.906 31.914h11.311l8.004 8.004c12.468 12.456 32.666 12.456 45.13 0l8.004-8.004h11.319c17.62 0 31.906-14.286 31.906-31.914v-11.311l8.004-8.004c12.46-12.461 12.46-32.67 0-45.13' fill='#f2ac0f'/>",
                "<circle cx='239.07' cy='300.428' r='66.417' fill='#fcb830'/>",
                "<path d='M235.115 334.134v-50.301c-9.362 7.188-15.656 10.78-18.9 10.78-1.549 0-2.922-.614-4.116-1.852-1.197-1.231-1.796-2.664-1.796-4.284 0-1.882.584-3.263 1.77-4.142 1.175-.887 3.259-2.028 6.241-3.431 4.464-2.103 8.026-4.311 10.698-6.634a44.7 44.7 0 0 0 7.102-7.79c2.069-2.877 3.405-4.644 4.041-5.31.629-.662 1.796-.995 3.529-.995q2.933.001 4.7 2.264 1.775 2.264 1.777 6.245v63.3c0 7.405-2.529 11.113-7.585 11.113-2.238 0-4.056-.752-5.407-2.264-1.358-1.516-2.054-3.747-2.054-6.699' fill='#d89205'/>",
                "<text x='236' y='440' font-size='30' text-anchor='middle' fill='white' font-weight='bold'>GAGNANT: ",
                projectName,
                "</text>",
                "</svg>"
            )
        );
    }
}
