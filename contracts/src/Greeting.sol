// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Greeting {
    // Structure to hold greeting information
    struct GreetingInfo {
        address sender;
        string message;
        uint256 timestamp;
    }

    // Array to store all greetings
    GreetingInfo[] public greetings;

    // Event emitted when a new greeting is sent
    event Greeted(address indexed sender, string message, uint256 timestamp);

    // Function to send a greeting
    function sendGreeting(string memory message) public {
        require(bytes(message).length > 0, "Message cannot be empty");
        
        greetings.push(GreetingInfo({
            sender: msg.sender,
            message: message,
            timestamp: block.timestamp
        }));
        
        emit Greeted(msg.sender, message, block.timestamp);
    }

    // Function to get all greetings
    function getGreetings() public view returns (GreetingInfo[] memory) {
        return greetings;
    }

    // Function to get the total number of greetings
    function getGreetingsCount() public view returns (uint256) {
        return greetings.length;
    }
}
