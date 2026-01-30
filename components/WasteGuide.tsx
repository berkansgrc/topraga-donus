import React, { useState } from 'react';
import { useWasteItems } from '../hooks/useData';
import { 
  Search, AlertTriangle, CheckCircle, Ban, Leaf, Battery, Box, Archive, 
  Coffee, Sprout, FileText, Bone, Droplets, Wind, Scissors, Layers, Info, Filter,
  Loader2
} from 'lucide-react';
import { WasteItem } from '../types';

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

const WasteCard: React.FC<{ item: WasteItem }> = ({ item }) => {
  let badgeStyle = '';
  let borderStyle = '';

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
    <div className={`bg-background-surface rounded-card border border-border shadow-card hover:shadow-hover transition-all duration-300 p-5 group flex flex-col h-full ${borderStyle}`}>
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
           
           {item.category === 'green' && 'Yeşil (Azot)'}
           {item.category === 'brown' && 'Kahverengi (Karbon)'}
           {item.category === 'caution' && 'Dikkat'}
           {item.category === 'prohibited' && 'Toprağa Atılmaz'}
        </span>
      </div>

      <h3 className="font-bold text-lg text-text-primary mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
      
      {/* Content */}
      <div className="space-y-3 flex-grow">
        {item.prep_steps && (
            <p className="text-sm text-text-muted leading-relaxed">
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
    </div>
  );
};

const WasteGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'green' | 'brown' | 'prohibited'>('all');
  
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
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Evsel Atık Rehberi</h2>
        <p className="text-text-secondary text-lg">
           Mutfak çöpünüzü "siyah altına" dönüştürün. Sağlıklı bir toprak için denge ve bilgi şarttır.
        </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <WasteCard key={item.id} item={item} />
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
             onClick={() => {setSearchTerm(''); setActiveTab('all')}} 
             className="mt-6 text-primary font-bold text-sm hover:underline"
           >
             Filtreleri Temizle
           </button>
         </div>
      )}
    </div>
  );
};

export default WasteGuide;