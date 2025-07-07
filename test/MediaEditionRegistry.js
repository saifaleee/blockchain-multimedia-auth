const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MediaEditionRegistry", function () {
  let registry;
  let owner;
  let addr1;
  const metadata = "ipfs://edition";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("MediaEditionRegistry");
    registry = await Factory.deploy();
    await registry.waitForDeployment();
  });

  it("should register edition and mint copies", async function () {
    const hash = ethers.encodeBytes32String("edition");
    const amount = 10;
    const tx = await registry.registerEdition(hash, metadata, amount);
    const receipt = await tx.wait();
    const event = receipt.logs.find((l) => l.fragment && l.fragment.name === "EditionRegistered");
    const tokenId = await registry.verifyContent(hash);
    expect(tokenId).to.not.equal(0);
    expect(await registry.balanceOf(owner.address, tokenId)).to.equal(amount);
    const edition = await registry.getEdition(tokenId);
    expect(edition.contentHash).to.equal(hash);
    expect(edition.metadataURI).to.equal(metadata);
  });

  it("should prevent duplicate registration", async function () {
    const hash = ethers.encodeBytes32String("dup");
    await registry.registerEdition(hash, metadata, 5);
    await expect(registry.registerEdition(hash, metadata, 3)).to.be.revertedWith("Already registered");
  });
}); 