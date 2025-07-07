pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IMediaRegistryRental is IERC721 {}

/// @title Media Rental
/// @notice Allows NFT owners to rent out their tokens for a limited time without transferring ownership.
contract MediaRental is Ownable {
    IMediaRegistryRental public immutable registry;

    struct Rental {
        address renter;
        uint64 expires; // Unix timestamp expiry (0 = none)
    }

    mapping(uint256 => Rental) public rentals;

    event Rented(uint256 indexed tokenId, address indexed renter, uint64 expires);
    event Returned(uint256 indexed tokenId);
    event Reclaimed(uint256 indexed tokenId);

    constructor(address registryAddress) Ownable(msg.sender) {
        require(registryAddress != address(0), "Invalid registry address");
        registry = IMediaRegistryRental(registryAddress);
    }

    /// Rent out token the caller owns
    function rentOut(uint256 tokenId, address renter, uint64 duration) external {
        require(renter != address(0), "Invalid renter");
        require(duration > 0, "Duration zero");
        require(registry.ownerOf(tokenId) == msg.sender, "Not token owner");
        Rental storage current = rentals[tokenId];
        require(block.timestamp >= current.expires, "Already rented");
        uint64 expires = uint64(block.timestamp + duration);
        rentals[tokenId] = Rental({renter: renter, expires: expires});
        emit Rented(tokenId, renter, expires);
    }

    /// Renter returns before expiry
    function returnToken(uint256 tokenId) external {
        Rental memory info = rentals[tokenId];
        require(info.renter == msg.sender, "Not renter");
        require(block.timestamp < info.expires, "Already expired");
        delete rentals[tokenId];
        emit Returned(tokenId);
    }

    /// Owner reclaims after expiry
    function reclaim(uint256 tokenId) external {
        require(registry.ownerOf(tokenId) == msg.sender, "Not token owner");
        Rental memory info = rentals[tokenId];
        require(info.expires != 0 && block.timestamp >= info.expires, "Not expired");
        delete rentals[tokenId];
        emit Reclaimed(tokenId);
    }

    function isRented(uint256 tokenId) external view returns (bool) {
        return rentals[tokenId].expires > block.timestamp;
    }

    function getRental(uint256 tokenId) external view returns (address renter, uint64 expires) {
        Rental memory info = rentals[tokenId];
        return (info.renter, info.expires);
    }
} 