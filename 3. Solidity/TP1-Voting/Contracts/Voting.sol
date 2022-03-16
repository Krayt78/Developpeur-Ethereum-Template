// Voting.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "./VotingInfo.sol";
contract Voting is VotingInfo{ 

    modifier onlyWhitelisted() {       
        require(_whitelist[msg.sender].isRegistered==true, "You need to be whitelisted to participate !");_;
    }

    function registerProposal(string calldata description) public onlyWhitelisted{
        require(currentWorkflowStatus==WorkflowStatus.ProposalsRegistrationStarted, "You can only register a proposal during the Proposals Registration Session !");
        proposals.push(Proposal(description,0));
        emit ProposalRegistered(proposals.length-1);
    }

    function voteForProposition(uint proposalID) public onlyWhitelisted{
        require(currentWorkflowStatus==WorkflowStatus.VotingSessionStarted, "You can only vote for a proposal during the Voting Session !");
        require(_whitelist[msg.sender].hasVoted == false, "You can only vote once for a proposal !");
        proposals[proposalID].voteCount++;
        _whitelist[msg.sender].hasVoted =true;
        emit Voted(msg.sender, proposalID);

    }
}
