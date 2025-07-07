const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // MediaRegistry (ERC721)
  const MediaRegistry = await hre.ethers.getContractFactory("MediaRegistry");
  const registry = await MediaRegistry.deploy();
  await registry.waitForDeployment();
  console.log("MediaRegistry deployed to:", await registry.getAddress());

  // MediaEditionRegistry (ERC1155)
  const EditionFactory = await hre.ethers.getContractFactory("MediaEditionRegistry");
  const edition = await EditionFactory.deploy();
  await edition.waitForDeployment();
  console.log("MediaEditionRegistry deployed to:", await edition.getAddress());

  // Marketplace
  const Marketplace = await hre.ethers.getContractFactory("MediaMarketplace");
  const marketplace = await Marketplace.deploy(await registry.getAddress());
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());

  // Rental
  const Rental = await hre.ethers.getContractFactory("MediaRental");
  const rental = await Rental.deploy(await registry.getAddress());
  await rental.waitForDeployment();
  console.log("Rental deployed to:", await rental.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 