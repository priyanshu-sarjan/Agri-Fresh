import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Printer, Download, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface BatchData {
  batchId: number | string;
  cropName: string;
  farmer: string;
  location: string;
  quantityKg: number | string;
  ipfsHash: string;
  status: string;
  contractAddress?: string;
}

interface QRBatchGeneratorProps {
  batch: BatchData;
}

export const QRBatchGenerator: React.FC<QRBatchGeneratorProps> = ({ batch }) => {
  const contractAddr = batch.contractAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const qrData = JSON.stringify({
    protocol: 'AgriTraceLink-Solidity',
    contractAddress: contractAddr,
    batchId: batch.batchId,
    cropName: batch.cropName,
    ipfsHash: batch.ipfsHash,
    status: batch.status,
    verificationUrl: `https://agri-fresh.vercel.app/verify/${batch.batchId}`
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ShieldCheck size={20} color="#10b981" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Agri-Fresh On-Chain QR Passport</h3>
      </div>

      <div style={{
        background: '#ffffff',
        padding: '1.25rem',
        borderRadius: '16px',
        display: 'inline-block',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
        marginBottom: '1rem'
      }}>
        <QRCodeSVG
          value={qrData}
          size={180}
          level="H"
          includeMargin={false}
        />
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 800, color: '#34d399', marginBottom: '0.25rem' }}>
        Batch #{batch.batchId} — {batch.cropName}
      </div>

      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
        IPFS Metadata: <code style={{ color: '#60a5fa' }}>{batch.ipfsHash ? `${batch.ipfsHash.substring(0, 12)}...` : 'QmX7...'}</code>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
        <button className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.775rem' }} onClick={handlePrint}>
          <Printer size={14} /> Print QR Passport
        </button>
      </div>
    </div>
  );
};
