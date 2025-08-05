// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Greeting.sol";

contract GreetingTest is Test {
    Greeting public greeting;
    address public user1 = address(1);
    address public user2 = address(2);

    function setUp() public {
        greeting = new Greeting();
    }

    function testSendGreeting() public {
        vm.startPrank(user1);
        greeting.sendGreeting("Hello, World!");
        vm.stopPrank();

        assertEq(greeting.getGreetingsCount(), 1);

        (address sender, string memory message, uint256 timestamp) = greeting.greetings(0);
        assertEq(sender, user1);
        assertEq(message, "Hello, World!");
        assertGt(timestamp, 0);
    }

    function testGetGreetings() public {
        vm.startPrank(user1);
        greeting.sendGreeting("First greeting");
        vm.stopPrank();

        vm.startPrank(user2);
        greeting.sendGreeting("Second greeting");
        vm.stopPrank();

        Greeting.GreetingInfo[] memory greetings = greeting.getGreetings();
        assertEq(greetings.length, 2);
        assertEq(greetings[0].sender, user1);
        assertEq(greetings[0].message, "First greeting");
        assertEq(greetings[1].sender, user2);
        assertEq(greetings[1].message, "Second greeting");
    }

    function testEmptyMessageRevert() public {
        vm.startPrank(user1);
        vm.expectRevert("Message cannot be empty");
        greeting.sendGreeting("");
        vm.stopPrank();
    }

    function testEventEmission() public {
        vm.startPrank(user1);
        vm.expectEmit(true, false, false, true);
        emit Greeting.Greeted(user1, "Hello, World!", block.timestamp);
        greeting.sendGreeting("Hello, World!");
        vm.stopPrank();
    }
}
