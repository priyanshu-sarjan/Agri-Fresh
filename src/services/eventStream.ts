import { ContractEvent } from '../types';

type EventCallback = (event: ContractEvent) => void;

export class EventStreamService {
  private static instance: EventStreamService;
  private subscribers: EventCallback[] = [];
  private isStreaming: boolean = false;
  private intervalId: any = null;

  private constructor() {
    this.startStreaming();
  }

  public static getInstance(): EventStreamService {
    if (!EventStreamService.instance) {
      EventStreamService.instance = new EventStreamService();
    }
    return EventStreamService.instance;
  }

  public subscribe(callback: EventCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notify(event: ContractEvent) {
    this.subscribers.forEach(cb => cb(event));
  }

  public publishEvent(
    type: ContractEvent['type'],
    itemId: string,
    actor: string,
    details: string,
    txHash: string
  ) {
    const newEvent: ContractEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      itemId,
      actor,
      details,
      timestamp: Date.now(),
      txHash
    };
    this.notify(newEvent);
  }

  public startStreaming() {
    if (this.isStreaming) return;
    this.isStreaming = true;

    // Periodic heartbeat / simulated background network events for demonstration
    this.intervalId = setInterval(() => {
      const mockActors = [
        'GB56C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V',
        'GC78D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W',
        'GD90E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X'
      ];
      const randomActor = mockActors[Math.floor(Math.random() * mockActors.length)];
      const randomTxHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      if (Math.random() > 0.6) {
        this.publishEvent(
          'CHECKPOINT_ADDED',
          'TL-HERB-892',
          randomActor,
          'GPS & Cold-Chain Sensor Verification Heartbeat Received',
          randomTxHash
        );
      }
    }, 18000);
  }

  public stopStreaming() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.isStreaming = false;
  }
}

export const eventStreamService = EventStreamService.getInstance();
