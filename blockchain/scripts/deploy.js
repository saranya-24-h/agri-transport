   const { ethers } = require('hardhat');

   async function main() {
     const factory = await ethers.getContractFactory('ShipmentTracker');
     const contract = await factory.deploy();
     await contract.waitForDeployment();
     console.log('Deployed to:', await contract.getAddress());
   }

   main().catch((e) => { console.error(e); process.exit(1); });