import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStations } from '../hooks/useData';
import {
  MapPin, Navigation, Map as MapIcon, X,
  Battery, Wine, Cpu, Milk, Shirt, Recycle, ChevronRight, Factory, Search, Loader2
} from 'lucide-react';
import { Station } from '../types';

// Declare Leaflet global
declare const L: any;

import { MAP_TILE_LAYER, MAP_ATTRIBUTION } from '../constants';

const STATION_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string; border: string; emoji: string }> = {
  'recycling_center': { label: 'Atık Merkezi', icon: Factory, color: 'text-indigo-700', bg: 'bg-indigo-100', border: 'border-indigo-600', emoji: '🏭' },
  'battery': { label: 'Pil Kutusu', icon: Battery, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-500', emoji: '🔋' },
  'glass': { label: 'Cam Kumbarası', icon: Wine, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-500', emoji: '🍾' },
  'e-waste': { label: 'E-Atık', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-500', emoji: '🔌' },
  'plastic': { label: 'Plastik', icon: Milk, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-500', emoji: '🥤' },
  'paper': { label: 'Kağıt', icon: Recycle, color: 'text-stone-600', bg: 'bg-stone-100', border: 'border-stone-500', emoji: '📰' },
  'metal': { label: 'Metal', icon: Recycle, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-500', emoji: '🔩' },
  'oil': { label: 'Atık Yağ', icon: Recycle, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-500', emoji: '🛢️' },
  'clothing': { label: 'Tekstil', icon: Shirt, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-500', emoji: '👕' },
};

const MapMock: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const { stations, loading } = useStations();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Memoize filtered stations
  const filteredStations = useMemo(() => {
    return filterType === 'all'
      ? stations
      : stations.filter(s => s.type === filterType);
  }, [filterType, stations]);

  // Haritayı Başlat (Leaflet)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Zaten yüklendiyse tekrar yükleme

    // 1. Harita oluştur
    const map = L.map(mapContainerRef.current, {
      zoomControl: false
    }).setView([41.0120, 28.9750], 13);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // 2. CartoDB Katmanını Ekle (Hızlı & Temiz)
    L.tileLayer(MAP_TILE_LAYER, {
      attribution: MAP_ATTRIBUTION,
      maxZoom: 20
    }).addTo(map);

    // Fix: Force map to recalculate size after render to prevent grey areas
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Markerları Güncelle
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Eski markerları temizle
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Yeni markerları ekle
    filteredStations.forEach(station => {
      const config = STATION_CONFIG[station.type] || STATION_CONFIG['paper'];

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative group cursor-pointer transition-transform hover:scale-110">
            <div class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border-2 ${config.border} text-xl">
              ${config.emoji}
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-500/50"></div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48]
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .on('click', () => {
          setSelectedStation(station);
          mapInstanceRef.current.setView([station.lat, station.lng], 16, {
            animate: true,
            duration: 0.8
          });
        });

      markersRef.current.push(marker);
    });
  }, [filteredStations]);

  const getStationStyle = (type: string) => {
    return STATION_CONFIG[type] || STATION_CONFIG['paper'];
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-stone-100 flex flex-col md:flex-row overflow-hidden">

      {/* Sidebar Panel (Desktop: Left, Mobile: Bottom Sheet logic typically, but here simplified as absolute overlay or side) */}
      <div className="absolute top-4 left-4 z-[1000] w-[calc(100%-32px)] md:w-96 flex flex-col gap-4 pointer-events-none">

        {/* Search & Filter Header (Floating Card) */}
        <div className="bg-white/95 backdrop-blur-md rounded-card shadow-card border border-border p-4 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-primary font-bold">
              <MapIcon size={20} />
              <span>Geri Dönüşüm Haritası</span>
            </div>
            {loading && <Loader2 className="animate-spin text-text-muted" size={16} />}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="İstasyon ara..."
              className="w-full pl-9 pr-3 py-2 rounded-input border border-border bg-background-base text-sm focus:ring-2 focus:ring-primary-soft outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all border
                 ${filterType === 'all'
                  ? 'bg-text-primary text-white border-text-primary shadow-soft'
                  : 'bg-white text-text-secondary border-border hover:bg-background-subtle'}`}
            >
              Tümü
            </button>
            {Object.entries(STATION_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all flex items-center space-x-1 border
                  ${filterType === key
                    ? `bg-white ${config.color} ${config.border} shadow-sm ring-1 ring-${config.color}`
                    : 'bg-white text-text-secondary border-border hover:bg-background-subtle'}`}
              >
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Station Card (Floating) */}
        {selectedStation && (
          <div className="bg-white rounded-card shadow-hover border border-border overflow-hidden pointer-events-auto animate-in slide-in-from-left-4 fade-in duration-300">
            <div className={`p-4 flex justify-between items-start ${getStationStyle(selectedStation.type).bg}`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-white rounded-xl shadow-sm ${getStationStyle(selectedStation.type).color}`}>
                  {React.createElement(getStationStyle(selectedStation.type).icon, { size: 20 })}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-lg leading-tight">{selectedStation.name}</h3>
                  <span className="text-xs font-bold uppercase opacity-70 text-text-secondary tracking-wider">
                    {getStationStyle(selectedStation.type).label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="bg-white/50 hover:bg-white p-1 rounded-full transition-colors"
              >
                <X size={18} className="text-text-secondary" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between text-sm text-text-secondary bg-background-base p-3 rounded-button border border-border">
                <div className="flex items-center space-x-2">
                  <Navigation size={16} className="text-primary" />
                  <span className="font-semibold">{selectedStation.distance}</span>
                  <span>uzaklıkta</span>
                </div>
                {selectedStation.verified && (
                  <span className="bg-primary-soft text-primary-700 px-2 py-0.5 rounded text-xs font-bold flex items-center">
                    ✓ Doğrulanmış
                  </span>
                )}
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.lat},${selectedStation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-button font-bold shadow-soft transition-transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Yol Tarifi Al</span>
                <ChevronRight size={18} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-grow relative z-0">
        <div ref={mapContainerRef} className="w-full h-full bg-stone-100 z-0 outline-none" />
      </div>

    </div>
  );
};

export default MapMock;