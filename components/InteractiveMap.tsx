import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStations } from '../hooks/useData';
import { Station } from '../types';
import {
    MapPin, Navigation, Map as MapIcon, X,
    Battery, Wine, Cpu, Milk, Shirt, Recycle, ChevronRight, Factory, Search, Loader2, Crosshair
} from 'lucide-react';

// Leaflet Icon Fix
import iconMarker2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconMarker2x,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
});

const MAP_TILE_LAYER = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

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

// Recenter map helper component
const RecenterMap = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

// Fix for map tiles not loading - invalidate size after render
const MapInvalidator = () => {
    const map = useMap();
    useEffect(() => {
        // Small delay to allow container to fully render
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

const InteractiveMap: React.FC = () => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([41.0082, 28.9784]);
    const [filterType, setFilterType] = useState<string>('all');
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const { stations, loading } = useStations();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setMapCenter([latitude, longitude]);
                },
                (error) => console.error("Error obtaining location", error)
            );
        }
    }, []);

    const filteredStations = useMemo(() => {
        return filterType === 'all' ? stations : stations.filter(s => s.type === filterType);
    }, [filterType, stations]);

    const getStationStyle = (type: string) => STATION_CONFIG[type] || STATION_CONFIG['paper'];

    const createCustomIcon = (type: string) => {
        const config = STATION_CONFIG[type] || STATION_CONFIG['paper'];
        return L.divIcon({
            className: 'custom-map-marker',
            html: `<div class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border-2 ${config.border} text-xl">${config.emoji}</div>`,
            iconSize: [40, 48],
            iconAnchor: [20, 48],
        });
    };

    return (
        <div className="relative w-full h-[calc(100vh-64px)] bg-stone-100 flex overflow-hidden">
            <div className="absolute top-4 left-4 z-[1000] w-[calc(100%-32px)] md:w-96 flex flex-col gap-4 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md rounded-card shadow-card border border-border p-4 pointer-events-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-primary font-bold"><MapIcon size={20} /><span>Geri Dönüşüm Haritası</span></div>
                        {loading && <Loader2 className="animate-spin text-text-muted" size={16} />}
                    </div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
                        <input type="text" placeholder="İstasyon ara..." className="w-full pl-9 pr-3 py-2 rounded-input border border-border bg-background-base text-sm focus:ring-2 focus:ring-primary-soft outline-none" />
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                        <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-pill text-xs font-bold border ${filterType === 'all' ? 'bg-text-primary text-white' : 'bg-white text-text-secondary border-border'}`}>Tümü</button>
                        {Object.entries(STATION_CONFIG).map(([key, config]) => (
                            <button key={key} onClick={() => setFilterType(key)} className={`px-3 py-1.5 rounded-pill text-xs font-medium border flex items-center space-x-1 ${filterType === key ? `bg-white ${config.color} ${config.border}` : 'bg-white text-text-secondary border-border'}`}>
                                <span>{config.emoji}</span><span>{config.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                        <button onClick={() => userLocation && setMapCenter(userLocation)} disabled={!userLocation} className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-button text-sm font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 transition-colors">
                            <Crosshair size={16} /><span>Konumuma Git</span>
                        </button>
                    </div>
                </div>

                {selectedStation && (
                    <div className="bg-white rounded-card shadow-hover border border-border overflow-hidden pointer-events-auto animate-in slide-in-from-left-4 fade-in">
                        <div className={`p-4 flex justify-between items-start ${getStationStyle(selectedStation.type).bg}`}>
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 bg-white rounded-xl shadow-sm ${getStationStyle(selectedStation.type).color}`}>
                                    {React.createElement(getStationStyle(selectedStation.type).icon, { size: 20 })}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary text-lg">{selectedStation.name}</h3>
                                    <span className="text-xs font-bold uppercase text-text-secondary">{getStationStyle(selectedStation.type).label}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStation(null)} className="bg-white/50 hover:bg-white p-1 rounded-full"><X size={18} className="text-text-secondary" /></button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between text-sm text-text-secondary bg-background-base p-3 rounded-button border border-border">
                                <div className="flex items-center space-x-2"><Navigation size={16} className="text-primary" /><span className="font-semibold">{selectedStation.distance}</span><span>uzaklıkta</span></div>
                                {selectedStation.verified && <span className="bg-primary-soft text-primary-700 px-2 py-0.5 rounded text-xs font-bold">✓ Doğrulanmış</span>}
                            </div>
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.lat},${selectedStation.lng}`} target="_blank" rel="noopener noreferrer" className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-button font-bold shadow-soft flex items-center justify-center space-x-2">
                                <span>Yol Tarifi Al</span><ChevronRight size={18} />
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <MapContainer center={mapCenter} zoom={13} className="w-full h-full z-0" zoomControl={false}>
                <MapInvalidator />
                <RecenterMap center={mapCenter} />
                <TileLayer url={MAP_TILE_LAYER} attribution={MAP_ATTRIBUTION} />
                {userLocation && <Marker position={userLocation}><Popup><div className="text-center font-bold">📍 Buradasınız</div></Popup></Marker>}
                {filteredStations.map(station => (
                    <Marker key={station.id} position={[station.lat, station.lng]} icon={createCustomIcon(station.type)} eventHandlers={{ click: () => { setSelectedStation(station); setMapCenter([station.lat, station.lng]); } }} />
                ))}
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;
