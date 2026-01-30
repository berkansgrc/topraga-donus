export interface CompostStage {
  key: string;
  label: string;
  durationSec: number;
  concepts: string[];
  visuals: string[];
  description: string;
}

export const COMPOST_STAGES: CompostStage[] = [
  {
    key: 'collect',
    label: 'Toplama',
    durationSec: 6,
    concepts: ['ayrıştırma', 'doğru atıklar'],
    visuals: ['mutfak atıkları', 'kahverengi malzeme', 'kutuya giriş'],
    description: "Mutfak atıklarını (azot) ve kuru yaprakları (karbon) biriktiririz."
  },
  {
    key: 'layering',
    label: 'Katmanlama',
    durationSec: 8,
    concepts: ['karbon-azot dengesi'],
    visuals: ['yeşil/kahverengi katmanlar', 'oran göstergesi'],
    description: "Yeşil ve kahverengi malzemeleri lazanya gibi kat kat dizeriz."
  },
  {
    key: 'active',
    label: 'Aktif Ayrışma',
    durationSec: 14,
    concepts: ['mikroorganizma', 'ısı artışı', 'oksijen'],
    visuals: ['ısı artışı', 'kabarcıklar', 'mikrop hareketi'],
    description: "Mikroorganizmalar çalışmaya başlar, sıcaklık 60°C'ye kadar çıkabilir!"
  },
  {
    key: 'turning',
    label: 'Karıştırma',
    durationSec: 8,
    concepts: ['havalandırma', 'eşit dağılım'],
    visuals: ['karıştırma hareketi', 'oksijen girişi'],
    description: "Yığını karıştırarak havalandırırız, böylece mikroplar nefes alır."
  },
  {
    key: 'curing',
    label: 'Olgunlaşma',
    durationSec: 10,
    concepts: ['stabilizasyon', 'koku azalması'],
    visuals: ['renk koyulaşması', 'ısı düşüşü', 'toprak dokusu'],
    description: "Sıcaklık düşer, kompost dinlenir ve toprak kokusu almaya başlar."
  },
  {
    key: 'ready',
    label: 'Kullanıma Hazır',
    durationSec: 6,
    concepts: ['eleme', 'bitkide kullanım'],
    visuals: ['eleme', 'saksı', 'bitki'],
    description: "Siyah altın hazır! Artık bitkilerimizi besleyebiliriz."
  }
];
