import { AgentRole, AgentDef } from './types';

export const AGENTS: Record<AgentRole, AgentDef> = {
  [AgentRole.COORDINATOR]: {
    id: AgentRole.COORDINATOR,
    name: 'Hospital System Coordinator',
    description: 'Pusat utama untuk merutekan pertanyaan ke sub-agen yang sesuai.',
    color: 'bg-blue-600',
    icon: '⚡'
  },
  [AgentRole.MEDICAL_INFO]: {
    id: AgentRole.MEDICAL_INFO,
    name: 'Medical Information Agent',
    description: 'Spesialis informasi kondisi medis, perawatan, dan obat-obatan.',
    color: 'bg-emerald-500',
    icon: '🩺'
  },
  [AgentRole.APPOINTMENT]: {
    id: AgentRole.APPOINTMENT,
    name: 'Appointment Scheduler',
    description: 'Menangani penjadwalan dan manajemen janji temu dokter.',
    color: 'bg-purple-500',
    icon: '📅'
  },
  [AgentRole.PATIENT_MGMT]: {
    id: AgentRole.PATIENT_MGMT,
    name: 'Patient Management',
    description: 'Mengelola data pasien, pendaftaran, dan administrasi.',
    color: 'bg-orange-500',
    icon: '👤'
  },
  [AgentRole.HOSPITAL_REPORT]: {
    id: AgentRole.HOSPITAL_REPORT,
    name: 'Hospital Report Generator',
    description: 'Menghasilkan laporan operasional dan statistik rumah sakit.',
    color: 'bg-slate-500',
    icon: '📊'
  }
};