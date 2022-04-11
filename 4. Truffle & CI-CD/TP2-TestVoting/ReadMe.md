# Alyra Test Voting

## Unit tests
35 test valides

Toutes les fonctions du contrat sont testées (100% branch coverage)

1 file: votingTest.js

### 1) Test Modifiers :
#### 1- onlyOwner()
- should not add voter, revert
#### 2- onlyVoters()
- should not get voter from map, revert
- should not store voter in map, revert

### 2) Voter :
#### 1- Required
- shouldnt register a new voter, revert
- shouldnt register a new voter, revert
#### 2- Events
- should store voter in map, get Event VoterRegistered
#### 3- getVoter()/addVoter()
- should store voter in map, get Voter.isRegistered
- should store voter in map, get Voter.hasVoted
- should store voter in map, get Voter.votedProposalId

### 3) Proposal :
#### 1- Requires
- should not store proposal in array, revert
- should not store proposal in array, revert
#### 2- Events
- should store proposal in array, emit
#### 3- addProposal()/getOneProposal()
- should store proposal in array, get Proposal.description
- should store proposal in array, get Proposal.voteCount
### 4) SetVote :
#### 1- Requires
- should not setVote in incorrect workflowStatus, revert
- should not setVote if user has already voted, revert
- should not setVote if proposal is not found, revert
#### 2- setVoter()
- should set voter proposalid and hasVoted and voteCount++, set Voter.hasVoted
- should set voter proposalid and hasVoted and voteCount++, set Voter.votedProposalId

### 5) WorkflowStatus :
#### 1- startProposalsRegistering()
##### .1- Require
- shouldnt change workflowstatus, revert
##### .2- Event
- should change workflowstatus, emit
##### .3- GetterSetter
- should change workflowstatus, get right workflowStatus
#### 2- endProposalsRegistering()
##### .1- Require
- shouldnt change workflowstatus, revert
##### .2- Event
- should change workflowstatus, emit
##### .3- GetterSetter
- should change workflowstatus, get right workflowStatus
#### 3- startVotingSession()
##### .1- Require
- shouldnt change workflowstatus, revert
##### .2- Event
- should change workflowstatus, emit
##### .3- GetterSetter
- should change workflowstatus, get right workflowStatus
#### 4- endVotingSession()
##### .1- Require
- shouldnt change workflowstatus, revert
##### .2- Event
- should change workflowstatus, emit
##### .3- GetterSetter
- should change workflowstatus, get right workflowStatus
#### 5- tallyVotes()
##### .1- Require
- shouldnt tally votes, revert
##### .2- Event
- should change workflowstatus, emit
##### .3- GetterSetter
- should change workflowstatus, get right workflowStatus
- should change workflowstatus, get right winningProposalId
