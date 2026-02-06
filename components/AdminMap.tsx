import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStations } from '../hooks/useData';
import { Factory, Battery, Wine, Cpu, Milk, Shirt, Recycle } from 'lucide-react';

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
const MAP_ATTRIBUTION = '&copy; OpenStreetMap &copy; CARTO';

const STATION_CONFIG: Record<string, { label: string; emoji: string; border: string }> = {
    'recycling_center': { label: 'Atık Merkezi', emoji: '🏭', border: 'border-indigo-600' },
    'battery': { label: 'Pil Kutusu', emoji: '🔋', border: 'border-red-500' },
    'glass': { label: 'Cam Kumbarası', emoji: '🍾', border: 'border-emerald-500' },
    'e-waste': { label: 'E-Atık', emoji: '🔌', border: 'border-blue-500' },
    'plastic': { label: 'Plastik', emoji: '🥤', border: 'border-yellow-500' },
    'paper': { label: 'Kağıt', emoji: '📰', border: 'border-stone-500' },
    'metal': { label: 'Metal', emoji: '🔩', border: 'border-orange-500' },
    'oil': { label: 'Atık Yağ', emoji: '🛢️', border: 'border-amber-500' },
    'clothing': { label: 'Tekstil', emoji: '👕', border: 'border-purple-500' },
};

// Fix for map tiles not loading
const MapInvalidator = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

const AdminMap: React.FC = () => {
    const { stations, loading } = useStations();
    const [mapCenter] = useState<[number, number]>([41.0082, 28.9784]);

    const createCustomIcon = (type: string) => {
        const config = STATION_CONFIG[type] || STATION_CONFIG['paper'];
        return L.divIcon({
            className: 'custom-map-marker',
            html: `<div class="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border-2 ${config.border} text-lg">${config.emoji}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Harita verileri yükleniyor...</div>;

    return (
        <div className="w-full h-[600px] rounded-card overflow-hidden shadow-card border border-border mt-4">
            <MapContainer center={mapCenter} zoom={11} className="w-full h-full z-0">
                <MapInvalidator />
                <TileLayer url={MAP_TILE_LAYER} attribution={MAP_ATTRIBUTION} />
                {stations.map(station => (
                    <Marker key={station.id} position={[station.lat, station.lng]} icon={createCustomIcon(station.type)}>
                        <Popup>
                            <div className="font-sans">
                                <h3 className="font-bold text-sm mb-1">{station.name}</h3>
                                <p className="text-xs text-gray-600">{STATION_CONFIG[station.type]?.label || station.type}</p>
                                {station.verified && <span className="text-xs text-green-600 font-bold block mt-1">✓ Doğrulanmış</span>}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default AdminMap;
