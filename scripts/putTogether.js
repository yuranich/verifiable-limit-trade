const { ethers, network } = require("hardhat")

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

const ercAbi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",
    "function deposit() public payable",
    "function approve(address spender, uint256 amount) returns (bool)",
]

async function workWithOrders() {
    const orderAcceptor = await ethers.getContract("OrderAcceptor")
    const orderId = await orderAcceptor.acceptEthOrder(2, 1450)
    console.log("---------- " + orderId.toString())

    const orders = await orderAcceptor.getAllOrders()
    console.log(orders.toString())
    console.log("---------------------------")

    let signers = await hre.ethers.getSigners()
    const WETH = new hre.ethers.Contract(WETH_ADDRESS, ercAbi, signers[0])
    const deposit = await WETH.deposit({
        value: hre.ethers.utils.parseEther("10"),
    })
    await deposit.wait()

    const orderSwapper = await ethers.getContract("OrderSwapper")

    await WETH.approve(orderSwapper.address, hre.ethers.utils.parseEther("2"))

    await orderSwapper.acceptWETH(hre.ethers.utils.parseEther("2"), 1)
    console.log("------------------")

    const amount = await orderSwapper.getAcceptedAmount(1)
    console.log(amount.toString())
    console.log("------------------")

    const { upkeepNeeded } = await orderAcceptor.checkUpkeep([])
    console.log(upkeepNeeded)

    await network.provider.send("evm_mine", [])
    await orderAcceptor.performUpkeep([])
    console.log("-----------------")
}

workWithOrders()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
