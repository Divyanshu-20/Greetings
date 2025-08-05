// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Greeting.sol";

contract DeployGreeting is Script {
    function run() external {
        vm.startBroadcast();
        
        Greeting greeting = new Greeting();
        
        vm.stopBroadcast();
        
        console.log("Greeting contract deployed at:", address(greeting));
    }
}
