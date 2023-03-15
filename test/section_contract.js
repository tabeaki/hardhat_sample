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

    const SectionContract = await ethers.getContractFactory("section_contract");
    const sectionContract = await SectionContract.deploy();

    return { sectionContract, owner, otherAccount };
  }

  describe("配列関数確認", function () {
    it("getStringVlaueがに0を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);

      await sectionContract.setArray();
      expect(await sectionContract.getStringVlaue(0)).to.equal("Apple");
    });

    it("getStringVlaueがに1を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);

      await sectionContract.setArray();
      expect(await sectionContract.getStringVlaue(1)).to.equal("Orange");
    });

    it("getStringVlaueがに2を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);

      await sectionContract.setArray();
      expect(await sectionContract.getStringVlaue(2)).to.equal("Pineapple");
    });

    it("addComponentで一つ追加した場合、getIntValueとreturnLengthを検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);

      await sectionContract.addComponent(1);
      expect(await sectionContract.getIntValue(0)).to.equal(1);
      expect(await sectionContract.returnLength()).to.equal(1);
    });

    it("addComponentで三つ追加した場合、getIntValueとreturnLengthを検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);

      await sectionContract.addComponent(1);
      await sectionContract.addComponent(4);
      await sectionContract.addComponent(8);
      expect(await sectionContract.getIntValue(0)).to.equal(1);
      expect(await sectionContract.getIntValue(1)).to.equal(4);
      expect(await sectionContract.getIntValue(2)).to.equal(8);
      expect(await sectionContract.returnLength()).to.equal(3);
    });

    it("addComponentで追加しない場合、getIntValueとreturnLengthを検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);

      // getIntValueを呼び出し、リバートエラーが発生することを確認する
      await expect(sectionContract.getIntValue(0)).to.be.revertedWith('arrayB is empty');
        expect(await sectionContract.returnLength()).to.equal(0);
    });
  });

  describe("struct,map,addressテスト", function () {
    it("Struct_getUserの初期値", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      const user = await sectionContract.getUser();
      expect(user.name).to.equal("test");
      expect(user.age).to.equal(3);
    });

    it("Struct_setUserにより", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      await sectionContract.setUser("田中",33);
      const user = await sectionContract.getUser();
      expect(user.name).to.equal("田中");
      expect(user.age).to.equal(33);
    });

    it("Map_readValueを検証", async function () {
      const { sectionContract,owner } = await loadFixture(deployFixture);
      const balance = await sectionContract.readValue(owner.address);
      expect(balance).to.equal(0);
    });

    it("Map_setでbalanceに100をセット", async function () {
      const { sectionContract,owner } = await loadFixture(deployFixture);
      await sectionContract.setMap(owner.address, 100);
      const balance = await sectionContract.readValue(owner.address);
      expect(balance).to.equal(100);
    });
    
    it("Map_setでbalanceに0をセット", async function () {
      const { sectionContract,owner } = await loadFixture(deployFixture);
      await sectionContract.setMap(owner.address, 0);
      const balance = await sectionContract.readValue(owner.address);
      expect(balance).to.equal(0);
    });

    it("Map_setでbalanceに100から1にセット", async function () {
      const { sectionContract,owner } = await loadFixture(deployFixture);
      await sectionContract.setMap(owner.address, 100);
      const balance_100 = await sectionContract.readValue(owner.address);
      expect(balance_100).to.equal(100);
      await sectionContract.setMap(owner.address, 1);
      const balance_1 = await sectionContract.readValue(owner.address);
      expect(balance_1).to.equal(1);
    });
  });

  describe("if文確認", function () {
    it("ifInspectionにtrueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.ifInspection(true)).to.equal(2);
    });

    it("ifInspectionにfalseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.ifInspection(false)).to.equal(1);
    });

    it("elseIfInspectionにa:trueとb:trueを渡す", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.elseIfInspection(true,true)).to.equal(3);
    });
    it("elseIfInspectionにa:trueとb:falseを渡す", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.elseIfInspection(true,false)).to.equal(2);
    });
    it("elseIfInspectionにa:falseとb:trueを渡す", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.elseIfInspection(false,true)).to.equal(1);
    });
    it("elseIfInspectionにa:falseとb:falseを渡す", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.elseIfInspection(false,false)).to.equal(1);
    });

    it("ifElseInspectionに:trueとb:trueを渡す", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.ifElseInspection(true,true)).to.equal(3);
    });
    it("ifElseInspectionにa:trueとb:falseを渡す", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.ifElseInspection(true,false)).to.equal(2);
    });
    it("ifElseInspectionにa:falseとb:trueを渡す", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.ifElseInspection(false,true)).to.equal(1);
    });
    it("ifElseInspectionにa:falseとb:falseを渡す", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.ifElseInspection(false,false)).to.equal(1);
    });
  });
  describe("while文確認", function () {
    it("whileInspectionに0を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.whileInspection(0)).to.equal(10);
    });
    it("whileInspectionに5を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.whileInspection(3)).to.equal(7);
    });
    it("whileInspectionに3を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.whileInspection(5)).to.equal(0);
    });
    it("whileInspectionに6を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.whileInspection(6)).to.equal(0);
    });

    it("whileBreakInspectionに0を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.whileBreakInspection(0)).to.equal(10);
    });
    it("whileBreakInspectionに3を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.whileBreakInspection(3)).to.equal(4);
    });
    it("whileBreakInspectionに5を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.whileBreakInspection(5)).to.equal(0);
    });
    it("whileBreakInspectionに6を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.whileBreakInspection(6)).to.equal(0);
    });

  });

  describe("for文確認", function () {
    it("forInspectionに0を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.forInspection(0)).to.equal(10);
    });
    it("forInspectionに5を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.forInspection(3)).to.equal(13);
    });

    it("forContinueInspectionに0を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.forContinueInspection(0)).to.equal(4);
    });
    it("forContinueInspectionに5を渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.forContinueInspection(3)).to.equal(7);
    });
  });

  describe("bool比較演算子確認", function () {
    it("getBool1にtrue,trueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool1(true,true)).to.equal(true);
    });
    it("getBool1にtrue,falseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool1(true,false)).to.equal(false);
    });
    it("getBool1にfalse,trueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool1(false,true)).to.equal(false);
    });
    it("getBool1にtrue,falseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool1(false,false)).to.equal(false);
    });

    it("getBool2にtrue,trueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool2(true,true)).to.equal(true);
    });
    it("getBool2にtrue,falseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool2(true,false)).to.equal(true);
    });
    it("getBool2にfalse,trueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool2(false,true)).to.equal(true);
    });
    it("getBool2にfalse,falseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool2(false,false)).to.equal(false);
    });

    it("getBool3にtrue,trueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool3(true,true)).to.equal(true);
    });
    it("getBool3にtrue,falseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool3(true,false)).to.equal(false);
    });
    it("getBool3にfalse,trueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool3(false,true)).to.equal(false);
    });
    it("getBool3にfalse,falseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool3(false,false)).to.equal(true);
    });

    it("getBool4にtrue,trueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool4(true,true)).to.equal(false);
    });
    it("getBool4にtrue,falseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool4(true,false)).to.equal(true);
    });
    it("getBool4にfalse,trueを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool4(false,true)).to.equal(true);
    });
    it("getBool4にfalse,falseを渡した場合", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getBool4(false,false)).to.equal(false);
    });
  });

  describe("算出演算子確認", function () {
    it("getNumber1を検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getNumber1(3,6)).to.equal(9);
    });

    // it("getNumber2を検証", async function () {
    //   const { sectionContract } = await loadFixture(deployFixture);
    //   expect(await sectionContract.getNumber2(3,6)).to.equal(-3);
    // });
    it("getNumber2を検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getNumber2(6,3)).to.equal(3);
    });

    it("getNumber3を検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getNumber3(4,4)).to.equal(16);
    });

    it("getNumber4を検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getNumber4(9,3)).to.equal(3);
    });

    it("getNumber5を検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getNumber5(1,3)).to.equal(1);
    });

    it("getNumber6を検証", async function () {
      const { sectionContract } = await loadFixture(deployFixture);
      expect(await sectionContract.getNumber6(2,2)).to.equal(4);
    });
  });
});
