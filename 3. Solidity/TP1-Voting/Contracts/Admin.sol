// Admin.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "./VotingInfo.sol";
contract Admin is VotingInfo{ 
    function addVotersToWhitelist(address _address) public onlyOwner{
        require(_whitelist[_address].isRegistered != true, "This address is already whitelisted !");
        require(currentWorkflowStatus==WorkflowStatus.RegisteringVoters, "You can only whitelist voters during the registration session !");
        Voter memory voter = Voter(true, false, 0);
        _whitelist[_address] = voter;
        emit VoterRegistered(_address);
    }

    function beginProposalsRegistrationSession() public onlyOwner{
        require(currentWorkflowStatus==WorkflowStatus.RegisteringVoters);
        currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters,WorkflowStatus.ProposalsRegistrationStarted);
    }

    function endProposalsRegistrationSession() public onlyOwner{
        require(currentWorkflowStatus==WorkflowStatus.ProposalsRegistrationStarted);
        currentWorkflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted,WorkflowStatus.ProposalsRegistrationEnded);
    }

    function beginVotingSession() public onlyOwner{
        require(currentWorkflowStatus==WorkflowStatus.ProposalsRegistrationEnded);
        currentWorkflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded,WorkflowStatus.VotingSessionStarted);
    }

    function endVotingSession() public onlyOwner{
        require(currentWorkflowStatus==WorkflowStatus.VotingSessionStarted);
        currentWorkflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted,WorkflowStatus.VotingSessionEnded);
    }

    function beginVotesTallied() public onlyOwner{
        require(currentWorkflowStatus==WorkflowStatus.VotingSessionEnded);
        currentWorkflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded,WorkflowStatus.VotesTallied);
    }

    
}
