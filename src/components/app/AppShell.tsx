import React, { useState } from 'react';
import { Header } from './Header';
import { TabBar, type TabId } from './TabBar';
import { Toast } from '@/components/ui/Toast';
import { LockScreen } from './LockScreen';
import { SettingsSheet } from './SettingsSheet';
import { TodayPage } from '@/pages/app/Today';
import { SubscriptionsPage } from '@/pages/app/Subscriptions';
import { SubscriptionDetail } from '@/pages/app/SubscriptionDetail';
import { TrialsPage } from '@/pages/app/Trials';
import { ConnectPage } from '@/pages/app/Connect';
import { useAppStore } from '@/store/useAppStore';
import type { Subscription, AppNotification } from '@/data/types';

export interface AppShellProps {
  initialTab?: TabId | 'connect';
  onNavigatePlan?: () => void;
}

export function AppShell({ initialTab = 'today' }: AppShellProps) {
  const [activeTab, setActiveTab] = useState<TabId>(
    initialTab === 'connect' ? 'today' : initialTab
  );
  const [isConnectMode, setIsConnectMode] = useState(initialTab === 'connect');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastActionLabel, setToastActionLabel] = useState<string | undefined>(undefined);
  const [toastAction, setToastAction] = useState<(() => void) | undefined>(undefined);

  const activeNotification = useAppStore((state) => state.activeNotification);
  const dismissNotification = useAppStore((state) => state.dismissNotification);

  const showToast = (msg: string, actionLabel?: string, onAction?: () => void) => {
    setToastMessage(msg);
    setToastActionLabel(actionLabel);
    setToastAction(() => onAction);
  };

  const handleNotificationTap = (notif: AppNotification) => {
    dismissNotification();
    setIsConnectMode(false);
    setSelectedSubscription(null);
    setActiveTab('trials');
  };

  const getHeaderTitle = () => {
    if (isConnectMode) return 'Connect';
    if (selectedSubscription) return '';
    if (activeTab === 'today') return 'Today';
    if (activeTab === 'subscriptions') return 'Subscriptions';
    if (activeTab === 'trials') return 'Trials';
    return 'Save Me';
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-bg overflow-hidden select-none">
      {/* App Header (Hidden during connect or detail) */}
      {!isConnectMode && !selectedSubscription && (
        <Header
          title={getHeaderTitle()}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {isConnectMode ? (
          <ConnectPage
            onComplete={() => {
              setIsConnectMode(false);
              setActiveTab('today');
            }}
          />
        ) : selectedSubscription ? (
          <SubscriptionDetail
            subscription={selectedSubscription}
            onBack={() => setSelectedSubscription(null)}
            onShowToast={showToast}
          />
        ) : activeTab === 'today' ? (
          <TodayPage
            onSelectSubscription={(sub) => setSelectedSubscription(sub)}
            onNavigateToSubscriptions={() => setActiveTab('subscriptions')}
          />
        ) : activeTab === 'subscriptions' ? (
          <SubscriptionsPage
            onSelectSubscription={(sub) => setSelectedSubscription(sub)}
          />
        ) : (
          <TrialsPage onShowToast={showToast} />
        )}
      </main>

      {/* Tab Navigation (Hidden during connect or detail) */}
      {!isConnectMode && !selectedSubscription && (
        <TabBar
          currentTab={activeTab}
          onTabChange={(tab) => {
            setSelectedSubscription(null);
            setActiveTab(tab);
          }}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast
        message={toastMessage}
        actionLabel={toastActionLabel}
        onAction={toastAction}
        onDismiss={() => setToastMessage(null)}
      />

      {/* Push Notification Lock Screen Simulation */}
      <LockScreen
        notification={activeNotification}
        onTapNotification={handleNotificationTap}
        onDismiss={dismissNotification}
      />

      {/* Settings Modal */}
      <SettingsSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onNavigateToConnect={() => {
          setIsConnectMode(true);
          setSelectedSubscription(null);
        }}
      />
    </div>
  );
}
