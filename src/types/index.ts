export type LeadStage =
  | 'new'
  | 'contacted'
  | 'tour_booked'
  | 'tour_completed'
  | 'design_consult'
  | 'contract_signed'
  | 'closed_won'
  | 'nurture'
  | 'lost';

export type LeadScore = 'Hot' | 'Warm' | 'Cool';

export type LeadSource =
  | 'Meta Ads'
  | 'Google Search'
  | 'New-Home Portal'
  | 'Instagram Organic'
  | 'Referral'
  | 'Walk-in'
  | 'Realtor Partner';

export type MessageChannel = 'sms' | 'email' | 'instagram' | 'facebook' | 'google_chat';

export interface LeadActivity {
  id: string;
  timestamp: string;
  type: 'inquiry' | 'sms_sent' | 'sms_received' | 'email_sent' | 'call_logged' | 'stage_changed' | 'tour_scheduled' | 'note_added' | 'workflow_trigger';
  title: string;
  description: string;
  author?: string;
  isAutomated?: boolean;
}

export interface LeadMessage {
  id: string;
  sender: 'buyer' | 'agent' | 'system';
  channel: MessageChannel;
  text: string;
  timestamp: string;
  isAutomated?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  partnerName?: string;
  phone: string;
  email: string;
  communityId: string;
  communityName: string;
  planId?: string;
  planName?: string;
  budgetRange: string;
  timeline: string; // e.g. "Within 3 months", "3-6 months", "6-12 months"
  preApproved: boolean;
  score: LeadScore;
  stage: LeadStage;
  source: LeadSource;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  lastTouch: string;
  nextStep: string;
  notes: string[];
  tags: string[];
  activities: LeadActivity[];
  messages: LeadMessage[];
  daysInStage: number;
}

export interface Community {
  id: string;
  name: string;
  city: string;
  state: string;
  priceFrom: number;
  startingHomesCount: number;
  description: string;
  schoolDistrict: string;
  amenities: string[];
  lotsAvailable: number;
  address: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  communityIds: string[];
  beds: number;
  baths: number;
  sqft: number;
  stories: number;
  priceFrom: number;
  garage: string;
  highlight: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'owner' | 'osc' | 'agent' | 'marketing';
  title: string;
  email: string;
  phone: string;
  avatarInitials: string;
  assignedCommunities: string[];
  activeLeadsCount: number;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'wait' | 'condition' | 'sms' | 'email' | 'task' | 'tag' | 'stage_move';
  title: string;
  description: string;
  timing?: string;
  details: string;
}

export interface Workflow {
  id: string;
  title: string;
  category: 'Speed-to-Lead' | 'Nurture' | 'Conversion' | 'Operations' | 'Retention';
  description: string;
  trigger: string;
  active: boolean;
  enrolledLeadsCount: number;
  executedCount: number;
  nodes: WorkflowNode[];
}

export interface CampaignTemplate {
  id: string;
  title: string;
  channel: 'email' | 'sms';
  stage: string;
  subject?: string;
  previewText?: string;
  body: string;
  segmentsCount?: number;
  charCount?: number;
  tags: string[];
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'google_business';
  date: string; // YYYY-MM-DD
  time: string;
  status: 'published' | 'scheduled' | 'queue';
  caption: string;
  category: string;
  likes?: number;
  comments?: number;
  imageTheme: string;
}

export interface AcademyChapter {
  id: string;
  number: number;
  title: string;
  durationMinutes: number;
  durationSeconds: number;
  summary: string;
  checklist: string[];
  transcriptSnippet: string;
  videoTimestamp?: string;
}

export type UserRole = 'owner' | 'osc' | 'agent';

export interface NeedsActionItem {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  type: 'overdue_call' | 'unanswered_message' | 'tour_today' | 'high_intent';
  title: string;
  subtitle: string;
  urgency: 'high' | 'medium';
  actionLabel: string;
}
