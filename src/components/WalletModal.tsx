import React, { useState } from 'react';
import { X, Wallet, CheckCircle2, AlertTriangle, RefreshCw, Zap, ExternalLink, Shield } from 'lucide-react';
import { WalletType, WalletState } from '../types';
import { walletService } from '../services/stellarWallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: WalletState;
  onWalletUpdated: (state: WalletState) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  walletState,
  onWalletUpdated,
}) => {
  const [loadingType, setLoadingType] = useState<WalletType | null>(null);
  const [isFunding, setIsFunding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (type: WalletType) => {
    setLoadingType(type);
    setErrorMsg(null);
    try {
      const newState = await walletService.connectWallet(type);
      onWalletUpdated(newState);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect wallet');
    } finally {
      setLoadingType(null);
    }
  };

  const handleDisconnect = () => {
    const newState = walletService.disconnect();
    onWalletUpdated(newState);
    onClose();
  };

  const handleFundFriendbot = async () => {
    setIsFunding(true);
    setErrorMsg(null);
    try {
      const newBal = await walletService.fundWithFriendbot();
      onWalletUpdated(walletService.getState());
    } catch (err: any) {
      setErrorMsg(err.message || 'Friendbot funding request failed');
    } finally {
      setIsFunding(false);
    }
  };

  const walletOptions: { id: WalletType; name: string; desc: string; iconBg: string; badge?: string }[] = [
    {
      id: 'freighter',
      name: 'Freighter Wallet',
      desc: 'Official Stellar browser extension wallet',
      iconBg: '#3b82f6',
      badge: 'Recommended'
    },
    {
      id: 'albedo',
      name: 'Albedo Wallet',
      desc: 'Web-based Stellar web link signer',
      iconBg: '#8b5cf6'
    },
    {
      id: 'xbull',
      name: 'xBull Wallet',
      desc: 'Multi-platform Stellar wallet extension',
      iconBg: '#f59e0b'
    },
    {
      id: 'hana',
      name: 'Hana Wallet',
      desc: 'Smart contract non-custodial wallet',
      iconBg: '#ec4899'
    },
    {
      id: 'testnet_keypair',
      name: 'Testnet Keypair Generator',
      desc: 'Instant 1-click testnet wallet with pre-funded XLM',
      iconBg: '#10b981',
      badge: 'Instant Sandbox'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={20} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Connect Stellar Wallet</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select provider for Soroban contract interaction</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '10px',
            padding: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem'
          }}>
            <AlertTriangle size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Wallet Connection Error</div>
              <div>{errorMsg}</div>
            </div>
          </div>
        )}

        {/* Connected State Box */}
        {walletState.isConnected ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>Active Wallet Connected</span>
              </div>
              <span className="badge badge-emerald">{walletState.walletType}</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Public Address</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-main)', wordBreak: 'break-all', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
              {walletState.publicKey}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stellar Testnet Balance</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  {walletState.balanceXlm ? `${walletState.balanceXlm} XLM` : 'Loading...'}
                </div>
              </div>

              <button
                className="btn-accent"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.775rem' }}
                onClick={handleFundFriendbot}
                disabled={isFunding}
              >
                {isFunding ? <RefreshCw size={14} className="spin" /> : <Zap size={14} />}
                {isFunding ? 'Funding...' : '1-Click Faucet (+10K XLM)'}
              </button>
            </div>

            <button
              onClick={handleDisconnect}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: '8px',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                background: 'rgba(244, 63, 94, 0.1)',
                color: '#fca5a5',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          /* Provider Selection Options */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {walletOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleConnect(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: opt.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Wallet size={18} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{opt.name}</span>
                      {opt.badge && (
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                  </div>
                </div>

                {loadingType === opt.id ? (
                  <RefreshCw size={18} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Shield size={16} color="var(--text-dim)" />
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.725rem', color: 'var(--text-dim)', textAlign: 'center' }}>
          Supports Soroban Smart Contracts on Stellar Testnet v21.0
        </div>
      </div>
    </div>
  );
};
