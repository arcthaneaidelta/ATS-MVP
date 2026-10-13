export type UserRole = 'diner' | 'student' | 'venue_manager' | 'admin' | 'super_admin';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: string;
  accent: string;
  branches: string[];
  plan: 'Starter' | 'Growth' | 'Scale' | 'Trial';
  status: 'Active' | 'Trial' | 'Suspended';
  gmv30d: number;
  createdAt: string;
}

export interface MenuItemModifierOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuItemModifierGroup {
  id: string;
  name: string;
  required: boolean;
  min?: number;
  max?: number;
  options: MenuItemModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'Starters' | 'Mains' | 'Sides' | 'Desserts' | 'Drinks';
  price: number;
  tags: ('VG' | 'V' | 'GF' | 'Spicy')[];
  modifierGroups?: MenuItemModifierGroup[];
  isSoldOut?: boolean;
  branchAvailability?: Record<string, boolean>;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: { groupName: string; optionName: string; priceDelta: number }[];
  instructions?: string;
}

export type OrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Collected';

export interface Order {
  id: string;
  orderNumber: string;
  tenantId: string;
  branchId: string;
  table: string;
  items: OrderItem[];
  subtotal: number;
  serviceCharge: number;
  tax: number;
  tip: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'Paid' | 'Pay at counter' | 'Refunded';
  paymentMethod: 'card' | 'wallet' | 'counter';
  createdAt: string; // ISO string
  updatedAt: string;
  customerName?: string;
  notes?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  durationMinutes: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  instructorRole: string;
  lessonCount: number;
  durationHours: number;
  price: number;
  isFree?: boolean;
  rating: number;
  studentsEnrolled: number;
  status: 'Published' | 'Draft' | 'Archived';
  category: string;
  modules: CourseModule[];
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  courseSlug: string;
  issueDate: string;
  status: 'Valid' | 'Revoked';
  qrVerifyUrl: string;
}

export interface JobRole {
  id: string;
  title: string;
  team: 'Engineering' | 'Design' | 'Product' | 'Operations';
  location: 'Remote' | 'On-site';
  type: string;
  posted: string;
  description: string;
  requirements: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  clientType: string;
  role: string;
  timeline: string;
  stack: string[];
  summary: string;
  challenge: string;
  approach: string;
  outcomeMetrics: { label: string; value: string }[];
}

export interface PaymentLedgerEntry {
  id: string;
  orderNumber: string;
  timestamp: string;
  method: string;
  amount: number;
  fee: number;
  status: 'Settled' | 'Pending' | 'Refunded' | 'Failed';
  customer: string;
}
