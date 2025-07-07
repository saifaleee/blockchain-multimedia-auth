pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

/// @title Media Edition Registry (ERC-1155)
/// @notice Supports batch minting of multiple editions of the same media with royalty info.
contract MediaEditionRegistry is ERC1155Supply, ERC2981, Ownable {
    struct MediaEdition {
        bytes32 contentHash; // Hash of underlying media
    }

    // tokenId ⇒ MediaEdition
    mapping(uint256 => MediaEdition) private _editionInfo;
    // tokenId ⇒ metadata URI
    mapping(uint256 => string) private _tokenURIs;
    // contentHash ⇒ tokenId (0 if not registered)
    mapping(bytes32 => uint256) public hashToTokenId;

    uint256 private _nextTokenId = 1;

    event EditionRegistered(uint256 indexed tokenId, bytes32 indexed contentHash, string metadataURI, uint256 amount, address indexed creator);

    constructor() ERC1155("") Ownable(msg.sender) {
        // platform default royalty 5%
        _setDefaultRoyalty(msg.sender, 500);
    }

    /// @notice Register a media edition and mint multiple copies to the caller.
    /// @param contentHash Unique hash of media file.
    /// @param metadataURI Off-chain metadata URI (IPFS/Arweave).
    /// @param amount Number of copies to mint.
    /// @return tokenId Newly created token ID.
    function registerEdition(bytes32 contentHash, string calldata metadataURI, uint256 amount) external returns (uint256 tokenId) {
        require(contentHash != bytes32(0), "Invalid hash");
        require(hashToTokenId[contentHash] == 0, "Already registered");
        require(amount > 0, "Amount zero");

        tokenId = _nextTokenId++;
        _editionInfo[tokenId] = MediaEdition({contentHash: contentHash});
        hashToTokenId[contentHash] = tokenId;
        _tokenURIs[tokenId] = metadataURI;

        _mint(msg.sender, tokenId, amount, "");
        _setTokenRoyalty(tokenId, msg.sender, 500); // 5% to creator by default

        emit EditionRegistered(tokenId, contentHash, metadataURI, amount, msg.sender);
    }

    /// @notice Get media edition details.
    function getEdition(uint256 tokenId) external view returns (bytes32 contentHash, string memory metadataURI, uint256 supply) {
        MediaEdition memory ed = _editionInfo[tokenId];
        return (ed.contentHash, _tokenURIs[tokenId], totalSupply(tokenId));
    }

    /// @notice Verify whether a hash is registered.
    function verifyContent(bytes32 contentHash) external view returns (uint256 tokenId) {
        return hashToTokenId[contentHash];
    }

    // ---------- Overrides ----------

    function uri(uint256 tokenId) public view override(ERC1155) returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 