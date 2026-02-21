// Hakim - OTP Utilities

import type { OtpPurpose } from '@/types';

// ============================================
// OTP GENERATION
// ============================================

/**
 * Generate a random OTP code
 * @param length Number of digits (default: 6)
 */
export function generateOtp(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return otp;
}

/**
 * Generate OTP with expiration
 */
export function generateOtpWithExpiry(
  length: number = 6,
  expiryMinutes: number = 5
): { code: string; expiresAt: Date } {
  const code = generateOtp(length);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  return { code, expiresAt };
}

// ============================================
// OTP VALIDATION
// ============================================

/**
 * Validate OTP format
 */
export function isValidOtpFormat(code: string, expectedLength: number = 6): boolean {
  return /^\d+$/.test(code) && code.length === expectedLength;
}

/**
 * Check if OTP is expired
 */
export function isOtpExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
}

// ============================================
// OTP MESSAGE GENERATION
// ============================================

/**
 * Get OTP purpose description
 */
export function getOtpPurposeMessage(purpose: OtpPurpose): string {
  switch (purpose) {
    case 'REGISTRATION':
      return 'Verify your phone number to complete registration.';
    case 'LOGIN':
      return 'Verify your identity to log in.';
    case 'EMERGENCY_CONFIRM':
      return 'Confirm your emergency report.';
    case 'PHONE_CHANGE':
      return 'Verify your new phone number.';
    default:
      return 'Verify your phone number.';
  }
}

/**
 * Generate OTP message for SMS
 */
export function getOtpMessage(code: string, purpose: OtpPurpose): string {
  const purposeMessage = getOtpPurposeMessage(purpose);
  return `Hakim Health: Your verification code is ${code}. ${purposeMessage} Valid for 5 minutes. Do not share this code.`;
}

// ============================================
// RATE LIMITING (In-memory, for production use Redis)
// ============================================

interface OtpAttempt {
  count: number;
  firstAttempt: Date;
  blocked: boolean;
}

const otpAttempts = new Map<string, OtpAttempt>();
const MAX_OTP_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 15;

/**
 * Check if phone is blocked from OTP requests
 */
export function isPhoneBlocked(phone: string): { blocked: boolean; remainingMinutes?: number } {
  const attempt = otpAttempts.get(phone);
  
  if (!attempt || !attempt.blocked) {
    return { blocked: false };
  }
  
  const blockExpiry = new Date(
    attempt.firstAttempt.getTime() + BLOCK_DURATION_MINUTES * 60 * 1000
  );
  
  if (new Date() > blockExpiry) {
    // Block has expired, clear it
    otpAttempts.delete(phone);
    return { blocked: false };
  }
  
  const remainingMs = blockExpiry.getTime() - Date.now();
  const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
  
  return { blocked: true, remainingMinutes };
}

/**
 * Record an OTP attempt
 */
export function recordOtpAttempt(phone: string): { allowed: boolean; attemptsRemaining: number } {
  const existing = otpAttempts.get(phone);
  
  // Check if blocked
  const blockStatus = isPhoneBlocked(phone);
  if (blockStatus.blocked) {
    return { allowed: false, attemptsRemaining: 0 };
  }
  
  if (existing) {
    existing.count++;
    
    if (existing.count >= MAX_OTP_ATTEMPTS) {
      existing.blocked = true;
      return { allowed: false, attemptsRemaining: 0 };
    }
    
    return { allowed: true, attemptsRemaining: MAX_OTP_ATTEMPTS - existing.count };
  }
  
  // First attempt
  otpAttempts.set(phone, {
    count: 1,
    firstAttempt: new Date(),
    blocked: false,
  });
  
  return { allowed: true, attemptsRemaining: MAX_OTP_ATTEMPTS - 1 };
}

/**
 * Clear OTP attempts after successful verification
 */
export function clearOtpAttempts(phone: string): void {
  otpAttempts.delete(phone);
}

// ============================================
// CLEANUP EXPIRED ATTEMPTS (Call periodically)
// ============================================

export function cleanupExpiredAttempts(): number {
  let cleaned = 0;
  const now = Date.now();
  const expiryMs = BLOCK_DURATION_MINUTES * 60 * 1000;
  
  for (const [phone, attempt] of otpAttempts.entries()) {
    if (now - attempt.firstAttempt.getTime() > expiryMs) {
      otpAttempts.delete(phone);
      cleaned++;
    }
  }
  
  return cleaned;
}
