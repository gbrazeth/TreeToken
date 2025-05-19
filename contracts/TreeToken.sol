// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreeToken is ERC20, Ownable {
    uint256 private constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    constructor() ERC20("TreeToken", "TREE") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function airdrop(address[] memory recipients, uint256 amount) public onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amount);
        }
    }
}
