import type { PlanType } from '@/contexts/AuthContext';

export const ALL_THEMES = [
  'classic_red',
  'clean_blue', 
  'money_green',
  'dark_authority',
  'sunset_orange',
  'tech_purple',
  'black_gold',
  'fresh_teal',
  'fire_red',
  'ocean_blue',
  'neon_gamer',
  'minimalist_white'
] as const;

export const PLAN_LIMITS = {
  free: {
    maxProjects: 1,
    themes: ['classic_red', 'clean_blue', 'minimalist_white'] as string[],
    sectionTypes: ['hero', 'subheadline', 'bullets', 'testimonial', 'faq', 'cta', 'divider'],
    canDownloadHtml: false,
    canExportJson: false,
    canDuplicate: false,
    hasWatermark: true,
  },
  monthly: {
    maxProjects: 20,
    themes: ALL_THEMES as unknown as string[],
    sectionTypes: ['hero', 'subheadline', 'video', 'bullets', 'feature_grid', 'bonus_stack', 'testimonial', 'guarantee', 'faq', 'cta', 'divider', 'jv_commissions', 'jv_calendar', 'jv_prizes'],
    canDownloadHtml: true,
    canExportJson: false,
    canDuplicate: false,
    hasWatermark: false,
  },
  lifetime: {
    maxProjects: 100,
    themes: ALL_THEMES as unknown as string[],
    sectionTypes: ['hero', 'subheadline', 'video', 'bullets', 'feature_grid', 'bonus_stack', 'testimonial', 'guarantee', 'faq', 'cta', 'divider', 'jv_commissions', 'jv_calendar', 'jv_prizes'],
    canDownloadHtml: true,
    canExportJson: true,
    canDuplicate: true,
    hasWatermark: false,
  },
} as const;

export function getPlanLimits(plan: PlanType) {
  return PLAN_LIMITS[plan];
}

export interface PlanFeatures {
  name: string;
  price: string;
  period: string;
  features: string[];
  limitations: string[];
  badge?: string;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '1 project',
      '3 basic themes',
      '7 section types',
      'Preview in browser',
      'Copy HTML to clipboard',
    ],
    limitations: [
      'Watermark on exports',
      'No HTML download',
      'No JSON export',
    ],
  },
  monthly: {
    name: 'Pro Monthly',
    price: '$29',
    period: '/month',
    features: [
      'Up to 20 projects',
      'All 12 premium themes',
      'All 14 section types',
      'JV page sections',
      'AI copy writer',
      'Stock image library',
      'Download HTML files',
      'No watermark',
    ],
    limitations: [],
  },
  lifetime: {
    name: 'Lifetime',
    price: '$197',
    period: 'one-time',
    features: [
      'Up to 100 projects',
      'All 12 premium themes',
      'All section types',
      'JV page sections',
      'AI copy writer',
      'Stock image library',
      'Download HTML files',
      'Export JSON configs',
      'Duplicate projects',
      'No watermark',
      'Lifetime updates',
    ],
    limitations: [],
    badge: 'Best Value',
  },
};
