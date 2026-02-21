// Hakim - Queue Management Utilities

import type { QueueStatus, SeverityLevel, TriageResult } from '@/types';

// ============================================
// QUEUE CALCULATIONS
// ============================================

/**
 * Calculate estimated wait time in minutes
 */
export function calculateEstimatedWaitTime(
  tokenNumber: number,
  currentServing: number,
  averageServiceTimeMinutes: number
): number {
  if (tokenNumber <= currentServing) {
    return 0;
  }
  
  const patientsAhead = tokenNumber - currentServing;
  return patientsAhead * averageServiceTimeMinutes;
}

/**
 * Calculate queue position (patients ahead)
 */
export function calculateQueuePosition(
  tokenNumber: number,
  currentServing: number
): number {
  if (tokenNumber <= currentServing) {
    return 0;
  }
  return tokenNumber - currentServing;
}

/**
 * Format wait time for display
 */
export function formatWaitTime(minutes: number): string {
  if (minutes <= 0) {
    return 'Now serving';
  }
  
  if (minutes < 60) {
    return `~${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `~${hours} hr`;
  }
  
  return `~${hours} hr ${mins} min`;
}

/**
 * Generate estimated time of service
 */
export function estimateServiceTime(minutes: number): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}

/**
 * Format time for display (Ethiopian time format)
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-ET', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// ============================================
// TOKEN NUMBER GENERATION
// ============================================

/**
 * Generate a unique token number for a department per day
 * Token format: Sequential number starting from 1
 */
export function generateTokenNumber(lastTokenIssued: number): number {
  return lastTokenIssued + 1;
}

/**
 * Format token number for display
 */
export function formatTokenNumber(tokenNumber: number, departmentCode?: string): string {
  if (departmentCode) {
    return `${departmentCode}-${String(tokenNumber).padStart(3, '0')}`;
  }
  return `T${String(tokenNumber).padStart(3, '0')}`;
}

// ============================================
// ETHIOPIAN PHONE NUMBER FORMATTING
// ============================================

/**
 * Format Ethiopian phone number to international format
 * Accepts: 0912345678, +251912345678, 251912345678
 * Returns: +251912345678
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle Ethiopian phone number formats
  if (cleaned.startsWith('09')) {
    // Local format: 0912345678 -> +251912345678
    cleaned = '251' + cleaned.substring(1);
  } else if (cleaned.startsWith('9') && cleaned.length === 9) {
    // Without leading 0: 912345678 -> +251912345678
    cleaned = '251' + cleaned;
  } else if (cleaned.startsWith('2519')) {
    // Already in international format without +
    // Keep as is
  }
  
  return '+' + cleaned;
}

/**
 * Validate Ethiopian phone number
 */
export function isValidEthiopianPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Ethiopian mobile numbers: +2519XXXXXXXX (10 digits after +251)
  const phoneRegex = /^\+251[79]\d{8}$/;
  return phoneRegex.test(formatted);
}

/**
 * Format phone for display (local format)
 */
export function formatPhoneDisplay(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  // +251912345678 -> 0912 345 678
  if (formatted.startsWith('+251')) {
    const local = formatted.substring(4);
    return `0${local.substring(0, 3)} ${local.substring(3, 6)} ${local.substring(6)}`;
  }
  return phone;
}

// ============================================
// TRIAGE ENGINE
// ============================================

interface TriageRule {
  keywords: string[];
  severity: SeverityLevel;
  message: string;
  isEmergency: boolean;
}

const TRIAGE_RULES: TriageRule[] = [
  // CRITICAL - Life threatening
  {
    keywords: ['unconscious', 'not breathing', 'stopped breathing', 'no pulse', 
               'cardiac arrest', 'severe bleeding', 'heavy bleeding', 'blood loss',
               'choking', 'drowning', 'severe burn', 'electrocution'],
    severity: 'CRITICAL',
    message: 'CRITICAL: This is a life-threatening emergency. Call ambulance immediately (911). Do not wait.',
    isEmergency: true,
  },
  // HIGH - Urgent
  {
    keywords: ['chest pain', 'heart attack', 'difficulty breathing', 'shortness of breath',
               'stroke', 'paralysis', 'severe pain', 'severe headache', 'convulsion',
               'seizure', 'pregnancy pain', 'labor pain', 'high fever', 'severe vomiting',
               'severe diarrhea', 'dehydration', 'fainting', 'loss of consciousness'],
    severity: 'HIGH',
    message: 'URGENT: Seek immediate medical attention. Proceed to emergency department or call for assistance.',
    isEmergency: true,
  },
  // MEDIUM - Should be seen soon
  {
    keywords: ['moderate pain', 'fever', 'cough', 'sore throat', 'ear pain',
               'urinary problem', 'skin rash', 'allergic reaction', 'swelling',
               'joint pain', 'back pain', 'abdominal pain', 'nausea', 'dizziness'],
    severity: 'MEDIUM',
    message: 'Your symptoms require medical attention. Please proceed to the queue or consider urgent care.',
    isEmergency: false,
  },
  // LOW - Non-urgent
  {
    keywords: ['mild pain', 'headache', 'runny nose', 'cold', 'flu',
               'minor cut', 'bruise', 'check-up', 'refill', 'follow-up',
               'vaccination', 'routine', 'prescription'],
    severity: 'LOW',
    message: 'Non-emergency. Please proceed to the queue. A doctor will see you shortly.',
    isEmergency: false,
  },
];

/**
 * Analyze symptoms and determine triage level
 */
export function analyzeSymptoms(symptomsText: string): TriageResult {
  const text = symptomsText.toLowerCase();
  
  // Check rules from most severe to least
  for (const rule of TRIAGE_RULES) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword)) {
        // Calculate confidence based on keyword match
        const matchedKeywords = rule.keywords.filter(k => text.includes(k));
        const confidence = Math.min(0.5 + (matchedKeywords.length * 0.15), 0.95);
        
        return {
          severityLevel: rule.severity,
          confidence,
          recommendation: rule.message,
          isEmergency: rule.isEmergency,
          emergencyNumber: rule.isEmergency ? '911' : undefined,
          keywords: matchedKeywords,
        };
      }
    }
  }
  
  // Default to MEDIUM if no keywords match
  return {
    severityLevel: 'MEDIUM',
    confidence: 0.3,
    recommendation: 'Unable to determine severity. Please describe your symptoms in more detail or proceed to the hospital for assessment.',
    isEmergency: false,
    keywords: [],
  };
}

/**
 * Get triage color class
 */
export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-600 text-white';
    case 'HIGH':
      return 'bg-orange-500 text-white';
    case 'MEDIUM':
      return 'bg-yellow-500 text-black';
    case 'LOW':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

/**
 * Get severity label
 */
export function getSeverityLabel(severity: SeverityLevel): string {
  switch (severity) {
    case 'CRITICAL':
      return 'Life Threatening';
    case 'HIGH':
      return 'Urgent';
    case 'MEDIUM':
      return 'Moderate';
    case 'LOW':
      return 'Non-Urgent';
    default:
      return 'Unknown';
  }
}

// ============================================
// QUEUE STATUS UTILITIES
// ============================================

/**
 * Get status color class
 */
export function getStatusColor(status: QueueStatus): string {
  switch (status) {
    case 'WAITING':
      return 'bg-blue-500 text-white';
    case 'SERVING':
      return 'bg-green-500 text-white';
    case 'COMPLETED':
      return 'bg-gray-500 text-white';
    case 'CANCELLED':
      return 'bg-red-500 text-white';
    case 'SKIPPED':
      return 'bg-orange-500 text-white';
    case 'EMERGENCY':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: QueueStatus): string {
  switch (status) {
    case 'WAITING':
      return 'Waiting';
    case 'SERVING':
      return 'Being Served';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'SKIPPED':
      return 'Skipped';
    case 'EMERGENCY':
      return 'Emergency';
    default:
      return 'Unknown';
  }
}

// ============================================
// DATE UTILITIES
// ============================================

/**
 * Get today's date at midnight (for queue date grouping)
 */
export function getTodayDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Format date for display (Ethiopian format)
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-ET', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============================================
// ID GENERATION
// ============================================

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate required fields
 */
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing = fields.filter(
    field => data[field] === undefined || data[field] === null || data[field] === ''
  );
  
  return {
    valid: missing.length === 0,
    missing: missing as string[],
  };
}
