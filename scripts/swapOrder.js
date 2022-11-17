const { ethers } = require("hardhat")

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const DAI_DECIMALS = 18

const ercAbi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",
    "function deposit() public payable",
    "function approve(address spender, uint256 amount) returns (bool)",
]

async function swapOrder() {
    let signers = await hre.ethers.getSigners()
    const WETH = new hre.ethers.Contract(WETH_ADDRESS, ercAbi, signers[0])
    const deposit = await WETH.deposit({
        value: hre.ethers.utils.parseEther("10"),
    })
    await deposit.wait()

    const orderSwapper = await ethers.getContract("OrderSwapper")

    await WETH.approve(orderSwapper.address, hre.ethers.utils.parseEther("1"))

    await orderSwapper.acceptWETH(hre.ethers.utils.parseEther("1"))
    console.log("------------------")

    const amount = await orderSwapper.getAcceptedAmount()
    console.log(amount.toString())
}

swapOrder()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
