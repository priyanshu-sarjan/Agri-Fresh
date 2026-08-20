export type UserRole = 
  | 'PRODUCER' 
  | 'QUALITY_INSPECTOR' 
  | 'LOGISTICS_CARRIER' 
  | 'DISTRIBUTOR' 
  | 'RETAILER' 
  | 'AUDITOR';

export type CheckpointStatus = 
  | 'ORIGIN_HARVESTED'
  | 'PROCESSING_STARTED'
  | 'QUALITY_PASSED'
  | 'IN_TRANSIT'
  | 'CUSTOMS_CLEARED'
  | 'WAREHOUSE_RECEIVED'
  | 'RETAIL_DELIVERED'
  | 'VERIFIED_CONSUMER';

export interface Checkpoint {
  itemId: string;
  index: number;
  location: string;
  status: CheckpointStatus;
  notes: string;
  verifiedBy: string;
  timestamp: number;
  txHash?: string;
}

export interface SupplyItem {
  id: string;
  name: string;
  category: string;
  origin: string;
  manufacturer: string;
  createdAt: number;
  checkpointCount: number;
  currentStatus: CheckpointStatus;
  checkpoints: Checkpoint[];
  batchNumber: string;
  temperatureTarget?: string;
}

export type WalletType = 'freighter' | 'albedo' | 'xbull' | 'hana' | 'testnet_keypair';

export interface WalletState {
  isConnected: boolean;
  walletType: WalletType | null;
  publicKey: string | null;
  balanceXlm: string | null;
  network: 'TESTNET' | 'PUBLIC';
  secretKey?: string | null; // For testnet keypair mode
}

export type TransactionStep = 'IDLE' | 'PREPARING' | 'SIGNING' | 'SUBMITTING' | 'SUCCESS' | 'FAILED';

export interface TransactionStatus {
  step: TransactionStep;
  title: string;
  message: string;
  txHash?: string;
  error?: string;
}

export interface ContractEvent {
  id: string;
  type: 'ITEM_CREATED' | 'CHECKPOINT_ADDED' | 'ITEM_VERIFIED';
  itemId: string;
  actor: string;
  details: string;
  timestamp: number;
  txHash: string;
}
