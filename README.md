# Greetings dApp

A simple blockchain application where users can send public digital greetings.

## Structure
- `contracts/` - Solidity smart contracts using Foundry
- `frontend/` - Next.js frontend using Ethers.js

## Features
- Send public greetings to the blockchain
- View all greetings with sender address and timestamp
- Connect MetaMask wallet for identity
- Real-time updates via events

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [Foundry](https://getfoundry.sh/)
- [MetaMask](https://metamask.io/) browser extension

## Getting Started

### 1. Clone the repository

```bash

git clone <repository-url>
cd greetings
```

### 2. Start the local blockchain

```bash
cd contracts
anvil
```

Keep this terminal running.

### 3. Deploy the smart contract

In a new terminal:

```bash
cd contracts
forge script script/DeployGreeting.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Note the contract address from the output.

### 4. Update the frontend with the contract address

Open `frontend/src/app/page.tsx` and update the `contractAddress` variable with the deployed address if it's different.

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Using the dApp

1. Connect your MetaMask wallet
2. Switch to the localhost network (http://127.0.0.1:8545)
3. Send a greeting by typing a message and clicking "Send Greeting"
4. View all greetings in the list below the form

## Smart Contract Details

The smart contract is written in Solidity and has two main functions:

- `sendGreeting(string message)`: Sends a greeting to the blockchain
- `getGreetings()`: Retrieves all greetings

The contract also emits a `Greeted` event whenever a new greeting is sent, which the frontend listens to for real-time updates.

## Testing

To run the smart contract tests:

```bash
cd contracts
forge test
```

## Deployment

To deploy to a live network, update the script with the appropriate RPC URL and private key, then run the forge script command with the new parameters.

For example, to deploy to Sepolia testnet:

```bash
forge script script/DeployGreeting.s.sol --rpc-url <SEPOLIA_RPC_URL> --broadcast --verify --etherscan-api-key <ETHERSCAN_API_KEY> --private-key <YOUR_PRIVATE_KEY>
```

Remember to update the contract address in the frontend after deployment.
