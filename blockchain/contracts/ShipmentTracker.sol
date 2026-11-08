// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ShipmentTracker {
    enum Status { Created, Accepted, PickedUp, Delivered }

    struct ShipmentEvent {
        Status status;
        string actorId;
        uint256 timestamp;
        string note;
    }

    address public owner;
    mapping(string => ShipmentEvent[]) private history;

    event ShipmentEventRecorded(string shipmentId, Status status, string actorId, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, 'Not authorized');
        _;
    }

    constructor() { owner = msg.sender; }

    function recordEvent(string calldata shipmentId, Status status, string calldata actorId, string calldata note) external onlyOwner {
        history[shipmentId].push(ShipmentEvent(status, actorId, block.timestamp, note));
        emit ShipmentEventRecorded(shipmentId, status, actorId, block.timestamp);
    }

    function getHistory(string calldata shipmentId) external view returns (ShipmentEvent[] memory) {
        return history[shipmentId];
    }

    function getEventCount(string calldata shipmentId) external view returns (uint256) {
        return history[shipmentId].length;
    }
}