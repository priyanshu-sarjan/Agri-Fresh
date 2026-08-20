export const STELLAR_CONFIG = {
  NETWORK: 'TESTNET',
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  RPC_URL: 'https://soroban-testnet.stellar.org',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  FRIENDBOT_URL: 'https://friendbot.stellar.org',
  EXPLORER_BASE: 'https://stellar.expert/explorer/testnet',
  CONTRACT_ID: 'CBDUINKKJ5FDGVCMLFBVCUZSJVCDGQ2TJA2FMQ2VJVITMUJUGZNFVST2',
  CONTRACT_A_REGISTRY_ID: 'CBDUINKKJ5FDGVCMLFBVCUZSJVCDGQ2TJA2FMQ2VJVITMUJUGZNFVST2',
  CONTRACT_B_TRACKER_ID: 'CCW6M2G4W34HOSB2TQK7SFEJVI6ML4X644G4V4J7I2K3L4M5N6O7P8Q9',
  DEPLOYED_TX_HASH: '4a91f82c3e41b9d0e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
  FREIGHTER_PUBLIC_KEY: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD'
};

export const DEFAULT_SUPPLY_ITEMS = [
  {
    id: 'TL-HERB-892',
    name: 'Organic Ashwagandha Root Batch #892',
    category: 'Botanical Extracts',
    origin: 'Kerala Organic Estates, India (Lat: 10.8505, Long: 76.2711)',
    manufacturer: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD',
    createdAt: Date.now() - 86400000 * 4,
    checkpointCount: 3,
    currentStatus: 'QUALITY_PASSED' as const,
    batchNumber: 'BATCH-2026-ASH892',
    temperatureTarget: '15°C - 25°C',
    checkpoints: [
      {
        itemId: 'TL-HERB-892',
        index: 1,
        location: 'Wayanad Harvest Farms, Kerala',
        status: 'ORIGIN_HARVESTED' as const,
        notes: 'Hand-picked organic roots harvested under ideal soil humidity.',
        verifiedBy: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD',
        timestamp: Date.now() - 86400000 * 4,
        txHash: 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2'
      },
      {
        itemId: 'TL-HERB-892',
        index: 2,
        location: 'Cochin Extraction Plant #4',
        status: 'PROCESSING_STARTED' as const,
        notes: 'Low-temperature aqueous extraction initiated with non-GMO solvent.',
        verifiedBy: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD',
        timestamp: Date.now() - 86400000 * 2,
        txHash: 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3'
      },
      {
        itemId: 'TL-HERB-892',
        index: 3,
        location: 'National Botanical Testing Lab',
        status: 'QUALITY_PASSED' as const,
        notes: 'HPLC Withanolide content verified at 5.2%. Zero heavy metals or pesticide residue detected.',
        verifiedBy: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD',
        timestamp: Date.now() - 86400000 * 1,
        txHash: 'a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4'
      }
    ]
  },
  {
    id: 'TL-MED-411',
    name: 'Cold-Chain Insulin Vials Lot #411',
    category: 'Pharmaceutical Cold Chain',
    origin: 'BioTech Pharma Hub, Germany',
    manufacturer: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD',
    createdAt: Date.now() - 86400000 * 2,
    checkpointCount: 2,
    currentStatus: 'IN_TRANSIT' as const,
    batchNumber: 'LOT-INS-411-GER',
    temperatureTarget: '2°C - 8°C (Constant Monitoring)',
    checkpoints: [
      {
        itemId: 'TL-MED-411',
        index: 1,
        location: 'Frankfurt Central Bio-Warehouse',
        status: 'ORIGIN_HARVESTED' as const,
        notes: 'Sterile packaging complete. Cryo-sensors calibrated.',
        verifiedBy: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD',
        timestamp: Date.now() - 86400000 * 2,
        txHash: 'b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5'
      },
      {
        itemId: 'TL-MED-411',
        index: 2,
        location: 'Lufthansa Cargo Flight LH-842',
        status: 'IN_TRANSIT' as const,
        notes: 'Active refrigeration unit reporting stable 4.1°C reading.',
        verifiedBy: 'GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD',
        timestamp: Date.now() - 3600000 * 5,
        txHash: 'c5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6'
      }
    ]
  }
];
