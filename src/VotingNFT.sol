pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VotingNFT is ERC721 {
    using Strings for uint256;

    address public admin;
    bool public votingFinished;
    uint256 public nextTokenId;

    struct Proposal {
        string name;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    mapping(address => bool) public whitelist;
    mapping(address => bool) public hasVoted;
    mapping(uint256 => uint256) public userChoice; // tokenId => proposalId

    constructor() ERC721("VoteBadge", "VTB") {
        admin = msg.sender;
        proposals.push(Proposal("Projet A", 0));
        proposals.push(Proposal("Projet B", 0));
    }

    function addToWhitelist(address _voter) external {
        require(msg.sender == admin, "Seul l'admin peut whitelister");
        whitelist[_voter] = true;
    }

event VoteCast(address indexed voter, uint256 proposalId, uint256 tokenId);

function vote(uint256 _proposalId) external {
    require(whitelist[msg.sender], "Pas autorise");
    require(!hasVoted[msg.sender], "Deja vote");
    
    uint256 tokenId = nextTokenId;
    nextTokenId++;
    
    hasVoted[msg.sender] = true;
    proposals[_proposalId].voteCount++;
    userChoice[tokenId] = _proposalId; // <-- C'est cette ligne qui remplit le NFT
    
    _safeMint(msg.sender, tokenId);
    
    emit VoteCast(msg.sender, _proposalId, tokenId);
}

function tokenURI(uint256 _tokenId) public view override returns (string memory) {

    try this.ownerOf(_tokenId) returns (address) {
        // OK, le token existe
    } catch {
        return "Token inexistant";
    }

    uint256 choice = userChoice[_tokenId];
    
    // Protection contre les index hors limites
    string memory projectName = "Inconnu";
    if (choice < proposals.length) {
        projectName = proposals[choice].name;
    }

    // Construction du SVG 
    string memory svg = string(abi.encodePacked(
        "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>",
        "<rect width='100%' height='100%' fill='#1a1a2e'/>",
        "<text x='150' y='150' fill='white' text-anchor='middle'>Vote: ", 
        projectName, 
        "</text></svg>"
    ));

    return string(abi.encodePacked(
        "data:application/json;base64,",
        Base64.encode(bytes(abi.encodePacked(
            '{"name": "Badge #', 
            Strings.toString(_tokenId), 
            '", "description": "Preuve de vote", "image": "data:image/svg+xml;base64,', 
            Base64.encode(bytes(svg)), 
            '"}'
        )))
    ));
}
}