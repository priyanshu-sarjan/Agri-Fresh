import React from 'react';
import { AlertTriangle, X, RefreshCw, Download, Zap, HelpCircle } from 'lucide-react';
import { walletService } from '../services/stellarWallet';
import { WalletState } from '../types';

interface ErrorBannerProps {
  error: Error | string | null;
  onClose: () => void;
  onWalletUpdated: (state: WalletState) => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onClose, onWalletUpdated }) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred.';

  const isWalletNotFound = errorMessage.includes('WALLET_NOT_FOUND') || errorMessage.includes('is not installed');
  const isUserRejected = errorMessage.includes('USER_REJECTED') || errorMessage.includes('cancelled');
  const isInsufficientBalance = errorMessage.includes('INSUFFICIENT_BALANCE') || errorMessage.includes('0.5 XLM');

  const handleFundFriendbot = async () => {
    try {
      await walletService.fundWithFriendbot();
      onWalletUpdated(walletService.getState());
      onClose();
    } catch (e: any) {
      console.warn('Friendbot error:', e);
    }
  };

  const handleUseTestnetWallet = async () => {
    try {
      const state = await walletService.connectWallet('testnet_keypair');
      onWalletUpdated(state);
      onClose();
    } catch (e: any) {
      console.warn('Testnet wallet error:', e);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '5rem',
      right: '1.5rem',
      zIndex: 1000,
      width: '420px',
      maxWidth: 'calc(100vw - 3rem)',
      animation: 'fadeIn 0.25s ease'
    }}>
      <div style={{
        background: '#180e19',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        borderRadius: '14px',
        padding: '1.15rem',
        boxShadow: '0 15px 35px rgba(244, 63, 94, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={18} color="#f43f5e" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fca5a5', marginBottom: '0.2rem' }}>
                {isWalletNotFound && 'Error 1/3: Wallet Extension Not Found'}
                {isUserRejected && 'Error 2/3: Transaction Signing Cancelled'}
                {isInsufficientBalance && 'Error 3/3: Insufficient XLM Fee Balance'}
                {!isWalletNotFound && !isUserRejected && !isInsufficientBalance && 'Soroban Operation Error'}
              </h4>
              <p style={{ fontSize: '0.775rem', color: '#fda4af', lineHeight: 1.45 }}>
                {errorMessage}
              </p>

              {/* Action resolution options depending on error type */}
              {isWalletNotFound && (
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a
                    href="https://www.freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent"
                    style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem' }}
                  >
                    <Download size={12} /> Install Freighter Extension
                  </a>
                  <button
                    onClick={handleUseTestnetWallet}
                    className="btn-primary"
                    style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem' }}
                  >
                    Use Built-in Testnet Wallet
                  </button>
                </div>
              )}

              {isInsufficientBalance && (
                <div style={{ marginTop: '0.75rem' }}>
                  <button
                    onClick={handleFundFriendbot}
                    className="btn-primary"
                    style={{ fontSize: '0.725rem', padding: '0.4rem 0.75rem' }}
                  >
                    <Zap size={13} /> 1-Click Friendbot Top-Up (+10K XLM)
                  </button>
                </div>
              )}

              {isUserRejected && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Tip: Open your wallet popup and approve signature when prompted.
                </div>
              )}
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fda4af', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
