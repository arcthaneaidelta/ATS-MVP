import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { CustomOrderStatus } from '@/mock/types'
import { formatBWP, formatDate } from '@/lib/format'
import { getDaysLeft } from '@/mock/clock'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Search, Clock, ArrowRight, X } from 'lucide-react'

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, orders } = useStore()

  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'closing'>('newest')

  // User's orders
  const userOrders = orders.filter(
    (o) => !currentUser || o.clientEmail === currentUser.email
  )

  const statuses: { id: string; label: string; count: number }[] = [
    { id: 'All', label: 'All', count: userOrders.length },
    {
      id: 'awaiting-intake',
      label: 'Awaiting Intake',
      count: userOrders.filter((o) => o.status === 'awaiting-intake').length,
    },
    {
      id: 'in-production',
      label: 'In Production',
      count: userOrders.filter((o) => o.status === 'in-production').length,
    },
    {
      id: 'client-review',
      label: 'Client Review',
      count: userOrders.filter((o) => o.status === 'client-review').length,
    },
    {
      id: 'revisions-requested',
      label: 'Revisions Requested',
      count: userOrders.filter((o) => o.status === 'revisions-requested').length,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: userOrders.filter((o) => o.status === 'delivered').length,
    },
  ]

  let filteredOrders = userOrders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter
    const matchesQuery =
      searchQuery.trim() === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesQuery
  })

  if (sortBy === 'closing') {
    filteredOrders = [...filteredOrders].sort(
      (a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
    )
  } else {
    filteredOrders = [...filteredOrders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E3DDD0]">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
            ORDERS VAULT
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#17323A] mt-1">
            Orders
          </h1>
          <p className="text-xs text-[#6F7A78] mt-1">
            Track active proposals, download deliverables, and inspect timelines.
          </p>
        </div>

        <BuildMapTag
          label="Orders List"
          wpEquivalent="WP Customer Area Orders Module"
          position="top-left"
        />
      </div>

      {/* Toolbar: Filters, Search, Sort */}
      <div className="space-y-4">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {statuses.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === st.id
                  ? 'bg-[#17323A] text-[#F6F3EC]'
                  : 'bg-[#EFEADF] text-[#4A5755] hover:text-[#17323A]'
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === st.id ? 'bg-[#5E7F78] text-white' : 'bg-[#CFC7B6]'
                }`}
              >
                {st.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#6F7A78] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, service, tender..."
              className="w-full h-10 pl-9 pr-8 rounded-[8px] bg-white border border-[#CFC7B6] text-xs text-[#1B2625] placeholder:text-[#6F7A78] focus:outline-none focus:border-[#17323A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6F7A78]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-xs text-[#6F7A78] shrink-0">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-2.5 rounded-[6px] bg-white border border-[#CFC7B6] font-semibold text-[#17323A] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="closing">Tender closing date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table (Desktop) / Cards (Mobile) */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-[12px] border border-[#E3DDD0] space-y-3">
          <p className="text-sm text-[#4A5755]">
            No orders match the selected filter.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setStatusFilter('All')
              setSearchQuery('')
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table (>= 768px) */}
          <div className="hidden md:block bg-white rounded-[12px] border border-[#E3DDD0] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF9F4] text-[#6F7A78] font-mono uppercase tracking-wider border-b border-[#E3DDD0]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Service</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Tender Closing</th>
                  <th className="py-3 px-4 font-semibold">Total (BWP)</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DDD0]">
                {filteredOrders.map((o) => {
                  const daysLeft = getDaysLeft(o.closingDate)
                  const isUrgent = daysLeft <= 10 && o.status !== 'delivered'

                  return (
                    <tr
                      key={o.id}
                      onClick={() => navigate(`/portal/orders/${o.id}`)}
                      className="hover:bg-[#EFEADF]/60 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 font-mono font-semibold text-[#17323A]">
                        {o.orderNumber}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#17323A] text-sm">
                          {o.serviceName}
                        </div>
                        <div className="text-[11px] text-[#6F7A78] truncate max-w-xs mt-0.5">
                          {o.tenderTitle}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <StatusPill status={o.status} size="sm" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono text-[#17323A]">
                          {formatDate(o.closingDate)}
                        </div>
                        {o.status !== 'delivered' && (
                          <div
                            className={`text-[10px] font-mono mt-0.5 ${
                              isUrgent ? 'text-[#A94438] font-bold' : 'text-[#5E7F78]'
                            }`}
                          >
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Closes today'}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-serif font-medium text-[#17323A] text-sm">
                        {formatBWP(o.totalBwp, { withDecimals: true })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-[#8A5F2B] hover:text-[#17323A] inline-flex items-center gap-1">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card List (< 768px per PRD) */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((o) => {
              const daysLeft = getDaysLeft(o.closingDate)
              const isUrgent = daysLeft <= 10 && o.status !== 'delivered'

              return (
                <div
                  key={o.id}
                  onClick={() => navigate(`/portal/orders/${o.id}`)}
                  className="p-4 bg-white rounded-[10px] border border-[#E3DDD0] space-y-2.5 active:bg-[#FBF9F4] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#17323A]">
                      {o.orderNumber}
                    </span>
                    <StatusPill status={o.status} size="sm" />
                  </div>

                  <h3 className="font-serif text-base font-medium text-[#17323A]">
                    {o.serviceName}
                  </h3>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E3DDD0]">
                    <div className="text-[11px] text-[#6F7A78] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}</span>
                    </div>
                    <div className="font-serif font-semibold text-[#17323A]">
                      {formatBWP(o.totalBwp, { withDecimals: true })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
