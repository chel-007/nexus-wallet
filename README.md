### Nexus Wallet [for Web3 Gaming]

**Nexus Wallet App** : https://nexus-wallet.netlify.app/

#### Introduction
After working on the bounty challenge: '**Simplify Building on the Blockchain with Circle and USDC**,' I've gained a deeper understanding of the innovation brought forth by Circle USDC. I commend their extensive and well-organized code documentation, which allowed me to explore a previously unknown concept in just a few days.

For this bounty, I chose to develop the Nexus Wallet, a Circle Programmable-powered wallet with integrated Web3 gaming features.

**Problem Scope:** I've always believed that an independent wallet where players can seamlessly link their profiles to Web3 games without active interaction in the game would be ideal.

**Solution**
- The wallet could facilitates basic game mechanics like crafting, minting, evolving avatars, and listing etc.
- Transactions within the wallet and Web3 games are conducted using a unified standard token, such as USDT, USDC, and the Ecosystem's Token.
- This unified token system simplifies transactions for all players, irrespective of their familiarity with Web3 gaming and cryptocurrency.

### Nexus Wallet Core and Advanced Features

#### Core Features

I've implemented three core features: setting up wallet creation, transfers, and recovery flows seamlessly.
- **Wallet Creation:** My Wallet Creation Component enables users to create a new User ID linked to the App ID (for Nexus Wallet).
  - Users can utilize the new User ID to create EOA/SCA wallets, set a new PIN, and configure the wallet for recovery after completing the challenge.
  - The Wallet Creation flow dynamically generates the user token, encryption key, and challenge ID with a simple button click, interacting with the backend web server.

* **Wallet Transfer:** Wallet transfer takes a similar approach but with advanced functionalities. It interacts with new functions like **getting wallets**, **processing token balances**, **sending from multiple wallets**, and **processing tokens based on ID** (such as USDC and Eth-Sepolia).
  - It interacts with and abstracts the creation of session tokens, utilizing either localStorage or programmatically.

* **Wallet Recovery:** The wallet recovery process is straightforward. It enables users to initiate recovery if they forget their PIN, and can be completed in less than a minute. Additionally, users can browse through all Nexus Wallet users if they need to recover another forgotten userID.

#### New Advanced Features:
**Circle Notifications:** Notifications to keep users informed about their transactions status. This is achieved by creating a route on my backend, which is linked to the Circle Console Webhook. Outbound transactions for payments and NFT minting, sends users alerts from the initiation to the completion stage.

**NFT Minting & Collection:** One of the most advanced features is activating a Web3 gaming feature by engaging with a test Web3 game. In this game, they can craft basic items and successfully mint combinations. I've deployed an NFT smart contract using **Circle ERC-721 templates** on the **ETH-Sepolia blockchain**. Additionally, I interact with the contract using a *developer-controlled wallet* **encrypted with ciphertext** generated on the backend for each minting transaction initiated.

Users can mint five different types of NFTs and view them in NFT Collection by supplying their wallet ID.

Note: Crafting game mechanics have a cooldown period of 60 minutes after a successful craft, during which another craft cannot be initiated with the same items.

Additionally, across all features, the backend sends back a response after a transaction is initiated, which is then processed to send a toast notification about the status.


### Nexus Wallet Building Paths

**Backend Script Processes:** https://github.com/chel-007/nexus-wallet-script/

#### Technologies Used:
* ***Next.js - Frontend***
* ***Express & NodeJs - Backend***
* ***Railway - Production Backend***
* ***Netlify***

**NFT Contract Address:** 0xd5c2933b8b6c84857e5881ee78218033893f3362 - ETH Sepolia



* Installing Circle Web3 SDK enables interaction with Circle BaseURL via API pathways to execute various functions such as **getting users**, **listing NFTs**, **minting an NFT**, and **creating transfer challenges**.

* Deploying an Express integrated with Socket.io backend facilitates accessing APIs in production. The backend has been deployed on Railway Node.js infrastructure. Socket.io establishes a real-time websocket connection between the frontend and backend, enabling the distribution of notifications sent from Circle to connected clients.
