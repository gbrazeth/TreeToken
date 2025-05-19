const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreeToken", function () {
  let TreeToken, treeToken, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    TreeToken = await ethers.getContractFactory("TreeToken");
    treeToken = await TreeToken.deploy();
    await treeToken.deployed();
  });

  it("Should have correct name, symbol, and decimals", async function () {
    expect(await treeToken.name()).to.equal("TreeToken");
    expect(await treeToken.symbol()).to.equal("TREE");
    expect(await treeToken.decimals()).to.equal(18);
  });

  it("Should mint initial supply to owner", async function () {
    const totalSupply = await treeToken.totalSupply();
    expect(await treeToken.balanceOf(owner.address)).to.equal(totalSupply);
    expect(totalSupply).to.equal(ethers.utils.parseEther("1000000"));
  });

  it("Should burn tokens from sender", async function () {
    const burnAmount = ethers.utils.parseEther("1000");
    await treeToken.burn(burnAmount);
    expect(await treeToken.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("999000")
    );
  });

  it("Should airdrop tokens to multiple addresses", async function () {
    const airdropAmount = ethers.utils.parseEther("10");
    await treeToken.airdrop([addr1.address, addr2.address], airdropAmount);
    expect(await treeToken.balanceOf(addr1.address)).to.equal(airdropAmount);
    expect(await treeToken.balanceOf(addr2.address)).to.equal(airdropAmount);
    // Owner balance should decrease
    expect(await treeToken.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("999980")
    );
  });

  it("Should only allow owner to airdrop", async function () {
    const airdropAmount = ethers.utils.parseEther("1");
    await expect(
      treeToken.connect(addr1).airdrop([addr2.address], airdropAmount)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
