import React from 'react';
import { TransactionStatus } from '../types';
import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { STELLAR_CONFIG } from '../config/stellar';

interface TransactionTrackerProps {
  status: TransactionStatus | null;
  onClose: () => void;
}

export const TransactionTracker: React.FC<TransactionTrackerProps> = ({ status, onClose }) => {
  if (!status || status.step === 'IDLE') return null;

  const isSuccess = status.step === 'SUCCESS';
  const isFailed = status.step === 'FAILED';
  const isLoading = !isSuccess && !isFailed;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 1000,
      width: '380px',
      maxWidth: 'calc(100vw - 3rem)',
      animation: 'slideUp 0.3s ease'
    }}>
      <div style={{
        background: '#0f172a',
        border: `1px solid ${isSuccess ? '#10b981' : isFailed ? '#f43f5e' : '#3b82f6'}`,
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLoading && <RefreshCw size={18} color="#3b82f6" className="spin" />}
            {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
            {isFailed && <AlertCircle size={18} color="#f43f5e" />}
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {status.title}
            </span>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Message */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          {status.message}
        </div>

        {/* Step Progress indicators */}
        {isLoading && (
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem' }}>
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#3b82f6' }}></div>
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: status.step === 'SIGNING' || status.step === 'SUBMITTING' ? '#3b82f6' : 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: status.step === 'SUBMITTING' ? '#3b82f6' : 'rgba(255,255,255,0.1)' }}></div>
          </div>
        )}

        {/* Transaction Hash & Stellar Explorer Link */}
        {status.txHash && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            padding: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Transaction Hash</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                {status.txHash.substring(0, 10)}...{status.txHash.substring(status.txHash.length - 6)}
              </div>
            </div>

            <a
              href={`${STELLAR_CONFIG.EXPLORER_BASE}/tx/${status.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.725rem' }}
            >
              Explorer <ExternalLink size={12} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
