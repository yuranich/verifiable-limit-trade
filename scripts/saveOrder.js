const { ethers, network } = require("hardhat")

async function saveOrder() {
    const orderAcceptor = await ethers.getContract("OrderAcceptor")
    const res = await orderAcceptor.acceptEthOrder(15000000, 1450)
    console.log("---------- " + res.toString())

    const orders = await orderAcceptor.getAllOrders()
    console.log(orders.toString())
    console.log("---------------------------")

    const { upkeepNeeded } = await orderAcceptor.checkUpkeep([])
    console.log(upkeepNeeded)

    await network.provider.send("evm_mine", [])
    await orderAcceptor.performUpkeep([])
    console.log("-----------------")
}

saveOrder()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
