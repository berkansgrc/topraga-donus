import React, { useEffect, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';
import { MAP_TILE_LAYER, MAP_ATTRIBUTION } from '../constants';

// Declare Leaflet global
declare const L: any;

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onSelect: (lat: number, lng: number) => void;
    onClose: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ initialLat, initialLng, onSelect, onClose }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    // Default to Istanbul center if no initial coords
    const [selectedLat, setSelectedLat] = useState<number>(initialLat || 41.0082);
    const [selectedLng, setSelectedLng] = useState<number>(initialLng || 28.9784);

    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        const startLat = initialLat || 41.0082;
        const startLng = initialLng || 28.9784;

        // Initialize Map
        const map = L.map(mapContainerRef.current).setView([startLat, startLng], 13);

        // Add Tile Layer
        L.tileLayer(MAP_TILE_LAYER, {
            attribution: MAP_ATTRIBUTION,
            maxZoom: 20
        }).addTo(map);

        // Fix: Force map to recalculate size to prevent grey areas in modal
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Add initial marker
        const marker = L.marker([startLat, startLng], { draggable: true }).addTo(map);
        markerRef.current = marker;

        // Update state on drag end
        marker.on('dragend', function (event: any) {
            const position = event.target.getLatLng();
            setSelectedLat(position.lat);
            setSelectedLng(position.lng);
        });

        // Move marker on map click
        map.on('click', function (e: any) {
            marker.setLatLng(e.latlng);
            setSelectedLat(e.latlng.lat);
            setSelectedLng(e.latlng.lng);
        });

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

    const handleConfirm = () => {
        onSelect(selectedLat, selectedLng);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[80vh] animate-in zoom-in duration-200">

                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Haritadan Konum Seç</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow relative bg-gray-100">
                    <div ref={mapContainerRef} className="absolute inset-0 z-0" />

                    {/* Coordinates Display Overlay */}
                    <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-sm font-mono text-gray-700 border border-gray-200">
                        {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-white flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 flex items-center transition-all active:scale-95"
                    >
                        <Check size={20} className="mr-2" /> Konumu Onayla
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LocationPicker;
