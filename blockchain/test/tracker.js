const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ShipmentTracker', () => {
  let tracker, owner, other;

  beforeEach(async () => {
    [owner, other] = await ethers.getSigners();
    const factory = await ethers.getContractFactory('ShipmentTracker');
    tracker = await factory.deploy();
    await tracker.waitForDeployment();
  });

  it('records events in order', async () => {
    await tracker.recordEvent('s1', 0, 'u1', 'created');
    await tracker.recordEvent('s1', 1, 'u2', 'accepted');
    expect(await tracker.getEventCount('s1')).to.equal(2n);
    const history = await tracker.getHistory('s1');
    expect(history[0].status).to.equal(0n);
    expect(history[1].status).to.equal(1n);
  });

  it('rejects writes from a non-owner', async () => {
    await expect(
      tracker.connect(other).recordEvent('s1', 0, 'u1', 'x')
    ).to.be.revertedWith('Not authorized');
  });
});