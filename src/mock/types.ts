export type TenderStage = 'Find' | 'Decide' | 'Prepare' | 'Write' | 'Submit and learn'

export type CustomOrderStatus =
  | 'awaiting-intake'
  | 'in-production'
  | 'client-review'
  | 'revisions-requested'
  | 'delivered'

export type IntakeFormId = 'A' | 'B' | 'C'

export interface ServiceAddOn {
  id: string
  name: string
  priceBwp: number
}

export interface ServiceItem {
  id: string
  slug: string
  name: string
  stage: TenderStage
  turnaround: string
  priceBwp: number
  fromPrice: boolean
  intakeFormId: IntakeFormId
  intakeFormTitle: string
  shortOutcome: string
  description: string
  inclusions: string[]
  whatWeNeedFromYou: string[]
  faqs: { question: string; answer: string }[]
  relatedServiceIds: string[]
}

export interface OrderItem {
  id: string
  orderNumber: string // e.g. "TV-2026-0148"
  serviceId: string
  serviceName: string
  stage: TenderStage
  clientEmail: string
  clientName: string
  companyName: string
  status: CustomOrderStatus
  tenderReference: string
  tenderTitle: string
  procuringEntity: string
  closingDate: string
  subtotalBwp: number
  vatBwp: number
  totalBwp: number
  addOns: ServiceAddOn[]
  writerName: string
  writerRole: string
  writerInitials: string
  createdAt: string
  updatedAt: string
  expectedDraftDate: string
  intakeSubmitted: boolean
  draftFileUrl?: string
  revisionComments?: string[]
  revisionCount: number
  deliveredDate?: string
  rating?: number
}

export interface DocumentItem {
  id: string
  orderId?: string
  orderNumber?: string
  name: string
  sizeFormatted: string
  sizeBytes: number
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP' | 'IMAGE'
  source: 'tendervantage' | 'client'
  uploadedAt: string
  category: 'deliverable' | 'draft' | 'client-upload' | 'compliance'
}

export interface MessageItem {
  id: string
  orderId: string
  senderRole: 'client' | 'writer'
  senderName: string
  senderInitials: string
  text: string
  timestamp: string
}

export interface NotificationItem {
  id: string
  clientEmail: string
  title: string
  description: string
  timestamp: string
  unread: boolean
  orderId?: string
  linkUrl?: string
}

export interface WebhookLogEntry {
  id: string
  endpoint: '/hooks/order-created' | '/hooks/order-status-changed' | '/hooks/intake-submitted' | '/hooks/order-delivered'
  event: string
  status: 200 | 500
  durationMs: number
  timestamp: string
  headers: Record<string, string>
  payload: Record<string, any>
  canRetry?: boolean
}

export interface EmailMessage {
  id: string
  recipient: string
  subject: string
  trigger: string
  sentAt: string
  previewText: string
  primaryButtonText?: string
  primaryButtonUrl?: string
  htmlBody: string
  plainText: string
  isRead: boolean
}

export interface ClientAccount {
  id: string
  name: string
  email: string
  companyName: string
  location: string
  cipaNumber: string
  role: 'client' | 'staff'
  situationDescription: string
  demonstrates: string
}

export interface ScenarioFlags {
  paymentDeclinedNext: boolean
  paymentPendingNext: boolean
  downloadFailsNext: boolean
  slowNetwork: boolean
  receiverFailure500: boolean
  buildMapActive: boolean
}
