import React, { useEffect, useState } from 'react';
import { X, QrCode, Camera, CheckCircle2, ArrowRight, Upload } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedData: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (isOpen) {
      const qrRegionId = 'qr-reader-element';
      const container = document.getElementById(qrRegionId);

      if (container) {
        html5QrCode = new Html5Qrcode(qrRegionId);
        setIsScanning(true);

        html5QrCode
          .start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
              setScanStatus(`Scanned Item: ${decodedText}`);
              onScanSuccess(decodedText);
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
              }
              onClose();
            },
            () => {}
          )
          .catch((err) => {
            console.warn('Camera access unavailable:', err);
            setIsScanning(false);
          });
      }
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={20} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>QR Checkpoint Scanner</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scan product QR code to log location & status on-chain</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Camera Feed Viewport */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '250px',
          background: '#04070d',
          borderRadius: '14px',
          border: '1px dashed var(--border-glow)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '1.25rem'
        }}>
          <div id="qr-reader-element" style={{ width: '100%' }}></div>

          {!isScanning && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <Camera size={40} color="#3b82f6" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Camera Initializing / Unavailable
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                You can use manual ID entry below to simulate QR scanning
              </div>
            </div>
          )}

          {scanStatus && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              background: 'rgba(16, 185, 129, 0.9)',
              color: '#ffffff',
              padding: '0.5rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              {scanStatus}
            </div>
          )}
        </div>

        {/* Manual ID Input Fallback */}
        <form onSubmit={handleManualSubmit}>
          <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Or Enter Item / Batch ID Manually:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. TL-HERB-892 or TL-MED-411"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
              Verify <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* Quick Demo Options */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Quick Demo Presets:</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => { onScanSuccess('TL-HERB-892'); onClose(); }}
              className="btn-secondary"
              style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem' }}
            >
              Scan TL-HERB-892
            </button>
            <button
              onClick={() => { onScanSuccess('TL-MED-411'); onClose(); }}
              className="btn-secondary"
              style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem' }}
            >
              Scan TL-MED-411
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
