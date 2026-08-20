/**
 * AgriTraceLink Solidity Smart Contract Deployment Script
 */
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AgriTraceLink Solidity Smart Contract...");

  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);

  const AgriTraceLink = await ethers.getContractFactory("AgriTraceLink");
  const agriTraceLink = await AgriTraceLink.deploy(deployer.address);

  await agriTraceLink.waitForDeployment();
  const contractAddress = await agriTraceLink.getAddress();

  console.log("✅ AgriTraceLink Deployed Successfully!");
  console.log("📦 Contract Address:", contractAddress);
  console.log("👑 Default Admin & All Roles Granted to:", deployer.address);
}

main().catch((error) => {
  console.error("❌ Deployment Error:", error);
  process.exitCode = 1;
});
