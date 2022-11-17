const { network, ethers } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")

const FUND_AMOUNT = ethers.utils.parseEther("1") // 1 Ether, or 1e18 (10^18) Wei

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    console.log(`deploying for chain with id: ${chainId}`)
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")

    const swapper = await ethers.getContract("OrderSwapper", deployer)
    const priceFeedAddress = "0x773616E4d11A78F511299002da57A0a94577F1f4"
    const arguments = [
        networkConfig[chainId]["automationUpdateInterval"],
        priceFeedAddress,
        swapper.address,
    ]
    const acceptor = await deploy("OrderAcceptor", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "acceptor"]
