import React from 'react';
import { Checkpoint, SupplyItem } from '../types';
import { ShieldCheck, MapPin, Clock, UserCheck, FileText, ExternalLink, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { STELLAR_CONFIG } from '../config/stellar';

interface CheckpointTimelineProps {
  item: SupplyItem;
  onAddCheckpointClick: () => void;
}

export const CheckpointTimeline: React.FC<CheckpointTimelineProps> = ({ item, onAddCheckpointClick }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ORIGIN_HARVESTED':
        return <span className="badge badge-emerald">Origin Harvested</span>;
      case 'PROCESSING_STARTED':
        return <span className="badge badge-blue">Processing Started</span>;
      case 'QUALITY_PASSED':
        return <span className="badge badge-emerald">Quality Passed</span>;
      case 'IN_TRANSIT':
        return <span className="badge badge-amber">In Transit</span>;
      case 'CUSTOMS_CLEARED':
        return <span className="badge badge-purple">Customs Cleared</span>;
      case 'WAREHOUSE_RECEIVED':
        return <span className="badge badge-blue">Warehouse Received</span>;
      case 'RETAIL_DELIVERED':
        return <span className="badge badge-emerald">Retail Delivered</span>;
      case 'VERIFIED_CONSUMER':
        return <span className="badge badge-emerald">Verified Consumer</span>;
      default:
        return <span className="badge badge-blue">{status}</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Tamper-Evident History Timeline
            </h2>
            {getStatusBadge(item.currentStatus)}
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Immutable Soroban Smart Contract Audit Log for {item.id}
          </p>
        </div>

        <button className="btn-primary" onClick={onAddCheckpointClick}>
          + Append Checkpoint Scan
        </button>
      </div>

      {/* Item Metadata Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        marginBottom: '1.75rem'
      }}>
        <div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>Batch / Lot ID</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.batchNumber}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>Category</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.category}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>Temperature Target</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#60a5fa' }}>{item.temperatureTarget || 'Standard Storage'}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>On-Chain Checkpoints</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399' }}>{item.checkpoints.length} Verified</span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        {/* Continuous vertical line */}
        <div style={{
          position: 'absolute',
          top: '10px',
          bottom: '10px',
          left: '7px',
          width: '2px',
          background: 'linear-gradient(to bottom, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)'
        }}></div>

        {item.checkpoints.map((cp, idx) => (
          <div key={idx} style={{ position: 'relative', marginBottom: '1.75rem' }}>
            {/* Step Marker Node */}
            <div style={{
              position: 'absolute',
              left: '-1.5rem',
              top: '4px',
              transform: 'translateX(-50%)',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: idx === item.checkpoints.length - 1 ? '#10b981' : '#1e293b',
              border: '3px solid #090d16',
              boxShadow: idx === item.checkpoints.length - 1 ? '0 0 10px #10b981' : 'none',
              zIndex: 2
            }}></div>

            {/* Checkpoint Detail Card */}
            <div className="glass-card" style={{ marginLeft: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.12)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    #{cp.index}
                  </span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {cp.location}
                  </div>
                  {getStatusBadge(cp.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  <span>{new Date(cp.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                {cp.notes}
              </div>

              {/* Verification & Tx Hash */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.65rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.725rem',
                color: 'var(--text-muted)',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={13} color="#3b82f6" />
                  <span>Verified By:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                    {cp.verifiedBy.substring(0, 8)}...{cp.verifiedBy.substring(cp.verifiedBy.length - 4)}
                  </span>
                </div>

                {cp.txHash && (
                  <a
                    href={`${STELLAR_CONFIG.EXPLORER_BASE}/tx/${cp.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#34d399',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600
                    }}
                  >
                    <span>Tx: {cp.txHash.substring(0, 8)}...</span>
                    <ArrowUpRight size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
