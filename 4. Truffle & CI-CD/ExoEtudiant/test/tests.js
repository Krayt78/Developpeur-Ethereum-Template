// erc20.test.js 
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Etudiant = artifacts.require("./Etudiant.sol");
contract('Etudiant', function (accounts) {
    const owner = accounts[0];
    let etudiantInstance;
    const testName = "Daniel";
    const testNote = 15;

    describe("test complet", function () {

        beforeEach(async function () {
            etudiantInstance = await Etudiant.new({from:owner});
        });

        it("getArray : should get the value Daniel,15.", async () => {
            await etudiantInstance.set(owner,testName,testNote, { from: owner });

            const returnedData = await etudiantInstance.getArray.call(testName);

            expect(new BN(returnedData[1])).to.be.bignumber.equal(new BN(testNote));
            expect(testName).to.equal(returnedData[0]);

        });

        it("getMap : should get the value Daniel,15.", async () => {
            await etudiantInstance.set(owner,testName,testNote, { from: owner });

            const returnedData = await etudiantInstance.getMap.call(owner);

            expect(new BN(returnedData[1])).to.be.bignumber.equal(new BN(testNote));
            expect(testName).to.equal(returnedData[0]);

        });

        it("set : should store the value Daniel,15.", async () => {
            await etudiantInstance.set(owner,testName,testNote, { from: owner });

            const returnedArrayData = await etudiantInstance.getArray.call(testName);
            const returnedMapData = await etudiantInstance.getMap.call(owner);

            expect(new BN(returnedArrayData[1])).to.be.bignumber.equal(new BN(testNote));
            expect(testName).to.equal(returnedArrayData[0]);
            expect(new BN(returnedMapData[1])).to.be.bignumber.equal(new BN(testNote));
            expect(testName).to.equal(returnedMapData[0]);

        });

        it("deleter : should delete the value Daniel,15.", async () => {
            await etudiantInstance.set(owner,testName,testNote, { from: owner });
            await etudiantInstance.deleter(owner,{ from: owner });
            const returnedArrayData = await etudiantInstance.getArray.call(testName);
            const returnedMapData = await etudiantInstance.getMap.call(owner);

            expect(new BN(returnedArrayData[1])).to.be.bignumber.equal(new BN(0));
            expect("").to.equal(returnedArrayData[0]);
            
            expect(new BN(returnedMapData[1])).to.be.bignumber.equal(new BN(0));
            expect("").to.equal(returnedMapData[0]);

        });
    });
});
