pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

interface IMediaRegistry is IERC721 {
    function verifyContent(bytes32 contentHash) external view returns (uint256 tokenId);
}

/// @title Media Marketplace
/// @notice Simple marketplace allowing owners to list their MediaRegistry NFTs for sale and others to purchase them.
/// @dev Funds are transferred to the seller; contract holds no tokens permanently.
contract MediaMarketplace is Ownable {
    IMediaRegistry public immutable registry;

    // tokenId => price in wei (0 means not listed)
    mapping(uint256 => uint256) public listingPrice;

    event Listed(uint256 indexed tokenId, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);
    event Purchased(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);

    constructor(address registryAddress) Ownable(msg.sender) {
        require(registryAddress != address(0), "Invalid registry address");
        registry = IMediaRegistry(registryAddress);
    }

    /// @notice List an owned token for sale.
    /// @param tokenId The ID of the token to list.
    /// @param price Sale price in wei.
    function listToken(uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");
        require(registry.ownerOf(tokenId) == msg.sender, "Not token owner");
        listingPrice[tokenId] = price;
        emit Listed(tokenId, price);
    }

    /// @notice Cancel a token listing.
    function cancelListing(uint256 tokenId) external {
        require(registry.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(listingPrice[tokenId] > 0, "Not listed");
        listingPrice[tokenId] = 0;
        emit ListingCancelled(tokenId);
    }

    /// @notice Purchase a listed token.
    /// @param tokenId The token to purchase.
    function purchase(uint256 tokenId) external payable {
        uint256 price = listingPrice[tokenId];
        require(price > 0, "Not listed");
        require(msg.value >= price, "Insufficient payment");

        address seller = registry.ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own token");

        // Calculate royalty
        (address royaltyReceiver, uint256 royaltyAmount) = IERC2981(address(registry)).royaltyInfo(tokenId, price);
        require(royaltyAmount <= price, "Invalid royalty");

        // Clear listing before transfer to prevent reentrancy issues
        listingPrice[tokenId] = 0;

        // Transfer token; seller must have approved marketplace
        registry.safeTransferFrom(seller, msg.sender, tokenId);

        // Pay royalty first
        if (royaltyAmount > 0) {
            payable(royaltyReceiver).transfer(royaltyAmount);
        }

        // Pay seller remaining amount
        payable(seller).transfer(price - royaltyAmount);

        // Refund excess payment if any
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit Purchased(tokenId, seller, msg.sender, price);
    }

    /// @notice Get current price of a listed token (0 if not listed).
    function getPrice(uint256 tokenId) external view returns (uint256) {
        return listingPrice[tokenId];
    }

    // Fallback to accept ETH
    receive() external payable {}
} 