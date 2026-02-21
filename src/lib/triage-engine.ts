/**
 * Emergency Triage Engine for Hakim Healthcare Queue Management Platform
 * Rule-based triage logic for symptom analysis and severity classification
 */

import type { SeverityLevel } from '@prisma/client';

export interface TriageRule {
  keywords: string[];
  severity: SeverityLevel;
  message: string;
  suggestedDepartment?: string;
  priority: number; // Lower number = higher priority
}

export interface TriageResult {
  severityLevel: SeverityLevel;
  confidence: number;
  recommendedAction: string;
  needsImmediateAttention: boolean;
  suggestedDepartment?: string;
  matchedKeywords: string[];
}

// Triage rules ordered by priority
const TRIAGE_RULES: TriageRule[] = [
  // CRITICAL - Life threatening emergencies
  {
    keywords: ['not breathing', 'stopped breathing', 'no pulse', 'cardiac arrest', 'heart attack', 'stroke', 'seizure', 'unconscious', 'not responding', 'dying'],
    severity: 'CRITICAL',
    message: '🚨 CRITICAL: Call emergency services (911) immediately! Do not wait. If possible, begin first aid or CPR.',
    suggestedDepartment: 'Emergency',
    priority: 1,
  },
  {
    keywords: ['severe bleeding', 'heavy bleeding', 'blood loss', 'hemorrhage', 'gushing blood'],
    severity: 'CRITICAL',
    message: '🚨 CRITICAL: Apply direct pressure to stop bleeding. Call emergency services (911) immediately.',
    suggestedDepartment: 'Emergency',
    priority: 2,
  },
  {
    keywords: ['poison', 'overdose', 'suicide', 'attempted suicide', 'took pills'],
    severity: 'CRITICAL',
    message: '🚨 CRITICAL: Call emergency services (911) or poison control immediately. Do not induce vomiting unless instructed.',
    suggestedDepartment: 'Emergency',
    priority: 3,
  },
  
  // HIGH - Urgent medical attention needed
  {
    keywords: ['chest pain', 'heart pain', 'difficulty breathing', 'shortness of breath', 'can\'t breathe', 'struggling to breathe'],
    severity: 'HIGH',
    message: '⚠️ URGENT: Seek immediate medical attention. Have someone drive you to the hospital or call for help.',
    suggestedDepartment: 'Emergency',
    priority: 4,
  },
  {
    keywords: ['severe pain', 'extreme pain', 'unbearable pain', 'worst pain'],
    severity: 'HIGH',
    message: '⚠️ URGENT: Your symptoms require immediate medical evaluation. Please go to the emergency department.',
    suggestedDepartment: 'Emergency',
    priority: 5,
  },
  {
    keywords: ['pregnancy pain', 'pregnant bleeding', 'labor', 'contraction', 'water broke'],
    severity: 'HIGH',
    message: '⚠️ URGENT: Pregnancy-related symptoms require immediate evaluation. Please go to the maternity/emergency department.',
    suggestedDepartment: 'Maternity',
    priority: 6,
  },
  {
    keywords: ['broken bone', 'fracture', 'dislocated', 'can\'t move', 'paralysis'],
    severity: 'HIGH',
    message: '⚠️ URGENT: Possible serious injury. Immobilize the area and seek immediate medical attention.',
    suggestedDepartment: 'Emergency',
    priority: 7,
  },
  {
    keywords: ['allergic reaction', 'anaphylaxis', 'swelling face', 'swelling throat', 'hives severe'],
    severity: 'HIGH',
    message: '⚠️ URGENT: Severe allergic reaction. Use epinephrine if available and seek immediate medical attention.',
    suggestedDepartment: 'Emergency',
    priority: 8,
  },

  // MEDIUM - Needs medical attention but not life-threatening
  {
    keywords: ['high fever', 'very high temperature', 'fever over 39', 'fever 3 days', 'persistent fever'],
    severity: 'MEDIUM',
    message: 'Please seek medical attention today. High or persistent fever requires evaluation.',
    suggestedDepartment: 'General Medicine',
    priority: 9,
  },
  {
    keywords: ['vomiting blood', 'coughing blood', 'blood in stool', 'blood in urine'],
    severity: 'MEDIUM',
    message: 'Please seek medical attention today. These symptoms require prompt evaluation.',
    suggestedDepartment: 'Internal Medicine',
    priority: 10,
  },
  {
    keywords: ['severe headache', 'migraine severe', 'worst headache', 'head injury'],
    severity: 'MEDIUM',
    message: 'Please seek medical attention. Severe headaches should be evaluated, especially after head injury.',
    suggestedDepartment: 'General Medicine',
    priority: 11,
  },
  {
    keywords: ['diarrhea severe', 'dehydration', 'can\'t keep fluids', 'vomiting severe'],
    severity: 'MEDIUM',
    message: 'Please seek medical attention. Dehydration can become serious, especially in children and elderly.',
    suggestedDepartment: 'General Medicine',
    priority: 12,
  },
  {
    keywords: ['infected wound', 'pus', 'red streaks', 'wound not healing', 'abscess'],
    severity: 'MEDIUM',
    message: 'Please seek medical attention. Infection can spread and requires treatment.',
    suggestedDepartment: 'General Medicine',
    priority: 13,
  },
  {
    keywords: ['diabetic emergency', 'low blood sugar', 'high blood sugar', 'insulin'],
    severity: 'MEDIUM',
    message: 'Please seek medical attention. Blood sugar emergencies need prompt treatment.',
    suggestedDepartment: 'Internal Medicine',
    priority: 14,
  },

  // LOW - Non-emergency
  {
    keywords: ['fever', 'temperature', 'hot'],
    severity: 'LOW',
    message: 'Your symptoms appear non-emergency. Please proceed to queue or consult with a healthcare provider.',
    suggestedDepartment: 'General Medicine',
    priority: 20,
  },
  {
    keywords: ['headache', 'migraine'],
    severity: 'LOW',
    message: 'Your symptoms appear non-emergency. Please proceed to queue or consult with a healthcare provider.',
    suggestedDepartment: 'General Medicine',
    priority: 21,
  },
  {
    keywords: ['cough', 'cold', 'flu', 'sore throat', 'runny nose', 'congestion'],
    severity: 'LOW',
    message: 'Your symptoms appear non-emergency. Please proceed to queue or consult with a healthcare provider.',
    suggestedDepartment: 'General Medicine',
    priority: 22,
  },
  {
    keywords: ['stomach ache', 'stomach pain', 'abdominal pain', 'bloating', 'indigestion'],
    severity: 'LOW',
    message: 'Your symptoms appear non-emergency. Please proceed to queue or consult with a healthcare provider.',
    suggestedDepartment: 'General Medicine',
    priority: 23,
  },
  {
    keywords: ['back pain', 'joint pain', 'muscle pain', 'arthritis'],
    severity: 'LOW',
    message: 'Your symptoms appear non-emergency. Please proceed to queue or consult with a healthcare provider.',
    suggestedDepartment: 'General Medicine',
    priority: 24,
  },
  {
    keywords: ['rash', 'itching', 'skin problem', 'acne', 'eczema'],
    severity: 'LOW',
    message: 'Your symptoms appear non-emergency. Please proceed to queue or consult with a dermatologist.',
    suggestedDepartment: 'Dermatology',
    priority: 25,
  },
  {
    keywords: ['eye problem', 'vision', 'eye pain', 'red eye'],
    severity: 'LOW',
    message: 'Your symptoms appear non-emergency. Please proceed to queue or consult with an ophthalmologist.',
    suggestedDepartment: 'Ophthalmology',
    priority: 26,
  },
  {
    keywords: ['dental', 'tooth pain', 'toothache', 'gum'],
    severity: 'LOW',
    message: 'Your symptoms appear non-emergency. Please proceed to queue or consult with dental services.',
    suggestedDepartment: 'Dental',
    priority: 27,
  },
];

// Default rule for unknown symptoms
const DEFAULT_RULE: TriageRule = {
  keywords: [],
  severity: 'LOW',
  message: 'Unable to assess severity automatically. If you feel your condition is serious, please seek medical attention immediately.',
  suggestedDepartment: 'General Medicine',
  priority: 100,
};

/**
 * Analyze symptoms and return triage result
 * @param symptomsText - The patient's described symptoms
 * @returns TriageResult with severity and recommendations
 */
export function analyzeSymptoms(symptomsText: string): TriageResult {
  const normalizedText = symptomsText.toLowerCase().trim();
  const matchedRules: { rule: TriageRule; matchedKeywords: string[] }[] = [];

  // Check each rule against the symptoms
  for (const rule of TRIAGE_RULES) {
    const matchedKeywords = rule.keywords.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      matchedRules.push({ rule, matchedKeywords });
    }
  }

  // Sort by priority and get the most severe match
  matchedRules.sort((a, b) => a.rule.priority - b.rule.priority);

  if (matchedRules.length === 0) {
    return {
      severityLevel: DEFAULT_RULE.severity,
      confidence: 0.3,
      recommendedAction: DEFAULT_RULE.message,
      needsImmediateAttention: false,
      suggestedDepartment: DEFAULT_RULE.suggestedDepartment,
      matchedKeywords: [],
    };
  }

  const bestMatch = matchedRules[0];
  const totalMatches = matchedRules.reduce((sum, m) => sum + m.matchedKeywords.length, 0);
  
  // Calculate confidence based on number of matched keywords and rule priority
  const confidenceBoost = matchedRules.length > 1 ? 0.15 : 0;
  const baseConfidence = bestMatch.rule.priority <= 10 ? 0.85 : 
                         bestMatch.rule.priority <= 20 ? 0.75 : 0.65;
  const confidence = Math.min(0.95, baseConfidence + confidenceBoost + (totalMatches * 0.02));

  return {
    severityLevel: bestMatch.rule.severity,
    confidence: Math.round(confidence * 100) / 100,
    recommendedAction: bestMatch.rule.message,
    needsImmediateAttention: bestMatch.rule.severity === 'CRITICAL' || bestMatch.rule.severity === 'HIGH',
    suggestedDepartment: bestMatch.rule.suggestedDepartment,
    matchedKeywords: bestMatch.matchedKeywords,
  };
}

/**
 * Get all available departments from triage rules
 * @returns Array of department names
 */
export function getTriageDepartments(): string[] {
  const departments = new Set<string>();
  for (const rule of TRIAGE_RULES) {
    if (rule.suggestedDepartment) {
      departments.add(rule.suggestedDepartment);
    }
  }
  return Array.from(departments);
}

/**
 * Check if symptoms indicate emergency
 * @param symptomsText - The patient's described symptoms
 * @returns True if emergency
 */
export function isEmergency(symptomsText: string): boolean {
  const result = analyzeSymptoms(symptomsText);
  return result.severityLevel === 'CRITICAL' || result.severityLevel === 'HIGH';
}

/**
 * Get severity level display info
 * @param severity - Severity level
 * @returns Display information
 */
export function getSeverityInfo(severity: SeverityLevel): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  const infoMap = {
    CRITICAL: {
      label: 'Critical',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
    },
    HIGH: {
      label: 'High Priority',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
    },
    MEDIUM: {
      label: 'Medium Priority',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
    },
    LOW: {
      label: 'Low Priority',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
    },
  };
  return infoMap[severity];
}
