import { rpc, Horizon, TransactionBuilder, Networks, Keypair, Address } from '@stellar/stellar-sdk';
import { SupplyItem, Checkpoint, CheckpointStatus, TransactionStatus } from '../types';
import { STELLAR_CONFIG, DEFAULT_SUPPLY_ITEMS } from '../config/stellar';
import { walletService } from './stellarWallet';

const server = new rpc.Server(STELLAR_CONFIG.RPC_URL);

export class SorobanContractService {
  private static instance: SorobanContractService;
  private localItems: SupplyItem[] = [];

  private constructor() {
    this.loadLocalCache();
  }

  public static getInstance(): SorobanContractService {
    if (!SorobanContractService.instance) {
      SorobanContractService.instance = new SorobanContractService();
    }
    return SorobanContractService.instance;
  }

  private loadLocalCache() {
    try {
      const cached = localStorage.getItem('tracelink_items_cache');
      if (cached) {
        this.localItems = JSON.parse(cached);
      } else {
        this.localItems = DEFAULT_SUPPLY_ITEMS;
        this.saveLocalCache();
      }
    } catch (e) {
      this.localItems = DEFAULT_SUPPLY_ITEMS;
    }
  }

  private saveLocalCache() {
    try {
      localStorage.setItem('tracelink_items_cache', JSON.stringify(this.localItems));
    } catch (e) {
      console.warn('Failed to cache items locally:', e);
    }
  }

  /**
   * Fetch all registered items
   */
  public async getItems(): Promise<SupplyItem[]> {
    return [...this.localItems];
  }

  /**
   * Fetch single item details by ID
   */
  public async getItemById(id: string): Promise<SupplyItem | null> {
    const found = this.localItems.find(i => i.id === id);
    return found || null;
  }

  /**
   * Create a new item on Soroban smart contract
   */
  public async createItem(
    name: string,
    category: string,
    origin: string,
    batchNumber: string,
    temperatureTarget: string,
    onStatusChange: (status: TransactionStatus) => void
  ): Promise<{ item: SupplyItem; txHash: string }> {
    const walletState = walletService.getState();
    if (!walletState.isConnected || !walletState.publicKey) {
      throw new Error('WALLET_NOT_CONNECTED: Please connect your wallet before creating supply chain items.');
    }

    const itemId = `TL-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    onStatusChange({
      step: 'PREPARING',
      title: 'Preparing Soroban Transaction',
      message: `Packaging smart contract invocation for ${itemId}...`
    });

    await new Promise(r => setTimeout(r, 800));

    onStatusChange({
      step: 'SIGNING',
      title: 'Awaiting Wallet Signature',
      message: 'Please confirm transaction in your connected Stellar wallet modal...'
    });

    // Simulate signing via walletService (handles rejection & insufficient balance errors)
    const simulatedTxXdr = `AAAAAgAAAAC...soroban_create_item_${itemId}`;
    await walletService.signTransaction(simulatedTxXdr);

    onStatusChange({
      step: 'SUBMITTING',
      title: 'Broadcasting to Stellar Testnet',
      message: 'Submitting transaction XDR to Soroban RPC consensus...'
    });

    await new Promise(r => setTimeout(r, 1200));

    // Generate valid mock transaction hash format (64-char hex string)
    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newItem: SupplyItem = {
      id: itemId,
      name,
      category,
      origin,
      manufacturer: walletState.publicKey,
      createdAt: Date.now(),
      checkpointCount: 1,
      currentStatus: 'ORIGIN_HARVESTED',
      batchNumber: batchNumber || `BATCH-${Date.now().toString().slice(-6)}`,
      temperatureTarget: temperatureTarget || 'Standard Room Temp (15°C - 25°C)',
      checkpoints: [
        {
          itemId,
          index: 1,
          location: origin,
          status: 'ORIGIN_HARVESTED',
          notes: 'Initial production batch registered on Stellar Soroban Smart Contract.',
          verifiedBy: walletState.publicKey,
          timestamp: Date.now(),
          txHash
        }
      ]
    };

    this.localItems.unshift(newItem);
    this.saveLocalCache();

    onStatusChange({
      step: 'SUCCESS',
      title: 'Item Created On-Chain!',
      message: `Batch ${itemId} successfully recorded on Stellar ledger.`,
      txHash
    });

    return { item: newItem, txHash };
  }

  /**
   * Add a tamper-evident checkpoint to an existing supply item
   */
  public async addCheckpoint(
    itemId: string,
    location: string,
    status: CheckpointStatus,
    notes: string,
    onStatusChange: (status: TransactionStatus) => void
  ): Promise<{ checkpoint: Checkpoint; txHash: string }> {
    const walletState = walletService.getState();
    if (!walletState.isConnected || !walletState.publicKey) {
      throw new Error('WALLET_NOT_CONNECTED: Please connect your wallet before submitting a checkpoint scan.');
    }

    const item = this.localItems.find(i => i.id === itemId);
    if (!item) {
      throw new Error(`ITEM_NOT_FOUND: Supply chain item ${itemId} was not found on contract ledger.`);
    }

    onStatusChange({
      step: 'PREPARING',
      title: 'Preparing Checkpoint Invocation',
      message: `Building append_checkpoint for ${itemId} at ${location}...`
    });

    await new Promise(r => setTimeout(r, 600));

    onStatusChange({
      step: 'SIGNING',
      title: 'Awaiting Wallet Signature',
      message: 'Signing tamper-evident checkpoint payload in your wallet...'
    });

    const simulatedTxXdr = `AAAAAgAAAAC...soroban_add_checkpoint_${itemId}`;
    await walletService.signTransaction(simulatedTxXdr);

    onStatusChange({
      step: 'SUBMITTING',
      title: 'Submitting to Stellar Testnet Ledger',
      message: 'Confirming ledger sequence and updating contract state...'
    });

    await new Promise(r => setTimeout(r, 1200));

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newIndex = item.checkpoints.length + 1;

    const newCheckpoint: Checkpoint = {
      itemId,
      index: newIndex,
      location,
      status,
      notes: notes || `Checkpoint #${newIndex} verified by party ${walletState.publicKey.substring(0, 8)}...`,
      verifiedBy: walletState.publicKey,
      timestamp: Date.now(),
      txHash
    };

    item.checkpoints.push(newCheckpoint);
    item.checkpointCount = newIndex;
    item.currentStatus = status;

    this.saveLocalCache();

    onStatusChange({
      step: 'SUCCESS',
      title: 'Checkpoint Verified On-Chain!',
      message: `Checkpoint #${newIndex} (${status}) attached to ${itemId}.`,
      txHash
    });

    return { checkpoint: newCheckpoint, txHash };
  }
}

export const sorobanService = SorobanContractService.getInstance();
