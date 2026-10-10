import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ClientAccount,
  CustomOrderStatus,
  DocumentItem,
  EmailMessage,
  MessageItem,
  NotificationItem,
  OrderItem,
  ScenarioFlags,
  ServiceAddOn,
  WebhookLogEntry,
} from '@/mock/types'
import { DEMO_ACCOUNTS } from '@/data/accounts'
import {
  SEED_ORDERS,
  SEED_DOCUMENTS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS,
  SEED_WEBHOOKS,
  SEED_EMAILS,
} from '@/data/seed'
import { SERVICES } from '@/data/services'
import { advanceDemoTimeHours, getDemoNowISO, resetDemoClock } from '@/mock/clock'
import { eventBus } from '@/mock/events'

export interface CartItem {
  serviceId: string
  addOns: ServiceAddOn[]
}

export interface ToastItem {
  id: string
  type: 'success' | 'info' | 'error'
  title: string
  message?: string
  actionLabel?: string
  actionUrl?: string
}

interface StoreState {
  // Session
  currentUser: ClientAccount | null
  setCurrentUser: (user: ClientAccount | null) => void
  switchAccount: (accountId: string) => void

  // Cart
  cart: CartItem[]
  couponCode: string | null
  discountPercent: number
  addToCart: (serviceId: string, addOns?: ServiceAddOn[]) => void
  removeFromCart: (serviceId: string) => void
  toggleAddOn: (serviceId: string, addOn: ServiceAddOn) => void
  applyCoupon: (code: string) => { success: boolean; message: string }
  clearCart: () => void

  // Data
  orders: OrderItem[]
  documents: DocumentItem[]
  messages: MessageItem[]
  notifications: NotificationItem[]
  emails: EmailMessage[]
  webhooks: WebhookLogEntry[]

  // Scenarios and Demo Guide
  scenarios: ScenarioFlags
  setScenarioFlag: (key: keyof ScenarioFlags, val: boolean) => void
  demoGuideOpen: boolean
  setDemoGuideOpen: (open: boolean) => void
  demoGuideTab: 'guide' | 'inbox' | 'webhooks' | 'buildmap' | 'handover'
  setDemoGuideTab: (tab: 'guide' | 'inbox' | 'webhooks' | 'buildmap' | 'handover') => void
  suggestedSteps: {
    browseStore: boolean
    payCheckout: boolean
    submitIntake: boolean
    staffAdvance: boolean
    inspectWebhooks: boolean
  }
  markSuggestedStep: (step: keyof StoreState['suggestedSteps']) => void

  // Toasts
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void

  // Domain Actions
  placeOrder: (payload: {
    serviceId: string
    addOns: ServiceAddOn[]
    clientDetails: {
      name: string
      email: string
      companyName: string
      cipaNumber: string
      phone: string
      notes?: string
    }
    tenderDetails?: {
      reference: string
      title: string
      procuringEntity: string
      closingDate: string
    }
  }) => OrderItem

  updateOrderStatus: (
    orderId: string,
    newStatus: CustomOrderStatus,
    meta?: { changedBy?: string; note?: string; fileUrl?: string }
  ) => void

  submitIntake: (
    orderId: string,
    formId: 'A' | 'B' | 'C',
    answers: Record<string, any>,
    filesUploaded?: string[]
  ) => void

  requestRevisions: (orderId: string, comment: string, attachFileUrl?: string) => void
  approveDraft: (orderId: string) => void
  uploadDocument: (doc: Partial<DocumentItem>) => void
  sendMessage: (orderId: string, text: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  markEmailRead: (id: string) => void
  retryWebhook: (id: string) => void
  fastForward24h: () => void
  resetDemoData: () => void
}

const INITIAL_SCENARIOS: ScenarioFlags = {
  paymentDeclinedNext: false,
  paymentPendingNext: false,
  downloadFailsNext: false,
  slowNetwork: false,
  receiverFailure500: false,
  buildMapActive: false,
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Default to Naledi Mokgosi for immediate client dashboard experience
      currentUser: DEMO_ACCOUNTS[0],
      setCurrentUser: (user) => set({ currentUser: user }),
      switchAccount: (accountId) => {
        const found = DEMO_ACCOUNTS.find((a) => a.id === accountId)
        if (found) {
          set({ currentUser: found })
          get().addToast({
            type: 'info',
            title: `Switched to ${found.name}`,
            message: `${found.companyName} (${found.role === 'staff' ? 'Staff' : 'Client'})`,
          })
        }
      },

      // Cart
      cart: [],
      couponCode: null,
      discountPercent: 0,
      addToCart: (serviceId, addOns = []) => {
        const existing = get().cart.find((c) => c.serviceId === serviceId)
        if (existing) {
          // Service already in cart (1 per service strictly)
          return
        }
        set((state) => ({
          cart: [...state.cart, { serviceId, addOns }],
        }))
        const srv = SERVICES.find((s) => s.id === serviceId)
        get().addToast({
          type: 'success',
          title: 'Added to cart',
          message: srv?.name,
          actionLabel: 'View cart',
          actionUrl: '/cart',
        })
        get().markSuggestedStep('browseStore')
      },
      removeFromCart: (serviceId) => {
        const removedItem = get().cart.find((c) => c.serviceId === serviceId)
        set((state) => ({
          cart: state.cart.filter((c) => c.serviceId !== serviceId),
        }))
        if (removedItem) {
          const srv = SERVICES.find((s) => s.id === serviceId)
          get().addToast({
            type: 'info',
            title: 'Item removed',
            message: `${srv?.name ?? 'Service'} was removed from cart.`,
          })
        }
      },
      toggleAddOn: (serviceId, addOn) => {
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.serviceId !== serviceId) return item
            const hasAddOn = item.addOns.some((a) => a.id === addOn.id)
            return {
              ...item,
              addOns: hasAddOn
                ? item.addOns.filter((a) => a.id !== addOn.id)
                : [...item.addOns, addOn],
            }
          }),
        }))
      },
      applyCoupon: (code) => {
        if (code.trim().toUpperCase() === 'FIRSTBID10') {
          set({ couponCode: 'FIRSTBID10', discountPercent: 10 })
          return { success: true, message: 'Coupon applied! 10% discount on order.' }
        }
        return { success: false, message: 'That code is not valid.' }
      },
      clearCart: () => set({ cart: [], couponCode: null, discountPercent: 0 }),

      // Data
      orders: SEED_ORDERS,
      documents: SEED_DOCUMENTS,
      messages: SEED_MESSAGES,
      notifications: SEED_NOTIFICATIONS,
      emails: SEED_EMAILS,
      webhooks: SEED_WEBHOOKS,

      // Scenarios and Demo Guide
      scenarios: INITIAL_SCENARIOS,
      setScenarioFlag: (key, val) => {
        set((state) => ({
          scenarios: { ...state.scenarios, [key]: val },
        }))
        get().addToast({
          type: 'info',
          title: `Scenario updated`,
          message: `${key} is now ${val ? 'ON' : 'OFF'}`,
        })
      },
      demoGuideOpen: false,
      setDemoGuideOpen: (open) => set({ demoGuideOpen: open }),
      demoGuideTab: 'guide',
      setDemoGuideTab: (tab) => set({ demoGuideTab: tab }),
      suggestedSteps: {
        browseStore: false,
        payCheckout: false,
        submitIntake: false,
        staffAdvance: false,
        inspectWebhooks: false,
      },
      markSuggestedStep: (step) =>
        set((state) => ({
          suggestedSteps: { ...state.suggestedSteps, [step]: true },
        })),

      // Toasts
      toasts: [],
      addToast: (t) => {
        const id = 'toast-' + Math.random().toString(36).substring(2, 9)
        const toast: ToastItem = { ...t, id }
        set((state) => ({ toasts: [...state.toasts.slice(-2), toast] }))
        setTimeout(() => {
          get().removeToast(id)
        }, 8000)
      },
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      // Domain Actions
      placeOrder: ({ serviceId, addOns, clientDetails, tenderDetails }) => {
        const srv = SERVICES.find((s) => s.id === serviceId) || SERVICES[0]
        const orderNum = `TV-2026-0${150 + get().orders.length}`
        const addOnsTotal = addOns.reduce((sum, a) => sum + a.priceBwp, 0)
        let subtotal = srv.priceBwp + addOnsTotal
        if (get().discountPercent > 0) {
          subtotal = subtotal * (1 - get().discountPercent / 100)
        }
        const vat = Math.round(subtotal * 0.14 * 100) / 100
        const total = subtotal + vat

        const closingDate = tenderDetails?.closingDate || '2026-11-04'
        const tenderRef = tenderDetails?.reference || 'TDR/2026/088'
        const tenderTitle = tenderDetails?.title || 'Supply and Delivery of Services'
        const procuringEntity = tenderDetails?.procuringEntity || 'Botswana Public Procurement'

        const newOrder: OrderItem = {
          id: 'ord-' + Date.now(),
          orderNumber: orderNum,
          serviceId: srv.id,
          serviceName: srv.name,
          stage: srv.stage,
          clientEmail: clientDetails.email,
          clientName: clientDetails.name,
          companyName: clientDetails.companyName,
          status: 'awaiting-intake',
          tenderReference: tenderRef,
          tenderTitle: tenderTitle,
          procuringEntity: procuringEntity,
          closingDate: closingDate,
          subtotalBwp: subtotal,
          vatBwp: vat,
          totalBwp: total,
          addOns: addOns,
          writerName: 'Kabo Ntshole',
          writerRole: 'Senior Bid Writer',
          writerInitials: 'KN',
          createdAt: getDemoNowISO(),
          updatedAt: getDemoNowISO(),
          expectedDraftDate: '2026-10-18',
          intakeSubmitted: false,
          revisionCount: 0,
        }

        // Webhook log
        const webhookStatus = get().scenarios.receiverFailure500 ? 500 : 200
        const webhookLog: WebhookLogEntry = {
          id: 'wh-' + Date.now(),
          endpoint: '/hooks/order-created',
          event: 'order.created',
          status: webhookStatus,
          durationMs: 148,
          timestamp: getDemoNowISO(),
          headers: {
            'content-type': 'application/json',
            'user-agent': 'WooCommerce/9.2.0 Webhook Hookshot',
            'x-wc-webhook-topic': 'order.created',
          },
          payload: {
            event: 'order.created',
            order_id: parseInt(orderNum.replace(/\D/g, '')),
            number: orderNum,
            status: 'awaiting-intake',
            services: [srv.name],
            total_bwp: total,
            customer: {
              name: clientDetails.name,
              company: clientDetails.companyName,
              email: clientDetails.email,
              phone: clientDetails.phone,
            },
            tender_closing_date: closingDate,
          },
          canRetry: webhookStatus === 500,
        }

        // Email confirmation
        const newEmail: EmailMessage = {
          id: 'email-' + Date.now(),
          recipient: clientDetails.email,
          subject: `Order ${orderNum} confirmed`,
          trigger: 'Order paid',
          sentAt: getDemoNowISO(),
          previewText: `Thank you for your order. Complete intake form so we can start work on ${srv.name}.`,
          primaryButtonText: 'Complete your intake',
          primaryButtonUrl: `/portal/intake/${srv.intakeFormId}?orderId=${newOrder.id}`,
          isRead: false,
          plainText: `Order ${orderNum} confirmed.\nService: ${srv.name}\nTotal: P${total.toFixed(2)}\nComplete intake: https://tendervantage.example/portal/intake/${srv.intakeFormId}?orderId=${newOrder.id}`,
          htmlBody: `<h2>Order ${orderNum} confirmed</h2><p>Thank you for ordering ${srv.name}. Please complete intake.</p>`,
        }

        // Notification
        const notif: NotificationItem = {
          id: 'notif-' + Date.now(),
          clientEmail: clientDetails.email,
          title: `Order confirmed: ${orderNum}`,
          description: `Action needed: complete ${srv.intakeFormTitle} before work begins.`,
          timestamp: getDemoNowISO(),
          unread: true,
          orderId: newOrder.id,
          linkUrl: `/portal/intake/${srv.intakeFormId}?orderId=${newOrder.id}`,
        }

        set((state) => ({
          orders: [newOrder, ...state.orders],
          webhooks: [webhookLog, ...state.webhooks],
          emails: [newEmail, ...state.emails],
          notifications: [notif, ...state.notifications],
          cart: [],
        }))

        get().markSuggestedStep('payCheckout')
        eventBus.emit('order.created', newOrder)

        get().addToast({
          type: 'info',
          title: `Email sent to ${clientDetails.email}`,
          message: `Subject: Order ${orderNum} confirmed`,
          actionLabel: 'View in inbox',
          actionUrl: '#inbox',
        })

        return newOrder
      },

      updateOrderStatus: (orderId, newStatus, meta) => {
        const order = get().orders.find((o) => o.id === orderId)
        if (!order) return

        const oldStatus = order.status
        const updatedOrders = get().orders.map((o) => {
          if (o.id !== orderId) return o
          return {
            ...o,
            status: newStatus,
            updatedAt: getDemoNowISO(),
            draftFileUrl: meta?.fileUrl || o.draftFileUrl,
            deliveredDate: newStatus === 'delivered' ? getDemoNowISO() : o.deliveredDate,
          }
        })

        // Webhook log
        const webhookStatus = get().scenarios.receiverFailure500 ? 500 : 200
        const isDelivered = newStatus === 'delivered'
        const endpoint = isDelivered ? '/hooks/order-delivered' : '/hooks/order-status-changed'
        const eventName = isDelivered ? 'order.delivered' : 'order.status_changed'

        const webhookLog: WebhookLogEntry = {
          id: 'wh-' + Date.now(),
          endpoint: endpoint as any,
          event: eventName,
          status: webhookStatus,
          durationMs: 160,
          timestamp: getDemoNowISO(),
          headers: {
            'content-type': 'application/json',
            'user-agent': 'WooCommerce/9.2.0 Webhook Hookshot',
            'x-wc-webhook-topic': eventName,
          },
          payload: isDelivered
            ? {
                event: 'order.delivered',
                order_id: parseInt(order.orderNumber.replace(/\D/g, '')),
                number: order.orderNumber,
                delivered_at: getDemoNowISO(),
                service: order.serviceName,
                customer_email: order.clientEmail,
                file_manifest: [`${order.orderNumber}-Final-Submission-Pack.zip`],
              }
            : {
                event: 'order.status_changed',
                order_id: parseInt(order.orderNumber.replace(/\D/g, '')),
                number: order.orderNumber,
                from_status: oldStatus,
                to_status: newStatus,
                changed_by: meta?.changedBy || 'staff:delivery-desk',
                changed_at: getDemoNowISO(),
                service: order.serviceName,
                customer_email: order.clientEmail,
              },
          canRetry: webhookStatus === 500,
        }

        // Email generation based on target status
        let newEmail: EmailMessage | null = null
        if (newStatus === 'client-review') {
          newEmail = {
            id: 'email-' + Date.now(),
            recipient: order.clientEmail,
            subject: `Your draft is ready for review: ${order.orderNumber}`,
            trigger: 'Draft sent to client',
            sentAt: getDemoNowISO(),
            previewText: `Your draft for ${order.serviceName} is ready in the portal.`,
            primaryButtonText: 'Review draft',
            primaryButtonUrl: `/portal/orders/${order.id}`,
            isRead: false,
            plainText: `Your draft is ready for review. Order ${order.orderNumber}.`,
            htmlBody: `<h2>Your draft is ready for review</h2><p>Order ${order.orderNumber}</p>`,
          }
        } else if (newStatus === 'delivered') {
          newEmail = {
            id: 'email-' + Date.now(),
            recipient: order.clientEmail,
            subject: `Your files are ready: ${order.orderNumber} delivered`,
            trigger: 'Delivered',
            sentAt: getDemoNowISO(),
            previewText: `Final files for ${order.serviceName} are ready to download.`,
            primaryButtonText: 'Download your files',
            primaryButtonUrl: `/portal/orders/${order.id}`,
            isRead: false,
            plainText: `Your files are ready. Order ${order.orderNumber} delivered.`,
            htmlBody: `<h2>Your files are ready</h2><p>Order ${order.orderNumber} delivered.</p>`,
          }
        }

        const notif: NotificationItem = {
          id: 'notif-' + Date.now(),
          clientEmail: order.clientEmail,
          title: `Status update: ${order.orderNumber}`,
          description: `Order moved to ${newStatus.replace('-', ' ').toUpperCase()}`,
          timestamp: getDemoNowISO(),
          unread: true,
          orderId: order.id,
          linkUrl: `/portal/orders/${order.id}`,
        }

        set((state) => ({
          orders: updatedOrders,
          webhooks: [webhookLog, ...state.webhooks],
          emails: newEmail ? [newEmail, ...state.emails] : state.emails,
          notifications: [notif, ...state.notifications],
        }))

        get().markSuggestedStep('staffAdvance')
        eventBus.emit('order.status_changed', { orderId, fromStatus: oldStatus, toStatus: newStatus })

        get().addToast({
          type: 'success',
          title: `Status updated`,
          message: `${order.orderNumber} is now ${newStatus.replace('-', ' ')}`,
        })

        if (newEmail) {
          get().addToast({
            type: 'info',
            title: `Email sent to ${order.clientEmail}`,
            message: newEmail.subject,
          })
        }
      },

      submitIntake: (orderId, formId, answers, filesUploaded = []) => {
        const order = get().orders.find((o) => o.id === orderId)
        if (!order) return

        const updatedOrders = get().orders.map((o) => {
          if (o.id !== orderId) return o
          return {
            ...o,
            status: 'in-production' as CustomOrderStatus,
            intakeSubmitted: true,
            updatedAt: getDemoNowISO(),
          }
        })

        // Webhook log for intake
        const webhookStatus = get().scenarios.receiverFailure500 ? 500 : 200
        const webhookLog: WebhookLogEntry = {
          id: 'wh-' + Date.now(),
          endpoint: '/hooks/intake-submitted',
          event: 'intake.submitted',
          status: webhookStatus,
          durationMs: 185,
          timestamp: getDemoNowISO(),
          headers: {
            'content-type': 'application/json',
            'user-agent': 'WPForms-Pro/1.8.8 Webhook Dispatcher',
            'x-wpforms-form-id': `form-${formId.toLowerCase()}`,
          },
          payload: {
            order_id: parseInt(order.orderNumber.replace(/\D/g, '')),
            number: order.orderNumber,
            form_id: formId,
            form_name: `Form ${formId}`,
            customer_email: order.clientEmail,
            file_count: filesUploaded.length,
            answers: answers,
            consent_flags: {
              processing_consent: true,
              confidentiality_acknowledged: true,
            },
          },
          canRetry: webhookStatus === 500,
        }

        // Email: intake received
        const newEmail: EmailMessage = {
          id: 'email-' + Date.now(),
          recipient: order.clientEmail,
          subject: `We have your documents, work has started: ${order.orderNumber}`,
          trigger: 'Intake submitted',
          sentAt: getDemoNowISO(),
          previewText: `Your intake documents for ${order.serviceName} have been received. Writer ${order.writerName} has commenced work.`,
          primaryButtonText: 'View your order',
          primaryButtonUrl: `/portal/orders/${order.id}`,
          isRead: false,
          plainText: `Intake submitted for ${order.orderNumber}. Order is now In Production.`,
          htmlBody: `<h2>Intake received</h2><p>Work has started on ${order.serviceName}.</p>`,
        }

        // Notification
        const notif: NotificationItem = {
          id: 'notif-' + Date.now(),
          clientEmail: order.clientEmail,
          title: `Intake received: ${order.orderNumber}`,
          description: `Order moved to In Production. Assigned writer: ${order.writerName}.`,
          timestamp: getDemoNowISO(),
          unread: true,
          orderId: order.id,
          linkUrl: `/portal/orders/${order.id}`,
        }

        set((state) => ({
          orders: updatedOrders,
          webhooks: [webhookLog, ...state.webhooks],
          emails: [newEmail, ...state.emails],
          notifications: [notif, ...state.notifications],
        }))

        get().markSuggestedStep('submitIntake')
        eventBus.emit('intake.submitted', { orderId, formId })

        get().addToast({
          type: 'success',
          title: 'Intake received',
          message: `Order ${order.orderNumber} is now In Production.`,
        })
      },

      requestRevisions: (orderId, comment) => {
        const order = get().orders.find((o) => o.id === orderId)
        if (!order) return

        const updatedOrders = get().orders.map((o) => {
          if (o.id !== orderId) return o
          return {
            ...o,
            status: 'revisions-requested' as CustomOrderStatus,
            revisionCount: o.revisionCount + 1,
            revisionComments: [...(o.revisionComments || []), comment],
            updatedAt: getDemoNowISO(),
          }
        })

        // Webhook
        const webhookStatus = get().scenarios.receiverFailure500 ? 500 : 200
        const webhookLog: WebhookLogEntry = {
          id: 'wh-' + Date.now(),
          endpoint: '/hooks/order-status-changed',
          event: 'order.status_changed',
          status: webhookStatus,
          durationMs: 152,
          timestamp: getDemoNowISO(),
          headers: {
            'content-type': 'application/json',
            'user-agent': 'WooCommerce/9.2.0 Webhook Hookshot',
          },
          payload: {
            event: 'order.status_changed',
            order_id: parseInt(order.orderNumber.replace(/\D/g, '')),
            number: order.orderNumber,
            from_status: order.status,
            to_status: 'revisions-requested',
            changed_by: `client:${order.clientEmail}`,
            client_comment: comment,
          },
          canRetry: webhookStatus === 500,
        }

        // Email
        const newEmail: EmailMessage = {
          id: 'email-' + Date.now(),
          recipient: order.clientEmail,
          subject: `We have your revision request: ${order.orderNumber}`,
          trigger: 'Revisions requested',
          sentAt: getDemoNowISO(),
          previewText: `Your comments for ${order.serviceName} have been assigned to ${order.writerName}.`,
          primaryButtonText: 'View your order',
          primaryButtonUrl: `/portal/orders/${order.id}`,
          isRead: false,
          plainText: `Revision request logged for ${order.orderNumber}.\nComment: "${comment}"`,
          htmlBody: `<h2>Revision request received</h2><p>Writer ${order.writerName} is updating the draft.</p>`,
        }

        set((state) => ({
          orders: updatedOrders,
          webhooks: [webhookLog, ...state.webhooks],
          emails: [newEmail, ...state.emails],
        }))

        get().addToast({
          type: 'success',
          title: 'Revisions requested',
          message: `${order.writerName} has been notified and will address your feedback.`,
        })
      },

      approveDraft: (orderId) => {
        get().updateOrderStatus(orderId, 'delivered', {
          changedBy: 'client:approved-draft',
        })
      },

      uploadDocument: (doc) => {
        const newDoc: DocumentItem = {
          id: 'doc-' + Date.now(),
          name: doc.name || 'Uploaded-Document.pdf',
          sizeFormatted: doc.sizeFormatted || '1.2 MB',
          sizeBytes: doc.sizeBytes || 1200000,
          fileType: (doc.fileType as any) || 'PDF',
          source: 'client',
          uploadedAt: getDemoNowISO(),
          category: (doc.category as any) || 'client-upload',
          orderId: doc.orderId,
          orderNumber: doc.orderNumber,
        }

        set((state) => ({
          documents: [newDoc, ...state.documents],
        }))

        get().addToast({
          type: 'success',
          title: 'Document uploaded',
          message: `${newDoc.name} is saved privately in your vault.`,
        })
      },

      sendMessage: (orderId, text) => {
        const order = get().orders.find((o) => o.id === orderId)
        const user = get().currentUser

        const newMsg: MessageItem = {
          id: 'msg-' + Date.now(),
          orderId,
          senderRole: (user?.role as any) || 'client',
          senderName: user?.name || 'Client',
          senderInitials: user?.name
            ? user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
            : 'CL',
          text,
          timestamp: getDemoNowISO(),
        }

        set((state) => ({ messages: [...state.messages, newMsg] }))

        // Automatic mock reply after 2s per PRD
        setTimeout(() => {
          const replyMsg: MessageItem = {
            id: 'msg-reply-' + Date.now(),
            orderId,
            senderRole: 'writer',
            senderName: order?.writerName || 'Lorato Dube',
            senderInitials: order?.writerInitials || 'LD',
            text: 'Thanks, noted. Back to you by end of day.',
            timestamp: getDemoNowISO(),
          }
          set((state) => ({ messages: [...state.messages, replyMsg] }))
        }, 2000)
      },

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, unread: false } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false })),
        })),

      markEmailRead: (id) =>
        set((state) => ({
          emails: state.emails.map((e) => (e.id === id ? { ...e, isRead: true } : e)),
        })),

      retryWebhook: (id) => {
        set((state) => ({
          webhooks: state.webhooks.map((w) =>
            w.id === id ? { ...w, status: 200, canRetry: false, durationMs: 135 } : w
          ),
        }))
        get().addToast({
          type: 'success',
          title: 'Webhook redelivered',
          message: 'Receiver responded with 200 OK.',
        })
      },

      fastForward24h: () => {
        advanceDemoTimeHours(24)
        const nowIso = getDemoNowISO()

        // Check if TV-2026-0148 is still in awaiting-intake; if so, trigger 24h reminder email!
        const order148 = get().orders.find(
          (o) => o.orderNumber === 'TV-2026-0148' && o.status === 'awaiting-intake'
        )

        if (order148) {
          const reminderEmail: EmailMessage = {
            id: 'email-remind-' + Date.now(),
            recipient: order148.clientEmail,
            subject: `We are waiting on your intake for ${order148.orderNumber}`,
            trigger: '24 h with no intake',
            sentAt: nowIso,
            previewText: `Friendly reminder: writer Kabo Ntshole cannot begin your Company Profile until intake documents are uploaded.`,
            primaryButtonText: 'Complete your intake',
            primaryButtonUrl: `/portal/intake/A?orderId=${order148.id}`,
            isRead: false,
            plainText: `We are waiting on your intake for ${order148.orderNumber}. Complete now: https://tendervantage.example/portal/intake/A?orderId=${order148.id}`,
            htmlBody: `<h2>Reminder: Intake pending</h2><p>Please complete your intake for ${order148.orderNumber}.</p>`,
          }

          set((state) => ({ emails: [reminderEmail, ...state.emails] }))

          get().addToast({
            type: 'info',
            title: 'Time advanced 24 hours',
            message: `Automated intake reminder email dispatched for ${order148.orderNumber}.`,
            actionLabel: 'View email',
            actionUrl: '#inbox',
          })
        } else {
          get().addToast({
            type: 'info',
            title: 'Time advanced 24 hours',
            message: 'Clock moved forward by 24h.',
          })
        }
      },

      resetDemoData: () => {
        resetDemoClock()
        set({
          currentUser: DEMO_ACCOUNTS[0],
          cart: [],
          couponCode: null,
          discountPercent: 0,
          orders: SEED_ORDERS,
          documents: SEED_DOCUMENTS,
          messages: SEED_MESSAGES,
          notifications: SEED_NOTIFICATIONS,
          emails: SEED_EMAILS,
          webhooks: SEED_WEBHOOKS,
          scenarios: INITIAL_SCENARIOS,
          suggestedSteps: {
            browseStore: false,
            payCheckout: false,
            submitIntake: false,
            staffAdvance: false,
            inspectWebhooks: false,
          },
        })
        get().addToast({
          type: 'success',
          title: 'Demo data reset',
          message: 'All seed orders, documents, and logs have been restored.',
        })
      },
    }),
    {
      name: 'tv_demo_v1',
    }
  )
)
