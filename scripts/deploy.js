const hre = require("hardhat");

async function main() {
  const TreeToken = await hre.ethers.getContractFactory("TreeToken");
  const treeToken = await TreeToken.deploy();
  await treeToken.deployed();
  console.log("TreeToken deployed to:", treeToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
