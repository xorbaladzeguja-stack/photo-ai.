export type TabId = 'home' | 'create' | 'gallery' | 'profile' | 'premium';

export type FeatureId = 'enhance' | 'portrait' | 'styles' | 'background';

export interface FeatureCardItem {
  id: FeatureId;
  title: string;
  subtitle: string;
  creditCost: number;
  accentHue: 'violet' | 'blue' | 'indigo' | 'cyan';
}

export interface StylePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  creditCost: number;
  featureId: FeatureId;
  filterProfile: DemoFilterProfile;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  filterProfile: DemoFilterProfile;
}

export type DemoFilterProfile =
  | 'enhance_hd'
  | 'portrait_studio_violet'
  | 'style_cinematic_35mm'
  | 'style_monochrome_art'
  | 'portrait_executive'
  | 'style_cobalt_noir'
  | 'bg_obsidian_studio'
  | 'bg_violet_blue_rim'
  | 'bg_soft_bokeh';

export interface SavedPhotoItem {
  id: string;
  title: string;
  featureLabel: string;
  styleName: string;
  beforeDataUrl: string;
  afterDataUrl: string;
  createdAt: string;
  isDemo: true;
}

export interface CreditTransaction {
  id: string;
  label: string;
  amount: number;
  timestamp: string;
}

export interface UserProfile {
  isRegistered: boolean;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'studio';
  credits: number;
  joinedAt: string;
}

export interface PremiumPlan {
  id: 'free' | 'pro' | 'studio';
  name: string;
  priceLabel: string;
  periodLabel: string;
  creditsLabel: string;
  creditsToAdd: number;
  features: string[];
  highlighted?: boolean;
}

export interface CreditPack {
  id: string;
  credits: number;
  priceLabel: string;
  description: string;
}
