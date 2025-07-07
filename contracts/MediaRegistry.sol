pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Media Registry
/// @notice Registers multimedia content on-chain and mints an ERC-721 token representing ownership.
/// @dev Uses OpenZeppelin ERC721URIStorage for token URI management.
contract MediaRegistry is ERC721URIStorage, ERC721Royalty, Ownable {
    struct Media {
        bytes32 contentHash;  // Hash of the original content (e.g., SHA-256)
        string metadataURI;   // Off-chain metadata URI (IPFS/Arweave)
    }

    // tokenId ⇒ Media details
    mapping(uint256 => Media) private _mediaInfo;

    // contentHash ⇒ tokenId (0 if not registered)
    mapping(bytes32 => uint256) private _hashToTokenId;

    uint256 private _tokenIdCounter;

    event MediaRegistered(
        uint256 indexed tokenId,
        bytes32 indexed contentHash,
        string metadataURI,
        address indexed owner
    );

    constructor() ERC721("Blockchain Media", "BMEDIA") Ownable(msg.sender) {
        // Set default royalty of 5% (500 basis points) to contract owner (platform)
        _setDefaultRoyalty(msg.sender, 500);
    }

    /// @notice Register new media and mint an NFT.
    /// @param contentHash The SHA-256 (or other) hash of the media file.
    /// @param metadataURI URI pointing to metadata stored off-chain.
    /// @return tokenId The ID of the newly minted NFT.
    function registerMedia(bytes32 contentHash, string calldata metadataURI)
        external
        returns (uint256 tokenId)
    {
        require(contentHash != bytes32(0), "Invalid hash");
        require(_hashToTokenId[contentHash] == 0, "Already registered");

        tokenId = ++_tokenIdCounter; // Start token IDs at 1

        // Store media info
        _mediaInfo[tokenId] = Media({contentHash: contentHash, metadataURI: metadataURI});
        _hashToTokenId[contentHash] = tokenId;

        // Mint NFT to caller
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit MediaRegistered(tokenId, contentHash, metadataURI, msg.sender);
    }

    /// @notice Verify whether a hash is already registered.
    /// @param contentHash The content hash to check.
    /// @return tokenId ID of the associated token (0 if not found).
    function verifyContent(bytes32 contentHash) external view returns (uint256 tokenId) {
        tokenId = _hashToTokenId[contentHash];
    }

    /// @notice Retrieve media details by token ID.
    function getMedia(uint256 tokenId)
        external
        view
        returns (bytes32 contentHash, string memory metadataURI)
    {
        require(tokenId > 0 && tokenId <= _tokenIdCounter, "Nonexistent token");
        Media memory media = _mediaInfo[tokenId];
        return (media.contentHash, media.metadataURI);
    }

    /// @notice Set royalty for a specific token ID.
    /// @param tokenId Token ID to set royalty for.
    /// @param receiver Royalty recipient.
    /// @param feeNumerator Royalty fee (basis points).
    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    /// @inheritdoc ERC721
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @dev Override required by Solidity for multiple inheritance.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 