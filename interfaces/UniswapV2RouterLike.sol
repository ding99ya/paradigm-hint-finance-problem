// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;

interface UniswapV2RouterLike {
    function swapExactETHForTokens(
		uint amountOutMin, address[] memory path, address to, uint deadline
	) external payable;
}
