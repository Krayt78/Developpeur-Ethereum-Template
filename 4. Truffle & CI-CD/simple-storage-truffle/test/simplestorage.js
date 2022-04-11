const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('SimpleStorage2', accounts => {
    const owner = accounts[0];
    let simpleStorageInstance;

    describe("test complet", function () {

        beforeEach(async function () {
            simpleStorageInstance = await SimpleStorage.new({from:owner});
        });

        it("...should store the value 89.", async () => {
            await simpleStorageInstance.set(89, { from: owner });
            const storedData = await simpleStorageInstance.get.call();
            expect(new BN(storedData)).to.be.bignumber.equal(new BN(89));
        });

        it("should revert on value 0", async () => {
            await expectRevert(simpleStorageInstance.set(new BN(0), {from:owner}), 'vous ne pouvez pas mettre une valeur nulle');
        });

        it("should emit event on set", async () => {
            expectEvent(await simpleStorageInstance.set(new BN(12), { from: owner }), "dataStored" ,{_data: new BN(12), _addr: owner})
        });
    });

});