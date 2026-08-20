import React, { useState } from 'react';
import { X, MapPin, CheckSquare, FileText, Send } from 'lucide-react';
import { sorobanService } from '../services/sorobanContract';
import { eventStreamService } from '../services/eventStream';
import { SupplyItem, CheckpointStatus, Checkpoint, TransactionStatus } from '../types';
import confetti from 'canvas-confetti';

interface AddCheckpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SupplyItem | null;
  onCheckpointAdded: (checkpoint: Checkpoint) => void;
  onTransactionStatus: (status: TransactionStatus) => void;
  onError: (err: any) => void;
}

export const AddCheckpointModal: React.FC<AddCheckpointModalProps> = ({
  isOpen,
  onClose,
  item,
  onCheckpointAdded,
  onTransactionStatus,
  onError,
}) => {
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<CheckpointStatus>('IN_TRANSIT');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsSubmitting(true);
    try {
      const { checkpoint, txHash } = await sorobanService.addCheckpoint(
        item.id,
        location.trim(),
        status,
        notes.trim(),
        onTransactionStatus
      );

      // Publish live stream event
      eventStreamService.publishEvent(
        'CHECKPOINT_ADDED',
        item.id,
        checkpoint.verifiedBy,
        `Checkpoint #${checkpoint.index} (${status}) logged at ${location}`,
        txHash
      );

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      onCheckpointAdded(checkpoint);
      onClose();
      setLocation('');
      setNotes('');
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
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={20} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Append Checkpoint Scan</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Item: <strong style={{ color: '#34d399' }}>{item.id}</strong> ({item.name})</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Checkpoint Status / Milestone *
            </label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as CheckpointStatus)}
            >
              <option value="PROCESSING_STARTED">Processing Started (Facility Inspection)</option>
              <option value="QUALITY_PASSED">Quality Control Passed (Lab Verified)</option>
              <option value="IN_TRANSIT">In Transit (Logistics Transport)</option>
              <option value="CUSTOMS_CLEARED">Customs Cleared (Port Authorization)</option>
              <option value="WAREHOUSE_RECEIVED">Warehouse Received (Distribution Center)</option>
              <option value="RETAIL_DELIVERED">Retail Delivered (Final Point of Sale)</option>
              <option value="VERIFIED_CONSUMER">Verified Consumer Scan</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Facility / Scanning Location *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Frankfurt Distribution Center Hub B"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Verification Notes & Sensor Data
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Temperature stable at 4.2°C. Seal intact. Quality certificate attached."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Recording on Ledger...' : 'Sign & Submit Checkpoint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
