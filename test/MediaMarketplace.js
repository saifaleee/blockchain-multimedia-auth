const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MediaMarketplace", function () {
  let registry;
  let marketplace;
  let owner;
  let seller;
  let buyer;
  let tokenId;
  const price = ethers.parseEther("1");
  const secondaryPrice = ethers.parseEther("2");
  const sampleMetadata = "ipfs://QmExampleMetadataCid";

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy registry and mint token
    const RegistryFactory = await ethers.getContractFactory("MediaRegistry");
    registry = await RegistryFactory.deploy();
    await registry.waitForDeployment();

    const sampleHash = ethers.encodeBytes32String("sample");

    const tx = await registry.connect(seller).registerMedia(sampleHash, sampleMetadata);
    await tx.wait();

    tokenId = await registry.verifyContent(sampleHash);

    // Deploy marketplace
    const MarketplaceFactory = await ethers.getContractFactory("MediaMarketplace");
    marketplace = await MarketplaceFactory.deploy(registry.getAddress());
    await marketplace.waitForDeployment();

    // Seller approves marketplace to transfer token
    await registry.connect(seller).approve(await marketplace.getAddress(), tokenId);
  });

  it("should allow listing and purchase of a token", async function () {
    // Seller lists token
    await marketplace.connect(seller).listToken(tokenId, price);
    expect(await marketplace.getPrice(tokenId)).to.equal(price);

    // Buyer purchases token
    await expect(
      marketplace.connect(buyer).purchase(tokenId, { value: price })
    ).to.changeEtherBalances(
      [buyer, seller, owner],
      [price * -1n, (price * 95n) / 100n, (price * 5n) / 100n]
    );

    // Ownership transferred
    expect(await registry.ownerOf(tokenId)).to.equal(buyer.address);

    // Listing cleared
    expect(await marketplace.getPrice(tokenId)).to.equal(0);
  });

  it("should prevent purchase with insufficient payment", async function () {
    await marketplace.connect(seller).listToken(tokenId, price);
    await expect(
      marketplace.connect(buyer).purchase(tokenId, { value: price - 1n })
    ).to.be.revertedWith("Insufficient payment");
  });

  it("should pay royalties to creator on secondary sale", async function () {
    // Initial sale seller -> buyer
    await marketplace.connect(seller).listToken(tokenId, price);
    await marketplace.connect(buyer).purchase(tokenId, { value: price });

    // Buyer approves marketplace and re-lists
    await registry.connect(buyer).approve(await marketplace.getAddress(), tokenId);
    await marketplace.connect(buyer).listToken(tokenId, secondaryPrice);

    // Track balances
    const royaltyReceiver = owner; // default royalty recipient is contract deployer (owner)

    await expect(
      marketplace.connect(seller).purchase(tokenId, { value: secondaryPrice })
    ).to.changeEtherBalances(
      [seller, buyer, royaltyReceiver],
      [secondaryPrice * -1n, (secondaryPrice * 95n) / 100n, (secondaryPrice * 5n) / 100n]
    );
  });
}); 