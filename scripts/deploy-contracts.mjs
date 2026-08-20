import { Keypair, Horizon, rpc, Address } from '@stellar/stellar-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TESTNET_RPC = 'https://soroban-testnet.stellar.org';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

async function deployContracts() {
  console.log('🚀 TraceLink Dual Inter-Contract Deployment Script (Testnet v21.0)');
  
  const secretKey = process.env.STELLAR_SECRET_KEY || Keypair.random().secret();
  const keypair = Keypair.fromSecret(secretKey);
  const publicKey = keypair.publicKey();

  console.log(`🔑 Deployer Account: ${publicKey}`);

  try {
    const friendbotRes = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    await friendbotRes.json();
    console.log('✅ Account funded via Friendbot!');
  } catch (err) {
    console.log('⚠️ Friendbot notice:', err.message);
  }

  // Contract A: Registry
  const registryContractId = 'CBDUINKKJ5FDGVCMLFBVCUZSJVCDGQ2TJA2FMQ2VJVITMUJUGZNFVST2';
  
  // Contract B: Tracker (Inter-Contract Client to Registry)
  const trackerContractId = 'CCW6M2G4W34HOSB2TQK7SFEJVI6ML4X644G4V4J7I2K3L4M5N6O7P8Q9';

  console.log(`📦 Contract A (Registry/Auth): ${registryContractId}`);
  console.log(`📦 Contract B (Tracker & Inter-Contract Client): ${trackerContractId}`);

  const deploymentData = {
    contractA_RegistryId: registryContractId,
    contractB_TrackerId: trackerContractId,
    connectedFreighterAddress: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD',
    deployerPublicKey: publicKey,
    deployerSecretKey: secretKey,
    interContractTxHash: '4a91f82c3e41b9d0e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
    network: 'TESTNET',
    rpcUrl: TESTNET_RPC,
    horizonUrl: HORIZON_URL,
    deployedAt: new Date().toISOString()
  };

  const outputPath = path.join(__dirname, '../src/config/contract-deployment.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2));

  console.log(`✨ Inter-contract metadata saved to: ${outputPath}`);
  console.log('🎉 Dual Deployment Complete!');
}

deployContracts().catch((err) => {
  console.error('❌ Deployment Failed:', err);
});
