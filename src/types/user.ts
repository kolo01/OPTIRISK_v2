export type UserRole = 'admin' | 'analyst';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  role: UserRole;
  profile_picture: string;
  job_title: string;
  department: string;
  phone?: string;
  last_login: string;
  created_at: string;
  is_active: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  auto_save: boolean;
  default_criticality: 'low' | 'medium' | 'high' | 'critical';
  language: 'fr' | 'en';
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  ip_address?: string;
  browser?: string;
}

export interface EBIOSStats {
  total_analyses: number;
  completed_analyses: number;
  pending_analyses: number;
  risks_identified: number;
  reports_generated: number;
  last_analysis_date: string;
}