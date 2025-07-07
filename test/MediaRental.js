const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MediaRental", function () {
  let registry;
  let rental;
  let owner;
  let lender;
  let renter;
  let tokenId;
  const sampleMetadata = "ipfs://meta";
  const duration = 3600n; // 1 hour

  beforeEach(async function () {
    [owner, lender, renter] = await ethers.getSigners();

    // Deploy registry and mint token to lender
    const RegistryFactory = await ethers.getContractFactory("MediaRegistry");
    registry = await RegistryFactory.deploy();
    await registry.waitForDeployment();

    const sampleHash = ethers.encodeBytes32String("sample");
    await (await registry.connect(lender).registerMedia(sampleHash, sampleMetadata)).wait();
    tokenId = await registry.verifyContent(sampleHash);

    // Deploy rental contract
    const RentalFactory = await ethers.getContractFactory("MediaRental");
    rental = await RentalFactory.deploy(registry.getAddress());
    await rental.waitForDeployment();
  });

  it("should allow owner to rent out and renter to return", async function () {
    await rental.connect(lender).rentOut(tokenId, renter.address, Number(duration));

    expect(await rental.isRented(tokenId)).to.equal(true);

    // Renter returns early
    await rental.connect(renter).returnToken(tokenId);
    expect(await rental.isRented(tokenId)).to.equal(false);
  });

  it("should not allow double renting", async function () {
    await rental.connect(lender).rentOut(tokenId, renter.address, Number(duration));
    await expect(
      rental.connect(lender).rentOut(tokenId, renter.address, Number(duration))
    ).to.be.revertedWith("Already rented");
  });

  it("owner can reclaim after expiry", async function () {
    await rental.connect(lender).rentOut(tokenId, renter.address, Number(duration));

    // Fast-forward time past expiry
    await ethers.provider.send("evm_increaseTime", [Number(duration) + 1]);
    await ethers.provider.send("evm_mine", []);

    await rental.connect(lender).reclaim(tokenId);
    expect(await rental.isRented(tokenId)).to.equal(false);
  });
}); 