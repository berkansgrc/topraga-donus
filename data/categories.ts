// Category configurations for Waste Guide
export const WASTE_CATEGORIES = {
    green: {
        id: 'green',
        label: 'Yeşil (Azot)',
        color: 'text-primary',
        bg: 'bg-primary-soft',
        border: 'border-primary',
        emoji: '🥬',
        description: 'Azot açısından zengin organik atıklar. Hızlı ayrışır.'
    },
    brown: {
        id: 'brown',
        label: 'Kahverengi (Karbon)',
        color: 'text-amber-700',
        bg: 'bg-amber-100',
        border: 'border-amber-500',
        emoji: '🍂',
        description: 'Karbon açısından zengin kuru maddeler. Yapı sağlar.'
    },
    caution: {
        id: 'caution',
        label: 'Dikkatli Kullan',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        border: 'border-yellow-500',
        emoji: '⚠️',
        description: 'Az miktarda ve dikkatle eklenebilir.'
    },
    prohibited: {
        id: 'prohibited',
        label: 'Yasak',
        color: 'text-red-600',
        bg: 'bg-red-100',
        border: 'border-red-500',
        emoji: '🚫',
        description: 'Toprağa atılmamalı, zararlı olabilir.'
    }
} as const;

// Station type configurations for Map
export const STATION_TYPES = {
    'recycling_center': { label: 'Atık Merkezi', emoji: '🏭', color: 'text-indigo-700', bg: 'bg-indigo-100', border: 'border-indigo-600' },
    'battery': { label: 'Pil Kutusu', emoji: '🔋', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-500' },
    'glass': { label: 'Cam Kumbarası', emoji: '🍾', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-500' },
    'e-waste': { label: 'E-Atık', emoji: '🔌', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-500' },
    'plastic': { label: 'Plastik', emoji: '🥤', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-500' },
    'paper': { label: 'Kağıt', emoji: '📰', color: 'text-stone-600', bg: 'bg-stone-100', border: 'border-stone-500' },
    'metal': { label: 'Metal', emoji: '🔩', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-500' },
    'oil': { label: 'Atık Yağ', emoji: '🛢️', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-500' },
    'clothing': { label: 'Tekstil', emoji: '👕', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-500' }
} as const;

// Blog categories
export const BLOG_CATEGORIES = {
    kompost: { label: 'Kompost', emoji: '🌱', color: 'text-primary', bg: 'bg-primary-soft' },
    geridonusum: { label: 'Geri Dönüşüm', emoji: '♻️', color: 'text-secondary', bg: 'bg-secondary-soft' },
    haberler: { label: 'Haberler', emoji: '📰', color: 'text-blue-600', bg: 'bg-blue-100' }
} as const;

// Gallery categories
export const GALLERY_CATEGORIES = {
    poster: { label: 'Öğrenci Afişi', emoji: '🎨' },
    project: { label: 'Proje Resmi', emoji: '📷' }
} as const;

export type WasteCategoryKey = keyof typeof WASTE_CATEGORIES;
export type StationTypeKey = keyof typeof STATION_TYPES;
export type BlogCategoryKey = keyof typeof BLOG_CATEGORIES;
export type GalleryCategoryKey = keyof typeof GALLERY_CATEGORIES;
