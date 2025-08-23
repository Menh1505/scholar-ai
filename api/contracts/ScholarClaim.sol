// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ScholarPoint.sol";

contract ScholarPointClaimer {
    ScholarPoint public immutable token;
    constructor(ScholarPoint _token) { token = _token; }

    function claim(uint256 amount) external {
        token.mint(msg.sender, amount);
    }
}
