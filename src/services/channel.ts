export type ChannelEvent =
  | { type: 'ORDER_CREATED'; payload: any }
  | { type: 'ORDER_UPDATED'; payload: { orderId: string; status: string } }
  | { type: 'ITEM_AVAILABILITY_CHANGED'; payload: { menuItemId: string; isSoldOut: boolean } }
  | { type: 'TENANT_THEME_CHANGED'; payload: { tenantId: string } };

class RealtimeChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: ((event: ChannelEvent) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('cirqla');
        this.channel.onmessage = (messageEvent) => {
          this.notifyListeners(messageEvent.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported or blocked in this environment', err);
      }
    }
  }

  public subscribe(callback: (event: ChannelEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  public publish(event: ChannelEvent): void {
    // Notify local listeners in this tab
    this.notifyListeners(event);

    // Notify other tabs
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (err) {
        console.warn('Failed to postMessage on BroadcastChannel', err);
      }
    }
  }

  private notifyListeners(event: ChannelEvent): void {
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (e) {
        console.error('Error in BroadcastChannel listener', e);
      }
    });
  }
}

export const cirqlaChannel = new RealtimeChannel();
