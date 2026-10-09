export type StageId = 
  | 'new_inquiry'
  | 'contacted'
  | 'qualified'
  | 'consultation_booked'
  | 'proposal_sent'
  | 'won'
  | 'lost';

export interface StageInfo {
  id: StageId;
  name: string;
  description: string;
  rulesCount: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
}

export interface ConsentInfo {
  sms: boolean;
  email: boolean;
  timestamp: string;
  text: string;
}

export interface DndInfo {
  sms: boolean;
  email: boolean;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  ownerOccupied: boolean;
  source: string;
  tags: string[];
  consent: ConsentInfo;
  dnd: DndInfo;
  createdAt: string;
  mergedFrom?: string[];
  notes?: string;
  stage: StageId;
  lastTouch: string;
  projectDescription?: string;
}

export interface Opportunity {
  id: string;
  contactId: string;
  stage: StageId;
  value: number;
  projectType: string;
  budgetBand: string;
  startWindow: string;
  assigneeId: string;
  createdAt: string;
  lostReason?: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'no_show' | 'cancelled';
export type AppointmentFormat = 'video' | 'in_home';

export interface Appointment {
  id: string;
  contactId: string;
  start: string; // ISO string
  end: string;   // ISO string
  format: AppointmentFormat;
  status: AppointmentStatus;
  assigneeId: string;
  title: string;
}

export type MessageChannel = 'sms' | 'email';
export type MessageStatus = 'queued' | 'sent' | 'cancelled' | 'held' | 'delivered';

export interface Message {
  id: string;
  contactId: string;
  channel: MessageChannel;
  templateId: string;
  templateName: string;
  content: string;
  status: MessageStatus;
  scheduledFor: string;
  reason?: string;
  sentAt?: string;
}

export interface TranscriptLine {
  speaker: 'agent' | 'caller';
  text: string;
  timeSec: number;
}

export type CallOutcome = 'qualified' | 'booked' | 'callback_requested' | 'no_answer' | 'voicemail';

export interface Call {
  id: string;
  contactId: string;
  callerName: string;
  phone: string;
  direction: 'inbound' | 'outbound';
  outcome: CallOutcome;
  durationSec: number;
  timestamp: string;
  summary: string;
  transcript: TranscriptLine[];
  extractedFields: Record<string, string>;
  resultInGhl: {
    stageMoved?: StageId;
    tagsAdded?: string[];
    taskCreated?: string;
    bookingCreated?: boolean;
  };
}

export type NodeType = 'trigger' | 'action' | 'wait' | 'condition' | 'exit';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle?: string;
  channel?: MessageChannel;
  copy?: string;
  sendWindow?: string;
  stopConditions?: string[];
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  activeLeads: number;
  lastEdited: string;
  enabled: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface Task {
  id: string;
  contactId: string;
  title: string;
  dueDate: string;
  assigneeId: string;
  completed: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  contactId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type: 'lead' | 'message' | 'call' | 'system' | 'booking';
  title: string;
  description: string;
  contactId?: string;
  timestamp: string;
  highlight?: boolean;
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  key: string;
  type: 'text' | 'select' | 'boolean' | 'number' | 'timestamp';
  usedInCount: number;
  locations: string[];
}

export interface TagDefinition {
  id: string;
  name: string;
  category: 'Lifecycle' | 'Intent' | 'Compliance' | 'Source';
  count: number;
  color: string;
}

export interface SourceDefinition {
  id: string;
  source: string;
  utmSource: string;
  leadsCount: number;
  conversionRate: number;
}
