import React from 'react';
import { ShieldCheck, Wallet, ExternalLink, Cpu, QrCode, UserCheck } from 'lucide-react';
import { WalletState, UserRole } from '../types';
import { STELLAR_CONFIG } from '../config/stellar';

interface NavbarProps {
  walletState: WalletState;
  onOpenWalletModal: () => void;
  onOpenQRScanner: () => void;
  onOpenCreateModal: () => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletState,
  onOpenWalletModal,
  onOpenQRScanner,
  onOpenCreateModal,
  activeRole,
  onRoleChange,
}) => {
  const truncatedAddress = walletState.publicKey
    ? `${walletState.publicKey.substring(0, 6)}...${walletState.publicKey.substring(walletState.publicKey.length - 4)}`
    : '';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '0.85rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand & Network info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--primary-glow)'
            }}>
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Trace<span style={{ color: '#10b981', WebkitTextFillColor: '#10b981' }}>Link</span>
                </h1>
                <span className="badge badge-emerald">
                  <span className="pulse-dot"></span> Testnet
                </span>
              </div>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Stellar Soroban Supply Chain Protocol
              </p>
            </div>
          </div>

          <a
            href={`${STELLAR_CONFIG.EXPLORER_BASE}/contract/${STELLAR_CONFIG.CONTRACT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              transition: 'all 0.2s'
            }}
          >
            <Cpu size={12} color="#10b981" />
            <span>Contract: {STELLAR_CONFIG.CONTRACT_ID.substring(0, 8)}...</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Actions & Wallet Integration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Active Role Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.35rem 0.65rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <UserCheck size={14} color="#3b82f6" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Role:</span>
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.775rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="PRODUCER">Producer / Farmer</option>
              <option value="QUALITY_INSPECTOR">Quality Inspector</option>
              <option value="LOGISTICS_CARRIER">Logistics Carrier</option>
              <option value="DISTRIBUTOR">Distributor / Hub</option>
              <option value="RETAILER">Retailer / Store</option>
              <option value="AUDITOR">Public Auditor</option>
            </select>
          </div>

          {/* Quick Action: Register Item */}
          <button className="btn-primary" onClick={onOpenCreateModal}>
            + Register Batch
          </button>

          {/* Quick Action: QR Checkpoint Scan */}
          <button className="btn-accent" onClick={onOpenQRScanner}>
            <QrCode size={16} /> Scan QR
          </button>

          {/* Multi-wallet Trigger Button */}
          <button
            onClick={onOpenWalletModal}
            className="btn-secondary"
            style={{
              borderColor: walletState.isConnected ? 'rgba(16, 185, 129, 0.4)' : 'var(--border)',
              background: walletState.isConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.05)'
            }}
          >
            <Wallet size={16} color={walletState.isConnected ? '#10b981' : '#ffffff'} />
            {walletState.isConnected ? (
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 600, color: '#34d399' }}>
                  {truncatedAddress}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {walletState.balanceXlm ? `${parseFloat(walletState.balanceXlm).toFixed(2)} XLM` : '0 XLM'}
                </div>
              </div>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
