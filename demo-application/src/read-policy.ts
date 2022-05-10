/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Gateway, Wallets } from 'fabric-network';

import Logger from './utils/logger';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function main() {
  process.env.WALLET_IDENTITY_NAME = process.env.WALLET_IDENTITY_NAME || '';
  process.env.WALLET_DIRECTORY_PATH = process.env.WALLET_DIRECTORY_PATH || '';
  process.env.CONNECTION_PROFILE_PATH = process.env.CONNECTION_PROFILE_PATH || '';

  try {
    // Get CLI arguments
    const id = process.argv[2];

    if (!id) {
      Logger.error(`Usage: npm run readPolicy <id>`);
      process.exit(1);
    }

    // Create the wallet
    const wallet = await Wallets.newFileSystemWallet(path.resolve(__dirname, process.env.WALLET_DIRECTORY_PATH))

    // Create the gateway
    const gateway = new Gateway();
    const connectionProfilePath = path.resolve(__dirname, process.env.CONNECTION_PROFILE_PATH);
    const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const connectionOptions = { wallet, identity: process.env.WALLET_IDENTITY_NAME, discovery: { enabled: true, asLocalhost: true } };
    await gateway.connect(connectionProfile, connectionOptions);

    // Connect to the blockchain
    const network = await gateway.getNetwork('mychannel');

    // Connect to the smart contract
    const contract = network.getContract('ipfs-storage');

    // Submit the network transactions    
    const result = await contract.evaluateTransaction('ReadPolicy', id);
    Logger.dir(JSON.parse(result.toString()));
    
    // Disconnect the gateway
    gateway.disconnect();

  } catch (error) {
    Logger.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}
void main();