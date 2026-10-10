import { create } from 'zustand';
import {
  Part,
  CommercialEvent,
  Quotation,
  Order,
  Invoice,
  DocumentRecord,
  DuplicatePair,
  DriveFileRelink,
  AttentionItem,
  NotificationItem,
} from '../mock/types';
import {
  SEED_PARTS,
  SEED_COMMERCIAL_EVENTS,
  SEED_QUOTATIONS,
  SEED_ORDERS,
  SEED_INVOICES,
  SEED_DOCUMENTS,
  SEED_DUPLICATE_PAIRS,
  SEED_DRIVE_RELINKS,
  SEED_ATTENTION_ITEMS,
  SEED_NOTIFICATIONS,
} from '../mock/db';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export type UserRole = 'Sales' | 'Buyer' | 'Finance' | 'Director' | 'Admin';

export interface MigrationState {
  inventory: number;
  normalized: number;
  deduped: number;
  relinked: number;
  validated: number;
  isRunning: boolean;
  lastSummary?: string;
}

export interface AppState {
  // Navigation & User
  currentEntity: 'consolidated' | 'peru' | 'zambia' | 'international';
  currentRole: UserRole;
  language: 'EN' | 'ES';
  isCommandPaletteOpen: boolean;
  clearedAttentionCount: number;

  // Data collections
  parts: Part[];
  commercialEvents: CommercialEvent[];
  quotations: Quotation[];
  orders: Order[];
  invoices: Invoice[];
  documents: DocumentRecord[];
  duplicatePairs: DuplicatePair[];
  driveRelinks: DriveFileRelink[];
  attentionItems: AttentionItem[];
  notifications: NotificationItem[];
  toasts: ToastItem[];
  migrationState: MigrationState;
  permissionMatrix: Record<string, Record<string, 'None' | 'View' | 'Edit' | 'Approve'>>;

  // Actions
  setEntity: (entity: 'consolidated' | 'peru' | 'zambia' | 'international') => void;
  setRole: (role: UserRole) => void;
  toggleLanguage: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  markAttentionDone: (id: string) => void;
  markNotificationRead: (id: string) => void;
  
  // Commercial actions (relational ripples)
  registerPayment: (params: {
    invoiceId: string;
    amount: number;
    date: string;
    method: string;
    bankRef: string;
  }) => void;
  recordDelivery: (params: {
    orderId: string;
    items: Array<{ partId: string; qty: number }>;
    waybill: string;
    carrier: string;
    date: string;
  }) => void;
  mergeDuplicatePair: (pairId: string, action: 'merge' | 'keep_separate' | 'alternative_added') => void;
  addQuotation: (quotation: Quotation) => void;
  convertQuotationToOrder: (quotationId: string) => string;
  runSampleMigration: () => Promise<void>;
  cyclePermission: (role: string, module: string) => void;
  resetDemoData: () => void;
}

const DEFAULT_PERMISSION_MATRIX: Record<string, Record<string, 'None' | 'View' | 'Edit' | 'Approve'>> = {
  Sales: { Parts: 'View', Pricing: 'View', RFQ: 'Edit', Orders: 'View', Finance: 'None', Admin: 'None' },
  Buyer: { Parts: 'View', Pricing: 'Edit', RFQ: 'View', Orders: 'Edit', Finance: 'None', Admin: 'None' },
  Finance: { Parts: 'View', Pricing: 'View', RFQ: 'View', Orders: 'View', Finance: 'Approve', Admin: 'None' },
  Director: { Parts: 'Approve', Pricing: 'Approve', RFQ: 'Approve', Orders: 'Approve', Finance: 'Approve', Admin: 'View' },
  Admin: { Parts: 'Approve', Pricing: 'Approve', RFQ: 'Approve', Orders: 'Approve', Finance: 'Approve', Admin: 'Approve' },
};

const STORAGE_KEY = 'stratum-demo-v1';

function loadPersistedState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: AppState) {
  try {
    const subset = {
      currentEntity: state.currentEntity,
      currentRole: state.currentRole,
      language: state.language,
      clearedAttentionCount: state.clearedAttentionCount,
      parts: state.parts,
      commercialEvents: state.commercialEvents,
      quotations: state.quotations,
      orders: state.orders,
      invoices: state.invoices,
      documents: state.documents,
      duplicatePairs: state.duplicatePairs,
      driveRelinks: state.driveRelinks,
      attentionItems: state.attentionItems,
      notifications: state.notifications,
      migrationState: state.migrationState,
      permissionMatrix: state.permissionMatrix,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subset));
  } catch (err) {
    console.error('Failed to persist to localStorage', err);
  }
}

export const useStore = create<AppState>((set, get) => {
  const persisted = loadPersistedState();

  const initialState = {
    currentEntity: (persisted?.currentEntity as any) || 'peru',
    currentRole: persisted?.currentRole || 'Sales',
    language: persisted?.language || 'EN',
    isCommandPaletteOpen: false,
    clearedAttentionCount: persisted?.clearedAttentionCount || 0,

    parts: persisted?.parts || SEED_PARTS,
    commercialEvents: persisted?.commercialEvents || SEED_COMMERCIAL_EVENTS,
    quotations: persisted?.quotations || SEED_QUOTATIONS,
    orders: persisted?.orders || SEED_ORDERS,
    invoices: persisted?.invoices || SEED_INVOICES,
    documents: persisted?.documents || SEED_DOCUMENTS,
    duplicatePairs: persisted?.duplicatePairs || SEED_DUPLICATE_PAIRS,
    driveRelinks: persisted?.driveRelinks || SEED_DRIVE_RELINKS,
    attentionItems: persisted?.attentionItems || SEED_ATTENTION_ITEMS,
    notifications: persisted?.notifications || SEED_NOTIFICATIONS,
    toasts: [],
    migrationState: persisted?.migrationState || {
      inventory: 18420,
      normalized: 14200,
      deduped: 4812,
      relinked: 2860,
      validated: 97.2,
      isRunning: false,
      lastSummary: '4,812 parts consolidated from 6,903 raw rows · 1,214 duplicates resolved · 97.2% of invoices linked to parts',
    },
    permissionMatrix: persisted?.permissionMatrix || DEFAULT_PERMISSION_MATRIX,
  };

  return {
    ...initialState,

    setEntity: (entity) => {
      set({ currentEntity: entity });
      saveState(get());
    },

    setRole: (role) => {
      set({ currentRole: role });
      get().addToast(`Switched active view to role: ${role}`, 'info');
      saveState(get());
    },

    toggleLanguage: () => {
      const nextLang = get().language === 'EN' ? 'ES' : 'EN';
      set({ language: nextLang });
      get().addToast(`Language toggle: ${nextLang} (Visual sample)`, 'info');
      saveState(get());
    },

    setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

    addToast: (message, type = 'success') => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      set((state) => ({
        toasts: [...state.toasts, { id, message, type }],
      }));
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },

    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },

    markAttentionDone: (id) => {
      set((state) => ({
        attentionItems: state.attentionItems.map((item) =>
          item.id === id ? { ...item, done: true } : item
        ),
        clearedAttentionCount: state.clearedAttentionCount + 1,
      }));
      get().addToast('Action marked completed', 'success');
      saveState(get());
    },

    markNotificationRead: (id) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
      saveState(get());
    },

    registerPayment: ({ invoiceId, amount, date, method, bankRef }) => {
      set((state) => {
        const nextInvoices = state.invoices.map((inv) => {
          if (inv.id !== invoiceId) return inv;
          const nextPaid = inv.paid + amount;
          const nextBalance = Math.max(0, inv.amount - nextPaid);
          const nextStatus = nextBalance === 0 ? 'Paid' : 'Partial';

          const nextMilestones = inv.milestones.map((ms, idx) => {
            // mark earliest unpaid milestone paid if covered
            if (!ms.paid && nextPaid >= ms.amount) {
              return { ...ms, paid: true };
            }
            return ms;
          });

          return {
            ...inv,
            paid: nextPaid,
            balance: nextBalance,
            status: nextStatus as any,
            milestones: nextMilestones,
            payments: [
              ...inv.payments,
              {
                id: 'pay-' + Date.now(),
                date,
                amount,
                currency: inv.currency,
                method,
                bankRef,
              },
            ],
          };
        });

        // Add commercial activity event
        const inv = state.invoices.find((i) => i.id === invoiceId);
        const newNotif: NotificationItem = {
          id: 'notif-' + Date.now(),
          title: `Payment of USD ${amount.toLocaleString()} registered against ${invoiceId}`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'success',
        };

        return {
          invoices: nextInvoices,
          notifications: [newNotif, ...state.notifications],
        };
      });

      get().addToast(`Payment of USD ${amount.toLocaleString()} registered against ${invoiceId}`, 'success');
      saveState(get());
    },

    recordDelivery: ({ orderId, items, waybill, carrier, date }) => {
      set((state) => {
        const nextOrders = state.orders.map((order) => {
          if (order.id !== orderId) return order;

          const nextLines = order.lines.map((line) => {
            const deliveredItem = items.find((i) => i.partId === line.partId);
            if (!deliveredItem) return line;
            const newDelivered = line.deliveredQty + deliveredItem.qty;
            const newInTransit = Math.max(0, line.inTransitQty - deliveredItem.qty);
            return {
              ...line,
              deliveredQty: newDelivered,
              inTransitQty: newInTransit,
            };
          });

          const allDelivered = nextLines.every((l) => l.deliveredQty >= l.orderedQty);
          const anyDelivered = nextLines.some((l) => l.deliveredQty > 0);
          const nextStatus = allDelivered
            ? 'Delivered'
            : anyDelivered
            ? 'Partially Delivered'
            : order.fulfillmentStatus;

          return {
            ...order,
            lines: nextLines,
            fulfillmentStatus: nextStatus as any,
            deliveries: [
              ...order.deliveries,
              {
                id: 'del-' + Date.now(),
                date,
                waybill,
                carrier,
                items,
              },
            ],
          };
        });

        const newNotif: NotificationItem = {
          id: 'notif-' + Date.now(),
          title: `Delivery ${waybill} recorded for order ${orderId}`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'success',
        };

        return {
          orders: nextOrders,
          notifications: [newNotif, ...state.notifications],
        };
      });

      get().addToast(`Partial delivery ${waybill} recorded successfully`, 'success');
      saveState(get());
    },

    mergeDuplicatePair: (pairId, action) => {
      set((state) => {
        const pair = state.duplicatePairs.find((p) => p.id === pairId);
        if (!pair) return state;

        const nextStatus: DuplicatePair['status'] =
          action === 'merge' ? 'merged' : action === 'keep_separate' ? 'kept_separate' : 'alternative_added';
        const nextPairs: DuplicatePair[] = state.duplicatePairs.map((p) =>
          p.id === pairId ? { ...p, status: nextStatus } : p
        );

        let toastMsg = 'Duplicate resolved';
        if (action === 'merge') {
          toastMsg = `Merged. OEM references consolidated under ${pair.partA.id}.`;
        } else if (action === 'alternative_added') {
          toastMsg = `Added ${pair.partB.id} as verified alternative to ${pair.partA.id}.`;
        } else {
          toastMsg = `Kept ${pair.partA.id} and ${pair.partB.id} as separate distinct parts.`;
        }

        return {
          duplicatePairs: nextPairs,
          toasts: [
            ...state.toasts,
            { id: 't-' + Date.now(), message: toastMsg, type: 'success' },
          ],
        };
      });
      saveState(get());
    },

    addQuotation: (quotation) => {
      set((state) => ({
        quotations: [quotation, ...state.quotations],
        documents: [
          {
            id: 'doc-' + Date.now(),
            type: 'Quotation',
            ref: quotation.id,
            counterparty: quotation.customer,
            linkedRecord: quotation.rfqRef,
            date: quotation.date,
            amount: quotation.total,
            currency: quotation.currency,
            status: 'Issued',
            entityId: quotation.entityId,
          },
          ...state.documents,
        ],
        notifications: [
          {
            id: 'notif-' + Date.now(),
            title: `Quotation ${quotation.id} generated (${quotation.lines.length} lines, est. margin ${quotation.estimatedMargin}%)`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'success',
          },
          ...state.notifications,
        ],
      }));
      get().addToast(`Quotation ${quotation.id} created successfully`, 'success');
      saveState(get());
    },

    convertQuotationToOrder: (quotationId) => {
      const q = get().quotations.find((item) => item.id === quotationId);
      if (!q) return '';

      const newPoId = `PO-${q.entityId.toUpperCase().slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: newPoId,
        type: 'customer',
        counterparty: q.customer,
        entityId: q.entityId,
        date: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: '2026-11-15',
        total: q.total,
        currency: q.currency,
        paymentStatus: 'Unpaid',
        fulfillmentStatus: 'Pending',
        lines: q.lines.map((l) => ({
          partId: l.partId,
          description: l.description,
          orderedQty: l.qty,
          deliveredQty: 0,
          inTransitQty: 0,
          unitPrice: l.unitPrice,
        })),
        linkedOrders: [],
        deliveries: [],
      };

      set((state) => ({
        orders: [newOrder, ...state.orders],
        quotations: state.quotations.map((item) =>
          item.id === quotationId ? { ...item, status: 'Won' } : item
        ),
      }));

      get().addToast(`Quotation converted to Customer PO ${newPoId}`, 'success');
      saveState(get());
      return newPoId;
    },

    runSampleMigration: async () => {
      set((state) => ({
        migrationState: { ...state.migrationState, isRunning: true },
      }));

      // Simulate 5 steps progress over 3 seconds
      await new Promise((r) => setTimeout(r, 600));
      set((state) => ({
        migrationState: { ...state.migrationState, inventory: 18420, normalized: 15100 },
      }));

      await new Promise((r) => setTimeout(r, 600));
      set((state) => ({
        migrationState: { ...state.migrationState, normalized: 18420, deduped: 4812 },
      }));

      await new Promise((r) => setTimeout(r, 600));
      set((state) => ({
        migrationState: { ...state.migrationState, relinked: 2940 },
      }));

      await new Promise((r) => setTimeout(r, 600));
      set((state) => ({
        migrationState: {
          ...state.migrationState,
          validated: 98.4,
          isRunning: false,
          lastSummary: 'Scan complete: 4,812 parts consolidated from 6,903 raw rows · 1,214 duplicates resolved · 98.4% of invoices linked',
        },
      }));

      get().addToast('Sample migration pipeline run completed successfully', 'success');
      saveState(get());
    },

    cyclePermission: (role, module) => {
      const cycle: Array<'None' | 'View' | 'Edit' | 'Approve'> = ['None', 'View', 'Edit', 'Approve'];
      set((state) => {
        const current = state.permissionMatrix[role]?.[module] || 'None';
        const nextIdx = (cycle.indexOf(current) + 1) % cycle.length;
        const nextVal = cycle[nextIdx];

        const nextMatrix = {
          ...state.permissionMatrix,
          [role]: {
            ...state.permissionMatrix[role],
            [module]: nextVal,
          },
        };

        return { permissionMatrix: nextMatrix };
      });
      get().addToast(`Updated ${role} → ${module} permission`, 'info');
      saveState(get());
    },

    resetDemoData: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({
        currentEntity: 'peru',
        currentRole: 'Sales',
        language: 'EN',
        clearedAttentionCount: 0,
        parts: SEED_PARTS,
        commercialEvents: SEED_COMMERCIAL_EVENTS,
        quotations: SEED_QUOTATIONS,
        orders: SEED_ORDERS,
        invoices: SEED_INVOICES,
        documents: SEED_DOCUMENTS,
        duplicatePairs: SEED_DUPLICATE_PAIRS,
        driveRelinks: SEED_DRIVE_RELINKS,
        attentionItems: SEED_ATTENTION_ITEMS,
        notifications: SEED_NOTIFICATIONS,
        permissionMatrix: DEFAULT_PERMISSION_MATRIX,
      });
      get().addToast('Demo database restored to default seed', 'info');
    },
  };
});
