const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('Voting', accounts => {
    const owner = accounts[0];

    const first = accounts[1];
    const second = accounts[2];
    const third = accounts[3];

    const RegisteringVoters = 0;
    const ProposalsRegistrationStarted = 1;
    const ProposalsRegistrationEnded = 2;
    const VotingSessionStarted = 3;
    const VotingSessionEnded = 4;
    const VotesTallied = 5;

    let VotingInstance;

    describe("Test Modifiers :", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
        });

        describe("1- onlyOwner()", function () {
            it("should not add voter, revert", async () => {
                await expectRevert(VotingInstance.addVoter(first, { from: third }),"Ownable: caller is not the owner");
            });
        });

        describe("2- onlyVoters()", function () {
            it("should not get voter from map, revert", async () => {
                await VotingInstance.addVoter(first, { from: owner });
                await expectRevert(VotingInstance.getVoter(first, { from: owner }),'You\'re not a voter');
            });
    
            it("should not store voter in map, revert", async () => {
                await expectRevert.unspecified(VotingInstance.addVoter(first, { from: first }));
            });
        });
    });

    describe("Voter :", function () {

        let storedData;

        beforeEach(async function() {
            VotingInstance = await Voting.new({from:owner});
        });

        describe("1- Required", function () {
            it("shouldnt register a new voter, revert", async () => {
                workflowStatusChangeFrunction = await VotingInstance.startProposalsRegistering({from:owner});
                await expectRevert(VotingInstance.addVoter(owner,{from:owner}), 'Voters registration is not open yet');
            });

            it("shouldnt register a new voter, revert", async () => {
                await VotingInstance.addVoter(owner, { from: owner });
                await expectRevert(VotingInstance.addVoter(owner,{from:owner}), 'Already registered');
            });
        });

        describe("2- Events", function () {
            it("should store voter in map, get Event VoterRegistered", async () => {
                const beforeFunction = await VotingInstance.addVoter(owner, { from: owner });
                expectEvent(beforeFunction,"VoterRegistered" ,{voterAddress: owner});
            });
        });

        describe("3- getVoter()/addVoter()", function () {
            beforeEach(async function () {
                await VotingInstance.addVoter(owner, { from: owner });
                storedData = await VotingInstance.getVoter(owner, { from: owner });
            });
    
            it("should store voter in map, get Voter.isRegistered", async () => {
                expect(storedData[0]).to.equal(true);
            });
    
            it("should store voter in map, get Voter.hasVoted", async () => {
                expect(storedData[1]).to.equal(false);
            });
    
            it("should store voter in map, get Voter.votedProposalId", async () => {
                expect(new BN(storedData[2])).to.be.bignumber.equal(new BN(0));
            });
        });

    });

    describe("Proposal :", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});
            await VotingInstance.addVoter(owner, { from: owner });
            const storedData = await VotingInstance.getVoter(owner, { from: owner });
            expect(storedData[0]).to.equal(true);
            expect(storedData[1]).to.equal(false);
            expect(new BN(storedData[2])).to.be.bignumber.equal(new BN(0));
        });

        describe("1- Requires", function () {
            it("should not store proposal in array, revert", async () => {
                await expectRevert(VotingInstance.addProposal("myProposal", { from: owner }),'Proposals are not allowed yet');
            });
    
            it("should not store proposal in array, revert", async () => {
                await VotingInstance.startProposalsRegistering({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationStarted));
                
                await expectRevert(VotingInstance.addProposal("", { from: owner }),'Vous ne pouvez pas ne rien proposer');
            });
        });

        describe("2- Events", function () {
            beforeEach(async function () {
                await VotingInstance.startProposalsRegistering({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationStarted));
            });

            it("should store proposal in array, emit", async () => {
                const proposal = await VotingInstance.addProposal("MyProposal", { from: owner });
                expectEvent(proposal,"ProposalRegistered" , {proposalId: new BN(0)});
            });
        });


        describe("3- addProposal()/getOneProposal()", function () {

            let proposal;

            beforeEach(async function () {
                await VotingInstance.startProposalsRegistering({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationStarted));
                await VotingInstance.addProposal("MyProposal", { from: owner });
                proposal = await VotingInstance.getOneProposal(0,{from:owner});
            });

            it("should store proposal in array, get Proposal.description", async () => {
                expect(proposal[0]).to.be.equal("MyProposal")
            });
    
            it("should store proposal in array, get Proposal.voteCount", async () => {
                expect(new BN(proposal[1])).to.be.bignumber.equal(new BN(0));
            });
        });
    });

    describe("SetVote :", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});

            await VotingInstance.addVoter(owner, { from: owner });
            const storedData = await VotingInstance.getVoter(owner, { from: owner });
            expect(storedData[0]).to.equal(true);
            expect(storedData[1]).to.equal(false);
            expect(new BN(storedData[2])).to.be.bignumber.equal(new BN(0));

            await VotingInstance.startProposalsRegistering({ from: owner });
            expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationStarted));

            await VotingInstance.addProposal("MyProposal", { from: owner });
            const proposal = await VotingInstance.getOneProposal(0,{from:owner});
            expect(proposal[0]).to.be.equal("MyProposal")
            expect(new BN(proposal[1])).to.be.bignumber.equal(new BN(0));

        });

        describe("1- Requires :", function () {
            it("should not setVote in incorrect workflowStatus, revert", async () => {
                await expectRevert(VotingInstance.setVote(0, { from: owner }),'Voting session havent started yet');
            });
    
            it("should not setVote if user has already voted, revert", async () => {
                await VotingInstance.endProposalsRegistering({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationEnded));
    
                await VotingInstance.startVotingSession({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionStarted));
    
                await VotingInstance.setVote(0, { from: owner });
                const proposal = await VotingInstance.getOneProposal(0,{from:owner});
                expect(proposal[0]).to.be.equal("MyProposal")
                expect(new BN(proposal[1])).to.be.bignumber.equal(new BN(1));
    
                await expectRevert(VotingInstance.setVote(0, { from: owner }),'You have already voted');
            });
    
            it("should not setVote if proposal is not found, revert", async () => {
                await VotingInstance.endProposalsRegistering({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationEnded));
    
                await VotingInstance.startVotingSession({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionStarted));
    
                await expectRevert(VotingInstance.setVote(1, { from: owner }), 'Proposal not found');
            });
        });

        describe("2- setVoter()", function () {
            let tempVoter;
            beforeEach(async function () {
                await VotingInstance.addProposal("MyOtherProposal", { from: owner });
                const otherProposal = await VotingInstance.getOneProposal(1,{from:owner});
                expect(otherProposal[0]).to.be.equal("MyOtherProposal")
    
                await VotingInstance.endProposalsRegistering({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationEnded));
    
                await VotingInstance.startVotingSession({ from: owner });
                expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionStarted));

                await VotingInstance.setVote(1,{from:owner});
                tempvoter = await VotingInstance.getVoter(owner,{from:owner});
    
            });
    
            it("should set voter proposalid and hasVoted and voteCount++, set Voter.hasVoted", async () => {
                expect(tempvoter[1]).to.be.equal(true);
            });
    
            it("should set voter proposalid and hasVoted and voteCount++, set Voter.votedProposalId", async () => {
                expect(new BN(tempvoter[2])).to.be.bignumber.equal(new BN(1));
            });
        });

        
        
    });

    describe("WorkflowStatus :", function () {

        let workflowStatusChangeFrunction;

        describe("1- startProposalsRegistering()", function () {
            beforeEach(async function () {
                VotingInstance = await Voting.new({from:owner});
                workflowStatusChangeFrunction = await VotingInstance.startProposalsRegistering({from:owner});
            });

            describe(".1- Require", function () {
                it("shouldnt change workflowstatus, revert", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationStarted));
                    await expectRevert(VotingInstance.startProposalsRegistering({from:owner}), 'Registering proposals cant be started now');
                });
            });

            describe(".2- Event", function () {
                it("should change workflowstatus, emit", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationStarted));
                    expectEvent(workflowStatusChangeFrunction,"WorkflowStatusChange" ,{previousStatus: new BN(RegisteringVoters), newStatus: new BN(ProposalsRegistrationStarted)});
                });
            });

            describe(".3- GetterSetter", function () {
                it("should change workflowstatus, get right workflowStatus", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationStarted));
                });
            });
        });

        describe("2- endProposalsRegistering()", function () {
            beforeEach(async function () {
                VotingInstance = await Voting.new({from:owner});
                await VotingInstance.startProposalsRegistering({from:owner});
                workflowStatusChangeFrunction = await VotingInstance.endProposalsRegistering({from:owner});
            });

            describe(".1- Require", function () {
                it("shouldnt change workflowstatus, revert", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationEnded));
                    await expectRevert(VotingInstance.endProposalsRegistering({from:owner}), 'Registering proposals havent started yet');
                });
            });

            describe(".2- Event", function () {
                it("should change workflowstatus, emit", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationEnded));
                    expectEvent(workflowStatusChangeFrunction,"WorkflowStatusChange" ,{previousStatus: new BN(ProposalsRegistrationStarted), newStatus: new BN(ProposalsRegistrationEnded)});
                });
            });

            describe(".3- GetterSetter", function () {
                it("should change workflowstatus, get right workflowStatus", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(ProposalsRegistrationEnded));
                });
            });
        });

        describe("3- startVotingSession()", function () {
            beforeEach(async function () {
                VotingInstance = await Voting.new({from:owner});
                await VotingInstance.startProposalsRegistering({from:owner});
                await VotingInstance.endProposalsRegistering({from:owner});
                workflowStatusChangeFrunction = await VotingInstance.startVotingSession({from:owner});
            });

            describe(".1- Require", function () {
                it("shouldnt change workflowstatus, revert", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionStarted));
                    await expectRevert(VotingInstance.startVotingSession({from:owner}), 'Registering proposals phase is not finished');
                });
            });

            describe(".2- Event", function () {
                it("should change workflowstatus, emit", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionStarted));
                    expectEvent(workflowStatusChangeFrunction,"WorkflowStatusChange" ,{previousStatus: new BN(ProposalsRegistrationEnded), newStatus: new BN(VotingSessionStarted)});
                });
            });

            describe(".3- GetterSetter", function () {
                it("should change workflowstatus, get right workflowStatus", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionStarted));
                });
            });
        });

        describe("4- endVotingSession()", function () {
            beforeEach(async function () {
                VotingInstance = await Voting.new({from:owner});
                await VotingInstance.startProposalsRegistering({from:owner});
                await VotingInstance.endProposalsRegistering({from:owner});
                await VotingInstance.startVotingSession({from:owner});
                workflowStatusChangeFrunction = await VotingInstance.endVotingSession({from:owner});
            });

            describe(".1- Require", function () {
                it("shouldnt change workflowstatus, revert", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionEnded));
                    await expectRevert(VotingInstance.endVotingSession({from:owner}), 'Voting session havent started yet');
                });
            });

            describe(".2- Event", function () {
                it("should change workflowstatus, emit", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionEnded));
                    expectEvent(workflowStatusChangeFrunction,"WorkflowStatusChange" ,{previousStatus: new BN(VotingSessionStarted), newStatus: new BN(VotingSessionEnded)});
                });
            });

            describe(".3- GetterSetter", function () {
                it("should change workflowstatus, get right workflowStatus", async () => {
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionEnded));
                });
            });
        });

        describe("5- tallyVotes()", function () {
            beforeEach(async function () {
                VotingInstance = await Voting.new({from:owner});

                await VotingInstance.addVoter(owner,{from:owner});
                await VotingInstance.addVoter(first,{from:owner});
                await VotingInstance.addVoter(second,{from:owner});
                await VotingInstance.addVoter(third,{from:owner});

                await VotingInstance.startProposalsRegistering({from:owner});

                await VotingInstance.addProposal("MyFirstProposal",{from:owner});
                await VotingInstance.addProposal("MySecondProposal",{from:owner});

                await VotingInstance.endProposalsRegistering({from:owner});
                await VotingInstance.startVotingSession({from:owner});

                await VotingInstance.setVote(1,{from:owner});
                await VotingInstance.setVote(1,{from:first});
                await VotingInstance.setVote(1,{from:second});
                await VotingInstance.setVote(1,{from:third});               
            });

            describe(".1- Require", function () {
                it("shouldnt tally votes, revert", async () => {
                    await expectRevert(VotingInstance.tallyVotes({from:owner}), 'Current status is not voting session ended');
                });
            });

            describe(".2- Event", function () {
                it("should change workflowstatus, emit", async () => {
                    await VotingInstance.endVotingSession({from:owner});
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionEnded));
                    const tallyVote = await VotingInstance.tallyVotes({from: owner});
                    expectEvent(tallyVote,"WorkflowStatusChange" ,{previousStatus: new BN(VotingSessionEnded), newStatus: new BN(VotesTallied)});
                });
            });

            describe(".3- GetterSetter", function () {
                it("should change workflowstatus, get right workflowStatus", async () => {
                    await VotingInstance.endVotingSession({from:owner});
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionEnded));
                    await VotingInstance.tallyVotes({from: owner});
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotesTallied));
                });
    
                it("should change workflowstatus, get right winningProposalId", async () => {
                    await VotingInstance.endVotingSession({from:owner});
                    expect(new BN(await VotingInstance.workflowStatus({from: owner}))).to.be.bignumber.equal(new BN(VotingSessionEnded));
                    await VotingInstance.tallyVotes({from: owner});
                    expect(new BN(await VotingInstance.winningProposalID.call({from: owner}))).to.be.bignumber.equal(new BN(1));
                });
            });
        });

    });
});