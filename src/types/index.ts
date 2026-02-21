// Hakim - Healthcare Queue Management Platform Types

// ============================================
// USER TYPES
// ============================================

export type Role = 'PATIENT' | 'HOSPITAL_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  phone: string;
  email?: string | null;
  name?: string | null;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// HOSPITAL TYPES
// ============================================

export type FacilityType = 'HOSPITAL' | 'HEALTH_CENTER' | 'CLINIC' | 'HEALTH_POST' | 'SPECIALIZED_CENTER' | 'PHARMACY' | 'LABORATORY' | 'AMBULANCE_SERVICE';

export interface Hospital {
  id: string;
  name: string;
  region: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  emergencyContactNumber?: string | null;
  isActive: boolean;
  adminId?: string | null;
  facilityType?: FacilityType;
  facilityTypeDisplay?: string;
  createdAt: string;
  updatedAt: string;
  departments?: Department[];
  departmentCount?: number;
}

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  description?: string | null;
  averageServiceTimeMin: number;
  dailyCapacity: number;
  currentQueueCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hospital?: Hospital;
}

// ============================================
// QUEUE TYPES
// ============================================

export type QueueStatus = 'WAITING' | 'SERVING' | 'COMPLETED' | 'CANCELLED' | 'SKIPPED' | 'EMERGENCY';

export interface Appointment {
  id: string;
  patientId: string;
  hospitalId: string;
  departmentId: string;
  tokenNumber: number;
  status: QueueStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  servedAt?: string | null;
  patient?: User;
  hospital?: Hospital;
  department?: Department;
}

export interface QueueStatusResponse {
  departmentId: string;
  departmentName: string;
  currentToken: number;
  lastTokenIssued: number;
  totalWaiting: number;
  estimatedWaitMinutes: number;
  nextAvailableSlot: string;
}

export interface TokenBookingResponse {
  success: boolean;
  appointment?: Appointment;
  tokenNumber: number;
  estimatedWaitMinutes: number;
  queuePosition: number;
  message: string;
  hospitalName: string;
  departmentName: string;
}

// ============================================
// EMERGENCY TYPES
// ============================================

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EmergencyStatus = 'REPORTED' | 'TRIAGED' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';

export interface EmergencyCase {
  id: string;
  patientId: string;
  hospitalId?: string | null;
  symptomsText: string;
  severityLevel: SeverityLevel;
  aiConfidence?: number | null;
  locationText?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactPhone?: string | null;
  status: EmergencyStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: User;
  hospital?: Hospital;
}

export interface TriageResult {
  severityLevel: SeverityLevel;
  confidence: number;
  recommendation: string;
  isEmergency: boolean;
  emergencyNumber?: string;
  keywords: string[];
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType = 
  | 'TOKEN_BOOKED'
  | 'QUEUE_POSITION_10'
  | 'QUEUE_POSITION_5'
  | 'YOUR_TURN'
  | 'APPOINTMENT_CANCELLED'
  | 'EMERGENCY_ALERT'
  | 'EMERGENCY_CONFIRMATION';

export type NotificationChannel = 'SMS' | 'PUSH' | 'EMAIL';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface Notification {
  id: string;
  appointmentId?: string | null;
  emergencyCaseId?: string | null;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  message: string;
  status: NotificationStatus;
  sentAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface OtpRequest {
  phone: string;
  purpose: 'REGISTRATION' | 'LOGIN' | 'EMERGENCY_CONFIRM';
}

export interface OtpVerification {
  phone: string;
  otpCode: string;
  purpose: 'REGISTRATION' | 'LOGIN' | 'EMERGENCY_CONFIRM';
}

export interface RegisterRequest {
  phone: string;
  name: string;
  email?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface QueueAnalytics {
  totalPatientsToday: number;
  totalServed: number;
  totalWaiting: number;
  totalSkipped: number;
  averageWaitTime: number;
  averageServiceTime: number;
  peakHour: number;
  departmentStats: DepartmentStats[];
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  totalPatients: number;
  totalServed: number;
  averageWaitTime: number;
  currentLoad: number;
}

// ============================================
// ETHIOPIAN REGIONS
// ============================================

export const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Afar',
  'Amhara',
  'Benishangul-Gumuz',
  'Dire Dawa',
  'Gambela',
  'Harari',
  'Oromia',
  'Sidama',
  'Somali',
  'South West Ethiopia',
  'Southern Nations',
  'Tigray',
] as const;

export type EthiopianRegion = typeof ETHIOPIAN_REGIONS[number];

// ============================================
// COMMON DEPARTMENTS
// ============================================

export const COMMON_DEPARTMENTS = [
  { name: 'General Medicine', avgTime: 15, capacity: 150 },
  { name: 'Pediatrics', avgTime: 20, capacity: 100 },
  { name: 'Emergency', avgTime: 30, capacity: 50 },
  { name: 'Obstetrics & Gynecology', avgTime: 25, capacity: 80 },
  { name: 'Surgery', avgTime: 30, capacity: 60 },
  { name: 'Orthopedics', avgTime: 25, capacity: 70 },
  { name: 'Ophthalmology', avgTime: 15, capacity: 100 },
  { name: 'ENT (Ear, Nose, Throat)', avgTime: 15, capacity: 80 },
  { name: 'Dermatology', avgTime: 10, capacity: 120 },
  { name: 'Cardiology', avgTime: 25, capacity: 50 },
  { name: 'Neurology', avgTime: 25, capacity: 40 },
  { name: 'Psychiatry', avgTime: 30, capacity: 60 },
  { name: 'Dental', avgTime: 20, capacity: 80 },
  { name: 'Laboratory', avgTime: 10, capacity: 200 },
  { name: 'Radiology', avgTime: 15, capacity: 100 },
  { name: 'Pharmacy', avgTime: 5, capacity: 300 },
] as const;
