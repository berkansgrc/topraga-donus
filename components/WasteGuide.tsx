import React, { useState } from 'react';
import { useWasteItems } from '../hooks/useData';
import {
  Search, AlertTriangle, CheckCircle, Ban, Leaf, Battery, Box, Archive,
  Coffee, Sprout, FileText, Bone, Droplets, Wind, Scissors, Layers, Info, Filter,
  Loader2, X
} from 'lucide-react';
import { WasteItem } from '../types';
import CompostAnimation from './CompostAnimation';
import CarbonCalculator from './CarbonCalculator';
import CompostHealthCheck from './CompostHealthCheck';
import { motion, AnimatePresence } from 'framer-motion';


const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'apple': return <div className="text-2xl">🍎</div>;
    case 'leaf': return <Leaf size={24} className="text-primary" />;
    case 'leaf-brown': return <Leaf size={24} className="text-secondary" />;
    case 'coffee': return <Coffee size={24} className="text-secondary-600" />;
    case 'grass': return <Sprout size={24} className="text-primary-600" />;
    case 'flower': return <div className="text-2xl">🥀</div>;
    case 'egg': return <div className="w-6 h-7 rounded-full border-2 border-stone-300 bg-white" />;
    case 'box': return <Box size={24} className="text-secondary" />;
    case 'wood': return <div className="text-2xl">🪵</div>;
    case 'nut': return <div className="text-2xl">🌰</div>;
    case 'citrus': return <div className="text-2xl">🍋</div>;
    case 'leaf-alert': return <Leaf size={24} className="text-orange-500" />;
    case 'onion': return <div className="text-2xl">🧅</div>;
    case 'bone': return <Bone size={24} className="text-text-muted" />;
    case 'milk': return <div className="text-2xl">🧀</div>;
    case 'oil': return <Droplets size={24} className="text-amber-500" />;
    case 'food': return <div className="text-2xl">🍕</div>;
    case 'poop': return <div className="text-2xl">💩</div>;
    case 'magazine': return <FileText size={24} className="text-purple-500" />;
    case 'tea-bag': return <div className="text-2xl">🍵</div>;
    default: return <Box size={24} />;
  }
};

// Detaylı açıklamalar
const DETAIL_DESCRIPTIONS: Record<string, string> = {
  // YEŞİLLER (Azot)
  "Sebze ve Meyve Kabukları": "Ayrışmayı hızlandırmak için mutlaka küçük parçalara bölerek eklemelisin. Üzerlerinde pestisit (tarım ilacı) kalıntısı olma riskine karşı yıkanmış olmaları toprağın sağlığı için kritiktir.",
  "Çay Posası": "Doğrudan dökebilirsin ancak poşet çay kullanıyorsan poşetin plastik içermediğinden emin olmalısın. Sentetik poşetler toprakta çözünmez.",
  "Kahve Telvesi": "Azot açısından çok zengindir. Toprağa eklemeden önce soğumasını beklemeli ve toprağın üzerine topaklanmayacak şekilde serpiştirmelisin.",
  "Taze Çim Kırpıntıları": "Kurumasını beklemeden eklenebilir ancak dikkat etmen gereken nokta ince tabakalar halinde eklemektir; kalın tabakalar hava akışını kesip kötü koku yapabilir.",
  "Solmuş Çiçekler": "Bahçendeki renkli atıkları eklerken bu çiçeklerin hastalıklı veya mantarlı olmadığından emin olmalısın, aksi halde hastalığı tüm toprağa yayabilirsin.",

  // KAHVERENGİLER (Karbon)
  "Yumurta Kabuğu": "Tam bir kalsiyum deposudur. Ancak etkili olması için mutlaka yıkanmalı, kurutulmalı ve un ufak edilene kadar ezilmelidir. Bütün haldeki kabuklar çok geç ayrışır.",
  "Kuru Yapraklar": "Nem dengesini korur. Daha hızlı toprak olması için ufalayarak eklemek en iyisidir.",
  "Karton ve Kağıt": "Geri dönüşümün kahramanıdır ama üzerinde boya, kaplama veya bant olmamalıdır. Parça parça yırtarak karbon dengesini sağlayabilirsin.",
  "Talaş": "Nem dengesini harika sağlar ancak mutlaka işlenmemiş ve verniksiz odunlardan elde edilmiş olmalıdır. Kimyasal içerikli talaşlar toprağa zehir saçar.",
  "Kuruyemiş Kabukları": "Toprakta hava boşlukları yaratır. Tuzsuz olmalarına dikkat etmeli ve çok sert oldukları için mutlaka kırarak eklemelisin.",

  // DİKKAT
  "Turunçgiller (Limon, Portakal)": "Çok asidiktir. Fazla miktarda eklemek toprağın pH dengesini bozar ve faydalı solucanların ölümüne neden olur. Küçük parçalar halinde ve az miktarda tercih edilmelidir.",
  "Ceviz Yaprağı": "İçeriğindeki \"Juglon\" maddesi doğal bir ot öldürücüdür. Diğer bitkilerin büyümesini engelleyebileceği için çok az miktarda kullanılmalıdır.",
  "Soğan ve Sarımsak": "Özellikle solucan kompostu (vermikompost) yapıyorsan, bu bitkilerin keskin kokusu ve asit yapısı solucanları rahatsız eder. Kabuklarını kullanmak daha güvenlidir.",

  // YASAKLILAR
  "Et, Kemik ve Süt Ürünleri": "Bu gıdalar hızla çürür ve çok kötü koku yayar. Ayrıca fare, sinek ve diğer zararlı haşereleri kompost alanına çeker. Ayrışmaları yıllar sürebilir.",
  "Yağlar (Kızartma vb.)": "Yağ, toprağın ve kompostun etrafını bir film tabakası gibi sararak oksijen akışını keser. Toprağı boğar ve ayrışma sürecini tamamen durdurur.",
  "İşlenmiş Yemek Artıkları": "İçerdikleri tuz ve baharatlar topraktaki mikroorganizmaları ve yararlı canlıları öldürür.",
  "Kedi Kumu ve Dışkı": "Evcil hayvan dışkıları ciddi parazit ve patojen riski taşır. Bu zararlılar bitkiler aracılığıyla insana geçebilir.",
  "Kuşe Kağıt ve Dergiler": "Parlak kaplamalar plastik içerir ve kullanılan mürekkeplerdeki ağır metaller toprağa karışarak besin zincirine girer.",
  "Sentetik Çay Poşeti": "Çoğu modern çay poşeti mikroplastik içerir. Bunlar doğada çözünmez, sadece küçülerek toprağı kirletir."
};


const WasteCard: React.FC<{
  item: WasteItem;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ item, isSelected, onToggle }) => {
  let badgeStyle = '';
  let borderStyle = '';
  const hasDetail = !!DETAIL_DESCRIPTIONS[item.name];

  switch (item.category) {
    case 'green':
      badgeStyle = 'bg-primary-soft text-primary-700';
      borderStyle = 'hover:border-primary/50';
      break;
    case 'brown':
      badgeStyle = 'bg-secondary-soft text-secondary-700';
      borderStyle = 'hover:border-secondary/50';
      break;
    case 'caution':
      badgeStyle = 'bg-orange-50 text-orange-700';
      borderStyle = 'hover:border-orange-200';
      break;
    case 'prohibited':
      badgeStyle = 'bg-red-50 text-status-error';
      borderStyle = 'hover:border-red-200';
      break;
  }

  return (
    <div
      onClick={hasDetail ? onToggle : undefined}
      className={`bg-background-surface rounded-card border shadow-card transition-all duration-300 group flex flex-col h-full relative overflow-hidden
        ${isSelected ? 'border-primary ring-2 ring-primary/20 scale-[1.02] z-10' : `border-border hover:shadow-hover ${borderStyle}`}
        ${hasDetail ? 'cursor-pointer' : ''}`}
    >
      <AnimatePresence mode="wait">
        {!isSelected ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="bg-background-base p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-6 h-6 object-cover" />
                ) : (
                  getIcon(item.icon)
                )}
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold ${badgeStyle}`}>
                {item.category === 'prohibited' && <Ban size={12} className="mr-1.5" />}
                {item.category === 'green' && <CheckCircle size={12} className="mr-1.5" />}
                {item.category === 'brown' && <Layers size={12} className="mr-1.5" />}
                {item.category === 'caution' && <AlertTriangle size={12} className="mr-1.5" />}

                {item.category === 'green' && 'Yeşil'}
                {item.category === 'brown' && 'Kahve'}
                {item.category === 'caution' && 'Dikkat'}
                {item.category === 'prohibited' && 'Yasak'}
              </span>
            </div>

            <h3 className="font-bold text-lg text-text-primary mb-2 group-hover:text-primary transition-colors">{item.name}</h3>

            {/* Content */}
            <div className="space-y-3 flex-grow">
              {item.prep_steps && (
                <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                  <span className="font-semibold text-text-secondary">Hazırlık:</span> {item.prep_steps}
                </p>
              )}

              {item.soil_method && (
                <p className="text-sm text-text-secondary font-medium bg-background-subtle p-2 rounded-lg inline-block">
                  💡 {item.soil_method}
                </p>
              )}

              {item.never_soil_warning && (
                <div className="flex items-start space-x-2 text-xs text-status-error bg-red-50 p-2.5 rounded-lg">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{item.never_soil_warning}</span>
                </div>
              )}
            </div>

            {/* Alt bilgi ipucu */}
            {hasDetail && (
              <div className="mt-4 pt-3 border-t border-border flex items-center text-xs text-primary font-medium">
                <Info size={14} className="mr-1" />
                Detay için tıkla
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-5 flex flex-col h-full bg-background-base/50"
          >
            <div className="flex items-start justify-between mb-3 border-b border-border/50 pb-2">
              <h3 className="font-bold text-lg text-primary">{item.name} Detayı</h3>
              <button className="text-text-muted hover:text-text-primary bg-white rounded-full p-1 shadow-sm">
                <X size={16} />
              </button>
            </div>

            <div className="flex-grow space-y-3 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '300px' }}>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                {DETAIL_DESCRIPTIONS[item.name]}
              </p>

              {item.prep_steps && (
                <div className="bg-white p-3 rounded-lg border border-border shadow-sm">
                  <span className="text-xs font-bold text-text-primary block mb-1">Hazırlık</span>
                  <p className="text-xs text-text-muted">{item.prep_steps}</p>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 text-center">
              <span className="text-xs text-primary font-semibold flex items-center justify-center cursor-pointer hover:underline">
                Kapatmak için tıkla
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WasteGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'green' | 'brown' | 'prohibited'>('all');
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  // Use the new hook instead of static constant
  const { items, loading } = useWasteItems();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'prohibited') return matchesSearch && item.category === 'prohibited';
    if (activeTab === 'green') return matchesSearch && item.category === 'green';
    if (activeTab === 'brown') return matchesSearch && item.category === 'brown';
    return matchesSearch;
  });

  const tabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'green', label: 'Yeşiller (Azot)' },
    { id: 'brown', label: 'Kahverengiler (Karbon)' },
    { id: 'prohibited', label: 'Yasaklılar' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* Header Section */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-text-primary">Evsel Atık Rehberi</h2>
        <p className="text-lg text-text-secondary">
          Mutfak çöpünüzü "siyah altına" dönüştürün. Sağlıklı bir toprak için denge ve bilgi şarttır.
        </p>
      </div>

      {/* NEW: Compost Animation (Moved here) */}
      <div className="mb-16">
        <CompostAnimation />
      </div>

      {/* Carbon Calculator & Health Check - Side by Side */}
      <div className="mb-16 grid md:grid-cols-2 gap-6">
        <CarbonCalculator compact />
        <CompostHealthCheck />
      </div>

      {/* Educational Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Green Card */}
        <div className="bg-primary-soft/50 border border-primary-soft rounded-card p-6 flex items-start space-x-4">
          <div className="bg-white p-3 rounded-full text-primary shadow-sm shrink-0">
            <Leaf size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary-700 text-lg">Yeşiller (Azot)</h3>
            <p className="text-sm text-primary-700/80 mt-1 leading-relaxed">
              Sebze, meyve, çay. Bozunmayı başlatır.
              <span className="block font-semibold mt-1">Oran: 1 Birim</span>
            </p>
          </div>
        </div>

        {/* Brown Card */}
        <div className="bg-secondary-soft/50 border border-secondary-soft rounded-card p-6 flex items-start space-x-4">
          <div className="bg-white p-3 rounded-full text-secondary shadow-sm shrink-0">
            <Layers size={24} />
          </div>
          <div>
            <h3 className="font-bold text-secondary-700 text-lg">Kahverengiler</h3>
            <p className="text-sm text-secondary-700/80 mt-1 leading-relaxed">
              Kuru yaprak, kağıt. Kokuyu engeller.
              <span className="block font-semibold mt-1">Oran: 2 Birim</span>
            </p>
          </div>
        </div>

        {/* Rules Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-card p-6 flex items-start space-x-4">
          <div className="bg-white p-3 rounded-full text-status-info shadow-sm shrink-0">
            <Wind size={24} />
          </div>
          <div>
            <h3 className="font-bold text-blue-800 text-lg">4 Altın Kural</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm text-blue-700/80">
              <span className="flex items-center">✂️ Küçült</span>
              <span className="flex items-center">🥣 Karıştır</span>
              <span className="flex items-center">💧 Nemlendir</span>
              <span className="flex items-center">💨 Havalandır</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sticky top-20 z-30 bg-background-base/95 backdrop-blur py-4 rounded-xl -mx-2 px-2 transition-all">

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-pill text-sm font-semibold transition-all duration-200 border
                ${activeTab === tab.id
                  ? 'bg-text-primary text-white border-text-primary shadow-soft'
                  : 'bg-white text-text-secondary border-border hover:bg-background-subtle'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-3 top-3 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Elma, pil, karton..."
            className="w-full pl-10 pr-4 py-2.5 rounded-input border border-border bg-white focus:ring-2 focus:ring-primary-soft focus:border-primary transition-all outline-none text-sm text-text-primary placeholder:text-text-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-primary">
          <Loader2 className="animate-spin" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 align-top">
          {filteredItems.map(item => (
            <WasteCard
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onToggle={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
            />
          ))}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-background-subtle rounded-card border border-dashed border-border text-center">
          <div className="bg-white p-4 rounded-full shadow-soft mb-4">
            <Filter size={32} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Sonuç Bulunamadı</h3>
          <p className="text-text-muted max-w-xs mx-auto mt-2">
            Aradığınız kriterlere uygun bir atık türü rehberimizde yok. Asistan'a sormayı deneyin.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setActiveTab('all') }}
            className="mt-6 text-primary font-bold text-sm hover:underline"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}

      {/* Oyunlar CTA Bölümü */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 relative overflow-hidden rounded-card bg-gradient-to-br from-primary via-primary-600 to-secondary p-8 md:p-12 text-center"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/4 text-6xl opacity-20 animate-bounce">🌱</div>
        <div className="absolute top-1/4 right-1/4 text-4xl opacity-20 animate-pulse">🍃</div>

        <div className="relative z-10">
          <span className="inline-block text-6xl mb-4 animate-bounce">🎮</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Şimdi Eğlenerek Öğrenme Zamanı!
          </h2>
          <p className="text-lg text-white/90 max-w-xl mx-auto mb-8">
            Öğrendiklerini eğlenceli oyunlarla pekiştir! Atık sınıflandırma, bilgi yarışması ve daha fazlası seni bekliyor.
          </p>
          <a
            href="/games"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-bold text-lg rounded-button shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <span className="text-2xl">🕹️</span>
            Oyunlara Git
            <span className="text-2xl">→</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default WasteGuide;