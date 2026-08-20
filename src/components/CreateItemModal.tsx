import React, { useState } from 'react';
import { X, ShieldPlus, Package, MapPin, Tag, Thermometer } from 'lucide-react';
import { sorobanService } from '../services/sorobanContract';
import { eventStreamService } from '../services/eventStream';
import { SupplyItem, TransactionStatus } from '../types';
import confetti from 'canvas-confetti';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated: (item: SupplyItem) => void;
  onTransactionStatus: (status: TransactionStatus) => void;
  onError: (err: any) => void;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  onClose,
  onItemCreated,
  onTransactionStatus,
  onError,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Botanical Extracts');
  const [origin, setOrigin] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [tempTarget, setTempTarget] = useState('15°C - 25°C');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !origin.trim()) return;

    setIsSubmitting(true);
    try {
      const { item, txHash } = await sorobanService.createItem(
        name.trim(),
        category,
        origin.trim(),
        batchNumber.trim() || `BATCH-${Date.now().toString().slice(-6)}`,
        tempTarget,
        onTransactionStatus
      );

      // Publish event
      eventStreamService.publishEvent(
        'ITEM_CREATED',
        item.id,
        item.manufacturer,
        `Registered new supply item '${name}' at ${origin}`,
        txHash
      );

      // Trigger success confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onItemCreated(item);
      onClose();
      // Reset form
      setName('');
      setOrigin('');
      setBatchNumber('');
    } catch (err: any) {
      onError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldPlus size={20} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Register Batch on Stellar</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mint new origin record on Soroban smart contract</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Product / Batch Title *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Organic Moringa Leaf Extract #901"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Category
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Botanical Extracts">Botanical Extracts</option>
                <option value="Pharmaceutical Cold Chain">Pharmaceutical Cold Chain</option>
                <option value="Organic Superfoods">Organic Superfoods</option>
                <option value="Dairy & Milk Operations">Dairy & Milk Operations</option>
                <option value="High-Value Electronics">High-Value Electronics</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Batch / Lot Number
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. LOT-2026-MOR901"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Origin Location & Geo-Coordinates *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Assam Estate 4, India (Lat: 26.14, Long: 91.73)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Storage / Temperature Target
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 2°C - 8°C or Dry Ambient (15-25°C)"
              value={tempTarget}
              onChange={(e) => setTempTarget(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing to Soroban...' : 'Sign & Submit to Stellar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
