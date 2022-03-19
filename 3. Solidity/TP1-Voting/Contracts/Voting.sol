// Voting.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "./VotingData.sol";
import "./VotingAdmin.sol";
contract Voting is VotingData,VotingAdmin{ 

    /**
     * @dev Modifier that checks if the message sender 'msg.sender' is whitelisted.
     */
    modifier onlyWhitelisted() {       
        require(whitelist[msg.sender].isRegistered == true, "You need to be whitelisted to participate !");_;
    }

    /**
     * @dev Register a proposal in the proposal array 'proposals' with a description 'description' and no votes.
     *
     * Requirements:
     * - 'currentWorkflowStatus' needs to be equal to 'WorkflowStatus.ProposalsRegistrationStarted'.
     * - 'msg.sender' needs to be whitelisted.
     *
     *  Emits a {ProposalRegistered} event with the proposal's ID.
     */
    function registerProposal(string calldata description) public RequiredWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted) onlyWhitelisted {
        proposals.push(Proposal(description,0));

        emit ProposalRegistered(proposals.length - 1);
    }

    /**
     * @dev Vote for a proposition with the ID 'proposalID'.
     *
     * Requirements:
     * - 'currentWorkflowStatus' needs to be equal to 'WorkflowStatus.VotingSessionStarted'.
     * - 'msg.sender' needs to not have voted yet.
     * - 'proposalID' needs to be != 0 and < proposals.length.
     *
     *  Emits a {Voted} event with the message sender's address and the proposal's ID.
     */
    function voteForProposition(uint proposalID) public RequiredWorkflowStatus(WorkflowStatus.VotingSessionStarted) onlyWhitelisted {
        require(whitelist[msg.sender].hasVoted == false, "You can only vote once and on only one proposal !");
        require(proposalID != 0 && proposalID < proposals.length, "This proposal doesnt Exist");

        proposals[proposalID].voteCount ++ ;
        whitelist[msg.sender].hasVoted =true;
        whitelist[msg.sender].votedProposalId=proposalID;

        emit Voted(msg.sender, proposalID);
    }

    /**
     * @dev Returns the winning proposal.
     *
     * Requirements:
     * - 'currentWorkflowStatus' needs to be equal to 'WorkflowStatus.VotesTallied'.
     */
    function getWinningProposalDetails() public view RequiredWorkflowStatus(WorkflowStatus.VotesTallied) returns(Proposal memory) {
        return proposals[winningProposalId];
    }
}
