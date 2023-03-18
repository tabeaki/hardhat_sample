const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("sample", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
      // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TokenMasksLabsContract = await ethers.getContractFactory("TokenMasksLabs");
    const contract = await TokenMasksLabsContract.deploy();

    return { contract, owner, otherAccount };
    }
});

describe("配列関数確認", function () {
    it("getStringVlaueがに0を渡した場合", async function () {
        const { sectionContract } = await loadFixture(deployFixture);
        await sectionContract.setArray();
        expect(await sectionContract.getStringVlaue(0)).to.equal("Apple");
    });
});
