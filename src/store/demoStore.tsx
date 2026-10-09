import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, LeadStage, UserRole } from '../types';
import { initialLeads } from '../data/leads';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

interface DemoStoreContextType {
  leads: Lead[];
  selectedLeadId: string | null;
  currentUserRole: UserRole;
  selectedCommunity: string;
  liveActivityEnabled: boolean;
  completedChapters: string[];
  complianceGuardActive: boolean;
  toasts: ToastMessage[];
  setSelectedLeadId: (id: string | null) => void;
  setUserRole: (role: UserRole) => void;
  setSelectedCommunity: (communityId: string) => void;
  setComplianceGuardActive: (active: boolean) => void;
  setLiveActivityEnabled: (enabled: boolean) => void;
  moveLeadStage: (leadId: string, newStage: LeadStage) => void;
  addLead: (newLead: Partial<Lead>) => Lead;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  addMessageToLead: (leadId: string, text: string, sender?: 'buyer' | 'agent' | 'system', isAutomated?: boolean) => void;
  addToast: (title: string, description: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  toggleChapterComplete: (chapterId: string) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = 'groundwork_demo_state_v1';

const DemoStoreContext = createContext<DemoStoreContextType | null>(null);

export const DemoStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = sessionStorage.getItem(`${STORAGE_KEY}_leads`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialLeads;
  });

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const [currentUserRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = sessionStorage.getItem(`${STORAGE_KEY}_role`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return 'owner';
  });

  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [liveActivityEnabled, setLiveActivityEnabled] = useState<boolean>(true);
  const [complianceGuardActive, setComplianceGuardActive] = useState<boolean>(true);

  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('groundwork_academy_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['ch-1']; // chapter 1 completed by default
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist leads to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads]);

  // Persist role
  useEffect(() => {
    try {
      sessionStorage.setItem(`${STORAGE_KEY}_role`, JSON.stringify(currentUserRole));
    } catch {
      // ignore
    }
  }, [currentUserRole]);

  // Persist academy chapters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('groundwork_academy_progress', JSON.stringify(completedChapters));
    } catch {
      // ignore
    }
  }, [completedChapters]);

  const addToast = (
    title: string,
    description: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, description, type, timestamp: Date.now() };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const moveLeadStage = (leadId: string, newStage: LeadStage) => {
    const stageNames: Record<LeadStage, string> = {
      new: 'New Inquiry',
      contacted: 'Contacted',
      tour_booked: 'Tour Booked',
      tour_completed: 'Tour Completed',
      design_consult: 'Design Consult',
      contract_signed: 'Contract Signed',
      closed_won: 'Closed Won',
      nurture: 'Nurture (Not Ready)',
      lost: 'Lost',
    };

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;

        const stageTitle = stageNames[newStage];
        const newActivity = {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: 'stage_changed' as const,
          title: `Moved to ${stageTitle}`,
          description: `Stage updated to ${stageTitle}. Associated automation sequences enrolled.`,
        };

        return {
          ...lead,
          stage: newStage,
          lastTouch: 'Just now',
          daysInStage: 0,
          activities: [newActivity, ...lead.activities],
        };
      })
    );

    const lead = leads.find((l) => l.id === leadId);
    const leadName = lead ? lead.name : 'Lead';

    let workflowNotice = 'Stage updated';
    if (newStage === 'tour_booked') {
      workflowNotice = 'Workflow started: Tour Reminder & No-Show Rescue (24h/2h/15m)';
    } else if (newStage === 'tour_completed') {
      workflowNotice = 'Workflow started: Post-Tour Pricing Sheet & 48h Lot Courtesy Hold';
    } else if (newStage === 'design_consult') {
      workflowNotice = 'Workflow started: Design Studio Selections Packet & Prep Guide';
    } else if (newStage === 'contract_signed') {
      workflowNotice = 'Workflow started: Pre-Construction Conference & Escrow Tracking';
    } else if (newStage === 'closed_won') {
      workflowNotice = 'Workflow scheduled: 14-Day Post-Closing 5-Star Review Sequence';
    } else if (newStage === 'nurture') {
      workflowNotice = 'Workflow enrolled: 90-Day New-Home Buyer Nurture';
    }

    addToast(`Moved ${leadName}`, workflowNotice, 'success');
  };

  const addLead = (leadData: Partial<Lead>): Lead => {
    const id = `lead-${Date.now()}`;
    const newLead: Lead = {
      id,
      name: leadData.name || 'New Buyer Inquiry',
      phone: leadData.phone || '(704) 555-0199',
      email: leadData.email || 'buyer@example.com',
      communityId: leadData.communityId || 'harlow-creek',
      communityName: leadData.communityName || 'Harlow Creek',
      planId: leadData.planId || 'calder',
      planName: leadData.planName || 'The Calder',
      budgetRange: leadData.budgetRange || '$450k – $520k',
      timeline: leadData.timeline || 'Within 3 months',
      preApproved: leadData.preApproved ?? true,
      score: leadData.score || 'Hot',
      stage: leadData.stage || 'new',
      source: leadData.source || 'Meta Ads',
      ownerId: leadData.ownerId || 'dana-whitfield',
      ownerName: leadData.ownerName || 'Dana Whitfield',
      createdAt: new Date().toISOString(),
      lastTouch: 'Just now',
      nextStep: leadData.nextStep || 'Speed-to-lead sequence triggered',
      notes: leadData.notes || ['Inquired via online funnel.'],
      tags: leadData.tags || ['Speed-to-Lead', 'Online Lead'],
      daysInStage: 0,
      activities: [
        {
          id: `act-${Date.now()}-1`,
          timestamp: 'Just now',
          type: 'inquiry',
          title: 'Lead Captured via Online Funnel',
          description: `Inquiry submitted for ${leadData.communityName || 'Harlow Creek'}.`,
          isAutomated: true,
        },
      ],
      messages: leadData.messages || [],
    };

    setLeads((prev) => [newLead, ...prev]);
    addToast('New Lead Captured', `${newLead.name} added to pipeline (${newLead.communityName})`, 'info');
    return newLead;
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...updates, lastTouch: 'Just now' } : l))
    );
  };

  const addMessageToLead = (
    leadId: string,
    text: string,
    sender: 'buyer' | 'agent' | 'system' = 'agent',
    isAutomated: boolean = false
  ) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender,
          channel: 'sms' as const,
          text,
          timestamp: 'Just now',
          isAutomated,
        };
        const newAct = {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: sender === 'buyer' ? ('sms_received' as const) : ('sms_sent' as const),
          title: sender === 'buyer' ? 'SMS Received from Buyer' : `SMS Sent by ${sender === 'system' ? 'System' : 'Agent'}`,
          description: text,
          isAutomated,
        };
        return {
          ...l,
          lastTouch: 'Just now',
          messages: [...l.messages, newMsg],
          activities: [newAct, ...l.activities],
        };
      })
    );
  };

  const toggleChapterComplete = (chapterId: string) => {
    setCompletedChapters((prev) => {
      if (prev.includes(chapterId)) {
        return prev.filter((id) => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };

  const resetDemo = () => {
    sessionStorage.removeItem(`${STORAGE_KEY}_leads`);
    sessionStorage.removeItem(`${STORAGE_KEY}_role`);
    localStorage.removeItem('groundwork_academy_progress');
    setLeads(initialLeads);
    setUserRole('owner');
    setSelectedLeadId(null);
    setSelectedCommunity('all');
    setCompletedChapters(['ch-1']);
    addToast('Demo State Reset', 'Restored initial 40 builder leads and default settings.', 'info');
  };

  return (
    <DemoStoreContext.Provider
      value={{
        leads,
        selectedLeadId,
        currentUserRole,
        selectedCommunity,
        liveActivityEnabled,
        completedChapters,
        complianceGuardActive,
        toasts,
        setSelectedLeadId,
        setUserRole,
        setSelectedCommunity,
        setComplianceGuardActive,
        setLiveActivityEnabled,
        moveLeadStage,
        addLead,
        updateLead,
        addMessageToLead,
        addToast,
        removeToast,
        toggleChapterComplete,
        resetDemo,
      }}
    >
      {children}
    </DemoStoreContext.Provider>
  );
};

export const useDemoStore = () => {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error('useDemoStore must be used within a DemoStoreProvider');
  }
  return context;
};
