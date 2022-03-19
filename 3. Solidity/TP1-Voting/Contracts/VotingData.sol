// VotingData.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
contract VotingData is Ownable{ 

    WorkflowStatus public currentWorkflowStatus;
    mapping (address => Voter) public whitelist;
    address[] public whitelistedAddresses;
    Proposal[] public proposals;
    uint internal winningProposalId;
     
    /**
     * @dev Modifier that checks that the WorkflowStatus 'currentWorkflowStatus'is equal to 'status'
     */
    modifier RequiredWorkflowStatus(WorkflowStatus status) {       
        require(currentWorkflowStatus == status, "You are not in the right state");_;
    }    

    /**
     * @dev Emitted when 'voterAddress' address is registered in the whitelist by the admin.
     */
    event VoterRegistered(address voterAddress); 

    /**
     * @dev Emitted when 'currentWorkflowStatus' is set from 'previousStatus' to 'newStatus'.
     */
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

     /**
     * @dev Emitted when proposal 'proposalId' is registered in the proposal array 'proposals'.
     */
    event ProposalRegistered(uint proposalId);

    /**
     * @dev Emitted when voter 'voter' voted for a proposal 'proposalId'.
     */
    event Voted (address voter, uint proposalId);

    /**
     * @dev Emitted when the admin resets the vote contract with {resetVoting} 
     * or via {setWorkflowStatusToNextOne} when 'currentWorkflowStatus' is 'WorkflowStatus.VotesTallied'.
     */
    event Reset ();

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
}
