const fs = require('fs');
const path = require('path');
const { ethers, network } = require('hardhat');

async function main() {
  const factory = await ethers.getContractFactory('ShipmentTracker');
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('Deployed to:', address);

  if (network.name === 'localhost' || network.name === 'hardhat') {
    const outPath = path.join(__dirname, '../../backend/abi/deployed.json');
    fs.writeFileSync(outPath, JSON.stringify({ address, network: network.name }, null, 2));
    console.log('Saved address to backend/abi/deployed.json');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });