# AgriTransport: Blockchain-Based Smart Transportation System

A full-stack app for transporting agricultural produce. Shipment events are recorded on an Ethereum smart contract, so the history cannot be edited. Normal data lives in MongoDB Atlas.

Mini Project, Batch D13.

## Features
- Three roles: **Farmer**, **Transporter**, **Admin**
- Farmer creates a shipment and picks a drop location (sample Hyderabad stores)
- Transporter accepts a shipment and chooses a vehicle suited to the quantity
- Each step is recorded on-chain: Created, Accepted, PickedUp, Delivered
- Shipment history page shows the blockchain events and transaction hashes
- Admin dashboard with statistics and user management

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express, JWT |
| Database | MongoDB Atlas |
| Blockchain | Solidity, Hardhat, ethers.js |

## Vehicle Selection
| Vehicle | Max load |
|---|---|
| Mini Truck | 750 kg |
| Pickup Truck | 1500 kg |
| Refrigerated Truck | 3000 kg |
| Tractor Trailer | 3000 kg and above |

## Project Structure
```
backend/      Express API, MongoDB models, blockchain service
blockchain/   ShipmentTracker.sol, Hardhat scripts and tests
frontend/     React app
```

## Run Locally

### 1. Install dependencies
```
cd blockchain && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

### 2. Start a local blockchain (Terminal 1)
```
cd blockchain
npx hardhat node
```

### 3. Deploy the contract (Terminal 2)
```
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```
Copy the printed contract address.

### 4. Configure the backend
Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=a_private_key_printed_by_hardhat_node
CONTRACT_ADDRESS=address_from_step_3
```

### 5. Start the backend (Terminal 3)
```
cd backend
npm run dev
```

### 6. Start the frontend (Terminal 4)
```
cd frontend
npm run dev
```
Open http://localhost:5173

## Tests
```
cd blockchain
npx hardhat test
```

## Sepolia Testnet
The contract is also deployed on the Sepolia testnet:
`0x8248CDcc27a1bd4503C0C863A912bE4D78D8c269`

## Security Notes
- `.env` files are not committed. Never commit private keys or database credentials.
- The backend wallet signs all blockchain transactions, so users must trust the backend.

## Limitations and Future Scope
- Status-based tracking, not live GPS
- Store list is sample data
- Planned: live GPS and map, IoT temperature sensors, payments (UPI/escrow), online hosting