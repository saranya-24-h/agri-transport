const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const artifact = require('../abi/ShipmentTracker.json');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const DEPLOYED_PATH = path.join(__dirname, '../abi/deployed.json');

const getContract = () => {
  let address = process.env.CONTRACT_ADDRESS;
  const rpc = process.env.RPC_URL || '';
  const isLocal = rpc.includes('127.0.0.1') || rpc.includes('localhost');
  if (isLocal && fs.existsSync(DEPLOYED_PATH)) {
    const saved = JSON.parse(fs.readFileSync(DEPLOYED_PATH, 'utf8'));
    if (saved.address) address = saved.address;
  }
  return new ethers.Contract(address, artifact.abi, wallet);
};

const STATUS = { Created: 0, Accepted: 1, PickedUp: 2, Delivered: 3 };
const NAMES = ['Created', 'Accepted', 'PickedUp', 'Delivered'];

exports.recordEvent = async (shipmentId, status, actorId, note = '') => {
  const contract = getContract();
  const tx = await contract.recordEvent(String(shipmentId), STATUS[status], String(actorId), note);
  const receipt = await tx.wait();
  return receipt.hash;
};

exports.getHistory = async (shipmentId) => {
  const contract = getContract();
  const events = await contract.getHistory(String(shipmentId));
  return events.map((e) => ({
    status: NAMES[Number(e.status)],
    actorId: e.actorId,
    timestamp: new Date(Number(e.timestamp) * 1000).toISOString(),
    note: e.note
  }));
};