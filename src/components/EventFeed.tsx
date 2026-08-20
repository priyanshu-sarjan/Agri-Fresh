import React, { useEffect, useState } from 'react';
import { ContractEvent } from '../types';
import { eventStreamService } from '../services/eventStream';
import { Activity, Radio, ExternalLink, Zap } from 'lucide-react';
import { STELLAR_CONFIG } from '../config/stellar';

export const EventFeed: React.FC = () => {
  const [events, setEvents] = useState<ContractEvent[]>([
    {
      id: 'evt-init-1',
      type: 'CHECKPOINT_ADDED',
      itemId: 'TL-HERB-892',
      actor: 'GB56C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V',
      details: 'HPLC Withanolide content verified at 5.2%. Lab test passed.',
      timestamp: Date.now() - 3600000 * 2,
      txHash: 'a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4'
    },
    {
      id: 'evt-init-2',
      type: 'ITEM_CREATED',
      itemId: 'TL-MED-411',
      actor: 'GC78D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W',
      details: 'Registered batch Cold-Chain Insulin Vials Lot #411 on Soroban',
      timestamp: Date.now() - 3600000 * 5,
      txHash: 'b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5'
    }
  ]);

  useEffect(() => {
    const unsubscribe = eventStreamService.subscribe((newEvent) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    });
    return () => unsubscribe();
  }, []);

  const getEventBadge = (type: ContractEvent['type']) => {
    switch (type) {
      case 'ITEM_CREATED':
        return <span className="badge badge-emerald">Item Created</span>;
      case 'CHECKPOINT_ADDED':
        return <span className="badge badge-blue">Checkpoint Appended</span>;
      case 'ITEM_VERIFIED':
        return <span className="badge badge-purple">Verified Scan</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)' }}>
            <Radio size={16} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Live Contract Event Stream</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          <span className="pulse-dot"></span>
          <span>Soroban RPC Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
        {events.map((evt) => (
          <div key={evt.id} className="glass-card" style={{ padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getEventBadge(evt.type)}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.775rem', fontWeight: 700, color: '#34d399' }}>
                  {evt.itemId}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div style={{ fontSize: '0.775rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              {evt.details}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>Actor: {evt.actor.substring(0, 6)}...{evt.actor.substring(evt.actor.length - 4)}</span>
              <a
                href={`${STELLAR_CONFIG.EXPLORER_BASE}/tx/${evt.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem', fontFamily: 'var(--font-mono)' }}
              >
                Tx: {evt.txHash.substring(0, 6)}... <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
