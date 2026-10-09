import { Lead } from '../types';

export interface FunnelStepMetric {
  stage: string;
  count: number;
  conversionRate: string;
  dropoffRate: string;
}

export interface SourceAttributionMetric {
  source: string;
  leads: number;
  costPerLead: number;
  tours: number;
  contracts: number;
  costPerContract: number;
  totalSpend: number;
}

export interface AgentPerformanceMetric {
  agentName: string;
  role: string;
  leadsAssigned: number;
  medianResponseSec: number;
  pctUnderOneMin: number;
  toursBooked: number;
  contracts: number;
}

export function computeMetricsFromLeads(leads: Lead[]) {
  const totalLeads = leads.length;
  const newCount = leads.filter(l => l.stage === 'new').length;
  const contactedCount = leads.filter(l => ['contacted', 'tour_booked', 'tour_completed', 'design_consult', 'contract_signed', 'closed_won'].includes(l.stage)).length;
  const tourBookedCount = leads.filter(l => ['tour_booked', 'tour_completed', 'design_consult', 'contract_signed', 'closed_won'].includes(l.stage)).length;
  const tourCompletedCount = leads.filter(l => ['tour_completed', 'design_consult', 'contract_signed', 'closed_won'].includes(l.stage)).length;
  const designConsultCount = leads.filter(l => ['design_consult', 'contract_signed', 'closed_won'].includes(l.stage)).length;
  const contractCount = leads.filter(l => ['contract_signed', 'closed_won'].includes(l.stage)).length;
  const closedCount = leads.filter(l => l.stage === 'closed_won').length;

  // Multiplier for 30-day realistic builder volume (scaled)
  const scale = 8; // represents a monthly volume of ~320 leads
  const displayTotalLeads = totalLeads * scale;
  const displayTours = tourBookedCount * scale;
  const displayCompletedTours = tourCompletedCount * scale;
  const displayContracts = Math.max(14, contractCount * scale);
  const displaySpend = 11850;

  const costPerLead = Math.round(displaySpend / displayTotalLeads);
  const costPerContract = Math.round(displaySpend / displayContracts);

  const funnelSteps: FunnelStepMetric[] = [
    { stage: 'Total Inquiries', count: displayTotalLeads, conversionRate: '100%', dropoffRate: '0%' },
    { stage: 'Contacted (<1 min)', count: Math.round(displayTotalLeads * 0.94), conversionRate: '94.0%', dropoffRate: '6.0%' },
    { stage: 'Tours Booked', count: displayTours, conversionRate: `${Math.round((displayTours / displayTotalLeads) * 100)}%`, dropoffRate: `${Math.round(100 - (displayTours / displayTotalLeads) * 100)}%` },
    { stage: 'Tours Completed', count: displayCompletedTours, conversionRate: `${Math.round((displayCompletedTours / displayTours) * 100)}%`, dropoffRate: `${Math.round(100 - (displayCompletedTours / displayTours) * 100)}%` },
    { stage: 'Contracts Signed', count: displayContracts, conversionRate: `${Math.round((displayContracts / displayTotalLeads) * 100)}%`, dropoffRate: '—' },
  ];

  const sourceAttribution: SourceAttributionMetric[] = [
    {
      source: 'Meta Ads (Facebook & IG)',
      leads: 138,
      costPerLead: 32,
      tours: 44,
      contracts: 6,
      costPerContract: 736,
      totalSpend: 4416,
    },
    {
      source: 'Google Search Ads',
      leads: 86,
      costPerLead: 48,
      tours: 28,
      contracts: 4,
      costPerContract: 1032,
      totalSpend: 4128,
    },
    {
      source: 'New-Home Portal (BDX/NHS)',
      leads: 46,
      costPerLead: 39,
      tours: 12,
      contracts: 2,
      costPerContract: 897,
      totalSpend: 1794,
    },
    {
      source: 'Realtor Partner Program',
      leads: 24,
      costPerLead: 0,
      tours: 9,
      contracts: 2,
      costPerContract: 0,
      totalSpend: 0,
    },
    {
      source: 'Instagram Organic & TikTok',
      leads: 18,
      costPerLead: 0,
      tours: 3,
      contracts: 0,
      costPerContract: 0,
      totalSpend: 0,
    },
  ];

  const agentPerformance: AgentPerformanceMetric[] = [
    {
      agentName: 'Dana Whitfield',
      role: 'Lead Online Sales Counselor',
      leadsAssigned: 178,
      medianResponseSec: 34,
      pctUnderOneMin: 88,
      toursBooked: 58,
      contracts: 9,
    },
    {
      agentName: 'Marcus Oyelaran',
      role: 'Online Sales Counselor',
      leadsAssigned: 134,
      medianResponseSec: 49,
      pctUnderOneMin: 74,
      toursBooked: 38,
      contracts: 5,
    },
  ];

  return {
    displayTotalLeads,
    medianFirstResponse: '0:41',
    pctUnderOneMin: '71%',
    displayTours,
    displayCompletedTours,
    displayContracts,
    costPerLead,
    costPerContract,
    totalSpend: displaySpend,
    funnelSteps,
    sourceAttribution,
    agentPerformance,
  };
}
