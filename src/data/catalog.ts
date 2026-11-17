import { BackgroundPreset, CreditPack, FeatureCardItem, PremiumPlan, StylePreset } from '../types/app';

export const HERO_IMAGE_URL = '/src/assets/images/hero_ai_studio_1794940305203.jpg';
export const DEMO_SAMPLE_PORTRAIT_URL = '/src/assets/images/demo_sample_portrait_1794940308435.jpg';

export const FEATURE_CARDS: FeatureCardItem[] = [
  {
    id: 'enhance',
    title: 'ფოტოს ხარისხის გაუმჯობესება',
    subtitle: 'სიმკვეთრის, კონტრასტის და დეტალების ვიზუალური გაძლიერება',
    creditCost: 1,
    accentHue: 'blue',
  },
  {
    id: 'portrait',
    title: 'AI პორტრეტები',
    subtitle: 'სტუდიური განათება და კანის ბუნებრივი ტონის ბალანსი',
    creditCost: 1,
    accentHue: 'violet',
  },
  {
    id: 'styles',
    title: 'AI სტილები',
    subtitle: 'კინემატოგრაფიული, მონოქრომული და ნეონური ფერთა პროფილები',
    creditCost: 1,
    accentHue: 'indigo',
  },
  {
    id: 'background',
    title: 'ფონის შეცვლა',
    subtitle: 'სტუდიური მუქი ფონი, გარემოს განათება და სიღრმის ეფექტი',
    creditCost: 1,
    accentHue: 'cyan',
  },
];

export const POPULAR_STYLES: StylePreset[] = [
  {
    id: 'studio-violet',
    name: 'სტუდიური იისფერი',
    category: 'AI პორტრეტი',
    description: 'რბილი იისფერი კონტურული განათება მუქ სტუდიურ ფონზე',
    imageUrl: '/src/assets/images/style_studio_violet_1794940306758.jpg',
    creditCost: 1,
    featureId: 'portrait',
    filterProfile: 'portrait_studio_violet',
  },
  {
    id: 'cinematic-35mm',
    name: 'კინო 35მმ',
    category: 'AI სტილი',
    description: 'თბილი კინემატოგრაფიული ტონები და ბუნებრივი ფირის სიღრმე',
    imageUrl: '/src/assets/images/style_cinematic_film_1794940306471.jpg',
    creditCost: 1,
    featureId: 'styles',
    filterProfile: 'style_cinematic_35mm',
  },
  {
    id: 'monochrome-art',
    name: 'მონოქრომული არტი',
    category: 'AI სტილი',
    description: 'მაღალკონტრასტული შავ-თეთრი განათება კლასიკურ სტილში',
    imageUrl: '/src/assets/images/style_monochrome_art_1794940306366.jpg',
    creditCost: 1,
    featureId: 'styles',
    filterProfile: 'style_monochrome_art',
  },
  {
    id: 'executive-pro',
    name: 'ბიზნეს პორტრეტი',
    category: 'AI პორტრეტი',
    description: 'სუფთა კორპორატიული პორტრეტი დაბალანსებული სტუდიური შუქით',
    imageUrl: '/src/assets/images/style_corporate_pro_1794940306619.jpg',
    creditCost: 1,
    featureId: 'portrait',
    filterProfile: 'portrait_executive',
  },
  {
    id: 'cobalt-noir',
    name: 'კობალტის ნუარი',
    category: 'AI სტილი',
    description: 'ღამის ქალაქის ლურჯი ანარეკლები და ღრმა კონტრასტი',
    imageUrl: '/src/assets/images/style_cobalt_noir_1794940309585.jpg',
    creditCost: 1,
    featureId: 'styles',
    filterProfile: 'style_cobalt_noir',
  },
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'bg-obsidian',
    name: 'ობსიდიანის სტუდია',
    description: 'ღრმა შავი სტუდიური ვინიეტირება',
    previewGradient: 'linear-gradient(135deg, #06070B 0%, #171923 100%)',
    filterProfile: 'bg_obsidian_studio',
  },
  {
    id: 'bg-violet-blue',
    name: 'იისფერი და ლურჯი განათება',
    description: 'სტუდიური ორმაგი ფერადი კონტური',
    previewGradient: 'linear-gradient(135deg, #3B0764 0%, #1E3A8A 100%)',
    filterProfile: 'bg_violet_blue_rim',
  },
  {
    id: 'bg-bokeh',
    name: 'პორტრეტული სიღრმე',
    description: 'ფონის რბილი დაბინდვა და ფოკუსი ცენტრზე',
    previewGradient: 'linear-gradient(135deg, #0F172A 0%, #312E81 100%)',
    filterProfile: 'bg_soft_bokeh',
  },
];

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'free',
    name: 'საბაზისო',
    priceLabel: '0 ₾',
    periodLabel: 'მუდმივად უფასო',
    creditsLabel: '10 საწყისი კრედიტი',
    creditsToAdd: 0,
    features: [
      'წვდომა ყველა დემო რეჟიმის ინსტრუმენტზე',
      'Before / After ინტერაქტიული შედარება',
      'ფოტოების შენახვა და გაზიარება',
    ],
  },
  {
    id: 'pro',
    name: 'PHOTO AI Pro',
    priceLabel: '19 ₾',
    periodLabel: 'თვეში',
    creditsLabel: '+60 კრედიტი ყოველთვიურად',
    creditsToAdd: 60,
    highlighted: true,
    features: [
      'მაღალი გარჩევადობის ექსპორტი (HD)',
      'ყველა AI სტილის და პორტრეტის პრიორიტეტი',
      'ფონის ზუსტი გამოყოფა (AI სერვისის ჩართვისას)',
      '60 ყოველთვიური კრედიტი',
    ],
  },
  {
    id: 'studio',
    name: 'Studio Max',
    priceLabel: '49 ₾',
    periodLabel: 'თვეში',
    creditsLabel: '+200 კრედიტი ყოველთვიურად',
    creditsToAdd: 200,
    features: [
      'მაქსიმალური გარჩევადობა და RAW ფერების ბალანსი',
      'პირადი სტილების შეუზღუდავი შენახვა',
      'პრიორიტეტული დამუშავების რიგი',
      '200 ყოველთვიური კრედიტი',
    ],
  },
];

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'pack-15',
    credits: 15,
    priceLabel: '7 ₾',
    description: 'სწრაფი შევსება რამდენიმე ფოტოსთვის',
  },
  {
    id: 'pack-50',
    credits: 50,
    priceLabel: '18 ₾',
    description: 'საუკეთესო ბალანსი ყოველდღიური რედაქტირებისთვის',
  },
  {
    id: 'pack-120',
    credits: 120,
    priceLabel: '35 ₾',
    description: 'მაქსიმალური მარაგი კრეატორებისთვის',
  },
];
