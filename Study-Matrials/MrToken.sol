// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import  "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MrToken is ERC20 {
    constructor() ERC20("MrToken", "MRT") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}