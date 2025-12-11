export enum AgentRole {
  COORDINATOR = 'HOSPITAL_SYSTEM_COORDINATOR',
  MEDICAL_INFO = 'MEDICAL_INFORMATION_AGENT',
  APPOINTMENT = 'APPOINTMENT_SCHEDULER_AGENT',
  HOSPITAL_REPORT = 'HOSPITAL_REPORT_GENERATOR_AGENT',
  PATIENT_MGMT = 'PATIENT_MANAGEMENT_AGENT'
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  senderName?: string;
  timestamp: Date;
  metadata?: {
    routingDecision?: {
      targetAgent: AgentRole;
      reasoning: string;
      forwardedQuery: string;
    };
    isThinking?: boolean;
  };
}

export interface CoordinatorResponse {
  targetAgent: AgentRole;
  reasoning: string;
  forwardedQuery: string;
}

export interface AgentDef {
  id: AgentRole;
  name: string;
  description: string;
  color: string;
  icon: string;
}