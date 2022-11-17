// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6 || ^0.8.7;

interface IOrderSwapper {
    function acceptWETH(uint256 amount, uint256 orderId) external;

    function performSwapForDAI(uint256 orderId) external returns (uint256 resultAmount);
}