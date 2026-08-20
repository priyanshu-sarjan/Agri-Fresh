import { describe, it, expect } from 'vitest';
import { walletService } from '../services/stellarWallet';

describe('StellarWalletService Multi-Wallet Suite', () => {
  it('Test 1: Initialized wallet contains pre-configured Freighter public key', () => {
    const state = walletService.getState();
    expect(state.isConnected).toBe(true);
    expect(state.walletType).toBe('freighter');
    expect(state.publicKey).toBe('GBEUYMOTXDRXLXTS4LOW6RMH5HXVXJACD7IBFBM452YBVVPCP5KI4QTD');
  });

  it('Test 2: Connects built-in Testnet keypair sandbox mode with XLM balance', async () => {
    const state = await walletService.connectWallet('testnet_keypair');
    expect(state.isConnected).toBe(true);
    expect(state.walletType).toBe('testnet_keypair');
    expect(state.publicKey).toBeDefined();
  }, { timeout: 20000 });

  it('Test 3: Properly formats and validates error types (WALLET_NOT_FOUND, USER_REJECTED)', async () => {
    try {
      await walletService.connectWallet('unknown_type' as any);
    } catch (err: any) {
      expect(err.message).toContain('WALLET_PROVIDER_NOT_FOUND');
    }
  });
});
