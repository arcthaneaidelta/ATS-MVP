import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tenant, MenuItem, Order, OrderItem, OrderStatus } from '../types';
import { initialTenants } from '../data/seeds/tenants';
import { initialMenuItems } from '../data/seeds/menu';
import { getInitialOrders } from '../data/seeds/orders';
import { cirqlaChannel, ChannelEvent } from '../services/channel';

interface CirqlaState {
  tenants: Tenant[];
  menuItems: Record<string, MenuItem[]>;
  orders: Order[];
  nextOrderNumber: number;
  kitchenOpen: boolean;
  cart: OrderItem[];
  cartTip: number;
  cartCustomerName: string;
  cartNotes: string;
  cartTable: string;
  activeCustomerOrder: Order | null;
  activeTenantId: string;

  // Actions
  setActiveTenantId: (id: string) => void;
  setKitchenOpen: (open: boolean) => void;
  setCartTable: (table: string) => void;
  addToCart: (item: OrderItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  setCartTip: (tip: number) => void;
  setCartCustomerName: (name: string) => void;
  setCartNotes: (notes: string) => void;
  clearCart: () => void;
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleItemSoldOut: (tenantId: string, itemId: string) => void;
  updateMenuItem: (tenantId: string, item: MenuItem) => void;
  addMenuItem: (tenantId: string, item: MenuItem) => void;
  refundOrder: (orderId: string) => void;
  suspendTenant: (tenantId: string) => void;
  activateTenant: (tenantId: string) => void;
  changeTenantPlan: (tenantId: string, plan: 'Starter' | 'Growth' | 'Scale') => void;
  updateTenantAccent: (tenantId: string, accent: string) => void;
  handleRemoteEvent: (event: ChannelEvent) => void;
  simulateIncomingOrder: () => void;
}

export const useCirqlaStore = create<CirqlaState>()(
  persist(
    (set, get) => ({
      tenants: initialTenants,
      menuItems: initialMenuItems,
      orders: getInitialOrders(),
      nextOrderNumber: 1048,
      kitchenOpen: true,
      cart: [],
      cartTip: 0,
      cartCustomerName: '',
      cartNotes: '',
      cartTable: '12',
      activeCustomerOrder: null,
      activeTenantId: 'kiln-street',

      setActiveTenantId: (activeTenantId) => set({ activeTenantId }),
      setKitchenOpen: (kitchenOpen) => set({ kitchenOpen }),
      setCartTable: (cartTable) => set({ cartTable }),

      addToCart: (newItem) =>
        set((state) => {
          // If item already exists with exact same modifiers, increment quantity
          const existingIndex = state.cart.findIndex(
            (i) =>
              i.menuItemId === newItem.menuItemId &&
              JSON.stringify(i.modifiers) === JSON.stringify(newItem.modifiers)
          );

          if (existingIndex > -1) {
            const updated = [...state.cart];
            updated[existingIndex].quantity += newItem.quantity;
            return { cart: updated };
          }
          return { cart: [...state.cart, newItem] };
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),

      updateCartQuantity: (itemId, delta) =>
        set((state) => {
          const updated = state.cart
            .map((item) => {
              if (item.id === itemId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as OrderItem[];

          return { cart: updated };
        }),

      setCartTip: (cartTip) => set({ cartTip }),
      setCartCustomerName: (cartCustomerName) => set({ cartCustomerName }),
      setCartNotes: (cartNotes) => set({ cartNotes }),
      clearCart: () => set({ cart: [], cartTip: 0, cartNotes: '' }),

      placeOrder: (orderData) => {
        const state = get();
        const num = state.nextOrderNumber;
        const now = new Date().toISOString();

        const newOrder: Order = {
          id: `ord-${num}`,
          orderNumber: String(num),
          tenantId: orderData.tenantId || 'tenant-kiln',
          branchId: orderData.branchId || 'Central',
          table: orderData.table || state.cartTable || '12',
          items: orderData.items || [...state.cart],
          subtotal: orderData.subtotal || 0,
          serviceCharge: orderData.serviceCharge || 0,
          tax: orderData.tax || 0,
          tip: orderData.tip || state.cartTip || 0,
          total: orderData.total || 0,
          status: 'Received',
          paymentStatus: orderData.paymentStatus || 'Paid',
          paymentMethod: orderData.paymentMethod || 'card',
          createdAt: now,
          updatedAt: now,
          customerName: orderData.customerName || state.cartCustomerName || 'Guest Diner',
          notes: orderData.notes || state.cartNotes || '',
        };

        set({
          orders: [newOrder, ...state.orders],
          nextOrderNumber: num + 1,
          cart: [],
          activeCustomerOrder: newOrder,
        });

        // Publish to other tabs
        cirqlaChannel.publish({
          type: 'ORDER_CREATED',
          payload: newOrder,
        });

        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus) => {
        const now = new Date().toISOString();
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus, updatedAt: now } : order
          );

          let updatedActive = state.activeCustomerOrder;
          if (state.activeCustomerOrder?.id === orderId) {
            updatedActive = { ...state.activeCustomerOrder, status: newStatus, updatedAt: now };
          }

          return {
            orders: updatedOrders,
            activeCustomerOrder: updatedActive,
          };
        });

        cirqlaChannel.publish({
          type: 'ORDER_UPDATED',
          payload: { orderId, status: newStatus },
        });
      },

      toggleItemSoldOut: (tenantId, itemId) => {
        set((state) => {
          const items = state.menuItems[tenantId] || [];
          const updated = items.map((it) =>
            it.id === itemId ? { ...it, isSoldOut: !it.isSoldOut } : it
          );
          return {
            menuItems: {
              ...state.menuItems,
              [tenantId]: updated,
            },
          };
        });

        const updatedItem = get().menuItems[tenantId]?.find((i) => i.id === itemId);
        cirqlaChannel.publish({
          type: 'ITEM_AVAILABILITY_CHANGED',
          payload: { menuItemId: itemId, isSoldOut: !!updatedItem?.isSoldOut },
        });
      },

      updateMenuItem: (tenantId, updatedItem) =>
        set((state) => ({
          menuItems: {
            ...state.menuItems,
            [tenantId]: (state.menuItems[tenantId] || []).map((i) =>
              i.id === updatedItem.id ? updatedItem : i
            ),
          },
        })),

      addMenuItem: (tenantId, newItem) =>
        set((state) => ({
          menuItems: {
            ...state.menuItems,
            [tenantId]: [newItem, ...(state.menuItems[tenantId] || [])],
          },
        })),

      refundOrder: (orderId) => {
        const now = new Date().toISOString();
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: 'Refunded', updatedAt: now } : o
          ),
        }));
      },

      suspendTenant: (tenantId) =>
        set((state) => ({
          tenants: state.tenants.map((t) =>
            t.id === tenantId ? { ...t, status: 'Suspended' } : t
          ),
        })),

      activateTenant: (tenantId) =>
        set((state) => ({
          tenants: state.tenants.map((t) =>
            t.id === tenantId ? { ...t, status: 'Active' } : t
          ),
        })),

      changeTenantPlan: (tenantId, plan) =>
        set((state) => ({
          tenants: state.tenants.map((t) =>
            t.id === tenantId ? { ...t, plan } : t
          ),
        })),

      updateTenantAccent: (tenantId, accent) => {
        set((state) => ({
          tenants: state.tenants.map((t) =>
            t.id === tenantId ? { ...t, accent } : t
          ),
        }));
        cirqlaChannel.publish({
          type: 'TENANT_THEME_CHANGED',
          payload: { tenantId },
        });
      },

      handleRemoteEvent: (event) => {
        if (event.type === 'ORDER_CREATED') {
          const newOrder = event.payload;
          set((state) => {
            if (state.orders.some((o) => o.id === newOrder.id)) return state;
            return {
              orders: [newOrder, ...state.orders],
              nextOrderNumber: Math.max(state.nextOrderNumber, Number(newOrder.orderNumber) + 1),
            };
          });
        } else if (event.type === 'ORDER_UPDATED') {
          const { orderId, status } = event.payload;
          set((state) => {
            const updatedOrders = state.orders.map((o) =>
              o.id === orderId ? { ...o, status: status as OrderStatus, updatedAt: new Date().toISOString() } : o
            );
            let updatedActive = state.activeCustomerOrder;
            if (state.activeCustomerOrder?.id === orderId) {
              updatedActive = { ...state.activeCustomerOrder, status: status as OrderStatus, updatedAt: new Date().toISOString() };
            }
            return { orders: updatedOrders, activeCustomerOrder: updatedActive };
          });
        } else if (event.type === 'ITEM_AVAILABILITY_CHANGED') {
          const { menuItemId, isSoldOut } = event.payload;
          set((state) => {
            const updatedMap: Record<string, MenuItem[]> = {};
            for (const [tenant, items] of Object.entries(state.menuItems)) {
              updatedMap[tenant] = items.map((i) =>
                i.id === menuItemId ? { ...i, isSoldOut } : i
              );
            }
            return { menuItems: updatedMap };
          });
        }
      },

      simulateIncomingOrder: () => {
        const state = get();
        const randomTables = ['3', '8', '11', '14', 'Counter'];
        const randomNames = ['Amina Begum', 'Julian K.', 'David Foster', 'Nadia Al-Mansoor'];
        const t = randomTables[Math.floor(Math.random() * randomTables.length)];
        const n = randomNames[Math.floor(Math.random() * randomNames.length)];

        state.placeOrder({
          tenantId: 'tenant-kiln',
          branchId: 'Central',
          table: t,
          customerName: n,
          items: [
            {
              id: `item-${Date.now()}-1`,
              menuItemId: 'kiln-mains-1',
              name: 'Slow-Cooked Short Rib',
              price: 24.50,
              quantity: 1,
              modifiers: [{ groupName: 'Choose a side', optionName: 'Hand-cut fries', priceDelta: 0 }],
            },
            {
              id: `item-${Date.now()}-2`,
              menuItemId: 'kiln-drinks-1',
              name: 'House Lemonade',
              price: 4.50,
              quantity: 1,
            },
          ],
          subtotal: 29.00,
          serviceCharge: 1.45,
          tax: 2.32,
          tip: 3.00,
          total: 35.77,
          paymentStatus: 'Paid',
          paymentMethod: 'card',
        });
      },
    }),
    {
      name: 'bioniciq-cirqla-store',
    }
  )
);

// Subscribe store to BroadcastChannel
if (typeof window !== 'undefined') {
  cirqlaChannel.subscribe((evt) => {
    useCirqlaStore.getState().handleRemoteEvent(evt);
  });
}
