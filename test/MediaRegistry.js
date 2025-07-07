const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Unit tests for the MediaRegistry smart contract.
 */
describe("MediaRegistry", function () {
  let mediaRegistry;
  let owner;
  let addr1;
  let sampleHash;
  const sampleMetadata = "ipfs://QmExampleMetadataCid";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const MediaRegistryFactory = await ethers.getContractFactory("MediaRegistry");
    mediaRegistry = await MediaRegistryFactory.deploy();
    await mediaRegistry.waitForDeployment();

    sampleHash = ethers.encodeBytes32String("sample");
  });

  it("should register media and mint an NFT", async function () {
    const tx = await mediaRegistry.registerMedia(sampleHash, sampleMetadata);
    await tx.wait();

    const tokenId = await mediaRegistry.verifyContent(sampleHash);

    expect(await mediaRegistry.ownerOf(tokenId)).to.equal(owner.address);
    expect(await mediaRegistry.tokenURI(tokenId)).to.equal(sampleMetadata);

    const media = await mediaRegistry.getMedia(tokenId);
    expect(media.contentHash).to.equal(sampleHash);
    expect(media.metadataURI).to.equal(sampleMetadata);
  });

  it("should prevent duplicate registrations", async function () {
    await mediaRegistry.registerMedia(sampleHash, sampleMetadata);
    await expect(
      mediaRegistry.registerMedia(sampleHash, sampleMetadata)
    ).to.be.revertedWith("Already registered");
  });
}); 