import { BankConnectionError, SaveError } from './errors';
import { getLatency, wait } from './latency';
import type { Subscription, Trial, ReminderPrefs } from '@/data/types';
import { seedSubscriptions } from '@/data/seed.subscriptions';
import { seedTrials } from '@/data/seed.trials';
import type { DemoFlags } from '@/store/demoFlags';

export interface ApiClientOptions {
  getFlags: () => DemoFlags;
}

export class MockApiClient {
  constructor(private options: ApiClientOptions) {}

  async connectBank(bankName: string): Promise<{ success: boolean; subscriptionsCount: number }> {
    const flags = this.options.getFlags();
    await wait(getLatency('connectBank', flags.slowNetwork));

    if (flags.failNextConnect) {
      throw new BankConnectionError();
    }

    return {
      success: true,
      subscriptionsCount: 10,
    };
  }

  async getSubscriptions(): Promise<Subscription[]> {
    const flags = this.options.getFlags();
    await wait(getLatency('getSubscriptions', flags.slowNetwork));

    if (flags.showEmptyState) {
      return [];
    }

    return seedSubscriptions;
  }

  async getTrials(): Promise<Trial[]> {
    const flags = this.options.getFlags();
    await wait(getLatency('getTrials', flags.slowNetwork));

    if (flags.showEmptyState) {
      return [];
    }

    return seedTrials;
  }

  async addTrial(trial: Omit<Trial, 'id' | 'createdAt' | 'status'>): Promise<Trial> {
    const flags = this.options.getFlags();
    await wait(getLatency('addTrial', flags.slowNetwork));

    if (flags.failNextSave) {
      throw new SaveError();
    }

    const newTrial: Trial = {
      ...trial,
      id: `trial-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    return newTrial;
  }

  async setReminderPrefs(prefs: ReminderPrefs): Promise<ReminderPrefs> {
    const flags = this.options.getFlags();
    await wait(getLatency('setReminderPrefs', flags.slowNetwork));
    return prefs;
  }

  async deleteAllData(): Promise<{ success: boolean }> {
    const flags = this.options.getFlags();
    await wait(getLatency('deleteAllData', flags.slowNetwork));
    return { success: true };
  }
}
