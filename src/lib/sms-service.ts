// Hakim - SMS Service Provider
// Pluggable SMS service for Ethiopian telecom providers

import type { NotificationType } from '@/types';

// ============================================
// SMS PROVIDER INTERFACE
// ============================================

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SmsProvider {
  send(to: string, message: string): Promise<SmsResult>;
  getName(): string;
}

// ============================================
// MOCK SMS PROVIDER (Development)
// ============================================

export class MockSmsProvider implements SmsProvider {
  getName(): string {
    return 'MockSmsProvider';
  }

  async send(to: string, message: string): Promise<SmsResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Log the SMS for development
    console.log('\n========================================');
    console.log('📱 SMS SENT (MOCK)');
    console.log(`To: ${to}`);
    console.log(`Message:\n${message}`);
    console.log('========================================\n');
    
    return {
      success: true,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
  }
}

// ============================================
// ETHIO TELECOM SMS PROVIDER (Placeholder)
// ============================================

export class EthioTelecomSmsProvider implements SmsProvider {
  private apiKey: string;
  private senderId: string;
  private endpoint: string;

  constructor(config: { apiKey: string; senderId: string; endpoint?: string }) {
    this.apiKey = config.apiKey;
    this.senderId = config.senderId;
    this.endpoint = config.endpoint || 'https://api.ethiotelecom.et/sms/send';
  }

  getName(): string {
    return 'EthioTelecomSmsProvider';
  }

  async send(to: string, message: string): Promise<SmsResult> {
    try {
      // Placeholder implementation
      // In production, this would call Ethio Telecom's actual API
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          to: to.replace('+', ''),
          from: this.senderId,
          message: message,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        messageId: data.messageId || data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// ============================================
// SMS MESSAGE TEMPLATES
// ============================================

export const SMS_TEMPLATES = {
  TOKEN_BOOKED: (params: {
    hospitalName: string;
    departmentName: string;
    tokenNumber: number;
    queuePosition: number;
    estimatedWait: string;
  }) => 
    `Hakim Health: Your token #${params.tokenNumber} at ${params.hospitalName} (${params.departmentName}) is confirmed. ` +
    `Position: ${params.queuePosition}. Est. wait: ${params.estimatedWait}. ` +
    `You will be notified before your turn.`,

  QUEUE_POSITION_10: (params: {
    tokenNumber: number;
    departmentName: string;
  }) =>
    `Hakim Health: Token #${params.tokenNumber} - 10 patients ahead at ${params.departmentName}. ` +
    `Please be ready.`,

  QUEUE_POSITION_5: (params: {
    tokenNumber: number;
    departmentName: string;
  }) =>
    `Hakim Health: Token #${params.tokenNumber} - Only 5 patients ahead at ${params.departmentName}. ` +
    `Please proceed to the waiting area.`,

  YOUR_TURN: (params: {
    tokenNumber: number;
    departmentName: string;
  }) =>
    `Hakim Health: Token #${params.tokenNumber} - It's your turn at ${params.departmentName}! ` +
    `Please proceed to the service counter now.`,

  APPOINTMENT_CANCELLED: (params: {
    hospitalName: string;
    departmentName: string;
    tokenNumber: number;
  }) =>
    `Hakim Health: Your appointment (Token #${params.tokenNumber}) at ${params.hospitalName} ` +
    `${params.departmentName} has been cancelled.`,

  EMERGENCY_ALERT: (params: {
    hospitalName: string;
    severity: string;
    symptoms: string;
    contactPhone: string;
  }) =>
    `EMERGENCY ALERT - ${params.hospitalName}: ${params.severity} severity case reported. ` +
    `Symptoms: ${params.symptoms.substring(0, 100)}... ` +
    `Contact: ${params.contactPhone}. Please respond immediately.`,

  OTP_VERIFICATION: (params: {
    otpCode: string;
    purpose: string;
  }) =>
    `Hakim Health: Your verification code is ${params.otpCode}. ` +
    `Valid for 5 minutes. Do not share this code.`,

  EMERGENCY_CONFIRMATION: (params: {
    caseId: string;
    severity: string;
    recommendation: string;
  }) =>
    `Hakim Emergency: Case ${params.caseId.substring(0, 8)} - ${params.severity}. ` +
    `${params.recommendation.substring(0, 100)}`,
};

// ============================================
// SMS SERVICE MANAGER
// ============================================

class SmsService {
  private provider: SmsProvider;
  private static instance: SmsService;

  private constructor(provider?: SmsProvider) {
    // Use mock provider by default for development
    this.provider = provider || new MockSmsProvider();
  }

  static getInstance(): SmsService {
    if (!SmsService.instance) {
      SmsService.instance = new SmsService();
    }
    return SmsService.instance;
  }

  setProvider(provider: SmsProvider): void {
    this.provider = provider;
  }

  async send(to: string, message: string): Promise<SmsResult> {
    // Validate phone number format
    const formattedPhone = to.startsWith('+') ? to : `+${to}`;
    
    // Truncate message if too long (SMS limit is 160 chars for single SMS)
    const truncatedMessage = message.length > 480 
      ? message.substring(0, 477) + '...' 
      : message;

    return this.provider.send(formattedPhone, truncatedMessage);
  }

  async sendOtp(phone: string, otpCode: string, purpose: string): Promise<SmsResult> {
    const message = SMS_TEMPLATES.OTP_VERIFICATION({ otpCode, purpose });
    return this.send(phone, message);
  }

  async sendNotification(
    phone: string,
    type: NotificationType,
    params: Record<string, string | number>
  ): Promise<SmsResult> {
    const template = SMS_TEMPLATES[type as keyof typeof SMS_TEMPLATES];
    if (!template) {
      return { success: false, error: `Unknown notification type: ${type}` };
    }

    const message = template(params as Parameters<typeof template>[0]);
    return this.send(phone, message);
  }
}

// Export singleton instance
export const smsService = SmsService.getInstance();

// Export provider classes for configuration
export { SmsService };
