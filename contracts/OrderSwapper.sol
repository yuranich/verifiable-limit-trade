// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "contracts/IOrderSwapper.sol";
import "hardhat/console.sol";

contract OrderSwapper is IOrderSwapper {

    ISwapRouter public immutable swapRouter;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    uint24 public constant feeTier = 3000;
    mapping(uint256 => uint256) internal acceptedAmount;

    constructor( ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function acceptWETH(uint256 amount, uint256 orderId) external override {
                // Transfer the specified amount of WETH9 to this contract.
        TransferHelper.safeTransferFrom(
            WETH9,
            msg.sender,
            address(this),
            amount
        );

        // Approve the router to spend WETH9.
        TransferHelper.safeApprove(WETH9, address(swapRouter), amount);

        acceptedAmount[orderId] = amount;
    }

    function performSwapForDAI(uint256 orderId) external override returns (uint256 resultAmount) {
                ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: DAI,
                fee: feeTier,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: acceptedAmount[orderId],
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        // The call to `exactInputSingle` executes the swap.
        resultAmount = swapRouter.exactInputSingle(params);
        console.log("swapped to the following amount of DAI:");
        console.log(resultAmount);
        return resultAmount;
    }

    function getAcceptedAmount(uint256 orderId) public view returns (uint256) {
        return acceptedAmount[orderId];
    }
}