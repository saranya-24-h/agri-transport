const { ethers } = require('ethers');
const artifact = require('../abi/ShipmentTracker.json');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, artifact.abi, wallet);

const STATUS = { Created: 0, Accepted: 1, PickedUp: 2, Delivered: 3 };
const NAMES = ['Created', 'Accepted', 'PickedUp', 'Delivered'];

exports.recordEvent = async (shipmentId, status, actorId, note = '') => {
  const tx = await contract.recordEvent(String(shipmentId), STATUS[status], String(actorId), note);
  const receipt = await tx.wait();
  return receipt.hash;
};

exports.getHistory = async (shipmentId) => {
  const events = await contract.getHistory(String(shipmentId));
  return events.map((e) => ({
    status: NAMES[Number(e.status)],
    actorId: e.actorId,
    timestamp: new Date(Number(e.timestamp) * 1000).toISOString(),
    note: e.note
  }));
};