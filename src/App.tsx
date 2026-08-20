import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { QRScannerModal } from './components/QRScannerModal';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { CheckpointTimeline } from './components/CheckpointTimeline';
import { CreateItemModal } from './components/CreateItemModal';
import { AddCheckpointModal } from './components/AddCheckpointModal';
import { EventFeed } from './components/EventFeed';
import { TransactionTracker } from './components/TransactionTracker';
import { ErrorBanner } from './components/ErrorBanner';

import { walletService } from './services/stellarWallet';
import { sorobanService } from './services/sorobanContract';
import { SupplyItem, WalletState, UserRole, CheckpointStatus, TransactionStatus, Checkpoint } from './types';
import { ShieldCheck, Search, Filter, Plus, QrCode, Cpu, Layers, Activity, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { STELLAR_CONFIG } from './config/stellar';

export const App: React.FC = () => {
  const [walletState, setWalletState] = useState<WalletState>(walletService.getState());
  const [items, setItems] = useState<SupplyItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SupplyItem | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('PRODUCER');

  // Modals
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddCheckpointOpen, setIsAddCheckpointOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Status & Error Trackers
  const [txStatus, setTxStatus] = useState<TransactionStatus | null>(null);
  const [activeError, setActiveError] = useState<any | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await sorobanService.getItems();
    setItems(data);
    if (data.length > 0 && !selectedItem) {
      setSelectedItem(data[0]);
    }
  };

  const handleScanSuccess = async (scannedId: string) => {
    const found = items.find(i => i.id === scannedId || i.batchNumber === scannedId);
    if (found) {
      setSelectedItem(found);
      setIsAddCheckpointOpen(true);
    } else {
      setActiveError(`Scanned item ID '${scannedId}' was not found on contract state.`);
    }
  };

  const handleItemCreated = (newItem: SupplyItem) => {
    setItems(prev => [newItem, ...prev]);
    setSelectedItem(newItem);
  };

  const handleCheckpointAdded = (newCp: Checkpoint) => {
    if (selectedItem) {
      const updatedItem = {
        ...selectedItem,
        checkpoints: [...selectedItem.checkpoints, newCp],
        checkpointCount: selectedItem.checkpoints.length + 1,
        currentStatus: newCp.status
      };
      setSelectedItem(updatedItem);
      setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.origin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalCheckpoints = items.reduce((acc, curr) => acc + curr.checkpoints.length, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar
        walletState={walletState}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem', width: '100%', flex: 1 }}>
        {/* Protocol Hero & Metrics Banner */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-emerald">Stellar Yellow Belt Project</span>
                <span className="badge badge-purple">Soroban Contract v21.0</span>
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                Decentralized Supply Chain Verification Engine
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Tamper-evident batch origin tracking, instant QR checkpoint scanning, and real-time multi-party role authorization verified on Stellar Testnet.
              </p>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div className="glass-card" style={{ textAlign: 'center', padding: '0.85rem 0.5rem' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  {items.length}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Batches Tracked</div>
              </div>

              <div className="glass-card" style={{ textAlign: 'center', padding: '0.85rem 0.5rem' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                  {totalCheckpoints}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified Scans</div>
              </div>

              <div className="glass-card" style={{ textAlign: 'center', padding: '0.85rem 0.5rem' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>
                  5 sec
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ledger Finality</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          {/* Left Column: Search, Product Cards & Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Search & Category Filter */}
            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '220px' }}>
                <Search size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search batches by ID, title, origin, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={14} color="var(--text-muted)" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select"
                  style={{ padding: '0.4rem 0.65rem', fontSize: '0.775rem', width: 'auto' }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Botanical Extracts">Botanical Extracts</option>
                  <option value="Pharmaceutical Cold Chain">Pharmaceutical Cold Chain</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className="glass-card"
                    style={{
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      boxShadow: isSelected ? '0 0 20px var(--primary-glow)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>
                        {item.id}
                      </span>
                      <span className="badge badge-blue">{item.category}</span>
                    </div>

                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                      {item.name}
                    </h3>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>Origin: {item.origin.substring(0, 35)}...</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: '#60a5fa', fontWeight: 600 }}>{item.checkpoints.length}</span> Checkpoints
                      </div>

                      <button
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.725rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setIsAddCheckpointOpen(true);
                        }}
                      >
                        + Add Scan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkpoint Timeline Component */}
            {selectedItem && (
              <CheckpointTimeline
                item={selectedItem}
                onAddCheckpointClick={() => setIsAddCheckpointOpen(true)}
              />
            )}
          </div>

          {/* Right Column: QR Generator & Live Event Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {selectedItem && <QRCodeGenerator item={selectedItem} />}
            <EventFeed />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 1.5rem', textAlign: 'center', fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
        <div>
          TraceLink Protocol &copy; 2026 | Built for Stellar Level 2 (Yellow Belt) Submission
        </div>
        <div style={{ marginTop: '0.35rem' }}>
          Contract ID: <a href={`${STELLAR_CONFIG.EXPLORER_BASE}/contract/${STELLAR_CONFIG.CONTRACT_ID}`} target="_blank" rel="noreferrer" style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{STELLAR_CONFIG.CONTRACT_ID}</a>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletState={walletState}
        onWalletUpdated={setWalletState}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onItemCreated={handleItemCreated}
        onTransactionStatus={setTxStatus}
        onError={setActiveError}
      />

      <AddCheckpointModal
        isOpen={isAddCheckpointOpen}
        onClose={() => setIsAddCheckpointOpen(false)}
        item={selectedItem}
        onCheckpointAdded={handleCheckpointAdded}
        onTransactionStatus={setTxStatus}
        onError={setActiveError}
      />

      <TransactionTracker
        status={txStatus}
        onClose={() => setTxStatus(null)}
      />

      <ErrorBanner
        error={activeError}
        onClose={() => setActiveError(null)}
        onWalletUpdated={setWalletState}
      />
    </div>
  );
};
