import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckpointTimeline } from '../components/CheckpointTimeline';
import { ErrorBanner } from '../components/ErrorBanner';
import { DEFAULT_SUPPLY_ITEMS } from '../config/stellar';

describe('TraceLink Frontend UI Component Tests', () => {
  it('Test 4: Renders CheckpointTimeline with audit nodes & verified badges', () => {
    const mockItem = DEFAULT_SUPPLY_ITEMS[0];
    render(
      <CheckpointTimeline
        item={mockItem}
        onAddCheckpointClick={vi.fn()}
      />
    );

    expect(screen.getByText('Tamper-Evident History Timeline')).toBeDefined();
    expect(screen.getByText('Wayanad Harvest Farms, Kerala')).toBeDefined();
    expect(screen.getByText('National Botanical Testing Lab')).toBeDefined();
  });

  it('Test 5: ErrorBanner displays tailored guidance for Insufficient XLM Balance error', () => {
    render(
      <ErrorBanner
        error="INSUFFICIENT_BALANCE: Account requires at least 0.5 XLM reserve."
        onClose={vi.fn()}
        onWalletUpdated={vi.fn()}
      />
    );

    expect(screen.getByText(/Error 3\/3: Insufficient XLM Fee Balance/i)).toBeDefined();
    expect(screen.getByText(/1-Click Friendbot Top-Up/i)).toBeDefined();
  });
});
