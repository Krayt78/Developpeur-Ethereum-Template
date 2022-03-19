// VotingAdmin.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "./VotingData.sol";

/**
 * Contract responsible for all the functions usable only by the admin/owner.
 */
contract VotingAdmin is VotingData{ 
    /**
     * @dev Adds Voter's address 'voterAddress' to the whitelist.
     *
     * Requirements:
     * - 'currentWorkflowStatus' needs to be equal to 'WorkflowStatus.RegisteringVoters'.
     * - 'address' needs to not be whitelisted yet.
     *
     *  Emits a {VoterRegistered} event.
     */
    function addVoterToWhitelist(address voterAddress) public  onlyOwner RequiredWorkflowStatus(WorkflowStatus.RegisteringVoters) {
        require(whitelist[voterAddress].isRegistered != true, "This address is already whitelisted !");
        Voter memory voter = Voter(true, false, 0);
        whitelist[voterAddress] = voter;
        whitelistedAddresses.push(voterAddress);
        emit VoterRegistered(voterAddress);
    }

    /**
     * @dev Adds an array of Voters 'addresses' to the whitelist. Any Address already whitelisted will be ignored.
     *
     * Requirements:
     * - 'currentWorkflowStatus' needs to be equal to 'WorkflowStatus.RegisteringVoters'.
     * - 'address' needs to not be whitelisted.
     *
     *  Emits a {VoterRegistered} event for each address whitelisted.
     */
    function addVotersToWhitelist(address[] calldata addresses) public  onlyOwner RequiredWorkflowStatus(WorkflowStatus.RegisteringVoters) {
        for(uint i = 0; i < addresses.length; i ++){
            if(whitelist[addresses[i]].isRegistered != true){
                Voter memory voter = Voter(true, false, 0);
                whitelist[addresses[i]] = voter;
                whitelistedAddresses.push(addresses[i]);
                emit VoterRegistered(addresses[i]);
            }
        }
    }

    /**
     * @dev Counts all the votes to set the winningProposal's ID. 
     * After that changes 'currentWorkflowStatus' to 'WorkflowStatus.VotesTallied'.
     *
     * Requirements:
     * - 'currentWorkflowStatus' needs to be equal to 'WorkflowStatus.VotingSessionEnded'.
     */
    function tallyVotes() public onlyOwner RequiredWorkflowStatus(WorkflowStatus.VotingSessionEnded) {
        uint highestVoteCount =0;
        for (uint i = 0; i < proposals.length; i ++) {
            if (proposals[i].voteCount > highestVoteCount) {
              highestVoteCount = proposals[i].voteCount;
              winningProposalId = i;
            }
        }
        startVotesTallied();
    }

    /**
     * @dev Resets the entire voting contract to prepare another vote. 
     *
     * Emits a {Reset} event for each address whitelisted.
     */
    function resetVoting() public onlyOwner {
        resetWhitelist();
        resetWhitelistAddressesArray();
        resetProposals();
        resetWorkflowStatus();
        resetWinningProposalId();
        emit Reset();
    }

    /**
     * @dev Sets 'currentWorkflowStatus' to the next value in the 'WorkflowStatus' Enum. 
     *  If 'currentWorkflowStatus' is at the last status 'WorkflowStatus.VotesTallied' then it resets the vote by calling {resetVoting}.
     */
    function setWorkflowStatusToNextOne() public onlyOwner() {
        if(currentWorkflowStatus == WorkflowStatus.RegisteringVoters){
            setWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted);
        }
        else if(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationStarted){
            setWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded);
        }
        else if(currentWorkflowStatus == WorkflowStatus.ProposalsRegistrationEnded){
            setWorkflowStatus(WorkflowStatus.VotingSessionStarted);
        }
        else if(currentWorkflowStatus == WorkflowStatus.VotingSessionStarted){
            setWorkflowStatus(WorkflowStatus.VotingSessionEnded);
        }
        else if(currentWorkflowStatus == WorkflowStatus.VotingSessionEnded){
            setWorkflowStatus(WorkflowStatus.VotesTallied);
        }
        else if(currentWorkflowStatus == WorkflowStatus.VotesTallied){
            resetVoting();
        }
    }

    /**
     * @dev Sets 'currentWorkflowStatus' from 'WorkflowStatus.RegisteringVoters' to 'WorkflowStatus.ProposalsRegistrationStarted'. 
     *  Emits a {WorkflowStatusChange} event for each address whitelisted.
     */
    function startProposalsRegistrationSession() private onlyOwner RequiredWorkflowStatus(WorkflowStatus.RegisteringVoters) {
        setWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
     * @dev Sets 'currentWorkflowStatus' from 'WorkflowStatus.ProposalsRegistrationStarted' to 'WorkflowStatus.ProposalsRegistrationEnded'. 
     *  Emits a {WorkflowStatusChange} event.
     */
    function endProposalsRegistrationSession() private onlyOwner RequiredWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        setWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
     * @dev Sets 'currentWorkflowStatus' from 'WorkflowStatus.ProposalsRegistrationEnded' to 'WorkflowStatus.VotingSessionStarted'. 
     *  Emits a {WorkflowStatusChange} event.
     */
    function startVotingSession() private onlyOwner RequiredWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded) {
        setWorkflowStatus(WorkflowStatus.VotingSessionStarted);
    }

    /**
     * @dev Sets 'currentWorkflowStatus' from 'WorkflowStatus.VotingSessionStarted' to 'WorkflowStatus.VotingSessionEnded'. 
     *  Emits a {WorkflowStatusChange} event.
     */
    function endVotingSession() private onlyOwner RequiredWorkflowStatus(WorkflowStatus.VotingSessionStarted) {
        setWorkflowStatus(WorkflowStatus.VotingSessionEnded);
    }

    /**
     * @dev Sets 'currentWorkflowStatus' from 'WorkflowStatus.VotingSessionEnded' to 'WorkflowStatus.VotesTallied'. 
     *  Emits a {WorkflowStatusChange} event.
     */
    function startVotesTallied() private onlyOwner RequiredWorkflowStatus(WorkflowStatus.VotingSessionEnded) {
        setWorkflowStatus(WorkflowStatus.VotesTallied);
    }

    /**
     * @dev Sets 'currentWorkflowStatus' to 'workflowStatus'. 
     *  Emits a {WorkflowStatusChange} event.
     */
    function setWorkflowStatus(WorkflowStatus workflowStatus) private onlyOwner() {
        WorkflowStatus temp = currentWorkflowStatus;
        currentWorkflowStatus = workflowStatus;
       emit WorkflowStatusChange(temp,workflowStatus);
    }

    /**
     * @dev Resets to default from the mapping 'whitelist' all addresses in 'whitelistedAddresses'. 
     */
    function resetWhitelist() private onlyOwner {
        Voter memory defaultVoter = Voter(false,false,0);
        for(uint i = 0; i < whitelistedAddresses.length; i ++){
            whitelist[whitelistedAddresses[i]] = defaultVoter;
        }
    }

    /**
     * @dev Empties the array 'whitelistedAddresses'. 
     */
    function resetWhitelistAddressesArray() private onlyOwner {
        for(uint i = 0; i < whitelistedAddresses.length; i ++){
            whitelistedAddresses.pop();
        }
    }

    /**
     * @dev Empties the array 'proposals'. 
     */
    function resetProposals() private onlyOwner {
        for(uint i = 0; i < proposals.length; i ++){
            proposals.pop();
        }
    }

    /**
     * @dev Resets the WorkflowStatus by setting 'currentWorkflowStatus' to 'WorkflowStatus.RegisteringVoters'. 
     *  Emits a {WorkflowStatusChange} event.
     */
    function resetWorkflowStatus() private onlyOwner {
        setWorkflowStatus(WorkflowStatus.RegisteringVoters);
    }

    /**
     * @dev Resets 'winningProposalId' by setting it to 0. 
     */
    function resetWinningProposalId() private onlyOwner {
        winningProposalId = 0;
    }
}
