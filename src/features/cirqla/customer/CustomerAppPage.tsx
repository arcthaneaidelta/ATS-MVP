import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCirqlaStore } from '../../../store/cirqla';
import { MenuItem, OrderItem } from '../../../types';
import { PhoneFrame } from './PhoneFrame';
import { ItemSheet } from './ItemSheet';
import { CartSheet } from './CartSheet';
import { OrderTracker } from './OrderTracker';
import { useToast } from '../../../components/ui/Toast';
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export const CustomerAppPage: React.FC = () => {
  const { venue } = useParams<{ venue: string }>();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '12';

  const {
    tenants,
    menuItems,
    kitchenOpen,
    cart,
    addToCart,
    activeCustomerOrder,
  } = useCirqlaStore();

  const { toast } = useToast();

  // Find tenant by slug
  const tenant =
    tenants.find((t) => t.slug === venue || t.id === venue) || tenants[0];
  const items = menuItems[tenant.id] || [];

  // Splash screen state (900ms)
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Starters');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItemForSheet, setActiveItemForSheet] = useState<MenuItem | null>(null);
  const [showCartSheet, setShowCartSheet] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<any>(activeCustomerOrder);

  // Sync active order if changed in store
  useEffect(() => {
    if (activeCustomerOrder) {
      setActiveOrder(activeCustomerOrder);
    }
  }, [activeCustomerOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['Starters', 'Mains', 'Sides', 'Desserts', 'Drinks'];

  const filteredItems = items.filter((it) => {
    const matchesCat = it.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartTotalCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const cartSubtotal = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const handlePlusClick = (item: MenuItem) => {
    if (item.isSoldOut || !kitchenOpen) return;

    // Check if item has required modifier groups
    const hasRequired = (item.modifierGroups || []).some((g) => g.required);
    if (hasRequired) {
      setActiveItemForSheet(item);
    } else {
      addToCart({
        id: `cart-item-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
      toast(`Added ${item.name} to order`, 'info');
    }
  };

  const content = (
    <div
      className="h-full flex flex-col justify-between text-left font-sans select-none relative overflow-hidden"
      style={{ '--clay': tenant.accent } as React.CSSProperties}
    >
      {/* 1. Splash Screen Overlay (900ms) */}
      {showSplash ? (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center text-white"
          style={{ backgroundColor: tenant.accent }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-serif text-3xl font-bold mb-4">
            {tenant.name.charAt(0)}
          </div>
          <h2 className="font-serif text-3xl font-normal tracking-tight mb-1">{tenant.name}</h2>
          <span className="text-xs uppercase tracking-widest text-white/80 font-mono">
            Table {tableNumber} Verified
          </span>
          <div className="mt-6 flex items-center gap-1.5 text-[11px] text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>Connecting to local kitchen pass...</span>
          </div>
        </div>
      ) : null}

      {/* 2. Main Diner View: Tracker or Menu */}
      {activeOrder ? (
        <OrderTracker
          order={activeOrder}
          onDone={() => setActiveOrder(null)}
          accent={tenant.accent}
        />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3.5 border-b border-line bg-surface/80 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-xl font-bold text-ink leading-tight">
                  {tenant.name}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-bg font-mono font-bold text-ink-2 border border-line">
                    Table {tableNumber}
                  </span>
                  <span className="text-[10px] text-ok flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-ok" />
                    Kitchen Open
                  </span>
                </div>
              </div>

              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-white shadow-sm"
                style={{ backgroundColor: tenant.accent }}
              >
                {tenant.name.charAt(0)}
              </div>
            </div>

            {/* Kitchen Closed Banner if triggered */}
            {!kitchenOpen && (
              <div className="mt-2 p-2 rounded-lg bg-warn-tint border border-warn/30 text-warn text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Kitchen opens at 12:00. Browsing only.</span>
              </div>
            )}

            {/* Inline Search */}
            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 text-ink-3 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search today's dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-bg border border-line text-xs font-sans text-ink placeholder:text-ink-3 outline-none"
              />
            </div>
          </div>

          {/* Sticky Category Tabs */}
          <div className="flex overflow-x-auto p-2 gap-1.5 border-b border-line bg-bg shrink-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'text-white font-semibold shadow-xs'
                    : 'bg-surface text-ink-2 border border-line hover:bg-elevated'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? tenant.accent : undefined,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-ink-3">
                Nothing like that on today's menu.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border bg-elevated transition-all flex items-start justify-between gap-3 ${
                    item.isSoldOut ? 'opacity-50 border-line bg-surface' : 'border-line hover:border-line-2'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-base text-ink font-semibold truncate">
                        {item.name}
                      </h3>
                      {item.isSoldOut && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-err-tint text-err border border-err/20 font-bold uppercase">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ink-2 line-clamp-2 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono font-bold text-xs text-ink">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="px-1 py-0.2 rounded text-[9px] bg-bg border border-line text-ink-3"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={item.isSoldOut || !kitchenOpen}
                    onClick={() => handlePlusClick(item)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                    style={{ backgroundColor: tenant.accent }}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Floating Cart Pill if cart > 0 */}
          {cartTotalCount > 0 && (
            <div className="p-3 border-t border-line bg-surface/90 shrink-0">
              <button
                type="button"
                onClick={() => setShowCartSheet(true)}
                className="w-full h-11 px-4 rounded-xl text-white font-sans text-xs font-semibold flex items-center justify-between shadow-lg active:scale-[0.99] transition-all"
                style={{ backgroundColor: tenant.accent }}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    View Cart ({cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <span className="font-mono text-sm">${cartSubtotal.toFixed(2)}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Item Customisation Sheet */}
      {activeItemForSheet && (
        <ItemSheet
          item={activeItemForSheet}
          accent={tenant.accent}
          onClose={() => setActiveItemForSheet(null)}
          onAddToCart={(orderItem) => {
            addToCart(orderItem);
            toast(`Added ${orderItem.name} with modifiers`, 'info');
          }}
        />
      )}

      {/* Cart & Checkout Sheet */}
      {showCartSheet && (
        <CartSheet
          accent={tenant.accent}
          onClose={() => setShowCartSheet(false)}
          onOrderSuccess={(orderId) => {
            setShowCartSheet(false);
            const ord = useCirqlaStore.getState().orders.find((o) => o.id === orderId);
            setActiveOrder(ord);
            toast(`Order #${ord?.orderNumber} sent to kitchen pass!`, 'success');
          }}
        />
      )}
    </div>
  );

  return (
    <PhoneFrame
      venueName={tenant.name}
      table={tableNumber}
      accent={tenant.accent}
      onRestartDemo={() => {
        useCirqlaStore.getState().clearCart();
        setActiveOrder(null);
        setShowSplash(true);
      }}
    >
      {content}
    </PhoneFrame>
  );
};
