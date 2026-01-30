
export interface WasteItem {
  id: string;
  name: string;
  category: 'green' | 'brown' | 'prohibited' | 'caution';
  goes_to_soil: boolean;
  soil_method?: string; // Action/Advice
  never_soil_warning?: string; // Why it shouldn't go to soil
  prep_steps?: string; // Preparation steps like crushing, washing
  icon: string;
  imageUrl?: string; // For uploaded images
}

export interface Station {
  id: string;
  name: string;
  type: 'battery' | 'glass' | 'paper' | 'plastic' | 'metal' | 'e-waste' | 'oil' | 'clothing' | 'recycling_center';
  lat: number;
  lng: number;
  verified: boolean;
  distance: string;
}

export interface ProjectImage {
  id: string;
  title: string;
  category: 'poster' | 'project';
  imageUrl: string;
}

export interface CompostLog {
  id?: string;
  date: string;
  experiment_type: 'normal' | 'compost'; // Normal Toprak vs Kompostlu Toprak
  plant_height: number; // cm cinsinden boy
  leaf_count: number; // Yaprak sayısı
  notes: string;
  created_at?: string;
}

export enum ViewState {
  HOME = 'HOME',
  GUIDE = 'GUIDE',
  LAB = 'LAB',
  MAP = 'MAP',
  GALLERY = 'GALLERY',
  PROJECT_GOAL = 'PROJECT_GOAL',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  CONTRIBUTE = 'CONTRIBUTE',
  BLOG = 'BLOG',
  FAQ = 'FAQ',
  SCHOOL_REGISTER = 'SCHOOL_REGISTER',
  PRIVACY_POLICY = 'PRIVACY_POLICY'
}