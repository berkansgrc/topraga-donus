import { WasteItem, Station, ProjectImage } from './types';


// CartoDB Voyager Tiles (Faster & Cleaner)
export const MAP_TILE_LAYER = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const MOCK_PROJECT_IMAGES: ProjectImage[] = [
  {
    id: 'm1',
    title: '5-A Sınıfı Atık Ayrıştırma Posteri',
    category: 'poster',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm2',
    title: 'Kompost Döngüsü Çizimi',
    category: 'poster',
    imageUrl: 'https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm3',
    title: 'Okul Bahçesi Kompost Alanı',
    category: 'project',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm4',
    title: 'Atık Pil Toplama Etkinliği',
    category: 'project',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm5',
    title: 'Geri Dönüşüm Kutusu Tasarımı',
    category: 'project',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600'
  }
];

export const MOCK_WASTE_ITEMS: WasteItem[] = [
  // --- YEŞİLLER (AZOT) ---
  {
    id: 'g1',
    name: 'Sebze ve Meyve Kabukları',
    category: 'green',
    goes_to_soil: true,
    soil_method: 'Komposta ekle',
    prep_steps: 'Küçük parçalara bölün. Yıkanmış olmaları iyidir.',
    icon: 'apple'
  },
  {
    id: 'g2',
    name: 'Çay Posası',
    category: 'green',
    goes_to_soil: true,
    soil_method: 'Doğrudan dökülebilir',
    prep_steps: 'Poşetini kontrol et (plastik olmasın).',
    icon: 'leaf'
  },
  {
    id: 'g3',
    name: 'Kahve Telvesi',
    category: 'green',
    goes_to_soil: true,
    soil_method: 'Toprak için harika bir azot kaynağıdır',
    prep_steps: 'Soğuduktan sonra serpiştirin.',
    icon: 'coffee'
  },
  {
    id: 'g4',
    name: 'Taze Çim Kırpıntıları',
    category: 'green',
    goes_to_soil: true,
    soil_method: 'İnce tabaka halinde ekle',
    prep_steps: 'Kurumadan eklenebilir.',
    icon: 'grass'
  },
  {
    id: 'g5',
    name: 'Solmuş Çiçekler',
    category: 'green',
    goes_to_soil: true,
    soil_method: 'Komposta ekle',
    prep_steps: 'Hastalıklı olmadığından emin olun.',
    icon: 'flower'
  },
  {
    id: 'g6',
    name: 'Yumurta Kabuğu',
    category: 'green',
    goes_to_soil: true,
    soil_method: 'Kalsiyum sağlar',
    prep_steps: 'Yıkayın, kurutun ve iyice ezin.',
    icon: 'egg'
  },

  // --- KAHVERENGİLER (KARBON) ---
  {
    id: 'b1',
    name: 'Kuru Yapraklar',
    category: 'brown',
    goes_to_soil: true,
    soil_method: 'Yapı sağlar, hava akışına izin verir',
    prep_steps: 'Ufalanarak eklenebilir.',
    icon: 'leaf-brown'
  },
  {
    id: 'b2',
    name: 'Karton ve Kağıt',
    category: 'brown',
    goes_to_soil: true,
    soil_method: 'Karbon dengesi için ekle',
    prep_steps: 'Boyasız, kaplamasız olmalı. Parça parça yırtın.',
    icon: 'box'
  },
  {
    id: 'b3',
    name: 'Talaş',
    category: 'brown',
    goes_to_soil: true,
    soil_method: 'Nem dengeler',
    prep_steps: 'İşlenmemiş, verniksiz ahşaptan olmalı.',
    icon: 'wood'
  },
  {
    id: 'b4',
    name: 'Kuruyemiş Kabukları',
    category: 'brown',
    goes_to_soil: true,
    soil_method: 'Hava boşluğu yaratır',
    prep_steps: 'Tuzsuz olmalı. Geç ayrışır, mutlaka kırın.',
    icon: 'nut'
  },

  // --- DİKKAT EDİLMESİ GEREKENLER ---
  {
    id: 'c1',
    name: 'Turunçgiller',
    category: 'caution',
    goes_to_soil: true,
    soil_method: 'Az miktarda ekleyin',
    never_soil_warning: 'Çok asidiktir, fazlası solucanları öldürebilir.',
    prep_steps: 'Küçük parçalara ayırın.',
    icon: 'citrus'
  },
  {
    id: 'c2',
    name: 'Ceviz Yaprağı',
    category: 'caution',
    goes_to_soil: true,
    soil_method: 'Çok az miktarda',
    never_soil_warning: 'Juglon maddesi içerir, diğer bitkilerin büyümesini engelleyebilir.',
    icon: 'leaf-alert'
  },
  {
    id: 'c3',
    name: 'Soğan / Sarımsak',
    category: 'caution',
    goes_to_soil: true,
    soil_method: 'Solucan kompostuna az verilmeli',
    prep_steps: 'Kabukları güvenlidir.',
    icon: 'onion'
  },

  // --- YASAKLILAR (KIRMIZILAR) ---
  {
    id: 'p1',
    name: 'Et ve Kemik',
    category: 'prohibited',
    goes_to_soil: false,
    never_soil_warning: 'Koku yapar, fare ve sinekleri çeker. Ayrışması yıllar sürer.',
    icon: 'bone'
  },
  {
    id: 'p2',
    name: 'Süt Ürünleri',
    category: 'prohibited',
    goes_to_soil: false,
    never_soil_warning: 'Peynir, yoğurt vb. kötü koku ve böcek yapar.',
    icon: 'milk'
  },
  {
    id: 'p3',
    name: 'Yağlar (Kızartma vb.)',
    category: 'prohibited',
    goes_to_soil: false,
    never_soil_warning: 'Oksijen akışını keser, toprağı boğar ve bozulmayı durdurur.',
    icon: 'oil'
  },
  {
    id: 'p4',
    name: 'İşlenmiş Yemek Artıkları',
    category: 'prohibited',
    goes_to_soil: false,
    never_soil_warning: 'Tuz ve baharat topraktaki canlıları öldürür.',
    icon: 'food'
  },
  {
    id: 'p5',
    name: 'Kedi Kumu / Dışkı',
    category: 'prohibited',
    goes_to_soil: false,
    never_soil_warning: 'Parazit ve patojen riski taşır, gübre olarak kullanılmaz.',
    icon: 'poop'
  },
  {
    id: 'p6',
    name: 'Kuşe Kağıt / Dergi',
    category: 'prohibited',
    goes_to_soil: false,
    never_soil_warning: 'Parlak kaplamalar ve mürekkep kimyasalları toprağa karışır.',
    icon: 'magazine'
  },
  {
    id: 'p7',
    name: 'Sentetik Çay Poşeti',
    category: 'prohibited',
    goes_to_soil: false,
    never_soil_warning: 'Plastik içerir, doğada çözünmez. İçini döküp poşeti çöpe atın.',
    icon: 'tea-bag'
  },
];

export const MOCK_STATIONS: Station[] = [
  { id: 's1', name: 'Merkez Atık Getirme', type: 'e-waste', lat: 41.0082, lng: 28.9784, verified: true, distance: '1.2 km' },
  { id: 's2', name: 'Mahalle Cam Kumbarası', type: 'glass', lat: 41.0150, lng: 28.9600, verified: true, distance: '0.3 km' },
  { id: 's3', name: 'Pil Toplama Noktası (Okul)', type: 'battery', lat: 41.0050, lng: 28.9850, verified: true, distance: '0.5 km' },
  { id: 's4', name: 'Market Plastik Ünitesi', type: 'plastic', lat: 41.0100, lng: 28.9650, verified: false, distance: '0.8 km' },
  { id: 's5', name: 'Tekstil Kumbarası', type: 'clothing', lat: 41.0200, lng: 28.9700, verified: true, distance: '0.9 km' },
  { id: 's6', name: 'İBB Atık Yönetim Merkezi', type: 'recycling_center', lat: 41.0250, lng: 28.9500, verified: true, distance: '2.5 km' },
  { id: 's7', name: 'Kadıköy Atık Getirme Merkezi', type: 'recycling_center', lat: 40.9900, lng: 29.0300, verified: true, distance: '5.1 km' },
];