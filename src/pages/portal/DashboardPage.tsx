import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { getDaysLeft } from '@/mock/clock'
import { formatDate } from '@/lib/format'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  UploadCloud,
  ShoppingBag,
  MessageSquare,
  FileText,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, orders, documents, messages, notifications } = useStore()

  // Filter orders for the current user
  const userOrders = orders.filter(
    (o) => !currentUser || o.clientEmail === currentUser.email
  )

  const activeOrders = userOrders.filter((o) => o.status !== 'delivered')
  const deliveredOrders = userOrders.filter((o) => o.status === 'delivered')

  // Derive "Needs your attention" items
  const attentionItems: {
    id: string
    title: string
    dueText: string
    orderId: string
    buttonText: string
    actionUrl: string
  }[] = []

  userOrders.forEach((o) => {
    if (o.status === 'awaiting-intake') {
      attentionItems.push({
        id: `att-intake-${o.id}`,
        title: `Complete intake for ${o.orderNumber} (${o.serviceName})`,
        dueText: 'Due before writer can begin drafting',
        orderId: o.id,
        buttonText: 'Complete intake',
        actionUrl: `/portal/intake/A?orderId=${o.id}`,
      })
    } else if (o.status === 'client-review') {
      attentionItems.push({
        id: `att-review-${o.id}`,
        title: `Review draft for ${o.orderNumber} (${o.serviceName})`,
        dueText: 'Draft ready · Review window active',
        orderId: o.id,
        buttonText: 'Review draft',
        actionUrl: `/portal/orders/${o.id}`,
      })
    }
  })

  const firstName = currentUser?.name.split(' ')[0] || 'Client'

  // Summary figures
  const ordersCount = userOrders.length
  const userDocuments = documents.filter(
    (d) => !currentUser || !d.orderNumber || userOrders.some((o) => o.orderNumber === d.orderNumber)
  )
  const nextClosingOrder = activeOrders.sort(
    (a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
  )[0]

  return (
    <div className="space-y-10">
      {/* 1. Greeting and Focus (Top) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              OVERVIEW · {currentUser?.companyName}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#17323A] mt-1">
              Good afternoon, {firstName}.
            </h1>
          </div>

          <BuildMapTag
            label="Client Dashboard"
            wpEquivalent="WP Customer Area Dashboard"
            position="top-left"
          />
        </div>

        {/* "Needs Your Attention" Card with Ochre Left Border */}
        {attentionItems.length > 0 && (
          <div className="p-6 bg-white rounded-[12px] border-l-4 border-l-[#B8864B] border-y border-r border-[#E3DDD0] shadow-[0_6px_20px_-8px_rgba(23,50,58,0.1)] space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8864B]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
                Needs your attention ({attentionItems.length})
              </h2>
            </div>

            <div className="divide-y divide-[#E3DDD0]">
              {attentionItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-[#17323A]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6F7A78] mt-0.5">{item.dueText}</p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(item.actionUrl)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="shrink-0"
                  >
                    {item.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Active Orders Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-medium text-[#17323A]">
            Active orders ({activeOrders.length})
          </h2>
          <Link
            to="/portal/orders"
            className="text-xs font-semibold text-[#17323A] hover:text-[#B8864B] flex items-center gap-1"
          >
            <span>View all orders ({ordersCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[12px] border border-[#E3DDD0] space-y-3">
            <p className="text-sm text-[#4A5755]">
              No active orders right now. When you order a service, you can follow every step here.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/store')}>
              Browse services
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.slice(0, 3).map((order) => {
              const daysLeft = getDaysLeft(order.closingDate)
              const isUrgent = daysLeft <= 10

              return (
                <div
                  key={order.id}
                  className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] hover:border-[#CFC7B6] hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#6F7A78]">
                        {order.orderNumber}
                      </span>
                      <StatusPill status={order.status} size="sm" />
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#17323A] leading-snug">
                      {order.serviceName}
                    </h3>

                    <p className="text-xs text-[#4A5755] truncate">
                      {order.tenderTitle}
                    </p>

                    {/* 5-dot status indicator */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#6F7A78] mb-1.5">
                        <span>Delivery stages</span>
                        <span className="text-[#17323A] font-semibold capitalize">
                          {order.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {(
                          [
                            'awaiting-intake',
                            'in-production',
                            'client-review',
                            'revisions-requested',
                            'delivered',
                          ] as const
                        ).map((st, i) => {
                          const isDone =
                            order.status === 'delivered' ||
                            (order.status === 'client-review' && i <= 2) ||
                            (order.status === 'in-production' && i <= 1) ||
                            (order.status === 'awaiting-intake' && i === 0)
                          return (
                            <div
                              key={st}
                              className={`h-1.5 flex-1 rounded-full ${
                                isDone ? 'bg-[#3F6C8C]' : 'bg-[#E3DDD0]'
                              }`}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E3DDD0] flex items-center justify-between">
                    <div
                      className={`text-[11px] font-mono font-semibold flex items-center gap-1 ${
                        isUrgent ? 'text-[#A94438]' : 'text-[#5E7F78]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{daysLeft > 0 ? `Closes in ${daysLeft} days` : 'Closing today'}</span>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/portal/orders/${order.id}`)}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 3. Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Activity Timeline (8 cols) */}
        <section className="lg:col-span-8 bg-white rounded-[12px] border border-[#E3DDD0] p-6 space-y-5">
          <h2 className="font-serif text-xl font-medium text-[#17323A]">
            Recent Activity
          </h2>

          <div className="divide-y divide-[#E3DDD0] text-xs">
            {notifications.slice(0, 5).map((act) => (
              <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FBF9F4] border border-[#E3DDD0] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5E7F78]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#17323A]">{act.title}</div>
                  <div className="text-[#4A5755] mt-0.5">{act.description}</div>
                </div>
                <span className="text-[10px] font-mono text-[#6F7A78] shrink-0">
                  {formatDate(act.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions (4 cols) */}
        <section className="lg:col-span-4 bg-[#FBF9F4] rounded-[12px] border border-[#E3DDD0] p-6 space-y-4">
          <h2 className="font-serif text-lg font-medium text-[#17323A]">
            Quick Actions
          </h2>

          <div className="space-y-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/portal/documents')}
              leftIcon={<UploadCloud className="w-4 h-4 text-[#5E7F78]" />}
              className="w-full justify-start text-xs bg-white"
            >
              Upload a document to vault
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/store')}
              leftIcon={<ShoppingBag className="w-4 h-4 text-[#B8864B]" />}
              className="w-full justify-start text-xs bg-white"
            >
              Order another service
            </Button>

            {activeOrders[0] && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate(`/portal/orders/${activeOrders[0].id}`)}
                leftIcon={<MessageSquare className="w-4 h-4 text-[#3F6C8C]" />}
                className="w-full justify-start text-xs bg-white"
              >
                Contact writer ({activeOrders[0].writerName})
              </Button>
            )}
          </div>
        </section>
      </div>

      {/* 5. Summary Strip (Small, Last per PRD) */}
      <div className="p-4 rounded-[10px] bg-white border border-[#E3DDD0] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-[#6F7A78] block">Orders this year:</span>
          <strong className="text-sm font-serif text-[#17323A]">{ordersCount} orders</strong>
        </div>
        <div>
          <span className="text-[#6F7A78] block">Private documents stored:</span>
          <strong className="text-sm font-serif text-[#17323A]">{userDocuments.length} files</strong>
        </div>
        <div>
          <span className="text-[#6F7A78] block">Next tender closing date:</span>
          <strong className="text-sm font-serif text-[#17323A]">
            {nextClosingOrder ? formatDate(nextClosingOrder.closingDate) : 'None pending'}
          </strong>
        </div>
      </div>
    </div>
  )
}
