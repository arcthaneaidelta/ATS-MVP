export interface OEMReference {
  oem: string;
  number: string;
  type: 'OEM' | 'Aftermarket' | 'Superseded';
  compatibilityNote?: string;
}

export interface VerifiedAlternative {
  partId: string;
  description: string;
  manufacturer: string;
  partNumber: string;
  verifiedBy: string;
  verifiedDate: string;
  compatibilityScore: number;
  notes: string;
}

export interface PartDocument {
  id: string;
  title: string;
  type: 'drawing' | 'spec_sheet' | 'certificate';
  size: string;
  date: string;
}

export interface Part {
  id: string;
  description: string;
  category: string;
  oemReferences: OEMReference[];
  verifiedAlternatives: VerifiedAlternative[];
  specs: Record<string, string>;
  applications: string[];
  documents: PartDocument[];
  replacesChain?: {
    replaces?: string;
    replacedBy?: string;
  };
  oemListPrice: number;
  lastSupplierCost: number;
  lastSupplierCurrency: 'USD' | 'PEN' | 'ZMW';
  lastQuotedPrice: number;
  lastQuotedDate: string;
  lastQuotedRef: string;
  timesSold12m: number;
  stockPerEntity: Record<string, number>;
}

export interface CommercialEvent {
  id: string;
  partId: string;
  type: 'customer_quote' | 'customer_sale' | 'supplier_quote' | 'supplier_purchase';
  date: string;
  reference: string;
  counterparty: string;
  entityId: string;
  qty: number;
  unitPrice: number;
  currency: 'USD' | 'PEN' | 'ZMW';
  status: string;
  marginPercent?: number;
}

export interface RfqLineItem {
  id: string;
  lineIndex: number;
  rawPartNumber: string;
  rawDescription: string;
  qty: number;
  status: 'matched' | 'matched_alternate' | 'multiple_candidates' | 'not_found';
  matchedPartId?: string;
  matchedViaOem?: string;
  candidatePartIds?: string[];
  suggestedSupplierCost: number;
  suggestedSupplierName: string;
  suggestedSupplierQuoteRef: string;
  suggestedSupplierValidity: string;
  alternativeSuppliers: Array<{
    name: string;
    price: number;
    leadTimeDays: number;
    quoteRef: string;
    validity: string;
    onTimeRate: number;
  }>;
  latestCustomerPrice: number;
  latestCustomerQuoteRef: string;
  latestCustomerDate: string;
  targetMargin: number;
  unitPrice: number;
}

export interface Quotation {
  id: string;
  rfqRef: string;
  customer: string;
  entityId: string;
  date: string;
  validityDate: string;
  currency: 'USD' | 'PEN' | 'ZMW';
  incoterm: 'FOB' | 'CIF' | 'DDP' | 'EXW';
  paymentTerms: string;
  status: 'Draft' | 'Needs review' | 'Sent' | 'Negotiating' | 'Won' | 'Lost';
  lines: Array<{
    partId: string;
    description: string;
    oemRef: string;
    qty: number;
    supplierCost: number;
    unitPrice: number;
    marginPercent: number;
  }>;
  subtotal: number;
  total: number;
  estimatedMargin: number;
  version: number;
  historyVersions?: Array<{
    version: number;
    date: string;
    total: number;
    notes: string;
  }>;
}

export interface OrderLine {
  partId: string;
  description: string;
  orderedQty: number;
  deliveredQty: number;
  inTransitQty: number;
  unitPrice: number;
  linkedSupplierOrderId?: string;
}

export interface DeliveryRecord {
  id: string;
  date: string;
  waybill: string;
  carrier: string;
  items: Array<{ partId: string; qty: number }>;
}

export interface Order {
  id: string;
  type: 'customer' | 'supplier';
  counterparty: string;
  entityId: string;
  date: string;
  expectedDeliveryDate: string;
  total: number;
  currency: 'USD' | 'PEN' | 'ZMW';
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid';
  fulfillmentStatus: 'Pending' | 'In Transit' | 'Partially Delivered' | 'Delivered';
  lines: OrderLine[];
  linkedOrders: string[];
  deliveries: DeliveryRecord[];
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  currency: 'USD' | 'PEN' | 'ZMW';
  method: string;
  bankRef: string;
  notes?: string;
}

export interface PaymentMilestone {
  step: string;
  percent: number;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface Invoice {
  id: string;
  type: 'receivable' | 'payable';
  customer: string;
  entityId: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  currency: 'USD' | 'PEN' | 'ZMW';
  status: 'Paid' | 'Partial' | 'Overdue' | 'Not due';
  daysOverdue: number;
  milestones: PaymentMilestone[];
  payments: PaymentRecord[];
}

export interface DocumentRecord {
  id: string;
  type:
    | 'Quotation'
    | 'Supplier RFQ'
    | 'Purchase Order'
    | 'Pro Forma Invoice'
    | 'Commercial Invoice'
    | 'Packing List'
    | 'Credit Note';
  ref: string;
  counterparty: string;
  linkedRecord: string;
  date: string;
  amount: number;
  currency: 'USD' | 'PEN' | 'ZMW';
  status: 'Issued' | 'Pending' | 'Approved' | 'Sent' | 'Cancelled';
  entityId: string;
}

export interface DuplicatePair {
  id: string;
  partA: {
    id: string;
    description: string;
    oemRef: string;
    category: string;
  };
  partB: {
    id: string;
    description: string;
    oemRef: string;
    category: string;
  };
  confidence: number;
  status: 'pending' | 'merged' | 'kept_separate' | 'alternative_added';
  differences: string[];
}

export interface DriveFileRelink {
  id: string;
  filename: string;
  detectedInvoiceRef: string;
  detectedPartId: string;
  confidence: number;
  originalPreserved: boolean;
}

export interface AttentionItem {
  id: string;
  iconType: 'unmatched' | 'expire' | 'duplicate' | 'overdue';
  title: string;
  entityId: string;
  actionText: string;
  actionRoute: string;
  done: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}
