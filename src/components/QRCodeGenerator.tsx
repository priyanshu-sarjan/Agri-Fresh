import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { SupplyItem } from '../types';
import { QrCode, ExternalLink, Printer } from 'lucide-react';
import { STELLAR_CONFIG } from '../config/stellar';

interface QRCodeGeneratorProps {
  item: SupplyItem;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ item }) => {
  const qrData = JSON.stringify({
    protocol: 'TraceLink-Stellar',
    contractId: STELLAR_CONFIG.CONTRACT_ID,
    itemId: item.id,
    batchNumber: item.batchNumber,
    status: item.currentStatus
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <QrCode size={18} color="#10b981" />
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Tamper-Evident QR Badge</h4>
      </div>

      <div style={{
        background: '#ffffff',
        padding: '1.25rem',
        borderRadius: '12px',
        display: 'inline-block',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
        marginBottom: '0.85rem'
      }}>
        <QRCodeSVG
          value={qrData}
          size={160}
          level="H"
          includeMargin={false}
        />
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '0.25rem' }}>
        {item.id}
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
        {item.batchNumber}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={handlePrint}>
          <Printer size={12} /> Print Passport
        </button>
      </div>
    </div>
  );
};
