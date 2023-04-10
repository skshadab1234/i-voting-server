pragma solidity ^0.8.0;

contract SimpleVoting {
    mapping (address => bool) public hasVoted;

    function vote() public {
        require(!hasVoted[msg.sender], "You have already voted.");
        hasVoted[msg.sender] = true;
        emit Vote(msg.sender);
    }

    event Vote(address indexed voter);
}
